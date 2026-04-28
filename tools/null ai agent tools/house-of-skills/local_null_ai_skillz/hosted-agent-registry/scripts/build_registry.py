#!/usr/bin/env python3
import argparse, json, hashlib, pathlib, sys, datetime

REQUIRED = {"id", "name", "version", "summary", "manifest_url", "compatibility", "tags"}

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    p = argparse.ArgumentParser(description="Build registry.json from pack manifest files")
    p.add_argument("packs_dir")
    p.add_argument("output")
    p.add_argument("--name", default="Hosted Agent Skill Registry")
    args = p.parse_args()
    root = pathlib.Path(args.packs_dir)
    manifests = sorted(root.glob("**/manifest.json"))
    if not manifests:
        sys.exit(f"no manifest.json files found under {root}")
    packs = []
    errors = []
    for path in manifests:
        data = json.loads(path.read_text())
        missing = sorted(REQUIRED - set(data))
        if missing:
            errors.append(f"{path}: missing {', '.join(missing)}")
            continue
        item = {k: data[k] for k in ["id", "name", "version", "summary", "manifest_url", "compatibility", "tags"]}
        item["checksum_sha256"] = data.get("checksum_sha256") or sha256_file(path)
        packs.append(item)
    if errors:
        sys.stderr.write("\n".join(errors) + "\n")
        sys.exit(1)
    registry = {
        "schema_version": "agent-registry/v1",
        "name": args.name,
        "updated_at": datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "packs": packs,
    }
    pathlib.Path(args.output).write_text(json.dumps(registry, indent=2) + "\n")
    print(f"wrote {args.output} with {len(packs)} packs")

if __name__ == "__main__":
    main()
