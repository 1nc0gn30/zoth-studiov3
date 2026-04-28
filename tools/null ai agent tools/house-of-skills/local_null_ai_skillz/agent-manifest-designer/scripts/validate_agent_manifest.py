#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

REQUIRED = ["schema_version", "id", "name", "version", "summary", "compatibility", "parameters", "instructions", "resources", "trust"]
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$")


def err(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    return 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    args = ap.parse_args()
    data = json.loads(Path(args.manifest).read_text())
    missing = [k for k in REQUIRED if k not in data]
    if missing:
        return err("missing required fields: " + ", ".join(missing))
    if not ID_RE.match(data["id"]):
        return err("id must be lowercase kebab-case, 3-64 chars")
    if not SEMVER_RE.match(data["version"]):
        return err("version must be semantic version like 1.0.0")
    if not isinstance(data["compatibility"], list) or not data["compatibility"]:
        return err("compatibility must be a non-empty list")
    params = data["parameters"]
    if not isinstance(params, dict) or params.get("type") != "object":
        return err("parameters must be a JSON Schema object")
    if params.get("additionalProperties") is not False:
        return err("parameters.additionalProperties should be false for safe command surfaces")
    if not isinstance(data["instructions"], list) or not data["instructions"]:
        return err("instructions must be a non-empty list")
    trust = data["trust"]
    if not isinstance(trust, dict) or "permissions" not in trust:
        return err("trust.permissions is required")
    print("manifest valid")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
