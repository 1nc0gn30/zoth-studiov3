"""Zoth Studio dependency catalog.

Used by `orchestrator.py deps`, `/doctor`, and scripts/deps-debian.sh.
Required items are what a Debian/Ubuntu user needs to run the deck (:8484).
Recommended / optional items unlock hub, Drive, GitHub, vault, local models.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

ORCH_DIR = Path(__file__).resolve().parents[1]
ZOTH_DIR = ORCH_DIR.parents[2]
MIN_PY = (3, 10)


def _which(name: str) -> str | None:
    return shutil.which(name)


def _run(cmd: list[str], timeout: int = 8) -> str:
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return ""
    return (r.stdout or r.stderr or "").strip().splitlines()[0] if r.returncode == 0 else ""


def _py_mod(name: str) -> bool:
    try:
        __import__(name)
        return True
    except Exception:
        return False


def _py_ver_ok() -> bool:
    return sys.version_info[:2] >= MIN_PY


def _file_ok(path: Path) -> bool:
    return path.is_file()


SPEC: list[dict[str, Any]] = [
    {
        "id": "python3",
        "name": "Python 3.10+",
        "tier": "required",
        "why": "Runs the Studio deck on :8484.",
        "detect": "python",
        "debian": ["python3", "python3-venv", "python3-pip", "python3-dev"],
        "url": "https://www.python.org/downloads/",
        "apt_url": "https://packages.debian.org/stable/python3",
    },
    {
        "id": "git",
        "name": "Git",
        "tier": "required",
        "why": "In-house repo, bundles, and GitHub backup.",
        "detect": "bin",
        "bin": "git",
        "debian": ["git"],
        "url": "https://git-scm.com/downloads",
        "apt_url": "https://packages.debian.org/stable/git",
    },
    {
        "id": "curl",
        "name": "curl",
        "tier": "required",
        "why": "Health checks and installer scripts.",
        "detect": "bin",
        "bin": "curl",
        "debian": ["curl", "ca-certificates"],
        "url": "https://curl.se/download.html",
        "apt_url": "https://packages.debian.org/stable/curl",
    },
    {
        "id": "starlette",
        "name": "Starlette + Uvicorn",
        "tier": "required",
        "why": "ASGI server for the deck. Stdlib fallback exists but is weaker.",
        "detect": "pymod",
        "modules": ["starlette", "uvicorn"],
        "pip": ["starlette>=0.37", "uvicorn>=0.30"],
        "url": "https://www.starlette.io/",
        "apt_url": "https://packages.debian.org/stable/python3-starlette",
    },
    {
        "id": "dashboard",
        "name": "Deck UI bundle",
        "tier": "required",
        "why": "Prebuilt dashboard in dashboard/dist. Rebuild only if you edit the React source.",
        "detect": "file",
        "path": str(ORCH_DIR / "dashboard" / "dist" / "index.html"),
        "url": "https://nodejs.org/",
    },
    {
        "id": "node",
        "name": "Node.js 18+ + npm",
        "tier": "recommended",
        "why": "Rebuild the React deck, generate sites, run netlify-cli.",
        "detect": "bin",
        "bin": "node",
        "also": ["npm"],
        "debian": ["nodejs", "npm"],
        "url": "https://nodejs.org/en/download",
        "apt_url": "https://github.com/nodesource/distributions",
        "note": "Debian's nodejs can be old. Ubuntu 24.04 is fine. Otherwise use NodeSource or nvm.",
    },
    {
        "id": "docker",
        "name": "Docker Engine",
        "tier": "recommended",
        "why": "Sandboxed public hub on :8088 (nginx). Without it, `zoth-start` uses Python http.server.",
        "detect": "bin",
        "bin": "docker",
        "debian": ["docker.io", "docker-compose-v2"],
        "url": "https://docs.docker.com/engine/install/ubuntu/",
        "apt_url": "https://docs.docker.com/engine/install/debian/",
    },
    {
        "id": "rclone",
        "name": "rclone",
        "tier": "recommended",
        "why": "Google Drive list/read/upload and repo backups.",
        "detect": "bin",
        "bin": "rclone",
        "debian": ["rclone"],
        "url": "https://rclone.org/install/",
        "apt_url": "https://packages.debian.org/stable/rclone",
        "note": "After install: `rclone config` then set GDRIVE_RCLONE_REMOTE in BYOK.",
    },
    {
        "id": "gh",
        "name": "GitHub CLI",
        "tier": "recommended",
        "why": "Auth helper for the GitHub tool. A GITHUB_TOKEN in BYOK also works.",
        "detect": "bin",
        "bin": "gh",
        "debian": ["gh"],
        "url": "https://cli.github.com/",
        "apt_url": "https://github.com/cli/cli/blob/trunk/docs/install_linux.md",
    },
    {
        "id": "git-lfs",
        "name": "Git LFS",
        "tier": "optional",
        "why": "Large media in clones. Not required to run the deck.",
        "detect": "bin",
        "bin": "git-lfs",
        "debian": ["git-lfs"],
        "url": "https://git-lfs.com/",
        "apt_url": "https://packages.debian.org/stable/git-lfs",
    },
    {
        "id": "ffmpeg",
        "name": "FFmpeg",
        "tier": "optional",
        "why": "Media forge / video tools.",
        "detect": "bin",
        "bin": "ffmpeg",
        "debian": ["ffmpeg"],
        "url": "https://ffmpeg.org/download.html",
        "apt_url": "https://packages.debian.org/stable/ffmpeg",
    },
    {
        "id": "rust",
        "name": "Rust + Cargo",
        "tier": "optional",
        "why": "Build the vault daemon. The UI works without it (browser AES-GCM fallback).",
        "detect": "bin",
        "bin": "cargo",
        "also": ["rustc"],
        "debian": ["cargo", "rustc"],
        "url": "https://rustup.rs/",
        "apt_url": "https://packages.debian.org/stable/cargo",
        "note": "Prefer rustup for a current toolchain: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
    },
    {
        "id": "ollama",
        "name": "Ollama",
        "tier": "optional",
        "why": "Local models on :11434.",
        "detect": "bin",
        "bin": "ollama",
        "debian": [],
        "url": "https://ollama.com/download/linux",
        "install_sh": "curl -fsSL https://ollama.com/install.sh | sh",
    },
    {
        "id": "build-essential",
        "name": "C toolchain",
        "tier": "optional",
        "why": "Compile Python wheels and the vault daemon.",
        "detect": "bin",
        "bin": "gcc",
        "debian": ["build-essential", "pkg-config", "libssl-dev"],
        "url": "https://packages.debian.org/stable/build-essential",
        "apt_url": "https://packages.debian.org/stable/build-essential",
    },
]


def _check_one(spec: dict[str, Any]) -> dict[str, Any]:
    kind = spec["detect"]
    present = False
    detail = ""
    path = None
    if kind == "python":
        present = _py_ver_ok()
        detail = sys.version.split()[0]
        path = sys.executable
        if not present:
            detail = f"{detail} (need >={MIN_PY[0]}.{MIN_PY[1]})"
    elif kind == "bin":
        bin_name = spec["bin"]
        path = _which(bin_name)
        present = bool(path)
        detail = _run([bin_name, "--version"]) or _run([bin_name, "-v"]) or (path or "not on PATH")
        missing_also = [b for b in spec.get("also") or [] if not _which(b)]
        if present and missing_also:
            present = False
            detail = f"{bin_name} ok; missing {', '.join(missing_also)}"
    elif kind == "pymod":
        mods = spec.get("modules") or []
        missing = [m for m in mods if not _py_mod(m)]
        present = not missing
        detail = "ok" if present else f"missing Python modules: {', '.join(missing)}"
    elif kind == "file":
        p = Path(spec["path"])
        present = _file_ok(p)
        path = str(p)
        detail = "built" if present else "dashboard/dist/index.html missing — run `npm run build` in dashboard/"
    row = {
        "id": spec["id"],
        "name": spec["name"],
        "tier": spec["tier"],
        "ok": present,
        "why": spec["why"],
        "detail": detail,
        "path": path,
        "debian": spec.get("debian") or [],
        "pip": spec.get("pip") or [],
        "url": spec.get("url") or "",
        "apt_url": spec.get("apt_url") or "",
        "install_sh": spec.get("install_sh") or "",
        "note": spec.get("note") or "",
    }
    return row


def probe() -> dict[str, Any]:
    items = [_check_one(s) for s in SPEC]
    missing = [i for i in items if not i["ok"]]
    required_missing = [i for i in missing if i["tier"] == "required"]
    return {
        "schema": "zoth-deps/v1",
        "os": sys.platform,
        "python": sys.version.split()[0],
        "zoth": str(ZOTH_DIR),
        "orch": str(ORCH_DIR),
        "ready": not required_missing,
        "count": len(items),
        "ok": sum(1 for i in items if i["ok"]),
        "missing": len(missing),
        "required_missing": [i["id"] for i in required_missing],
        "items": items,
    }


def apt_line(items: list[dict[str, Any]] | None = None) -> str:
    pkgs: list[str] = []
    for i in items or probe()["items"]:
        if i["ok"]:
            continue
        pkgs.extend(i.get("debian") or [])
    # unique, stable
    seen: list[str] = []
    for p in pkgs:
        if p not in seen:
            seen.append(p)
    if not seen:
        return ""
    return "sudo apt-get update && sudo apt-get install -y " + " ".join(seen)


def pip_line() -> str:
    req = ORCH_DIR / "requirements.txt"
    if req.is_file():
        return f'"{sys.executable}" -m pip install --user -r "{req}"'
    return f'"{sys.executable}" -m pip install --user "starlette>=0.37" "uvicorn>=0.30"'


def format_report(data: dict[str, Any] | None = None) -> str:
    data = data or probe()
    lines = [
        f"**Zoth dependencies** — {data['ok']}/{data['count']} present"
        + (" · deck can start" if data["ready"] else " · required items missing"),
        "",
    ]
    marks = {"required": "required", "recommended": "recommended", "optional": "optional"}
    for i in data["items"]:
        flag = "ok" if i["ok"] else "MISSING"
        lines.append(f"- `{i['id']}` **{flag}** ({marks[i['tier']]}) — {i['name']}")
        lines.append(f"  {i['why']}")
        if i["detail"]:
            lines.append(f"  {i['detail']}")
        if not i["ok"]:
            if i["debian"]:
                lines.append(f"  Debian/Ubuntu: `sudo apt-get install -y {' '.join(i['debian'])}`")
            if i["pip"]:
                lines.append(f"  Python: `python3 -m pip install --user {' '.join(i['pip'])}`")
            if i.get("install_sh"):
                lines.append(f"  Installer: `{i['install_sh']}`")
            if i["url"]:
                lines.append(f"  Docs: {i['url']}")
            if i.get("note"):
                lines.append(f"  Note: {i['note']}")
    apt = apt_line(data["items"])
    if apt:
        lines.append("\n**One-shot Debian/Ubuntu (missing apt packages):**")
        lines.append(f"```\n{apt}\n```")
    if any(not i["ok"] and i["pip"] for i in data["items"]):
        lines.append("**Python modules:**")
        lines.append(f"```\n{pip_line()}\n```")
    if not data["ready"]:
        lines.append("Fix the required rows, then `python3 orchestrator.py serve` (or `scripts/zoth-start.sh`).")
    else:
        lines.append("Required set is in place. Deck: `python3 orchestrator.py serve --host 127.0.0.1 --port 8484`.")
    return "\n".join(lines)


def install_python(user: bool = True) -> dict[str, Any]:
    req = ORCH_DIR / "requirements.txt"
    cmd = [sys.executable, "-m", "pip", "install"]
    if user:
        cmd.append("--user")
    if req.is_file():
        cmd.extend(["-r", str(req)])
    else:
        cmd.extend(["starlette>=0.37", "uvicorn>=0.30"])
    r = subprocess.run(cmd, capture_output=True, text=True)
    return {
        "ok": r.returncode == 0,
        "cmd": " ".join(cmd),
        "stdout": (r.stdout or "")[-800:],
        "stderr": (r.stderr or "")[-800:],
    }


def debian_id() -> dict[str, str]:
    info = {"id": "", "like": "", "version": ""}
    path = Path("/etc/os-release")
    if not path.is_file():
        return info
    data = {}
    for line in path.read_text().splitlines():
        if "=" in line:
            k, _, v = line.partition("=")
            data[k] = v.strip().strip('"')
    info["id"] = data.get("ID") or ""
    info["like"] = data.get("ID_LIKE") or ""
    info["version"] = data.get("VERSION_ID") or ""
    return info


def is_debian_family() -> bool:
    info = debian_id()
    blob = f"{info['id']} {info['like']}".lower()
    return any(x in blob for x in ("debian", "ubuntu", "linuxmint", "pop", "raspbian", "parrot"))
