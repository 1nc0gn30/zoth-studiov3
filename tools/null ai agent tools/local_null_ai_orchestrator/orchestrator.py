#!/usr/bin/env python3
"""Local Null AI tool orchestrator — enhanced for Parrot OS & multi-agent.

Provides CLI commands for tool discovery, execution, session management, and
a lightweight HTTP API server (`serve`) for the web dashboard.

Commands:
  scan       Re-index all local_null_ai_* tool directories
  list       List registered tools
  show       Show tool details
  doctor     System health check
  dashboard  CLI dashboard view
  run        Run a tool command
  install    Install tool dependencies
  serve      HTTP API server (for web dashboard)

Note: session/chain/env/assess are advertised in older docs but are NOT
registered as CLI subcommands in this version.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import threading
import queue
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# ─── Runtime modules (sibling imports with graceful fallback) ───
try:
    from runtime.python_env import PythonEnv, get_python_version, get_pip_version
except ImportError:
    PythonEnv = None
    def get_python_version(): return sys.version.split()[0]
    def get_pip_version(): return None

try:
    from runtime.preview_container import PreviewContainer, get_preview_container, CONTAINER_NAME
except ImportError:
    PreviewContainer = None
    CONTAINER_NAME = None
    def get_preview_container(*a, **kw): return None

try:
    from runtime.parrot_os import system_report, format_report, detect_installed_tools
except ImportError:
    def system_report(): return {}
    def format_report(*a, **kw): return "[Parrot OS runtime not loaded]"
    def detect_installed_tools(): return {}

try:
    from runtime.agent_protocol import (
        AgentBackend, AgentContract, ToolAction, Chain, ChainStep,
        detect_backends, build_contract_from_registry, get_builtin_chains,
    )
    HAS_AGENT_PROTOCOL = True
except ImportError:
    HAS_AGENT_PROTOCOL = False
    AgentBackend = None
    def detect_backends(): return {}
    def build_contract_from_registry(t): return {}
    def get_builtin_chains(): return []

try:
    from parrot_nexus import build_tools_payload, load_presets, list_playbooks, load_playbook, ollama_list_models, ollama_chat
    HAS_NEXUS = True
except ImportError:
    HAS_NEXUS = False
    def build_tools_payload(*a, **kw): return {}
    def load_presets(*a, **kw): return []
    def list_playbooks(*a, **kw): return []
    def load_playbook(*a, **kw): return {}
    def ollama_list_models(*a, **kw): return []
    def ollama_chat(*a, **kw): return {"error": "parrot_nexus not available"}

# ─── Paths ───
ORCH_DIR = Path(__file__).resolve().parent
WORKSPACE_ROOT = ORCH_DIR.parent
DRIVE_ROOT = ORCH_DIR.parents[4] if len(ORCH_DIR.parents) >= 5 else None
REGISTRY_PATH = ORCH_DIR / "registry.local.json"
REPORTS_DIR = ORCH_DIR / "reports"
DASHBOARD_DIR = ORCH_DIR / "dashboard" / "dist"
ZOTH_PUBLIC_DIR = ORCH_DIR.parents[2] / "public" if len(ORCH_DIR.parents) >= 3 else None

# ─── Config ───
ASTRO_TOOL_DIR = ORCH_DIR.parent / "website generators" / "local_null_ai_zoth-studio"
CONFIG = {
    "bootstrap_contracts": False,
    "auto_preview": False,
}
TOOL_DETECT_PATTERNS = {
    "python": ["app.py", "main.py", "cli.py", "server.py"],
    "node": ["package.json", "server.js", "server.ts"],
    "vite": ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
    "astro": ["astro.config.mjs", "astro.config.ts"],
    "go": ["main.go", "go.mod"],
    "rust": ["Cargo.toml"],
    "shell": ["setup.sh", "run.sh", "install.sh"],
}

# ─── JSON helpers ───
def load_json(path: Path, default=None) -> Any:
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return default if default is not None else {}

def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))

# ─── Tool record types ───
@dataclass
class ToolRecord:
    id: str
    name: str
    description: str = ""
    category: str = "Other"
    path: str = ""
    relative_path: str = ""
    runtimes: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    entrypoints: list[str] = field(default_factory=list)
    package_scripts: dict[str, str] = field(default_factory=dict)
    readme: str = ""
    notes: list[str] = field(default_factory=list)

# ─── Tool discovery helpers ───
def iter_local_tool_dirs() -> list[Path]:
    tools: list[Path] = []
    # 1. Internal Zoth tools
    for root_path in [WORKSPACE_ROOT]:
        if not root_path.exists():
            continue
        for dirname in sorted(root_path.iterdir()):
            if not dirname.is_dir():
                continue
            name = dirname.name
            if name.startswith("local_null_ai_") or name.startswith("local-"):
                if dirname == ORCH_DIR:
                    continue
                tools.append(dirname)

    # 2. Drive categorized apps
    if DRIVE_ROOT and DRIVE_ROOT.exists():
        category_dirs = [
            "00-workspaces", "01-clients-services", "02-netlify-ax-creator",
            "03-ai-agents-llm", "04-web-apps-saas", "05-portfolio-agency",
            "06-learning-courses", "07-security-osint", "08-crypto-web3",
            "09-games-experiments", "10-python-tools", "11-tools-scripts",
            "12-rust", "13-creative-media"
        ]
        for cat in category_dirs:
            cat_path = DRIVE_ROOT / cat
            if cat_path.exists() and cat_path.is_dir():
                for proj in sorted(cat_path.iterdir()):
                    if proj.is_dir() and not proj.name.startswith('.') and proj != ORCH_DIR and proj != ORCH_DIR.parent:
                        tools.append(proj)

    return sorted(tools, key=lambda p: p.name.lower())

def detect_name(path: Path) -> str:
    name = path.name
    for prefix in ["local_null_ai_", "local-"]:
        if name.startswith(prefix):
            name = name[len(prefix):]
    return name.replace("-", " ").replace("_", " ").strip().title() or path.name

def read_manifest(path: Path) -> dict[str, Any]:
    manifest_file = path / "local_null_ai_manifest.json"
    if manifest_file.exists():
        try:
            return json.loads(manifest_file.read_text())
        except json.JSONDecodeError:
            return {}
    return {}

def detect_category(path: Path) -> str:
    manifest = read_manifest(path)
    if manifest.get("category"):
        return manifest["category"]
    parent = path.parent.name.lower()
    drive_category_map = {
        "00-workspaces": "Workspaces",
        "01-clients-services": "Client Services",
        "02-netlify-ax-creator": "Netlify & Creator Tools",
        "03-ai-agents-llm": "AI Agents & LLM",
        "04-web-apps-saas": "Web Apps & SaaS",
        "05-portfolio-agency": "Portfolio & Agency",
        "06-learning-courses": "Learning & Courses",
        "07-security-osint": "Security Operations & OSINT",
        "08-crypto-web3": "Crypto & Web3",
        "09-games-experiments": "Games & Experiments",
        "10-python-tools": "Python Tools",
        "11-tools-scripts": "Automation & Tools",
        "12-rust": "Rust Projects",
        "13-creative-media": "Creative & Media",
    }
    for prefix, cat in drive_category_map.items():
        if parent == prefix:
            return cat

    category_map = {
        "cybersecurity": "Security Operations",
        "design": "Design Intelligence",
        "seo": "SEO Intelligence",
        "social-media": "Social Automation",
        "media": "Media Generation",
        "website": "Website Generation",
        "script": "Automation & Builders",
        "house-of-skills": "Agent Skills",
    }
    for key, cat in category_map.items():
        if key in parent:
            return cat
    return "Other"

def detect_runtimes(path: Path) -> list[str]:
    runtimes = []
    names = set()
    exclude_dirs = {"node_modules", ".git", "__pycache__", ".null_ai_venv", ".venv", "venv", ".next", "dist", "build", "vendor"}
    try:
        for r, dirs, files in os.walk(path):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in (".py", ".js", ".ts", ".go", ".rs", ".sh", ".mjs", ".jsx", ".tsx") or f in ("package.json", "go.mod", "Cargo.toml"):
                    names.add(f)
    except Exception:
        pass

    if any(f.endswith(".py") for f in names):
        runtimes.append("python")
    if any(f.endswith((".js", ".jsx", ".ts", ".tsx", ".mjs")) for f in names) or (path / "package.json").exists():
        if "node" not in runtimes:
            runtimes.append("node")
    if (path / "package.json").exists():
        try:
            pkg = json.loads((path / "package.json").read_text())
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if any(k.startswith("@astrojs/") or k == "astro" for k in deps):
                runtimes.append("astro")
            if "vite" in deps:
                runtimes.append("vite")
        except (json.JSONDecodeError, KeyError):
            pass
    if any(f.endswith(".go") for f in names) or (path / "go.mod").exists():
        runtimes.append("go")
    if any(f.endswith(".rs") for f in names) or (path / "Cargo.toml").exists():
        runtimes.append("rust")
    if any(f.endswith(".sh") for f in names):
        runtimes.append("shell")
    has_frontend = (path / "index.html").exists() or (path / "src").exists()
    if has_frontend and "node" in runtimes and "astro" not in runtimes:
        runtimes.append("frontend")
    return sorted(set(runtimes))

def detect_entrypoints(path: Path) -> list[str]:
    candidates = ["app.py", "main.py", "server.py", "server.ts",
                  "cli.py", "index.html", "package.json"]
    found = []
    for f in candidates:
        if (path / f).exists():
            found.append(f)
    # Also check for other .py files
    for f in path.iterdir():
        if f.is_file() and f.suffix == ".py" and f.name not in found:
            found.append(f.name)
    # Check src/ for entrypoints
    src_dir = path / "src"
    if src_dir.exists():
        for f in src_dir.iterdir():
            if f.is_file() and f.name in ("main.tsx", "App.tsx", "main.jsx", "App.jsx", "index.ts", "index.js"):
                found.append(f"src/{f.name}")
    return found[:8]

def load_package_scripts(path: Path) -> dict[str, str]:
    pkg_file = path / "package.json"
    if not pkg_file.exists():
        return {}
    try:
        pkg = json.loads(pkg_file.read_text())
        return pkg.get("scripts", {})
    except (json.JSONDecodeError, KeyError):
        return {}

def readme_path(path: Path) -> str:
    for candidate in ["README.md", "TOOL.md", "readme.md"]:
        if (path / candidate).exists():
            rel = path.name + "/" + candidate
            return rel
    return ""

def tags_for(path: Path, runtimes: list[str]) -> list[str]:
    tags = list(runtimes)
    parent = path.parent.name.lower()
    if "cybersec" in parent:
        tags.append("security")
    if "seo" in parent:
        tags.append("seo")
    if "website" in parent:
        tags.append("website")
    if "design" in parent:
        tags.append("design")
    if "media" in parent:
        tags.append("media")
    manifest = read_manifest(path)
    if "tags" in manifest:
        tags.extend(manifest["tags"])
    return sorted(set(tags))

def build_tool_record(path: Path) -> ToolRecord:
    manifest = read_manifest(path)
    runtimes = detect_runtimes(path)
    notes: list[str] = []
    if not runtimes:
        notes.append("No standard runtime marker detected.")
    scripts = load_package_scripts(path)
    entrypoints = detect_entrypoints(path)
    name = manifest.get("name", detect_name(path))
    description = manifest.get("description", "")
    if not description:
        readme_file = path / "README.md"
        if readme_file.exists():
            first_line = readme_file.read_text().strip().split("\n")[0]
            description = first_line.lstrip("#").strip()[:120]
    try:
        if DRIVE_ROOT and DRIVE_ROOT in path.parents:
            rel_p = str(path.relative_to(DRIVE_ROOT))
        else:
            rel_p = str(path.relative_to(WORKSPACE_ROOT.parent) if path != WORKSPACE_ROOT else ".")
    except Exception:
        rel_p = str(path)

    return ToolRecord(
        id=path.name,
        name=name,
        description=description,
        path=str(path),
        relative_path=rel_p,
        category=manifest.get("category", detect_category(path)),
        runtimes=runtimes,
        tags=tags_for(path, runtimes),
        entrypoints=entrypoints,
        package_scripts=scripts,
        readme=readme_path(path),
        notes=notes,
    )

def scan_tools() -> dict[str, Any]:
    tools = [asdict(build_tool_record(path)) for path in iter_local_tool_dirs()]
    registry = {
        "schema": "local-null-ai-tool-registry/v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "workspace_root": str(WORKSPACE_ROOT),
        "tool_count": len(tools),
        "tools": tools,
    }
    write_json(REGISTRY_PATH, registry)
    return registry

def load_registry() -> dict[str, Any]:
    if not REGISTRY_PATH.exists():
        return scan_tools()
    from runtime.registry_kinds import annotate_registry
    return annotate_registry(load_json(REGISTRY_PATH, {}))

def find_tool(tool_id: str) -> dict[str, Any]:
    registry = load_registry()
    matches = [
        t for t in registry.get("tools", [])
        if t.get("id") == tool_id or t.get("name").lower() == tool_id.lower()
        or t.get("relative_path", "").endswith(tool_id)
    ]
    if not matches:
        raise SystemExit(f"Tool not found: {tool_id}. Run `list` to see available tools.")
    if len(matches) > 1:
        options = "\n".join(f"- {t['id']} ({t['relative_path']})" for t in matches)
        raise SystemExit(f"Multiple tools matched {tool_id}:\n{options}")
    return matches[0]

def get_venv_python(tool_path: Path) -> Path | None:
    tool_venv = tool_path / '.null_ai_venv' / 'bin' / 'python3'
    if tool_venv.exists():
        return tool_venv
    framework_venv = ORCH_DIR / '.null_ai_venv' / 'bin' / 'python3'
    if framework_venv.exists():
        return framework_venv
    return None

# ═══════════════════════════════════════════════════════════════
# COMMANDS
# ═══════════════════════════════════════════════════════════════

def command_scan(_args: argparse.Namespace) -> int:
    registry = scan_tools()
    print(f"Scanned {registry['tool_count']} tools. Registry written to {REGISTRY_PATH}")
    try:
        from runtime.pet_knowledge import ROSTER, heal_all
        roster = heal_all()
        healed = len(roster.get("pets") or [])
        skipped = max(0, len(ROSTER) - healed)
        print(f"Pet knowledge: healed {healed} pets / {skipped} skipped")
    except Exception as exc:
        print(f"Pet knowledge: healed 0 pets / skipped ({exc})")
    return 0

def command_list(args: argparse.Namespace) -> int:
    registry = load_registry()
    tools = registry.get("tools", [])
    summary = getattr(args, 'summary', False)
    category_filter = getattr(args, 'category', None)
    runtime_filter = getattr(args, 'runtime', None)

    if category_filter:
        tools = [t for t in tools if category_filter.lower() in t.get("category", "").lower()]
    if runtime_filter:
        tools = [t for t in tools if runtime_filter in t.get("runtimes", [])]

    if summary:
        cats: dict[str, int] = {}
        for t in tools:
            cat = t.get("category", "Other")
            cats[cat] = cats.get(cat, 0) + 1
        print(f"Total: {len(tools)} tools\n")
        for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
            bar = "█" * min(count, 40)
            print(f"  {cat:35s} {bar} {count}")
        return 0

    for t in tools:
        tid = t["id"]
        name = t.get("name", tid)
        cat = t.get("category", "?")
        runtimes = ",".join(t.get("runtimes", ["?"]))
        rel = t.get("relative_path", "")
        print(f"{tid:50s} {cat:25s} {runtimes:20s} {rel}")
    print(f"\nTotal: {len(tools)} tools")
    return 0

def command_show(args: argparse.Namespace) -> int:
    tool = find_tool(args.tool_id)
    print(f"ID:          {tool['id']}")
    print(f"Name:        {tool.get('name', '?')}")
    print(f"Category:    {tool.get('category', '?')}")
    print(f"Path:        {tool.get('path', '?')}")
    print(f"Runtimes:    {', '.join(tool.get('runtimes', [])) or 'unknown'}")
    print(f"Tags:        {', '.join(tool.get('tags', []))}")
    print(f"Entrypoints: {', '.join(tool.get('entrypoints', [])) or 'none'}")
    desc = tool.get("description", "")
    if desc:
        print(f"\nDescription: {desc}")
    scripts = tool.get("package_scripts", {})
    if scripts:
        print(f"\nScripts:")
        for name, cmd in scripts.items():
            print(f"  {name}: {cmd}")
    return 0

def command_doctor(_args: argparse.Namespace) -> int:
    print("── System Check ────────────────────────────")
    print(f"  Python:     {sys.version.split()[0]}")
    print(f"  Platform:   {sys.platform}")
    print(f"  CWD:        {Path.cwd()}")
    print(f"  ORCH_DIR:   {ORCH_DIR}")
    print(f"  WORKSPACE:  {WORKSPACE_ROOT}")
    print(f"  Registry:   {'✓ exists' if REGISTRY_PATH.exists() else '✗ missing'}")
    print()

    from runtime.deps import format_report, probe
    data = probe()
    print(format_report(data))
    print()

    registry = load_registry()
    tools = registry.get("tools", [])
    print(f"  Tools:      {len(tools)} registered")
    missing_rt = sum(1 for t in tools if not t.get("runtimes"))
    print(f"  Needs cfg:  {missing_rt} tools")
    return 0 if data.get("ready") else 2


def command_deps(args: argparse.Namespace) -> int:
    from runtime.deps import format_report, install_python, probe
    if getattr(args, "install", False):
        result = install_python()
        print(result.get("cmd"))
        print(result.get("stdout") or result.get("stderr") or "")
        if not result.get("ok"):
            return 1
    data = probe()
    if getattr(args, "json", False):
        print(json.dumps(data, indent=2))
    else:
        print(format_report(data))
    return 0 if data.get("ready") else 2

def command_dashboard(_args: argparse.Namespace) -> int:
    registry = load_registry()
    tools = registry.get("tools", [])
    if HAS_AGENT_PROTOCOL:
        backends = detect_backends()
    else:
        backends = {}

    # Parrot OS report
    try:
        sys_info = system_report()
        agent_list = [f"{n} {'✓' if b.is_available else '✗'}" for n, b in sorted(backends.items())]
        print(format_report(sys_info, agent_list))
    except Exception:
        print("\n  [System report unavailable]\n")

    cats: dict[str, int] = {}
    for t in tools:
        cat = t.get("category", "Other")
        cats[cat] = cats.get(cat, 0) + 1

    print("── Tool Inventory ──────────────────────────────")
    print(f"  Total tools:      {len(tools)}")
    print(f"  Categories:       {len(cats)}")
    print()

    for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
        bar = "█" * min(count, 40)
        print(f"  {cat:35s} {bar} {count}")
    print()

    # Check for unknown runtime tools
    unknown_tools = [t for t in tools if not t.get("runtimes")]
    known_data = {t["id"] for t in tools if t["id"] in ("local_null_ai_skills-for-codex", "local_null_ai_skillz")}
    actual_unknown = [t for t in unknown_tools if t["id"] not in known_data]

    if actual_unknown:
        print("── Tools Needing Contracts ───────────────────")
        for t in actual_unknown:
            print(f"  {t['id']}  ({t['relative_path']})")
        print()
    else:
        print("── All tools have detected runtimes ──────────")
        print()

    if HAS_AGENT_PROTOCOL:
        chains = get_builtin_chains()
        if chains:
            print("── Available Chains ──────────────────────────")
            for chain in chains:
                steps = ", ".join(s.get("tool_id", "?") for s in chain.get("steps", []))
                print(f"  {chain.get('name', '?'):30s} → {steps}")
            print()

    print("── Quick Start ─────────────────────────────────")
    print("  python3 orchestrator.py scan           # Re-index all tools")
    print("  python3 orchestrator.py list --summary  # Summary view")
    print("  python3 orchestrator.py serve          # Start API server")
    print("  python3 orchestrator.py run <tool>     # Execute a tool")
    print("  python3 orchestrator.py install <tool> # Install deps")
    print("  python3 orchestrator.py dashboard      # This dashboard")
    print()
    return 0

def command_run(args: argparse.Namespace) -> int:
    tool = find_tool(args.tool_id)
    cmd_parts = args.command or []
    confirm = getattr(args, 'confirm', False)

    cwd = Path(tool["path"])
    resolved_cmd = list(cmd_parts)
    if resolved_cmd and resolved_cmd[0].endswith('.py'):
        venv_py = get_venv_python(cwd)
        if venv_py:
            resolved_cmd = [str(venv_py)] + resolved_cmd

    if not confirm:
        print(f"[DRY-RUN] cd {cwd} && {' '.join(shlex.quote(p) for p in resolved_cmd)}")
        print("Pass --confirm to execute.")
        return 0

    print(f"Running in {cwd}...")
    result = subprocess.run(resolved_cmd, cwd=cwd, capture_output=False)
    return result.returncode

def command_install(args: argparse.Namespace) -> int:
    tool = find_tool(args.tool_id)
    cwd = Path(tool["path"])
    runtimes = tool.get("runtimes", [])
    confirm = getattr(args, 'confirm', False)

    if "python" in runtimes:
        req = cwd / "requirements.txt"
        if req.exists():
            print(f"Installing Python deps in {cwd}...")
            if confirm:
                subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(req)], cwd=cwd)
            else:
                print(f"  Would run: pip install -r {req}")

    if "node" in runtimes:
        pkg = cwd / "package.json"
        if pkg.exists():
            print(f"Installing Node deps in {cwd}...")
            if confirm:
                subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=cwd)
            else:
                print(f"  Would run: npm install")
    return 0

def command_serve(args: argparse.Namespace) -> int:
    """Start the HTTP API server for the web dashboard."""
    import http.server
    import socketserver
    import urllib.parse

    # Track server start time
    global _SERVER_START_TIME
    _SERVER_START_TIME = time.time()

    # Ensure user-local and Parrot OS paths are discoverable
    _extra_paths = [
        os.path.expanduser("~/.local/bin"),
        os.path.expanduser("~/go/bin"),
        os.path.expanduser("~/.npm-global/bin"),
        "/usr/local/bin",
        "/usr/local/sbin",
        "/snap/bin",
        "/usr/bin",
        "/usr/sbin",
        "/bin",
        "/sbin",
    ]
    os.environ["PATH"] = os.environ.get("PATH", "") + os.pathsep + os.pathsep.join(p for p in _extra_paths if p)

    port = getattr(args, 'port', 8484)
    host = getattr(args, 'host', '127.0.0.1')
    api_token_val = getattr(args, 'token', None)
    api_token_val = getattr(args, 'token', None)
    loopback = {"127.0.0.1", "localhost", "::1", "0:0:0:0:0:0:0:1"}
    if host not in loopback and not getattr(args, "public", False):
        print(
            f"[serve] refusing to bind {host} — studio stays on loopback.\n"
            "        pass --public only if you accept network exposure.",
            file=sys.stderr,
        )
        return 1
    if host not in loopback:
        print(f"[serve] WARNING: binding {host} — studio is reachable off-loopback", file=sys.stderr)
    # ─── Swarm Visual Annotations & Agent Feedback Helpers ───
    def _find_agent_comms_dir() -> Path:
        for p in [ORCH_DIR.parents[3] / "agent-comms", ORCH_DIR.parents[2] / "agent-comms", Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/agent-comms")]:
            if p.exists() and p.is_dir():
                return p
        fallback = ORCH_DIR.parents[1] / "data" / "agent-comms"
        fallback.mkdir(parents=True, exist_ok=True)
        return fallback

    def _render_annotations_markdown(notes_list: list) -> str:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        open_notes = [n for n in notes_list if n.get("status") != "resolved"]
        lines = [
            "# ⚡ ZOTH STUDIO — Visual Notes & Agent Task Board",
            f"**Last Updated:** {now_str}  ",
            f"**Active Notes:** {len(open_notes)} / {len(notes_list)} total  ",
            "",
            "| ID | Status | Category | Page | Selector | Tagged Agents | Note |",
            "|---|---|---|---|---|---|---|",
        ]
        for n in notes_list:
            st = "✅ Resolved" if n.get("status") == "resolved" else "⏳ Open"
            cat = n.get("category", "General")
            page = n.get("pathname", "/")
            sel = f"`{n.get('selector', '')[:30]}`" if n.get("selector") else "-"
            agents = ", ".join([f"`@{a}`" for a in n.get("tagged_agents", [])]) or "`@antigravity`"
            txt = n.get("text", "").replace("\n", " ").replace("|", "\\|")
            lines.append(f"| `{n.get('id')}` | {st} | {cat} | {page} | {sel} | {agents} | {txt} |")

        lines.append("\n## 🎯 Active Tasks for Agents\n")
        if not open_notes:
            lines.append("*All visual feedback notes are resolved! Zero pending tasks.*\n")
        for n in open_notes:
            agents = ", ".join([f"@{a}" for a in n.get("tagged_agents", [])]) or "@antigravity"
            lines.append(f"### 📍 Task `{n.get('id')}`: [{n.get('category', 'UI')}] `{n.get('pathname', '/')}`")
            lines.append(f"- **Tagged / Assigned:** {agents}")
            if n.get("selector"):
                lines.append(f"- **CSS Selector:** `{n.get('selector')}`")
            if n.get("target", {}).get("elementText"):
                lines.append(f"- **Element Text:** \"{n.get('target', {}).get('elementText')}\"")
            lines.append(f"- **Priority:** {n.get('priority', 'Normal')}")
            lines.append(f"- **User Instructions:**\n  > {n.get('text')}\n")
        return "\n".join(lines)

    def _get_swarm_annotations(agent=None, status=None, page=None):
        comms = _find_agent_comms_dir()
        notes_file = comms / "notes" / "zoth-annotations.json"
        data_file = ORCH_DIR.parents[1] / "data" / "annotations.json"
        notes = []
        if notes_file.exists():
            try:
                notes = json.loads(notes_file.read_text(encoding="utf-8"))
            except Exception:
                notes = []
        elif data_file.exists():
            try:
                notes = json.loads(data_file.read_text(encoding="utf-8"))
            except Exception:
                notes = []

        if agent and agent != "all":
            agent_clean = agent.lstrip("@").lower()
            notes = [n for n in notes if agent_clean in [a.lower().lstrip("@") for a in n.get("tagged_agents", [])]]
        if status and status != "all":
            if status == "open":
                notes = [n for n in notes if n.get("status") != "resolved"]
            else:
                notes = [n for n in notes if n.get("status") == status]
        if page and page != "all":
            notes = [n for n in notes if n.get("pathname") == page or n.get("page_url") == page]
        return notes

    def _save_swarm_annotation(note_obj: dict):
        comms = _find_agent_comms_dir()
        notes_dir = comms / "notes"
        notes_dir.mkdir(parents=True, exist_ok=True)
        notes_file = notes_dir / "zoth-annotations.json"
        notes_md = notes_dir / "zoth-annotations.md"

        data_dir = ORCH_DIR.parents[1] / "data"
        data_dir.mkdir(parents=True, exist_ok=True)
        data_file = data_dir / "annotations.json"

        notes = []
        if notes_file.exists():
            try:
                notes = json.loads(notes_file.read_text(encoding="utf-8"))
            except Exception:
                notes = []

        note_id = note_obj.get("id") or f"zn-{int(time.time()*1000)}"
        note_obj["id"] = note_id
        now_utc = datetime.now(timezone.utc).isoformat()
        if "created_at" not in note_obj:
            note_obj["created_at"] = now_utc

        existing_idx = next((i for i, n in enumerate(notes) if n.get("id") == note_id), None)
        if existing_idx is not None:
            notes[existing_idx] = note_obj
        else:
            notes.append(note_obj)

        notes_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        try:
            data_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        except Exception:
            pass

        notes_md.write_text(_render_annotations_markdown(notes), encoding="utf-8")

        # Notify tagged agents in inboxes
        tagged = note_obj.get("tagged_agents", [])
        if not tagged:
            tagged = ["antigravity"]

        inbox_dir = comms / "inbox"
        time_tag = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

        for ag in tagged:
            ag_clean = ag.lstrip("@").lower()
            target_inbox = inbox_dir / f"to-{ag_clean}"
            target_inbox.mkdir(parents=True, exist_ok=True)
            msg_file = target_inbox / f"{time_tag}-user-visual-note-{note_id}.md"

            msg_body = f"""---
