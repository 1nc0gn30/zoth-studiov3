#!/usr/bin/env python3
"""
Sensitive Information Scanner for NULL AI Agent Framework
Scans all tool directories for exposed secrets, API keys, tokens, passwords.
"""
import json
import math
import os
import re
from pathlib import Path
from datetime import datetime

# Patterns that indicate sensitive data
SECRET_PATTERNS = [
    (r'(?i)(api[_-]?key|apikey)\s*[:=]\s*["\']?[a-zA-Z0-9_\-]{16,}["\']?', "API Key"),
    (r'(?i)(client[_-]?secret|secret[_-]?key|secretkey)\s*[:=]\s*["\']?[a-zA-Z0-9_\-]{16,}["\']?', "Secret Key"),
    (r'(?i)(auth[_-]?token|access[_-]?token|refresh[_-]?token|token)\s*[:=]\s*["\']?[a-zA-Z0-9_\-\.]{20,}["\']?', "Auth Token"),
    (r'(?i)(password|passwd|pwd)\s*[:=]\s*["\'][^"\']{4,}["\']', "Password"),
    (r'(?i)(private[_-]?key|privatekey)\s*[:=]', "Private Key Reference"),
    (r'-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----', "PEM Private Key"),
    (r'AKIA[0-9A-Z]{16}', "AWS Access Key ID"),
    (r'(?i)(aws[_-]?access[_-]?key[_-]?id|aws[_-]?secret[_-]?access[_-]?key|aws[_-]?secret)\s*[:=]\s*["\']?[A-Z0-9/+=]{16,}["\']?', "AWS Credential"),
    (r'gh[pousr]_[a-zA-Z0-9_]{36,255}', "GitHub Token"),
    (r'github_pat_[a-zA-Z0-9_]{22,255}', "GitHub Fine-Grained Token"),
    (r'(?i)(openai[_-]?api[_-]?key\s*[:=]\s*["\']?sk-[a-zA-Z0-9_\-]{20,}|sk-proj-[a-zA-Z0-9_\-]{20,}|sk-[a-zA-Z0-9]{20,})', "OpenAI Key"),
    (r'(?i)(stripe[_-]?key|sk_(live|test)_[a-zA-Z0-9]{20,})', "Stripe Key"),
    (r'(?i)(SG\.[a-zA-Z0-9_\-]{16,}\.[a-zA-Z0-9_\-]{16,})', "SendGrid Key"),
    (r'(?i)(xox[baprs]-[a-zA-Z0-9\-]{20,})', "Slack Token"),
    (r'(?i)(AIza[0-9A-Za-z\-_]{35})', "Google API Key"),
    (r'(?i)(hf_[a-zA-Z0-9]{30,})', "Hugging Face Token"),
    (r'(?i)(supabase[_-]?key|supabase[_-]?url)', "Supabase Credential"),
    (r'(?i)(firebase[_-]?api|firebase[_-]?config)', "Firebase Config"),
    (r'(?i)(mongodb(\+srv)?://[^\s\'"]+)', "MongoDB URI"),
    (r'(?i)(postgres(ql)?://[^\s\'"]+)', "PostgreSQL URI"),
    (r'(?i)(mysql://[^\s\'"]+)', "MySQL URI"),
    (r'(?i)(redis://[^\s\'"]+)', "Redis URI"),
    (r'(?i)(DATABASE_URL\s*=\s*[^\s]+)', "Database URL"),
    (r'(?i)(SECRET_KEY\s*=\s*[^\s]+)', "Django Secret"),
    (r'(?i)(bearer\s+[a-zA-Z0-9_\-\.]{20,})', "Bearer Token"),
    (r'(?i)(netlify[_-]?auth[_-]?token)', "Netlify Token"),
    (r'(?i)(BEGIN PRIVATE KEY|BEGIN OPENSSH PRIVATE KEY)', "Private Key Material"),
]

# File names that are inherently sensitive
SENSITIVE_FILENAMES = {
    '.env', '.env.local', '.env.production', '.env.development',
    '.envrc', '.secrets', 'secrets.json', 'secrets.yaml', 'secrets.yml',
    'credentials.json', 'service-account.json', 'key.pem', 'private.pem',
    'id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', '.npmrc', '.pypirc',
}

