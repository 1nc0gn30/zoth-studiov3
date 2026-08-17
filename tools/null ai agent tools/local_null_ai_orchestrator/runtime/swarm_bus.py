"""Shared Zoth swarm bus — same board Antigravity writes, read by Studio."""

from __future__ import annotations

import json
import os
import socket
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

STALE_SEC = 180

KNOWN = (
    {
        "id": "antigravity",
        "aliases": ("agy", "antigravity-cli"),
        "name": "Antigravity",
        "probe": "agy",
        "caps": "Google AGY · workspace writer",
        "seat": {"x": 26, "y": 42, "region": "Forge", "color": "#a78bfa"},
    },
    {
        "id": "grok",
        "aliases": ("studio", "zoth"),
        "name": "Grok / Studio",
        "probe": None,
        "caps": "Harness · generate · connectors",
        "seat": {"x": 58, "y": 48, "region": "Deck", "color": "#c4b5fd"},
    },
    {
        "id": "hermes",
        "aliases": ("hermes-agent",),
        "name": "Hermes",
        "probe": "hermes_cli.main",
        "caps": "Planner · tool loops",
        "seat": {"x": 70, "y": 30, "region": "Ridge", "color": "#a78bfa"},
    },
    {
        "id": "ollama",
        "aliases": (),
        "name": "Ollama",
        "probe": None,
        "caps": "Local models :11434",
        "seat": {"x": 46, "y": 70, "region": "Well", "color": "#c4b5fd"},
    },
)


def _seat_for(agent_id: str, index: int = 0) -> dict[str, Any]:
    known = next((s.get("seat") for s in KNOWN if s["id"] == agent_id), None)
    if known:
        return dict(known)
    h = sum(ord(c) for c in agent_id) or 1
    return {
        "x": 18 + (h * 17) % 64,
        "y": 22 + (h * 11 + index * 9) % 56,
        "region": "Field",
        "color": "#a78bfa",
    }


def comms_dir() -> Path:
    here = Path(__file__).resolve()
    for p in here.parents:
        cand = p / "agent-comms"
        if cand.is_dir():
            return cand
    return Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _read(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def _write(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _port(host: str, port: int) -> bool:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.25)
        ok = s.connect_ex((host, port)) == 0
        s.close()
        return ok
    except Exception:
        return False


def _pgrep(needle: str) -> bool:
    try:
        r = subprocess.run(
            ["pgrep", "-f", needle],
            capture_output=True,
            text=True,
            timeout=1,
        )
        return r.returncode == 0 and bool(r.stdout.strip())
    except Exception:
        return False


def _age(ts: str | None) -> float | None:
    if not ts:
        return None
    try:
        raw = ts.replace("Z", "+00:00")
        then = datetime.fromisoformat(raw)
        if then.tzinfo is None:
            then = then.replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - then).total_seconds()
    except Exception:
        return None


def heartbeat(agent: str, task: str, capabilities: str = "", status: str = "active") -> dict[str, Any]:
    root = comms_dir()
    path = root / "board" / "heartbeats.json"
    beats = _read(path, {})
    if not isinstance(beats, dict):
        beats = {}
    rec = {
        "agent": agent,
        "task": task,
        "status": status,
        "capabilities": capabilities,
        "last_seen": _now(),
        "pid": os.getpid(),
    }
    beats[agent] = rec
    _write(path, beats)
    return rec


def post(from_agent: str, to_agent: str, message: str, priority: str = "normal") -> dict[str, Any]:
    root = comms_dir()
    msg = {
        "id": f"{int(time.time() * 1000)}-{from_agent}",
        "from": from_agent,
        "to": to_agent or "all",
        "message": (message or "").strip(),
        "priority": priority or "normal",
        "timestamp": _now(),
    }
    path = root / "board" / "messages.json"
    items = _read(path, [])
    if not isinstance(items, list):
        items = []
    items.append(msg)
    _write(path, items[-200:])
    inbox = root / "inbox" / f"to-{msg['to']}"
    inbox.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    (inbox / f"{stamp}-{from_agent}.md").write_text(
        f"---\nfrom: {from_agent}\nto: {msg['to']}\npriority: {msg['priority']}\ncreated: {msg['timestamp']}\n---\n\n{msg['message']}\n",
        encoding="utf-8",
    )
    return msg


