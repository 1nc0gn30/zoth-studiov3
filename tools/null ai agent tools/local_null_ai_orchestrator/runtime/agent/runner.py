"""Null AI Agent Runtime — core agent loop.

Takes a task, discovers tools, executes them, and reports results.
Designed to be called by the orchestrator or run standalone.
"""

from __future__ import annotations

import json
import os
import shlex
import subprocess
import sys
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class AgentTask:
    """A task for the agent runtime to execute."""
    id: str
    description: str
    tool_id: str | None
    action: str
    args: list[str] = field(default_factory=list)
    chain_id: str | None = None
    timeout: int = 120


@dataclass
class AgentResult:
    """Result of an agent task execution."""
    task_id: str
    tool_id: str
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: int
    started_at: str
    finished_at: str
    status: str = "unknown"


class AgentRuntime:
    """Lightweight agent that runs tools through the orchestrator."""

    def __init__(self, orch_dir: str | Path, registry: dict | None = None):
        self.orch_dir = Path(orch_dir)
        self.orchestrator = self.orch_dir / "orchestrator.py"
        self.registry = registry or {}
        self.tools = self.registry.get("tools", [])
        self.runs_dir = self.orch_dir / "runs" / "agent-runs"
        self.runs_dir.mkdir(parents=True, exist_ok=True)

    def find_tool(self, tool_id: str) -> dict | None:
        """Find a tool by ID or name from the registry."""
        for t in self.tools:
            if t.get("id") == tool_id or t.get("name") == tool_id:
                return t
            # Fuzzy match: partial name
            if tool_id.lower() in t.get("id", "").lower() or tool_id.lower() in t.get("name", "").lower():
                return t
        return None

    def resolve_action(self, tool: dict, action: str) -> list[str]:
        """Resolve an action name to a shell command."""
        entrypoints = tool.get("entrypoints", [])
        runtimes = tool.get("runtimes", [])
        tool_path = Path(tool["path"])

        action_map = {
            "status": ["ls", "-la"],
            "validate": ["bash", "scripts/agent-validate.sh"] if (tool_path / "scripts/agent-validate.sh").exists() else ["ls", "-la"],
            "build": ["npm", "run", "build"] if (tool_path / "package.json").exists() else ["echo", "no build script"],
            "lint": ["npx", "tsc", "--noEmit"] if (tool_path / "node_modules/.bin/tsc").exists() else ["echo", "no typecheck"],
            "dev": ["npm", "run", "dev"],
            "install": ["npm", "install", "--no-audit", "--no-fund"],
            "test": ["npm", "test"] if (tool_path / "package.json").exists() and "test" in json.loads((tool_path / "package.json").read_text()).get("scripts", {}) else ["echo", "no test script"],
        }

        if action in action_map:
            return action_map[action]

        # Try to find a matching entrypoint
        if action == "analyze" and "python" in runtimes:
            core_ep = next((e for e in entrypoints if "core" in e or "main" in e or "app" in e), None)
            if core_ep:
                return ["python3", core_ep]
        if action == "scan" and "python" in runtimes:
            py_ep = next((e for e in entrypoints if e.endswith(".py")), None)
            if py_ep:
                return ["python3", py_ep]
        if action == "generate" and "python" in runtimes:
            gen_ep = next((e for e in entrypoints if "generate" in e), None)
            if gen_ep:
                return ["python3", gen_ep]

        # Fallback
        if "python" in runtimes:
            py_entry = next((e for e in entrypoints if e.endswith(".py")), None)
            if py_entry:
                return ["python3", py_entry]
        if "node" in runtimes:
            return ["node", "--version"]

        return ["ls", "-la"]

    def execute(self, task: AgentTask) -> AgentResult:
        """Execute a single task against a tool."""
        started_at = datetime.now(timezone.utc).isoformat()
        start_ms = int(time.time() * 1000)

        tool = self.find_tool(task.tool_id) if task.tool_id else None
        if not tool:
            return AgentResult(
                task_id=task.id,
                tool_id=task.tool_id or "unknown",
                exit_code=-1,
                stdout="",
                stderr=f"Tool not found: {task.tool_id}",
                duration_ms=0,
                started_at=started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                status="error",
            )

        cmd = self.resolve_action(tool, task.action)
        tool_path = Path(tool["path"])

        if not tool_path.exists():
            return AgentResult(
                task_id=task.id,
                tool_id=tool["id"],
                exit_code=-1,
                stdout="",
                stderr=f"Tool path not found: {tool_path}",
                duration_ms=0,
                started_at=started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                status="error",
            )

        print(f"  ├ Running: {' '.join(cmd)}")
        print(f"  ├ In:      {tool_path.name}")

        try:
            result = subprocess.run(
                cmd, cwd=tool_path, text=True,
                capture_output=True, timeout=task.timeout,
            )
            duration = int(time.time() * 1000) - start_ms
            status = "success" if result.returncode == 0 else "failure"

            # Truncate output for logging
            stdout = (result.stdout or "")[:2000]
            stderr = (result.stderr or "")[:1000]

            return AgentResult(
                task_id=task.id,
                tool_id=tool["id"],
                exit_code=result.returncode,
                stdout=stdout,
                stderr=stderr,
                duration_ms=duration,
                started_at=started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                status=status,
            )
        except subprocess.TimeoutExpired:
            return AgentResult(
                task_id=task.id,
                tool_id=tool["id"],
                exit_code=-1,
                stdout="",
                stderr=f"Timed out after {task.timeout}s",
                duration_ms=int(time.time() * 1000) - start_ms,
                started_at=started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                status="timeout",
            )

    def run_chain(self, chain_id: str, chains: list[dict]) -> list[AgentResult]:
        """Execute all steps in a chain."""
        chain = next((c for c in chains if c["id"] == chain_id), None)
        if not chain:
            print(f"  ✗ Chain not found: {chain_id}")
            return []

        print(f"\n  ╭─ Chain: {chain['name']}")
        print(f"  ├ {chain.get('description', '')}")

        results = []
        for i, step in enumerate(chain.get("steps", []), 1):
            print(f"  ├─ Step {i}/{len(chain['steps'])}: {step['tool_id']}")
            task = AgentTask(
                id=f"{chain_id}-step-{i}",
                description=step.get("description", step["action"]),
                tool_id=step["tool_id"],
                action=step["action"],
                chain_id=chain_id,
            )
            result = self.execute(task)
            results.append(result)

            status_mark = "✓" if result.exit_code == 0 else "✗"
            print(f"  │  {status_mark} Exit: {result.exit_code} ({result.duration_ms}ms)")
            if result.stdout and len(result.stdout) > 0:
                preview = result.stdout.strip()[:120]
                if preview:
                    print(f"  │  → {preview}")

        success = sum(1 for r in results if r.exit_code == 0)
        print(f"  ╰─ Chain complete: {success}/{len(results)} steps passed")
        return results

    def run_tasklist(self, tasks: list[AgentTask], chains: list[dict] | None = None) -> list[AgentResult]:
        """Execute a list of tasks, with optional chain support."""
        all_results = []

        for task in tasks:
            if task.chain_id and chains:
                chain_results = self.run_chain(task.chain_id, chains)
                all_results.extend(chain_results)
            elif task.tool_id:
                result = self.execute(task)
                all_results.append(result)
            else:
                print(f"  ✗ Task {task.id}: no tool_id or chain_id specified")
                continue

        return all_results

    def save_results(self, results: list[AgentResult]) -> Path:
        """Save agent run results to a log file."""
        from runtime.agent import __version__ as _agent_version
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
        report = {
            "agent_runtime_version": _agent_version,
            "ran_at": timestamp,
            "task_count": len(results),
            "passed": sum(1 for r in results if r.exit_code == 0),
            "failed": sum(1 for r in results if r.exit_code != 0),
            "results": [asdict(r) for r in results],
        }
        report_path = self.runs_dir / f"run_{timestamp}.json"
        report_path.write_text(json.dumps(report, indent=2))
        print(f"\n  Report: {report_path}")
        return report_path


def load_registry(orch_dir: str | Path) -> dict:
    """Load the tool registry from the orchestrator."""
    registry_path = Path(orch_dir) / "registry.local.json"
    if registry_path.exists():
        return json.loads(registry_path.read_text())
    return {"tools": []}


def load_chains(orch_dir: str | Path) -> list[dict]:
    """Load chains from the orchestrator."""
    chains_path = Path(orch_dir) / "chains.json"
    if chains_path.exists():
        return json.loads(chains_path.read_text())
    return []


__all__ = [
    "AgentRuntime",
    "AgentTask",
    "AgentResult",
    "load_registry",
    "load_chains",
]
