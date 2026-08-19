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
  session    Interactive agent session
  chain      List or run tool chains
  env        Show environment info
  assess     Assess tool readiness
  serve      HTTP API server (for web dashboard)
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
    registry = load_registry()
    tools = registry.get("tools", [])
    api_token_val = getattr(args, "token", None)

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
            allowed = self.allowed_origin
            if allowed == "*":
                self.send_header("Access-Control-Allow-Origin", "*")
            elif origin and (origin.startswith("http://localhost") or origin.startswith("http://127.0.0.1")):
                self.send_header("Access-Control-Allow-Origin", origin)
            else:
                self.send_header("Access-Control-Allow-Origin", f"http://localhost:{port}")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
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

            # ─── API: dashboard ───
            if path == "/api/dashboard":
                registry = load_registry()
                self._send_json({
                    "tool_count": len(registry.get("tools", [])),
                    "status": "ok",
                    "version": "2.0.0",
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

            # ─── API: shutdown ───
            if path == "/api/shutdown":
                def _do_shutdown():
                    time.sleep(0.3)
                    os._exit(0)
                threading.Thread(target=_do_shutdown, daemon=True).start()
                self._send_json({"status": "shutdown_initiated", "message": "Zoth Studio server shutting down smoothly."})
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

            # ─── API: swarm generate-site (Multi-Agent Synthesizer) ───
            if path in ("/api/swarm/generate-site", "/api/studio/generate-site"):
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

                if codex_path:
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
                elif ollama_path:
                    # ── Ollama mode: use ollama run to generate site ──
                    # First check if ollama serve is running
                    try:
                        s = __import__("socket").socket(__import__("socket").AF_INET, __import__("socket").SOCK_STREAM)
                        s.settimeout(2)
                        s.connect(("127.0.0.1", 11434))
                        s.close()
                    except Exception:
                        results.append({"framework": studio, "status": "error", "error": "Ollama is not running. Start it with: ollama serve"})
                    else:
                        # Use ollama to generate the site via the agent-runner
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
                            # Direct ollama run fallback
                            cmd = [ollama_path, "run", model, full_prompt]
                            try:
                                proc = subprocess.Popen(cmd, cwd=str(project_dir), stdout=open(task_dir / "ollama-stdout.log", "w"), stderr=open(task_dir / "ollama-stderr.log", "w"))
                                agent_pid = proc.pid
                                agent_mode = "ollama"
                                self.SERVER_REGISTRY[f"studio-{safe}"] = {
                                    "name": f"Studio: {name}", "type": "agent", "process": proc, "port": None, "cwd": str(project_dir),
                                }
                                results.append({"framework": studio, "status": "spawning", "mode": "ollama", "pid": agent_pid})
                            except Exception as e:
                                results.append({"framework": "ollama", "status": "error", "error": str(e)})
                else:
                    # No AI backend available
                    results.append({"framework": studio, "status": "error", "error": "No AI backend found. Install codex or ollama."})

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