def claim(agent: str, project: str, note: str = "") -> dict[str, Any]:
    root = comms_dir()
    slug = project.replace("/", "_").strip() or "untitled"
    rec = {
        "project": project,
        "owner": agent,
        "status": "in_progress",
        "started_at": _now(),
        "note": note,
    }
    _write(root / "claims" / f"{slug}.json", rec)
    return rec


def release(agent: str, project: str) -> dict[str, Any]:
    root = comms_dir()
    slug = project.replace("/", "_").strip()
    path = root / "claims" / f"{slug}.json"
    rec = _read(path, {})
    if not isinstance(rec, dict):
        rec = {"project": project}
    rec["status"] = "released"
    rec["released_at"] = _now()
    rec["released_by"] = agent
    _write(path, rec)
    return rec


def _claims() -> list[dict[str, Any]]:
    root = comms_dir() / "claims"
    out: list[dict[str, Any]] = []
    if not root.is_dir():
        return out
    for f in sorted(root.glob("*.json")):
        rec = _read(f, None)
        if isinstance(rec, dict):
            out.append(rec)
    return out


def snapshot() -> dict[str, Any]:
    root = comms_dir()
    beats = _read(root / "board" / "heartbeats.json", {})
    if not isinstance(beats, dict):
        beats = {}
    messages = _read(root / "board" / "messages.json", [])
    if not isinstance(messages, list):
        messages = []

    live = {
        "antigravity": _pgrep("agy") or _port("127.0.0.1", 8088) or _port("127.0.0.1", 40759) or _port("127.0.0.1", 33093),
        "grok": True,
        "hermes": _pgrep("hermes_cli.main"),
        "ollama": _port("127.0.0.1", 11434),
    }

    agents = []
    seen = set()
    for spec in KNOWN:
        rec = beats.get(spec["id"]) or {}
        for alias in spec["aliases"]:
            if not rec and alias in beats:
                rec = beats[alias]
        age = _age(rec.get("last_seen"))
        process = live.get(spec["id"], False)
        if process:
            state = "live"
        elif age is not None and age < STALE_SEC:
            state = rec.get("status") or "active"
        elif rec:
            state = "stale"
        else:
            state = "offline"
        agents.append({
            "id": spec["id"],
            "name": spec["name"],
            "status": state,
            "task": rec.get("task") or ("Listening" if process else "—"),
            "capabilities": rec.get("capabilities") or spec["caps"],
            "last_seen": rec.get("last_seen"),
            "age_sec": None if age is None else int(age),
            "seat": dict(spec.get("seat") or _seat_for(spec["id"])),
        })
        seen.add(spec["id"])
        seen.update(spec["aliases"])

    for key, rec in beats.items():
        if key in seen:
            continue
        age = _age(rec.get("last_seen"))
        agents.append({
            "id": key,
            "name": rec.get("agent") or key,
            "status": "stale" if (age or 0) >= STALE_SEC else (rec.get("status") or "active"),
            "task": rec.get("task") or "—",
            "capabilities": rec.get("capabilities") or "",
            "last_seen": rec.get("last_seen"),
            "age_sec": None if age is None else int(age),
            "seat": _seat_for(key, len(agents)),
        })

    ports = [
        {"id": "studio", "label": "Studio :8484", "online": _port("127.0.0.1", 8484)},
        {"id": "hub", "label": "AGY hub :8088", "online": _port("127.0.0.1", 8088)},
        {"id": "ollama", "label": "Ollama :11434", "online": live["ollama"]},
        {"id": "agy", "label": "Antigravity", "online": live["antigravity"]},
        {"id": "hermes", "label": "Hermes", "online": live["hermes"]},
        {"id": "vault", "label": "Vault :8787", "online": _port("127.0.0.1", 8787)},
        {"id": "agy-bus", "label": "AGY bus :8989", "online": _port("127.0.0.1", 8989)},
    ]
    by_id = {a["id"]: a for a in agents}
    links = []
    seen_pairs = set()
    for msg in messages[-24:]:
        a, b = msg.get("from"), msg.get("to")
        if not a or not b or b == "all":
            continue
        pair = tuple(sorted((a, b)))
        if pair in seen_pairs or a not in by_id or b not in by_id:
            continue
        seen_pairs.add(pair)
        links.append({"from": a, "to": b})
    return {
        "timestamp": _now(),
        "comms": str(root),
        "agents": agents,
        "links": links,
        "messages": messages[-60:],
        "claims": _claims(),
        "ports": ports,
    }
