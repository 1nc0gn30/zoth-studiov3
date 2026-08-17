"""Antigravity connector pack — live status + safe invoke for the harness.

Mirrors 13-creative-media/zoth/public/connectors/index.js:
Stripe, Solana, MetaMask, Bitwarden/Argon2id vault, Netlify, GitHub, Hostinger.
Never returns raw secrets.
"""

from __future__ import annotations

import json
import os
import shutil
import socket
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VAULT_URL = os.environ.get("ZOTH_VAULT_URL", "http://127.0.0.1:8787")

SPECS: list[dict[str, Any]] = [
    {
        "id": "stripe",
        "name": "Stripe Billing",
        "category": "fintech",
        "env": ["STRIPE_SECRET_KEY", "STRIPE_API_KEY"],
        "cli": "stripe",
        "install": "See https://stripe.com/docs/stripe-cli — or `brew install stripe/stripe-cli/stripe`",
        "auth_url": "https://dashboard.stripe.com/apikeys",
        "auth_cli": "stripe login",
        "actions": ["status", "balance"],
        "hint": "Set STRIPE_SECRET_KEY in BYOK, or stripe login.",
    },
    {
        "id": "solana",
        "name": "Solana Web3",
        "category": "crypto",
        "env": ["SOLANA_RPC_URL", "HELIUS_API_KEY"],
        "cli": "solana",
        "install": 'sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"',
        "auth_url": "https://phantom.app/",
        "actions": ["status", "balance"],
        "hint": "Public RPC works without a key. CLI is optional. Wallet is Phantom in the browser.",
    },
    {
        "id": "metamask",
        "name": "MetaMask / EVM",
        "category": "crypto",
        "env": [],
        "cli": None,
        "auth_url": "https://metamask.io/download/",
        "actions": ["status"],
        "hint": "Install the MetaMask extension, then connect in the browser.",
    },
    {
        "id": "vault",
        "name": "Argon2id / Bitwarden vault",
        "category": "security",
        "env": [],
        "cli": "bw",
        "install": "npm i -g @bitwarden/cli",
        "auth_url": "/vault/",
        "actions": ["status", "health"],
        "hint": "Open BYOK vault on this deck. Optional: start the Rust daemon on :8787.",
    },
    {
        "id": "netlify",
        "name": "Netlify deploys",
        "category": "cloud",
        "env": ["NETLIFY_AUTH_TOKEN", "NETLIFY_DEPLOY_HOOK"],
        "cli": "netlify",
        "install": "npm i -g netlify-cli",
        "auth_url": "https://app.netlify.com/user/applications#personal-access-tokens",
        "auth_cli": "netlify login",
        "actions": ["status", "sites", "hook"],
        "hint": "Install netlify-cli, then netlify login — or paste NETLIFY_AUTH_TOKEN in BYOK.",
    },
    {
        "id": "github",
        "name": "GitHub Actions",
        "category": "devops",
        "env": ["GITHUB_TOKEN", "GH_TOKEN"],
        "cli": "gh",
        "install": "sudo apt install gh   # or https://cli.github.com/",
        "auth_url": "https://github.com/settings/tokens/new?scopes=repo,workflow,read:user",
        "auth_cli": "gh auth login",
        "actions": [
            "status",
            "whoami",
            "dispatch",
            "user.me",
            "repos.list",
            "repos.get",
            "contents.list",
            "contents.get",
            "contents.put",
            "commits.list",
            "branches.list",
            "issues.list",
            "issues.get",
            "issues.create",
            "issues.comment",
            "prs.list",
            "prs.get",
            "prs.create",
        ],
        "hint": "Install gh, run gh auth login, or paste GITHUB_TOKEN in BYOK.",
    },
    {
        "id": "gdrive",
        "name": "Google Drive backup",
        "category": "backup",
        "env": ["GDRIVE_RCLONE_REMOTE", "GDRIVE_BACKUP_PATH"],
        "cli": "rclone",
        "install": "sudo apt install rclone",
        "auth_cli": "rclone config",
        "auth_url": "https://rclone.org/drive/",
        "actions": ["status", "about", "files.list", "files.get", "files.cat", "files.put", "files.mkdir"],
        "hint": "rclone remote to a Drive folder. Store the remote name in BYOK (GDRIVE_RCLONE_REMOTE).",
    },
    {
        "id": "folder",
        "name": "Local folder backup",
        "category": "backup",
        "env": ["ZOTH_BACKUP_DIR"],
        "cli": None,
        "actions": ["status"],
        "hint": "Copy a git bundle to a folder on this machine or a mounted disk.",
    },
    {
        "id": "hostinger",
        "name": "Hostinger cloud",
        "category": "hosting",
        "env": ["HOSTINGER_API_TOKEN"],
        "cli": None,
        "auth_url": "https://hpanel.hostinger.com/",
        "actions": ["status"],
        "hint": "Paste HOSTINGER_API_TOKEN in BYOK.",
    },
]


