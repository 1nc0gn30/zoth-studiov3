"""Zoth Studio agent harness — conversations, model detect, chat, terminals."""

from __future__ import annotations

import json
import os
import re
import shutil
import socket
import subprocess
import threading
import time
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ORCH_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ORCH_DIR / "runtime" / "data"
CONV_FILE = DATA_DIR / "conversations.json"
SETTINGS_FILE = DATA_DIR / "harness-settings.json"

ASK_USER_TOOL = {
    "name": "ask_user",
    "description": (
        "Ask the human one or more questions in the chat UI. Use this whenever you "
        "need a decision, missing fact, or confirmation before continuing. Do not "
        "only write questions in prose — emit this tool so the UI can collect answers."
    ),
    "parameters": {
        "questions": {
            "type": "array",
            "items": {
                "id": "short snake_case id",
                "type": "choice | multi | text",
                "prompt": "The question shown to the user",
                "options": ["for choice/multi only"],
            },
        }
    },
}

ASK_USER_INSTRUCTIONS = """Built-in tool: ask_user
RULES:
- ONLY emit ask_user when a critical decision is strictly required from the user to proceed with an active deployment, project creation, or when the user explicitly ran /ask or /studio.
- NEVER emit ask_user for general questions, conversational turns, tool explanations, status checks, or code reviews.
- Answer user queries directly in prose without forcing a decision card unless a project decision is genuinely needed.

When you legitimately need a structured decision, emit:
<ask_user>
<q id="target_choice" type="choice" prompt="Specific decision question?">
<opt>Option A</opt>
<opt>Option B</opt>
</q>
</ask_user>

Types: choice (one option), multi (several options), text (freeform).
"""

_TERM: dict[str, dict[str, Any]] = {}
_LOCK = threading.Lock()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def tool_catalog() -> dict[str, Any]:
    from runtime.commands import catalog, command_instructions
    return {
        "tools": [ASK_USER_TOOL],
        "commands": catalog(),
        "instructions": ASK_USER_INSTRUCTIONS + "\n\n" + command_instructions(),
    }


def _norm_question(raw: dict[str, Any], idx: int) -> dict[str, Any] | None:
    prompt = str(raw.get("prompt") or raw.get("question") or "").strip()
    if not prompt:
        return None
    qtype = str(raw.get("type") or "text").strip().lower()
    if qtype not in {"text", "choice", "multi"}:
        qtype = "text"
    qid = re.sub(r"[^a-z0-9_]+", "_", str(raw.get("id") or f"q{idx}").lower()).strip("_") or f"q{idx}"
    opts = raw.get("options") or raw.get("opts") or []
    if isinstance(opts, str):
        opts = [o.strip() for o in opts.split("|") if o.strip()]
    opts = [str(o).strip() for o in opts if str(o).strip()]
    if qtype in {"choice", "multi"} and not opts:
        qtype = "text"
    return {"id": qid, "type": qtype, "prompt": prompt, "options": opts}


