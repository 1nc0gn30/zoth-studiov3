"""Standard agent protocol for Null AI Framework.

Defines how agents discover, interact with, and chain tools.
Provides a JSON-based protocol layer for multi-agent orchestration.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class AgentBackend:
    """Represents an installed agent backend."""
    name: str
    executable: str | None
    version: str | None = None
    args: list[str] = field(default_factory=list)
    notes: str = ""

    @property
    def is_available(self) -> bool:
        return self.executable is not None


def detect_backends() -> dict[str, AgentBackend]:
    """Auto-detect installed agent backends on the system."""
    backends: dict[str, AgentBackend] = {}

    candidates = [
        ("codex", "codex"),
        ("openclaw", "openclaw"),
        ("hermes", "hermes"),
        ("aicommit", "aicommit"),
        ("copilot", "github-copilot-cli"),
    ]

    for name, binary in candidates:
        exe = shutil.which(binary)
        version = None
        if exe:
            try:
                result = subprocess.run(
                    [exe, "--version"], capture_output=True, text=True, check=False, timeout=5
                )
                version = (result.stdout or result.stderr or "").strip()[:80]
            except (FileNotFoundError, subprocess.TimeoutExpired):
                pass
        backends[name] = AgentBackend(name=name, executable=exe, version=version)

    return backends


@dataclass
class ToolAction:
    """A single action an agent can execute on a tool."""
    name: str
    description: str
    command: str
    cwd_relative: str = "."
    expected_output: str = ""
    safety: str = "safe"  # safe, network, destructive


@dataclass
class AgentContract:
    """Standardized contract for how an agent interacts with a tool."""
    tool_id: str
    tool_name: str
    category: str
    runtimes: list[str]
    entrypoints: list[str]
    actions: list[ToolAction] = field(default_factory=list)
    output_folders: list[str] = field(default_factory=lambda: ["runs", "reports", "exports"])
    safety_notes: list[str] = field(default_factory=list)
    agent_hints: list[str] = field(default_factory=list)


def build_contract_from_registry(tool: dict[str, Any]) -> AgentContract:
    """Build an AgentContract from a registry tool record."""
    actions: list[ToolAction] = []
    entrypoints = tool.get("entrypoints", [])

    for ep in entrypoints:
        ext = Path(ep).suffix
        if ext == ".py":
            actions.append(ToolAction(
                name=f"run-{Path(ep).stem}",
                description=f"Run the {ep} Python entrypoint",
                command=f"python3 {ep}",
            ))
        elif ext == ".ts":
            actions.append(ToolAction(
                name=f"run-{Path(ep).stem}",
                description=f"Run the {ep} TypeScript entrypoint",
                command=f"npx tsx {ep}",
            ))
        elif ext == ".go":
            actions.append(ToolAction(
                name=f"run-{Path(ep).stem}",
                description=f"Run the {ep} Go entrypoint",
                command=f"go run {ep}",
            ))
        elif ext == ".rs":
            actions.append(ToolAction(
                name=f"run-{Path(ep).stem}",
                description=f"Run the {ep} Rust entrypoint",
                command=f"cargo run --manifest-path {Path(ep).parent}/Cargo.toml",
            ))
        elif ext == ".sh":
            actions.append(ToolAction(
                name=f"run-{Path(ep).stem}",
                description=f"Run the {ep} shell script",
                command=f"bash {ep}",
            ))
        elif ep == "package.json":
            actions.append(ToolAction(
                name="npm-start",
                description="Start with npm",
                command="npm start",
            ))
        elif ep == "index.html":
            actions.append(ToolAction(
                name="open-index",
                description="Open index.html in browser",
                command="xdg-open index.html",
            ))

    # Add npm scripts from package scripts
    pkg_scripts = tool.get("package_scripts", {})
    for script_name, script_cmd in pkg_scripts.items():
        if script_name not in ("start", "dev", "build"):
            actions.append(ToolAction(
                name=f"npm-{script_name}",
                description=f"npm run {script_name}",
                command=f"npm run {script_name}",
            ))
    # Always add basic actions
    base_actions = [
        ToolAction(name="status", description="Check tool status", command="ls -la"),
    ]
    if "python" in tool.get("runtimes", []):
        base_actions.append(ToolAction(
            name="install-deps", description="Install Python dependencies",
            command="pip3 install -r requirements.txt 2>/dev/null || true",
        ))
    if "node" in tool.get("runtimes", []):
        base_actions.append(ToolAction(
            name="npm-install", description="Install Node dependencies",
            command="npm install --no-audit --no-fund 2>/dev/null || true",
        ))

    all_actions = base_actions + actions
    # Deduplicate by name
    seen: set[str] = set()
    deduped: list[ToolAction] = []
    for a in all_actions:
        if a.name not in seen:
            seen.add(a.name)
            deduped.append(a)

    return AgentContract(
        tool_id=tool.get("id", "unknown"),
        tool_name=tool.get("name", "unknown"),
        category=tool.get("category", "Uncategorized"),
        runtimes=tool.get("runtimes", []),
        entrypoints=entrypoints,
        actions=deduped,
    )


@dataclass
class ChainStep:
    """A step in a tool chain."""
    tool_id: str
    action: str
    args: list[str] = field(default_factory=list)
    description: str = ""


@dataclass
class Chain:
    """A chain of tool actions to execute sequentially."""
    id: str
    name: str
    steps: list[ChainStep]
    description: str = ""


# Built-in chains for common workflows
BUILTIN_CHAINS: list[Chain] = [
    Chain(
        id="seo-audit",
        name="SEO Audit Pipeline",
        description="Run SEO analysis tools in sequence",
        steps=[
            ChainStep(tool_id="local_null_ai_seotrendtool", action="analyze", description="Run SEO trend analysis"),
            ChainStep(tool_id="local_null_ai_local-business-lead-scanner", action="scan", description="Scan local business leads"),
        ],
    ),
    Chain(
        id="security-scan",
        name="Security Scan Pipeline",
        description="Run security tools in sequence. Requires --confirm and authorization.",
        steps=[
            ChainStep(tool_id="local_null_ai_backdoor_detector", action="scan", description="Detect backdoors"),
            ChainStep(tool_id="local_null_ai_PHISH_HUNTER_PRO", action="hunt", description="Hunt phish"),
        ],
    ),
    Chain(
        id="media-pipeline",
        name="Media Generation Pipeline",
        description="Generate media assets",
        steps=[
            ChainStep(tool_id="local_null_ai_pixelz", action="generate", description="Generate pixel art"),
            ChainStep(tool_id="local_null_ai_sonicvision-ai", action="process", description="Process audio/vision"),
        ],
    ),
    Chain(
        id="site-deploy",
        name="Site Build & Deploy",
        description="Build and deploy a website",
        steps=[
            ChainStep(tool_id="local_null_ai_lumina-builder", action="build", description="Build site with Vite/React"),
            ChainStep(tool_id="local_null_ai_astro-for-ai", action="validate", description="Validate Astro site configs"),
        ],
    ),
    Chain(
        id="astro-validate",
        name="Astro Site Validation",
        description="Validate all Astro sites in the framework",
        steps=[
            ChainStep(tool_id="local_null_ai_astro-for-ai", action="validate", description="Validate astro-for-ai configs"),
            ChainStep(tool_id="local_null_ai_nona", action="validate", description="Validate nona site configs"),
            ChainStep(tool_id="local_null_ai_neonevents", action="validate", description="Validate neonevents site configs"),
        ],
    ),
    Chain(
        id="lumina-build",
        name="Lumina Build Pipeline",
        description="Build and lint the Lumina website builder",
        steps=[
            ChainStep(tool_id="local_null_ai_lumina-builder", action="lint", description="TypeScript check"),
            ChainStep(tool_id="local_null_ai_lumina-builder", action="build", description="Production build"),
        ],
    ),
]


def get_builtin_chains() -> list[dict[str, Any]]:
    """Get built-in chains as serializable dicts."""
    return [asdict(c) for c in BUILTIN_CHAINS]


__all__ = [
    "AgentBackend",
    "AgentContract",
    "ToolAction",
    "Chain",
    "ChainStep",
    "detect_backends",
    "build_contract_from_registry",
    "get_builtin_chains",
]
