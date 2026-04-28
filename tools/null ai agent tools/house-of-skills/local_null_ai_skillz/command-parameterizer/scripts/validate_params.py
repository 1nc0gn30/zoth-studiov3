#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

try:
    import jsonschema
except Exception:
    jsonschema = None


def basic_validate(schema, payload):
    if schema.get("type") == "object" and not isinstance(payload, dict):
        raise ValueError("payload must be an object")
    if schema.get("additionalProperties") is False:
        extra = set(payload) - set(schema.get("properties", {}))
        if extra:
            raise ValueError("extra properties: " + ", ".join(sorted(extra)))
    for key in schema.get("required", []):
        if key not in payload:
            raise ValueError(f"missing required property: {key}")
    for key, rule in schema.get("properties", {}).items():
        if key not in payload:
            continue
        value = payload[key]
        if "enum" in rule and value not in rule["enum"]:
            raise ValueError(f"{key} must be one of {rule['enum']}")
        if rule.get("type") == "string" and not isinstance(value, str):
            raise ValueError(f"{key} must be string")
        if rule.get("type") == "array" and not isinstance(value, list):
            raise ValueError(f"{key} must be array")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("schema")
    ap.add_argument("payload")
    args = ap.parse_args()
    schema = json.loads(Path(args.schema).read_text())
    payload = json.loads(Path(args.payload).read_text())
    try:
        if jsonschema:
            jsonschema.validate(payload, schema)
        else:
            basic_validate(schema, payload)
    except Exception as exc:
        print(f"invalid: {exc}", file=sys.stderr)
        return 1
    print("parameters valid")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
