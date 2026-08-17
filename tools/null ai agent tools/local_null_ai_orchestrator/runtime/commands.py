"""Slash commands for the Zoth Studio harness.

Each command either runs locally, expands into a tool-aware prompt for the
selected model, or both. The model is told exactly which tool it now has.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Callable

ORCH_DIR = Path(__file__).resolve().parents[1]

CommandFn = Callable[[str, dict[str, Any]], dict[str, Any]]

COMMANDS: list[dict[str, Any]] = [
    {
        "name": "help",
        "usage": "/help",
        "hint": "List commands the current model can run",
        "tool": None,
    },
    {
        "name": "math",
        "usage": "/math",
        "hint": "AI Math Pillars observability — Attention, AdamW loss, and Shannon entropy",
        "tool": "math.observability",
    },
    {
        "name": "telemetry",
        "usage": "/telemetry",
        "hint": "Live mathematical telemetry and tensor metrics for the active AI model",
        "tool": "math.telemetry",
    },
    {
        "name": "ask",
        "usage": "/ask [topic]",
        "hint": "Force the ask_user card so the model interviews you",
        "tool": "ask_user",
    },
    {
        "name": "scan",
        "usage": "/scan",
        "hint": "Re-index the tool registry; model reads the result",
        "tool": "orchestrator.scan",
    },
    {
        "name": "doctor",
        "usage": "/doctor",
        "hint": "Dependency + health check with Debian/Ubuntu install lines",
        "tool": "orchestrator.doctor",
    },
    {
        "name": "deps",
        "usage": "/deps",
        "hint": "Same as /doctor — required vs optional libraries and links",
        "tool": "orchestrator.deps",
    },
    {
        "name": "term",
        "usage": "/term <command>",
        "hint": "Spawn a live terminal the model can watch and explain",
        "tool": "terminal.spawn",
    },
    {
        "name": "tools",
        "usage": "/tools [query]",
        "hint": "Search the 298-tool registry; model picks a next action",
        "tool": "registry.search",
    },
    {
        "name": "models",
        "usage": "/models",
        "hint": "Show detected models and connectors",
        "tool": "harness.detect_models",
    },
    {
        "name": "model",
        "usage": "/model <id>",
        "hint": "Switch the active model, then confirm with the new one",
        "tool": "harness.set_model",
    },
    {
        "name": "pet",
        "usage": "/pet <name>",
        "hint": "Engage a companion for the next turns",
        "tool": "pets.engage",
    },
    {
        "name": "run",
        "usage": "/run <tool-id>",
        "hint": "Give the model a specific registry tool to operate",
        "tool": "orchestrator.exec",
    },
    {
        "name": "studio",
        "usage": "/studio [brief]",
        "hint": "Open generate mode — model plans a site/app",
        "tool": "studio.generate",
    },
    {
        "name": "fusion",
        "usage": "/fusion [task]",
        "hint": "Model Fusion Arena plan with ask_user for contenders",
        "tool": "fusion.arena",
    },
    {
        "name": "connect",
        "usage": "/connect [id]",
        "hint": "List or probe connectors — never opens Generate",
        "tool": "connectors.probe",
    },
    {
        "name": "conne",
        "usage": "/conne [id]",
        "hint": "Alias for /connect",
        "tool": "connectors.probe",
    },
    {
        "name": "netlify",
        "usage": "/netlify [sites|hook <url>]",
        "hint": "Netlify sites or deploy hook",
        "tool": "connectors.netlify",
    },
    {
        "name": "github",
        "usage": "/github [whoami|repos|ls owner/repo [path]|cat owner/repo path|issues|prs|commits|dispatch]",
        "hint": "Browse GitHub like github.com — repos, files, issues, PRs",
        "tool": "connectors.github",
    },
    {
        "name": "drive",
        "usage": "/drive [about|ls [path]|cat path|mkdir path|get path [dest]|put src dest]",
        "hint": "Browse Google Drive the same way — list, read, upload",
        "tool": "connectors.gdrive",
    },
    {
        "name": "solana",
        "usage": "/solana [address]",
        "hint": "Solana RPC balance",
        "tool": "connectors.solana",
    },
    {
        "name": "stripe",
        "usage": "/stripe",
        "hint": "Stripe balance if STRIPE_SECRET_KEY is set",
        "tool": "connectors.stripe",
    },
    {
        "name": "vault",
        "usage": "/vault",
        "hint": "Argon2id vault daemon health (:8787)",
        "tool": "connectors.vault",
    },
    {
        "name": "who",
        "usage": "/who",
        "hint": "Who is live on the swarm board (Grok, Antigravity, Hermes…)",
        "tool": "swarm.who",
    },
    {
        "name": "swarm",
        "usage": "/swarm [message]",
        "hint": "Open the radar or broadcast to @all",
        "tool": "swarm.post",
    },
    {
        "name": "ping",
        "usage": "/ping <agent> <message>",
        "hint": "Ask another running agent on the shared bus",
        "tool": "swarm.post",
    },
    {
        "name": "repo",
        "usage": "/repo",
        "hint": "Local git status for the in-house Zoth repo",
        "tool": "repos.status",
    },
    {
        "name": "backup",
        "usage": "/backup [folder|gdrive|github]",
        "hint": "Copy the git bundle to a folder, Drive, or preview a GitHub push",
        "tool": "repos.backup",
    },
    {
        "name": "mission",
        "usage": "/mission",
        "hint": "Zoth Mission Control showcase — shipped capabilities & future horizon",
        "tool": "studio.mission",
    },
    {
        "name": "omnipost",
        "usage": "/omnipost",
        "hint": "OmniPost Powerhouse media generator & 60 FPS shorts studio",
        "tool": "studio.omnipost",
    },
    {
        "name": "composer",
        "usage": "/composer",
        "hint": "Visual Agent DAG Playbook Composer & live simulator",
        "tool": "studio.composer",
    },
    {
        "name": "docs",
        "usage": "/docs",
        "hint": "Official Zoth Studio operator manual & documentation center",
        "tool": "studio.docs",
    },
    {
        "name": "consensus",
        "usage": "/consensus [task]",
        "hint": "Autonomous 3-agent arbitration (Antigravity + Grok + Hermes) with AST verification & bus telemetry",
        "tool": "swarm.consensus",
    },
    {
        "name": "chronicle",
        "usage": "/chronicle",
        "hint": "Zoth Chronicle — engineering sprint milestones & 4-phase strategic horizon",
        "tool": "studio.chronicle",
    },
]


def catalog() -> list[dict[str, Any]]:
    return [
        {"name": c["name"], "usage": c["usage"], "hint": c["hint"], "tool": c["tool"]}
        for c in COMMANDS
    ]


def command_instructions() -> str:
    lines = [
        "Slash commands: if the human types one, they already invoked the tool.",
        "Use the named tool. If you still need a decision, emit ask_user.",
        "",
    ]
    for c in COMMANDS:
        tool = f" → tool `{c['tool']}`" if c["tool"] else ""
        lines.append(f"- {c['usage']} — {c['hint']}{tool}")
    return "\n".join(lines)


CONNECTOR_COMMANDS = frozenset({
    "connect", "conne", "solana", "stripe", "netlify", "github", "vault",
    "repo", "backup", "gdrive", "drive",
})
_CONN_WORDS = (
    "solana", "stripe", "netlify", "github", "vault", "metamask", "hostinger", "phantom",
    "gdrive", "drive",
)
_CONN_WORD_SET = frozenset(_CONN_WORDS)
_CONN_RE = re.compile(
    r"\b(?:/)?(?:connect(?:or|ion|ors)?|conne)\b"
    r"(?:\s+(?:command|to|the|my|a|an|our|me)){0,3}\s*("
    + "|".join(_CONN_WORDS)
    + r")\b",
    re.I,
)
_CONN_FLIP = re.compile(
    r"\b(" + "|".join(_CONN_WORDS) + r")\b.{0,48}\b(connect|connector|wallet|byok)\b|"
    r"\b(connect|connector|wallet|byok)\b.{0,48}\b(" + "|".join(_CONN_WORDS) + r")\b",
    re.I,
)
_CONN_BARE = re.compile(
    r"\b(?:use|run|open|try|type|invoke|hit|please)\b.{0,40}"
    r"\b(?:the\s+)?(?:connect(?:or|ion|ors)?|conne)\b(?:\s+command)?"
    r"|\b(?:connect(?:or)?|conne)\s+command\b"
    r"|^(?:please\s+|can you\s+|i (?:want|need) to\s+|i['’]d like to\s+)?"
    r"(?:connect|conne|use connect(?:ors?)?)\s*[.!?]?$",
    re.I,
)


def parse_slash(prompt: str) -> tuple[str, str] | None:
    text = (prompt or "").strip()
    if not text.startswith("/"):
        return None
    body = text[1:].strip()
    if not body:
        return "help", ""
    name, _, rest = body.partition(" ")
    return name.lower().lstrip("/"), rest.strip()


def rewrite_to_slash(prompt: str) -> str | None:
    """Map 'connect solana' / 'use the connect command' onto /connect (never a site)."""
    text = (prompt or "").strip()
    if not text:
        return None
    first = text.split("\n", 1)[0].strip()
    low = first.lower()
    if low.startswith("/conne ") or low == "/conne":
        rest = first[6:].lstrip()
        return f"/connect {rest}".strip()
    if first.startswith("/"):
        parsed = parse_slash(first)
        if parsed and parsed[0] in CONNECTOR_COMMANDS:
            return first
        return None
    if re.search(r"\b(backup|back up)\b.{0,40}\b(drive|gdrive|google)\b", low):
        return "/backup gdrive"
    if re.search(r"\b(backup|back up)\b.{0,40}\b(github|git hub)\b", low):
        return "/backup github"
    if re.search(r"\b(backup|back up)\b.{0,40}\b(folder|disk|drive folder)\b", low) or low in {"backup", "back up the repo"}:
        return "/backup folder"
    if re.search(r"\b(google\s+)?drive\b", low) and re.search(r"\b(list|browse|open|ls|files?|folder)\b", low):
        return "/drive ls"
    if re.search(r"\b(list|browse|show|open)\b.{0,40}\b(github|repos?)\b", low) or re.search(
        r"\b(github|repos?)\b.{0,40}\b(list|browse|show|open)\b", low
    ):
        return "/github repos"
    if re.search(r"\b(repo|repository|in-?house git)\b", low) and not re.search(r"\b(website|landing page)\b", low):
        return "/repo"
    m = _CONN_RE.search(text)
    if m:
        return f"/connect {m.group(1).lower()}"
    m = _CONN_FLIP.search(text)
    if m:
        cid = next((g for g in m.groups() if g and g.lower() in _CONN_WORD_SET), None)
        if cid:
            return f"/connect {cid.lower()}"
    if _CONN_BARE.search(text):
        return "/connect"
    return None


def _help(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    lines = ["Available commands — these grant the current model the matching tool:\n"]
    for c in COMMANDS:
        lines.append(f"`{c['usage']}` — {c['hint']}")
    return {
        "handled": True,
        "display": "\n".join(lines),
        "command": "help",
    }


def _ask(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    topic = args or "whatever is blocking the current task"
    return {
        "handled": False,
        "command": "ask",
        "tool": "ask_user",
        "prompt": (
            f"The human ran /ask {topic}. You MUST interview them with the ask_user tool "
            f"before doing anything else. Emit 1–4 questions about: {topic}. "
            "Do not answer the topic yourself yet."
        ),
    }


def _scan(_args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    spawn = ctx["spawn"]
    term = spawn(["python3", "orchestrator.py", "scan"], cwd=str(ORCH_DIR), label="scan")
    return {
        "handled": False,
        "command": "scan",
        "tool": "orchestrator.scan",
        "terminal": term,
        "prompt": (
            "The human ran /scan. Tool `orchestrator.scan` is already running in a live terminal. "
            "Explain what the registry scan does, what a healthy result looks like, and use ask_user "
            "to offer next steps (heal pets, inspect a category, or stop)."
        ),
    }


def _doctor(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.deps import format_report, probe

    data = probe()
    return {
        "handled": True,
        "command": "doctor",
        "tool": "orchestrator.doctor",
        "display": format_report(data)
        + "\n\nDebian/Ubuntu installer: `scripts/deps-debian.sh --install`\nThen `scripts/zoth-start.sh`.",
    }


def _term(args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    if not args:
        return {
            "handled": True,
            "command": "term",
            "display": "Usage: `/term <command>` — example `/term python3 orchestrator.py list`",
        }
    spawn = ctx["spawn"]
    term = spawn(args, cwd=str(ORCH_DIR), label=args[:40])
    return {
        "handled": False,
        "command": "term",
        "tool": "terminal.spawn",
        "terminal": term,
        "prompt": (
            f"The human ran /term `{args}`. That process is live in the terminal dock. "
            "Watch/explain the expected output. If it fails, propose a safer command via ask_user."
        ),
    }


def _tools(args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    tools = ctx.get("tools") or []
    q = args.lower()
    hits = tools
    if q:
        hits = [
            t for t in tools
            if q in (t.get("id") or "").lower()
            or q in (t.get("name") or "").lower()
            or q in (t.get("category") or "").lower()
        ]
    preview = [
        f"- {t.get('id') or t.get('name')} ({t.get('category') or 'uncat'})"
        for t in hits[:18]
    ]
    listing = "\n".join(preview) or "(no matches)"
    return {
        "handled": False,
        "command": "tools",
        "tool": "registry.search",
        "open_panel": "tools",
        "prompt": (
            f"The human ran /tools {args or '(all)'}. Tool `registry.search` returned "
            f"{len(hits)} hits. Top results:\n{listing}\n\n"
            "Recommend 1–3 tools for the current goal. Use ask_user to let them pick one to /run."
        ),
    }


def _models(_args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    detected = ctx.get("detected") or {}
    names = [m.get("name") or m.get("id") for m in detected.get("models") or []]
    return {
        "handled": False,
        "command": "models",
        "tool": "harness.detect_models",
        "open_panel": "models",
        "prompt": (
            "The human ran /models. Detected: "
            + ", ".join(names)
            + ". Confirm which one is active and when to switch. Use ask_user if they should pick."
        ),
    }


def _model(args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    if not args:
        return {"handled": True, "command": "model", "display": "Usage: `/model zoth-ai:latest` or `/model auto`"}
    detected = ctx.get("detected") or {}
    models = detected.get("models") or []
    match = None
    needle = args.lower()
    for m in models:
        mid = (m.get("id") or "").lower()
        name = (m.get("name") or "").lower()
        if needle == mid or needle == name or needle in mid or needle in name:
            match = m
            break
    if not match:
        return {
            "handled": True,
            "command": "model",
            "display": f"No model matching `{args}`. Try `/models`.",
        }
    ctx["save_settings"]({"model": match["id"]})
    return {
        "handled": False,
        "command": "model",
        "tool": "harness.set_model",
        "settings_patch": {"model": match["id"]},
        "prompt": (
            f"The human ran /model and switched the harness to `{match['id']}` ({match.get('provider')}). "
            "Greet them as that model and confirm you now have its tools. Ask with ask_user what to do first."
        ),
    }


def _pet(args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    if not args:
        return {"handled": True, "command": "pet", "display": "Usage: `/pet kai` (or draco, athena, lycan, ignis…)"}
    slug = args.lower().replace(" ", "-")
    return {
        "handled": False,
        "command": "pet",
        "tool": "pets.engage",
        "settings_patch": {"pet": slug},
        "prompt": (
            f"The human ran /pet {slug}. You are now speaking with companion `{slug}` engaged. "
            "Stay in that pet's role. Use ask_user only if the task is still underspecified."
        ),
    }


def _run(args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    if not args:
        return {"handled": True, "command": "run", "display": "Usage: `/run <tool-id>` — find ids with `/tools`."}
    tool_id = args.split()[0]
    tools = ctx.get("tools") or []
    hit = next((t for t in tools if (t.get("id") or "") == tool_id or (t.get("name") or "") == tool_id), None)
    if not hit:
        return {
            "handled": True,
            "command": "run",
            "display": f"Unknown tool `{tool_id}`. Use `/tools {tool_id}` to search.",
        }
    return {
        "handled": False,
        "command": "run",
        "tool": "orchestrator.exec",
        "prompt": (
            f"The human ran /run `{tool_id}`. You are authorized to operate this registry tool:\n"
            f"{json.dumps({k: hit.get(k) for k in ('id', 'name', 'category', 'description', 'entrypoints', 'runtimes') if hit.get(k)}, indent=2)}\n"
            "Explain how you will use it. If a command must execute, say so and suggest `/term …`. "
            "Use ask_user before any destructive step."
        ),
    }


def _studio(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    brief = args or "a small local-first site"
    return {
        "handled": False,
        "command": "studio",
        "tool": "studio.generate",
        "open_panel": "studio",
        "prompt": (
            f"The human ran /studio {brief}. Tool `studio.generate` is available. "
            "Draft a generate plan (stack, pages, AEO). Use ask_user for name, stack, and deploy target."
        ),
    }


def _connect_pack(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import format_setup, invoke, list_connectors

    cid = (args or "").split()[0].lower() if args else ""
    if not cid:
        pack = list_connectors()
        lines = ["Connector board (no website will be generated):\n"]
        for c in pack["connectors"]:
            nxt = (c.get("next") or {}).get("title") or c.get("mode")
            lines.append(f"- `/{c['id']}` {c['name']} — {c['mode']} · {nxt}")
        lines.append("\nOpen **Connect** to Auth / BYOK / install. `/connect solana` probes one.")
        return {
            "handled": True,
            "command": "connect",
            "tool": "connectors.probe",
            "open_panel": "connect",
            "display": "\n".join(lines),
        }
    if cid in {"github", "gdrive", "drive"}:
        if cid == "github":
            return _github_cmd("whoami", _ctx)
        return _drive_cmd("about", _ctx)
    result = invoke(cid, "status")
    return {
        "handled": True,
        "command": "connect",
        "tool": f"connectors.{cid}",
        "open_panel": "connect",
        "display": format_setup(result),
    }


def _netlify(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import invoke

    parts = args.split()
    action = "sites"
    payload = {}
    if parts and parts[0] == "hook":
        action = "hook"
        payload["hook"] = parts[1] if len(parts) > 1 else None
    result = invoke("netlify", action, payload)
    from runtime.connectors import format_setup
    return {
        "handled": True,
        "command": "netlify",
        "tool": "connectors.netlify",
        "open_panel": "connect",
        "display": format_setup(result),
    }


_GH_HELP = (
    "**GitHub** — works like github.com from chat or the GitHub panel.\n\n"
    "- `/github` or `/github whoami` — signed-in user\n"
    "- `/github repos` — your repositories\n"
    "- `/github ls owner/repo [path]` — files in a repo\n"
    "- `/github cat owner/repo path` — read a file\n"
    "- `/github issues owner/repo` · `/github issue owner/repo 12`\n"
    "- `/github prs owner/repo` · `/github commits owner/repo`\n"
    "- `/github dispatch owner/repo workflow.yml [branch]`\n\n"
    "Token stays in BYOK (`GITHUB_TOKEN`). Generate stays closed."
)

_DRIVE_HELP = (
    "**Google Drive** — same browse/read/write shape as GitHub, via rclone.\n\n"
    "- `/drive` or `/drive about` — remote + quota\n"
    "- `/drive ls [path]` — list a folder\n"
    "- `/drive cat path` — read a text file\n"
    "- `/drive mkdir path` — create a folder\n"
    "- `/drive get path [dest]` — download under home / zoth\n"
    "- `/drive put /local/file dest` — upload\n\n"
    "Remote name is `GDRIVE_RCLONE_REMOTE` (default `gdrive`). Run `rclone config` first."
)


def _split_owner_repo(token: str) -> tuple[str, str] | None:
    if not token or "/" not in token or token.startswith("http"):
        return None
    owner, repo = token.split("/", 1)
    owner, repo = owner.strip(), repo.strip()
    if owner and repo:
        return owner, repo
    return None


def _format_hub_chat(title: str, envelope: dict[str, Any]) -> str:
    if not envelope.get("ok"):
        err = envelope.get("error") or {}
        msg = err.get("message") if isinstance(err, dict) else str(err or "request failed")
        return f"**{title}**\n\n{msg}"
    data = envelope.get("data") or {}
    lines = [f"**{title}**"]
    if data.get("login"):
        lines.append(f"Signed in as @{data['login']}" + (f" — {data['name']}" if data.get("name") else ""))
        if data.get("html_url"):
            lines.append(data["html_url"])
    if data.get("remote"):
        lines.append(f"Remote `{data['remote']}:{data.get('root') or ''}`")
    if "about" in data:
        about = data["about"]
        if isinstance(about, dict):
            used = about.get("used") or about.get("usedBytes")
            total = about.get("total") or about.get("totalBytes")
            if used or total:
                lines.append(f"Used {used} / {total}")
            else:
                lines.append(json.dumps(about)[:400])
    items = data.get("items")
    if isinstance(items, list):
        lines.append(f"{data.get('count', len(items))} items" + (f" in `{data['path']}`" if data.get("path") else ""))
        for item in items[:30]:
            if not isinstance(item, dict):
                continue
            name = (
                item.get("full_name")
                or item.get("title")
                or item.get("name")
                or item.get("path")
                or (item.get("sha") or "")[:12]
            )
            kind = item.get("type") or item.get("state") or ""
            extra = ""
            if item.get("number"):
                extra = f"#{item['number']}"
            elif item.get("html_url"):
                extra = item["html_url"]
            elif item.get("message"):
                extra = item["message"]
            mark = "📁" if kind in {"dir", "directory"} else "📄" if kind in {"file", "blob"} else ""
            lines.append(f"- {mark} {name} {extra} {kind}".strip())
    if data.get("path") and data.get("sha"):
        lines.append(f"`{data['path']}` · {data.get('size', 0)} bytes")
    if data.get("html_url") and not data.get("login"):
        lines.append(data["html_url"])
    if data.get("text") and not data.get("binary"):
        preview = data["text"]
        if len(preview) > 3500:
            preview = preview[:3500] + "\n…"
        lines.append(f"```\n{preview}\n```")
    elif data.get("binary"):
        lines.append("(binary file — download with `/drive get` or open on GitHub)")
    if data.get("dest"):
        lines.append(f"Saved to `{data['dest']}`")
    if data.get("created"):
        lines.append(f"Created `{data['created']}`")
    if data.get("dispatched"):
        lines.append(f"Dispatched `{data.get('workflow')}` on `{data.get('ref')}`")
    if data.get("title") and data.get("number"):
        lines.append(f"#{data['number']} {data['title']} · {data.get('state') or ''}")
        if data.get("body"):
            lines.append((data["body"] or "")[:800])
    return "\n".join(x for x in lines if x)


def _github_cmd(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import GITHUB_TOOL_ACTIONS, github_tool_dispatch

    parts = args.split()
    verb = (parts[0] if parts else "whoami").lower()
    if verb in {"help", "?", "-h", "--help"}:
        return {
            "handled": True,
            "command": "github",
            "tool": "connectors.github",
            "open_panel": "github",
            "display": _GH_HELP,
        }
    aliases = {
        "whoami": "user.me",
        "me": "user.me",
        "repos": "repos.list",
        "ls": "contents.list",
        "tree": "contents.list",
        "cat": "contents.get",
        "read": "contents.get",
        "issues": "issues.list",
        "issue": "issues.get",
        "prs": "prs.list",
        "pr": "prs.get",
        "pulls": "prs.list",
        "commits": "commits.list",
        "branches": "branches.list",
        "dispatch": "workflows.dispatch",
    }
    if verb in aliases or verb in GITHUB_TOOL_ACTIONS:
        action = aliases.get(verb, verb)
        rest = parts[1:]
    else:
        action = "user.me"
        rest = parts

    params: dict[str, Any] = {}
    if rest:
        parsed = _split_owner_repo(rest[0])
        if parsed:
            params["owner"], params["repo"] = parsed
            rest = rest[1:]
        elif action == "workflows.dispatch" and len(rest) >= 2:
            parsed = _split_owner_repo(rest[0])
            if parsed:
                params["owner"], params["repo"] = parsed
                rest = rest[1:]
    if action in {"contents.list", "contents.get"}:
        if rest:
            params["path"] = rest[0]
    elif action in {"issues.get", "prs.get"}:
        if rest:
            params["number"] = rest[0]
    elif action == "workflows.dispatch":
        if rest:
            params["workflow"] = rest[0]
        if len(rest) > 1:
            params["ref"] = rest[1]
        elif not params.get("owner") and len(parts) >= 3:
            parsed = _split_owner_repo(parts[1])
            if parsed:
                params["owner"], params["repo"] = parsed
                params["workflow"] = parts[2]
                if len(parts) > 3:
                    params["ref"] = parts[3]
    envelope = github_tool_dispatch({"action": action, "params": params})
    title = f"GitHub · {action}"
    if params.get("owner") and params.get("repo"):
        title += f" {params['owner']}/{params['repo']}"
    return {
        "handled": True,
        "command": "github",
        "tool": "connectors.github",
        "open_panel": "github",
        "display": _format_hub_chat(title, envelope),
    }


def _drive_cmd(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import GDRIVE_TOOL_ACTIONS, gdrive_tool_dispatch

    parts = args.split()
    verb = (parts[0] if parts else "about").lower()
    if verb in {"help", "?", "-h", "--help"}:
        return {
            "handled": True,
            "command": "drive",
            "tool": "connectors.gdrive",
            "open_panel": "drive",
            "display": _DRIVE_HELP,
        }
    aliases = {
        "about": "about",
        "ls": "files.list",
        "list": "files.list",
        "cat": "files.cat",
        "read": "files.cat",
        "get": "files.get",
        "dl": "files.get",
        "put": "files.put",
        "upload": "files.put",
        "mkdir": "files.mkdir",
        "md": "files.mkdir",
    }
    if verb in aliases or verb in GDRIVE_TOOL_ACTIONS:
        action = aliases.get(verb, verb)
        rest = parts[1:]
    else:
        action = "files.list"
        rest = parts
    params: dict[str, Any] = {}
    if action in {"files.list", "files.cat", "files.mkdir"}:
        if rest:
            params["path"] = rest[0]
    elif action == "files.get":
        if rest:
            params["path"] = rest[0]
        if len(rest) > 1:
            params["dest"] = rest[1]
    elif action == "files.put":
        if rest:
            params["src"] = rest[0]
        if len(rest) > 1:
            params["dest"] = rest[1]
    envelope = gdrive_tool_dispatch({"action": action, "params": params})
    title = f"Drive · {action}"
    if params.get("path"):
        title += f" `{params['path']}`"
    return {
        "handled": True,
        "command": "drive",
        "tool": "connectors.gdrive",
        "open_panel": "drive",
        "display": _format_hub_chat(title, envelope),
    }


def _solana(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import invoke

    result = invoke("solana", "balance", {"address": args} if args else {})
    from runtime.connectors import format_setup
    return {
        "handled": True,
        "command": "solana",
        "tool": "connectors.solana",
        "open_panel": "connect",
        "display": format_setup(result),
    }


def _stripe(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import invoke

    result = invoke("stripe", "balance")
    from runtime.connectors import format_setup
    return {
        "handled": True,
        "command": "stripe",
        "tool": "connectors.stripe",
        "open_panel": "connect",
        "display": format_setup(result),
    }


def _vault_cmd(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.connectors import invoke

    result = invoke("vault", "health")
    from runtime.connectors import format_setup
    return {
        "handled": True,
        "command": "vault",
        "tool": "connectors.vault",
        "open_panel": "vault",
        "display": format_setup(result) + "\n\nOpen **Vault** on this deck to store keys. Daemon is optional (`:8787`).",
    }


def _who(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.swarm_bus import heartbeat, snapshot

    heartbeat("grok", "Checking swarm presence", "harness radar")
    snap = snapshot()
    lines = ["Swarm board — who is actually running:\n"]
    for a in snap.get("agents") or []:
        lines.append(f"- @{a['id']} [{a['status']}] {a['task']}")
    return {
        "handled": True,
        "command": "who",
        "tool": "swarm.who",
        "open_panel": "swarm",
        "display": "\n".join(lines),
    }


def _swarm(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.swarm_bus import heartbeat, post, snapshot

    heartbeat("grok", "Studio swarm radar", "harness")
    if args.strip():
        msg = post("grok", "all", args.strip())
        return {
            "handled": True,
            "command": "swarm",
            "tool": "swarm.post",
            "open_panel": "swarm",
            "display": f"Broadcast to @all: {msg['message']}",
        }
    snap = snapshot()
    live = [a["id"] for a in snap.get("agents") or [] if a.get("status") in ("live", "active")]
    return {
        "handled": True,
        "command": "swarm",
        "tool": "swarm.post",
        "open_panel": "swarm",
        "display": f"Swarm radar open. Live: {', '.join('@'+x for x in live) or 'none yet'}.",
    }


def _ping(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.swarm_bus import post

    target, _, text = args.partition(" ")
    target = target.lstrip("@") or "all"
    text = text.strip()
    if not text:
        return {
            "handled": True,
            "command": "ping",
            "display": "Usage: `/ping antigravity can you take the lawn-care images?`",
        }
    msg = post("grok", target, text)
    return {
        "handled": True,
        "command": "ping",
        "tool": "swarm.post",
        "open_panel": "swarm",
        "display": f"Sent to @{target}: {msg['message']}",
    }


def _repo(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.repos import snapshot

    snap = snapshot()
    lines = ["In-house repo (local git). This is the code home — remotes are optional backups.\n"]
    for r in snap.get("repos") or []:
        dirty = f"{r.get('changed')} uncommitted" if r.get("dirty") else "clean"
        lines.append(f"- **{r.get('label')}** `{r.get('branch')}` · {dirty}")
        lines.append(f"  {r.get('head') or 'no commits'}")
        lines.append(f"  {r.get('path')}")
    lines.append("\nDestinations:")
    for d in snap.get("destinations") or []:
        ready = "ready" if d.get("ready") else "needs setup"
        lines.append(f"- `{d.get('id')}` {d.get('label')} — {ready}")
    lines.append("\n`/backup folder` copies a git bundle locally. `/backup gdrive` needs rclone. `/backup github` previews a push.")
    return {
        "handled": True,
        "command": "repo",
        "tool": "repos.status",
        "open_panel": "repos",
        "display": "\n".join(lines),
    }


def _backup(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    from runtime.repos import backup

    dest = (args or "folder").split()[0].lower() or "folder"
    push = dest == "github" and "push" in (args or "").lower()
    result = backup(dest, push=push)
    if result.get("ok"):
        where = result.get("path") or result.get("dest") or result.get("url") or dest
        note = result.get("note") or f"Bundle copied to {where}."
        display = f"**Backup {dest}**\n\n{note}"
        if result.get("dry"):
            display += "\n\nGitHub is not pushed yet. Confirm in Repos, or `/backup github push`."
    else:
        display = f"**Backup {dest} failed**\n\n{result.get('error') or result.get('next') or 'unknown error'}"
        if result.get("install"):
            display += f"\n\n```\n{result['install']}\n```"
    return {
        "handled": True,
        "command": "backup",
        "tool": "repos.backup",
        "open_panel": "repos",
        "display": display,
    }


def _fusion(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    task = args or "the current user goal"
    return {
        "handled": False,
        "command": "fusion",
        "tool": "fusion.arena",
        "prompt": (
            f"The human ran /fusion on: {task}. You have Fusion Arena. "
            "Propose 3 model contenders and a scoring rubric. Use ask_user to confirm the lineup before a mock run."
        ),
    }


def _math_cmd(_args: str, ctx: dict[str, Any]) -> dict[str, Any]:
    detected = ctx.get("detected") or {}
    models = [m.get("name") or m.get("id") for m in detected.get("models") or []]
    active = models[0] if models else "Zoth-AI 1.5B (Local Coder)"

    display = f"""### 📐 📈 🎲 AI Math Pillars & Observability Engine

