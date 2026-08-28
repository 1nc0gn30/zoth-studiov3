import subprocess
import os
import sys
import time
import json
import re
import threading
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio")
REGISTRY_FILE = REPO_ROOT / "core-app" / "public" / "workspaces" / "active_sessions.json"

def _get_registry():
    if REGISTRY_FILE.exists():
        try:
            return json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

def _save_registry(reg):
    try:
        REGISTRY_FILE.parent.mkdir(parents=True, exist_ok=True)
        REGISTRY_FILE.write_text(json.dumps(reg, indent=2), encoding="utf-8")
    except Exception as e:
        print(f"[Registry Error]: {e}")

def spawn_real_agent_terminal(project_name, prompt, agent="agy"):
    proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', project_name).lower().strip('-') or "zoth-project"
    
    # Target physical workspace folder inside public/workspaces so it is immediately reachable via HTTP at /workspaces/{slug}/
    ws_dir = REPO_ROOT / "core-app" / "public" / "workspaces" / proj_slug
    ws_dir.mkdir(parents=True, exist_ok=True)
    (ws_dir / "assets").mkdir(parents=True, exist_ok=True)

    session_name = f"zoth_{proj_slug}"

    # Kill old tmux session if exists with same name
    subprocess.run(["tmux", "kill-session", "-t", session_name], capture_output=True)

    # 1. Create a tmux session located inside the project folder
    subprocess.run(["tmux", "new-session", "-d", "-s", session_name, "-c", str(ws_dir)], check=True)

    # Record in persistent active_sessions registry
    registry = _get_registry()
    session_info = {
        "session": session_name,
        "slug": proj_slug,
        "workspace": str(ws_dir),
        "previewUrl": f"/workspaces/{proj_slug}/index.html",
        "agent": agent,
        "prompt": prompt,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "lastActive": datetime.now(timezone.utc).isoformat(),
        "status": "running"
    }
    registry[session_name] = session_info
    _save_registry(registry)

    # Also save manifest inside workspace folder
    manifest_file = ws_dir / "zoth.session.json"
    manifest_file.write_text(json.dumps(session_info, indent=2), encoding="utf-8")

    # 2. Exact DuckyScript Execution Thread:
    # - Run "agy" and press Enter to initiate
    # - Wait 2.5 seconds, press Enter to trust folder
    # - Wait 2.0 seconds, type the prompt, press Enter, and wait for response
    def _run_duckyscript_sequence():
        # Step 1: Type 'agy'
        subprocess.run(["tmux", "send-keys", "-t", session_name, "agy", "Enter"])
        time.sleep(2.5)

        # Step 2: Press Enter to trust folder
        subprocess.run(["tmux", "send-keys", "-t", session_name, "Enter"])
        time.sleep(2.0)

        # Step 3: Type the raw prompt with -l (literal)
        clean_prompt = prompt.strip()
        subprocess.run(["tmux", "send-keys", "-l", "-t", session_name, clean_prompt])
        time.sleep(0.4)

        # Step 4: Press Enter and let agent work
        subprocess.run(["tmux", "send-keys", "-t", session_name, "Enter"])

    threading.Thread(target=_run_duckyscript_sequence, daemon=True).start()

    # 3. Launch an actual visible GUI desktop terminal window (konsole / xterm) attached to the live session!
    env = os.environ.copy()
    if "DISPLAY" not in env or not env["DISPLAY"]:
        env["DISPLAY"] = ":0"

    try:
        subprocess.Popen([
            "konsole",
            "--new-tab",
            "-e", "tmux", "attach-session", "-t", session_name
        ], env=env, cwd=str(ws_dir))
    except Exception:
        try:
            subprocess.Popen([
                "xterm",
                "-T", f"WebGen Studio — {proj_slug} (@{agent})",
                "-e", f"tmux attach-session -t {session_name}"
            ], env=env, cwd=str(ws_dir))
        except Exception as e:
            print(f"[GUI Terminal Launch Note]: {e}")

    return {
        "status": "ok",
        **session_info
    }

def send_terminal_feedback(session_name, feedback_text):
    clean_text = feedback_text.strip()
    subprocess.run(["tmux", "send-keys", "-l", "-t", session_name, clean_text])
    time.sleep(0.3)
    subprocess.run(["tmux", "send-keys", "-t", session_name, "Enter"])

    # Update lastActive in registry
    registry = _get_registry()
    if session_name in registry:
        registry[session_name]["lastActive"] = datetime.now(timezone.utc).isoformat()
        registry[session_name]["lastFeedback"] = clean_text
        _save_registry(registry)

    return {"status": "ok", "session": session_name, "feedback": clean_text}

def get_terminal_screen(session_name):
    res = subprocess.run(["tmux", "capture-pane", "-pt", session_name, "-S", "-120"], capture_output=True, text=True)
    proj_slug = session_name.replace("zoth_", "")
    ws_dir = REPO_ROOT / "core-app" / "public" / "workspaces" / proj_slug
    files = [f.name for f in ws_dir.glob("*") if f.is_file()] if ws_dir.exists() else []
    
    # Check if tmux session is still alive
    check_sess = subprocess.run(["tmux", "has-session", "-t", session_name], capture_output=True)
    is_alive = (check_sess.returncode == 0)

    return {
        "screen": res.stdout,
        "files": files,
        "hasIndex": (ws_dir / "index.html").exists() if ws_dir.exists() else False,
        "previewUrl": f"/workspaces/{proj_slug}/index.html",
        "isAlive": is_alive
    }

def list_all_active_sessions():
    """Returns all active registered sessions + checks live tmux state"""
    registry = _get_registry()
    sessions = []
    
    # Get live tmux sessions
    res = subprocess.run(["tmux", "list-sessions", "-F", "#{session_name}"], capture_output=True, text=True)
    live_tmux = set(res.stdout.strip().splitlines()) if res.returncode == 0 else set()

    for sname, info in list(registry.items()):
        proj_slug = info.get("slug", sname.replace("zoth_", ""))
        ws_dir = REPO_ROOT / "core-app" / "public" / "workspaces" / proj_slug
        files = [f.name for f in ws_dir.glob("*") if f.is_file()] if ws_dir.exists() else []
        has_index = (ws_dir / "index.html").exists() if ws_dir.exists() else False
        is_live = sname in live_tmux

        sessions.append({
            "session": sname,
            "slug": proj_slug,
            "agent": info.get("agent", "agy"),
            "prompt": info.get("prompt", ""),
            "createdAt": info.get("createdAt", ""),
            "lastActive": info.get("lastActive", ""),
            "files": files,
            "hasIndex": has_index,
            "previewUrl": f"/workspaces/{proj_slug}/index.html",
            "isLive": is_live
        })

    # Sort most recent first
    sessions.sort(key=lambda x: x.get("lastActive", ""), reverse=True)
    return sessions

def list_workspace_files(session_name):
    proj_slug = session_name.replace("zoth_", "")
    ws_dir = REPO_ROOT / "core-app" / "public" / "workspaces" / proj_slug
    if not ws_dir.exists():
        return []
    return [f.name for f in ws_dir.glob("*") if f.is_file()]
