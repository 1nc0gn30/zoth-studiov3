#!/usr/bin/env python3
"""
parrot_nexus.py — Standalone CLI for Parrot Nexus
====================================================
In-house rewrite: runs directly without a Flask server or React frontend.
All core functionality preserved: tool discovery, AI chat, playbooks,
presets, training, and terminal session management.

Usage:
    ./parrot_nexus.py <command> [options]

Commands:
    scan           Discover installed security tools
    tools          List, search, or show tools
    presets        Manage command presets
    playbook       Run guided playbook missions
    ai             Chat with local Ollama or list models
    terminal       Launch an interactive PTY terminal
    dashboard      Show terminal-based dashboard overview
    doctor         Check system health
"""
import argparse
import json
import os
import pty
import select
import shutil
import signal
import struct
import subprocess
import sys
import termios
import textwrap
import threading
import time
import tty
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    requests = None

from shared_constants import (
    DEFAULT_MODEL,
    OLLAMA_GENERATE_URL,
    OLLAMA_TAGS_URL,
)

# ── Paths ──────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PRESETS_PATH = BASE_DIR / "backend" / "config" / "presets.json"
TOOL_OVERRIDES_PATH = BASE_DIR / "backend" / "config" / "tool_overrides.json"
PLAYBOOKS_DIR = BASE_DIR / "backend" / "playbooks"
TOOLS_SNAPSHOT_PATH = BASE_DIR / "backend" / "tools" / "loaded_tools.json"

# ── Color helpers ──────────────────────────────────────────────
class C:
    G = "\033[92m"    # green
    C2 = "\033[96m"   # cyan
    Y = "\033[93m"    # yellow
    R = "\033[91m"    # red
    B = "\033[94m"    # blue
    M = "\033[95m"    # magenta
    W = "\033[97m"    # white
    D = "\033[90m"    # dim gray
    BD = "\033[1m"
    RS = "\033[0m"


# ══════════════════════════════════════════════════════════════
# 1. TOOL DATA (curated knowledge base)
# ══════════════════════════════════════════════════════════════