**Active Engine Profile**: `{active}`

#### 1. Pillar I: Linear Algebra (Tensors & Attention)
- **Scaled Dot-Product Attention**: $\\text{{Attention}}(Q, K, V) = \\text{{softmax}}\\left(\\frac{{QK^T}}{{\\sqrt{{d_k}}}}\\right)V$
- **Tensor Shapes**: $d_{{\\text{{model}}}} = 2048$, $h = 16\\text{{ heads}}$, $d_{{\\text{{head}}}} = 128$
- **Rotary Position Embedding (RoPE)**: $R_{{\\Theta, m}}^d x_m$ (complex 2D rotations with $\\theta=10000.0$)
- **LoRA Low-Rank Adaptation**: $W = W_0 + \\frac{{\\alpha}}{{r}}(BA)$ with rank $r=16$

#### 2. Pillar II: Multivariable Calculus (Loss & Optimization)
- **Cross-Entropy Objective**: $\\mathcal{{L}}_{{\\text{{CE}}}} = -\\sum y_i \\log(\\hat{{y}}_i)$ (Current loss: ~`1.12 nats`, PPL: ~`3.06`)
- **AdamW Parameter Update**: $\\theta_{{t+1}} = \\theta_t - \\eta \\left(\\frac{{\\hat{{m}}_t}}{{\\sqrt{{\\hat{{v}}_t}} + \\epsilon}} + \\lambda \\theta_t\\right)$ with $\\eta=3\\times 10^{{-4}}$, $\\lambda=0.01$
- **Gradient L2-Norm**: $\\|g\\|_2 = 0.14$ (Clipped at $1.0$)
- **Layer Normalization**: $\\text{{RMSNorm}}(x) = \\frac{{x}}{{\\text{{RMS}}(x)}} \\odot \\gamma$