def parse_ask_user(text: str) -> tuple[str, list[dict[str, Any]]]:
    """Pull ask_user tool payloads out of model text. Returns (display_text, questions)."""
    if not text:
        return "", []
    questions: list[dict[str, Any]] = []
    cleaned = text

    def _take_list(raw_list: Any) -> None:
        if not isinstance(raw_list, list):
            return
        for i, item in enumerate(raw_list, 1):
            if isinstance(item, dict):
                q = _norm_question(item, len(questions) + i)
                if q:
                    questions.append(q)

    # ```ask_user ... ```
    fence = re.compile(r"```(?:ask_user|ask-user|json)\s*([\s\S]*?)```", re.I)
    for m in fence.finditer(text):
        blob = m.group(1).strip()
        try:
            data = json.loads(blob)
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("tool") in {"ask_user", "ask-user"}:
            _take_list(data.get("questions"))
            cleaned = cleaned.replace(m.group(0), "")
        elif isinstance(data, dict) and "questions" in data:
            _take_list(data.get("questions"))
            cleaned = cleaned.replace(m.group(0), "")
        elif isinstance(data, list):
            _take_list(data)
            cleaned = cleaned.replace(m.group(0), "")

    # {"tool":"ask_user", ...}
    for m in re.finditer(r"\{[^{}]*\"tool\"\s*:\s*\"ask[_-]user\"[^{}]*\}", cleaned, re.I):
        try:
            data = json.loads(m.group(0))
        except json.JSONDecodeError:
            continue
        _take_list(data.get("questions"))
        cleaned = cleaned.replace(m.group(0), "")

    # XML <ask_user><q ...>
    xml_block = re.compile(r"<ask_user>([\s\S]*?)</ask_user>", re.I)
    q_tag = re.compile(
        r"<q\b([^>]*)>([\s\S]*?)</q>|<q\b([^>]*)/>",
        re.I,
    )
    attr_re = re.compile(r"(\w+)\s*=\s*\"([^\"]*)\"")
    for m in xml_block.finditer(text):
        inner = m.group(1)
        for qm in q_tag.finditer(inner):
            attrs_s = qm.group(1) or qm.group(3) or ""
            body = qm.group(2) or ""
            attrs = {a.group(1).lower(): a.group(2) for a in attr_re.finditer(attrs_s)}
            opts = re.findall(r"<opt>([\s\S]*?)</opt>", body, re.I)
            raw = {
                "id": attrs.get("id"),
                "type": attrs.get("type") or "text",
                "prompt": attrs.get("prompt") or re.sub(r"<[^>]+>", "", body).strip(),
                "options": [o.strip() for o in opts if o.strip()],
            }
            q = _norm_question(raw, len(questions) + 1)
            if q:
                questions.append(q)
        cleaned = cleaned.replace(m.group(0), "")

    # de-dupe by id, keep first
    seen = set()
    uniq = []
    for q in questions:
        if q["id"] in seen:
            continue
        # Filter out spurious dev/staging/prod hallucinated questions
        prompt_low = (q.get("prompt") or "").lower()
        opts_low = [str(o).lower() for o in q.get("options") or []]
        if "environment" in prompt_low and set(opts_low) == {"dev", "staging", "prod"} and len(questions) <= 2:
            # Drop hallucinated default example question
            continue
        seen.add(q["id"])
        uniq.append(q)
    return re.sub(r"\n{3,}", "\n\n", cleaned).strip(), uniq


def answer_questions(conversation_id: str, message_id: str, answers: dict[str, Any]) -> dict[str, Any]:
    conv = get_conversation(conversation_id)
    if not conv:
        return {"error": "conversation not found"}
    target = None
    for m in conv.get("messages") or []:
        if m.get("id") == message_id:
            target = m
            break
    if not target:
        return {"error": "message not found"}
    qs = target.get("questions") or []
    if not qs:
        return {"error": "no questions on that message"}
    if target.get("answered"):
        return {"error": "already answered", "conversation": conv}

    lines = ["[ask_user answers]"]
    recorded = []
    for q in qs:
        val = answers.get(q["id"])
        if q["type"] == "multi":
            if not isinstance(val, list):
                val = [val] if val else []
            val = [str(v) for v in val if v]
        else:
            val = "" if val is None else str(val).strip()
        recorded.append({"id": q["id"], "prompt": q["prompt"], "answer": val})
        pretty = ", ".join(val) if isinstance(val, list) else val
        lines.append(f"- {q['prompt']} → {pretty or '(blank)'}")

    target["answered"] = True
    target["answers"] = recorded
    items = _load_convs()
    for i, c in enumerate(items):
        if c.get("id") == conversation_id:
            items[i] = conv
            break
    _save_convs(items)

    follow = "\n".join(lines)
    append_message(conversation_id, "user", follow, extra={"kind": "ask_user_answers", "answers": recorded})
    return chat(
        conversation_id,
        follow,
        model=conv.get("model"),
        connector=conv.get("connector"),
        record_user=False,
    )


def _read_json(path: Path, default):
    try:
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        pass
    return default


def _write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2), encoding="utf-8")
    tmp.replace(path)


def load_settings() -> dict[str, Any]:
    base = {
        "connector": "auto",
        "model": "auto",
        "system_prompt": (
            "You are Zoth Studio, a local-first agent harness. Be concise, use tools when useful, "
            "and say when you spawn a terminal.\n\n"
            + ASK_USER_INSTRUCTIONS
        ),
        "temperature": 0.4,
        "allow_raw_terminal": True,
        "workspace": str(ORCH_DIR),
        "wait_visual": "seal",
        "wait_motion": "orbit",
        "wait_status": True,
        "auto_open_studio": False,
    }
    saved = _read_json(SETTINGS_FILE, {})
    if isinstance(saved, dict):
        base.update(saved)
    return base