TOOL_DATA = {
    "nmap": {
        "category": "Information Gathering",
        "desc": "Network Mapper: The industry standard for network discovery and security auditing.",
        "help_docs": "Nmap allows you to discover hosts on a network, identify open ports, and detect services/OS versions.",
        "cheats": [
            {"desc": "Quick Scan (Fast)", "cmd": "nmap -F <target>"},
            {"desc": "Service/Version Detection", "cmd": "nmap -sV <target>"},
            {"desc": "OS Fingerprinting", "cmd": "nmap -O <target>"},
            {"desc": "Aggressive Scan", "cmd": "nmap -A <target>"},
            {"desc": "Stealth SYN Scan", "cmd": "nmap -sS <target>"},
            {"desc": "Ping Sweep", "cmd": "nmap -sn <network/range>"},
        ],
    },
    "msfconsole": {
        "category": "Exploitation Tools",
        "desc": "Metasploit Framework: A modular penetration testing platform.",
        "help_docs": "Metasploit provides a database of exploits, payloads, and encoders.",
        "cheats": [
            {"desc": "Search for module", "cmd": "search <keyword>"},
            {"desc": "Select module", "cmd": "use <path/to/module>"},
            {"desc": "Set Target IP", "cmd": "set RHOSTS <target>"},
            {"desc": "Run the Exploit", "cmd": "exploit"},
            {"desc": "Show options", "cmd": "show options"},
        ],
    },
    "sqlmap": {
        "category": "Web Application Analysis",
        "desc": "SQL Injection & Database Takeover Tool.",
        "help_docs": "SQLMap automates detecting and exploiting SQL injection flaws.",
        "cheats": [
            {"desc": "Basic URL Scan", "cmd": "sqlmap -u <url> --batch"},
            {"desc": "List Databases", "cmd": "sqlmap -u <url> --dbs"},
            {"desc": "List Tables in DB", "cmd": "sqlmap -u <url> -D <db_name> --tables"},
            {"desc": "Dump specific table", "cmd": "sqlmap -u <url> -T <table_name> --dump"},
        ],
    },
    "john": {
        "category": "Password Attacks",
        "desc": "John the Ripper: High-speed password cracking software.",
        "help_docs": "John can crack passwords from various formats (hashes) using wordlists or brute-force attacks.",
        "cheats": [
            {"desc": "Basic Crack", "cmd": "john <password_file>"},
            {"desc": "Show Cracked Passwords", "cmd": "john --show <password_file>"},
            {"desc": "Use Custom Wordlist", "cmd": "john --wordlist=<path> <password_file>"},
            {"desc": "Format Specification", "cmd": "john --format=<fmt> <password_file>"},
        ],
    },
    "gobuster": {
        "category": "Information Gathering",
        "desc": "Directory/file & DNS busting tool written in Go.",
        "help_docs": "Gobuster is used to brute-force URIs (directories/files), DNS subdomains, and more.",
        "cheats": [
            {"desc": "Directory Scan", "cmd": "gobuster dir -u <url> -w <wordlist>"},
            {"desc": "DNS Subdomain Scan", "cmd": "gobuster dns -d <domain> -w <wordlist>"},
            {"desc": "VHost Scan", "cmd": "gobuster vhost -u <url> -w <wordlist>"},
        ],
    },
    "nikto": {
        "category": "Web Application Analysis",
        "desc": "Web server scanner that tests for dangerous files/CGIs, outdated software, and more.",
        "cheats": [
            {"desc": "Basic Scan", "cmd": "nikto -h <target>"},
            {"desc": "Scan with SSL", "cmd": "nikto -h https://<target>"},
            {"desc": "Scan on specific port", "cmd": "nikto -h <target> -p <port>"},
        ],
    },
    "hydra": {
        "category": "Password Attacks",
        "desc": "Network login cracker supporting many protocols.",
        "cheats": [
            {"desc": "SSH Brute Force", "cmd": "hydra -l <user> -P <wordlist> ssh://<target>"},
            {"desc": "HTTP POST Form", "cmd": "hydra -l <user> -P <wordlist> <target> http-post-form <path>:<params>:<fail>"},
            {"desc": "FTP Brute Force", "cmd": "hydra -l <user> -P <wordlist> ftp://<target>"},
        ],
    },
    "netcat": {
        "category": "Networking",
        "desc": "TCP/IP swiss army knife. Port scanning, file transfer, reverse shells.",
        "cheats": [
            {"desc": "Port Scan", "cmd": "nc -zv <target> <port-range>"},
            {"desc": "Listen on port", "cmd": "nc -lvnp <port>"},
            {"desc": "Send file", "cmd": "nc <target> <port> < <file>"},
        ],
    },
    "wireshark": {
        "category": "Sniffing & Spoofing",
        "desc": "Network protocol analyzer for traffic inspection.",
        "cheats": [
            {"desc": "Capture on interface", "cmd": "wireshark -i <interface>"},
            {"desc": "Read pcap file", "cmd": "wireshark -r <file.pcap>"},
        ],
    },
    "aircrack-ng": {
        "category": "Wireless Attacks",
        "desc": "802.11 WEP/WPA/WPA2 cracking suite.",
        "cheats": [
            {"desc": "Check interface", "cmd": "airmon-ng"},
            {"desc": "Start monitor mode", "cmd": "airmon-ng start <interface>"},
            {"desc": "Capture packets", "cmd": "airodump-ng <interface>"},
            {"desc": "Crack WPA handshake", "cmd": "aircrack-ng -w <wordlist> <capture.cap>"},
        ],
    },
    "metasploit": {
        "category": "Exploitation Tools",
        "desc": "Metasploit framework (msfconsole wrapper).",
        "cheats": [
            {"desc": "Launch msfconsole", "cmd": "msfconsole"},
            {"desc": "Search for exploit", "cmd": "search <keyword>"},
            {"desc": "Use module", "cmd": "use <module_path>"},
        ],
    },
    "searchsploit": {
        "category": "Exploitation Tools",
        "desc": "Exploit-DB command-line search tool.",
        "cheats": [
            {"desc": "Search by keyword", "cmd": "searchsploit <keyword>"},
            {"desc": "List exploits by service", "cmd": "searchsploit -t <service>"},
        ],
    },
}

INFERRED_CATEGORIES = {
    "Information Gathering": {"use_cases": ["Reconnaissance", "Network Mapping", "Port Scanning"], "tags": ["recon", "scanning", "discovery"]},
    "Exploitation Tools": {"use_cases": ["Vulnerability Verification", "Exploit Deployment", "Payload Generation"], "tags": ["exploit", "payload", "cve"]},
    "Web Application Analysis": {"use_cases": ["Web Security Testing", "Directory Enumeration", "Vulnerability Scanning"], "tags": ["web", "appsec", "pentest"]},
    "Password Attacks": {"use_cases": ["Credential Testing", "Password Recovery", "Brute Force"], "tags": ["password", "cracking", "auth"]},
    "Sniffing & Spoofing": {"use_cases": ["Traffic Analysis", "Packet Capture", "MITM Testing"], "tags": ["sniffing", "packet", "mitm"]},
    "Wireless Attacks": {"use_cases": ["Wi-Fi Security Testing", "WPA Cracking", "RF Monitoring"], "tags": ["wireless", "wifi", "rf"]},
    "Networking": {"use_cases": ["Network Diagnostics", "Connectivity Testing", "Data Transfer"], "tags": ["network", "tcpip", "connectivity"]},
    "Intelligence": {"use_cases": ["AI Assistance", "Automation", "Orchestration"], "tags": ["ai", "assistant", "automation"]},
}

WELL_KNOWN_PATH_TOOLS = {
    "nmap": "nmap", "msfconsole": "msfconsole", "sqlmap": "sqlmap",
    "john": "john", "gobuster": "gobuster", "nikto": "nikto",
    "hydra": "hydra", "netcat": "nc", "wireshark": "wireshark",
    "aircrack-ng": "aircrack-ng", "searchsploit": "searchsploit",
}


