#!/usr/bin/env python3
import argparse, json, pathlib, re, subprocess, sys

FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n", re.S)

def check_skill(path):
    skill = path / "SKILL.md"
    if not skill.exists():
        return ("fail", "missing SKILL.md")
    text = skill.read_text()
    m = FRONTMATTER.match(text)
    if not m:
        return ("fail", "missing YAML frontmatter")
    fm = m.group(1)
    if "name:" not in fm or "description:" not in fm:
        return ("fail", "frontmatter needs name and description")
    if "TODO" in text:
        return ("fail", "contains TODO placeholder")
    return ("pass", "SKILL.md frontmatter present")

def check_manifest(path):
    manifest = path / "manifest.json"
    if not manifest.exists():
        return ("blocked", "no manifest.json")
    try:
        data = json.loads(manifest.read_text())
    except Exception as exc:
        return ("fail", f"invalid json: {exc}")
    missing = [k for k in ["schema_version", "id", "version", "compatibility"] if k not in data]
    if missing:
        return ("fail", "manifest missing " + ", ".join(missing))
    return ("pass", "manifest baseline fields present")

def check_scripts(path):
    scripts = sorted((path / "scripts").glob("*.py")) if (path / "scripts").exists() else []
    if not scripts:
        return ("blocked", "no python scripts")
    failures = []
    for script in scripts:
        res = subprocess.run([sys.executable, str(script), "--help"], text=True, capture_output=True)
        if res.returncode != 0:
            failures.append(script.name)
    if failures:
        return ("fail", "script --help failed: " + ", ".join(failures))
    return ("pass", f"{len(scripts)} scripts expose --help")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    args = ap.parse_args()
    path = pathlib.Path(args.path)
    rows = {
        "codex_skill": check_skill(path),
        "manifest": check_manifest(path),
        "scripts": check_scripts(path),
    }
    for name, (status, note) in rows.items():
        print(f"{name}: {status} - {note}")
    return 1 if any(status == "fail" for status, _ in rows.values()) else 0

if __name__ == "__main__":
    raise SystemExit(main())
