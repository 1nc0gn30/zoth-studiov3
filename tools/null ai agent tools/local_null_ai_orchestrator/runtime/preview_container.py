"""Podman-based containerized preview management for AstroPlanet and other tools.

Enforces resource limits (RAM/CPU) and provides lifecycle tracking for
development preview servers running inside a shared container sandbox.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

CONTAINER_NAME = "nullai-preview-host"
DEFAULT_MEMORY = "4g"
DEFAULT_CPUS = "2"
DEFAULT_PORT_RANGE_START = 4322
DEFAULT_PORT_RANGE_END = 4330


@dataclass
class PreviewContainer:
    """Manages a Podman container that hosts multiple preview servers."""

    astro_tool_dir: Path
    memory: str = DEFAULT_MEMORY
    cpus: str = DEFAULT_CPUS
    port_start: int = DEFAULT_PORT_RANGE_START
    port_end: int = DEFAULT_PORT_RANGE_END

    @property
    def _container_exists(self) -> bool:
        result = subprocess.run(
            ["podman", "inspect", CONTAINER_NAME],
            capture_output=True, text=True, check=False
        )
        return result.returncode == 0

    @property
    def _container_running(self) -> bool:
        result = subprocess.run(
            ["podman", "inspect", "-f", "{{.State.Running}}", CONTAINER_NAME],
            capture_output=True, text=True, check=False
        )
        return result.returncode == 0 and result.stdout.strip() == "true"

    def ensure(self) -> dict[str, Any]:
        """Create or restart the preview host container."""
        if self._container_running:
            return {"status": "running", "name": CONTAINER_NAME}

        if self._container_exists:
            # Remove stale container
            subprocess.run(
                ["podman", "rm", "-f", CONTAINER_NAME],
                capture_output=True, check=False
            )

        # Build port mappings
        port_mappings = [
            f"-p={p}:{p}"
            for p in range(self.port_start, self.port_end + 1)
        ]

        # Ensure node_modules exists in the Astro dir so the container can use it
        node_modules = self.astro_tool_dir / "node_modules"
        if not node_modules.exists():
            return {
                "status": "error",
                "error": f"node_modules missing in {self.astro_tool_dir}. Run npm install first."
            }

        # Build volume mounts
        # Mount the Astro tool dir so the container can read/write it
        mounts = [
            f"--volume={self.astro_tool_dir}:{self.astro_tool_dir}:Z",
        ]

        # Also mount node_modules if it's a symlink or separate location
        # but the above should cover it

        cmd = [
            "podman", "run", "-d",
            f"--name={CONTAINER_NAME}",
            f"--memory={self.memory}",
            f"--cpus={self.cpus}",
            *port_mappings,
            *mounts,
            "docker.io/library/node:20-slim",
            "tail", "-f", "/dev/null",
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            return {
                "status": "error",
                "error": f"podman run failed: {result.stderr.strip()}",
            }

        return {
            "status": "created",
            "name": CONTAINER_NAME,
            "cid": result.stdout.strip(),
            "memory": self.memory,
            "cpus": self.cpus,
        }

    def stop_container(self) -> dict[str, Any]:
        """Stop and remove the preview host container."""
        if not self._container_exists:
            return {"status": "not_found"}
        subprocess.run(
            ["podman", "rm", "-f", CONTAINER_NAME],
            capture_output=True, check=False
        )
        return {"status": "removed", "name": CONTAINER_NAME}

    def start_preview(
        self,
        site_name: str,
        port: int,
        command: list[str],
        cwd: Path,
    ) -> dict[str, Any]:
        """Start a preview server inside the container via podman exec."""
        ensure_result = self.ensure()
        if ensure_result.get("status") == "error":
            return ensure_result

        # Sanitize site name for container exec session naming
        safe = site_name.replace(" ", "_").replace("/", "_")
        session_name = f"preview-{safe}-{port}"

        # Check if a session with this name already exists
        existing = subprocess.run(
            ["podman", "exec", CONTAINER_NAME, "sh", "-c",
             f"ps aux | grep -v grep | grep '{site_name}' | grep 'npm run dev' | awk '{{print $2}}'"],
            capture_output=True, text=True, check=False
        )
        if existing.stdout.strip():
            old_pid = existing.stdout.strip().split("\n")[0]
            subprocess.run(
                ["podman", "exec", CONTAINER_NAME, "kill", old_pid],
                capture_output=True, check=False
            )

        # Build the command to run inside the container
        # We need to cd to the correct directory and run npm
        env_vars = f"ASTRO_SITE_NAME={site_name}"
        shell_cmd = f"cd {cwd} && {env_vars} {' '.join(command)} > /tmp/{session_name}.log 2>&1 & echo $!"

        result = subprocess.run(
            ["podman", "exec", CONTAINER_NAME, "sh", "-c", shell_cmd],
            capture_output=True, text=True, check=False
        )

        if result.returncode != 0:
            return {
                "status": "error",
                "error": f"podman exec failed: {result.stderr.strip()}",
            }

        pid = result.stdout.strip().split("\n")[-1].strip()

        return {
            "status": "started",
            "site": site_name,
            "port": port,
            "pid": pid,
            "session_name": session_name,
            "log_file": f"/tmp/{session_name}.log",
        }

    def stop_preview(self, site_name: str, port: int) -> dict[str, Any]:
        """Stop a preview server inside the container."""
        if not self._container_running:
            return {"status": "not_running", "site": site_name}

        safe = site_name.replace(" ", "_").replace("/", "_")
        session_name = f"preview-{safe}-{port}"

        # Find and kill the process
        result = subprocess.run(
            ["podman", "exec", CONTAINER_NAME, "sh", "-c",
             f"ps aux | grep -v grep | grep '{site_name}' | grep 'npm run dev' | awk '{{print $2}}'"],
            capture_output=True, text=True, check=False
        )

        pids = [p.strip() for p in result.stdout.strip().split("\n") if p.strip()]
        for pid in pids:
            subprocess.run(
                ["podman", "exec", CONTAINER_NAME, "kill", pid],
                capture_output=True, check=False
            )

        # Also try to clean up any orphaned node processes on the port
        subprocess.run(
            ["podman", "exec", CONTAINER_NAME, "sh", "-c",
             f"kill $(lsof -t -i:{port}) 2>/dev/null || true"],
            capture_output=True, check=False
        )

        return {"status": "stopped", "site": site_name, "pids_killed": pids}

    def list_previews(self) -> list[dict[str, Any]]:
        """List running preview processes inside the container."""
        if not self._container_running:
            return []

        result = subprocess.run(
            ["podman", "exec", CONTAINER_NAME, "sh", "-c",
             "ps aux | grep 'npm run dev' | grep -v grep || true"],
            capture_output=True, text=True, check=False
        )

        previews = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split()
            if len(parts) < 11:
                continue
            pid = parts[1]
            cmd = " ".join(parts[10:])
            # Extract port from command
            port = None
            for i, arg in enumerate(parts):
                if arg == "--port" and i + 1 < len(parts):
                    port = int(parts[i + 1])
                    break
            previews.append({
                "pid": pid,
                "command": cmd,
                "port": port,
            })

        return previews

    def inspect(self) -> dict[str, Any]:
        """Get container resource usage info."""
        if not self._container_exists:
            return {"status": "not_found"}

        stats = subprocess.run(
            ["podman", "stats", CONTAINER_NAME, "--no-stream", "--format", "json"],
            capture_output=True, text=True, check=False
        )

        info = subprocess.run(
            ["podman", "inspect", CONTAINER_NAME],
            capture_output=True, text=True, check=False
        )

        return {
            "status": "ok",
            "stats": json.loads(stats.stdout) if stats.returncode == 0 else None,
            "inspect": json.loads(info.stdout)[0] if info.returncode == 0 else None,
        }


def get_preview_container(
    astro_tool_dir: Path,
    memory: str = DEFAULT_MEMORY,
    cpus: str = DEFAULT_CPUS,
) -> PreviewContainer:
    return PreviewContainer(
        astro_tool_dir=astro_tool_dir,
        memory=memory,
        cpus=cpus,
    )


__all__ = [
    "PreviewContainer",
    "get_preview_container",
    "CONTAINER_NAME",
    "DEFAULT_MEMORY",
    "DEFAULT_CPUS",
]