# ══════════════════════════════════════════════════════════════
# 2. CORE LOGIC (ported from backend/main.py)
# ══════════════════════════════════════════════════════════════

def normalize_category(cat):
    if not cat:
        return "General"
    mapping = {
        "information gathering": "Information Gathering",
        "exploitation": "Exploitation Tools",
        "web": "Web Application Analysis",
        "password": "Password Attacks",
        "sniffing": "Sniffing & Spoofing",
        "wireless": "Wireless Attacks",
        "networking": "Networking",
        "intelligence": "Intelligence",
        "general": "General",
    }
    return mapping.get(cat.strip().lower(), cat.strip())


def infer_category(tool_name, tool_path):
    curated = TOOL_DATA.get(tool_name, {})
    if curated.get("category"):
        return curated["category"]
    bin_name = Path(tool_path).name if tool_path else tool_name
    for keyword, cat in [
        ("nmap", "Information Gathering"),
        ("gobuster", "Information Gathering"),
        ("nikto", "Web Application Analysis"),
        ("sqlmap", "Web Application Analysis"),
        ("hydra", "Password Attacks"),
        ("john", "Password Attacks"),
        ("aircrack", "Wireless Attacks"),
        ("wireshark", "Sniffing & Spoofing"),
        ("tcpdump", "Sniffing & Spoofing"),
        ("msf", "Exploitation Tools"),
        ("searchsploit", "Exploitation Tools"),
        ("nc", "Networking"),
        ("netcat", "Networking"),
        ("codex", "Intelligence"),
        ("ollama", "Intelligence"),
    ]:
        if keyword in bin_name.lower():
            return cat
    # Heuristic: check for common sec tools in PATH
    known_sec_paths = ["/usr/bin", "/usr/local/bin", "/opt"]
    if any(str(shutil.which(tool_name) or "").startswith(p) for p in known_sec_paths):
        return "General"
    return "General"


def infer_use_cases(category):
    cat = normalize_category(category)
    info = INFERRED_CATEGORIES.get(cat, {})
    return info.get("use_cases", ["General Security"])


def infer_tags(tool_name, tool_path, category):
    cat = normalize_category(category)
    info = INFERRED_CATEGORIES.get(cat, {})
    return info.get("tags", ["tool"]) + [tool_name.lower()]


def infer_training(tool_name, category):
    train = {
        "nmap": {
            "description": "Master Nmap from basic scans to NSE scripting.",
            "levels": [
                {"name": "Foundation: Port Scanning", "task": "Run a basic port scan on localhost", "cmd": "nmap -F 127.0.0.1"},
                {"name": "Operator: Service Detection", "task": "Identify service versions on a target", "cmd": "nmap -sV 127.0.0.1"},
                {"name": "Advanced: NSE Scripting", "task": "Run an NSE vulnerability script", "cmd": "nmap --script vuln 127.0.0.1"},
            ],
        },
        "gobuster": {
            "description": "Become proficient at directory and DNS brute-forcing.",
            "levels": [
                {"name": "Foundation: Directory Scan", "task": "Run a basic directory scan", "cmd": "gobuster dir -u http://127.0.0.1 -w /usr/share/wordlists/dirb/common.txt"},
                {"name": "Operator: DNS Enumeration", "task": "Enumerate subdomains", "cmd": "gobuster dns -d example.com -w /usr/share/wordlists/dns/subdomains-top1million-5000.txt"},
            ],
        },
        "sqlmap": {
            "description": "Learn automated SQL injection detection and exploitation.",
            "levels": [
                {"name": "Foundation: Basic Scan", "task": "Run sqlmap against a test URL", "cmd": "sqlmap -u 'http://testphp.vulnweb.com/artists.php?artist=1' --batch"},
                {"name": "Operator: Database Enumeration", "task": "List all databases", "cmd": "sqlmap -u '<url>' --dbs --batch"},
            ],
        },
        "john": {
            "description": "Become proficient at password hash cracking.",
            "levels": [
                {"name": "Foundation: Basic Crack", "task": "Crack a sample password file", "cmd": "john --wordlist=/usr/share/wordlists/rockyou.txt /path/to/hashes"},
            ],
        },
    }
    return train.get(tool_name, None)


def infer_description(tool_name, category):
    return TOOL_DATA.get(tool_name, {}).get("desc", f"{tool_name}: a {normalize_category(category).lower()} tool discovered on your system.")


def discover_installed_tools():
    discovered = {}
    search_paths = [p for p in os.environ.get("PATH", "").split(os.pathsep) if p]
    for directory in search_paths:
        try:
            entries = os.listdir(directory)
        except OSError:
            continue
        for entry in entries:
            if entry in discovered:
                continue
            full_path = os.path.join(directory, entry)
            if not os.path.isfile(full_path) or not os.access(full_path, os.X_OK):
                continue
            category = infer_category(entry, full_path)
            discovered[entry] = {
                "name": entry,
                "command": entry,
                "path": full_path,
                "category": normalize_category(category),
                "desc": infer_description(entry, category),
                "use_cases": infer_use_cases(category),
                "tags": infer_tags(entry, full_path, category),
                "training": infer_training(entry, category),
                "help_docs": f"Discovered from your PATH. Run '{entry} --help' or 'man {entry}' for usage.",
                "cheats": [{"desc": "Show help", "cmd": f"{entry} --help"}],
                "source": "system-path",
            }
    return discovered


