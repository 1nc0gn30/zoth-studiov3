#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys, urllib.request, urllib.parse

MAX_BYTES = 2_000_000


def fetch(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https":
        raise ValueError("only https URLs are allowed")
    req = urllib.request.Request(url, headers={"User-Agent": "agent-fetch-client/1.0"})
    with urllib.request.urlopen(req, timeout=20) as res:
        final = urllib.parse.urlparse(res.geturl())
        if final.scheme != "https":
            raise ValueError("redirected to non-https URL")
        data = res.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError("response too large")
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest_url")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    raw = fetch(args.manifest_url)
    manifest = json.loads(raw.decode("utf-8"))
    digest = hashlib.sha256(raw).hexdigest()
    pack_id = manifest.get("id", "unknown-pack")
    version = manifest.get("version", "unknown-version")
    target = out / f"{pack_id}-{version}-manifest.json"
    target.write_bytes(raw)
    preview = {
        "source": args.manifest_url,
        "saved_to": str(target),
        "sha256": digest,
        "id": pack_id,
        "version": version,
        "compatibility": manifest.get("compatibility", []),
        "permissions": manifest.get("trust", {}).get("permissions", []),
        "instruction_count": len(manifest.get("instructions", [])),
    }
    print(json.dumps(preview, indent=2))
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