def save_settings(patch: dict[str, Any]) -> dict[str, Any]:
    cur = load_settings()
    for k, v in (patch or {}).items():
        if k in cur or k in {
            "connector", "model", "system_prompt", "temperature",
            "allow_raw_terminal", "workspace",
            "wait_visual", "wait_motion", "wait_status", "auto_open_studio",
        }:
            cur[k] = v
    _write_json(SETTINGS_FILE, cur)
    return cur


def _load_convs() -> list[dict[str, Any]]:
    data = _read_json(CONV_FILE, {"conversations": []})
    return data.get("conversations", [])


def _save_convs(items: list[dict[str, Any]]) -> None:
    _write_json(CONV_FILE, {"conversations": items})


def list_conversations() -> list[dict[str, Any]]:
    items = _load_convs()
    out = []
    for c in items:
        msgs = c.get("messages") or []
        out.append({
            "id": c.get("id"),
            "title": c.get("title") or "Untitled",
            "updated": c.get("updated"),
            "created": c.get("created"),
            "model": c.get("model"),
            "connector": c.get("connector"),
            "message_count": len(msgs),
            "preview": next((m.get("content", "")[:80] for m in msgs if m.get("role") == "user"), ""),
        })
    out.sort(key=lambda x: x.get("updated") or "", reverse=True)
    return out


def get_conversation(cid: str) -> dict[str, Any] | None:
    for c in _load_convs():
        if c.get("id") == cid:
            return c
    return None


def create_conversation(title: str = "New chat") -> dict[str, Any]:
    conv = {
        "id": uuid.uuid4().hex[:12],
        "title": title or "New chat",
        "created": _now(),
        "updated": _now(),
        "model": load_settings().get("model", "auto"),
        "connector": load_settings().get("connector", "auto"),
        "messages": [],
    }
    items = _load_convs()
    items.insert(0, conv)
    _save_convs(items)
    return conv


def delete_conversation(cid: str) -> bool:
    items = _load_convs()
    nxt = [c for c in items if c.get("id") != cid]
    if len(nxt) == len(items):
        return False
    _save_convs(nxt)
    return True


def append_message(cid: str, role: str, content: str, extra: dict | None = None) -> dict[str, Any] | None:
    items = _load_convs()
    for c in items:
        if c.get("id") != cid:
            continue
        msg = {"id": uuid.uuid4().hex[:8], "role": role, "content": content, "ts": _now()}
        if extra:
            msg.update(extra)
        c.setdefault("messages", []).append(msg)
        c["updated"] = _now()
        if role == "user" and (c.get("title") in (None, "", "New chat")):
            c["title"] = content.strip().split("\n")[0][:56] or "New chat"
        _save_convs(items)
        return c
    return None


def _port_open(host: str, port: int) -> bool:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.4)
        ok = s.connect_ex((host, port)) == 0
        s.close()
        return ok
    except Exception:
        return False


def _which(cmd: str) -> str | None:
    return shutil.which(cmd)