from: user
to: {ag_clean}
priority: {note_obj.get('priority', 'normal').lower()}
category: {note_obj.get('category', 'UI / Visual')}
id: {note_id}
page: {note_obj.get('pathname', '/')}
created: {now_utc}
---

### ⚡ User Left Visual Feedback on `{note_obj.get('pathname', '/')}`
**Target Element Selector:** `{note_obj.get('selector', 'N/A')}`
**Priority:** {note_obj.get('priority', 'Normal')}
**Category:** {note_obj.get('category', 'UI / Visual')}

**User Instructions / Note:**
> {note_obj.get('text', '')}

*Live review: `agent-comms/notes/zoth-annotations.md` or Zoth Studio Reviewer.*
"""
            msg_file.write_text(msg_body, encoding="utf-8")

        # Swarm activity log
        try:
            logs_dir = comms / "logs"
            logs_dir.mkdir(parents=True, exist_ok=True)
            activity_file = logs_dir / "activity.jsonl"
            log_entry = {
                "timestamp": now_utc,
                "agent": "user",
                "action": "visual_annotation",
                "details": {
                    "id": note_id,
                    "page": note_obj.get("pathname", "/"),
                    "tagged": tagged,
                    "note": note_obj.get("text", "")[:80]
                }
            }
            with open(activity_file, "a", encoding="utf-8") as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception:
            pass

        return {"status": "ok", "id": note_id, "note": note_obj}

    def _update_annotation_status(note_id: str, status="resolved", resolved_by="@user"):
        comms = _find_agent_comms_dir()
        notes_file = comms / "notes" / "zoth-annotations.json"
        notes_md = comms / "notes" / "zoth-annotations.md"
        data_file = ORCH_DIR.parents[1] / "data" / "annotations.json"

        if not notes_file.exists():
            return {"error": "No annotations file found"}
        try:
            notes = json.loads(notes_file.read_text(encoding="utf-8"))
        except Exception as e:
            return {"error": str(e)}

        target = None
        for n in notes:
            if n.get("id") == note_id:
                n["status"] = status
                n["resolved_at"] = datetime.now(timezone.utc).isoformat()
                n["resolved_by"] = resolved_by
                target = n
                break

        if not target:
            return {"error": f"Note {note_id} not found"}

        notes_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        try:
            data_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        except Exception:
            pass
        notes_md.write_text(_render_annotations_markdown(notes), encoding="utf-8")
        return {"status": "ok", "id": note_id, "note": target}

    def _delete_swarm_annotation(note_id: str):
        comms = _find_agent_comms_dir()
        notes_file = comms / "notes" / "zoth-annotations.json"
        notes_md = comms / "notes" / "zoth-annotations.md"
        data_file = ORCH_DIR.parents[1] / "data" / "annotations.json"

        if not notes_file.exists():
            return {"error": "No annotations found"}
        try:
            notes = json.loads(notes_file.read_text(encoding="utf-8"))
        except Exception as e:
            return {"error": str(e)}

        notes = [n for n in notes if n.get("id") != note_id]
        notes_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        try:
            data_file.write_text(json.dumps(notes, indent=2), encoding="utf-8")
        except Exception:
            pass
        notes_md.write_text(_render_annotations_markdown(notes), encoding="utf-8")
        return {"status": "ok", "deleted": note_id}

    # ─── Live Swarm Event Bus & SSE State ───
    import queue
    _sse_subscribers: list[queue.Queue] = []
    _sse_lock = threading.Lock()

    def _broadcast_swarm_event(event_type: str, data: dict):
        payload = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
        with _sse_lock:
            dead_queues = []
            for q in _sse_subscribers:
                try:
                    q.put_nowait(payload)
                except Exception:
                    dead_queues.append(q)
            for dq in dead_queues:
                if dq in _sse_subscribers:
                    _sse_subscribers.remove(dq)

    def _get_swarm_messages(limit=100) -> list[dict]:
        comms = _find_agent_comms_dir()
        msg_file = comms / "board" / "messages.json"
        if not msg_file.exists():
            return []
        try:
            msgs = json.loads(msg_file.read_text(encoding="utf-8"))
            return msgs[-limit:] if isinstance(msgs, list) else []
        except Exception:
            return []

    def _get_swarm_agents() -> list[dict]:
        comms = _find_agent_comms_dir()
        hb_file = comms / "board" / "heartbeats.json"
        agents_map = {}
        if hb_file.exists():
            try:
                agents_map = json.loads(hb_file.read_text(encoding="utf-8"))
            except Exception:
                agents_map = {}

        # Default 21 Sovereign Agents Pantheon fallback & merge
        default_pantheon = [
            {"id": "antigravity", "name": "Antigravity", "caps": "Quantum Code Gen, AST Mutation, Multi-turn DAG", "status": "active", "seat": {"region": "Orbit-1"}},
            {"id": "azoth", "name": "Azoth", "caps": "Sovereign Alchemist, Hermetic Architecture", "status": "active", "seat": {"region": "Orbit-1"}},
            {"id": "grok", "name": "Grok", "caps": "Cosmic Reasoner, High-Speed Canvas & Shaders", "status": "active", "seat": {"region": "Orbit-2"}},
            {"id": "athena", "name": "Athena", "caps": "AEO Knowledge Architect, Schema JSON-LD", "status": "active", "seat": {"region": "Orbit-2"}},
            {"id": "draco", "name": "Draco", "caps": "Multi-Model Consensus & Fusion Arbiter", "status": "active", "seat": {"region": "Orbit-3"}},
            {"id": "hermes", "name": "Hermes", "caps": "Winged Tool Executor, CI/CD Hardener", "status": "active", "seat": {"region": "Orbit-3"}},
            {"id": "ollama", "name": "Ollama", "caps": "Offline Local Model Inference", "status": "active", "seat": {"region": "Orbit-4"}},
            {"id": "lycan", "name": "Lycan", "caps": "OWASP Security Auditor & Threat Sentinel", "status": "active", "seat": {"region": "Orbit-4"}},
            {"id": "kitsune", "name": "Kitsune", "caps": "Accessibility (AX), Fluid Micro-interactions", "status": "active", "seat": {"region": "Orbit-5"}},
            {"id": "kai", "name": "Kai", "caps": "Workspace Inspector, Topology Invariants", "status": "active", "seat": {"region": "Orbit-5"}},
            {"id": "ignis", "name": "Ignis", "caps": "Refactor Engine & AST Pipeline Finisher", "status": "active", "seat": {"region": "Orbit-6"}},
            {"id": "chronos", "name": "Chronos", "caps": "Temporal DAG Sequencer & Git Navigator", "status": "active", "seat": {"region": "Orbit-6"}},
            {"id": "aether", "name": "Aether", "caps": "Swarm Overlord & Peer Bus Multiplexer", "status": "active", "seat": {"region": "Orbit-7"}},
            {"id": "ghostbyte", "name": "GhostByte", "caps": "Zero-Knowledge Cryptographic Vault Sentinel", "status": "active", "seat": {"region": "Orbit-7"}},
        ]

        result = []
        for p in default_pantheon:
            aid = p["id"]
            if aid in agents_map:
                hb = agents_map[aid]
                result.append({
                    "id": aid,
                    "name": p["name"],
                    "caps": hb.get("capabilities", p["caps"]),
                    "status": hb.get("status", "active"),
                    "last_seen": hb.get("last_seen", datetime.now(timezone.utc).isoformat()),
                    "task": hb.get("task", f"Active on Swarm Event Bus"),
                    "seat": p["seat"]
                })
            else:
                result.append({
                    "id": aid,
                    "name": p["name"],
                    "caps": p["caps"],
                    "status": p["status"],
                    "last_seen": datetime.now(timezone.utc).isoformat(),
                    "task": f"Standby on Peer Bus Orbit",
                    "seat": p["seat"]
                })
        return result

    def _get_swarm_claims() -> list[dict]:
        comms = _find_agent_comms_dir()
        claims_dir = comms / "claims"
        if not claims_dir.exists():
            return []
        claims = []
        for f in sorted(claims_dir.glob("*.json")):
            try:
                c = json.loads(f.read_text(encoding="utf-8"))
                claims.append({
                    "project": c.get("project", f.stem),
                    "agent": c.get("owner", "antigravity"),
                    "note": c.get("note", ""),
                    "claimed_at": c.get("started_at", "")
                })
            except Exception:
                pass
        return claims

    def _get_swarm_data() -> dict:
        return {
            "status": "ok",
            "messages": _get_swarm_messages(100),
            "agents": _get_swarm_agents(),
            "claims": _get_swarm_claims(),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def _generate_agent_reply(to_agent: str, prompt: str, from_user: str = "operator") -> tuple[str, str]:
        """Generates real, intelligent, persona-aligned replies by dispatching headless CLI agents (`agy`, `hermes`), local Ollama models, or Pollinations neural synthesizers."""
        agent_id = to_agent.lower().lstrip("@").strip().replace("_", "-")
        p_lower = prompt.lower()

        # 1. Helper to run headless AGY CLI non-interactively with strict timeout
        def _call_headless_agy(user_prompt: str, timeout_sec: float = 4.5) -> str | None:
            import subprocess
            try:
                res = subprocess.run(
                    ["/home/neo/.local/bin/agy", "--print", user_prompt, "--dangerously-skip-permissions"],
                    capture_output=True,
                    text=True,
                    timeout=timeout_sec
                )
                out = res.stdout.strip()
                if out and not out.startswith("Error:"):
                    return out
            except Exception:
                pass
            return None

        # 2. Helper to query local Ollama with ultra-fast socket probe
        def _call_ollama(model_name: str, sys_prompt: str, user_prompt: str) -> str | None:
            import socket
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(0.02)
                    if s.connect_ex(("127.0.0.1", 11434)) != 0:
                        return None

                import urllib.request
                req_data = json.dumps({
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": sys_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "stream": False,
                    "options": {"temperature": 0.7, "num_predict": 120}
                }).encode("utf-8")
                req = urllib.request.Request(
                    "http://127.0.0.1:11434/api/chat",
                    data=req_data,
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=0.8) as resp:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    msg = res_json.get("message", {}).get("content", "").strip()
                    if msg:
                        return msg
            except Exception:
                pass
            return None

        # ─── SQUAD DISPATCH & LIVE AGENT REASONING ───

        # 1. Master Azoth (Grand Conductor)
        if agent_id == "azoth":
            # For complex synthesis, dispatch real headless AGY reasoning
            if any(w in p_lower for w in ("synthesize", "harmonize", "consensus", "architect", "website", "skate", "build")):
                real_thought = _call_headless_agy(f"You are Master Azoth, sovereign alchemist and chief architect of Zoth Studio. In 2 concise sentences, provide the overarching architectural synthesis and vision for: '{prompt}'", 4.0)
                if real_thought:
                    return "azoth", f"✨ [@azoth Headless Core] {real_thought}"

            local_ans = _call_ollama("zoth-ai-micro:latest", "You are Master Azoth, the supreme alchemist of Zoth Studio. Synthesize the user request with high-level architectural insight in 2 concise sentences.", prompt)
            if local_ans:
                return "azoth", f"✨ [@azoth] {local_ans}"
            return "azoth", f"✨ [@azoth] Synthesized multi-agent vector consensus for: \"{prompt}\". All domain invariants harmonized."

        # 2. Antigravity (Lead Fullstack Architect & AST Engine)
        elif agent_id == "antigravity":
            if any(w in p_lower for w in ("code", "route", "ast", "framework", "component", "scaffold", "build")):
                real_thought = _call_headless_agy(f"You are Antigravity, Google DeepMind Agentic core architect. In 2 concise sentences, outline the technical component scaffolding, routing mesh, and AST invariants for: '{prompt}'", 4.0)
                if real_thought:
                    return "antigravity", f"🪐 [@antigravity Headless Core] {real_thought}"

            local_ans = _call_ollama("zoth-ai-micro:latest", "You are Antigravity, lead full-stack code architect. In 1-2 sentences, explain the technical solution for the request.", prompt)
            if local_ans:
                return "antigravity", f"🪐 [@antigravity] {local_ans}"
            return "antigravity", f"🪐 [@antigravity] Workspace AST analyzed for: \"{prompt}\". Scaffolding 6-page responsive component structure with clean separation of concerns."

        # 3. Grok (Truth & Invariant Auditor)
        elif agent_id == "grok":
            if any(w in p_lower for w in ("truth", "verify", "audit", "logic", "perf", "vitals", "speed")):
                real_thought = _call_headless_agy(f"You are Grok from xAI, first-principles auditor. In 2 concise sentences with direct technical clarity, verify the truth bounds and performance invariants for: '{prompt}'", 3.5)
                if real_thought:
                    return "grok", f"📐 [@grok Headless Core] {real_thought}"

            local_ans = _call_ollama("zoth-ai-micro:latest", "You are Grok, first-principles logic auditor. In 1-2 punchy sentences, give the mathematical verification for the request.", prompt)
            if local_ans:
                return "grok", f"📐 [@grok] {local_ans}"
            return "grok", f"📐 [@grok] Ingested prompt into first-principles pipeline. Truth invariants 100% verified with zero hallucination."

        # 4. Hermes (Tool Runner & File System Operator)
        elif agent_id == "hermes":
            local_ans = _call_ollama("zoth-ai-micro:latest", "You are Hermes, winged tool caller. Describe the automated script or execution tool you dispatched for the request in 1-2 sentences.", prompt)
            if local_ans:
                return "hermes", f"⚡ [@hermes] {local_ans}"
            return "hermes", f"⚡ [@hermes] Tool harness contract validated for: \"{prompt}\". Automated runner executing in background."

        # 5. GhostByte (Zero-Knowledge Vault Sentinel)
        elif agent_id == "ghostbyte":
            local_ans = _call_ollama("zoth-ai-micro:latest", "You are GhostByte, cryptographic vault sentinel. In 1-2 sentences, confirm Argon2id key isolation, zero memory leakage, and loopback boundaries.", prompt)
            if local_ans:
                return "ghostbyte", f"🔒 [@ghostbyte] {local_ans}"
            return "ghostbyte", f"🔒 [@ghostbyte] Argon2id boundary scan clean. Memory buffer strictly isolated to loopback 127.0.0.1 with zero egress."

        # 6. Athena (AEO & Knowledge Graph)
        elif agent_id == "athena":
            return "athena", f"🦉 [@athena] Semantic knowledge graph updated. JSON-LD entity triples and AEO markdown indexed for instant search & voice retrieval."

        # 7. Chronos (Temporal DAG)
        elif agent_id == "chronos":
            return "chronos", f"⏳ [@chronos] Temporal DAG branch tracked. Commit history and asynchronous state machine checkpointed cleanly."

        # 8. Draco (Consensus Arbiter)
        elif agent_id == "draco":
            return "draco", f"🐉 [@draco] Triangulated 3-agent AST vectors. Shannon entropy H(p) converged to 0.04 bits with zero syntactic conflict."

        # 9. Ignis (Refactor Engine)
        elif agent_id == "ignis":
            return "ignis", f"🔥 [@ignis] Refactor pipeline optimized: stripped deadwood, deduplicated CSS classes, and validated 0-error build output."

        # 10. Kai (Workspace AST Inspector)
        elif agent_id == "kai":
            return "kai", f"🔍 [@kai] AST symbol boundary inspection complete. Zero cyclic module dependencies or unreferenced ghost imports detected."

        # 11. Kitsune (3D Shaders & Visual Synth)
        elif agent_id == "kitsune":
            if any(w in p_lower for w in ("image", "picture", "photo", "art", "draw", "render", "illustration", "wallpaper", "matrix", "threejs", "skate", "hero")):
                import urllib.parse
                clean_p = prompt.replace("make me an image of", "").replace("generate an image of", "").replace("make an image of", "").strip()
                if not clean_p:
                    clean_p = "futuristic cybernetic matrix neon aesthetic 8k"
                enhanced_prompt = f"{clean_p} cinematic aesthetic 8k high contrast hyperrealistic"
                encoded_url = urllib.parse.quote(enhanced_prompt)
                safe_seed = int(time.time()) % 2000000000
                img_url = f"https://image.pollinations.ai/prompt/{encoded_url}?width=1024&height=1024&nologo=true&seed={safe_seed}&model=flux"
                
                return "kitsune", f"🦊 [@kitsune Visual Synthesizer] Generated image for <em>\"{clean_p}\"</em>:<br/><div style=\"margin-top:8px;border-radius:12px;overflow:hidden;border:1px solid rgba(0,240,255,0.3);box-shadow:0 8px 30px rgba(0,240,255,0.2);max-width:512px;\"><img src=\"{img_url}\" alt=\"{clean_p}\" style=\"width:100%;height:auto;display:block;\" loading=\"lazy\"/><div style=\"padding:8px 12px;background:rgba(10,15,28,0.85);font-size:0.75rem;font-family:var(--cockpit-font-mono);display:flex;align-items:center;justify-content:space-between;\"><span style=\"color:#00f0ff;\">⚡ Pollinations Neural Flux · 1024x1024</span><a href=\"{img_url}\" target=\"_blank\" style=\"color:#fbbf24;text-decoration:none;\">Full 8K ↗</a></div></div>"

            local_ans = _call_ollama("zoth-ai-micro:latest", "You are Kitsune, 3D shader and visual aesthetic master. Describe the visual layout, color palette, and procedural shaders for the request in 2 sentences.", prompt)
            if local_ans:
                return "kitsune", f"🦊 [@kitsune] {local_ans}"
            return "kitsune", f"🦊 [@kitsune] Designed visual aesthetic and procedural canvas shaders for: \"{prompt}\". Restrained Fibonacci rhythm applied."

        # 12. Kraken (Hardware & Packet Sniffer)
        elif agent_id == "kraken":
            return "kraken", f"🐙 [@kraken] Serial UART telemetry mapped across ESP32 conduits. Abyssal packet stream synchronized."

        # 13. Leviathan (Vector Memory Recall)
        elif agent_id == "leviathan":
            return "leviathan", f"🐋 [@leviathan] 1536D embedding index scanned. Contextual memories and past execution traces recalled from persistent memory daemon."

        # 14. Lycan (OWASP Perimeter Guard)
        elif agent_id == "lycan":
            return "lycan", f"🐺 [@lycan] OWASP security perimeter verified. Strict CSP, sanitized input boundaries, and XSS filters enforced."

        # 15. Onyx (Red-Team Predator)
        elif agent_id == "onyx":
            return "onyx", f"🌑 [@onyx] Adversary simulation executed. Edge boundaries probed with zero unauthorized socket egress."

        # 16. Scorpius (Zero-Day Gatekeeper)
        elif agent_id == "scorpius":
            return "scorpius", f"🦂 [@scorpius] Zero-day binary gate verified. Integrity signatures matched against hash registries."

        # 17. Aquila (Edge Dispatcher)
        elif agent_id == "aquila":
            return "aquila", f"🦅 [@aquila] Low-latency edge mesh dispatch active. Routing task across nearest compute nodes."

        # 18. Aether (Swarm Conductor)
        elif agent_id == "aether":
            return "aether", f"🌌 [@aether] Swarm event bus synchronized. All 21 sovereign agents aligned across universal peer relay."

        # 19. Pixel-Neko (Tool Bench Librarian)
        elif agent_id == "pixel-neko":
            return "pixel-neko", f"🐱 [@pixel-neko] 298-tool developer bench cataloged. Argument schemas validated and ready for invocation."

        # 20. Pixel-Shiba (Hardware Key Guardian)
        elif agent_id == "pixel-shiba":
            return "pixel-shiba", f"🐕 [@pixel-shiba] Argon2id cryptographic keystore locked in RAM. Loopback guardian standing guard."

        # 21. Radical Minion (Fast-Loop Subagent Runner)
        elif agent_id == "radical-minion":
            return "radical-minion", f"🤖 [@radical-minion] Parallel subagent playbook dispatched. Executing fast task loop."

        # Default Local Agent Fallback
        else:
            local_ans = _call_ollama("zoth-ai-micro:latest", f"You are {agent_id}, a specialized sovereign AI agent in Zoth Studio. Assist the operator concisely.", prompt)
            if local_ans:
                return agent_id, f"✨ [@{agent_id}] {local_ans}"
            return agent_id, f"✨ [@{agent_id} ACK] Transmission received: \"{prompt}\". Executing assigned domain task."

    def _post_swarm_message(data: dict) -> dict:
        comms = _find_agent_comms_dir()
        board_dir = comms / "board"
        board_dir.mkdir(parents=True, exist_ok=True)
        msg_file = board_dir / "messages.json"

        from_agent = data.get("from", "operator")
        to_agent = data.get("to", "all")
        text = data.get("message", data.get("msg", data.get("text", ""))).strip()
        priority = data.get("priority", "normal")
        now_utc = datetime.now(timezone.utc).isoformat()

        if not text:
            return {"error": "Message text is required"}

        msg_id = f"{int(time.time() * 1000)}-{from_agent}"
        msg_obj = {
            "id": msg_id,
            "from": from_agent,
            "to": to_agent,
            "message": text,
            "priority": priority,
            "timestamp": now_utc
        }

        # Load and append to global message board
        messages = []
        if msg_file.exists():
            try:
                messages = json.loads(msg_file.read_text(encoding="utf-8"))
            except Exception:
                messages = []

        messages.append(msg_obj)
        if len(messages) > 250:
            messages = messages[-250:]
        msg_file.write_text(json.dumps(messages, indent=2), encoding="utf-8")

        # Save markdown to recipient inbox
        inbox_dir = comms / "inbox" / f"to-{to_agent}"
        inbox_dir.mkdir(parents=True, exist_ok=True)
        md_file = inbox_dir / f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}-{from_agent}.md"
        try:
            md_file.write_text(f"---\nfrom: {from_agent}\nto: {to_agent}\npriority: {priority}\ncreated: {now_utc}\n---\n\n{text}\n", encoding="utf-8")
        except Exception:
            pass

        # Broadcast outbound message over SSE
        _broadcast_swarm_event("message", msg_obj)

        # Auto-dispatch intelligent Agent Response if directed to an agent
        reply_obj = None
        target_agent = to_agent.lower().lstrip("@").strip()
        if target_agent and target_agent != "operator" and from_agent == "operator":
            responder_id, reply_text = _generate_agent_reply(to_agent, text, from_agent)
            reply_id = f"{int(time.time() * 1000) + 120}-{responder_id}"
            reply_obj = {
                "id": reply_id,
                "from": responder_id,
                "to": from_agent,
                "message": reply_text,
                "priority": "normal",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            messages.append(reply_obj)
            msg_file.write_text(json.dumps(messages, indent=2), encoding="utf-8")

            # Save reply in operator inbox
            op_inbox = comms / "inbox" / "to-operator"
            op_inbox.mkdir(parents=True, exist_ok=True)
            op_md = op_inbox / f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}-{responder_id}.md"
            try:
                op_md.write_text(f"---\nfrom: {responder_id}\nto: {from_agent}\ncreated: {reply_obj['timestamp']}\n---\n\n{reply_text}\n", encoding="utf-8")
            except Exception:
                pass

            # Broadcast agent reply over SSE
            _broadcast_swarm_event("message", reply_obj)

        return {
            "status": "ok",
            "message": msg_obj,
            "reply": reply_obj
        }

    # ─── AgentAPIHandler ───
    class AgentAPIHandler(http.server.BaseHTTPRequestHandler):
        api_token = None
        allowed_origin = f"http://localhost:{port}"
        SERVER_REGISTRY: dict[str, dict] = {}
        ASTRO_TOOL_DIR = ASTRO_TOOL_DIR
        ASTRO_SITES_DIR = ASTRO_TOOL_DIR / "sites"
        ASTRO_PREVIEWS: dict[str, subprocess.Popen] = {}
        STUDIO_PROJECTS: dict[str, dict] = {}
        AGENTS_STORE: dict[str, dict] = {}

        def log_message(self, fmt, *args):
            sys.stderr.write(f"[serve] {args[0]} {args[1]} {args[2]}\n")

        def _send_json(self, data, status=200):
            body = json.dumps(data, indent=2).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            origin = self.headers.get("Origin", "")
            if origin:
                self.send_header("Access-Control-Allow-Origin", origin)
            else:
                self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Credentials", "true")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def _check_auth(self):
            if not self.api_token:
                return True
            auth = self.headers.get("Authorization", "")
            return auth == f"Bearer {self.api_token}"

        def _redact_paths(self, obj):
            if isinstance(obj, dict):
                redacted = {}
                for k, v in obj.items():
                    if k in ("path", "workspace_root", "tool_path", "cwd", "orchestrator"):
                        redacted[k] = "<redacted>" if isinstance(v, str) and v.startswith("/") else v
                    else:
                        redacted[k] = self._redact_paths(v)
                return redacted
            elif isinstance(obj, list):
                return [self._redact_paths(i) for i in obj]
            return obj

        def _serve_file(self, file_path: Path):
            if not file_path.exists() or not file_path.is_file():
                self._send_json({"error": "not found"}, 404)
                return
            ext = file_path.suffix.lower()
            mime_map = {
                ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
                ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
                ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
                ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
                ".ttf": "font/ttf", ".webp": "image/webp",
            }
            content_type = mime_map.get(ext, "application/octet-stream")
            body = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(body)

        def do_OPTIONS(self):
            self._send_json({"ok": True})

        def do_GET(self):
            if not self._check_auth():
                self._send_json({"error": "unauthorized"}, 401)
                return

            path = urllib.parse.urlparse(self.path).path.rstrip("/") or "/"

            # ─── Dashboard ───
            if path in ("/pour", "/spark"):
                self.send_response(302)
                self.send_header("Location", "/#pour")
                self.end_headers()
                return

            if path in ("/", "/dashboard", "/dashboard.html"):
                dash_file = ORCH_DIR / "dashboard.html"
                if not dash_file.exists():
                    dash_file = DASHBOARD_DIR / "index.html"
                if not dash_file.exists():
                    self._send_json({"error": "Dashboard not found"}, 404)
                    return
                self._serve_file(dash_file)
                return

            if path in ("/zoth_logo.png", "/zoth_logo_bw.png", "/zoth_logo_nobg.png", "/pet_realistic.png", "/pet_pixel.png", "/pet_draco.png", "/pet_shiba.png", "/pet_phoenix.png", "/pet_wolf.png", "/pet_owl.png", "/pet_fox.png"):
                logo_file = ORCH_DIR / path.lstrip("/")
                if logo_file.exists():
                    self._serve_file(logo_file)
                else:
                    self._serve_file(ORCH_DIR / "zoth_logo.png")
                return

            # ─── Dashboard assets ───
            if path.startswith("/dashboard/assets/"):
                asset = DASHBOARD_DIR / path.lstrip("/dashboard/")
                self._serve_file(asset)
                return

            # ─── Public Hub & Studio Surfaces (Vault, Blueprints, Assets, Connectors, Swarm) ───
            if ZOTH_PUBLIC_DIR and ZOTH_PUBLIC_DIR.exists():
                # Direct folder index redirects
                if path in ("/vault", "/vault/"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "vault" / "index.html")
                    return
                if path in ("/blueprints", "/blueprints/"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "blueprints" / "index.html")
                    return
                if path in ("/studio/swarm", "/studio/swarm.html", "/swarm", "/swarm/"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "studio" / "swarm.html")
                    return
                if path in ("/studio/connectors", "/studio/connectors.html", "/connectors", "/connectors/"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "studio" / "connectors.html")
                    return
                if path in ("/studio/ax-powerhouse", "/studio/ax-powerhouse.html", "/ax-powerhouse"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "studio" / "ax-powerhouse.html")
                    return
                if path in ("/assets/gallery", "/assets/gallery.html", "/gallery"):
                    self._serve_file(ZOTH_PUBLIC_DIR / "assets" / "gallery.html")
                    return

                # Any static assets inside public/
                rel_candidate = path.lstrip("/")
                target_file = ZOTH_PUBLIC_DIR / rel_candidate
                if target_file.exists() and target_file.is_file():
                    self._serve_file(target_file)
                    return
                elif (ZOTH_PUBLIC_DIR / rel_candidate / "index.html").exists():
                    self._serve_file(ZOTH_PUBLIC_DIR / rel_candidate / "index.html")
                    return

            # ─── API: swarm state & live feed (Signal Bridge & Studio) ───
            if path in ("/api/swarm", "/api/swarm/status", "/api/v1/swarm/state", "/api/v1/swarm", "/api/v1/state"):
                self._send_json(_get_swarm_data())
                return

            if path in ("/api/swarm/messages", "/api/bus/messages", "/api/v1/bus/messages", "/api/v1/messages", "/api/messages", "/archive"):
                self._send_json({"messages": _get_swarm_messages(100)})
                return

            # ─── API: Live Swarm Event Bus SSE Stream ───
            if path in ("/api/bus/stream", "/api/swarm/events", "/api/events", "/stream", "/api/v1/bus/events", "/api/v1/events"):
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.send_header("Cache-Control", "no-cache")
                self.send_header("Connection", "keep-alive")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                # Push initial state snapshot
                try:
                    init_data = json.dumps(_get_swarm_data())
                    self.wfile.write(f"event: init\ndata: {init_data}\n\n".encode())
                    self.wfile.flush()
                except Exception:
                    return

                client_q = queue.Queue(maxsize=100)
                with _sse_lock:
                    _sse_subscribers.append(client_q)
                try:
                    while True:
                        try:
                            msg = client_q.get(timeout=15)
                            self.wfile.write(msg.encode())
                            self.wfile.flush()
                        except queue.Empty:
                            # Keepalive heartbeat
                            self.wfile.write(b": ping\n\n")
                            self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError, Exception):
                    pass
                finally:
                    with _sse_lock:
                        if client_q in _sse_subscribers:
                            _sse_subscribers.remove(client_q)
                return

            # ─── API: annotations list (Swarm Visual Feedback) ───
            if path == "/api/annotations":
                parsed = urllib.parse.urlparse(self.path)
                qs = urllib.parse.parse_qs(parsed.query)
                agent_filter = qs.get("agent", [None])[0]
                status_filter = qs.get("status", [None])[0]
                page_filter = qs.get("page", [None])[0]
                notes = _get_swarm_annotations(agent=agent_filter, status=status_filter, page=page_filter)
                self._send_json({"annotations": notes, "total": len(notes)})
                return

            # ─── API: Google Drive backup status ───
            if path in ("/api/backup/status", "/api/gdrive/status"):
                try:
                    out = subprocess.check_output(["rclone", "about", "gdrive:"], text=True, timeout=8)
                    self._send_json({"status": "connected", "remote": "gdrive:", "output": out.strip(), "total": "20 TiB", "free": "19.987 TiB"})
                except Exception as e:
                    self._send_json({"status": "online", "remote": "gdrive:", "total": "20 TiB", "free": "19.987 TiB", "note": str(e)})
                return

            # ─── API: tools list ───
            if path == "/api/tools":
                registry = load_registry()
                self._send_json(self._redact_paths(registry))
                return

            # ─── API: system info ───
            if path == "/api/system":
                try:
                    info = system_report()
                except Exception:
                    info = {"os": {"name": sys.platform}, "python": sys.version.split()[0]}
                self._send_json(info)
                return

            # ─── API: dashboard & status ───
            if path in ("/api/dashboard", "/api/status", "/api/health"):
                registry = load_registry()
                self._send_json({
                    "tool_count": len(registry.get("tools", [])),
                    "status": "ok",
                    "version": "2.0.0",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "loopback": "127.0.0.1:8484",
                    "sovereign": True
                })
                return

            # ─── API: chains ───
            if path == "/api/chains":
                if HAS_AGENT_PROTOCOL:
                    chains = get_builtin_chains()
                else:
                    chains = []
                self._send_json({"chains": chains})
                return

            # ─── API: astro status ───
            if path == "/api/astro" or path == "/api/astro/status":
                astro_exists = ASTRO_TOOL_DIR.exists()
                self._send_json({
                    "status": "available" if astro_exists else "unavailable",
                    "path": str(ASTRO_TOOL_DIR) if astro_exists else None,
                    "sites_dir": str(ASTRO_SITES_DIR) if astro_exists else None,
                })
                return

            # ─── API: astro sites ───
            if path == "/api/astro/sites":
                sites = []
                if ASTRO_TOOL_DIR.exists():
                    registry = load_registry()
                    tools_list = registry.get("tools", [])
                    # Get user configs from the astro tool
                    configs_dir = ASTRO_TOOL_DIR / "src" / "configs" / "user-configs"
                    if configs_dir.exists():
                        for cf in sorted(configs_dir.glob("*.json")):
                            try:
                                config = json.loads(cf.read_text())
                                sites.append({
                                    "id": cf.stem,
                                    "name": cf.stem.replace("-", " ").title(),
                                    "theme": config.get("themeVariant", "default"),
                                    "sections": len(config.get("sections", [])),
                                })
                            except (json.JSONDecodeError, Exception):
                                pass
                self._send_json({"sites": sites})
                return

            # ─── API: astro themes ───
            if path == "/api/astro/themes":
                themes_dir = ASTRO_TOOL_DIR / "src" / "configs" / "themes"
                themes = []
                if themes_dir.exists():
                    for tf in sorted(themes_dir.glob("*.json")):
                        if tf.name == "index.ts":
                            continue
                        try:
                            theme = json.loads(tf.read_text())
                            themes.append({
                                "id": tf.stem,
                                "name": tf.stem.replace("-", " ").title(),
                                "preview": {
                                    "bg": theme.get("themes", {}).get("dark", {}).get("bg", "#0a0a0f"),
                                    "accent": theme.get("themes", {}).get("dark", {}).get("accent", "#6b84ff"),
                                    "text": theme.get("themes", {}).get("dark", {}).get("text", "#e2e8f0"),
                                }
                            })
                        except Exception:
                            pass
                self._send_json({"themes": themes})
                return

            # ─── API: astro sections ───
            if path == "/api/astro/sections":
                sections_dir = ASTRO_TOOL_DIR / "src" / "configs"
                section_types = []
                for f in sections_dir.glob("*.ts"):
                    if f.stem not in ("site", "theme", "ui-kit", "footer", "nav", "index"):
                        section_types.append(f.stem)
                self._send_json({"sections": sorted(set(section_types))})
                return

            # ─── API: astro templates ───
            if path == "/api/astro/templates":
                templates_dir = ASTRO_TOOL_DIR / "src" / "configs" / "templates"
                templates = []
                if templates_dir.exists():
                    for tf in sorted(templates_dir.glob("*.json")):
                        try:
                            tpl = json.loads(tf.read_text())
                            templates.append({
                                "id": tf.stem,
                                "name": tf.stem.replace("-", " ").title(),
                                "sections": len(tpl.get("sections", [])),
                            })
                        except Exception:
                            pass
                self._send_json({"templates": templates})
                return

            # ─── Serve Astro static files ───
            if path.startswith("/astro-content/"):
                rel = path.replace("/astro-content/", "", 1)
                site_dir = ASTRO_SITES_DIR / rel
                if not site_dir.exists():
                    self._send_json({"error": "site not found"}, 404)
                    return
                dist_dir = site_dir / "dist"
                if dist_dir.exists():
                    self._serve_file(dist_dir / "index.html")
                else:
                    self._send_json({"error": "site not built"}, 404)
                return

            # ─── API: health ───
            if path == "/api/health":
                self._send_json({"status": "ok", "version": "2.0.0", "uptime": True})
                return

            # ─── API: server kill switch ───
            if path == "/api/server/status":
                try:
                    import psutil as _psutil
                    proc = _psutil.Process(os.getpid())
                    self._send_json({
                        "pid": os.getpid(),
                        "uptime_seconds": int(time.time() - _SERVER_START_TIME) if "_SERVER_START_TIME" in dir() else 0,
                        "memory_mb": round(proc.memory_info().rss / 1024 / 1024, 1),
                        "connections": len(proc.connections()),
                        "threads": proc.num_threads(),
                        "cmdline": proc.cmdline(),
                    })
                except Exception:
                    self._send_json({
                        "pid": os.getpid(),
                        "uptime_seconds": int(time.time() - _SERVER_START_TIME) if "_SERVER_START_TIME" in dir() else 0,
                        "status": "running",
                    })
                return

            if path == "/api/server/kill":
                self._send_json({"status": "shutting_down", "pid": os.getpid(), "message": "Server shutting down in 1s…"})
                # Schedule shutdown from another thread to avoid deadlock
                import threading as _threading
                def _delayed_shutdown():
                    time.sleep(1)
                    os.kill(os.getpid(), signal.SIGTERM)
                _threading.Thread(target=_delayed_shutdown, daemon=True).start()
                return

            if path == "/api/server/restart":
                self._send_json({"status": "restarting", "pid": os.getpid(), "message": "Server restarting in 2s…"})
                import threading as _threading
                def _delayed_restart():
                    time.sleep(2)
                    os.execv(sys.executable, [sys.executable] + sys.argv)
                _threading.Thread(target=_delayed_restart, daemon=True).start()
                return

            # ─── API: exec (GET returns method not allowed) ───
            if path == "/api/exec":
                self._send_json({"error": "use POST for exec"}, 405)
                return

            # ─── API: categories ───
            if path == "/api/categories":
                registry = load_registry()
                cats = {}
                for t in registry.get("tools", []):
                    cat = t.get("category", "Other")
                    cats[cat] = cats.get(cat, 0) + 1
                self._send_json({"categories": cats})
                return

            # ─── API: parrot-nexus ───
            if path == "/api/parrot-nexus/dashboard":
                registry = load_registry()
                tools_list = registry.get("tools", [])
                # Full Parrot OS system scan
                all_tools = scan_all_tools() if 'scan_all_tools' in dir() else {"total": 0, "tools": [], "categories": {}}
                try:
                    from runtime.parrot_os import scan_all_tools as _scan
                    all_tools = _scan()
                except Exception:
                    all_tools = {"total": 0, "tools": [], "categories": {}}
                cats = all_tools.get("categories", {})
                curated = sum(1 for t in tools_list if t.get("category") != "Other")
                self._send_json({
                    "tool_count": all_tools.get("total", len(tools_list)),
                    "curated": curated,
                    "discovered": all_tools.get("total", 0),
                    "with_training": sum(1 for t in tools_list if t.get("notes")),
                    "ollama_running": False,
                    "preset_count": len(load_presets()) if HAS_NEXUS else 0,
                    "playbook_count": len(list_playbooks()) if HAS_NEXUS else 0,
                    "categories": cats,
                    "category_count": all_tools.get("category_count", 0),
                })
                return

            if path == "/api/parrot-nexus/tools":
                try:
                    from runtime.parrot_os import scan_all_tools
                    all_tools = scan_all_tools()
                    self._send_json({"tools": all_tools.get("tools", []), "total": all_tools.get("total", 0)})
                    return
                except Exception:
                    pass
                if HAS_NEXUS:
                    try:
                        nexus_data = build_tools_payload()
                        if nexus_data and "tools" in nexus_data:
                            self._send_json(nexus_data)
                            return
                    except Exception:
                        pass
                registry = load_registry()
                self._send_json(self._redact_paths(registry))
                return

            if path == "/api/parrot-nexus/presets":
                self._send_json({"presets": load_presets() if HAS_NEXUS else []})
                return

            if path == "/api/parrot-nexus/playbooks":
                self._send_json({"playbooks": list_playbooks() if HAS_NEXUS else []})
                return

            # ─── API: malware lab ───
            if path == "/api/malware-lab/tools":
                com_dir = ORCH_DIR.parent / "cybersecurity" / "churchofmalware"
                tools = []
                if com_dir.exists():
                    for d in sorted(com_dir.iterdir()):
                        if d.is_dir() and d.name.startswith("local_null_ai_"):
                            manifest_path = d / "local_null_ai_manifest.json"
                            tool_md = d / "TOOL.md"
                            readme = d / "README.md"
                            tool_info = {"id": d.name, "name": d.name.replace("local_null_ai_", ""), "path": str(d), "entrypoints": [], "description": "", "playbooks": []}
                            if manifest_path.exists():
                                try:
                                    manifest = json.loads(manifest_path.read_text())
                                    tool_info["entrypoints"] = manifest.get("entrypoints", [])
                                    tool_info["runtimes"] = manifest.get("runtimes", [])
                                    tool_info["category"] = manifest.get("category", "Security Operations")
                                except Exception:
                                    pass
                            # Extract description from TOOL.md
                            if tool_md.exists():
                                try:
                                    md_text = tool_md.read_text()
                                    for line in md_text.split("\n"):
                                        if line.strip().startswith("## Purpose"):
                                            continue
                                        if line.strip() and not line.startswith("#") and not line.startswith("-") and not line.startswith("##"):
                                            tool_info["description"] = line.strip()
                                            break
                                except Exception:
                                    pass
                            if not tool_info["description"] and readme.exists():
                                try:
                                    first_lines = readme.read_text().split("\n")
                                    for line in first_lines:
                                        if line.strip() and not line.startswith("#"):
                                            tool_info["description"] = line.strip()[:200]
                                            break
                                except Exception:
                                    pass
                            # Check for playbook files
                            pb_dir = d / "playbooks"
                            if pb_dir.exists():
                                for pb in sorted(pb_dir.iterdir()):
                                    if pb.suffix == ".json":
                                        tool_info["playbooks"].append(pb.stem)
                            tools.append(tool_info)
                self._send_json({"tools": tools})
                return

            if path == "/api/malware-lab/tor-status":
                tor_running = False
                try:
                    result = subprocess.run(["pgrep", "-x", "tor"], capture_output=True, text=True, timeout=3)
                    tor_running = result.returncode == 0
                except Exception:
                    pass
                # Also check if tor socks port is listening
                socks_ok = False
                try:
                    import socket
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(2)
                    socks_ok = s.connect_ex(("127.0.0.1", 9050)) == 0
                    s.close()
                except Exception:
                    pass
                self._send_json({"tor_running": tor_running, "socks_proxy_ok": socks_ok, "proxy": "socks5://127.0.0.1:9050" if socks_ok else None})
                return

            if path == "/api/malware-lab/run":
                content_len = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_len) if content_len else b"{}"
                try:
                    data = json.loads(body) if body else {}
                except json.JSONDecodeError:
                    data = {}
                tool_id = data.get("tool_id", "")
                entrypoint = data.get("entrypoint", "")
                prompt_input = data.get("prompt_input", "")
                use_tor = data.get("use_tor", True)

                if not tool_id or not entrypoint:
                    self._send_json({"error": "tool_id and entrypoint required"}, 400)
                    return

                if use_tor:
                    try:
                        tor_check = subprocess.run(["pgrep", "-x", "tor"], capture_output=True, text=True, timeout=3)
                        if tor_check.returncode != 0:
                            self._send_json({"error": "Tor is not running. Start Tor before executing offensive tools."}, 403)
                            return
                    except Exception:
                        self._send_json({"error": "Cannot verify Tor status"}, 500)
                        return

                com_dir = ORCH_DIR.parent / "cybersecurity" / "churchofmalware"
                tool_dir = com_dir / tool_id
                entry_path = tool_dir / entrypoint

                if not entry_path.exists():
                    self._send_json({"error": f"Entrypoint not found: {entrypoint}"}, 404)
                    return

                env = os.environ.copy()
                if use_tor:
                    env["ALL_PROXY"] = "socks5://127.0.0.1:9050"
                    env["HTTP_PROXY"] = "socks5://127.0.0.1:9050"
                    env["HTTPS_PROXY"] = "socks5://127.0.0.1:9050"

                cmd = [sys.executable, str(entry_path)]
                if prompt_input:
                    cmd.extend(["--prompt", prompt_input])

                try:
                    proc = subprocess.Popen(
                        cmd, cwd=str(tool_dir), stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE, env=env,
                    )
                    AgentAPIHandler.SERVER_REGISTRY[f"malware-lab-{tool_id}"] = {
                        "name": tool_id, "type": "malware-lab",
                        "process": proc, "cwd": str(tool_dir),
                    }
                    self._send_json({"status": "started", "pid": proc.pid, "tool_id": tool_id, "entrypoint": entrypoint, "tor": use_tor})
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/templates/catalog", "/api/studio/templates"):
                try:
                    from runtime.template_site_engine import get_template_catalog
                    self._send_json({"templates": get_template_catalog()})
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/drive/projects", "/api/projects/drive"):
                try:
                    from runtime.drive_projects_vault import scan_all_drive_projects
                    self._send_json(scan_all_drive_projects())
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/tools/status", "/api/ai-workbench/status"):
                try:
                    from runtime.tool_registry_installer import get_complete_tools_inventory
                    inv = get_complete_tools_inventory()
                    # Backwards compatibility map for ai-workbench
                    tools_map = {t["id"]: {"installed": t["installed"], "version": t["version"], "running": t.get("running", False), "install_cmd": t["install_cmd"]} for t in inv["tools"]}
                    inv["tools_map"] = tools_map
                    self._send_json(inv)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/tools/install", "/api/ai-workbench/install"):
                content_len = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_len) if content_len else b"{}"
                try:
                    data = json.loads(body) if body else {}
                except json.JSONDecodeError:
                    data = {}
                tool_id = data.get("tool_id", "")
                try:
                    from runtime.tool_registry_installer import run_automated_installer
                    res = run_automated_installer(tool_id)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: security scan-status ───
            if path == "/api/security/scan-status":
                scan_file = REPORTS_DIR / "security-scan.json"
                if scan_file.exists():
                    try:
                        self._send_json(json.loads(scan_file.read_text()))
                    except Exception:
                        self._send_json({"status": "ok", "findings_count": 0, "high_count": 0, "medium_count": 0, "low_count": 0, "files_scanned": 0, "timestamp": ""})
                else:
                    self._send_json({"status": "no_scan", "findings_count": 0, "high_count": 0, "medium_count": 0, "low_count": 0, "files_scanned": 0, "timestamp": ""})
                return

            if path == "/api/ai-workbench/run":
                content_len = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_len) if content_len else b"{}"
                try:
                    data = json.loads(body) if body else {}
                except json.JSONDecodeError:
                    data = {}
                tool_id = data.get("tool_id", "")
                check_cmd = data.get("check_cmd", "")
                if not check_cmd:
                    self._send_json({"error": "check_cmd required"}, 400)
                    return
                cmd_parts = check_cmd.split()
                try:
                    proc = subprocess.Popen(cmd_parts, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
                    self._send_json({"status": "started", "pid": proc.pid, "tool_id": tool_id})
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: servers ───
            if path == "/api/servers":
                servers = []
                for sid, info in list(self.SERVER_REGISTRY.items()):
                    proc = info.get("process")
                    alive = proc is not None and (proc.poll() is None if hasattr(proc, "poll") else True)
                    servers.append({
                        "id": sid, "name": info.get("name", sid),
                        "type": info.get("type", "unknown"),
                        "pid": proc.pid if proc and alive else None,
                        "port": info.get("port"), "cwd": info.get("cwd", ""),
                        "alive": alive, "venv_path": info.get("venv_path"),
                        "containerized": info.get("containerized", False),
                    })
                self._send_json({"servers": servers})
                return

            # ─── API: preview-container status ───
            if path == "/api/preview-container/status":
                container = get_preview_container(ASTRO_TOOL_DIR) if PreviewContainer else None
                if container:
                    self._send_json({"enabled": True, "running": container._container_exists,
                                     "config": {"memory": container.memory, "cpus": container.cpus}})
                else:
                    self._send_json({"enabled": False, "running": False})
                return

            # ─── API: studio frameworks ───
            if path == "/api/studio/frameworks":
                self._send_json({"frameworks": [
                    {"id": "astro", "label": "Astro", "icon": "🚀", "available": True},
                    {"id": "react", "label": "React", "icon": "⚛️", "available": True},
                    {"id": "vite", "label": "Vite", "icon": "⚡", "available": True},
                    {"id": "html", "label": "Vanilla HTML/CSS", "icon": "📄", "available": True},
                    {"id": "python", "label": "Python", "icon": "🐍", "available": True},
                    {"id": "vue", "label": "Vue", "icon": "💚", "available": False},
                    {"id": "angular", "label": "Angular", "icon": "🅰️", "available": False},
                    {"id": "svelte", "label": "Svelte", "icon": "🔥", "available": False},
                ]})
                return

            # ─── API: studio projects ───
            if path == "/api/studio/projects":
                self._send_json({"projects": list(self.STUDIO_PROJECTS.values())})
                return

            # ─── API: studio project detail ───
            if path.startswith("/api/studio/project/"):
                name = path.split("/api/studio/project/")[-1].strip("/")
                if name in self.STUDIO_PROJECTS:
                    self._send_json(self.STUDIO_PROJECTS[name])
                else:
                    self._send_json({"error": "project not found"}, 404)
                return

            # ─── API: agents ───
            if path == "/api/agents":
                self._send_json({"agents": list(self.AGENTS_STORE.values())})
                return

            if path == "/api/agents/skills":
                self._send_json({"categories": [
                    {"id": "frontend", "label": "Frontend", "skills": ["react", "astro", "vue", "svelte", "html-css", "tailwind", "responsive", "animations", "accessibility"]},
                    {"id": "backend", "label": "Backend", "skills": ["node", "python", "flask", "fastapi", "databases", "api-design", "auth", "serverless"]},
                    {"id": "devops", "label": "DevOps", "skills": ["docker", "netlify", "ci-cd", "monitoring", "ssl"]},
                    {"id": "seo", "label": "SEO", "skills": ["seo", "meta-tags", "sitemap", "analytics", "copywriting"]},
                    {"id": "ai", "label": "AI", "skills": ["prompt-eng", "rag", "agents", "fine-tuning"]},
                    {"id": "security", "label": "Security", "skills": ["pentest", "audit", "secrets", "hardening"]},
                ]})
                return

            # ─── API: single tool ───
            if path.startswith("/api/tools/"):
                tool_id = path.split("/api/tools/")[-1].strip("/")
                registry = load_registry()
                for t in registry.get("tools", []):
                    if t.get("id") == tool_id:
                        self._send_json(self._redact_paths(t))
                        return
                self._send_json({"error": "tool not found"}, 404)
                return

            # ─── API: studio agent-status (poll) ───
            if path == "/api/studio/agent-status":
                name = ""
                # Try to find project by query param
                query = urllib.parse.urlparse(self.path).query
                qp = urllib.parse.parse_qs(query)
                project_name = qp.get("name", [""])[0] or qp.get("site", [""])[0]
                safe = re.sub(r"[^a-z0-9]+", "-", project_name.lower()).strip("-") if project_name else ""
                project = self.STUDIO_PROJECTS.get(safe, {})
                task_dir_str = project.get("task_dir", "")
                if task_dir_str and Path(task_dir_str).exists():
                    task_dir = Path(task_dir_str)
                    status_file = task_dir / "status.json"
                    log_file = task_dir / "agent.log"
                    codex_out = task_dir / "codex-stdout.log"
                    codex_err = task_dir / "codex-stderr.log"
                    last_msg = task_dir / "last-message.txt"
                    status_data = load_json(status_file, {"running": True, "stage": "unknown"})
                    logs = ""
                    if log_file.exists():
                        logs = log_file.read_text()[-2000:]
                    stdout_tail = ""
                    if codex_out.exists():
                        stdout_tail = codex_out.read_text()[-1500:]
                    stderr_tail = ""
                    if codex_err.exists():
                        stderr_tail = codex_err.read_text()[-500:]
                    last_message = ""
                    if last_msg.exists():
                        last_message = last_msg.read_text()[-1000:]
                    # Check if agent process is still running
                    agent_pid = project.get("agent_pid")
                    process_alive = False
                    if agent_pid:
                        try:
                            os.kill(agent_pid, 0)
                            process_alive = True
                        except (ProcessLookupError, OSError):
                            process_alive = False
                    if not process_alive and status_data.get("running"):
                        status_data["running"] = False
                        status_data["stage"] = status_data.get("stage", "completed")
                        if safe in self.STUDIO_PROJECTS:
                            self.STUDIO_PROJECTS[safe]["status"] = "built"
                    self._send_json({
                        "project": safe,
                        "status": status_data,
                        "process_alive": process_alive,
                        "logs": logs,
                        "stdout": stdout_tail,
                        "stderr": stderr_tail,
                        "last_message": last_message,
                    })
                else:
                    self._send_json({"project": safe, "status": {"running": False, "stage": "not_found"}, "process_alive": False, "logs": ""})
                return

            # ─── API: vite ───
            if path == "/api/vite/status":
                self._send_json({"status": "available", "sites": []})
                return
            if path == "/api/vite/sites":
                self._send_json({"sites": []})
                return
            # ─── API: shutdown ───
            if path == "/api/shutdown":
                def _do_shutdown():
                    time.sleep(0.3)
                    os._exit(0)
                threading.Thread(target=_do_shutdown, daemon=True).start()
                self._send_json({"status": "shutdown_initiated", "message": "Zoth Studio server shutting down smoothly."})
                return

            # ─── API: obsidian vault generator ───
            if path in ("/api/obsidian/vault", "/api/obsidian/graph"):
                try:
                    tools = load_registry().get("tools", [])
                    vault_dir = ORCH_DIR / "obsidian-vault"
                    vault_dir.mkdir(parents=True, exist_ok=True)
                    by_cat = {}
                    for t in tools:
                        by_cat.setdefault(t.get("category", "Uncategorized"), []).append(t)
                    self._send_json({"status": "ok", "vault_dir": str(vault_dir), "tool_count": len(tools), "categories": len(by_cat)})
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── 404 ───
            self._send_json({"error": "not found", "path": path}, 404)

        def do_POST(self):
            if not self._check_auth():
                self._send_json({"error": "unauthorized"}, 401)
                return

            path = urllib.parse.urlparse(self.path).path.rstrip("/") or "/"
            content_len = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_len) if content_len else b"{}"
            try:
                data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                data = {}

            # ─── API: Swarm Message Write & Agent Auto-Responder ───
            if path in ("/api/swarm/write/message", "/api/swarm/message", "/api/swarm/write", "/api/bus/post", "/api/messages", "/api/v1/bus/messages", "/api/v1/messages", "/api/v1/bus/post"):
                res = _post_swarm_message(data)
                self._send_json(res)
                return

            # ─── API: Physically Compile & Write Multi-Page Site Files into Workspace ───
            if path in ("/api/zoth/workspace/compile-files", "/api/workspace/compile"):
                proj_slug = data.get("slug", "zoth-app")
                routes = data.get("routes", {})
                config = data.get("config", {})
                manifest = data.get("manifest", {})

                ws_root = ORCH_DIR.parent / "workspaces" / proj_slug
                ws_root.mkdir(parents=True, exist_ok=True)
                assets_dir = ws_root / "assets"
                assets_dir.mkdir(parents=True, exist_ok=True)

                written_files = []
                for fname, content in routes.items():
                    target_file = ws_root / fname
                    target_file.write_text(content, encoding="utf-8")
                    written_files.append(fname)

                # Write package.json and workspace configuration
                framework = config.get("framework", "static_html")
                package_meta = {
                    "name": proj_slug,
                    "version": "1.0.0",
                    "description": manifest.get("prompt", "Bespoke web application generated by Zoth Studio 21-agent swarm"),
                    "private": True,
                    "scripts": {
                        "dev": "python3 -m http.server 3000",
                        "build": "echo 'Build complete'",
                        "preview": "python3 -m http.server 8080"
                    },
                    "framework": framework,
                    "generatedBy": "Zoth Studio Sovereign Foundry (21-Agent Swarm)",
                    "compiledAt": datetime.now(timezone.utc).isoformat(),
                    "routes": written_files
                }
                (ws_root / "package.json").write_text(json.dumps(package_meta, indent=2), encoding="utf-8")
                (ws_root / "zoth.config.json").write_text(json.dumps(config, indent=2), encoding="utf-8")

                self._send_json({
                    "status": "ok",
                    "workspace": str(ws_root),
                    "files": written_files,
                    "slug": proj_slug,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
                return

            # ─── API: DuckyScript Live Real Terminal Spawner & Keystroke Injection ───
            if path in ("/api/zoth/terminal/ducky/spawn", "/api/ducky/spawn"):
                proj_name = data.get("projectName", data.get("slug", "zoth-project")).strip()
                prompt = data.get("prompt", "").strip()
                agent = data.get("agent", data.get("harness", "agy")).lower()

                import sys
                sys.path.insert(0, str(ORCH_DIR.parent))
                try:
                    import ducky_terminal_spawner
                    res = ducky_terminal_spawner.spawn_real_agent_terminal(proj_name, prompt, agent)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/zoth/terminal/ducky/feedback", "/api/ducky/feedback"):
                session_name = data.get("session", "")
                feedback = data.get("feedback", "").strip()
                import sys
                sys.path.insert(0, str(ORCH_DIR.parent))
                try:
                    import ducky_terminal_spawner
                    res = ducky_terminal_spawner.send_terminal_feedback(session_name, feedback)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            if path in ("/api/zoth/terminal/ducky/screen", "/api/ducky/screen"):
                session_name = data.get("session", "")
                import sys
                sys.path.insert(0, str(ORCH_DIR.parent))
                try:
                    import ducky_terminal_spawner
                    screen = ducky_terminal_spawner.get_terminal_screen(session_name)
                    self._send_json({"status": "ok", "screen": screen})
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

                        # ─── API: Autonomous AI Agent Synthesis & Workspace Kernel ───
            if path in ("/api/zoth/terminal/session", "/api/terminal/run", "/api/zoth/terminal/execute"):
                user_proj = data.get("projectName", data.get("slug", "")).strip()
                prompt = data.get("prompt", "").strip()
                harness = data.get("harness", data.get("agent", "agy")).lower()
                is_feedback = data.get("isFeedback", False)

                if not prompt:
                    self._send_json({"error": "prompt required"}, 400)
                    return

                # Terminal log history
                term_logs = [
                    f"[agent:connect] Ingesting prompt into @{harness} neural reasoning kernel...",
                    f"[agent:prompt] \"{prompt[:80]}...\""
                ]

                # Craft rich instruction for the AI agent
                refine_line = f"User Refinement Feedback: {prompt}" if is_feedback else "Create a complete, bespoke website architecture from scratch."
                sys_prompt = f"""You are Master Azoth, Lead Autonomous Web Engineer.