def _port_open(host: str, port: int) -> bool:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.35)
        ok = s.connect_ex((host, port)) == 0
        s.close()
        return ok
    except Exception:
        return False


def _env_present(names: list[str]) -> tuple[bool, str | None]:
    for n in names:
        if os.environ.get(n):
            return True, n
    return False, None


def _http_json(url: str, method: str = "GET", headers: dict | None = None, body: bytes | None = None, timeout: float = 12):
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode()
            try:
                data = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                data = {"raw": raw[:400]}
            return {"ok": 200 <= resp.status < 300, "status": resp.status, "data": data}
    except urllib.error.HTTPError as e:
        return {"ok": False, "status": e.code, "error": e.reason}
    except Exception as e:
        return {"ok": False, "status": 0, "error": str(e)}


def probe_one(spec: dict[str, Any]) -> dict[str, Any]:
    has_key, key_name = _env_present(spec["env"])
    cli = spec.get("cli")
    cli_path = shutil.which(cli) if cli else None
    row = {
        "id": spec["id"],
        "name": spec["name"],
        "category": spec["category"],
        "hint": spec["hint"],
        "actions": spec["actions"],
        "key": bool(has_key),
        "key_name": key_name,
        "env": spec.get("env") or [],
        "cli": cli,
        "cli_path": cli_path,
        "install": spec.get("install"),
        "auth_url": spec.get("auth_url"),
        "auth_cli": spec.get("auth_cli"),
        "online": False,
        "mode": "offline",
        "detail": "",
        "next": None,
    }
    cid = spec["id"]
    if cid == "vault":
        up = _port_open("127.0.0.1", 8787)
        row["online"] = up
        row["mode"] = "live" if up else ("cli" if cli_path else "offline")
        row["detail"] = "Argon2id daemon :8787" if up else "vault daemon down"
    elif cid == "solana":
        row["online"] = True
        row["mode"] = "rpc"
        row["detail"] = os.environ.get("SOLANA_RPC_URL") or "public mainnet RPC"
    elif cid == "metamask":
        row["mode"] = "browser"
        row["detail"] = "EIP-1193 in the browser only"
    elif cid == "stripe" and has_key:
        row["mode"] = "keyed"
        row["online"] = True
        row["detail"] = f"{key_name} present"
    elif cid == "netlify" and (has_key or cli_path):
        row["mode"] = "keyed" if has_key else "cli"
        row["online"] = True
        row["detail"] = key_name or cli_path
    elif cid == "github" and (has_key or cli_path):
        row["mode"] = "keyed" if has_key else "cli"
        row["online"] = True
        row["detail"] = key_name or cli_path
    elif cid == "gdrive":
        from runtime.repos import rclone_remotes
        remotes = rclone_remotes()
        name = os.environ.get("GDRIVE_RCLONE_REMOTE") or "gdrive"
        ready = bool(cli_path and name in remotes)
        row["online"] = ready
        row["mode"] = "rclone" if ready else ("cli" if cli_path else "offline")
        row["detail"] = f"rclone remote `{name}`" if ready else (
            f"rclone remotes: {', '.join(remotes) or 'none'} — run rclone config"
        )
    elif cid == "folder":
        dest = os.environ.get("ZOTH_BACKUP_DIR") or str(Path.home() / "ZothBackups")
        row["online"] = True
        row["mode"] = "folder"
        row["detail"] = dest
    elif cid == "hostinger" and has_key:
        row["mode"] = "keyed"
        row["online"] = True
        row["detail"] = key_name
    else:
        row["detail"] = "no token — mock / status only"
        row["mode"] = "mock"
    if spec["id"] == "vault":
        row["next"] = {
            "kind": "open",
            "title": "Open BYOK vault",
            "auth_url": "/vault/",
        }
    elif cli and not cli_path and not row["online"]:
        row["next"] = {
            "kind": "install",
            "title": f"Install `{cli}`",
            "command": spec.get("install") or f"Install the `{cli}` CLI, then retry.",
        }
    elif spec.get("env") and not has_key and spec.get("auth_url"):
        row["next"] = {
            "kind": "byok",
            "title": f"Set {spec['env'][0]} in BYOK",
            "auth_url": spec.get("auth_url"),
            "auth_cli": spec.get("auth_cli"),
            "env": spec["env"][0],
        }
    elif spec.get("auth_url") and spec["id"] in {"metamask", "vault"}:
        row["next"] = {
            "kind": "open",
            "title": "Open to connect",
            "auth_url": spec.get("auth_url"),
        }
    return row


