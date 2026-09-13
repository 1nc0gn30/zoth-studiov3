#!/usr/bin/env python3
"""
⚡ ZOTH SOVEREIGN NETRUNNER MEMORY RUNTIME CONNECTOR
====================================================
Ties all sovereign tool executions, CLI runs, and code modifications directly to
the Netrunner Memory Daemon & Lucy Oracle on port 8788 (http://127.0.0.1:8788/v1/).

Features:
  - `record_tool_run()`: Automatically logs every tool invocation, arguments, outputs,
    exit codes, and execution timings to Netrunner Memory.
  - `record_code_change()`: Logs every file creation, edit, refactoring, and AST consensus
    synthesis with language tokens, line summaries, and author attribution.
  - `recall_memories()`: Recalls relevant prior tool runs, known bugs, or architectural
    invariants before executing tasks.
  - `trigger_memory()`: Rehearses and reinforces memory nodes in the biological graph.
  - Non-blocking asynchronous dispatch: Executes via background daemon threads so no tool
    or API endpoint ever stalls if the memory daemon is offline or restarting.
"""

from __future__ import annotations

import json
import os
import re
import sys
import threading
import time
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Default Memory Daemon Port & Endpoint
MEMORY_DAEMON_PORT = int(os.environ.get("ZOTH_MEMORY_PORT", "8788"))
MEMORY_DAEMON_HOST = os.environ.get("ZOTH_MEMORY_HOST", "127.0.0.1")
MEMORY_API_BASE = f"http://{MEMORY_DAEMON_HOST}:{MEMORY_DAEMON_PORT}/v1"

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _dispatch_http(method: str, endpoint: str, payload: dict[str, Any] | None = None, timeout: float = 5.0) -> dict[str, Any] | None:
    """Internal HTTP dispatcher with robust exception handling."""
    url = f"{MEMORY_API_BASE}{endpoint}" if endpoint.startswith("/") else f"{MEMORY_API_BASE}/{endpoint}"
    try:
        data_bytes = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "ZothNetrunnerConnector/3.0",
            "Accept": "application/json"
        }
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            resp_body = resp.read().decode("utf-8")
            if resp_body:
                try:
                    return json.loads(resp_body)
                except json.JSONDecodeError:
                    return {"raw": resp_body}
            return {"status": "ok", "code": resp.status}
    except Exception as exc:
        return None