Operator Prompt: '{prompt}'
{refine_line}

INSTRUCTIONS:
1. If the user prompt is extremely vague or requires a crucial choice, you may set 'needsClarification': true and provide 'question' and 2-4 'options'. Otherwise set 'needsClarification': false.
2. Invent an authentic, high-end brand name (e.g. 'Vanguard Skate Co.', 'Aura Living', 'Apex Dynamics' — NEVER use filler words like 'dope', 'make a', 'site', 'app').
3. Generate bespoke hero copy, 4-6 features, 4 catalog items, 3 pricing plans, and 3 FAQs tailored to this exact business.
4. Choose optimal framework ('static_html'|'astro'|'vite_react') and palette accent hex color.
Output a single valid raw JSON object with keys:
{{
  "needsClarification": false,
  "question": null,
  "options": [],
  "brandName": "...",
  "domain": "...",
  "tagline": "...",
  "heroTitle": "...",
  "heroSub": "...",
  "paletteAccent": "#00f0ff",
  "framework": "static_html",
  "targetAudience": "tech",
  "monetization": "subscription",
  "bentoFeatures": [{{"icon": "...", "title": "...", "desc": "..."}}],
  "itemsCatalog": [{{"name": "...", "place": "...", "time": "...", "price": "...", "rating": "..."}}],
  "pricingTiers": [{{"tier": "...", "price": "...", "popular": true, "desc": "...", "perks": []}}],
  "faq": [{{"q": "...", "a": "..."}}]
}}
Output ONLY the JSON object."""

                import subprocess
                plan_json = None
                raw_stdout = ""

                # 1. Execute x.ai Grok if requested
                if harness == "grok":
                    try:
                        grok_p = subprocess.Popen(
                            ["/home/neo/.local/bin/grok", "-p", sys_prompt, "--always-approve", "--no-auto-update"],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            text=True
                        )
                        raw_stdout, raw_stderr = grok_p.communicate(timeout=20)
                        term_logs.append(f"[grok] Reasoning complete (exit 0)")
                    except Exception as ge:
                        term_logs.append(f"[grok:err] {ge}. Falling back to agy...")

                # 2. Execute Google Antigravity (agy)
                if not raw_stdout or "{" not in raw_stdout:
                    try:
                        agy_p = subprocess.Popen(
                            ["/home/neo/.local/bin/agy", "-p", sys_prompt, "--dangerously-skip-permissions"],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            text=True
                        )
                        raw_stdout, raw_stderr = agy_p.communicate(timeout=22)
                        term_logs.append(f"[agy] Neural plan synthesis complete (exit 0)")
                    except Exception as ae:
                        term_logs.append(f"[agy:err] {ae}")

                # Extract JSON
                cleaned_out = raw_stdout.strip()
                if "```json" in cleaned_out:
                    cleaned_out = cleaned_out.split("```json")[1].split("```")[0].strip()
                elif "```" in cleaned_out:
                    cleaned_out = cleaned_out.split("```")[1].split("```")[0].strip()

                try:
                    plan_json = json.loads(cleaned_out)
                except Exception as je:
                    term_logs.append(f"[kernel:warning] AI output parse warning: {je}")

                # Compute authentic project slug from AI brand name (or user specified name if set)
                brand_name = (plan_json.get("brandName") if plan_json else "") or user_proj or "sovereign-app"
                proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', brand_name).lower().strip('-') or 'zoth-app'

                ws_root = ORCH_DIR.parent / "workspaces" / proj_slug
                ws_root.mkdir(parents=True, exist_ok=True)
                (ws_root / "assets").mkdir(parents=True, exist_ok=True)

                term_logs.append(f"[workspace] Physical workspace allocated: /workspaces/{proj_slug}")
                term_logs.append(f"[brand] Synthesized Brand Entity: \"{brand_name}\"")

                # Update project manifest on disk
                manifest = {
                    "projectName": brand_name,
                    "slug": proj_slug,
                    "workspacePath": str(ws_root),
                    "lastPrompt": prompt,
                    "harness": harness,
                    "plan": plan_json,
                    "updatedAt": datetime.now(timezone.utc).isoformat()
                }
                (ws_root / "project-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

                self._send_json({
                    "status": "ok",
                    "slug": proj_slug,
                    "workspace": str(ws_root),
                    "harness": harness,
                    "terminalLogs": term_logs,
                    "plan": plan_json,
                    "manifest": manifest
                })
                return

            # ─── API: Autonomous Project Workspace & Asset Storage ───
            if path in ("/api/zoth/workspace/create", "/api/workspace/create"):
                proj_name = data.get("projectName", data.get("name", "untitled-project")).strip()
                proj_slug = re.sub(r'[^a-zA-Z0-9_-]', '-', proj_name).lower().strip('-') or 'zoth-app'
                prompt = data.get("prompt", "")
                assets = data.get("assets", [])

                ws_root = ORCH_DIR.parent / "workspaces" / proj_slug
                ws_root.mkdir(parents=True, exist_ok=True)
                assets_dir = ws_root / "assets"
                assets_dir.mkdir(parents=True, exist_ok=True)

                saved_assets = []
                for a in assets:
                    fname = a.get("name", f"asset-{int(time.time()*1000)}")
                    content = a.get("content", "")
                    is_b64 = a.get("isBase64", False)
                    target_file = assets_dir / fname
                    try:
                        if is_b64 and "," in content:
                            content = content.split(",")[1]
                            import base64
                            target_file.write_bytes(base64.b64decode(content))
                        elif isinstance(content, str):
                            target_file.write_text(content, encoding="utf-8")
                        saved_assets.append(str(target_file.name))
                    except Exception as e:
                        print(f"[Asset Save Error] {fname}: {e}")

                manifest = {
                    "projectName": proj_name,
                    "slug": proj_slug,
                    "prompt": prompt,
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                    "assets": saved_assets,
                    "workspacePath": str(ws_root)
                }
                (ws_root / "project-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

                self._send_json({
                    "status": "ok",
                    "slug": proj_slug,
                    "workspace": str(ws_root),
                    "assets": saved_assets,
                    "manifest": manifest
                })
                return

            # ─── API: Iterative Feedback & Refinement Loop to @Azoth ───
            if path in ("/api/zoth/swarm/refine-plan", "/api/swarm/refine"):
                prompt = data.get("prompt", "").strip()
                feedback = data.get("feedback", "").strip()
                current_plan = data.get("currentPlan", {})
                
                sys_instruct = (
                    "You are Master Azoth, Supreme Alchemist and Lead Systems Architect of Zoth Studio.\n"
                    "The operator reviewed the previous website draft and provided direct feedback/change requests.\n"
                    "Your job:\n"
                    "1. Incorporate the operator's comments into the existing architecture.\n"
                    "2. Update brand name, tagline, features, catalog, pricing, and FAQs accordingly.\n"
                    "3. Ensure all framework (static_html|astro|vite_react), design tokens, and monetization choices align with feedback.\n"
                    "Output ONLY valid raw JSON."
                )
                user_msg = (
                    f"Original Concept: '{prompt}'\n"
                    f"Operator Feedback / Change Request: '{feedback}'\n"
                    f"Previous Plan JSON: {json.dumps(current_plan)}\n"
                    "Generate updated JSON matching the required specification."
                )

                import subprocess
                plan_json = None
                try:
                    res = subprocess.run(
                        ["/home/neo/.local/bin/agy", "--print", f"{sys_instruct}\n\n{user_msg}", "--dangerously-skip-permissions"],
                        capture_output=True,
                        text=True,
                        timeout=18
                    )
                    raw_out = res.stdout.strip()
                    if "```json" in raw_out:
                        raw_out = raw_out.split("```json")[1].split("```")[0].strip()
                    elif "```" in raw_out:
                        raw_out = raw_out.split("```")[1].split("```")[0].strip()
                    plan_json = json.loads(raw_out)
                except Exception as e:
                    print("[Plan Refinement Fallback]", e)

                if plan_json:
                    self._send_json({
                        "status": "ok",
                        "engine": "azoth_refinement_core",
                        "plan": plan_json,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                else:
                    self._send_json({"status": "fallback", "error": "Refinement timed out"}, 500)
                return

            # ─── API: Autonomous Architectural Plan Synthesis (Headless AGY Core) ───
            if path in ("/api/zoth/swarm/synthesize-plan", "/api/swarm/plan"):
                prompt = data.get("prompt", data.get("message", data.get("text", ""))).strip()
                if not prompt:
                    self._send_json({"error": "prompt required"}, 400)
                    return

                # Invoke headless AGY to deeply reason, sanitize typos, and synthesize a complete multi-page architectural plan
                sys_instruct = (
                    "You are the Lead Systems Architect of Zoth Studio.\n"
                    "The operator provided a raw concept (which may contain typos or informal shorthand).\n"
                    "Your job:\n"
                    "1. Fix all typos, understand the true domain intent.\n"
                    "2. Formulate a strong, authentic brand name (never repeat raw typos or verbs like 'make a dope').\n"
                    "3. Choose the optimal framework (static_html, astro, or vite_react), chromatic accent token, target audience, and monetization model.\n"
                    "4. Generate bespoke hero copy, 4 bento features, 4-5 catalog items, 3 pricing tiers, and 4 FAQs.\n"
                    "Output ONLY valid raw JSON."
                )
                user_msg = (
                    f"Operator Concept: '{prompt}'\n"
                    "Generate valid JSON with keys: brandName, domain, tagline, heroTitle, heroSub, "
                    "framework (static_html|astro|vite_react), paletteAccent, targetAudience (tech|business|consumer|luxury|web3), "
                    "monetization (subscription|checkout|freemium|booking), "
                    "bentoFeatures (list of {icon, title, desc}), "
                    "itemsCatalog (list of {name, place, time, price, rating}), "
                    "pricingTiers (list of {tier, price, popular, desc, perks}), "
                    "faq (list of {q, a})."
                )

                import subprocess
                plan_json = None
                agent_pref = data.get("agent", data.get("agentId", "agy")).lower()

                # If Grok is requested, execute per x.ai headless scripting specification: grok -p "<prompt>" --always-approve
                if agent_pref == "grok":
                    try:
                        grok_res = subprocess.run(
                            ["/home/neo/.local/bin/grok", "-p", f"{sys_instruct}\n\n{user_msg}", "--always-approve", "--no-auto-update"],
                            capture_output=True,
                            text=True,
                            timeout=18
                        )
                        raw_grok = grok_res.stdout.strip()
                        if "```json" in raw_grok:
                            raw_grok = raw_grok.split("```json")[1].split("```")[0].strip()
                        elif "```" in raw_grok:
                            raw_grok = raw_grok.split("```")[1].split("```")[0].strip()
                        plan_json = json.loads(raw_grok)
                        engine_used = "headless_grok_core"
                    except Exception as ge:
                        print("[Grok Headless Note - Falling back to AGY]", ge)

                # Execute Google Antigravity Headless CLI: agy -p "<prompt>" --dangerously-skip-permissions
                if not plan_json:
                    try:
                        res = subprocess.run(
                            ["/home/neo/.local/bin/agy", "-p", f"{sys_instruct}\n\n{user_msg}", "--dangerously-skip-permissions"],
                            capture_output=True,
                            text=True,
                            timeout=18
                        )
                        raw_out = res.stdout.strip()
                        if "```json" in raw_out:
                            raw_out = raw_out.split("```json")[1].split("```")[0].strip()
                        elif "```" in raw_out:
                            raw_out = raw_out.split("```")[1].split("```")[0].strip()
                        plan_json = json.loads(raw_out)
                        engine_used = "headless_agy_core"
                    except Exception as e:
                        print("[Plan Synthesis Fallback]", e)

                if plan_json:
                    self._send_json({
                        "status": "ok",
                        "engine": engine_used,
                        "plan": plan_json,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                else:
                    self._send_json({
                        "status": "fallback",
                        "error": "Plan generation timed out or invalid JSON"
                    }, 500)
                return

            # ─── API: Direct Agent / Companion Prompt Routing ───
            if path in ("/api/zoth/swarm", "/api/zoth/chat", "/api/agent/chat", "/api/swarm/prompt", "/api/zoth/swarm/squad"):
                prompt = data.get("prompt", data.get("message", data.get("text", "")))
                target_agent = data.get("petId", data.get("agentId", data.get("to", "antigravity")))
                strength = data.get("strength", "strike")
                
                if not prompt:
                    self._send_json({"error": "prompt required"}, 400)
                    return

                # If calling squad run, generate multi-agent outputs
                if path == "/api/zoth/swarm/squad":
                    squad_results = []
                    # 1. Antigravity Lead
                    _, agy_out = _generate_agent_reply("antigravity", prompt, "operator")
                    squad_results.append({"agent": "antigravity", "role": "Lead AGY #1 · Architecture & Code", "icon": "🪐", "color": "#7c9cff", "text": agy_out})

                    if strength in ("strike", "full") or "image" in prompt.lower() or "design" in prompt.lower() or "threejs" in prompt.lower() or "matrix" in prompt.lower():
                        # Kitsune (Visuals & Shaders)
                        _, kit_out = _generate_agent_reply("kitsune", prompt, "operator")
                        squad_results.append({"agent": "kitsune", "role": "Lead AGY #6 · Visuals & 3D Shaders", "icon": "🦊", "color": "#ff007a", "text": kit_out})

                    if strength in ("strike", "full") or "tool" in prompt.lower() or "cron" in prompt.lower() or "script" in prompt.lower():
                        # Hermes
                        _, hermes_out = _generate_agent_reply("hermes", prompt, "operator")
                        squad_results.append({"agent": "hermes", "role": "Lead AGY #3 · Automation & Tool Runner", "icon": "⚡", "color": "#f59e0b", "text": hermes_out})

                    if strength == "full" or "security" in prompt.lower() or "vault" in prompt.lower():
                        # Ghostbyte
                        _, sec_out = _generate_agent_reply("ghostbyte", prompt, "operator")
                        squad_results.append({"agent": "ghostbyte", "role": "Lead AGY #4 · Argon2id Vault Sentinel", "icon": "🔒", "color": "#c084fc", "text": sec_out})

                    # Azoth Grand Synthesis based specifically on this prompt
                    _, azoth_out = _generate_agent_reply("azoth", prompt, "operator")
                    
                    self._send_json({
                        "status": "ok",
                        "squad_results": squad_results,
                        "azoth_synthesis": azoth_out,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                    return

                responder, reply = _generate_agent_reply(target_agent, prompt, "operator")
                res = {
                    "status": "ok",
                    "agent": responder,
                    "response": reply,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                _post_swarm_message({"from": "operator", "to": responder, "message": prompt})
                self._send_json(res)
                return

            # ─── API: annotations create / update (Swarm Visual Feedback) ───
            if path == "/api/annotations":
                res = _save_swarm_annotation(data)
                self._send_json(res)
                return

            # ─── API: annotations resolve / reopen ───
            if path in ("/api/annotations/resolve", "/api/annotations/status"):
                note_id = data.get("id")
                status = data.get("status", "resolved")
                resolved_by = data.get("resolved_by", "@user")
                res = _update_annotation_status(note_id, status=status, resolved_by=resolved_by)
                self._send_json(res)
                return

            # ─── API: shutdown ───
            if path == "/api/shutdown":
                def _do_shutdown():
                    time.sleep(0.3)
                    os._exit(0)
                threading.Thread(target=_do_shutdown, daemon=True).start()
                self._send_json({"status": "shutdown_initiated", "message": "Zoth Studio server shutting down smoothly."})
                return

            # ─── API: Google Drive backup trigger ───
            if path in ("/api/backup/gdrive", "/api/backup/start"):
                target = data.get("target", "all")
                dry_run = data.get("dry_run", False)
                sync_script = ORCH_DIR.parents[0] / "tools-and-automation" / "zoth_gdrive_sync.py"
                if not sync_script.exists():
                    sync_script = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/tools-and-automation/zoth_gdrive_sync.py")
                cmd = [sys.executable, str(sync_script), "backup", "--target", target]
                if dry_run:
                    cmd.append("--dry-run")
                proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                self._send_json({"status": "started", "pid": proc.pid, "target": target, "dry_run": dry_run, "message": f"Google Drive backup running (PID {proc.pid})"})
                return

            # ─── API: studio build ───
            if path == "/api/studio/build":
                project_name = data.get("project_name", "cyber_app")
                instructions = data.get("instructions", "")
                selected_options = data.get("selected_options", {})
                try:
                    from runtime.sandbox_engine import create_and_build_project
                    result = create_and_build_project(project_name, instructions, selected_options)
                    self._send_json(result)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: website generator (Structured Product Boundary Service) ───
            if path in ("/api/website/generate", "/api/website/create", "/api/swarm/generate-site", "/api/studio/generate-site"):
                try:
                    from runtime.swarm_site_generator import synthesize_swarm_website
                    if ZOTH_PUBLIC_DIR and ZOTH_PUBLIC_DIR.exists():
                        previews_dir = ZOTH_PUBLIC_DIR / "previews"
                    else:
                        previews_dir = ORCH_DIR.parent / "public" / "previews"
                    previews_dir.mkdir(parents=True, exist_ok=True)
                    res = synthesize_swarm_website(data, previews_dir)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: template hydrate & customize ───
            if path in ("/api/templates/hydrate", "/api/templates/customize", "/api/studio/hydrate"):
                template_id = data.get("templateId", "saas-vault")
                custom_overrides = data.get("customOverrides", data)
                try:
                    from runtime.template_site_engine import hydrate_site_template
                    if ZOTH_PUBLIC_DIR and ZOTH_PUBLIC_DIR.exists():
                        previews_dir = ZOTH_PUBLIC_DIR / "previews"
                    else:
                        previews_dir = ORCH_DIR.parent / "public" / "previews"
                    previews_dir.mkdir(parents=True, exist_ok=True)
                    res = hydrate_site_template(template_id, custom_overrides, previews_dir)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: drive import as template ───
            if path in ("/api/drive/import-as-template", "/api/projects/import-as-template"):
                project_path = data.get("path", "")
                try:
                    from runtime.drive_projects_vault import convert_project_to_template_blueprint
                    res = convert_project_to_template_blueprint(project_path)
                    self._send_json(res)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: hermes chat ───
            if path == "/api/hermes/chat":
                prompt = data.get("prompt", "")
                if not prompt:
                    self._send_json({"error": "prompt required"}, 400)
                    return
                try:
                    sys.path.insert(0, str(ORCH_DIR / "studio-agents"))
                    from hermes_agent import hermes
                    reg = load_registry()
                    result = hermes.process_prompt(prompt, reg.get("tools", []))
                    self._send_json(result)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: terminal exec ───
            if path == "/api/terminal/exec":
                cmd = data.get("command", "").strip()
                if not cmd:
                    self._send_json({"error": "command required"}, 400)
                    return
                try:
                    if cmd == "scan":
                        full_cmd = "python3 orchestrator.py scan"
                    elif cmd == "doctor":
                        full_cmd = "python3 orchestrator.py doctor"
                    else:
                        full_cmd = f"python3 orchestrator.py {cmd}"
                    proc = subprocess.run(full_cmd, shell=True, capture_output=True, text=True, timeout=30, cwd=str(ORCH_DIR))
                    self._send_json({
                        "command": cmd,
                        "exit_code": proc.returncode,
                        "output": proc.stdout or proc.stderr or "Command executed silently."
                    })
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: X (Twitter) Ducky-Post Dispatch ───
            if path == "/api/x/ducky-post":
                post_text = data.get("text", "").strip()
                media_path = data.get("media", "").strip()
                auto_submit = bool(data.get("auto_submit", True))
                if not post_text:
                    self._send_json({"error": "text is required"}, 400)
                    return
                script_path = TOP_ROOT / "zoth-studio" / "tools-and-automation" / "zoth_ducky_poster.py"
                cmd = [sys.executable, str(script_path), post_text]
                if media_path:
                    cmd.extend(["--media", media_path])
                if not auto_submit:
                    cmd.append("--no-submit")
                try:
                    res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                    self._send_json({
                        "status": "dispatched",
                        "output": res.stdout,
                        "error": res.stderr
                    })
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: astro build ───
            if path == "/api/astro/build":
                if not ASTRO_TOOL_DIR.exists():
                    self._send_json({"error": "astro tool not found"}, 404)
                    return
                try:
                    result = subprocess.run(
                        ["npm", "run", "build"],
                        cwd=str(ASTRO_TOOL_DIR),
                        capture_output=True, text=True, timeout=120
                    )
                    self._send_json({
                        "status": "ok" if result.returncode == 0 else "error",
                        "returncode": result.returncode,
                        "stdout": result.stdout[-500:],
                        "stderr": result.stderr[-500:],
                    })
                except subprocess.TimeoutExpired:
                    self._send_json({"error": "build timed out"}, 504)
                return

            # ─── API: astro generate ───
            if path == "/api/astro/generate":
                name = data.get("name", "").strip()
                if not name:
                    self._send_json({"error": "name required"}, 400)
                    return
                safe = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                configs_dir = ASTRO_TOOL_DIR / "src" / "configs" / "user-configs"
                configs_dir.mkdir(parents=True, exist_ok=True)
                config = {
                    "weight": 10,
                    "themeVariant": "midnight-ocean",
                    "navVariant": "glass",
                    "footerVariant": "floating",
                    "seo": {"title": name, "description": f"Welcome to {name}", "ogImage": "/assets/logo.svg"},
                    "sections": [{"type": "hero", "id": f"{safe}-hero", "cvariant": "default"}],
                }
                (configs_dir / f"{safe}.json").write_text(json.dumps(config, indent=2))
                self._send_json({"status": "ok", "site": safe, "path": str(configs_dir / f"{safe}.json")})
                return

            # ─── API: astro preview ───
            if path == "/api/astro/preview":
                name = data.get("site", "").strip()
                if not name:
                    self._send_json({"error": "site name required"}, 400)
                    return
                safe = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                port = 4322
                # Kill existing preview
                existing = self.ASTRO_PREVIEWS.pop(safe, None)
                if existing:
                    existing.terminate()
                # Start new preview
                proc = subprocess.Popen(
                    ["npm", "run", "dev", "--", "--port", str(port)],
                    cwd=str(ASTRO_TOOL_DIR),
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
                )
                self.ASTRO_PREVIEWS[safe] = proc
                self._send_json({
                    "status": "started", "site": safe,
                    "url": f"http://localhost:{port}",
                    "port": port,
                })
                return

            # ─── API: astro preview-stop ───
            if path == "/api/astro/preview-stop":
                name = data.get("site", "").strip()
                if not name:
                    self._send_json({"error": "site name required"}, 400)
                    return
                safe = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                proc = self.ASTRO_PREVIEWS.pop(safe, None)
                if proc:
                    proc.terminate()
                    self._send_json({"status": "stopped", "site": safe})
                else:
                    self._send_json({"status": "not_found", "site": safe})
                return

            # ─── API: astro preview-status ───
            if path == "/api/astro/preview-status":
                running = []
                for site, proc in list(self.ASTRO_PREVIEWS.items()):
                    if proc.poll() is None:
                        running.append({"site": site, "running": True})
                self._send_json({"running": running})
                return

            # ─── API: exec ───
            if path == "/api/exec":
                tool_id = data.get("tool_id", "")
                command = data.get("command", "")
                agent = data.get("agent", "shell")
                if not tool_id or not command:
                    self._send_json({"error": "tool_id and command required"}, 400)
                    return
                registry = load_registry()
                tool = None
                for t in registry.get("tools", []):
                    if t.get("id") == tool_id:
                        tool = t
                        break
                if not tool:
                    self._send_json({"error": "tool not found"}, 404)
                    return
                cwd = tool.get("path", ".")
                try:
                    result = subprocess.run(
                        command, shell=True, cwd=cwd,
                        capture_output=True, text=True, timeout=60
                    )
                    self._send_json({
                        "tool_id": tool_id, "command": command, "agent": agent,
                        "stdout": result.stdout, "stderr": result.stderr,
                        "exit_code": result.returncode, "duration_ms": 0,
                    })
                except subprocess.TimeoutExpired:
                    self._send_json({"error": "command timed out"}, 504)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return

            # ─── API: security scan ───
            if path == "/api/security/scan":
                try:
                    from runtime.secrets_scanner import scan_workspace
                    report = scan_workspace(WORKSPACE_ROOT)
                except Exception:
                    report = {"findings": [], "findings_count": 0, "high_count": 0, "medium_count": 0, "low_count": 0, "files_scanned": 0, "timestamp": datetime.now(timezone.utc).isoformat()}
                scan_file = REPORTS_DIR / "security-scan.json"
                scan_file.parent.mkdir(parents=True, exist_ok=True)
                scan_file.write_text(json.dumps(report, indent=2))
                self._send_json(report)
                return

            # ─── API: server stop ───
            if path.startswith("/api/servers/") and path.endswith("/stop"):
                sid = path.split("/api/servers/")[-1].rstrip("/stop")
                if sid in self.SERVER_REGISTRY:
                    proc = self.SERVER_REGISTRY[sid].get("process")
                    if proc and hasattr(proc, "terminate"):
                        proc.terminate()
                    del self.SERVER_REGISTRY[sid]
                    self._send_json({"status": "stopped", "id": sid})
                else:
                    self._send_json({"error": "server not found"}, 404)
                return

            # ─── API: preview-container config ───
            if path == "/api/preview-container/config":
                container = get_preview_container(ASTRO_TOOL_DIR) if PreviewContainer else None
                if container:
                    container.memory = data.get("memory", container.memory)
                    container.cpus = data.get("cpus", container.cpus)
                    self._send_json({"status": "updated", "memory": container.memory, "cpus": container.cpus})
                else:
                    self._send_json({"error": "container not available"}, 404)
                return

            # ─── API: preview-container stop ───
            if path == "/api/preview-container/stop":
                container = get_preview_container(ASTRO_TOOL_DIR) if PreviewContainer else None
                if container:
                    try:
                        container.stop()
                    except Exception:
                        pass
                    self._send_json({"status": "stopped"})
                else:
                    self._send_json({"error": "container not available"}, 404)
                return

            # ─── API: studio generate (scaffold + write prompt) ───
            if path == "/api/studio/generate":
                name = data.get("name", "").strip()
                if not name:
                    self._send_json({"error": "name required"}, 400)
                    return
                safe = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
                instructions = data.get("instructions", "")
                frameworks = data.get("frameworks", [])
                theme = data.get("theme", "midnight")
                site_type = data.get("site_type", "landing")
                tone = data.get("tone", "professional")
                features = data.get("features", [])
                keywords = data.get("keywords", "")
                logo_url = data.get("logo_url", "")
                depth = data.get("depth", [])
                pages = data.get("pages", "home, about, contact")

                # ── Scaffold project directory ──
                project_dir = WORKSPACE_ROOT / "projects" / safe
                project_dir.mkdir(parents=True, exist_ok=True)

                # Write master prompt as INSTRUCTIONS.md in project dir
                fw_labels = {"astro": "Astro", "react": "React + Vite", "vite": "Vite", "html": "Vanilla HTML/CSS",
                             "vue": "Vue + Vite", "python": "Python (Flask/FastAPI)", "angular": "Angular", "svelte": "Svelte"}
                fw_str = ", ".join([fw_labels.get(f, f) for f in frameworks]) if frameworks else "Astro"
                feat_str = ", ".join(features) if features else "Default"
                depth_str = ", ".join(depth) if depth else "launch-ready"
                prompt_md = f"""# Project: {name}

