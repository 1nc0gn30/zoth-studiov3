import subprocess
import os
import sys
import time
import json
import re
from pathlib import Path

def spawn_real_agent_terminal(project_name, prompt, agent="agy"):
    proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', project_name).lower().strip('-') or "zoth-project"
    
    # Target physical workspace folder
    ws_dir = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/tools/null ai agent tools/workspaces") / proj_slug
    ws_dir.mkdir(parents=True, exist_ok=True)
    (ws_dir / "assets").mkdir(parents=True, exist_ok=True)

    session_name = f"zoth_{proj_slug}"

    # Kill old tmux session if exists with same name
    subprocess.run(["tmux", "kill-session", "-t", session_name], capture_output=True)

    # 1. Create a tmux session located inside the project folder
    subprocess.run(["tmux", "new-session", "-d", "-s", session_name, "-c", str(ws_dir)], check=True)

    # 2. DuckyScript-style Keystroke Injection:
    agent_cmd = "/home/neo/.local/bin/agy" if agent != "grok" else "/home/neo/.local/bin/grok"
    subprocess.run(["tmux", "send-keys", "-t", session_name, agent_cmd, "Enter"])
    
    # Wait for CLI banner to fully mount (3.5s)
    time.sleep(3.5)

    # Type the actual user prompt directly into the interactive agent prompt box
    escaped_prompt = prompt.replace("'", "\'")
    subprocess.run(["tmux", "send-keys", "-t", session_name, f"Build a complete, bespoke website from scratch in this directory for: {escaped_prompt}. Write index.html and all assets.", "Enter"])

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
                "-T", f"Zoth Studio — {proj_slug} (@{agent})",
                "-e", f"tmux attach-session -t {session_name}"
            ], env=env, cwd=str(ws_dir))
        except Exception as e:
            print(f"[GUI Terminal Launch Note]: {e}")

    return {
        "status": "ok",
        "session": session_name,
        "workspace": str(ws_dir),
        "agent": agent,
        "prompt": prompt
    }

def send_terminal_feedback(session_name, feedback_text):
    escaped = feedback_text.replace("'", "\'")
    subprocess.run(["tmux", "send-keys", "-t", session_name, escaped, "Enter"])
    return {"status": "ok", "session": session_name, "feedback": feedback_text}

def get_terminal_screen(session_name):
    res = subprocess.run(["tmux", "capture-pane", "-pt", session_name], capture_output=True, text=True)
    return res.stdout

if __name__ == "__main__":
    p_name = sys.argv[1] if len(sys.argv) > 1 else "neals-wheels-live"
    p_prompt = sys.argv[2] if len(sys.argv) > 2 else "A website for a skate shop called Neal's Wheels"
    res = spawn_real_agent_terminal(p_name, p_prompt)
    print(json.dumps(res, indent=2))