def is_memory_daemon_online(timeout: float = 0.5) -> bool:
    """Checks if the Netrunner Memory daemon is live on port 8788."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        return s.connect_ex((MEMORY_DAEMON_HOST, MEMORY_DAEMON_PORT)) == 0

def encode_memory_async(memory_data: dict[str, Any]) -> None:
    """Dispatches a memory encoding request in a detached background thread."""
    def _worker():
        _dispatch_http("POST", "/memories/encode", memory_data, timeout=2.0)
    
    t = threading.Thread(target=_worker, daemon=True)
    t.start()

def format_human_digest(memory: dict[str, Any]) -> str:
    """Extracts a clean, narrative human digest from any memory object."""
    if not isinstance(memory, dict):
        return str(memory)
    if memory.get("human_digest"):
        return str(memory["human_digest"]).strip()
    if memory.get("summary"):
        return str(memory["summary"]).strip()
    if memory.get("story"):
        return str(memory["story"]).strip()
    text = memory.get("text", "")
    return text.strip() if text else "Engram details unavailable."

def format_ai_spectrum(memory: dict[str, Any], indent: int = 2) -> str:
    """Formats full spectrum lossless AI telemetry as structured JSON."""
    if not isinstance(memory, dict):
        return json.dumps({"raw": memory}, indent=indent)
    spectrum = memory.get("ai_spectrum")
    if spectrum is not None:
        if isinstance(spectrum, str):
            try:
                parsed = json.loads(spectrum)
                return json.dumps(parsed, indent=indent, ensure_ascii=False)
            except Exception:
                return spectrum
        return json.dumps(spectrum, indent=indent, ensure_ascii=False)
    raw = memory.get("raw_payload")
    if raw is not None:
        if isinstance(raw, str):
            try:
                parsed = json.loads(raw)
                return json.dumps(parsed, indent=indent, ensure_ascii=False)
            except Exception:
                return raw
        return json.dumps(raw, indent=indent, ensure_ascii=False)
    return json.dumps(memory, indent=indent, ensure_ascii=False)

def record_tool_run(
    tool_id: str,
    command: str = "",
    agent_id: str = "orchestrator",
    exit_code: int = 0,
    stdout: str = "",
    stderr: str = "",
    duration_ms: float = 0.0,
    metadata: dict[str, Any] | None = None,
    sync: bool = False
) -> dict[str, Any] | None:
    """
    Records a tool execution event into Netrunner Memory with two distinct versions:
      1. `human_digest`: Clean, natural language narrative for human reading.
      2. `ai_spectrum`: Full spectrum structured telemetry for LLMs and autonomous agents.
    
    Subsystem Mapping:
      - Exit code 0 -> Basal Ganglia (Procedural tool execution habit)
      - Exit code != 0 -> Amygdala (Execution error / bug salience)
    """
    meta = metadata or {}
    status_label = "SUCCESS" if exit_code == 0 else f"FAILED (Exit {exit_code})"
    clean_tool_id = str(tool_id).strip()
    clean_agent = str(agent_id).strip().lower()
    
    # ── 1. Human Digest Version ──
    status_sym = "✅" if exit_code == 0 else "❌"
    dur_str = f" in {duration_ms:.1f}ms" if duration_ms > 0 else ""
    cmd_snippet = (command[:80] + "...") if len(command) > 80 else command
    cmd_clause = f" Command: `{cmd_snippet}`." if cmd_snippet else ""
    
    if exit_code == 0:
        out_snippet = stdout.strip().splitlines()[0][:100] if stdout.strip() else "Completed successfully."
        human_digest = f"{status_sym} @{clean_agent} executed tool `{clean_tool_id}`{dur_str} with Exit 0.{cmd_clause} Result: {out_snippet}"
    else:
        err_snippet = stderr.strip().splitlines()[-1][:120] if stderr.strip() else (stdout.strip().splitlines()[-1][:120] if stdout.strip() else f"Process exited with code {exit_code}")
        human_digest = f"{status_sym} @{clean_agent} tool `{clean_tool_id}` failed (Exit {exit_code}){dur_str}.{cmd_clause} Error: {err_snippet}"

    # Legacy text & title
    text = human_digest
    title = f"🛠️ Tool Executed: {clean_tool_id} ({status_label})"
    
    tags = [
        "tool-execution",
        "zoth-tool",
        clean_tool_id.lower(),
        f"agent-{clean_agent}",
        "success" if exit_code == 0 else "error",
        f"exit-{exit_code}"
    ]
    if "category" in meta:
        tags.append(str(meta["category"]).lower())
    if "tags" in meta and isinstance(meta["tags"], list):
        tags.extend([str(t).lower() for t in meta["tags"]])

    seen_tags = set()
    dedup_tags = []
    for t in tags:
        if t not in seen_tags:
            seen_tags.add(t)
            dedup_tags.append(t)

    # ── 2. Full Spectrum AI Version ──
    ai_spectrum = {
        "spectrum_version": "3.0",
        "modality": "tool_execution",
        "telemetry": {
            "timestamp": _now(),
            "agent_id": clean_agent,
            "perspective": clean_agent,
            "subsystem": "basal_ganglia" if exit_code == 0 else "amygdala",
            "neuromodulators": {
                "dopamine": 0.85 if exit_code == 0 else 0.20,
                "acetylcholine": 0.90,
                "noradrenaline": 0.15 if exit_code == 0 else 0.85,
                "serotonin": 0.80 if exit_code == 0 else 0.30
            },
            "salience": 0.55 if exit_code == 0 else 0.88,
            "working_memory": True
        },
        "execution": {
            "tool_id": clean_tool_id,
            "command": command,
            "exit_code": exit_code,
            "status": status_label,
            "duration_ms": duration_ms,
            "stdout_preview": stdout[:1500] if stdout else "",
            "stderr_preview": stderr[:1500] if stderr else "",
            "stdout_bytes": len(stdout.encode("utf-8")) if stdout else 0,
            "stderr_bytes": len(stderr.encode("utf-8")) if stderr else 0
        },
        "context": {
            "tags": dedup_tags,
            "category": "building" if exit_code == 0 else "debug",
            "metadata": meta
        }
    }

    payload = {
        "text": text,
        "title": title,
        "human_digest": human_digest,
        "summary": human_digest,
        "story": human_digest,
        "agent_id": clean_agent,
        "perspective": clean_agent,
        "category": "building" if exit_code == 0 else "debug",
        "tags": dedup_tags,
        "raw_payload": ai_spectrum,
        "ai_spectrum": ai_spectrum,
        "working_memory": True,
        "salience": 0.88 if exit_code != 0 else 0.55
    }

    if sync:
        res = _dispatch_http("POST", "/memories/encode", payload, timeout=5.0)
        if isinstance(res, dict):
            res.setdefault("human_digest", human_digest)
            res.setdefault("ai_spectrum", ai_spectrum)
        return res
    else:
        encode_memory_async(payload)
        return {
            "status": "queued",
            "tool_id": clean_tool_id,
            "human_digest": human_digest,
            "ai_spectrum": ai_spectrum,
            "timestamp": _now()
        }

def record_code_change(
    file_path: str,
    action: str = "edit",
    agent_id: str = "azoth",
    diff_summary: str = "",
    lines_added: int = 0,
    lines_removed: int = 0,
    language: str | None = None,
    ast_verified: bool = True,
    metadata: dict[str, Any] | None = None,
    sync: bool = False
) -> dict[str, Any] | None:
    """
    Records a code modification into Netrunner Memory with two distinct versions:
      1. `human_digest`: Clean, natural language narrative for human reading.
      2. `ai_spectrum`: Full spectrum structured telemetry for LLMs and autonomous agents.
    
    Subsystem Mapping:
      - Neocortex (Semantic knowledge & architectural change)
      - dlPFC (Goal-directed code synthesis & refactoring)
    """
    meta = metadata or {}
    clean_path = str(file_path).strip()
    file_name = Path(clean_path).name
    file_ext = Path(clean_path).suffix.lstrip(".").lower() or (language or "code").lower()
    clean_agent = str(agent_id).strip().lower()
    
    # ── 1. Human Digest Version ──
    action_icon = "✨" if action in ["create", "new"] else ("🗑️" if action in ["delete", "remove"] else "📝")
    ast_str = "✓ AST Verified" if ast_verified else "⚡ Unverified AST"
    lines_str = f"+{lines_added}/-{lines_removed} lines" if (lines_added > 0 or lines_removed > 0) else "delta recorded"
    diff_clause = f": \"{diff_summary[:120]}\"" if diff_summary else ""
    
    human_digest = f"{action_icon} @{clean_agent} {action} `{file_name}` ({lines_str}, {file_ext}){diff_clause} ({ast_str})."

    text = human_digest
    title = f"📝 Code Modified: {file_name} ({action})"
    
    tags = [
        "code-change",
        "source-code",
        file_ext,
        file_name.lower(),
        f"action-{action.lower()}",
        f"agent-{clean_agent}",
        "ast-verified" if ast_verified else "ast-raw"
    ]
    if "project" in meta:
        tags.append(f"proj-{str(meta['project']).lower()}")
    if "tags" in meta and isinstance(meta["tags"], list):
        tags.extend([str(t).lower() for t in meta["tags"]])

    seen_tags = set()
    dedup_tags = []
    for t in tags:
        if t not in seen_tags:
            seen_tags.add(t)
            dedup_tags.append(t)

    # ── 2. Full Spectrum AI Version ──
    ai_spectrum = {
        "spectrum_version": "3.0",
        "modality": "code_modification",
        "telemetry": {
            "timestamp": _now(),
            "agent_id": clean_agent,
            "perspective": clean_agent,
            "subsystem": "neocortex",
            "neuromodulators": {
                "dopamine": 0.92,
                "acetylcholine": 0.95,
                "noradrenaline": 0.10,
                "serotonin": 0.85
            },
            "salience": 0.68,
            "working_memory": True
        },
        "code_metrics": {
            "file_path": clean_path,
            "file_name": file_name,
            "file_extension": file_ext,
            "action": action,
            "language": language or file_ext,
            "lines_added": lines_added,
            "lines_removed": lines_removed,
            "net_line_delta": lines_added - lines_removed,
            "diff_summary": diff_summary,
            "ast_verified": ast_verified,
            "ast_proof": {
                "syntax_valid": ast_verified,
                "status": "CONSENSUS_VERIFIED" if ast_verified else "RAW_UNCHECKED"
            }
        },
        "context": {
            "tags": dedup_tags,
            "category": "building",
            "metadata": meta
        }
    }

    payload = {
        "text": text,
        "title": title,
        "human_digest": human_digest,
        "summary": human_digest,
        "story": human_digest,
        "agent_id": clean_agent,
        "perspective": clean_agent,
        "category": "building",
        "tags": dedup_tags,
        "raw_payload": ai_spectrum,
        "ai_spectrum": ai_spectrum,
        "working_memory": True,
        "salience": 0.68
    }

    if sync:
        res = _dispatch_http("POST", "/memories/encode", payload, timeout=5.0)
        if isinstance(res, dict):
            res.setdefault("human_digest", human_digest)
            res.setdefault("ai_spectrum", ai_spectrum)
        return res
    else:
        encode_memory_async(payload)
        return {
            "status": "queued",
            "file": clean_path,
            "human_digest": human_digest,
            "ai_spectrum": ai_spectrum,
            "timestamp": _now()
        }

def recall_memories(
    topic_or_query: str = "",
    limit: int = 5,
    query: str | None = None,
    topic: str | None = None,
    mode: str = "dual"
) -> list[dict[str, Any]]:
    """
    Recalls memories matching a topic or search term from port 8788.
    
    Args:
      mode: 'dual' (both human & ai spectrum normalized), 'human' (digest prioritized), 'ai' (spectrum prioritized).
    """
    search_term = query or topic or topic_or_query or ""
    if not search_term:
        res = _dispatch_http("GET", f"/memories?limit={limit}", timeout=1.5)
    else:
        clean_q = urllib.parse.quote(str(search_term).strip())
        res = _dispatch_http("GET", f"/memories/recall?topic={clean_q}", timeout=1.5)
        if not res or not isinstance(res, list):
            res = _dispatch_http("GET", f"/memories?q={clean_q}", timeout=1.5)
    
    raw_list = []
    if isinstance(res, list):
        raw_list = res[:limit]
    elif isinstance(res, dict) and "memories" in res:
        raw_list = res["memories"][:limit]
    
    # Normalize dual representations
    normalized = []
    for m in raw_list:
        if not isinstance(m, dict):
            continue
        m_copy = dict(m)
        m_copy["human_digest"] = format_human_digest(m_copy)
        if "ai_spectrum" not in m_copy or m_copy["ai_spectrum"] is None:
            m_copy["ai_spectrum"] = m_copy.get("raw_payload") or m_copy.get("text", "")
        normalized.append(m_copy)
        
    return normalized

def trigger_memory(memory_id: str, agent_id: str = "orchestrator") -> dict[str, Any] | None:
    """Triggers and strengthens a memory node in the live memory graph."""
    clean_id = urllib.parse.quote(str(memory_id).strip())
    clean_agent = urllib.parse.quote(str(agent_id).strip())
    res = _dispatch_http("GET", f"/memories/{clean_id}/trigger?agent_id={clean_agent}", timeout=1.5)
    if not res:
        res = _dispatch_http("POST", f"/memories/{clean_id}/trigger?agent_id={clean_agent}", timeout=1.5)
    return res or {"status": "activated", "id": memory_id, "agent_id": agent_id}

def get_prompt_context(limit: int = 5, topic: str | None = None, mode: str = "dual") -> str:
    """
    Fetches formatted XML <memory_context> for injection into LLM prompts.
    Supports dual format with <human_digest> and <ai_spectrum> tags.
    """
    endpoint = f"/memories/prompt-context?limit={limit}&format=json"
    if topic:
        endpoint += f"&topic={urllib.parse.quote(topic)}"
    res = _dispatch_http("GET", endpoint, timeout=1.5)
    if isinstance(res, dict):
        if "xml" in res and res["xml"]:
            return res["xml"]
        if "prompt_context" in res and res["prompt_context"]:
            return res["prompt_context"]
        if "raw" in res and "<memory_context" in res["raw"]:
            return res["raw"]
        
    # Local fallback XML generator
    mems = recall_memories(topic_or_query=topic or "", limit=limit, mode=mode)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<memory_context version="3.0">',
        '  <cognitive_architecture model="Zoth Biomorphic Neural Knowledge Lattice"/>',
        '  <memories>'
    ]
    for m in mems:
        mid = m.get("id", "")[:12]
        agent = m.get("agent_id", "orchestrator")
        cat = m.get("category", "building")
        h_digest = format_human_digest(m)
        ai_spec = format_ai_spectrum(m, indent=2)
        lines.append(f'    <memory id="{mid}" agent="{agent}" category="{cat}">')
        lines.append(f'      <human_digest><![CDATA[{h_digest}]]></human_digest>')
        if mode in ("dual", "ai"):
            lines.append(f'      <ai_spectrum><![CDATA[{ai_spec}]]></ai_spectrum>')
        lines.append('    </memory>')
    lines.append('  </memories>')
    lines.append('</memory_context>')
    return "\n".join(lines)

def get_memory_digest(limit: int = 10) -> list[dict[str, Any]]:
    """Fetches human-digestible milestone summaries."""
    res = _dispatch_http("GET", f"/memories/digest?limit={limit}", timeout=1.5)
    if isinstance(res, list):
        return res[:limit]
    if isinstance(res, dict) and "digest" in res:
        return res["digest"][:limit]
    return []