def format_setup(result: dict[str, Any]) -> str:
    c = result.get("connector") or result
    if not isinstance(c, dict):
        return str(result)
    lines = [
        f"**{c.get('name') or c.get('id')}** — `{c.get('mode')}`",
        c.get("detail") or c.get("hint") or "",
    ]
    if result.get("sol") is not None:
        lines.append(f"Balance: {result['sol']} SOL")
    if result.get("login"):
        lines.append(f"GitHub: @{result['login']}")
    data = result.get("data")
    if isinstance(data, dict):
        if data.get("login"):
            lines.append(f"Signed in as @{data['login']}")
        items = data.get("items")
        if isinstance(items, list):
            lines.append(f"{data.get('count', len(items))} items")
            for item in items[:20]:
                if not isinstance(item, dict):
                    continue
                name = item.get("full_name") or item.get("name") or item.get("title") or item.get("path") or item.get("sha")
                extra = item.get("type") or item.get("state") or item.get("html_url") or ""
                lines.append(f"- {name} {extra}".rstrip())
        if data.get("text") and not data.get("binary"):
            preview = data["text"]
            if len(preview) > 2500:
                preview = preview[:2500] + "\n…"
            lines.append(f"```\n{preview}\n```")
        if data.get("about"):
            lines.append(str(data["about"])[:400])
    if result.get("error"):
        err = result["error"]
        msg = err.get("message") if isinstance(err, dict) else str(err)
        lines.append(f"Error: {msg}")
    nxt = c.get("next") or {}
    kind = nxt.get("kind")
    if kind == "install" and c.get("install"):
        lines.append("CLI is missing. Install it, then run `/connect` again:")
        lines.append(f"```\n{c['install']}\n```")
    elif kind == "byok":
        key = nxt.get("env") or ((c.get("env") or [""])[0])
        lines.append(f"No key yet. Open **Connect → BYOK** and set `{key}`.")
        if nxt.get("auth_url"):
            lines.append(f"Create a token: {nxt['auth_url']}")
        if nxt.get("auth_cli"):
            lines.append(f"Or authenticate in a terminal: `{nxt['auth_cli']}`")
    elif kind == "open" and nxt.get("auth_url"):
        lines.append(f"Open {nxt['auth_url']} to finish connecting.")
    if result.get("note"):
        lines.append(result["note"])
    lines.append("This is a connector — Generate / website builder stays closed.")
    return "\n\n".join(x for x in lines if x)


def list_connectors() -> dict[str, Any]:
    items = [probe_one(s) for s in SPECS]
    live = sum(1 for i in items if i["online"] or i["mode"] in {"keyed", "rpc", "cli"})
    return {
        "schema": "zoth-connectors/v1",
        "source": "public/connectors/index.js",
        "count": len(items),
        "ready": live,
        "connectors": items,
    }


GITHUB_TOOL_ACTIONS = (
    "user.me",
    "repos.list",
    "repos.get",
    "contents.list",
    "contents.get",
    "contents.put",
    "commits.list",
    "branches.list",
    "issues.list",
    "issues.get",
    "issues.create",
    "issues.comment",
    "prs.list",
    "prs.get",
    "prs.create",
    "workflows.dispatch",
)

_GITHUB_REQUIRED = {
    "user.me": (),
    "repos.list": (),
    "repos.get": ("owner", "repo"),
    "contents.list": ("owner", "repo"),
    "contents.get": ("owner", "repo", "path"),
    "contents.put": ("owner", "repo", "path", "message", "content"),
    "commits.list": ("owner", "repo"),
    "branches.list": ("owner", "repo"),
    "issues.list": ("owner", "repo"),
    "issues.get": ("owner", "repo", "number"),
    "issues.create": ("owner", "repo", "title"),
    "issues.comment": ("owner", "repo", "number", "body"),
    "prs.list": ("owner", "repo"),
    "prs.get": ("owner", "repo", "number"),
    "prs.create": ("owner", "repo", "title", "head", "base"),
    "workflows.dispatch": ("owner", "repo", "workflow"),
}

_GITHUB_LEGACY = {
    "whoami": "user.me",
    "issues.create": "issues.create",
    "pr.open": "prs.create",
    "prs.create": "prs.create",
    "issues.list": "issues.list",
    "prs.list": "prs.list",
    "repos.list": "repos.list",
    "dispatch": "workflows.dispatch",
}

GDRIVE_TOOL_ACTIONS = (
    "about",
    "files.list",
    "files.get",
    "files.cat",
    "files.put",
    "files.mkdir",
)

_GDRIVE_REQUIRED = {
    "about": (),
    "files.list": (),
    "files.get": ("path",),
    "files.cat": ("path",),
    "files.put": ("src", "dest"),
    "files.mkdir": ("path",),
}


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _gh_error(code: str, message: str, request_id: str = "", retryable: bool = False, details: dict | None = None, status: int = 400) -> dict[str, Any]:
    err = {"code": code, "message": message, "retryable": retryable}
    if request_id:
        err["request_id"] = request_id
    if details:
        err["details"] = details
    return {"ok": False, "error": err, "_http": status}