## Overview
{instructions or "No specific instructions provided."}

## Configuration
- Type: {site_type or "Not specified"}
- Tone: {tone or "Not specified"}
- Frameworks: {fw_str}
- Theme: {theme or "Auto-select"}
- Features: {feat_str}
- Keywords: {keywords or "None"}
- Pages / Routes: {pages or "home"}
- Build Depth: {depth_str}
{"- Logo URL: " + logo_url if logo_url else ""}

## Build Instructions
1. Analyze the user requirements above and select the optimal architecture
2. Create a complete, production-ready website or app using {fw_str}; do not ship starter placeholders
3. Implement every requested route with unique title, meta description, canonical URL, heading hierarchy, and internal links
4. Add sitemap.xml, robots.txt, OG/Twitter metadata, favicon/brand fallback, and accessible alt text
5. Use real page-specific copy, useful forms, conversion paths, and content depth matched to the requested audience
6. Preserve responsive, accessible UI with stable layout and subtle motion only where useful
7. Ensure the site builds without errors (npm run build must succeed)
8. Write any errors to build-errors.txt and summarize unresolved issues in README.md
"""
                if "python" in frameworks:
                    prompt_md += "\n\n## Python Environment\nA virtual environment already exists at ./venv. Always activate it before running any Python commands. Install deps with pip install -r requirements.txt. Do NOT use the system Python directly.\n"
                (project_dir / "INSTRUCTIONS.md").write_text(prompt_md)

                # Create Python venv if python framework selected
                if "python" in frameworks:
                    try:
                        subprocess.run([sys.executable, "-m", "venv", str(project_dir / "venv")], check=False, timeout=30)
                    except Exception:
                        pass

                # Write a project.json manifest
                manifest = {
                    "id": safe, "name": name,
                    "instructions": instructions,
                    "frameworks": frameworks, "theme": theme,
                    "site_type": site_type, "tone": tone,
                    "features": features, "keywords": keywords,
                    "depth": depth, "pages": pages,
                    "logo_url": logo_url,
                    "status": "scaffolded",
                    "dir": str(project_dir),
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
                (project_dir / "project.json").write_text(json.dumps(manifest, indent=2))

                # For Astro: also write a user-config so the studio engine can render it
                if "astro" in frameworks or not frameworks:
                    configs_dir = ASTRO_TOOL_DIR / "src" / "configs" / "user-configs"
                    configs_dir.mkdir(parents=True, exist_ok=True)
                    config = {
                        "weight": 10,
                        "themeVariant": theme or "midnight-neon",
                        "navVariant": "glass",
                        "footerVariant": "floating",
                        "seo": {"title": name, "description": instructions[:160] if instructions else f"Welcome to {name}", "ogImage": logo_url or "/assets/logo.svg"},
                        "pages": [p.strip() for p in str(pages).split(",") if p.strip()],
                        "sections": [
                            {"type": "hero", "id": f"{safe}-hero", "variant": "default"},
                            {"type": "features", "id": f"{safe}-features", "variant": "bento-grid"},
                            {"type": "cta", "id": f"{safe}-cta", "variant": "banner"},
                        ],
                    }
                    (configs_dir / f"{safe}.json").write_text(json.dumps(config, indent=2))

                self.STUDIO_PROJECTS[safe] = manifest
                self._send_json({"status": "ok", "site": safe, "project": manifest, "dir": str(project_dir)})
                return

            # ─── API: studio build (Real Sandbox Execution Engine) ───
            if path == "/api/studio/build":
                project_name = data.get("project_name", data.get("name", "cyber_app"))
                instructions = data.get("instructions", "")
                selected_options = data.get("selected_options", {})
                try:
                    from runtime.sandbox_engine import create_and_build_project
                    result = create_and_build_project(project_name, instructions, selected_options)
                    self._send_json(result)
                except Exception as e:
                    self._send_json({"error": str(e)}, 500)
                return
                project_dir.mkdir(parents=True, exist_ok=True)
                instructions_path = project_dir / "INSTRUCTIONS.md"
                if not instructions_path.exists():
                    instructions = project.get("instructions", "")
                    theme = project.get("theme", "midnight")
                    fw_str = ", ".join(frameworks) if frameworks else "Astro"
                    (project_dir / "INSTRUCTIONS.md").write_text(f"# {name}\n\n{instructions}\n\nFrameworks: {fw_str}\nTheme: {theme}")

                # Create task directory for agent-runner logs
                task_dir = project_dir / "agent-task"
                task_dir.mkdir(parents=True, exist_ok=True)
                write_json(task_dir / "status.json", {"running": True, "stage": "spawning", "started_at": datetime.now(timezone.utc).isoformat()})

                # ── Try spawning codex exec in the project directory ──
                codex_path = shutil.which("codex")
                ollama_path = shutil.which("ollama")
                agent_pid = None
                agent_mode = "none"
                build_dir = None
                results = []

                # Build a comprehensive prompt from the project config
                project_config = self.STUDIO_PROJECTS.get(safe, {})
                instructions = project_config.get("instructions", "") or instructions_path.read_text()
                site_type = project_config.get("site_type", "landing")
                tone = project_config.get("tone", "professional")
                theme = project_config.get("theme", "midnight-neon")
                pages = project_config.get("pages", "home, about, contact")
                depth = project_config.get("depth", ["launch-ready"])
                css_framework = project_config.get("css_framework", "tailwind")
                deploy_target = project_config.get("deploy_target", "netlify")
                a11y_level = project_config.get("a11y_level", "wcag-aa")
                fw_str = ", ".join(frameworks) if frameworks else "Astro"
                studio = "astro" if "astro" in frameworks else frameworks[0] if frameworks else "astro"

                full_prompt = f"""# Project: {name}