def load_tool_overrides():
    if not TOOL_OVERRIDES_PATH.exists():
        return {}
    try:
        with open(TOOL_OVERRIDES_PATH) as f:
            payload = json.load(f)
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def apply_tool_override(tool, override):
    if not isinstance(override, dict):
        return tool
    merged = dict(tool)
    allowed = {"category", "desc", "help_docs", "tags", "use_cases", "training", "cheats", "command", "path"}
    for field in allowed:
        if field in override:
            merged[field] = override[field]
    return merged


def build_tools_payload():
    merged = discover_installed_tools()
    for tname, meta in TOOL_DATA.items():
        base = dict(merged.get(tname, {}))
        base.update(meta)
        base["name"] = tname
        base["command"] = meta.get("command") or base.get("command") or tname
        base["path"] = base.get("path") or shutil.which(tname) or ""
        base["source"] = "curated"
        base["category"] = normalize_category(base.get("category", infer_category(tname, base["path"])))
        base.setdefault("use_cases", infer_use_cases(base["category"]))
        base.setdefault("tags", infer_tags(tname, base["path"], base["category"]))
        base.setdefault("training", infer_training(tname, base["category"]))
        merged[tname] = base

    payload = list(merged.values())
    overrides = load_tool_overrides()
    for i, tool in enumerate(payload):
        name = tool.get("name")
        if name and overrides.get(name):
            payload[i] = apply_tool_override(tool, overrides[name])
            payload[i]["source"] = "override"

    payload.sort(key=lambda t: (t.get("category", ""), t.get("name", "")))
    return payload


def load_presets():
    if not PRESETS_PATH.exists():
        return []
    try:
        with open(PRESETS_PATH) as f:
            return json.load(f)
    except Exception:
        return []


def save_presets(presets):
    PRESETS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(PRESETS_PATH, "w") as f:
        json.dump(presets, f, indent=2)


def load_playbook(pb_id):
    path = PLAYBOOKS_DIR / f"{pb_id}.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def list_playbooks():
    if not PLAYBOOKS_DIR.exists():
        return []
    pbs = []
    for f in PLAYBOOKS_DIR.glob("*.json"):
        try:
            with open(f) as fh:
                data = json.load(fh)
                pbs.append({"id": data.get("id", f.stem), "name": data.get("name", f.stem), "description": data.get("description", "")})
        except Exception:
            pass
    return pbs


def ollama_list_models():
    if not requests:
        return []
    try:
        r = requests.get(OLLAMA_TAGS_URL, timeout=10)
        r.raise_for_status()
        return [m.get("name") for m in r.json().get("models", []) if m.get("name")]
    except Exception:
        return []


def ollama_chat(model, prompt, timeout=60):
    if not requests:
        raise RuntimeError("requests library not installed. Run: pip install requests")
    r = requests.post(
        OLLAMA_GENERATE_URL,
        json={"model": model, "prompt": prompt, "stream": False},
        timeout=timeout,
    )
    r.raise_for_status()
    return r.json()


# ══════════════════════════════════════════════════════════════
# 3. CLI COMMANDS
# ══════════════════════════════════════════════════════════════

def cmd_scan(args):
    """Scan for installed tools and show summary."""
    print(f"{C.C2}╔══════════════════════════════════════╗{C.RS}")
    print(f"{C.C2}║   {C.BD}PARRoT NEXUS — TOOL SCAN{C.RS}{C.C2}        ║{C.RS}")
    print(f"{C.C2}╚══════════════════════════════════════╝{C.RS}")
    print()
    
    start = time.time()
    tools = build_tools_payload()
    elapsed = time.time() - start
    
    categories = {}
    for t in tools:
        cat = t.get("category", "General")
        categories.setdefault(cat, {"count": 0, "tools": []})
        categories[cat]["count"] += 1
        categories[cat]["tools"].append(t["name"])
    
    curated = sum(1 for t in tools if t.get("source") == "curated")
    discovered = sum(1 for t in tools if t.get("source") == "system-path")
    
    print(f"{C.G}✓{C.RS} Scanned {len(tools)} tools in {elapsed:.2f}s")
    print(f"  {C.C2}{curated}{C.RS} curated  |  {C.B}{discovered}{C.RS} discovered from PATH")
    print()
    
    for cat in sorted(categories):
        info = categories[cat]
        print(f"  {C.Y}{cat}{C.RS} ({info['count']})")
        # Show tools in columns
        cols = 4
        names = sorted(info["tools"])
        for i in range(0, len(names), cols):
            row = names[i:i+cols]
            print(f"    {'  '.join(f'{C.D}{n:<20}{C.RS}' for n in row)}")
    print()


