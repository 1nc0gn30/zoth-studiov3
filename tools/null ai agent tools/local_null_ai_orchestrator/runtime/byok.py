"""Local BYOK store — values stay on disk, API never returns them."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

STORE = Path(__file__).resolve().parent / "data" / "byok.json"

KNOWN = (
    "STRIPE_SECRET_KEY",
    "STRIPE_API_KEY",
    "NETLIFY_AUTH_TOKEN",
    "NETLIFY_DEPLOY_HOOK",
    "GITHUB_TOKEN",
    "GH_TOKEN",
    "SOLANA_RPC_URL",
    "HELIUS_API_KEY",
    "HOSTINGER_API_TOKEN",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GROQ_API_KEY",
    "GDRIVE_RCLONE_REMOTE",
    "GDRIVE_BACKUP_PATH",
    "ZOTH_BACKUP_DIR",
)


def _read() -> dict[str, str]:
    if not STORE.exists():
        return {}
    try:
        data = json.loads(STORE.read_text(encoding="utf-8"))
        return {str(k): str(v) for k, v in data.items() if v} if isinstance(data, dict) else {}
    except Exception:
        return {}


def _write(data: dict[str, str]) -> None:
    STORE.parent.mkdir(parents=True, exist_ok=True)
    STORE.write_text(json.dumps(data, indent=2), encoding="utf-8")
    try:
        os.chmod(STORE, 0o600)
    except Exception:
        pass


def apply_to_env() -> None:
    for k, v in _read().items():
        if v and not os.environ.get(k):
            os.environ[k] = v


def status() -> dict[str, Any]:
    apply_to_env()
    saved = _read()
    flags = {}
    for key in KNOWN:
        flags[key] = bool(os.environ.get(key) or saved.get(key))
    return {"keys": flags}


def set_key(name: str, value: str) -> dict[str, Any]:
    name = (name or "").strip()
    if name not in KNOWN:
        return {"error": f"unknown key `{name}`"}
    data = _read()
    val = (value or "").strip()
    if val:
        data[name] = val
        os.environ[name] = val
    else:
        data.pop(name, None)
        os.environ.pop(name, None)
    _write(data)
    return status()