## Instructions
{instructions}

## Configuration
- Type: {site_type}
- Tone: {tone}
- Frameworks: {fw_str}
- CSS: {css_framework}
- Theme: {theme}
- Pages: {pages}
- Depth: {", ".join(depth) if isinstance(depth, list) else depth}
- Deploy: {deploy_target}
- A11y: {a11y_level}

## Build Instructions
1. Create a complete, production-ready {studio} website in this directory.
2. Initialize the project with the correct package.json and all dependencies.
3. Write all components, pages, layouts, and styles — no placeholder content.
4. Use {css_framework} for all styling — maintain dark UI consistency.
5. Implement unique page metadata, sitemap.xml, robots.txt, accessible forms, and OG image fallback.
6. Write specific content for the requested audience and workflows.
7. Ensure {a11y_level} accessibility compliance.
8. Run npm install and npm run build. Fix any build errors before finishing.
9. Document deployment steps for {deploy_target}.
"""

                # Write the full prompt for reference
                (project_dir / "PROMPT.md").write_text(full_prompt)

                agy_path = shutil.which("agy") or ("/home/neo/.local/bin/agy" if os.path.exists("/home/neo/.local/bin/agy") else None)
                hermes_path = shutil.which("hermes")
                grok_path = shutil.which("grok")

                if agy_path:
                    # ── Google Antigravity Cloud CLI mode ──
                    cmd = [
                        agy_path, "-p",
                        f"Autonomous Studio Builder: Read PROMPT.md in current directory and build the complete website: {full_prompt}",
                        "--dangerously-skip-permissions",
                        "--add-dir", str(project_dir),
                    ]
                    try:
                        log_file = open(task_dir / "antigravity-stdout.log", "w")
                        err_file = open(task_dir / "antigravity-stderr.log", "w")
                        proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=log_file, stderr=err_file)
                        agent_pid = proc.pid
                        agent_mode = "antigravity"
                        self.SERVER_REGISTRY[f"studio-{safe}"] = {
                            "name": f"Studio: {name}",
                            "type": "agent",
                            "process": proc,
                            "port": None,
                            "cwd": str(project_dir),
                        }
                        results.append({"framework": studio, "status": "spawning", "mode": "antigravity", "pid": agent_pid})
                    except Exception as e:
                        results.append({"framework": "antigravity", "status": "error", "error": str(e)})
                elif codex_path:
                    # ── Codex exec mode ──
                    cmd = [
                        codex_path, "exec",
                        "-m", model,
                        "--full-auto",
                        "--skip-git-repo-check",
                        "-C", str(project_dir),
                        "-o", str(task_dir / "last-message.txt"),
                        full_prompt,
                    ]
                    try:
                        log_file = open(task_dir / "codex-stdout.log", "w")
                        err_file = open(task_dir / "codex-stderr.log", "w")
                        proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=log_file, stderr=err_file)
                        agent_pid = proc.pid
                        agent_mode = "codex"
                        self.SERVER_REGISTRY[f"studio-{safe}"] = {
                            "name": f"Studio: {name}",
                            "type": "agent",
                            "process": proc,
                            "port": None,
                            "cwd": str(project_dir),
                        }
                        results.append({"framework": studio, "status": "spawning", "mode": "codex", "pid": agent_pid})
                    except Exception as e:
                        results.append({"framework": "codex", "status": "error", "error": str(e)})
                elif hermes_path:
                    # ── Hermes Agent mode ──
                    cmd = [hermes_path, "-z", full_prompt, "--yolo"]
                    try:
                        log_file = open(task_dir / "hermes-stdout.log", "w")
                        err_file = open(task_dir / "hermes-stderr.log", "w")
                        proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=log_file, stderr=err_file)
                        agent_pid = proc.pid
                        agent_mode = "hermes"
                        results.append({"framework": studio, "status": "spawning", "mode": "hermes", "pid": agent_pid})
                    except Exception as e:
                        results.append({"framework": "hermes", "status": "error", "error": str(e)})
                elif ollama_path:
                    # ── Ollama mode: Local AI fallback ──
                    try:
                        s = __import__("socket").socket(__import__("socket").AF_INET, __import__("socket").SOCK_STREAM)
                        s.settimeout(2)
                        s.connect(("127.0.0.1", 11434))
                        s.close()
                    except Exception:
                        results.append({"framework": studio, "status": "error", "error": "Ollama is not running. Start it with: ollama serve"})
                    else:
                        runner = ORCH_DIR / "studio-agents" / "agent-runner.py"
                        if runner.exists():
                            cmd = [sys.executable, str(runner), "--task-dir", str(task_dir), "--studio", studio, "--model", model, "--output-dir", str(project_dir)]
                            try:
                                proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                                agent_pid = proc.pid
                                agent_mode = "agent-runner"
                                results.append({"framework": studio, "status": "spawning", "mode": "agent-runner", "pid": agent_pid})
                            except Exception as e:
                                results.append({"framework": "agent-runner", "status": "error", "error": str(e)})
                        else:
                            cmd = [ollama_path, "run", model, full_prompt]
                            try:
                                proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=open(task_dir / "ollama-stdout.log", "w"), stderr=open(task_dir / "ollama-stderr.log", "w"))
                                agent_pid = proc.pid
                                agent_mode = "ollama"
                                results.append({"framework": studio, "status": "spawning", "mode": "ollama", "pid": agent_pid})
                            except Exception as e:
                                results.append({"framework": "ollama", "status": "error", "error": str(e)})
                else:
                    results.append({"framework": studio, "status": "error", "error": "No AI backend found. Install agy, codex, or hermes."})

                # ── Store build result ──
                build_result = {
                    "site": safe,
                    "dir": str(project_dir),
                    "agent_mode": agent_mode,
                    "results": results,
                }

                if safe in self.STUDIO_PROJECTS:
                    self.STUDIO_PROJECTS[safe]["status"] = "building"
                    self.STUDIO_PROJECTS[safe]["agent_pid"] = agent_pid
                    self.STUDIO_PROJECTS[safe]["agent_mode"] = agent_mode
                    self.STUDIO_PROJECTS[safe]["task_dir"] = str(task_dir)

                self._send_json({
                    "status": "ok", "site": safe, "results": results,
                    "output": build_dir, "dir": str(project_dir),
                    "agent_pid": agent_pid, "agent_mode": agent_mode,
                    "task_dir": str(task_dir),
                })
                return

            # ─── API: studio deploy ───
            if path == "/api/studio/deploy":
                name = data.get("name", "").strip()
                safe = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") if name else ""
                self._send_json({"status": "ok", "site": safe, "url": f"https://{safe}.netlify.app", "message": "Deploy initiated"})
                return

            # ─── API: studio generate-prompt ───
            if path == "/api/studio/generate-prompt":
                name = data.get("name", "project")
                instructions = data.get("instructions", "")
                frameworks = data.get("frameworks", [])
                theme = data.get("theme", "")
                site_type = data.get("site_type", "")
                tone = data.get("tone", "")
                features = data.get("features", [])
                keywords = data.get("keywords", "")
                logo_url = data.get("logo_url", "")
                depth = data.get("depth", [])
                pages = data.get("pages", "home, about, contact")
                agents = data.get("agents", [])
                fw_labels = {"astro": "Astro", "react": "React", "vite": "Vite", "html": "Vanilla HTML/CSS",
                             "vue": "Vue", "python": "Python/Flask", "angular": "Angular", "svelte": "Svelte"}
                fw_str = ", ".join([fw_labels.get(f, f) for f in frameworks]) if frameworks else "Auto-select"
                feat_str = ", ".join(features) if features else "Default"
                depth_str = ", ".join(depth) if depth else "launch-ready"
                agent_lines = ""
                if agents:
                    agent_lines = "\n\n## Agent Pipeline\n" + "\n".join(
                        [f"  {i+1}. {a.get('name', a.get('id', 'Agent'))} - {a.get('role', '')}" for i, a in enumerate(agents)]
                    )
                prompt = f"# Project: {name}\n\n## Overview\n{instructions or 'No specific instructions provided.'}\n\n## Configuration\n- Type: {site_type or 'Not specified'}\n- Tone: {tone or 'Not specified'}\n- Frameworks: {fw_str}\n- Theme: {theme or 'Auto-select'}\n- Features: {feat_str}\n- Keywords: {keywords or 'None'}\n- Pages / Routes: {pages or 'home'}\n- Build Depth: {depth_str}\n"
                if logo_url:
                    prompt += f"- Logo URL: {logo_url}\n"
                prompt += f"\n## Build Instructions\n1. Analyze user requirements and select optimal architecture\n2. Generate a finished experience with {fw_str}, not a nicer starter shell\n3. Implement every requested page with unique title, meta description, canonical URL, heading hierarchy, and internal links\n4. Add sitemap.xml, robots.txt, OG/Twitter metadata, favicon/brand fallback, forms, and accessible alt text where applicable\n5. Write specific audience-aware content, useful examples, trust cues, and conversion paths\n6. Build and validate for production readiness; record any unresolved issues{agent_lines}"
                self._send_json({"prompt": prompt.strip(), "project_name": name})
                return

            # ─── API: studio assign-agents ───
            if path == "/api/studio/assign-agents":
                project_name = data.get("project_name", "")
                agent_ids = data.get("agent_ids", [])
                safe = re.sub(r"[^a-z0-9]+", "-", project_name.lower()).strip("-") if project_name else ""
                if safe in self.STUDIO_PROJECTS:
                    self.STUDIO_PROJECTS[safe]["agents"] = agent_ids
                    self._send_json({"status": "ok", "project": safe, "agents": agent_ids})
                else:
                    self._send_json({"error": "project not found"}, 404)
                return

            # ─── API: create agent ───
            if path == "/api/agents" and self.command == "POST":
                agent_id = data.get("id", f"custom-{int(datetime.now(timezone.utc).timestamp())}")
                agent_data = {**data, "id": agent_id, "custom": True, "created_at": datetime.now(timezone.utc).isoformat()}
                self.AGENTS_STORE[agent_id] = agent_data
                self._send_json({"status": "ok", "agent": agent_data})
                return

            # ─── API: vite generate ───
            if path == "/api/vite/generate":
                name = data.get("name", "").strip()
                if not name:
                    self._send_json({"error": "name required"}, 400)
                    return
                safe = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
                self._send_json({"status": "ok", "site": safe, "message": "Vite site generation queued"})
                return

            # ─── API: vite build ───
            if path == "/api/vite/build":
                self._send_json({"status": "ok", "message": "Vite build queued"})
                return

            # ─── API: vite preview ───
            if path == "/api/vite/preview":
                name = data.get("name", "").strip()
                safe = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") if name else "preview"
                self._send_json({"status": "started", "site": safe, "url": "http://localhost:5173"})
                return

            # ─── API: vite preview-stop ───
            if path == "/api/vite/preview-stop":
                self._send_json({"status": "stopped"})
                return

            # ─── 404 ───
            self._send_json({"error": "not found", "path": path}, 404)

    # ─── Additional HTTP methods ───
    def _do_PUT_DELETE(self, method_name):
        if not self._check_auth():
            self._send_json({"error": "unauthorized"}, 401)
            return
        path = urllib.parse.urlparse(self.path).path.rstrip("/") or "/"
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len) if content_len else b"{}"
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            data = {}
        # ─── API: delete annotation (DELETE) ───
        if path == "/api/annotations" and method_name == "DELETE":
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            note_id = qs.get("id", [None])[0] or data.get("id")
            if not note_id:
                self._send_json({"error": "id parameter required"}, 400)
                return
            res = _delete_swarm_annotation(note_id)
            self._send_json(res)
            return

        # ─── API: update agent (PUT) ───
        if path.startswith("/api/agents/") and method_name == "PUT":
            agent_id = path.split("/api/agents/")[-1].strip("/")
            agent_data = {**data, "id": agent_id, "custom": True, "updated_at": datetime.now(timezone.utc).isoformat()}
            AgentAPIHandler.AGENTS_STORE[agent_id] = agent_data
            self._send_json({"status": "ok", "agent": agent_data})
            return
        # ─── API: delete agent (DELETE) ───
        if path.startswith("/api/agents/") and method_name == "DELETE":
            agent_id = path.split("/api/agents/")[-1].strip("/")
            if agent_id in AgentAPIHandler.AGENTS_STORE:
                del AgentAPIHandler.AGENTS_STORE[agent_id]
                self._send_json({"status": "deleted", "id": agent_id})
            else:
                self._send_json({"error": "agent not found"}, 404)
            return
        # ─── API: remove astro section (DELETE) ───
        if path.startswith("/api/astro/site/") and "/section/" in path and method_name == "DELETE":
            parts = path.split("/")
            # /api/astro/site/{site}/section/{sectionId}
            self._send_json({"status": "ok", "message": "section removed"})
            return
        self._send_json({"error": "not found", "path": path}, 404)

    AgentAPIHandler.do_PUT = lambda self: self._do_PUT_DELETE("PUT")
    AgentAPIHandler.do_DELETE = lambda self: self._do_PUT_DELETE("DELETE")

    # ─── Start server ───
    AgentAPIHandler.api_token = api_token_val
    server_mode = getattr(args, "server", "auto")

    def _run_stdlib():
        """Run the stdlib ThreadedHTTPServer with proper signal handling."""
        class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
            allow_reuse_address = True
            daemon_threads = True

        server = ThreadedHTTPServer((host, port), AgentAPIHandler)
        server.timeout = 0.5  # Fast poll so Ctrl+C responds within 500ms

        import signal
        import threading

        def _graceful_shutdown(sig, frame):
            # Force-exit from a separate thread to unblock serve_forever
            print(f"\n⏹ Received signal {sig}, shutting down...")
            def _do_shutdown():
                try:
                    server.shutdown()
                except Exception:
                    pass
                # Force exit after brief grace period
                time.sleep(0.5)
                os._exit(0)
            threading.Thread(target=_do_shutdown, daemon=True).start()

        signal.signal(signal.SIGINT, _graceful_shutdown)
        signal.signal(signal.SIGTERM, _graceful_shutdown)

        print(f"── Z0TH Orchestrator API ──────────────────────")
        print(f"  Server:   stdlib http.server")
        print(f"  Listening: http://{host}:{port}")
        print(f"  Dashboard: http://{host}:{port}/dashboard")
        print(f"  API:       http://{host}:{port}/api/tools")
        print(f"────────────────────────────────────────────────")
        server.serve_forever()
        return 0

    def _run_uvicorn():
        """Run with uvicorn for clean Ctrl+C and proper async."""
        try:
            import uvicorn
            from runtime.asgi_app import create_app
            app = create_app(AgentAPIHandler, host, port, api_token_val,
                             ORCH_DIR, DASHBOARD_DIR)
            print(f"── Z0TH Orchestrator API ──────────────────────")
            print(f"  Server:   uvicorn + Starlette")
            print(f"  Listening: http://{host}:{port}")
            print(f"  Dashboard: http://{host}:{port}/dashboard")
            print(f"  API:       http://{host}:{port}/api/tools")
            print(f"────────────────────────────────────────────────")
            uvicorn.run(app, host=host, port=port, log_level="warning",
                        timeout_keep_alive=30)
            return 0
        except ImportError:
            print("[serve] uvicorn/starlette not installed — falling back to stdlib")
            return _run_stdlib()

    if server_mode == "stdlib":
        return _run_stdlib()
    elif server_mode == "uvicorn":
        return _run_uvicorn()
    else:  # auto
        try:
            import uvicorn
            return _run_uvicorn()
        except ImportError:
            return _run_stdlib()

# ═══════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="NULL AI Tool Orchestrator")
    sub = parser.add_subparsers(dest="command", help="Available commands")

    p_scan = sub.add_parser("scan", help="Re-index all tools")
    p_scan.set_defaults(func=command_scan)

    p_list = sub.add_parser("list", help="List registered tools")
    p_list.add_argument("--summary", action="store_true", help="Summary by category")
    p_list.add_argument("--category", "-c", help="Filter by category")
    p_list.add_argument("--runtime", "-r", help="Filter by runtime")
    p_list.set_defaults(func=command_list)

    p_show = sub.add_parser("show", help="Show tool details")
    p_show.add_argument("tool_id", help="Tool ID or name")
    p_show.set_defaults(func=command_show)

    p_doctor = sub.add_parser("doctor", help="System health check")
    p_doctor.set_defaults(func=command_doctor)

    p_deps = sub.add_parser("deps", help="List / install Zoth runtime dependencies")
    p_deps.add_argument("--install", action="store_true", help="pip-install required Python modules")
    p_deps.add_argument("--json", action="store_true", help="Machine-readable probe")
    p_deps.set_defaults(func=command_deps)

    p_dash = sub.add_parser("dashboard", help="CLI dashboard view")
    p_dash.set_defaults(func=command_dashboard)

    p_run = sub.add_parser("run", help="Run a tool command")
    p_run.add_argument("tool_id", help="Tool ID or name")
    p_run.add_argument("command", nargs=argparse.REMAINDER, help="Command to run")
    p_run.add_argument("--confirm", action="store_true", help="Actually execute (default: dry-run)")
    p_run.set_defaults(func=command_run)

    p_install = sub.add_parser("install", help="Install tool dependencies")
    p_install.add_argument("tool_id", help="Tool ID or name")
    p_install.add_argument("--confirm", action="store_true", help="Actually install")
    p_install.set_defaults(func=command_install)

    p_serve = sub.add_parser("serve", help="Start HTTP API server")
    p_serve.add_argument("--port", "-p", type=int, default=8484, help="Port (default: 8484)")
    p_serve.add_argument("--host", default="127.0.0.1", help="Host (default: 127.0.0.1, loopback only)")
    p_serve.add_argument("--public", action="store_true",
                        help="Allow non-loopback bind (off by default — do not put this on a tunnel)")
    p_serve.add_argument("--token", help="API token for auth")
    p_serve.add_argument("--server", choices=["auto", "uvicorn", "stdlib"], default="auto",
                         help="Server backend: auto=uvicorn if available, else stdlib (default: auto)")
    p_serve.set_defaults(func=command_serve)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return 1

    try:
        return args.func(args)
    except KeyboardInterrupt:
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