def _gh_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "zoth-studio-harness",
    }


def _normalize_github_body(body: dict[str, Any] | None) -> dict[str, Any]:
    raw = body if isinstance(body, dict) else {}
    action = raw.get("action") or ""
    params = raw.get("params")
    meta = raw.get("meta")
    if not isinstance(params, dict):
        payload = raw.get("payload") if isinstance(raw.get("payload"), dict) else {}
        params = dict(payload)
        repo = raw.get("repo")
        if isinstance(repo, str) and "/" in repo and "owner" not in params:
            owner, name = repo.split("/", 1)
            params["owner"] = owner
            params["repo"] = name
    if not isinstance(meta, dict):
        meta = {
            "request_id": raw.get("request_id") or raw.get("id") or f"gh-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            "ts": raw.get("ts") or _iso_now(),
        }
        if raw.get("token_ref"):
            meta["token_ref"] = raw["token_ref"]
    mapped = _GITHUB_LEGACY.get(str(action))
    return {"action": mapped or str(action), "params": params, "meta": meta}


def _gh_token() -> str:
    try:
        from runtime import byok
        byok.apply_to_env()
    except Exception:
        pass
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""


def github_tool_dispatch(body: dict[str, Any] | None = None) -> dict[str, Any]:
    """GitHub-shaped tool: repos, files, issues, PRs. POST /connect/github/dispatch."""
    import base64

    norm = _normalize_github_body(body)
    action = norm["action"]
    params = norm["params"]
    meta = norm["meta"]
    request_id = str(meta.get("request_id") or "")
    if action not in GITHUB_TOOL_ACTIONS:
        return _gh_error("action_not_found", f"Unsupported action `{action}`.", request_id)
    missing = [k for k in _GITHUB_REQUIRED[action] if not str(params.get(k) or "").strip()]
    if missing:
        return _gh_error("validation_error", f"Missing required params: {', '.join(missing)}", request_id, details={"missing": missing})
    token = _gh_token()
    if not token:
        return _gh_error("auth_failed", "No GITHUB_TOKEN/GH_TOKEN in BYOK.", request_id, status=401)

    owner = str(params.get("owner") or "").strip()
    repo = str(params.get("repo") or "").strip()
    page = int(params.get("page") or 1)
    per_page = min(int(params.get("per_page") or 30), 100)
    headers = _gh_headers(token)
    json_headers = {**headers, "Content-Type": "application/json"}
    ref = str(params.get("ref") or params.get("branch") or "").strip()

    if action == "user.me":
        resp = _http_json("https://api.github.com/user", headers=headers)
        if not resp.get("ok"):
            return _gh_fail(resp, request_id)
        user = resp.get("data") or {}
        return {
            "ok": True,
            "data": {
                "login": user.get("login"),
                "name": user.get("name"),
                "html_url": user.get("html_url"),
                "public_repos": user.get("public_repos"),
            },
            "meta": {"request_id": request_id, "ts": _iso_now()},
        }

    if action == "repos.list":
        q = {"per_page": per_page, "page": page, "sort": params.get("sort") or "updated"}
        if params.get("type"):
            q["type"] = params["type"]
        if params.get("direction"):
            q["direction"] = params["direction"]
        if owner:
            url = f"https://api.github.com/users/{owner}/repos?{urllib.parse.urlencode(q)}"
        else:
            q["affiliation"] = params.get("affiliation") or "owner,collaborator"
            url = f"https://api.github.com/user/repos?{urllib.parse.urlencode(q)}"
        return _gh_list_result(_http_json(url, headers=headers), request_id, page, per_page)

    if action == "repos.get":
        return _gh_item_result(_http_json(f"https://api.github.com/repos/{owner}/{repo}", headers=headers), request_id)

    if action in {"contents.list", "contents.get"}:
        path = str(params.get("path") or "").strip().lstrip("/")
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}" if path else f"https://api.github.com/repos/{owner}/{repo}/contents"
        if ref:
            url += f"?ref={urllib.parse.quote(ref)}"
        resp = _http_json(url, headers=headers)
        if not resp.get("ok"):
            return _gh_fail(resp, request_id)
        data = resp.get("data")
        if isinstance(data, list):
            items = [
                {
                    "name": i.get("name"),
                    "path": i.get("path"),
                    "type": i.get("type"),
                    "size": i.get("size"),
                    "sha": i.get("sha"),
                    "html_url": i.get("html_url"),
                }
                for i in data
                if isinstance(i, dict)
            ]
            return {"ok": True, "data": {"items": items, "count": len(items), "path": path}, "meta": {"request_id": request_id, "ts": _iso_now()}}
        if isinstance(data, dict):
            encoded = data.get("content") or ""
            text = None
            if encoded and data.get("encoding") == "base64":
                try:
                    raw = base64.b64decode(encoded)
                    if len(raw) <= 200_000:
                        text = raw.decode("utf-8")
                except Exception:
                    text = None
            return {
                "ok": True,
                "data": {
                    "name": data.get("name"),
                    "path": data.get("path"),
                    "sha": data.get("sha"),
                    "size": data.get("size"),
                    "html_url": data.get("html_url"),
                    "download_url": data.get("download_url"),
                    "text": text,
                    "binary": text is None,
                },
                "meta": {"request_id": request_id, "ts": _iso_now()},
            }
        return _gh_error("upstream_error", "Unexpected contents payload", request_id, status=502)

    if action == "contents.put":
        path = str(params.get("path") or "").lstrip("/")
        content = params.get("content")
        if not isinstance(content, str):
            return _gh_error("validation_error", "content must be a string (file text or base64)", request_id)
        try:
            base64.b64decode(content, validate=True)
            b64 = content
        except Exception:
            b64 = base64.b64encode(content.encode("utf-8")).decode("ascii")
        payload: dict[str, Any] = {"message": params["message"], "content": b64}
        if ref:
            payload["branch"] = ref
        if params.get("sha"):
            payload["sha"] = params["sha"]
        resp = _http_json(
            f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
            method="PUT",
            headers=json_headers,
            body=json.dumps(payload).encode(),
        )
        return _gh_item_result(resp, request_id)

    if action == "commits.list":
        q = {"per_page": per_page, "page": page}
        if ref:
            q["sha"] = ref
        url = f"https://api.github.com/repos/{owner}/{repo}/commits?{urllib.parse.urlencode(q)}"
        resp = _http_json(url, headers=headers)
        if not resp.get("ok"):
            return _gh_fail(resp, request_id)
        items = []
        for c in resp.get("data") or []:
            if not isinstance(c, dict):
                continue
            commit = c.get("commit") or {}
            items.append({
                "sha": (c.get("sha") or "")[:12],
                "message": (commit.get("message") or "").split("\n", 1)[0],
                "author": ((commit.get("author") or {}).get("name")),
                "date": (commit.get("author") or {}).get("date"),
                "html_url": c.get("html_url"),
            })
        return {"ok": True, "data": {"items": items, "page": page, "per_page": per_page, "count": len(items)}, "meta": {"request_id": request_id, "ts": _iso_now()}}

    if action == "branches.list":
        url = f"https://api.github.com/repos/{owner}/{repo}/branches?{urllib.parse.urlencode({'per_page': per_page, 'page': page})}"
        return _gh_list_result(_http_json(url, headers=headers), request_id, page, per_page)

    if action == "issues.list":
        q = {"state": params.get("state") or "open", "per_page": per_page, "page": page}
        if params.get("labels"):
            labels = params["labels"]
            q["labels"] = ",".join(labels) if isinstance(labels, list) else str(labels)
        if params.get("since"):
            q["since"] = params["since"]
        url = f"https://api.github.com/repos/{owner}/{repo}/issues?{urllib.parse.urlencode(q)}"
        return _gh_list_result(_http_json(url, headers=headers), request_id, page, per_page)

    if action == "issues.get":
        return _gh_item_result(
            _http_json(f"https://api.github.com/repos/{owner}/{repo}/issues/{params['number']}", headers=headers),
            request_id,
        )

    if action == "issues.create":
        payload = {"title": params["title"]}
        for key in ("body", "labels", "assignees"):
            if key in params:
                payload[key] = params[key]
        return _gh_item_result(
            _http_json(
                f"https://api.github.com/repos/{owner}/{repo}/issues",
                method="POST",
                headers=json_headers,
                body=json.dumps(payload).encode(),
            ),
            request_id,
        )

    if action == "issues.comment":
        return _gh_item_result(
            _http_json(
                f"https://api.github.com/repos/{owner}/{repo}/issues/{params['number']}/comments",
                method="POST",
                headers=json_headers,
                body=json.dumps({"body": params["body"]}).encode(),
            ),
            request_id,
        )

    if action == "prs.list":
        q = {"state": params.get("state") or "open", "per_page": per_page, "page": page}
        for key in ("head", "base", "sort", "direction"):
            if params.get(key):
                q[key] = params[key]
        url = f"https://api.github.com/repos/{owner}/{repo}/pulls?{urllib.parse.urlencode(q)}"
        return _gh_list_result(_http_json(url, headers=headers), request_id, page, per_page)

    if action == "prs.get":
        return _gh_item_result(
            _http_json(f"https://api.github.com/repos/{owner}/{repo}/pulls/{params['number']}", headers=headers),
            request_id,
        )

    if action == "prs.create":
        payload = {"title": params["title"], "head": params["head"], "base": params["base"]}
        for key in ("body", "draft", "maintainer_can_modify"):
            if key in params:
                payload[key] = params[key]
        return _gh_item_result(
            _http_json(
                f"https://api.github.com/repos/{owner}/{repo}/pulls",
                method="POST",
                headers=json_headers,
                body=json.dumps(payload).encode(),
            ),
            request_id,
        )

    workflow = str(params.get("workflow") or "").strip()
    branch = ref or "main"
    resp = _http_json(
        f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow}/dispatches",
        method="POST",
        headers=json_headers,
        body=json.dumps({"ref": branch}).encode(),
    )
    if resp.get("ok") or resp.get("status") == 204:
        return {"ok": True, "data": {"dispatched": True, "workflow": workflow, "ref": branch}, "meta": {"request_id": request_id, "ts": _iso_now()}}
    return _gh_fail(resp, request_id)


