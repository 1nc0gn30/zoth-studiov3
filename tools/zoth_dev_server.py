#!/usr/bin/env python3
"""
Zoth Studio Dev Server with Live Visual Annotation API
Serves public/ on port 8088 and handles /api/annotations POST/GET/DELETE.
"""

from __future__ import annotations
import http.server
import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT_DIR / "public"
NOTES_FILE = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms/notes/zoth-annotations.json")
NOTES_MD = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms/notes/zoth-annotations.md")

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

class ZothRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/annotations"):
            notes = load_notes()
            body = json.dumps({"annotations": notes, "total": len(notes)}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/annotations/resolve"):
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length).decode("utf-8")) if length > 0 else {}
            target_id = data.get("id")
            resolved_by = data.get("resolved_by", "@user")
            
            notes = load_notes()
            for n in notes:
                if n.get("id") == target_id:
                    n["status"] = "resolved"
                    n["resolved_at"] = datetime.now(timezone.utc).isoformat()
                    n["resolved_by"] = resolved_by
            save_notes(notes)
            
            body = json.dumps({"ok": True, "resolved_id": target_id}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path.startswith("/api/annotations"):
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length).decode("utf-8")) if length > 0 else {}
            
            notes = load_notes()
            if isinstance(data, dict) and "id" in data:
                existing_idx = next((i for i, n in enumerate(notes) if n.get("id") == data["id"]), None)
                if existing_idx is not None:
                    notes[existing_idx].update(data)
                else:
                    notes.append(data)
                save_notes(notes)
                print(f"[Annotator] Saved note {data.get('id')}: {data.get('text')}")

            body = json.dumps({"ok": True, "saved": data.get("id")}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_error(404, "Not Found")

def run(port: int = 8088, host: str = "127.0.0.1"):
    server_address = (host, port)
    httpd = http.server.ThreadingHTTPServer(server_address, ZothRequestHandler)
    print(f"Zoth Dev Server running at http://{host}:{port}/")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    run(port=port)
