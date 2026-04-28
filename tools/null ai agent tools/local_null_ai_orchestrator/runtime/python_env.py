"""Python environment management for Null AI tools.

Handles venv creation, dependency installation, and
runtime detection for Python-based tools on Parrot OS.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class PythonEnv:
    """Represents a managed Python virtual environment for a tool."""

    tool_path: Path
    venv_name: str = ".null_ai_venv"
    requirements_files: list[str] = field(default_factory=lambda: ["requirements.txt", "requirements-ai.txt"])

    @property
    def venv_path(self) -> Path:
        return self.tool_path / self.venv_name

    @property
    def python_bin(self) -> Path:
        return self.venv_path / "bin" / "python3"

    @property
    def pip_bin(self) -> Path:
        return self.venv_path / "bin" / "pip3"

    @property
    def is_created(self) -> bool:
        return self.venv_path.exists() and self.python_bin.exists()

    def create(self, force: bool = False) -> dict[str, Any]:
        """Create the virtual environment."""
        if self.is_created:
            if not force:
                return {"status": "exists", "path": str(self.venv_path)}
            shutil.rmtree(self.venv_path)

        subprocess.run(
            [sys.executable, "-m", "venv", str(self.venv_path)],
            check=True, capture_output=True, text=True
        )
        return {"status": "created", "path": str(self.venv_path)}

    def find_requirements(self) -> list[Path]:
        """Find all requirement-like files in the tool path."""
        found: list[Path] = []
        for fname in self.requirements_files:
            candidate = self.tool_path / fname
            if candidate.exists():
                found.append(candidate)
        # Also check pyproject.toml
        pyproject = self.tool_path / "pyproject.toml"
        if pyproject.exists():
            found.append(pyproject)
        return found

    def install(self, force_create: bool = False) -> dict[str, Any]:
        """Create venv if needed and install dependencies."""
        create_result = self.create(force=force_create)
        reqs = self.find_requirements()

        if not reqs:
            return {**create_result, "installed": [], "note": "No requirement files found"}

        installed: list[str] = []
        errors: list[str] = []

        for req_file in reqs:
            if req_file.suffix == ".toml":
                result = subprocess.run(
                    [str(self.python_bin), "-m", "pip", "install", "-e", str(self.tool_path)],
                    capture_output=True, text=True, check=False
                )
            else:
                result = subprocess.run(
                    [str(self.pip_bin), "install", "-r", str(req_file)],
                    capture_output=True, text=True, check=False
                )

            if result.returncode == 0:
                installed.append(req_file.name)
            else:
                errors.append(f"{req_file.name}: {result.stderr.strip()[:200]}")

        return {
            **create_result,
            "installed": installed,
            "errors": errors if errors else None,
        }

    def run_python(self, script_args: list[str], **run_kwargs: Any) -> subprocess.CompletedProcess:
        """Run a Python script inside the venv."""
        if not self.is_created:
            raise RuntimeError(f"Venv not created at {self.venv_path}")
        return subprocess.run(
            [str(self.python_bin)] + script_args,
            cwd=self.tool_path,
            **run_kwargs,
        )

    def list_packages(self) -> list[dict[str, str]]:
        """List installed packages in the venv."""
        if not self.is_created:
            return []
        result = subprocess.run(
            [str(self.pip_bin), "list", "--format=json"],
            capture_output=True, text=True, check=False
        )
        if result.returncode != 0:
            return []
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return []

    def check_python_version(self) -> dict[str, str | None]:
        """Check the Python version inside the venv."""
        if not self.is_created:
            return {"status": "no-venv", "version": None}
        result = subprocess.run(
            [str(self.python_bin), "--version"],
            capture_output=True, text=True, check=False
        )
        return {
            "status": "ok" if result.returncode == 0 else "error",
            "version": result.stdout.strip() or result.stderr.strip(),
        }


def find_python_tools(registry_tools: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Filter registry tools that use Python runtime."""
    return [
        t for t in registry_tools
        if "python" in t.get("runtimes", [])
    ]


def get_python_version() -> str:
    """Get the system Python version string."""
    return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"


def get_pip_version() -> str | None:
    """Get system pip version."""
    result = subprocess.run(
        [sys.executable, "-m", "pip", "--version"],
        capture_output=True, text=True, check=False
    )
    if result.returncode == 0:
        return result.stdout.strip().split()[1]
    return None


__all__ = [
    "PythonEnv",
    "find_python_tools",
    "get_python_version",
    "get_pip_version",
]