def cmd_tools(args):
    """List, search, or show tool details."""
    tools = build_tools_payload()
    
    if args.show:
        name = args.show
        tool = next((t for t in tools if t["name"] == name), None)
        if not tool:
            print(f"{C.R}Error: tool '{name}' not found.{C.RS}")
            return
        print(f"{C.BD}{C.C2}{tool['name']}{C.RS}")
        print(f"  {C.D}━━━━━━━━━━━━━━━━━━━━━━━━━━{C.RS}")
        print(f"  {C.Y}Category:{C.RS}    {tool.get('category', '-')}")
        print(f"  {C.Y}Path:{C.RS}        {tool.get('path', '-')}")
        print(f"  {C.Y}Source:{C.RS}      {tool.get('source', '-')}")
        print(f"  {C.Y}Description:{C.RS} {tool.get('desc', '-')}")
        
        if tool.get("use_cases"):
            print(f"  {C.Y}Use Cases:{C.RS}   {', '.join(tool['use_cases'])}")
        if tool.get("tags"):
            print(f"  {C.Y}Tags:{C.RS}        {' '.join(f'#{t}' for t in tool['tags'])}")
        
        cheats = tool.get("cheats", [])
        if cheats:
            print(f"\n  {C.Y}Cheat Sheet:{C.RS}")
            for c in cheats:
                print(f"    {C.G}{c['desc']}:{C.RS} {c['cmd']}")
        
        training = tool.get("training")
        if training:
            print(f"\n  {C.Y}Training: {C.RS}{training.get('description', '')}")
            for i, lvl in enumerate(training.get("levels", [])):
                status = f"{C.G}[{i+1}/{len(training['levels'])}]{C.RS}"
                print(f"    {status} {lvl['name']}")
                print(f"          {C.D}{lvl['task']}{C.RS}")
                print(f"          {C.B}{lvl['cmd']}{C.RS}")
        return
    
    if args.search:
        term = args.search.lower()
        results = [t for t in tools if term in json.dumps(t).lower()]
        print(f"{C.C2}Search: '{args.search}' — {len(results)} results{C.RS}")
        print()
        for t in results:
            print(f"  {C.G}{t['name']:<20}{C.RS} {C.D}{t.get('category',''):<25}{C.RS} {t.get('desc','')[:60]}")
        if results:
            print(f"\n  {C.D}Use: parrot-nexus tools --show <name>{C.RS}")
        return
    
    # Default: list all
    if args.category:
        filtered = [t for t in tools if t.get("category", "").lower() == args.category.lower()]
    else:
        filtered = tools
    
    print(f"{C.BD}PARRoT NEXUS — Tools ({len(filtered)} shown / {len(tools)} total){C.RS}")
    print(f"  {C.D}Filter: {args.category or 'All categories'}{C.RS}")
    print()
    
    last_cat = None
    for t in filtered:
        cat = t.get("category", "General")
        if cat != last_cat:
            print(f"\n  {C.Y}▸ {cat}{C.RS}")
            last_cat = cat
        has_training = " 🎓" if t.get("training") else ""
        print(f"    {C.G}{t['name']:<22}{C.RS} {C.D}{t.get('desc','')[:70]}{C.RS}{has_training}")
    
    print()
    print(f"  {C.D}Flags:{C.RS}")
    print(f"    --show <name>      Show detailed tool info")
    print(f"    --search <term>    Full-text search")
    print(f"    --category <cat>   Filter by category")
    print()


def cmd_tools_parser(sub):
    p = sub.add_parser("tools", help="List, search, or show tools")
    p.add_argument("--show", type=str, default=None, help="Show detailed info for a specific tool")
    p.add_argument("--search", type=str, default=None, help="Full-text search across tools")
    p.add_argument("--category", type=str, default=None, help="Filter by category")
    p.set_defaults(func=cmd_tools)


def cmd_presets(args):
    """Manage command presets."""
    presets = load_presets()
    
    if args.list:
        if not presets:
            print(f"{C.Y}No presets found.{C.RS}")
            return
        print(f"{C.BD}PARRoT NEXUS — Presets ({len(presets)}){C.RS}")
        print()
        for p in presets:
            args_str = " ".join(p.get("args", []))
            print(f"  {C.G}{p.get('name', '?'):<30}{C.RS} {C.D}{p.get('executable', '')} {args_str}{C.RS}")
            if p.get("description"):
                print(f"  {'':30}  {C.D}{p['description']}{C.RS}")
            print()
        return
    
    if args.launch:
        pid = args.launch
        preset = next((p for p in presets if p.get("id") == pid or p.get("name") == pid), None)
        if not preset:
            print(f"{C.R}Error: preset '{pid}' not found.{C.RS}")
            return
        cmd_parts = [preset.get("executable", "")] + preset.get("args", [])
        cmd_str = " ".join(cmd_parts)
        # Variable substitution
        for k, v in (args.variables or {}).items():
            cmd_str = cmd_str.replace(f"{{{{{k}}}}}", v)
        print(f"{C.C2}Launching: {cmd_str}{C.RS}")
        os.system(cmd_str)
        return
    
    # Default: list
    if not presets:
        print(f"{C.Y}No presets found.{C.RS}")
        return
    cmd_presets(args)


