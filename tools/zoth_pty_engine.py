#!/usr/bin/env python3
"""
Zoth Universal PTY Terminal Engine (Cross-Platform / Sovereign Kernel)
Provides real interactive PTY sessions, bidirectional streaming, and DuckyScript injection.
Compatible with Linux (POSIX PTY), macOS (POSIX PTY), and Windows fallback.
"""

import os
import sys
import time
import json
import re
import threading
import queue
import select
from datetime import datetime, timezone
from pathlib import Path

# Platform check
IS_WINDOWS = sys.platform == "win32"
if not IS_WINDOWS:
    import pty
    import termios
    import fcntl
    import struct

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SESSIONS_FILE = REPO_ROOT / "core-app" / "public" / "workspaces" / "pty_sessions.json"

class PTYSession:
    def __init__(self, session_id: str, slug: str, cwd: str, shell_cmd: str = None):
        self.session_id = session_id
        self.slug = slug
        self.cwd = cwd
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.last_active = datetime.now(timezone.utc).isoformat()
        self.history = []
        self.max_history_bytes = 250000
        self.is_alive = True
        self.master_fd = None
        self.slave_fd = None
        self.pid = None
        self.output_queue = queue.Queue()
        self.lock = threading.Lock()

        # Workspace directory
        self.ws_path = Path(cwd)
        self.ws_path.mkdir(parents=True, exist_ok=True)
        (self.ws_path / "assets").mkdir(parents=True, exist_ok=True)

        self._start_process(shell_cmd)

    def _start_process(self, shell_cmd: str = None):
        if not shell_cmd:
            shell_cmd = os.environ.get("SHELL", "/bin/bash")

        if not IS_WINDOWS:
            # Fork POSIX PTY
            self.pid, self.master_fd = pty.fork()
            if self.pid == 0:
                # Child process
                os.chdir(self.cwd)
                env = os.environ.copy()
                env["TERM"] = "xterm-256color"
                env["COLORTERM"] = "truecolor"
                env["ZOTH_TERMINAL"] = "1"
                env["ZOTH_WORKSPACE"] = self.cwd
                # Local PATH
                local_bin = os.path.expanduser("~/.local/bin")
                if local_bin not in env.get("PATH", ""):
                    env["PATH"] = f"{local_bin}:{env.get('PATH', '')}"

                os.execvpe(shell_cmd, [shell_cmd], env)
            else:
                # Parent process: set non-blocking
                flags = fcntl.fcntl(self.master_fd, fcntl.F_GETFL)
                fcntl.fcntl(self.master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
                
                # Start reader thread
                t = threading.Thread(target=self._read_loop, daemon=True)
                t.start()
        else:
            # Windows fallback / mock
            self.is_alive = True

    def _read_loop(self):
        while self.is_alive and self.master_fd is not None:
            try:
                r, _, _ = select.select([self.master_fd], [], [], 0.05)
                if r:
                    data = os.read(self.master_fd, 4096)
                    if not data:
                        self.is_alive = False
                        break
                    text = data.decode("utf-8", errors="replace")
                    with self.lock:
                        self.history.append(text)
                        # Trim history buffer
                        total_len = sum(len(h) for h in self.history)
                        while total_len > self.max_history_bytes and len(self.history) > 1:
                            removed = self.history.pop(0)
                            total_len -= len(removed)
                        self.last_active = datetime.now(timezone.utc).isoformat()
                    self.output_queue.put(text)
            except (OSError, IOError):
                self.is_alive = False
                break
            except Exception:
                time.sleep(0.01)

    def write(self, data: str):
        if not self.is_alive or self.master_fd is None:
            return False
        try:
            os.write(self.master_fd, data.encode("utf-8"))
            self.last_active = datetime.now(timezone.utc).isoformat()
            return True
        except Exception:
            return False

    def resize(self, cols: int, rows: int):
        if not IS_WINDOWS and self.master_fd is not None:
            try:
                winsize = struct.pack("HHHH", rows, cols, 0, 0)
                fcntl.ioctl(self.master_fd, termios.TIOCSWINSZ, winsize)
            except Exception:
                pass

    def get_history(self) -> str:
        with self.lock:
            return "".join(self.history)

    def get_files(self) -> list:
        if not self.ws_path.exists():
            return []
        return [f.name for f in self.ws_path.glob("*") if f.is_file()]

    def has_index(self) -> bool:
        return (self.ws_path / "index.html").exists()

    def terminate(self):
        self.is_alive = False
        if not IS_WINDOWS and self.master_fd is not None:
            try:
                os.close(self.master_fd)
            except Exception:
                pass


class ZothPTYManager:
    def __init__(self):
        self.sessions: dict[str, PTYSession] = {}
        self.lock = threading.Lock()

    def get_or_create(self, slug: str, prompt: str = "") -> PTYSession:
        proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', slug).lower().strip('-') or "sovereign-app"
        session_id = f"zoth_pty_{proj_slug}"
        ws_dir = REPO_ROOT / "core-app" / "public" / "workspaces" / proj_slug

        with self.lock:
            if session_id in self.sessions and self.sessions[session_id].is_alive:
                return self.sessions[session_id]

            session = PTYSession(session_id, proj_slug, str(ws_dir))
            self.sessions[session_id] = session
            return session

    def inject_duckyscript_agent(self, slug: str, prompt: str, agent: str = "agy") -> PTYSession:
        session = self.get_or_create(slug, prompt)

        def _ducky_sequence():
            # Step 1: Type 'agy' and press Enter
            time.sleep(0.5)
            session.write(f"{agent}\n")
            
            # Step 2: Wait 2.5s for TUI and press Enter to trust folder
            time.sleep(2.5)
            session.write("\n")
            
            # Step 3: Wait 2.0s and type prompt cleanly
            time.sleep(2.0)
            session.write(prompt.strip() + "\n")

        threading.Thread(target=_ducky_sequence, daemon=True).start()
        return session

    def list_sessions(self) -> list:
        results = []
        with self.lock:
            for sid, sess in self.sessions.items():
                results.append({
                    "sessionId": sid,
                    "slug": sess.slug,
                    "workspace": sess.cwd,
                    "previewUrl": f"/workspaces/{sess.slug}/index.html",
                    "createdAt": sess.created_at,
                    "lastActive": sess.last_active,
                    "isAlive": sess.is_alive,
                    "hasIndex": sess.has_index(),
                    "files": sess.get_files()
                })
        results.sort(key=lambda x: x["lastActive"], reverse=True)
        return results


# Global singleton instance
pty_manager = ZothPTYManager()

if __name__ == "__main__":
    print("Testing Zoth PTY Engine...")
    s = pty_manager.get_or_create("test-pty")
    print(f"Created session: {s.session_id}, PID: {s.pid}")
    time.sleep(1)
    s.write("ls -la\n")
    time.sleep(1)
    print("Output received:")
    print(s.get_history())
    s.terminate()
    print("Test finished successfully!")