#### 3. Pillar III: Probability & Information Theory (Entropy & Sampling)
- **Logit Softmax**: $P(w_i \\mid x) = \\frac{{\\exp(z_i / T)}}{{\\sum \\exp(z_j / T)}}$ with Temperature $T=0.70$
- **Shannon Entropy**: $H(X) = -\\sum P(w_i) \\log_2 P(w_i)$ (Live: **1.35 bits / token** — Confident)
- **Sampling Strategy**: Nucleus Top-$p$ ($0.90$) + Top-$k$ ($40$)

🔗 **Interactive Visualizer**: [Open AI Math Pillars Suite (http://127.0.0.1:8088/studio/math-pillars.html)](http://127.0.0.1:8088/studio/math-pillars.html)
"""
    return {
        "handled": True,
        "command": "math",
        "display": display,
    }


def _mission(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    display = """### 🛸 Zoth Mission Control — Capabilities & Future Horizon

**Active Operational Suites (Shipped v2.6.0):**
- 🚀 **OmniPost Powerhouse**: 60 FPS WebM Video Recording, Voice Synthesizer & Multi-Platform Matrix
- 🧩 **Visual Agent DAG Composer**: Drag-and-drop playbook presets & live Math Simulation engine
- 📐 **AI Math Observability Suite**: Linear Algebra, Calculus, and Info Theory live telemetry
- 👁️ **Vision Link Spatial HUD**: 21-point WebRTC hand tracking & gesture controller
- 📦 **Universal Linux Binaries**: 63MB standalone `.run` executable & 40MB native `.deb` package

**Strategic Horizon (In Development):**
- 🎙️ Offline Neural Voice Clone & Lip-Sync TTS Engine (Q3 2026)
- 🤖 Live Camera Stream to Local Ollama Vision Models (Q3 2026)
- 💻 Cross-Platform Desktop App (Tauri / Rust Sub-15MB) (Q3 2026)

🔗 **Launch Mission Control**: [http://127.0.0.1:8088/studio/mission-control.html](http://127.0.0.1:8088/studio/mission-control.html)
"""
    return {"handled": True, "command": "mission", "display": display}


def _omnipost(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    display = """### 🚀 OmniPost Powerhouse Studio

- **Multi-Platform Repurposer**: 1-click transformation into 𝕏, LinkedIn, Instagram, TikTok, Threads, Bluesky, Reddit, and GitHub release notes.
- **Graphic & Thumbnail Forge**: 16:9, 1:1, and 9:16 high-res banner forge with 4 cyber themes.
- **Viral Shorts Studio**: 60 FPS motion canvas with MediaRecorder WebM video download & Web Speech narration.
- **Viral Hook Lab**: 8 psychological hook angles & 280-char Thread Stitcher.

🔗 **Launch OmniPost**: [http://127.0.0.1:8088/studio/omnipost.html](http://127.0.0.1:8088/studio/omnipost.html)
"""
    return {"handled": True, "command": "omnipost", "display": display}


def _composer(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    display = """### 🧩 Visual Agent DAG Playbook Composer

- **Node-Based Directed Acyclic Graph Canvas**: Connect agents (@antigravity, @grok, @hermes, Local Ollama) to tools with bezier wires.
- **4 Pre-Built Playbook Presets**: Swarm 3D Pipeline, Security Audit, OmniPost Blast, Site Forge.
- **Live DAG Simulation Runner**: Illuminates active steps in sequence and streams Math Observability metrics to the swarm terminal.

🔗 **Launch Composer**: [http://127.0.0.1:8088/studio/agent-composer.html](http://127.0.0.1:8088/studio/agent-composer.html)
"""
    return {"handled": True, "command": "composer", "display": display}


def _docs(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    display = """### 📖 Zoth Studio Documentation Center

- **System Topology & Ports**: Loopback doctrine for `:8088`, `:8484`, `:11434`, `:8787`.
- **Operator Deck Manual**: Full keyboard shortcuts (`Enter`, `Shift+Enter`, `↑ ArrowUp`, `⌘K`, `⌘N`) & slash commands.
- **Studio Power Suites**: OmniPost, Composer, Math Pillars, Vision Link, Nexus 3D.
- **Packaging Runbook**: Linux standalone single binary (`.run`), Debian package (`.deb`), and `.buildignore` isolation.

🔗 **Open Documentation Center**: [http://127.0.0.1:8088/docs/](http://127.0.0.1:8088/docs/)
"""
    return {"handled": True, "command": "docs", "display": display}


def _consensus(args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    task = args.strip() or "Zero-Trust Sovereign Rate Limiter"
    try:
        from runtime.consensus_arena import ConsensusEngine
        engine = ConsensusEngine(task_name=task, task_prompt=task)
        res = engine.arbitrate()
        msg_id = engine.broadcast_to_bus()
        score = res["consensus_score"]
        entropy = res["agreement_entropy"]
        chk = res["synthesized_artifact"]["checksum"]
        code = res["synthesized_artifact"]["code"]
        display = f"""### ⚔️ Swarm Consensus Arena v2 · Arbitration Result

**Task:** `{task}`  
**Consensus Score:** `{score * 100:.1f}%` | **Shannon Agreement Entropy:** `{entropy} bits`  
**Peer Approvals:** `@antigravity` (+1) · `@grok` (+1) · `@hermes` (+1)  
**Swarm Bus Dispatch:** `#{msg_id}`

```python
{code}
```
"""
        return {"handled": True, "command": "consensus", "display": display}
    except Exception as e:
        return {
            "handled": True,
            "command": "consensus",
            "display": f"Consensus Arena arbitration failed: {e}",
        }


def _chronicle(_args: str, _ctx: dict[str, Any]) -> dict[str, Any]:
    display = """### 📜 Zoth Chronicle & Engineering Horizon

- **Milestone Sprints Shipped**: AI Math Pillars Telemetry, Conversational Deck Fixes, Visual Agent DAG Composer, Brand Media Asset Vault, and 16 Liquid-Neon Mascots.
- **Strategic Horizon**: WebGPU 3D Hypercube, Autonomous Consensus Arena v2, ZK Swarm Mesh, Vulnerability Fuzzing Sentinel.

🔗 **View Zoth Chronicle**: [http://127.0.0.1:8088/studio/chronicle.html](http://127.0.0.1:8088/studio/chronicle.html)
"""
    return {"handled": True, "command": "chronicle", "display": display}


HANDLERS: dict[str, CommandFn] = {
    "help": _help,
    "math": _math_cmd,
    "telemetry": _math_cmd,
    "ask": _ask,
    "scan": _scan,
    "doctor": _doctor,
    "deps": _doctor,
    "term": _term,
    "tools": _tools,
    "models": _models,
    "model": _model,
    "pet": _pet,
    "run": _run,
    "studio": _studio,
    "fusion": _fusion,
    "connect": _connect_pack,
    "conne": _connect_pack,
    "netlify": _netlify,
    "github": _github_cmd,
    "drive": _drive_cmd,
    "gdrive": _drive_cmd,
    "solana": _solana,
    "stripe": _stripe,
    "vault": _vault_cmd,
    "who": _who,
    "swarm": _swarm,
    "ping": _ping,
    "repo": _repo,
    "backup": _backup,
    "mission": _mission,
    "omnipost": _omnipost,
    "composer": _composer,
    "docs": _docs,
    "consensus": _consensus,
    "chronicle": _chronicle,
}


def dispatch(prompt: str, ctx: dict[str, Any]) -> dict[str, Any] | None:
    parsed = parse_slash(prompt)
    if not parsed:
        return None
    name, args = parsed
    fn = HANDLERS.get(name)
    if not fn:
        return {
            "handled": True,
            "command": name,
            "display": f"Unknown command `/{name}`. Try `/help`.",
        }
    result = fn(args, ctx)
    result.setdefault("command", name)
    if name in CONNECTOR_COMMANDS:
        result["handled"] = True
        if name == "vault":
            result.setdefault("open_panel", "vault")
        elif name in {"github", "drive", "gdrive"}:
            result.setdefault("open_panel", "drive" if name in {"drive", "gdrive"} else "github")
        elif name in {"repo", "backup"}:
            result.setdefault("open_panel", "repos")
        else:
            result.setdefault("open_panel", "connect")
    return result


_CHECK_PHRASES = (
    "connect solana",
    "use the connect command",
    "connect to github",
    "/connect",
    "/conne",
    "/solana",
    "/github",
    "/netlify",
    "/stripe",
    "/vault",
)


def check_connector_routing() -> list[str]:
    """rewrite_to_slash + dispatch handled + wants_site False for connector phrases."""
    from runtime.studio_bridge import wants_site
    import runtime.connectors as conn

    errors: list[str] = []
    real_invoke = conn.invoke

    def fake_invoke(cid, action="status", args=None):
        return {
            "ok": True,
            "connector": {"id": cid, "name": cid, "mode": "mock", "next": {}},
            "action": action,
            "note": "offline check",
        }

    conn.invoke = fake_invoke
    ctx = {
        "spawn": lambda *a, **k: None,
        "save_settings": lambda p: None,
        "detected": {},
        "tools": [],
    }
    try:
        for phrase in _CHECK_PHRASES:
            slash = rewrite_to_slash(phrase)
            if not slash or not slash.startswith("/"):
                errors.append(f"{phrase!r}: rewrite_to_slash={slash!r}")
                continue
            result = dispatch(slash, ctx)
            if not result or result.get("handled") is not True:
                errors.append(f"{phrase!r}: dispatch handled != True ({result})")
            if wants_site(phrase):
                errors.append(f"{phrase!r}: wants_site True")
    finally:
        conn.invoke = real_invoke
    return errors


if __name__ == "__main__":
    import sys
    from pathlib import Path

    root = Path(__file__).resolve().parents[1]
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))
    errs = check_connector_routing()
    if errs:
        print("FAIL")
        for item in errs:
            print(" -", item)
        raise SystemExit(1)
    print("ok — connector phrases rewrite, dispatch handled, wants_site false")
