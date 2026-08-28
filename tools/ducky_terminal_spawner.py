import subprocess
import os
import sys
import time
import json
import re
from pathlib import Path

def spawn_real_agent_terminal(project_name, prompt, agent="agy"):
    proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', project_name).lower().strip('-') or "zoth-project"
    
    # Target physical workspace folder inside public/workspaces so it is immediately reachable via HTTP at /workspaces/{slug}/
    repo_root = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio")
    ws_dir = repo_root / "core-app" / "public" / "workspaces" / proj_slug
    ws_dir.mkdir(parents=True, exist_ok=True)
    (ws_dir / "assets").mkdir(parents=True, exist_ok=True)

    session_name = f"zoth_{proj_slug}"

    # Kill old tmux session if exists with same name
    subprocess.run(["tmux", "kill-session", "-t", session_name], capture_output=True)

    # 1. Create a tmux session located inside the project folder
    subprocess.run(["tmux", "new-session", "-d", "-s", session_name, "-c", str(ws_dir)], check=True)

    # Formulate explicit task instruction for autonomous execution
    task_directive = (
        f"You are an autonomous senior web engineer building a website in this directory. "
        f"User prompt: '{prompt}'. "
        f"Build a complete, high-quality, production-ready website with index.html, styled with Tailwind CSS, custom assets, and responsive navigation. Write all files directly to this directory now."
    )

    # 2. Launch agent with non-interactive prompt flag so it immediately starts executing
    if agent == "grok":
        cmd_str = f'/home/neo/.local/bin/grok -p "{task_directive}" --always-approve --no-auto-update'
    elif agent == "hermes":
        cmd_str = f'/home/neo/.local/bin/hermes -z "{task_directive}" --yolo'
    elif agent == "codex":
        cmd_str = f'/usr/bin/codex exec --full-auto "{task_directive}"'
    else:
        cmd_str = f'/home/neo/.local/bin/agy -p "{task_directive}" --dangerously-skip-permissions'

    subprocess.run(["tmux", "send-keys", "-t", session_name, cmd_str, "Enter"])

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
        "session": session_name,
        "slug": proj_slug,
        "workspace": str(ws_dir),
        "previewUrl": f"/workspaces/{proj_slug}/index.html",
        "agent": agent,
        "prompt": prompt
    }

def send_terminal_feedback(session_name, feedback_text):
    escaped = feedback_text.replace('"', '\"').replace("'", "'\''")
    subprocess.run(["tmux", "send-keys", "-t", session_name, escaped, "Enter"])
    return {"status": "ok", "session": session_name, "feedback": feedback_text}

def get_terminal_screen(session_name):
    res = subprocess.run(["tmux", "capture-pane", "-pt", session_name], capture_output=True, text=True)
    # Check if files have been created in directory
    repo_root = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio")
    proj_slug = session_name.replace("zoth_", "")
    ws_dir = repo_root / "core-app" / "public" / "workspaces" / proj_slug
    files = [f.name for f in ws_dir.glob("*") if f.is_file()] if ws_dir.exists() else []
    
    return {
        "screen": res.stdout,
        "files": files,
        "hasIndex": (ws_dir / "index.html").exists() if ws_dir.exists() else False,
        "previewUrl": f"/workspaces/{proj_slug}/index.html"
    }

def list_workspace_files(session_name):
    proj_slug = session_name.replace("zoth_", "")
    repo_root = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio")
    ws_dir = repo_root / "core-app" / "public" / "workspaces" / proj_slug
    if not ws_dir.exists():
        return []
    return [f.name for f in ws_dir.glob("*") if f.is_file()]
