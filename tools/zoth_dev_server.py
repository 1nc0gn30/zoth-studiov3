#!/usr/bin/env python3
"""
Zoth Studio Dev Server with Live Visual Annotation & Memory API Gateway
Serves public/ on port 8088 and handles /api/annotations, /v1/memories, /v1/events with seamless fallback.
"""

from __future__ import annotations
import http.server
import json
import os
import socket
import subprocess
import sys
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT_DIR / "public"
DATA_DIR = PUBLIC_DIR / "data"
NOTES_FILE = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms/notes/zoth-annotations.json")
NOTES_MD = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms/notes/zoth-annotations.md")

MEMORIES_LOCAL_FILE = DATA_DIR / "memories.json"
MEMORIES_DAEMON_FILE = ROOT_DIR.parent / "memory-daemon" / "data" / "memories.json"

def is_port_open(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.3)
        return s.connect_ex((host, port)) == 0

def ensure_memory_daemon():
    """Ensure the memory daemon is running on port 8788."""
    if not is_port_open(8788):
        mem_daemon_script = ROOT_DIR.parent / "memory-daemon" / "memory-ui-server.py"
        if mem_daemon_script.exists():
            try:
                subprocess.Popen(
                    [sys.executable, str(mem_daemon_script), "8788"],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                print(f"[Zoth Dev Server] Spawned Zoth Memory Daemon (:8788)")
            except Exception as e:
                print(f"[Zoth Dev Server] Warning: Could not spawn memory daemon: {e}")

def load_notes() -> list[dict]:
    if NOTES_FILE.exists():
        try:
            return json.loads(NOTES_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []

def save_notes(notes: list[dict]):
    NOTES_FILE.parent.mkdir(parents=True, exist_ok=True)
    NOTES_FILE.write_text(json.dumps(notes, indent=2), encoding="utf-8")
    
    # Render markdown
    open_count = len([n for n in notes if n.get("status") == "open"])
    md_lines = [
        "# ⚡ ZOTH STUDIO — Live Visual Notes & Agent Task Board",
        f"**Last Updated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}  ",
        f"**Active Notes:** {open_count} open / {len(notes)} total\n",
        "| ID | Status | Category | Page | Selector | Tagged Agents | Note |",
        "|---|---|---|---|---|---|---|"
    ]
    for n in notes:
        st_icon = "🔴 Open" if n.get("status") == "open" else "✅ Resolved"
        agents_str = ", ".join(f"@{a}" for a in n.get("tagged_agents", [])) or "@azoth"
        sel = str(n.get("target", {}).get("selector") or n.get("selector") or "")[:35]
        md_lines.append(f"| `{n.get('id')}` | {st_icon} | {n.get('category', 'UI / Visual')} | {n.get('pathname', '/')} | `{sel}` | {agents_str} | {n.get('text')} |")
    
    NOTES_MD.write_text("\n".join(md_lines), encoding="utf-8")

def load_local_memories() -> list[dict]:
    for candidate in [MEMORIES_LOCAL_FILE, MEMORIES_DAEMON_FILE]:
        if candidate.exists():
            try:
                return json.loads(candidate.read_text(encoding="utf-8"))
            except Exception:
                pass
    return []

class ZothRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def _send_json(self, data, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        # 1. Visual Annotations API
        if self.path.startswith("/api/annotations"):
            notes = load_notes()
            return self._send_json({"annotations": notes, "total": len(notes)})

        # 2. Memories Gateway / Proxy / Fallback
        if self.path.startswith("/v1/memories") or self.path.startswith("/api/memories"):
            parsed = urlparse(self.path)
            qs = parse_qs(parsed.query)
            agent = (qs.get("agent_id") or [None])[0]
            q = (qs.get("q") or [None])[0]

            # Try proxying to 8788 if online
            if is_port_open(8788):
                try:
                    target_url = f"http://127.0.0.1:8788{self.path}"
                    req = urllib.request.Request(target_url, headers={"User-Agent": "ZothDevServer/1.0"})
                    with urllib.request.urlopen(req, timeout=1.5) as resp:
                        body = resp.read()
                        self.send_response(resp.status)
                        self.send_header("Content-Type", "application/json; charset=utf-8")
                        self.send_header("Access-Control-Allow-Origin", "*")
                        self.send_header("Content-Length", str(len(body)))
                        self.end_headers()
                        self.wfile.write(body)
                        return
                except Exception:
                    pass

            # Static / Local File Fallback
            mems = load_local_memories()
            if agent:
                mems = [m for m in mems if (m.get("agent_id") or "").lower() == agent.lower()]
            if q:
                ql = q.lower()
                mems = [m for m in mems if ql in (m.get("text") or "").lower() or ql in (m.get("category") or "").lower() or any(ql in str(t).lower() for t in m.get("tags", [])) or any(ql in str(top).lower() for t in m.get("topics", []))]
            return self._send_json(mems)

        # 3. Memory Log / Perspectives / Beat / Brain Proxy
        if any(self.path.startswith(p) for p in ["/v1/beat", "/v1/events/recent", "/v1/memories/recall", "/v1/brain"]):
            if is_port_open(8788):
                try:
                    target_url = f"http://127.0.0.1:8788{self.path}"
                    req = urllib.request.Request(target_url, headers={"User-Agent": "ZothDevServer/1.0"})
                    with urllib.request.urlopen(req, timeout=1.5) as resp:
                        body = resp.read()
                        self.send_response(resp.status)
                        self.send_header("Content-Type", "application/json; charset=utf-8")
                        self.send_header("Access-Control-Allow-Origin", "*")
                        self.send_header("Content-Length", str(len(body)))
                        self.end_headers()
                        self.wfile.write(body)
                        return
                except Exception:
                    pass
            return self._send_json([])

        # 4. SSE Stream endpoint proxy
        if self.path == "/v1/events":
            if is_port_open(8788):
                try:
                    target_url = "http://127.0.0.1:8788/v1/events"
                    req = urllib.request.Request(target_url)
                    with urllib.request.urlopen(req) as resp:
                        self.send_response(200)
                        self.send_header("Content-Type", "text/event-stream")
                        self.send_header("Cache-Control", "no-store")
                        self.send_header("Access-Control-Allow-Origin", "*")
                        self.end_headers()
                        while True:
                            chunk = resp.read(1024)
                            if not chunk:
                                break
                            self.wfile.write(chunk)
                            self.wfile.flush()
                        return
                except Exception:
                    pass
            # Dummy SSE heartbeat if daemon unavailable
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b": ping\n\n")
            self.wfile.flush()
            return

        super().do_GET()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw_data = self.rfile.read(length) if length > 0 else b"{}"

        # 1. Annotations Resolve
        if self.path.startswith("/api/annotations/resolve"):
            data = json.loads(raw_data.decode("utf-8")) if raw_data else {}
            target_id = data.get("id")
            resolved_by = data.get("resolved_by", "@user")
            
            notes = load_notes()
            for n in notes:
                if n.get("id") == target_id:
                    n["status"] = "resolved"
                    n["resolved_at"] = datetime.now(timezone.utc).isoformat()
                    n["resolved_by"] = resolved_by
            save_notes(notes)
            return self._send_json({"ok": True, "resolved_id": target_id})

        # 2. Annotations Save
        if self.path.startswith("/api/annotations"):
            data = json.loads(raw_data.decode("utf-8")) if raw_data else {}
            notes = load_notes()
            if isinstance(data, dict) and "id" in data:
                existing_idx = next((i for i, n in enumerate(notes) if n.get("id") == data["id"]), None)
                if existing_idx is not None:
                    notes[existing_idx].update(data)
                else:
                    notes.append(data)
                save_notes(notes)
                print(f"[Annotator] Saved note {data.get('id')}: {data.get('text')}")

            return self._send_json({"ok": True, "saved": data.get("id")})

        # 3. Memory API POST proxy
        if self.path.startswith("/v1/"):
            if is_port_open(8788):
                try:
                    target_url = f"http://127.0.0.1:8788{self.path}"
                    req = urllib.request.Request(
                        target_url,
                        data=raw_data,
                        headers={"Content-Type": "application/json", "User-Agent": "ZothDevServer/1.0"},
                        method="POST"
                    )
                    with urllib.request.urlopen(req, timeout=3.0) as resp:
                        resp_body = resp.read()
                        self.send_response(resp.status)
                        self.send_header("Content-Type", "application/json; charset=utf-8")
                        self.send_header("Access-Control-Allow-Origin", "*")
                        self.send_header("Content-Length", str(len(resp_body)))
                        self.end_headers()
                        self.wfile.write(resp_body)
                        return
                except Exception as e:
                    print(f"[Zoth Dev Server] Memory proxy POST error: {e}")
            return self._send_json({"error": "Memory daemon offline", "status": "offline"}, 503)

        self.send_error(404, "Not Found")

def run(port: int = 8088, host: str = "0.0.0.0"):
    ensure_memory_daemon()
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    server_address = (host, port)
    httpd = http.server.ThreadingHTTPServer(server_address, ZothRequestHandler)
    print(f"⚡ Zoth Dev Server running at http://127.0.0.1:{port}/ (bound to {host}:{port})")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    run(port=port)