def _ollama_models() -> list[dict[str, Any]]:
    if not _port_open("127.0.0.1", 11434):
        return []
    try:
        req = urllib.request.Request("http://127.0.0.1:11434/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=2) as resp:
            data = json.loads(resp.read().decode())
        out = []
        for m in data.get("models") or []:
            name = m.get("name") or m.get("model")
            if name:
                out.append({"id": f"ollama:{name}", "name": name, "provider": "ollama", "available": True})
        return out
    except Exception:
        return []


def _safe_connectors() -> dict[str, Any]:
    try:
        from runtime.connectors import list_connectors
        return list_connectors()
    except Exception as e:
        return {"connectors": [], "error": str(e)}


def detect_models() -> dict[str, Any]:
    binaries = []
    for cmd, label, kind in [
        ("ollama", "Ollama", "runtime"),
        ("hermes", "Hermes CLI", "agent"),
        ("codex", "OpenAI Codex", "agent"),
        ("gemini", "Gemini CLI", "agent"),
        ("aider", "Aider", "agent"),
        ("llm", "llm (Datasette)", "cli"),
        ("openai", "OpenAI CLI", "cli"),
    ]:
        path = _which(cmd)
        binaries.append({"id": cmd, "label": label, "kind": kind, "path": path, "installed": bool(path)})

    keys = {
        "openai": bool(os.environ.get("OPENAI_API_KEY")),
        "anthropic": bool(os.environ.get("ANTHROPIC_API_KEY")),
        "groq": bool(os.environ.get("GROQ_API_KEY")),
        "google": bool(os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")),
    }

    ollama = _ollama_models()
    models = [
        {"id": "auto", "name": "Auto", "provider": "auto", "available": True},
        {"id": "hermes", "name": "Hermes planner", "provider": "hermes", "available": True},
    ]
    models.extend(ollama)
    if keys["openai"]:
        models.append({"id": "openai:gpt-4.1-mini", "name": "GPT-4.1 mini", "provider": "openai", "available": True})
    if keys["anthropic"]:
        models.append({"id": "anthropic:claude-sonnet-4-5", "name": "Claude Sonnet", "provider": "anthropic", "available": True})
    if keys["groq"]:
        models.append({"id": "groq:llama-3.3-70b-versatile", "name": "Groq Llama 3.3", "provider": "groq", "available": True})

    return {
        "models": models,
        "binaries": binaries,
        "keys": keys,
        "ollama_up": _port_open("127.0.0.1", 11434),
        "settings": load_settings(),
        "connectors": _safe_connectors(),
    }


def _ollama_chat(model: str, messages: list[dict[str, str]], temperature: float) -> str:
    payload = json.dumps({
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {"temperature": temperature},
    }).encode()
    req = urllib.request.Request(
        "http://127.0.0.1:11434/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    return ((data.get("message") or {}).get("content")) or data.get("response") or ""


def _openai_compat(url: str, key: str, model: str, messages: list[dict[str, str]], temperature: float) -> str:
    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": temperature,
    }).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    return data["choices"][0]["message"]["content"]


def _hermes_plan(prompt: str) -> dict[str, Any]:
    import sys
    sys.path.insert(0, str(ORCH_DIR / "studio-agents"))
    from hermes_agent import hermes
    reg_path = ORCH_DIR / "registry.local.json"
    tools = []
    try:
        tools = json.loads(reg_path.read_text()).get("tools", [])
    except Exception:
        pass
    return hermes.process_prompt(prompt, tools)


def _pick_model(requested: str, detected: dict[str, Any]) -> tuple[str, str]:
    if requested and requested != "auto":
        if requested.startswith("ollama:"):
            return "ollama", requested.split(":", 1)[1]
        if requested.startswith("openai:"):
            return "openai", requested.split(":", 1)[1]
        if requested.startswith("anthropic:"):
            return "anthropic", requested.split(":", 1)[1]
        if requested.startswith("groq:"):
            return "groq", requested.split(":", 1)[1]
        if requested == "hermes":
            return "hermes", "hermes"
        return "hermes", requested
    if detected.get("ollama_up") and detected.get("models"):
        ollama = next((m for m in detected["models"] if m["id"].startswith("ollama:")), None)
        if ollama:
            return "ollama", ollama["id"].split(":", 1)[1]
    return "hermes", "hermes"


def chat(conversation_id: str | None, prompt: str, model: str | None = None, connector: str | None = None, record_user: bool = True) -> dict[str, Any]:
    prompt = (prompt or "").strip()
    if not prompt:
        return {"error": "prompt required"}

    settings = load_settings()
    if not conversation_id:
        conv = create_conversation()
        conversation_id = conv["id"]
    elif not get_conversation(conversation_id):
        conv = create_conversation()
        conversation_id = conv["id"]

    if record_user:
        append_message(conversation_id, "user", prompt)
    detected = detect_models()
    use_model = model or settings.get("model") or "auto"
    provider, model_name = _pick_model(use_model, detected)

    from runtime.commands import (
        CONNECTOR_COMMANDS,
        command_instructions,
        dispatch as dispatch_command,
        rewrite_to_slash,
    )

    cmd = None
    slash_src = rewrite_to_slash(prompt) or (prompt if prompt.startswith("/") else "")
    if record_user and slash_src.startswith("/"):
        tools = []
        try:
            from orchestrator import load_registry
            tools = (load_registry() or {}).get("tools", [])
        except Exception:
            pass
        cmd = dispatch_command(slash_src, {
            "spawn": spawn_terminal,
            "save_settings": save_settings,
            "detected": detected,
            "tools": tools,
        })

    if cmd and cmd.get("settings_patch"):
        save_settings(cmd["settings_patch"])
        if cmd["settings_patch"].get("model"):
            use_model = cmd["settings_patch"]["model"]
            provider, model_name = _pick_model(use_model, detected)

    if cmd and cmd.get("handled"):
        extra = {"meta": {"command": cmd.get("command"), "handled": True}}
        conv = append_message(conversation_id, "assistant", cmd.get("display") or "Done.", extra)
        return {
            "conversation": conv,
            "used": {"command": cmd.get("command"), "handled": True},
            "terminal": cmd.get("terminal"),
            "questions": [],
            "command": cmd,
        }

    if cmd and cmd.get("prompt"):
        prompt = cmd["prompt"]

    conv = get_conversation(conversation_id) or {}
    history = [{"role": m["role"], "content": m["content"]} for m in conv.get("messages", []) if m.get("role") in ("user", "assistant")]
    if cmd and cmd.get("prompt"):
        # give the model the expanded tool grant, not just the raw slash
        if history and history[-1]["role"] == "user":
            history[-1] = {"role": "user", "content": cmd["prompt"]}
    sys_prompt = settings.get("system_prompt") or ""
    from runtime.studio_bridge import STUDIO_INSTRUCTIONS, wants_site
    connector_turn = (cmd or {}).get("command") in CONNECTOR_COMMANDS
    is_project_flow = wants_site(prompt) or (cmd or {}).get("command") in ("ask", "studio", "fusion")
    
    # Only teach ask_user when explicitly in project setup/asking mode
    if is_project_flow and ASK_USER_INSTRUCTIONS not in sys_prompt:
        sys_prompt = (sys_prompt + "\n\n" + ASK_USER_INSTRUCTIONS).strip()
    cmd_guide = command_instructions()
    if cmd_guide not in sys_prompt:
        sys_prompt = (sys_prompt + "\n\n" + cmd_guide).strip()
    if is_project_flow and not connector_turn and STUDIO_INSTRUCTIONS not in sys_prompt:
        sys_prompt = (sys_prompt + "\n\n" + STUDIO_INSTRUCTIONS).strip()
    messages = ([{"role": "system", "content": sys_prompt}] if sys_prompt else []) + history
    temp = float(settings.get("temperature") or 0.4)

    used = {"provider": provider, "model": model_name, "connector": connector or settings.get("connector")}
    if cmd:
        used["command"] = cmd.get("command")
        used["tool"] = cmd.get("tool")
    terminal = cmd.get("terminal") if cmd else None
    text = ""
    try:
        if provider == "ollama":
            text = _ollama_chat(model_name, messages, temp)
        elif provider == "openai" and os.environ.get("OPENAI_API_KEY"):
            text = _openai_compat("https://api.openai.com/v1/chat/completions", os.environ["OPENAI_API_KEY"], model_name, messages, temp)
        elif provider == "groq" and os.environ.get("GROQ_API_KEY"):
            text = _openai_compat("https://api.groq.com/openai/v1/chat/completions", os.environ["GROQ_API_KEY"], model_name, messages, temp)
        else:
            plan = _hermes_plan(prompt)
            text = plan.get("message") or json.dumps(plan.get("plan"), indent=2)
            used["plan"] = plan.get("plan")
            # spawn a planner terminal when Hermes wants a scan/doctor
            action = (plan.get("plan") or {}).get("action")
            if action in ("orchestrator_scan", "system_doctor"):
                cmd = "scan" if action == "orchestrator_scan" else "doctor"
                terminal = spawn_terminal(["python3", "orchestrator.py", cmd], cwd=str(ORCH_DIR), label=f"hermes:{cmd}")
    except Exception as e:
        text = f"Harness error ({provider}/{model_name}): {e}"
        used["error"] = str(e)

    if not text:
        text = "No response from the selected connector. Open Models to pick another, or start Ollama."

    from runtime.studio_bridge import infer_studio_preset, parse_run_commands, parse_studio_preset, wants_site

    display, questions = parse_ask_user(text)
    display, run_cmds = parse_run_commands(display)
    display, studio_preset = parse_studio_preset(display)
    
    # Suppress selection cards unless user explicitly wants to start a project or invoked /ask
    if not is_project_flow:
        questions = []
    
    if connector_turn or (not wants_site(prompt) and (cmd or {}).get("command") != "studio"):
        run_cmds = [c for c in run_cmds if not re.match(r"^/(studio|fusion)\b", c, re.I)]
        studio_preset = None

    ran = []
    if record_user and run_cmds:
        tools = []
        try:
            from orchestrator import load_registry
            tools = (load_registry() or {}).get("tools", [])
        except Exception:
            pass
        from runtime.commands import dispatch as dispatch_command
        for raw in run_cmds[:6]:
            extra_cmd = dispatch_command(raw, {
                "spawn": spawn_terminal,
                "save_settings": save_settings,
                "detected": detected,
                "tools": tools,
            })
            if not extra_cmd:
                continue
            ran.append(extra_cmd.get("command") or raw)
            if extra_cmd.get("terminal") and not terminal:
                terminal = extra_cmd["terminal"]
            if extra_cmd.get("open_panel") and cmd is not None:
                cmd.setdefault("open_panel", extra_cmd["open_panel"])
            elif extra_cmd.get("open_panel"):
                cmd = extra_cmd
            if extra_cmd.get("settings_patch"):
                save_settings(extra_cmd["settings_patch"])

    user_src = ""
    if record_user:
        conv_now = get_conversation(conversation_id) or {}
        for m in reversed(conv_now.get("messages") or []):
            if m.get("role") == "user":
                user_src = m.get("content") or ""
                break
    site_ok = (
        not connector_turn
        and not rewrite_to_slash(user_src)
        and (wants_site(user_src) or (cmd or {}).get("command") == "studio")
    )
    if studio_preset and not site_ok:
        studio_preset = None
    if not studio_preset and site_ok:
        studio_preset = infer_studio_preset(user_src)
        if studio_preset:
            display = (display + "\n\nI prefilled Zoth Studio from your brief. Review Generate and hit Next when it looks right.").strip()

    extra = {"meta": used}
    if questions:
        extra["questions"] = questions
        extra["answered"] = False
    if studio_preset:
        extra["studio_preset"] = studio_preset
        if cmd is None:
            cmd = {"command": "studio", "open_panel": "studio", "tool": "studio.generate"}
        else:
            cmd.setdefault("open_panel", "studio")
        cmd["studio_preset"] = studio_preset
    if ran:
        extra["ran_commands"] = ran
        used["ran_commands"] = ran
    if terminal:
        extra["terminal_id"] = terminal["id"]
        display = (display + f"\n\nSpawned agent terminal `{terminal['id']}` — open Terminal for the live feed.").strip()

    conv = append_message(conversation_id, "assistant", display or text, extra)
    return {
        "conversation": conv,
        "used": used,
        "terminal": terminal,
        "questions": questions,
        "command": cmd,
        "studio_preset": studio_preset,
    }


def spawn_terminal(cmd: list[str] | str, cwd: str | None = None, label: str = "") -> dict[str, Any]:
    sid = uuid.uuid4().hex[:10]
    cwd = cwd or str(ORCH_DIR)
    if isinstance(cmd, str):
        args = cmd
        shell = True
    else:
        args = cmd
        shell = False
    feed: list[dict[str, Any]] = []
    proc = subprocess.Popen(
        args,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        shell=shell,
    )

    def _pump():
        assert proc.stdout
        for line in proc.stdout:
            with _LOCK:
                feed.append({"ts": _now(), "text": line.rstrip("\n")})
        code = proc.wait()
        with _LOCK:
            feed.append({"ts": _now(), "text": f"[exit {code}]"})
            _TERM[sid]["alive"] = False
            _TERM[sid]["exit_code"] = code

    threading.Thread(target=_pump, daemon=True).start()
    rec = {
        "id": sid,
        "label": label or (cmd if isinstance(cmd, str) else " ".join(cmd)),
        "cwd": cwd,
        "pid": proc.pid,
        "started": _now(),
        "alive": True,
        "exit_code": None,
        "feed": feed,
        "process": proc,
    }
    with _LOCK:
        _TERM[sid] = rec
    return snapshot_terminal(sid)


def snapshot_terminal(sid: str, after: int = 0) -> dict[str, Any] | None:
    with _LOCK:
        rec = _TERM.get(sid)
        if not rec:
            return None
        feed = rec["feed"][after:]
        return {
            "id": rec["id"],
            "label": rec["label"],
            "cwd": rec["cwd"],
            "pid": rec["pid"],
            "started": rec["started"],
            "alive": rec["alive"],
            "exit_code": rec["exit_code"],
            "offset": after,
            "next": after + len(feed),
            "feed": feed,
        }


def list_terminals() -> list[dict[str, Any]]:
    with _LOCK:
        return [
            {
                "id": r["id"],
                "label": r["label"],
                "alive": r["alive"],
                "pid": r["pid"],
                "started": r["started"],
                "lines": len(r["feed"]),
            }
            for r in _TERM.values()
        ]


def kill_terminal(sid: str) -> bool:
    with _LOCK:
        rec = _TERM.get(sid)
        if not rec:
            return False
        proc = rec.get("process")
    if proc and proc.poll() is None:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except Exception:
            proc.kill()
    return True