def cmd_presets_parser(sub):
    p = sub.add_parser("presets", help="Manage command presets")
    p.add_argument("--list", action="store_true", help="List all presets")
    p.add_argument("--launch", type=str, default=None, help="Launch a preset by ID or name")
    p.add_argument("--variable", action="append", help="Variables: key=value (repeatable)")
    p.set_defaults(func=cmd_presets)


def cmd_playbook(args):
    """Run a guided playbook mission."""
    if args.list:
        pbs = list_playbooks()
        if not pbs:
            print(f"{C.Y}No playbooks found in {PLAYBOOKS_DIR}.{C.RS}")
            return
        print(f"{C.BD}PARRoT NEXUS — Playbooks{C.RS}")
        print()
        for pb in pbs:
            print(f"  {C.G}{pb['id']:<25}{C.RS} {pb.get('name', '')}")
            if pb.get("description"):
                print(f"  {'':25}  {C.D}{pb['description']}{C.RS}")
            print()
        print(f"  {C.D}Use: parrot-nexus playbook --start <id>{C.RS}")
        return
    
    if args.start:
        pb = load_playbook(args.start)
        if not pb:
            print(f"{C.R}Error: playbook '{args.start}' not found.{C.RS}")
            return
        sid = f"cli-{int(time.time())}"
        session = {
            "sid": sid,
            "playbook_id": pb["id"],
            "current_node": pb["initial_state"],
            "history": [],
            "transition_log": [],
            "findings": {},
            "started_at": datetime.now().isoformat(),
        }
        print(f"{C.BD}{C.G}╔══════════════════════════════════════╗{C.RS}")
        print(f"{C.BD}{C.G}║   MISSION: {pb['name']:<27} ║{C.RS}")
        print(f"{C.BD}{C.G}╚══════════════════════════════════════╝{C.RS}")
        print(f"  {C.D}{pb.get('description', '')}{C.RS}")
        print()
        _run_playbook_loop(pb, session)
        return


def _run_playbook_loop(pb, session):
    """Interactive playbook loop."""
    while True:
        node_id = session["current_node"]
        node = pb["nodes"].get(node_id, {})
        transitions = node.get("transitions", {})
        
        print(f"{C.BD}{C.M}┌─ CURRENT NODE ─────────────────────┐{C.RS}")
        print(f"{C.BD}{C.M}│{C.RS}  {C.C2}{node_id}{C.RS}")
        print(f"{C.BD}{C.M}│{C.RS}  {C.BD}{node.get('label', '')}{C.RS}")
        print(f"{C.BD}{C.M}├──────────────────────────────────────┤{C.RS}")
        print(f"{C.BD}{C.M}│{C.RS}  {node.get('description', '')}")
        print(f"{C.BD}{C.M}│{C.RS}")
        print(f"{C.BD}{C.M}│{C.RS}  {C.Y}AI Guidance:{C.RS} {node.get('ai_guidance', '')}")
        print(f"{C.BD}{C.M}│{C.RS}")
        print(f"{C.BD}{C.M}│{C.RS}  {C.G}Tool:{C.RS} {node.get('tool_suggestion', 'N/A')}")
        print(f"{C.BD}{C.M}└──────────────────────────────────────┘{C.RS}")
        
        if not transitions:
            print(f"\n{C.G}✓{C.RS} {C.BD}Mission Complete!{C.RS} Final node '{node_id}' has no further transitions.")
            print(f"\n  {C.D}Transition log:{C.RS}")
            for entry in session.get("transition_log", []):
                print(f"    {entry['from']} → {entry['to']} ({entry['condition']})")
            if session.get("findings"):
                print(f"\n  {C.D}Findings:{C.RS}")
                for node_n, notes in session["findings"].items():
                    for note in notes:
                        print(f"    \u2022 [{node_n}] {note}")
            return
        
        print()
        print(f"  {C.BD}Available transitions:{C.RS}")
        opts = list(transitions.items())
        for i, (condition, target) in enumerate(opts, 1):
            target_label = pb["nodes"].get(target, {}).get("label", target)
            print(f"    {C.C2}[{i}]{C.RS} {condition.replace('_', ' ')} → {C.G}{target_label}{C.RS}")
        print(f"    {C.R}[q]{C.RS} Abort mission")
        
        choice = input(f"\n  {C.Y}?> {C.RS}").strip()
        if choice.lower() == "q":
            print(f"\n  {C.Y}Mission aborted.{C.RS}")
            return
        
        try:
            idx = int(choice) - 1
            if idx < 0 or idx >= len(opts):
                raise ValueError
            condition, next_node = opts[idx]
        except (ValueError, IndexError):
            print(f"  {C.R}Invalid choice.{C.RS}")
            continue
        
        finding = input(f"  {C.D}Finding note (optional):{C.RS} ").strip()
        
        session["history"].append(node_id)
        session["current_node"] = next_node
        session.setdefault("transition_log", []).append({
            "from": node_id,
            "condition": condition,
            "to": next_node,
            "note": finding,
            "at": datetime.now().isoformat(),
        })
        if finding:
            session.setdefault("findings", {}).setdefault(node_id, []).append(finding)
        print()