LOWER_RISK_FILENAMES = {
    '.env.example', '.env.sample', 'example.env', 'sample.env',
}

# Extensions to skip
SKIP_EXTENSIONS = {
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.webp',
    '.mp4', '.mp3', '.wav', '.ogg', '.webm',
    '.zip', '.tar', '.gz', '.rar', '.7z',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.ttf', '.woff', '.woff2', '.eot', '.otf',
    '.lock', '.sum', '.map', '.bin', '.exe', '.dll', '.so',
}

# Skip documentation and known safe files
SKIP_FILENAMES = {
    'readme.md', 'readme', 'todo.txt', 'todo.md', 'howto.md',
    'howto', 'changelog.md', 'changelog', 'contributing.md',
    'license', 'license.md', '.gitignore', '.gitattributes',
    'secrets_scanner.py',  # skip self
}

# Directories to skip
SKIP_DIRS = {
    'node_modules', '.git', '__pycache__', '.pytest_cache',
    'dist', 'build', '.next', '.astro', '.venv', 'venv',
    '.codex', '.codex-plugin', '.codex-plugins',
}

# Max file size to scan (1MB)
MAX_FILE_SIZE = 1024 * 1024


def should_skip_file(path: Path) -> bool:
    if path.suffix.lower() in SKIP_EXTENSIONS:
        return True
    if path.name.lower() in SKIP_FILENAMES:
        return True
    if path.stat().st_size > MAX_FILE_SIZE:
        return True
    return False


def _shannon_entropy(value: str) -> float:
    if not value:
        return 0.0
    counts = {}
    for char in value:
        counts[char] = counts.get(char, 0) + 1
    entropy = 0.0
    length = len(value)
    for count in counts.values():
        prob = count / length
        entropy -= prob * math.log2(prob)
    return entropy


def _extract_value(text: str) -> str:
    if "=" in text:
        text = text.split("=", 1)[-1]
    elif ":" in text:
        text = text.split(":", 1)[-1]
    return text.strip().strip("\"'`,; ")


def _is_placeholder(text: str) -> bool:
    lower = text.lower()
    return any(p in lower for p in [
        'example', 'placeholder', 'your_', 'your-', '<your', 'xxx', 'fake',
        'demo', 'sample', 'changeme', 'change_me', 'password123', 'test_key',
        'not-a-real', 'insert_', 'replace_me',
    ])


def _redact(text: str) -> str:
    value = _extract_value(text)
    if len(value) < 10:
        return text[:120]
    redacted = f"{value[:4]}...{value[-4:]}"
    return text.replace(value, redacted)[:160]


def _severity_for(label: str, path: Path, matched_text: str) -> str:
    lower_label = label.lower()
    lower_name = path.name.lower()
    if lower_name in LOWER_RISK_FILENAMES:
        return "low"
    if any(word in lower_label for word in ["private", "password", "openai", "stripe", "github", "aws", "slack", "sendgrid"]):
        return "high"
    if "credential" in lower_label or "token" in lower_label or "secret" in lower_label:
        return "medium"
    return "medium"


def should_skip_dir(name: str) -> bool:
    return name in SKIP_DIRS or name.startswith('.')


