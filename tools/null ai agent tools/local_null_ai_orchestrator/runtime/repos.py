"""In-house git repos + backup destinations (folder, rclone/Drive, GitHub)."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ORCH_DIR = Path(__file__).resolve().parents[1]
ZOTH_DIR = ORCH_DIR.parents[2] if len(ORCH_DIR.parents) >= 3 else ORCH_DIR
DATA = ORCH_DIR / "runtime" / "data" / "repos.json"
EXCLUDE = (
    ".env",
    ".env.*",
    "node_modules",
    ".git",
    "runtime/data/byok.json",
    "runtime/data/conversations.json",
    "__pycache__",
    "*.gguf",
    ".vault",
)


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def _read() -> dict[str, Any]:
    if not DATA.exists():
        return {"repos": [], "destinations": []}
    try:
        data = json.loads(DATA.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {"repos": [], "destinations": []}
    except Exception:
        return {"repos": [], "destinations": []}


def _write(data: dict[str, Any]) -> None:
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _git(cwd: str | Path, *args: str, timeout: int = 40) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(cwd), *args],
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _run(cmd: list[str], timeout: int = 120) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def default_repo_path() -> str:
    if (ZOTH_DIR / ".git").exists():
        return str(ZOTH_DIR)
    top = _git(ORCH_DIR, "rev-parse", "--show-toplevel")
    if top.returncode == 0 and top.stdout.strip():
        return top.stdout.strip()
    return str(ORCH_DIR)


def ensure_defaults() -> dict[str, Any]:
    data = _read()
    repos = data.setdefault("repos", [])
    dests = data.setdefault("destinations", [])
    path = default_repo_path()
    if not any(r.get("path") == path for r in repos):
        repos.insert(0, {"id": "zoth", "label": "Zoth Studio", "path": path})
    if not any(d.get("id") == "github" for d in dests):
        dests.append({
            "id": "github",
            "kind": "github",
            "label": "GitHub (git remote)",
            "remote": "origin",
        })
    if not any(d.get("id") == "gdrive" for d in dests):
        dests.append({
            "id": "gdrive",
            "kind": "gdrive",
            "label": "Google Drive (rclone)",
            "rclone": os.environ.get("GDRIVE_RCLONE_REMOTE") or "gdrive",
            "path": os.environ.get("GDRIVE_BACKUP_PATH") or "ZothBackups/zoth",
        })
    if not any(d.get("id") == "folder" for d in dests):
        dests.append({
            "id": "folder",
            "kind": "folder",
            "label": "Local folder",
            "path": os.environ.get("ZOTH_BACKUP_DIR") or str(Path.home() / "ZothBackups"),
        })
    _write(data)
    return data


def rclone_remotes() -> list[str]:
    if not shutil.which("rclone"):
        return []
    try:
        r = _run(["rclone", "listremotes"], timeout=8)
    except Exception:
        return []
    if r.returncode != 0:
        return []
    return [ln.strip().rstrip(":") for ln in r.stdout.splitlines() if ln.strip()]


def git_status(path: str | None = None) -> dict[str, Any]:
    root = Path(path or default_repo_path())
    if not (root / ".git").exists() and _git(root, "rev-parse", "--is-inside-work-tree").returncode != 0:
        return {"ok": False, "path": str(root), "error": "not a git repository"}
    branch = _git(root, "rev-parse", "--abbrev-ref", "HEAD").stdout.strip() or "HEAD"
    head = _git(root, "log", "-1", "--format=%h %s").stdout.strip()
    porcelain = _git(root, "status", "--porcelain").stdout
    remotes = {}
    for line in _git(root, "remote", "-v").stdout.splitlines():
        parts = line.split()
        if len(parts) >= 2 and parts[-1] == "(fetch)":
            remotes[parts[0]] = parts[1]
    ahead = behind = 0
    if "origin" in remotes:
        cnt = _git(root, "rev-list", "--left-right", "--count", "origin/HEAD...HEAD")
        if cnt.returncode == 0 and cnt.stdout.strip():
            bits = cnt.stdout.split()
            if len(bits) == 2:
                behind, ahead = int(bits[0]), int(bits[1])
    return {
        "ok": True,
        "path": str(root),
        "branch": branch,
        "head": head,
        "dirty": bool(porcelain.strip()),
        "changed": len([ln for ln in porcelain.splitlines() if ln.strip()]),
        "remotes": remotes,
        "ahead": ahead,
        "behind": behind,
    }


def snapshot() -> dict[str, Any]:
    data = ensure_defaults()
    repos = []
    for rec in data.get("repos") or []:
        st = git_status(rec.get("path"))
        st["id"] = rec.get("id")
        st["label"] = rec.get("label") or rec.get("id")
        repos.append(st)
    dests = []
    remotes = rclone_remotes()
    for d in data.get("destinations") or []:
        item = dict(d)
        kind = item.get("kind")
        if kind == "gdrive":
            name = (item.get("rclone") or "gdrive").rstrip(":")
            item["rclone_ready"] = name in remotes
            item["rclone_remotes"] = remotes
            item["ready"] = bool(shutil.which("rclone") and name in remotes)
            item["next"] = None if item["ready"] else {
                "kind": "install" if not shutil.which("rclone") else "auth",
                "command": "rclone config" if shutil.which("rclone") else "sudo apt install rclone",
                "hint": "Add a Drive remote, then set its name here (e.g. gdrive).",
            }
        elif kind == "github":
            path = (data["repos"][0]["path"] if data.get("repos") else default_repo_path())
            st = git_status(path)
            item["ready"] = bool((st.get("remotes") or {}).get(item.get("remote") or "origin"))
            item["url"] = (st.get("remotes") or {}).get(item.get("remote") or "origin")
        elif kind == "folder":
            item["ready"] = True
        dests.append(item)
    return {
        "git": bool(shutil.which("git")),
        "rclone": bool(shutil.which("rclone")),
        "rclone_remotes": remotes,
        "repos": repos,
        "destinations": dests,
    }


def save_destination(patch: dict[str, Any]) -> dict[str, Any]:
    data = ensure_defaults()
    dest_id = (patch.get("id") or "").strip() or "custom"
    found = False
    for d in data["destinations"]:
        if d.get("id") == dest_id:
            d.update({k: v for k, v in patch.items() if v not in (None, "")})
            found = True
            break
    if not found:
        data["destinations"].append(patch)
    _write(data)
    return snapshot()


def _bundle(root: Path) -> Path:
    stamp = _now()
    out_dir = ORCH_DIR / "runtime" / "data" / "bundles"
    out_dir.mkdir(parents=True, exist_ok=True)
    bundle = out_dir / f"{root.name}-{stamp}.bundle"
    r = _git(root, "bundle", "create", str(bundle), "--all", timeout=90)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip() or r.stdout.strip() or "git bundle failed")
    manifest = {
        "created": stamp,
        "repo": str(root),
        "bundle": bundle.name,
        "status": git_status(str(root)),
    }
    (out_dir / f"{root.name}-{stamp}.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return bundle


def backup(dest_id: str, repo_id: str | None = None, push: bool = False) -> dict[str, Any]:
    data = ensure_defaults()
    repo = next((r for r in data["repos"] if r.get("id") == (repo_id or "zoth")), None)
    if not repo and data["repos"]:
        repo = data["repos"][0]
    if not repo:
        return {"ok": False, "error": "no repo registered"}
    dest = next((d for d in data["destinations"] if d.get("id") == dest_id), None)
    if not dest:
        return {"ok": False, "error": f"unknown destination `{dest_id}`"}
    root = Path(repo["path"])
    st = git_status(str(root))
    if not st.get("ok"):
        return {"ok": False, "error": st.get("error"), "status": st}

    kind = dest.get("kind")
    if kind == "github":
        if not push:
            return {
                "ok": True,
                "dry": True,
                "kind": "github",
                "remote": dest.get("remote") or "origin",
                "url": (st.get("remotes") or {}).get(dest.get("remote") or "origin"),
                "note": "GitHub push is opt-in. Call again with push=true after you confirm.",
                "status": st,
            }
        remote = dest.get("remote") or "origin"
        r = _git(root, "push", remote, "HEAD", timeout=90)
        return {
            "ok": r.returncode == 0,
            "kind": "github",
            "remote": remote,
            "log": (r.stdout or r.stderr)[-1200:],
            "status": git_status(str(root)),
        }

    try:
        bundle = _bundle(root)
    except Exception as e:
        return {"ok": False, "error": str(e), "status": st}

    if kind == "folder":
        dest_path = Path(dest.get("path") or (Path.home() / "ZothBackups"))
        dest_path.mkdir(parents=True, exist_ok=True)
        target = dest_path / bundle.name
        shutil.copy2(bundle, target)
        man = bundle.with_suffix(".json")
        if man.exists():
            shutil.copy2(man, dest_path / man.name)
        return {"ok": True, "kind": "folder", "path": str(target), "bytes": target.stat().st_size, "status": st}

    if kind == "gdrive":
        if not shutil.which("rclone"):
            return {"ok": False, "error": "rclone not installed", "install": "sudo apt install rclone"}
        remote = (dest.get("rclone") or "gdrive").rstrip(":")
        if remote not in rclone_remotes():
            return {
                "ok": False,
                "error": f"rclone remote `{remote}` is not configured",
                "next": "Run `rclone config` and create a Google Drive remote, then set its name on this destination.",
                "remotes": rclone_remotes(),
            }
        dest_dir = f"{remote}:{(dest.get('path') or 'ZothBackups/zoth').strip('/')}"
        r = _run(["rclone", "copy", str(bundle), dest_dir, "--retries", "2"], timeout=180)
        if r.returncode != 0:
            return {"ok": False, "kind": "gdrive", "error": (r.stderr or r.stdout)[-800:], "dest": dest_dir}
        return {"ok": True, "kind": "gdrive", "dest": dest_dir, "bundle": bundle.name, "status": st}

    return {"ok": False, "error": f"unsupported destination kind `{kind}`"}