def cmd_playbook_parser(sub):
    p = sub.add_parser("playbook", help="Run guided playbook missions")
    p.add_argument("--list", action="store_true", help="List available playbooks")
    p.add_argument("--start", type=str, default=None, help="Start a playbook mission by ID")
    p.set_defaults(func=cmd_playbook)


def cmd_ai(args):
    """Chat with local Ollama or list models."""
    if args.models:
        models = ollama_list_models()
        if not models:
            print(f"{C.Y}No Ollama models found. Is Ollama running? (ollama serve){C.RS}")
            return
        print(f"{C.BD}PARRoT NEXUS — Available Ollama Models{C.RS}")
        print()
        for m in models:
            print(f"  {C.G}•{C.RS} {m}")
        print()
        if models:
            print(f"  {C.D}Use: parrot-nexus ai chat --model <model> --prompt \"...\"{C.RS}")
        return
    
    if args.list or args.prompt is None:
        # Interactive chat mode
        model = args.model or DEFAULT_MODEL
        print(f"{C.BD}PARRoT NEXUS — AI Chat ({model}){C.RS}")
        print(f"  {C.D}Type 'exit' to quit. Use --model to change model.{C.RS}")
        print()
        
        history = []
        while True:
            try:
                user_input = input(f"{C.G}> {C.RS}").strip()
            except (EOFError, KeyboardInterrupt):
                print(f"\n{C.Y}Goodbye.{C.RS}")
                break
            
            if user_input.lower() in ("exit", "quit", "q"):
                break
            if not user_input:
                continue
            
            print(f"  {C.Y}Thinking...{C.RS}", end="\r")
            try:
                resp = ollama_chat(model, user_input)
                text = resp.get("response", "").strip()
                print(f"  {'':>16}", end="\r")  # clear the thinking line
                print(f"  {C.C2}AI:{C.RS} {text}")
            except Exception as e:
                print(f"  {'':>16}", end="\r")
                print(f"  {C.R}Error:{C.RS} {e}")
        
        return
    
    if args.prompt:
        model = args.model or DEFAULT_MODEL
        print(f"{C.Y}Querying {model}...{C.RS}")
        try:
            resp = ollama_chat(model, args.prompt)
            print(f"\n{resp.get('response', '').strip()}")
        except Exception as e:
            print(f"{C.R}Error:{C.RS} {e}")


def cmd_ai_parser(sub):
    p = sub.add_parser("ai", help="Chat with local Ollama or list models")
    p.add_argument("--models", action="store_true", help="List available Ollama models")
    p.add_argument("--model", type=str, default=None, help="Ollama model name (default: gemma4:31b-cloud)")
    p.add_argument("--prompt", type=str, default=None, help="Send a one-shot prompt (omit for interactive)")
    p.add_argument("-l", "--list", action="store_true", help=argparse.SUPPRESS)
    p.set_defaults(func=cmd_ai)


def cmd_terminal(args):
    """Launch an interactive PTY terminal session."""
    shell = args.shell or os.environ.get("SHELL", "/bin/bash")
    print(f"{C.C2}PARRoT NEXUS — Terminal ({shell}){C.RS}")
    print(f"  {C.D}Press Ctrl+C to exit.{C.RS}")
    print()
    
    # Save terminal attributes
    old_settings = None
    try:
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
    except Exception:
        pass
    
    try:
        subprocess.run([shell], check=False)
    except KeyboardInterrupt:
        pass
    finally:
        if old_settings:
            try:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
            except Exception:
                pass


def cmd_terminal_parser(sub):
    p = sub.add_parser("terminal", help="Launch an interactive PTY terminal session")
    p.add_argument("--shell", type=str, default=None, help="Shell to use (default: $SHELL)")
    p.set_defaults(func=cmd_terminal)