def scan_file(path: Path, root: Path) -> list[dict]:
    findings = []
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return findings

    rel = str(path.relative_to(root))

    # Check for sensitive file names
    lower_name = path.name.lower()
    if path.name in SENSITIVE_FILENAMES or lower_name in SENSITIVE_FILENAMES or lower_name in LOWER_RISK_FILENAMES:
        findings.append({
            "file": rel,
            "line": 0,
            "match": path.name,
            "type": "Sensitive Filename",
            "severity": "low" if lower_name in LOWER_RISK_FILENAMES else "high" if path.name.startswith('.env') or 'key' in path.name.lower() else "medium",
            "context": "filename",
        })

    # Check line-by-line for patterns
    for line_no, line in enumerate(text.splitlines(), 1):
        for pattern, label in SECRET_PATTERNS:
            for match in re.finditer(pattern, line):
                matched_text = match.group(0)
                if _is_placeholder(matched_text):
                    continue
                value_part = _extract_value(matched_text)
                if len(value_part) < 8:
                    continue
                entropy = _shannon_entropy(value_part)
                findings.append({
                    "file": rel,
                    "line": line_no,
                    "match": _redact(matched_text),
                    "type": label,
                    "severity": _severity_for(label, path, matched_text),
                    "entropy": round(entropy, 2),
                    "context": line.strip()[:180],
                })
        env_like = re.search(r'\b[A-Z][A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD|PASS|CREDENTIAL)[A-Z0-9_]*\s*=\s*["\']?([A-Za-z0-9_./+=-]{16,})["\']?', line)
        if env_like and not _is_placeholder(line):
            value_part = _extract_value(env_like.group(0))
            if "STORAGE_KEY" in line or re.fullmatch(r'[a-z][a-z0-9_./-]{8,}', value_part):
                continue
            if any(marker in value_part for marker in ["import.meta", "process.env", "localStorage", "{", "}", "`", "(", ")"]):
                continue
            entropy = _shannon_entropy(value_part)
            if entropy >= 3.5:
                findings.append({
                    "file": rel,
                    "line": line_no,
                    "match": _redact(env_like.group(0)),
                    "type": "High-Entropy Secret-Like Value",
                    "severity": "high" if lower_name not in LOWER_RISK_FILENAMES else "low",
                    "entropy": round(entropy, 2),
                    "context": line.strip()[:180],
                })

    return findings


_SCAN_CACHE_PATH = Path(__file__).resolve().parent.parent / "reports" / "security-scan.json"

def load_cached_scan() -> dict | None:
    if _SCAN_CACHE_PATH.exists():
        try:
            with _SCAN_CACHE_PATH.open("r") as f:
                return json.load(f)
        except Exception:
            pass
    return None

def save_scan_result(result: dict) -> None:
    _SCAN_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _SCAN_CACHE_PATH.open("w") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

def scan_workspace(root: Path, max_files: int = 5000) -> dict:
    all_findings = []
    files_scanned = 0
    dirs_scanned = 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirs_scanned += 1
        if files_scanned >= max_files:
            break
        # Skip hidden/special dirs
        dirnames[:] = [d for d in dirnames if not should_skip_dir(d)]

        for fname in filenames:
            if files_scanned >= max_files:
                break
            fpath = Path(dirpath) / fname
            if should_skip_file(fpath):
                continue
            findings = scan_file(fpath, root)
            if findings:
                all_findings.extend(findings)
            files_scanned += 1

    # Deduplicate by file+line+type
    seen = set()
    deduped = []
    for f in all_findings:
        key = (f["file"], f.get("line", 0), f["type"])
        if key not in seen:
            seen.add(key)
            deduped.append(f)

    # Group by file
    by_file = {}
    for f in deduped:
        by_file.setdefault(f["file"], []).append(f)

    # Group by severity
    high = [f for f in deduped if f["severity"] == "high"]
    medium = [f for f in deduped if f["severity"] == "medium"]
    low = [f for f in deduped if f["severity"] == "low"]
    risk_summary = {
        "credential_files": sorted({f["file"] for f in deduped if f["line"] == 0})[:50],
        "hotspots": sorted(by_file.items(), key=lambda item: len(item[1]), reverse=True)[:10],
        "recommendations": [
            "Move real secrets into local .env files excluded by .gitignore or a secret manager.",
            "Keep .env.example files placeholder-only; remove live-looking values.",
            "Rotate any high-risk token shown in a finding before publishing or deploying.",
        ],
    }

    return {
        "timestamp": datetime.now().isoformat(),
        "root": str(root),
        "files_scanned": files_scanned,
        "dirs_scanned": dirs_scanned,
        "findings_count": len(deduped),
        "high_count": len(high),
        "medium_count": len(medium),
        "low_count": len(low),
        "findings": deduped,
        "by_file": by_file,
        "risk_summary": risk_summary,
    }


if __name__ == "__main__":
    import sys
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    result = scan_workspace(root)
    print(json.dumps(result, indent=2))