def _drive_remote() -> str:
    try:
        from runtime import byok
        byok.apply_to_env()
    except Exception:
        pass
    return (os.environ.get("GDRIVE_RCLONE_REMOTE") or "gdrive").rstrip(":")


def _drive_root() -> str:
    try:
        from runtime import byok
        byok.apply_to_env()
    except Exception:
        pass
    return (os.environ.get("GDRIVE_BACKUP_PATH") or "ZothStudio").strip().strip("/")


def _safe_local(path: str) -> Path | None:
    try:
        p = Path(path).expanduser().resolve()
    except Exception:
        return None
    home = Path.home().resolve()
    zoth = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth").resolve()
    allowed = [home, zoth]
    for root in allowed:
        if p == root or root in p.parents:
            return p
    return None


def gdrive_tool_dispatch(body: dict[str, Any] | None = None) -> dict[str, Any]:
    """Drive-shaped twin of the GitHub tool, via rclone. POST /connect/gdrive/dispatch."""
    raw = body if isinstance(body, dict) else {}
    action = str(raw.get("action") or "")
    params = raw.get("params") if isinstance(raw.get("params"), dict) else {}
    meta = raw.get("meta") if isinstance(raw.get("meta"), dict) else {}
    request_id = str(meta.get("request_id") or f"gd-{int(datetime.now(timezone.utc).timestamp() * 1000)}")
    if action not in GDRIVE_TOOL_ACTIONS:
        return _gh_error("action_not_found", f"Unsupported Drive action `{action}`.", request_id)
    missing = [k for k in _GDRIVE_REQUIRED[action] if not str(params.get(k) or "").strip()]
    if missing:
        return _gh_error("validation_error", f"Missing required params: {', '.join(missing)}", request_id, details={"missing": missing})
    if not shutil.which("rclone"):
        return _gh_error("auth_failed", "rclone is not installed.", request_id, status=400)
    remote = _drive_remote()
    from runtime.repos import rclone_remotes
    if remote not in rclone_remotes():
        return _gh_error(
            "auth_failed",
            f"rclone remote `{remote}` is not configured. Run `rclone config`.",
            request_id,
            status=401,
            details={"remotes": rclone_remotes()},
        )

    def spec(path: str = "") -> str:
        rel = (path or "").lstrip("/")
        base = _drive_root()
        joined = f"{base}/{rel}" if rel else base
        return f"{remote}:{joined}"

    if action == "about":
        r = subprocess.run(
            ["rclone", "about", f"{remote}:", "--json"],
            capture_output=True,
            text=True,
            timeout=20,
        )
        if r.returncode != 0:
            return _gh_error("upstream_error", (r.stderr or r.stdout or "rclone about failed")[-400], request_id, status=502)
        try:
            info = json.loads(r.stdout or "{}")
        except json.JSONDecodeError:
            info = {"raw": r.stdout[:400]}
        return {"ok": True, "data": {"remote": remote, "root": _drive_root(), "about": info}, "meta": {"request_id": request_id, "ts": _iso_now()}}

    if action == "files.list":
        target = spec(str(params.get("path") or ""))
        r = subprocess.run(
            ["rclone", "lsjson", target, "--max-depth", "1"],
            capture_output=True,
            text=True,
            timeout=40,
        )
        if r.returncode != 0:
            return _gh_error("upstream_error", (r.stderr or r.stdout or "list failed")[-400], request_id, status=502)
        try:
            rows = json.loads(r.stdout or "[]")
        except json.JSONDecodeError:
            rows = []
        items = [
            {
                "name": i.get("Name"),
                "path": i.get("Path"),
                "type": "dir" if i.get("IsDir") else "file",
                "size": i.get("Size"),
                "mod": i.get("ModTime"),
            }
            for i in rows
            if isinstance(i, dict)
        ]
        return {
            "ok": True,
            "data": {"remote": remote, "root": _drive_root(), "path": params.get("path") or "", "items": items, "count": len(items)},
            "meta": {"request_id": request_id, "ts": _iso_now()},
        }

    if action == "files.mkdir":
        r = subprocess.run(["rclone", "mkdir", spec(str(params["path"]))], capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            return _gh_error("upstream_error", (r.stderr or r.stdout or "mkdir failed")[-400], request_id, status=502)
        return {"ok": True, "data": {"created": params["path"]}, "meta": {"request_id": request_id, "ts": _iso_now()}}

    if action == "files.cat":
        r = subprocess.run(
            ["rclone", "cat", spec(str(params["path"]))],
            capture_output=True,
            timeout=40,
        )
        if r.returncode != 0:
            err = (r.stderr or r.stdout or b"cat failed").decode("utf-8", "replace")[-400]
            return _gh_error("upstream_error", err, request_id, status=502)
        raw = r.stdout or b""
        clipped = raw[:200_000]
        text = None
        try:
            text = clipped.decode("utf-8")
        except UnicodeDecodeError:
            text = None
        return {
            "ok": True,
            "data": {
                "path": params["path"],
                "size": len(raw),
                "truncated": len(raw) > 200_000,
                "text": text,
                "binary": text is None,
            },
            "meta": {"request_id": request_id, "ts": _iso_now()},
        }

    if action == "files.get":
        dest = params.get("dest") or str(Path.home() / "ZothBackups" / "drive-inbox" / Path(str(params["path"])).name)
        local = _safe_local(dest)
        if not local:
            return _gh_error("validation_error", "dest must be under your home or the zoth tree", request_id)
        local.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(
            ["rclone", "copyto", spec(str(params["path"])), str(local)],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if r.returncode != 0:
            return _gh_error("upstream_error", (r.stderr or r.stdout or "download failed")[-400], request_id, status=502)
        return {"ok": True, "data": {"path": params["path"], "dest": str(local)}, "meta": {"request_id": request_id, "ts": _iso_now()}}

    src = _safe_local(str(params["src"]))
    if not src or not src.exists():
        return _gh_error("validation_error", "src must exist under your home or the zoth tree", request_id)
    dest = str(params["dest"]).lstrip("/")
    r = subprocess.run(
        ["rclone", "copyto", str(src), spec(dest)],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if r.returncode != 0:
        return _gh_error("upstream_error", (r.stderr or r.stdout or "upload failed")[-400], request_id, status=502)
    return {"ok": True, "data": {"src": str(src), "dest": dest, "remote": spec(dest)}, "meta": {"request_id": request_id, "ts": _iso_now()}}


def _gh_map_status(status: int) -> tuple[str, bool, int]:
    if status in {401, 403}:
        return "auth_failed", False, 401
    if status == 404:
        return "not_found", False, 404
    if status == 409:
        return "conflict", False, 409
    if status == 422:
        return "validation_error", False, 400
    if status == 429:
        return "rate_limited", True, 429
    if status >= 500:
        return "upstream_error", True, 502
    return "upstream_error", False, 502


def _gh_fail(resp: dict[str, Any], request_id: str) -> dict[str, Any]:
    status = int(resp.get("status") or 0)
    code, retryable, http = _gh_map_status(status or 502)
    return _gh_error(code, str(resp.get("error") or "GitHub request failed"), request_id, retryable, details={"status": status}, status=http)


def _gh_list_result(resp: dict[str, Any], request_id: str, page: int, per_page: int) -> dict[str, Any]:
    if not resp.get("ok"):
        return _gh_fail(resp, request_id)
    items = resp.get("data") if isinstance(resp.get("data"), list) else []
    return {
        "ok": True,
        "data": {"items": items, "page": page, "per_page": per_page, "count": len(items)},
        "meta": {"request_id": request_id, "ts": _iso_now()},
    }


def _gh_item_result(resp: dict[str, Any], request_id: str) -> dict[str, Any]:
    if not resp.get("ok"):
        return _gh_fail(resp, request_id)
    return {
        "ok": True,
        "data": resp.get("data") or {},
        "meta": {"request_id": request_id, "ts": _iso_now()},
    }


def invoke(connector_id: str, action: str = "status", args: dict[str, Any] | None = None) -> dict[str, Any]:
    args = args or {}
    spec = next((s for s in SPECS if s["id"] == connector_id), None)
    if not spec:
        return {"error": f"unknown connector `{connector_id}`"}
    status = probe_one(spec)
    action = (action or "status").lower()
    result: dict[str, Any] = {"connector": status, "action": action}

    if action == "status":
        result["ok"] = True
        return result

    if connector_id == "solana" and action == "balance":
        addr = args.get("address") or "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        rpc = os.environ.get("SOLANA_RPC_URL") or "https://api.mainnet-beta.solana.com"
        payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [addr]}).encode()
        resp = _http_json(rpc, method="POST", headers={"Content-Type": "application/json"}, body=payload)
        lamports = ((resp.get("data") or {}).get("result") or {}).get("value")
        result["ok"] = resp.get("ok", False)
        result["address"] = addr
        result["sol"] = (lamports or 0) / 1e9 if lamports is not None else None
        result["error"] = resp.get("error")
        return result

    if connector_id == "vault" and action in {"health", "status"}:
        resp = _http_json(f"{VAULT_URL}/health")
        result["ok"] = resp.get("ok", False)
        result["health"] = resp.get("data") or {"error": resp.get("error")}
        return result

    if connector_id == "stripe" and action == "balance":
        key = os.environ.get("STRIPE_SECRET_KEY") or os.environ.get("STRIPE_API_KEY")
        if not key:
            result["ok"] = False
            result["mode"] = "mock"
            result["note"] = "No STRIPE_SECRET_KEY — not calling Stripe."
            return result
        resp = _http_json("https://api.stripe.com/v1/balance", headers={"Authorization": f"Bearer {key}"})
        result["ok"] = resp.get("ok", False)
        data = resp.get("data") or {}
        result["available"] = data.get("available")
        result["livemode"] = data.get("livemode")
        result["error"] = resp.get("error")
        return result

    if connector_id == "netlify":
        token = os.environ.get("NETLIFY_AUTH_TOKEN")
        hook = args.get("hook") or os.environ.get("NETLIFY_DEPLOY_HOOK")
        if action == "hook":
            if not hook:
                result["ok"] = False
                result["note"] = "Pass hook=… or set NETLIFY_DEPLOY_HOOK."
                return result
            resp = _http_json(hook, method="POST")
            result["ok"] = resp.get("ok", False)
            result["deploy"] = resp.get("data") or {"status": resp.get("status")}
            return result
        if action in {"sites", "status"} and token:
            resp = _http_json(
                "https://api.netlify.com/api/v1/sites?per_page=8",
                headers={"Authorization": f"Bearer {token}"},
            )
            sites = resp.get("data") if isinstance(resp.get("data"), list) else []
            result["ok"] = resp.get("ok", False)
            result["sites"] = [
                {"name": s.get("name"), "url": s.get("ssl_url") or s.get("url"), "state": s.get("state")}
                for s in sites[:8]
            ]
            result["error"] = resp.get("error")
            return result
        result["ok"] = False
        result["note"] = "No NETLIFY_AUTH_TOKEN — connector is mock-only."
        return result

    if connector_id == "gdrive" and action in GDRIVE_TOOL_ACTIONS:
        envelope = gdrive_tool_dispatch({"action": action, "params": args, "meta": args.get("meta") or {}})
        result["ok"] = bool(envelope.get("ok"))
        result["data"] = envelope.get("data")
        result["error"] = envelope.get("error")
        result["meta"] = envelope.get("meta")
        return result

    if connector_id == "github":
        mapped = _GITHUB_LEGACY.get(action) or action
        if mapped in GITHUB_TOOL_ACTIONS:
            envelope = github_tool_dispatch({"action": mapped, "params": args, "meta": args.get("meta") or {}})
            result["ok"] = bool(envelope.get("ok"))
            result["data"] = envelope.get("data")
            result["error"] = envelope.get("error")
            result["meta"] = envelope.get("meta")
            if mapped == "user.me" and result.get("ok"):
                result["login"] = (envelope.get("data") or {}).get("login")
                result["name"] = (envelope.get("data") or {}).get("name")
            return result
        token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
        if action == "dispatch":
            repo = args.get("repo")
            workflow = args.get("workflow") or args.get("workflow_id")
            ref = args.get("ref") or "main"
            if not (token and repo and workflow):
                result["ok"] = False
                result["note"] = "Need GITHUB_TOKEN + repo + workflow."
                return result
            resp = _http_json(
                f"https://api.github.com/repos/{repo}/actions/workflows/{workflow}/dispatches",
                method="POST",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github+json",
                    "Content-Type": "application/json",
                },
                body=json.dumps({"ref": ref}).encode(),
            )
            result["ok"] = resp.get("ok", False) or resp.get("status") == 204
            result["status"] = resp.get("status")
            result["error"] = resp.get("error")
            return result
        if token:
            resp = _http_json(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
            )
            user = resp.get("data") or {}
            result["ok"] = resp.get("ok", False)
            result["login"] = user.get("login")
            result["name"] = user.get("name")
            return result
        result["ok"] = False
        result["note"] = "No GITHUB_TOKEN — connector is mock-only."
        return result

    result["ok"] = True
    result["note"] = f"Action `{action}` is status-only for {connector_id}."
    return result