def cmd_dashboard(args):
    """Show terminal-based dashboard overview."""
    tools = build_tools_payload()
    presets = load_presets()
    pbs = list_playbooks()
    
    categories = {}
    for t in tools:
        cat = t.get("category", "General")
        categories[cat] = categories.get(cat, 0) + 1
    
    curated = sum(1 for t in tools if t.get("source") == "curated")
    path_tools = sum(1 for t in tools if t.get("source") == "system-path")
    with_training = sum(1 for t in tools if t.get("training"))
    
    print(f"{C.C2}╔══════════════════════════════════════════════╗{C.RS}")
    print(f"{C.C2}║   {C.BD}{C.W}PARRoT NEXUS — Command Center{C.RS}{C.C2}           ║{C.RS}")
    print(f"{C.C2}╚══════════════════════════════════════════════╝{C.RS}")
    print()
    
    print(f"  {C.BD}System Status{C.RS}")
    print(f"    {C.G}●{C.RS} Ollama:     {'Running' if ollama_list_models() else f'{C.R}Not detected{C.RS}'}")
    print(f"    {C.G}●{C.RS} Shell:      {os.environ.get('SHELL', '/bin/bash')}")
    print()
    
    print(f"  {C.BD}Tool Index ({len(tools)} total){C.RS}")
    print(f"    Curated:   {curated}")
    print(f"    Discovered: {path_tools}")
    print(f"    With Training: {with_training}")
    print()
    
    print(f"  {C.BD}Categories{C.RS}")
    for cat in sorted(categories):
        bar_len = int(categories[cat] / max(categories.values()) * 30) if categories else 0
        bar = "█" * bar_len
        print(f"    {C.Y}{cat:<30}{C.RS} {C.G}{categories[cat]:>3}{C.RS} {C.D}{bar}{C.RS}")
    print()
    
    print(f"  {C.BD}Presets{C.RS}  {len(presets)} defined")
    print(f"  {C.BD}Playbooks{C.RS} {len(pbs)} available")
    print()
    
    print(f"  {C.D}Quick commands:{C.RS}")
    print(f"    {C.G}parrot-nexus tools{C.RS}              List all tools")
    print(f"    {C.G}parrot-nexus tools --show nmap{C.RS}  Show tool details with cheat sheet")
    print(f"    {C.G}parrot-nexus ai --models{C.RS}        List Ollama models")
    print(f"    {C.G}parrot-nexus ai --model ...{C.RS}     Chat with AI")
    print(f"    {C.G}parrot-nexus playbook --start vuln_2026{C.RS}  Run a guided pentest mission")
    print(f"    {C.G}parrot-nexus terminal{C.RS}           Launch interactive terminal")
    print(f"    {C.G}parrot-nexus scan{C.RS}               Re-scan for installed tools")
    print()


def cmd_dashboard_parser(sub):
    p = sub.add_parser("dashboard", help="Show terminal-based dashboard overview")
    p.set_defaults(func=cmd_dashboard)


def cmd_doctor(args):
    """Check system health."""
    print(f"{C.BD}PARRoT NEXUS — System Diagnostics{C.RS}")
    print()
    
    checks = []
    
    # Python
    checks.append(("Python", sys.version.split()[0], True))
    
    # Requests
    checks.append(("requests lib", "available" if requests else "NOT INSTALLED", bool(requests)))
    
    # Ollama
    models = ollama_list_models()
    checks.append(("Ollama", f"{'Running' if models else 'Not detected'} ({len(models)} models)" if models else "Not detected", bool(models)))
    
    # Shell
    shell = os.environ.get("SHELL", "/bin/bash")
    checks.append(("Shell", shell, bool(shutil.which(shell))))
    
    # Common tools availability
    for tname in ["nmap", "gobuster", "sqlmap", "nc", "curl", "wget", "git", "python3"]:
        found = shutil.which(tname)
        checks.append((tname, f"{'✓' if found else '✗'} {found or 'not found'}", bool(found)))
    
    # Presets
    presets = load_presets()
    checks.append(("Presets", f"{len(presets)} loaded", True))
    
    # Playbooks
    pbs = list_playbooks()
    checks.append(("Playbooks", f"{len(pbs)} available", True))
    
    for name, status, ok in checks:
        icon = f"{C.G}✓{C.RS}" if ok else f"{C.R}✗{C.RS}"
        print(f"  {icon} {C.BD}{name:<20}{C.RS} {status}")
    
    print()
    if not requests:
        print(f"  {C.Y}Tip:{C.RS} Install requests for AI chat: pip install requests")
    print()


def cmd_doctor_parser(sub):
    p = sub.add_parser("doctor", help="Check system health")
    p.set_defaults(func=cmd_doctor)


APP_VERSION = "1.0.0"


def cmd_version(args):
    print(f"{C.C2}PARRoT NEXUS{C.RS} v{APP_VERSION} — Unified Security & Intelligence Hub (CLI)")
    print(f"Python {sys.version.split()[0]}")


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description=f"{C.C2}PARRoT NEXUS{C.RS} — Unified Security & Intelligence Hub (CLI)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              parrot-nexus.py scan
              parrot-nexus.py tools --show nmap
              parrot-nexus.py tools --search web
              parrot-nexus.py ai --models
              parrot-nexus.py ai --model gemma4:31b-cloud --prompt "How do I scan open ports?"
              parrot-nexus.py ai
              parrot-nexus.py playbook --list
              parrot-nexus.py playbook --start vuln_2026
              parrot-nexus.py terminal
              parrot-nexus.py doctor
        """),
    )
    
    sub = parser.add_subparsers(dest="command")
    sub.required = True
    
    # scan
    p = sub.add_parser("scan", help="Discover installed security tools")
    p.set_defaults(func=cmd_scan)
    
    # tools
    cmd_tools_parser(sub)
    
    # presets
    cmd_presets_parser(sub)
    
    # playbook
    cmd_playbook_parser(sub)
    
    # ai
    cmd_ai_parser(sub)
    
    # terminal
    cmd_terminal_parser(sub)
    
    # dashboard
    cmd_dashboard_parser(sub)
    
    # doctor
    cmd_doctor_parser(sub)

    # version
    p = sub.add_parser("version", help="Show CLI version")
    p.set_defaults(func=cmd_version)


    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
