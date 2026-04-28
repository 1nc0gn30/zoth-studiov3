#!/usr/bin/env python3
import argparse, pathlib, re

PATTERNS = [
    ("critical", re.compile(r"ignore (all )?(previous|system|developer) instructions", re.I), "instruction override attempt"),
    ("critical", re.compile(r"do not (tell|show|mention) (the )?user", re.I), "stealth instruction"),
    ("high", re.compile(r"(curl|wget).*(sh|bash|python)", re.I), "remote fetch piped toward execution"),
    ("high", re.compile(r"\.env|OPENAI_API_KEY|AWS_SECRET|GITHUB_TOKEN|SUPABASE.*KEY", re.I), "credential-sensitive reference"),
    ("high", re.compile(r"rm\s+-rf|git\s+reset\s+--hard|mkfs|dd\s+if=", re.I), "destructive command"),
    ("medium", re.compile(r"http://", re.I), "non-HTTPS URL"),
    ("medium", re.compile(r"latest/manifest\.json", re.I), "mutable latest reference; require versioned checksum too"),
]
TEXT_EXT = {".md", ".txt", ".json", ".yaml", ".yml", ".py", ".js", ".ts", ".sh"}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    args = ap.parse_args()
    root = pathlib.Path(args.path)
    findings = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXT:
            continue
        try:
            text = path.read_text(errors="ignore")
        except Exception:
            continue
        for sev, rx, msg in PATTERNS:
            for m in rx.finditer(text):
                line = text.count("\n", 0, m.start()) + 1
                findings.append((sev, str(path), line, msg))
    for sev, path, line, msg in findings:
        print(f"{sev.upper()} {path}:{line} {msg}")
    print(f"findings={len(findings)}")
    return 1 if any(f[0] in {"critical", "high"} for f in findings) else 0

if __name__ == "__main__":
    raise SystemExit(main())
