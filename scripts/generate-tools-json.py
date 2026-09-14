#!/usr/bin/env python3
"""Generate public/api/tools.json -- a static, publish-safe tool registry endpoint.

WHY THIS EXISTS
    The hub is served by a plain static file server (`python3 -m http.server`,
    or any CDN in front of `public/`). There is no application server and no
    function runtime, so any URL a page fetches MUST be a real file on disk.
    /registry/ used to fetch `/api/tools` (a live-orchestrator path that does
    not exist here), which produced an HTTP 404 + console error on every load.

    This script turns the real on-disk registry
    ('tools/null ai agent tools/local_null_ai_orchestrator/registry.local.json')
    into a static JSON file that the static hub can actually serve, and strips
    everything that must not ship to a public site.

WHAT IS PUBLISHED
    id, name, description, category, relative_path, runtimes, tags
    (plus provenance: schema, generated_at, source, tool_count, notice).

WHAT IS DELIBERATELY DROPPED / SCRUBBED
    - registry `workspace_root` (absolute machine path, e.g. /media/<user>/<uuid>/...)
    - per-tool `path` (absolute local filesystem path on all 298 entries)
    - `readme`, `notes`, `entrypoints`, `package_scripts` (raw repo internals,
      not needed by the UI and a needless surface)
    - any residual absolute path ( /media/, /home/, /Users/, /root/, /opt/,
      /etc/, drive letters, ~/ ) inside a published string
    - anything that looks like a credential (sk-…, ghp_…, AKIA…, xox…, AIza…,
      PEM blocks, JWT, api_key=/password=/Bearer <token>)
    - the host machine name (never emitted; only relative paths are written)

USAGE
    python3 scripts/generate-tools-json.py                # default paths
    python3 scripts/generate-tools-json.py --source X --out Y

EXIT STATUS
    Always 0 when it wrote a well-formed file (missing registry is a normal,
    expected condition on a fresh clone -- it is gitignored upstream). Exit 1
    only if it could not write valid JSON at all.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

DEFAULT_SOURCE = os.path.join(
    ROOT, "tools", "null ai agent tools", "local_null_ai_orchestrator", "registry.local.json"
)
DEFAULT_OUT = os.path.join(ROOT, "public", "api", "tools.json")

SCHEMA = "zoth/tools-static/v1"
MAX_DESC = 300

# --- scrubbers -------------------------------------------------------------
ABS_PATH_RE = re.compile(
    r"""(?:
          /(?:media|home|Users|root|opt|var|srv|etc|usr)/[^\s"'`)\]},;]*
        | [A-Za-z]:\\[^\s"'`)\]},;]*
        | ~/[^\s"'`)\]},;]*
        | /media/[\w.-]+
        )""",
    re.VERBOSE,
)
SECRET_RE = re.compile(
    r"""(?:
          sk-[A-Za-z0-9_\-]{12,}
        | ghp_[A-Za-z0-9]{20,}
        | github_pat_[A-Za-z0-9_]{20,}
        | AKIA[0-9A-Z]{12,}
        | AIza[0-9A-Za-z_\-]{20,}
        | xox[baprs]-[A-Za-z0-9\-]{10,}
        | eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{5,}
        | -----BEGIN [A-Z ]*PRIVATE KEY-----
        | (?i:\b(?:api[_-]?key|secret|token|password|passwd|pwd)\b\s*[:=]\s*\S+)
        | (?i:Bearer\s+[A-Za-z0-9._\-]{12,})
        )""",
    re.VERBOSE,
)
MACHINE_NAMES = {"neo"}


def scrub_text(value: str) -> str:
    """Return a publish-safe copy of a string."""
    if not isinstance(value, str):
        return ""
    out = SECRET_RE.sub("[redacted]", value)
    out = ABS_PATH_RE.sub("[local-path-removed]", out)
    for name in MACHINE_NAMES:
        # only as a path segment or host-ish token, never inside a word
        out = re.sub(rf"(?<![\w-]){re.escape(name)}(?![\w-])", "[machine]", out)
    out = re.sub(r"\s+", " ", out).strip()
    return out


def clean_list(value, limit: int = 24) -> list[str]:
    """Scrub + de-duplicate a list of short strings (runtimes/tags)."""
    if not isinstance(value, list):
        return []
    seen, out = set(), []
    for item in value:
        s = scrub_text(item if isinstance(item, str) else str(item))
        if not s or s.startswith("["):
            continue
        if s.lower() in seen:
            continue
        seen.add(s.lower())
        out.append(s[:64])
        if len(out) >= limit:
            break
    return out


def safe_relative_path(value) -> str:
    """Keep only a genuinely relative, non-escaping path."""
    if not isinstance(value, str):
        return ""
    s = scrub_text(value)
    if not s or s.startswith("/") or s.startswith("[") or ".." in s.split("/"):
        return ""
    return s


def publishable_tool(raw: dict, index: int) -> dict | None:
    tid = scrub_text(raw.get("id") or "")
    if not tid:
        return None
    return {
        "id": tid,
        "name": scrub_text(raw.get("name") or tid) or tid,
        "description": scrub_text(raw.get("description") or "")[:MAX_DESC],
        "category": scrub_text(raw.get("category") or "") or "Other",
        "relative_path": safe_relative_path(raw.get("relative_path")),
        "runtimes": clean_list(raw.get("runtimes")),
        "tags": clean_list(raw.get("tags")),
    }


def build_payload(source_path: str) -> dict:
    """Read the on-disk registry; degrade to a valid empty payload if absent."""
    generated_at = _dt.datetime.now(_dt.timezone.utc).replace(microsecond=0).isoformat()
    base = {
        "schema": SCHEMA,
        "generated_by": "scripts/generate-tools-json.py",
        "generated_at": generated_at,
        "source": None,
        "source_available": False,
        "tool_count": 0,
        "tools": [],
        "notice": "",
    }

    if not os.path.isfile(source_path):
        base["notice"] = (
            "Static tool registry is empty: the source registry "
            "('tools/null ai agent tools/local_null_ai_orchestrator/registry.local.json') "
            "is not present in this checkout. It is machine-local and gitignored by design. "
            "Run scripts/generate-tools-json.py on a machine that has it to populate this file."
        )
        return base

    try:
        with open(source_path, "r", encoding="utf-8") as fh:
            raw = json.load(fh)
    except (OSError, ValueError) as exc:  # unreadable/corrupt => still ship valid JSON
        base["notice"] = (
            "Static tool registry is empty: the source registry could not be parsed "
            f"({type(exc).__name__}). Re-run scripts/generate-tools-json.py after repairing it."
        )
        return base

    raw_tools = raw.get("tools") if isinstance(raw, dict) else raw
    if not isinstance(raw_tools, list):
        raw_tools = []

    tools = []
    for i, item in enumerate(raw_tools):
        if not isinstance(item, dict):
            continue
        t = publishable_tool(item, i)
        if t is not None:
            tools.append(t)

    tools.sort(key=lambda t: (t["category"].lower(), t["name"].lower(), t["id"]))

    # source is recorded as a relative label only -- never an absolute path.
    base["source"] = "tools/null ai agent tools/local_null_ai_orchestrator/registry.local.json"
    base["source_available"] = True
    base["tool_count"] = len(tools)
    base["tools"] = tools
    base["notice"] = (
        "Publish-safe projection of the on-disk orchestrator registry. "
        "Absolute local paths, machine names, repo internals and credential-looking "
        "strings are stripped at generation time."
    )
    return base


def audit_payload(payload: dict) -> list[str]:
    """Fail loudly if anything private slipped into the payload."""
    blob = json.dumps(payload)
    problems = []
    for pat, label in (
        (r"/media/", "absolute /media/ path"),
        (r"/home/", "absolute /home/ path"),
        (r"/Users/", "absolute /Users/ path"),
        (r"/root/", "absolute /root/ path"),
        (r"f2fdda77", "workspace uuid"),
        (r"(?i)neo\b", "personal segment"),
    ):
        if re.search(pat, blob):
            problems.append(label)
    for t in payload.get("tools", []):
        if "path" in t:
            problems.append("raw absolute 'path' field present")
            break
    return problems


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(
        description="Generate public/api/tools.json: a static, publish-safe tool registry endpoint."
    )
    ap.add_argument("--source", default=DEFAULT_SOURCE, help="path to registry.local.json")
    ap.add_argument("--out", default=DEFAULT_OUT, help="output path for tools.json")
    args = ap.parse_args(argv)

    payload = build_payload(args.source)
    problems = audit_payload(payload)

    text = json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=False) + "\n"

    # round-trip: never write a file that does not parse
    try:
        json.loads(text)
    except ValueError as exc:  # pragma: no cover - defensive
        print(f"FATAL: generated JSON does not parse: {exc}", file=sys.stderr)
        return 1

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fh:
        fh.write(text)

    rel_out = os.path.relpath(args.out, ROOT)
    print(f"[generate-tools-json] source={args.source}")
    print(f"[generate-tools-json] source_available={payload['source_available']} tools={payload['tool_count']}")
    print(f"[generate-tools-json] wrote {rel_out} ({len(text)} bytes)")
    if problems:
        print(f"[generate-tools-json] SCRUB AUDIT FAILED: {sorted(set(problems))}", file=sys.stderr)
        return 1
    print("[generate-tools-json] scrub audit: clean (no absolute paths, no machine name, no secrets)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
