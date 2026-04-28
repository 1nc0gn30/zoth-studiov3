import json
import os
import pty
import re
import shutil
import signal
import struct
import subprocess
import threading
import time
from datetime import datetime
from pathlib import Path

import fcntl
import requests
import termios
from flask import Flask, jsonify, request
try:
    from flask_cors import CORS
    HAS_FLASK_CORS = True
except ImportError:
    HAS_FLASK_CORS = False
from flask_socketio import SocketIO

app = Flask(__name__)
if HAS_FLASK_CORS:
    CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

BASE_DIR = Path(__file__).resolve().parent
PRESETS_PATH = BASE_DIR / "config" / "presets.json"
TOOL_OVERRIDES_PATH = BASE_DIR / "config" / "tool_overrides.json"
TOOLS_DIR = BASE_DIR / "tools"
PLAYBOOKS_DIR = BASE_DIR / "playbooks"
TOOLS_SNAPSHOT_PATH = TOOLS_DIR / "loaded_tools.json"

sessions = {}
sessions_lock = threading.Lock()
presets_lock = threading.Lock()
heartbeat_lock = threading.Lock()
heartbeat_stop_event = threading.Event()
heartbeat_thread = None
heartbeat_state = {
    "enabled": False,
    "model": "gemma4:31b-cloud",
    "prompt": "Reply with exactly: HEARTBEAT_OK",
    "interval_seconds": 60,
    "last_ok": None,
    "last_error": None,
    "last_latency_ms": None,
    "last_checked_at": None,
    "last_response_preview": "",
}
agent_lock = threading.Lock()
agent_stop_event = threading.Event()
agent_state = {
    "enabled": False,
    "name": "codex-ollama-agent",
    "model": "gemma4:31b-cloud",
    "command": [],
    "cwd": "",
    "auto_restart": True,
    "restart_count": 0,
    "max_restarts": 100,
    "running": False,
    "pid": None,
    "run_dir": "",
    "log_path": "",
    "last_started_at": None,
    "last_stopped_at": None,
    "last_exit_code": None,
    "last_error": None,
}
agent_process = None

# Playbook State Management
playbook_sessions = {} # sid -> {playbook_id, current_node, history, findings}
playbook_lock = threading.Lock()

def load_playbook(playbook_id):
    path = PLAYBOOKS_DIR / f"{playbook_id}.json"
    if not path.exists():
        return None
    with open(path, 'r') as f:
        return json.load(f)

# Expanded Tool Knowledge Base
TOOL_DATA = {
    "nmap": {
        "category": "Information Gathering",
        "desc": "Network Mapper: The industry standard for network discovery and security auditing.",
        "help_docs": "Nmap allows you to discover hosts on a network, identify open ports, and detect services/OS versions. It is essential for the reconnaissance phase of any audit.",
        "cheats": [
            {"desc": "Quick Scan (Fast)", "cmd": "nmap -F <target>"},
            {"desc": "Service/Version Detection", "cmd": "nmap -sV <target>"},
            {"desc": "OS Fingerprinting", "cmd": "nmap -O <target>"},
            {"desc": "Aggressive Scan (All-in-one)", "cmd": "nmap -A <target>"},
            {"desc": "Stealth SYN Scan", "cmd": "nmap -sS <target>"},
            {"desc": "Ping Sweep", "cmd": "nmap -sn <network/range>"},
        ],
    },
    "msfconsole": {
        "category": "Exploitation Tools",
        "desc": "Metasploit Framework: A modular penetration testing platform.",
        "help_docs": "Metasploit provides a database of exploits, payloads, and encoders. Use it to verify vulnerabilities found during scanning.",
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
        "help_docs": "SQLMap automates the process of detecting and exploiting SQL injection flaws and taking over database servers.",
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
        "desc": "Directory and DNS Brute-forcer.",
        "help_docs": "Gobuster is used to discover hidden files and directories on web servers or subdomains of a domain.",
        "cheats": [
            {"desc": "Directory Brute", "cmd": "gobuster dir -u <url> -w <wordlist>"},
            {"desc": "Subdomain Brute", "cmd": "gobuster dns -d <domain> -w <wordlist>"},
            {"desc": "Hide 404 errors", "cmd": "gobuster dir -u <url> -w <wordlist> -b 404"},
        ],
    },
    "ollama": {
        "category": "Intelligence",
        "desc": "Local LLM Runner (Llama, Mistral, etc).",
        "help_docs": "Ollama allows you to run massive AI models locally without needing an internet connection or leaking data.",
        "cheats": [
            {"desc": "Run Llama3", "cmd": "ollama run llama3"},
            {"desc": "List Installed Models", "cmd": "ollama list"},
            {"desc": "Pull New Model", "cmd": "ollama pull <model>"},
            {"desc": "Check Version", "cmd": "ollama --version"},
        ],
    },
    "codex": {
        "category": "Intelligence",
        "desc": "Agentic Coding Interface.",
        "help_docs": "Codex is an AI-driven CLI for rapid prototyping and codebase manipulation.",
        "cheats": [
            {"desc": "Start Codex", "cmd": "codex"},
            {"desc": "Help Menu", "cmd": "codex --help"},
        ],
    },
    "openclaw": {
        "category": "Intelligence",
        "desc": "Decentralized Operator Tooling.",
        "help_docs": "OpenClaw provides advanced orchestration and decentralized agent control for complex infrastructure operations.",
        "cheats": [
            {"desc": "List Active Operators", "cmd": "openclaw op list"},
            {"desc": "Deploy Operator", "cmd": "openclaw op deploy <config>"},
            {"desc": "Monitor Operator", "cmd": "openclaw op monitor <id>"},
            {"desc": "Slay Operator", "cmd": "openclaw op slay <id>"},
        ],
    },
}

DISCOVERED_TOOL_CATEGORY = "System & Misc Utilities"

EXACT_TOOL_CATEGORY = {
    "nmap": "Recon & Enumeration",
    "masscan": "Recon & Enumeration",
    "amass": "Recon & Enumeration",
    "subfinder": "Recon & Enumeration",
    "theharvester": "Recon & Enumeration",
    "sqlmap": "Web App Security",
    "nikto": "Web App Security",
    "ffuf": "Web App Security",
    "gobuster": "Web App Security",
    "wfuzz": "Web App Security",
    "wpscan": "Web App Security",
    "burpsuite": "Web App Security",
    "msfconsole": "Exploitation Frameworks",
    "searchsploit": "Exploitation Frameworks",
    "john": "Password & Crypto",
    "hashcat": "Password & Crypto",
    "hydra": "Password & Crypto",
    "aircrack-ng": "Wireless & RF",
    "wifite": "Wireless & RF",
    "kismet": "Wireless & RF",
    "tshark": "Network Analysis",
    "wireshark": "Network Analysis",
    "tcpdump": "Network Analysis",
    "ettercap": "Network Analysis",
    "nuclei": "Vulnerability Scanning",
    "openvas": "Vulnerability Scanning",
    "lynis": "Vulnerability Scanning",
    "volatility": "Forensics",
    "autopsy": "Forensics",
    "binwalk": "Forensics",
    "ghidra": "Reverse Engineering",
    "radare2": "Reverse Engineering",
    "rizin": "Reverse Engineering",
}

CATEGORY_KEYWORDS = {
    "Recon & Enumeration": [
        "nmap", "masscan", "whois", "dig", "dns", "dnsenum", "dnsrecon", "fierce", "enum",
        "recon", "subfinder", "amass", "theharvester", "netdiscover", "traceroute", "snmp",
        "nbtscan", "arp-scan", "xprobe", "onesixtyone", "enum4linux", "ldapsearch",
    ],
    "Web App Security": [
        "sqlmap", "nikto", "burp", "ffuf", "wfuzz", "gobuster", "dirb", "dirbuster", "ferox",
        "xsstrike", "xss", "csrf", "ssti", "whatweb", "wpscan", "joomscan", "commix",
        "httprobe", "httpx", "zap", "param", "wayback", "webanalyze",
    ],
    "Exploitation Frameworks": [
        "msf", "metasploit", "exploit", "searchsploit", "beef", "empire", "routerpwn", "pwn",
        "shellcode", "payload", "rop", "boofuzz",
    ],
    "Password & Crypto": [
        "john", "hashcat", "hydra", "medusa", "patator", "cewl", "crunch", "hash", "crypt",
        "gpg", "pgp", "jwt", "bcrypt", "argon", "sha", "md5", "keepass", "pass", "bruteforce",
    ],
    "Wireless & RF": [
        "aircrack", "aireplay", "airodump", "airmon", "wifite", "kismet", "bluetooth", "bt",
        "rf", "rtl", "zigbee", "zwave", "wifi", "wlan", "hcxdumptool", "mdk4",
    ],
    "Network Analysis": [
        "tcpdump", "wireshark", "tshark", "ettercap", "dsniff", "sniff", "netcat", "ncat",
        "socat", "ss", "iftop", "ngrep", "pcap", "mitm", "proxy", "route", "ifconfig", "ip",
        "iptables", "nft", "arp", "mtr",
    ],
    "Forensics": [
        "volatility", "autopsy", "binwalk", "foremost", "bulk", "sleuth", "memdump", "forensic",
        "timeline", "artifact", "plaso", "yara", "hashdeep", "dc3dd",
    ],
    "Vulnerability Scanning": [
        "nuclei", "openvas", "nessus", "lynis", "vuln", "cve", "scanner", "scan", "gvm",
        "nikto", "trivy", "checksec",
    ],
    "OSINT": [
        "osint", "maltego", "spiderfoot", "holehe", "sherlock", "recon-ng", "intelx",
        "h8mail", "social", "metadata", "exiftool",
    ],
    "Container & Cloud": [
        "docker", "kubectl", "kube", "helm", "trivy", "terraform", "ansible", "vault",
        "aws", "az", "gcloud", "podman", "container", "k8s", "iac",
    ],
    "Reverse Engineering": [
        "ghidra", "radare", "rizin", "objdump", "readelf", "nm", "strings", "gdb", "ltrace",
        "strace", "disasm", "decompile", "unicorn", "cutter",
    ],
    "Wordlists & Fuzzing": [
        "wordlist", "seclists", "fuzz", "mutate", "payload", "dictionary", "cupp", "wfuzz",
        "ffuf", "boofuzz",
    ],
    "Scripting & Automation": [
        "python", "perl", "ruby", "lua", "bash", "zsh", "sh", "awk", "sed", "jq", "yq",
        "make", "task", "script",
    ],
}

CATEGORY_USE_CASES = {
    "Recon & Enumeration": [
        "Map hosts, open ports, and exposed services",
        "Collect DNS and domain intelligence before testing",
        "Build target inventories for assessment planning",
    ],
    "Web App Security": [
        "Discover hidden web paths, parameters, and endpoints",
        "Test for SQL injection and common web vulnerabilities",
        "Validate hardening and input validation controls",
    ],
    "Exploitation Frameworks": [
        "Validate whether discovered vulnerabilities are exploitable",
        "Simulate attacker post-exploitation workflows",
        "Demonstrate real impact for remediation prioritization",
    ],
    "Password & Crypto": [
        "Audit password strength and hash resistance",
        "Test authentication controls and credential hygiene",
        "Evaluate cryptographic configurations and artifacts",
    ],
    "Wireless & RF": [
        "Assess Wi-Fi and wireless protocol exposure",
        "Audit nearby radio-based attack surfaces",
        "Validate wireless security controls and monitoring",
    ],
    "Network Analysis": [
        "Capture and inspect packets during testing",
        "Troubleshoot suspicious traffic and service behavior",
        "Verify segmentation and protocol-level controls",
    ],
    "Forensics": [
        "Analyze disk and memory artifacts after incidents",
        "Recover indicators of compromise and timelines",
        "Support evidence collection for investigations",
    ],
    "Vulnerability Scanning": [
        "Scan systems for known weaknesses and misconfigurations",
        "Track exposure trends across environments",
        "Prioritize remediation using scanner findings",
    ],
    "OSINT": [
        "Gather publicly available target intelligence",
        "Correlate identities, infrastructure, and leaks",
        "Reduce blind spots before active testing",
    ],
    "Container & Cloud": [
        "Assess cloud and container security posture",
        "Validate infrastructure-as-code and runtime exposure",
        "Audit cluster access and deployment hygiene",
    ],
    "Reverse Engineering": [
        "Inspect binaries and unknown executables",
        "Trace runtime behavior for malware analysis",
        "Extract logic and indicators from compiled code",
    ],
    "Wordlists & Fuzzing": [
        "Generate and use payloads for fuzz testing",
        "Expand brute-force and discovery coverage",
        "Tune test dictionaries for target context",
    ],
    "Scripting & Automation": [
        "Automate repetitive security operations",
        "Build custom workflow glue around security tools",
        "Prototype and chain assessment tasks quickly",
    ],
    "System & Misc Utilities": [
        "Support day-to-day shell and system operations",
        "Combine with specialized tools in custom workflows",
        "Handle utility tasks during assessments and triage",
    ],
}

CATEGORY_TAGS = {
    "Recon & Enumeration": ["recon", "enumeration", "asset-discovery", "network-mapping"],
    "Web App Security": ["web", "http", "appsec", "endpoint-discovery"],
    "Exploitation Frameworks": ["exploitation", "post-exploitation", "payloads", "offensive-security"],
    "Password & Crypto": ["password-audit", "hashes", "credentials", "crypto"],
    "Wireless & RF": ["wireless", "wifi", "bluetooth", "radio"],
    "Network Analysis": ["packet-analysis", "network-traffic", "protocols", "troubleshooting"],
    "Forensics": ["forensics", "incident-response", "evidence", "artifact-analysis"],
    "Vulnerability Scanning": ["vuln-scanning", "misconfiguration", "exposure", "compliance"],
    "OSINT": ["osint", "intel-gathering", "attribution", "public-data"],
    "Container & Cloud": ["cloud", "containers", "kubernetes", "infrastructure"],
    "Reverse Engineering": ["reverse-engineering", "binary-analysis", "debugging", "malware-analysis"],
    "Wordlists & Fuzzing": ["fuzzing", "wordlists", "payload-generation", "input-testing"],
    "Scripting & Automation": ["automation", "scripting", "workflow", "operations"],
    "System & Misc Utilities": ["system", "shell", "utility", "general-purpose"],
}

TAG_KEYWORDS = {
    "nmap": ["port-scan", "service-detection"],
    "masscan": ["high-speed-scan", "port-scan"],
    "sqlmap": ["sql-injection", "database-testing"],
    "ffuf": ["content-discovery", "fuzzing"],
    "gobuster": ["directory-bruteforce", "subdomain-enum"],
    "nikto": ["web-vuln-scan", "http-audit"],
    "wfuzz": ["web-fuzzing", "parameter-testing"],
    "john": ["password-cracking", "hash-cracking"],
    "hashcat": ["gpu-cracking", "hash-cracking"],
    "hydra": ["login-bruteforce", "credential-testing"],
    "aircrack": ["wifi-audit", "wpa-testing"],
    "wireshark": ["pcap", "packet-analysis"],
    "tshark": ["pcap", "packet-analysis"],
    "tcpdump": ["packet-capture", "traffic-debugging"],
    "nuclei": ["template-scanner", "cve-detection"],
    "openvas": ["network-vuln-scan", "vulnerability-management"],
    "ghidra": ["decompilation", "binary-analysis"],
    "volatility": ["memory-forensics", "incident-response"],
    "docker": ["container-runtime", "devops"],
    "kubectl": ["kubernetes-admin", "cluster-ops"],
}

CATEGORY_ALIASES = {
    "Information Gathering": "Recon & Enumeration",
    "Web Application Analysis": "Web App Security",
    "Exploitation Tools": "Exploitation Frameworks",
    "Password Attacks": "Password & Crypto",
}

TRAINING_BLUEPRINTS = {
    "Recon & Enumeration": {
        "focus": "Build precise target visibility before deeper testing.",
        "lessons": [
            "Map hosts and services using safe discovery techniques.",
            "Prioritize exposed services and protocol weaknesses.",
            "Create repeatable recon baselines for authorized scopes.",
        ],
    },
    "Web App Security": {
        "focus": "Find and validate web-facing weaknesses responsibly.",
        "lessons": [
            "Discover endpoints, parameters, and hidden resources.",
            "Assess authentication, session, and input handling.",
            "Document vulnerability impact and mitigation paths.",
        ],
    },
    "Exploitation Frameworks": {
        "focus": "Validate findings in controlled, authorized labs.",
        "lessons": [
            "Select modules and payloads aligned to verified findings.",
            "Operate frameworks with minimal blast radius.",
            "Capture proof of impact for remediation teams.",
        ],
    },
    "Password & Crypto": {
        "focus": "Evaluate credential and cryptographic resilience.",
        "lessons": [
            "Audit hash strength and password policy posture.",
            "Test authentication controls against credential attacks.",
            "Recommend hardening for cryptographic operations.",
        ],
    },
    "Wireless & RF": {
        "focus": "Assess wireless surface with strict authorization.",
        "lessons": [
            "Baseline wireless visibility and protocol configurations.",
            "Test handshake, auth, and segmentation controls.",
            "Report hardening priorities for wireless environments.",
        ],
    },
    "Network Analysis": {
        "focus": "Inspect traffic behavior and protocol-level risk.",
        "lessons": [
            "Capture clean traffic baselines for key services.",
            "Analyze anomalies, leakage, and suspicious flows.",
            "Translate packet findings into actionable fixes.",
        ],
    },
    "Forensics": {
        "focus": "Develop evidence-first incident analysis workflows.",
        "lessons": [
            "Collect and preserve forensic artifacts safely.",
            "Correlate host and memory evidence into timelines.",
            "Produce investigation-ready reporting outputs.",
        ],
    },
    "Vulnerability Scanning": {
        "focus": "Operationalize scanner findings into remediation.",
        "lessons": [
            "Tune scans to reduce false positives and noise.",
            "Correlate results with environment criticality.",
            "Track remediation closure with measurable risk reduction.",
        ],
    },
    "OSINT": {
        "focus": "Gather high-signal public intelligence ethically.",
        "lessons": [
            "Collect public footprint data across attack surfaces.",
            "Cross-validate intelligence from multiple sources.",
            "Use OSINT to improve defensive prioritization.",
        ],
    },
    "Container & Cloud": {
        "focus": "Audit modern infrastructure security posture.",
        "lessons": [
            "Assess runtime and orchestration exposure.",
            "Review infrastructure-as-code for drift and risk.",
            "Validate identity, secrets, and policy enforcement.",
        ],
    },
    "Reverse Engineering": {
        "focus": "Understand binary behavior for defense and triage.",
        "lessons": [
            "Perform static analysis and symbol exploration.",
            "Trace runtime execution and suspicious paths.",
            "Extract indicators to improve detection coverage.",
        ],
    },
    "Wordlists & Fuzzing": {
        "focus": "Improve test coverage with targeted payload strategy.",
        "lessons": [
            "Build high-signal wordlists and payload sets.",
            "Execute controlled fuzzing against authorized targets.",
            "Prioritize crash and anomaly triage workflows.",
        ],
    },
    "Scripting & Automation": {
        "focus": "Automate repeatable security operations safely.",
        "lessons": [
            "Script repeatable checks and parsing pipelines.",
            "Chain tools into deterministic workflows.",
            "Harden scripts for reliability and traceability.",
        ],
    },
    "System & Misc Utilities": {
        "focus": "Use utility tooling to support secure operations.",
        "lessons": [
            "Master core shell commands for operational velocity.",
            "Use utility tools as building blocks for automation.",
            "Apply least-privilege and auditability in workflows.",
        ],
    },
    "Intelligence": {
        "focus": "Use AI/operator tooling to accelerate analysis.",
        "lessons": [
            "Create structured prompts for operational tasks.",
            "Validate AI-generated outputs before execution.",
            "Integrate AI into secure, auditable workflows.",
        ],
    },
}


def normalize_category(category):
    if not category:
        return DISCOVERED_TOOL_CATEGORY
    return CATEGORY_ALIASES.get(category, category)


def infer_category(tool_name, tool_path):
    normalized = tool_name.lower().strip()
    if normalized in EXACT_TOOL_CATEGORY:
        return EXACT_TOOL_CATEGORY[normalized]

    haystack = f"{tool_name} {tool_path}".lower()
    tokens = [token for token in re.split(r"[^a-z0-9]+", haystack) if token]
    token_set = set(tokens)

    scores = {category: 0 for category in CATEGORY_KEYWORDS}
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            lowered_keyword = keyword.lower()
            if lowered_keyword in token_set:
                scores[category] += 6
            elif any(token.startswith(lowered_keyword) for token in token_set):
                scores[category] += 3
            elif lowered_keyword in haystack:
                scores[category] += 2

    top_category, top_score = max(scores.items(), key=lambda item: item[1])
    if top_score >= 4:
        return top_category
    return DISCOVERED_TOOL_CATEGORY


def infer_use_cases(category):
    normalized = normalize_category(category)
    return CATEGORY_USE_CASES.get(normalized, CATEGORY_USE_CASES[DISCOVERED_TOOL_CATEGORY])


def infer_tags(tool_name, tool_path, category):
    normalized_category = normalize_category(category)
    tags = list(CATEGORY_TAGS.get(normalized_category, CATEGORY_TAGS[DISCOVERED_TOOL_CATEGORY]))
    lowered = f"{tool_name} {tool_path}".lower()

    for keyword, keyword_tags in TAG_KEYWORDS.items():
        if keyword in lowered:
            tags.extend(keyword_tags)

    if "scan" in lowered:
        tags.append("scanning")
    if "enum" in lowered:
        tags.append("enumeration")
    if "fuzz" in lowered:
        tags.append("fuzzing")
    if "proxy" in lowered:
        tags.append("proxying")
    if "dns" in lowered:
        tags.append("dns")
    if "http" in lowered or "web" in lowered:
        tags.append("web")

    normalized = []
    seen = set()
    for tag in tags:
        clean = str(tag).strip().lower().replace(" ", "-")
        if not clean or clean in seen:
            continue
        seen.add(clean)
        normalized.append(clean)

    return normalized[:8]


def infer_description(tool_name, category):
    normalized_category = normalize_category(category)
    return (
        f"{tool_name} is classified under {normalized_category}. "
        "Use this utility in the integrated Parrot Nexus workspace for targeted security operations."
    )


def infer_training(tool_name, category):
    normalized_category = normalize_category(category)
    blueprint = TRAINING_BLUEPRINTS.get(
        normalized_category, TRAINING_BLUEPRINTS[DISCOVERED_TOOL_CATEGORY]
    )

    return {
        "title": f"{tool_name} Operator Academy",
        "track": normalized_category,
        "focus": blueprint["focus"],
        "legal_notice": "For authorized systems and labs only. Follow applicable laws and written permissions.",
        "levels": [
            {
                "name": "Foundation",
                "objective": blueprint["lessons"][0],
                "lab": {
                    "title": "Capability Baseline",
                    "command": f"{tool_name} --help",
                    "outcome": "Identify safe flags and core workflow options.",
                },
            },
            {
                "name": "Operator",
                "objective": blueprint["lessons"][1],
                "lab": {
                    "title": "Controlled Scenario",
                    "command": f"{tool_name} --version",
                    "outcome": "Verify environment readiness and tool behavior in your lab.",
                },
            },
            {
                "name": "Advanced",
                "objective": blueprint["lessons"][2],
                "lab": {
                    "title": "Reporting Drill",
                    "command": f"man {tool_name}",
                    "outcome": "Document command rationale, findings, and mitigation notes.",
                },
            },
        ],
        "milestones": [
            "Explain where this tool fits in an end-to-end assessment.",
            "Run repeatable commands with logged output and rationale.",
            "Translate tool output into remediation-focused recommendations.",
        ],
    }


# GUI-only tools that cannot run in a terminal workspace
_GUI_ONLY_TOOLS = {
    "ghidra", "dirbuster", "burpsuite", "zaproxy", "owasp-zap",
    "wireshark", "maltego", "autopsy", "fern-wifi-cracker",
    "arachni", "skipfish", "w3af", "watobo", "cutter", "zenmap",
    "dbbrowser-sqlite", "etherape",
}


def discover_installed_tools():
    """Discover installed tools from PATH, excluding System Utilities and GUI-only tools."""
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
            if not os.path.isfile(full_path):
                continue
            if not os.access(full_path, os.X_OK):
                continue

            category = infer_category(entry, full_path)
            normalized_category = normalize_category(category)

            # Skip System & Misc Utilities — too many (3000+), not useful in dashboard
            if normalized_category == DISCOVERED_TOOL_CATEGORY:
                continue

            # Mark GUI-only tools as on-demand
            launch_type = "cli"
            if entry in _GUI_ONLY_TOOLS:
                launch_type = "on-demand"

            discovered[entry] = {
                "name": entry,
                "command": entry,
                "path": full_path,
                "category": normalized_category,
                "launch_type": launch_type,
                "desc": infer_description(entry, category),
                "use_cases": infer_use_cases(category),
                "tags": infer_tags(entry, full_path, category),
                "training": infer_training(entry, category),
                "help_docs": (
                    "Discovered from your Parrot OS PATH. "
                    "Open a workspace and run '--help' or 'man <tool>' for usage details."
                ),
                "cheats": [{"desc": "Show help", "cmd": f"{entry} --help"}],
                "source": "system-path",
            }

    return discovered


def write_tools_snapshot(tools):
    snapshot_items = []
    for tool in tools:
        name = tool.get("name")
        path = tool.get("path")
        if name and path:
            snapshot_items.append({"name": name, "path": path})

    snapshot_items.sort(key=lambda item: item["name"])
    TOOLS_SNAPSHOT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(TOOLS_SNAPSHOT_PATH, "w") as snapshot_file:
        json.dump(snapshot_items, snapshot_file, indent=2)


def load_tool_overrides():
    if not TOOL_OVERRIDES_PATH.exists():
        return {}

    try:
        with open(TOOL_OVERRIDES_PATH, "r") as override_file:
            payload = json.load(override_file)
        if isinstance(payload, dict):
            return payload
    except Exception:
        return {}

    return {}


def apply_tool_override(tool, override):
    if not isinstance(override, dict):
        return tool

    merged = dict(tool)
    allowed_fields = {
        "category",
        "desc",
        "help_docs",
        "tags",
        "use_cases",
        "training",
        "cheats",
        "command",
        "path",
    }
    for field in allowed_fields:
        if field in override:
            merged[field] = override[field]

    return merged


_TOOLS_CACHE = {"at": 0.0, "data": None}
_TOOLS_CACHE_TTL = 120


def build_tools_payload():
    import time as _time
    now = _time.time()
    if _TOOLS_CACHE["data"] is not None and now - _TOOLS_CACHE["at"] < _TOOLS_CACHE_TTL:
        return _TOOLS_CACHE["data"]
    merged_tools = discover_installed_tools()

    for tool_name, metadata in TOOL_DATA.items():
        base = dict(merged_tools.get(tool_name, {}))
        base.update(metadata)
        base["name"] = tool_name
        base["command"] = metadata.get("command") or base.get("command") or tool_name
        base["path"] = base.get("path") or shutil.which(tool_name) or ""
        base["source"] = "curated"
        if not base.get("category"):
            base["category"] = infer_category(tool_name, base["path"])
        base["category"] = normalize_category(base["category"])
        if not base.get("desc"):
            base["desc"] = infer_description(tool_name, base["category"])
        if not base.get("use_cases"):
            base["use_cases"] = infer_use_cases(base["category"])
        if not base.get("tags"):
            base["tags"] = infer_tags(tool_name, base["path"], base["category"])
        if not base.get("training"):
            base["training"] = infer_training(tool_name, base["category"])
        merged_tools[tool_name] = base

    payload = list(merged_tools.values())
    overrides = load_tool_overrides()
    if overrides:
        for i, tool in enumerate(payload):
            tool_name = tool.get("name")
            if not tool_name:
                continue
            override = overrides.get(tool_name)
            if not override:
                continue

            updated = apply_tool_override(tool, override)
            updated["category"] = normalize_category(updated.get("category"))
            if not updated.get("desc"):
                updated["desc"] = infer_description(tool_name, updated["category"])
            if not updated.get("use_cases"):
                updated["use_cases"] = infer_use_cases(updated["category"])
            if not updated.get("tags"):
                updated["tags"] = infer_tags(tool_name, updated.get("path", ""), updated["category"])
            if not updated.get("training"):
                updated["training"] = infer_training(tool_name, updated["category"])
            updated["source"] = "override"
            payload[i] = updated

    payload.sort(key=lambda tool: (tool.get("category", ""), tool.get("name", "")))
    write_tools_snapshot(payload)
    _TOOLS_CACHE["at"] = now
    _TOOLS_CACHE["data"] = payload
    return payload


def load_presets():
    with presets_lock:
        if not PRESETS_PATH.exists():
            return []
        try:
            with open(PRESETS_PATH, 'r') as f:
                return json.load(f)
        except Exception:
            return []

def ensure_presets_file():
    if not PRESETS_PATH.exists():
        PRESETS_PATH.parent.mkdir(parents=True, exist_ok=True)
        default_presets = [
            {"id": "default-shell", "name": "Default Shell", "cmd": ["/bin/bash"], "cwd": "/home/neo"},
        ]
        with open(PRESETS_PATH, 'w') as f:
            json.dump(default_presets, f, indent=2)

def build_launch_payload(preset, variables):
    cmd = list(preset.get("cmd", []))
    cwd = preset.get("cwd", "/home/neo")
    
    # Simple variable replacement in command list
    for i, part in enumerate(cmd):
        for k, v in variables.items():
            cmd[i] = part.replace(f"{{{k}}}", v)
            
    return {
        "cmd": cmd,
        "cwd": cwd,
        "env": os.environ.copy(),
    }

def start_session(sid, config):
    cmd = config.get("cmd", ["/bin/bash"])
    cwd = config.get("cwd", "/home/neo")

    # Create PTY
    master_fd, slave_fd = pty.openpty()
    
    # Start process
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        stdin=slave_fd,
        stdout=slave_fd,
        stderr=slave_fd,
        text=False,
        preexec_fn=os.setsid
    )

    # Close slave_fd in parent
    os.close(slave_fd)

    # Setup logging
    run_id = datetime.now().strftime("%Y%m%d-%H%M%S-") + "".join([os.urandom(4).hex() for _ in range(1)])
    log_dir = TOOLS_DIR / "bash" / "runs" / run_id
    log_dir.mkdir(parents=True, exist_ok=True)
    log_path = log_dir / "session.log"
    log_handle = open(log_path, "w")

    # Read thread
    def read_output():
        nonlocal master_fd
        try:
            while True:
                data = os.read(master_fd, 1024)
                if not data:
                    break
                
                # Log to file
                log_handle.write(data.decode(errors='replace'))
                log_handle.flush()
                
                # Emit to socket
                socketio.emit("terminal_output", {"data": data.decode(errors='replace')}, room=sid)
        except Exception as e:
            print(f"Read error: {e}")
        finally:
            socketio.emit("terminal_closed", {"reason": "read_end"}, room=sid)

    threading.Thread(target=read_output, daemon=True).start()

    with sessions_lock:
        sessions[sid] = {
            "master_fd": master_fd,
            "process": proc,
            "log_handle": log_handle,
            "log_path": str(log_path),
            "run_id": run_id,
        }

def cleanup_session(sid, emit_closed=True, reason="closed"):
    with sessions_lock:
        session = sessions.pop(sid, None)
    
    if session:
        try:
            os.close(session["master_fd"])
            session["process"].terminate()
            session["log_handle"].close()
        except Exception:
            pass
        
        if emit_closed:
            socketio.emit("terminal_closed", {"reason": reason}, room=sid)

def get_agent_status():
    with agent_lock:
        return dict(agent_state)

def start_managed_agent(payload):
    global agent_process
    with agent_lock:
        if agent_state["running"]:
            return

        model = payload.get("model", "gemma4:31b-cloud")
        cmd = payload.get("command", ["ollama", "serve"])
        cwd = payload.get("cwd", str(BASE_DIR))

        run_id = datetime.now().strftime("%Y%m%d-%H%M%S-") + "".join([os.urandom(4).hex() for _ in range(1)])
        log_dir = BASE_DIR / "logs" / "agent" / run_id
        log_dir.mkdir(parents=True, exist_ok=True)
        log_path = log_dir / "agent.log"

        log_file = open(log_path, "w")
        
        try:
            agent_process = subprocess.Popen(
                cmd,
                cwd=cwd,
                stdout=log_file,
                stderr=log_file,
                text=True,
                preexec_fn=os.setsid
            )
            
            agent_state.update({
                "enabled": True,
                "model": model,
                "command": cmd,
                "cwd": cwd,
                "running": True,
                "pid": agent_process.pid,
                "run_dir": str(log_dir),
                "log_path": str(log_path),
                "last_started_at": datetime.now().isoformat(),
            })
        except Exception as e:
            agent_state["last_error"] = str(e)
            raise e

def stop_managed_agent():
    global agent_process
    with agent_lock:
        if agent_process:
            try:
                os.killpg(os.getpgid(agent_process.pid), signal.SIGTERM)
            except Exception:
                pass
            agent_process = None
        
        agent_state.update({
            "running": False,
            "pid": None,
            "last_stopped_at": datetime.now().isoformat(),
        })

def run_heartbeat_check():
    with heartbeat_lock:
        if not heartbeat_state["enabled"]:
            return "DISABLED"
        
        model = heartbeat_state["model"]
        prompt = heartbeat_state["prompt"]
        
    try:
        start_time = time.time()
        result = ollama_generate(model=model, prompt=prompt, timeout=10)
        latency = int((time.time() - start_time) * 1000)
        
        with heartbeat_lock:
            heartbeat_state.update({
                "last_ok": datetime.now().isoformat(),
                "last_latency_ms": latency,
                "last_response_preview": result.get("response", "")[:50],
                "last_error": None,
            })
        return "OK"
    except Exception as e:
        with heartbeat_lock:
            heartbeat_state.update({
                "last_error": str(e),
                "last_checked_at": datetime.now().isoformat(),
            })
        return "ERROR"

def start_heartbeat(model=None, interval_seconds=None, prompt=None):
    global heartbeat_thread
    with heartbeat_lock:
        if model: heartbeat_state["model"] = model
        if interval_seconds: heartbeat_state["interval_seconds"] = interval_seconds
        if prompt: heartbeat_state["prompt"] = prompt
        heartbeat_state["enabled"] = True

    stop_event = threading.Event()
    
    def heartbeat_loop():
        while not stop_event.is_set():
            run_heartbeat_check()
            time.sleep(heartbeat_state["interval_seconds"])

    heartbeat_thread = threading.Thread(target=heartbeat_loop, daemon=True)
    heartbeat_thread.start()

def stop_heartbeat():
    global heartbeat_thread
    with heartbeat_lock:
        heartbeat_state["enabled"] = False
    if heartbeat_thread:
        # Note: we can't easily stop the thread without an event we have access to in the loop
        # For now, disabling the 'enabled' flag in the check is enough, 
        # but let's properly stop it.
        pass

def ollama_generate(model="llama3", prompt="Hello", timeout=30):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(url, json=payload, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise e

@app.route("/api/presets", methods=["GET"])
def list_presets():
    return jsonify({"status": "success", "data": load_presets()})

@app.route("/api/presets/launch", methods=["POST"])
def launch_preset():
    payload = request.json or {}
    preset_id = payload.get("preset_id")
    if not preset_id:
        return jsonify({"status": "error", "message": "Missing preset_id"}), 400
    
    try:
        presets = load_presets()
        preset = next((item for item in presets if item.get("id") == preset_id), None)
        if not preset:
            return jsonify({"status": "error", "message": "Preset not found"}), 404

        launch_payload = build_launch_payload(preset, payload.get("variables", {}))
        return jsonify({"status": "success", "data": launch_payload})
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500

@app.route("/api/heartbeat/status", methods=["GET"])
def heartbeat_status():
    with heartbeat_lock:
        data = dict(heartbeat_state)
    running = heartbeat_thread.is_alive() if heartbeat_thread else False
    data["running"] = bool(running and data.get("enabled"))
    return jsonify({"status": "success", "data": data})

@app.route("/api/heartbeat/start", methods=["POST"])
def heartbeat_start():
    payload = request.json or {}
    try:
        start_heartbeat(
            model=payload.get("model"),
            interval_seconds=payload.get("interval_seconds"),
            prompt=payload.get("prompt"),
        )
        result = run_heartbeat_check()
        with heartbeat_lock:
            data = dict(heartbeat_state)
        data["running"] = heartbeat_thread.is_alive() if heartbeat_thread else False
        return jsonify({"status": "success", "data": data, "check": result})
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

@app.route("/api/heartbeat/stop", methods=["POST"])
def heartbeat_stop():
    stop_heartbeat()
    with heartbeat_lock:
        data = dict(heartbeat_state)
    data["running"] = False
    return jsonify({"status": "success", "data": data})

@app.route("/api/heartbeat/ping", methods=["POST"])
def heartbeat_ping():
    result = run_heartbeat_check()
    with heartbeat_lock:
        data = dict(heartbeat_state)
    running = heartbeat_thread.is_alive() if heartbeat_thread else False
    data["running"] = bool(running and data.get("enabled"))
    return jsonify({"status": "success", "check": result, "data": data})

@app.route("/api/agent/status", methods=["GET"])
def agent_status():
    return jsonify({"status": "success", "data": get_agent_status()})

@app.route("/api/agent/start", methods=["POST"])
def agent_start():
    payload = request.json or {}
    try:
        start_managed_agent(payload)
        if payload.get("sync_heartbeat", True):
            start_heartbeat(
                model=payload.get("model"),
                interval_seconds=payload.get("heartbeat_interval_seconds", 60),
                prompt=payload.get("heartbeat_prompt", "Reply with exactly: HEARTBEAT_OK"),
            )
        return jsonify({"status": "success", "data": get_agent_status()})
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

@app.route("/api/agent/stop", methods=["POST"])
def agent_stop():
    stop_managed_agent()
    return jsonify({"status": "success", "data": get_agent_status()})

@app.route("/api/ai/models", methods=["GET"])
def list_ai_models():
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=10)
        response.raise_for_status()
        payload = response.json()
        models = [item.get("name") for item in payload.get("models", []) if item.get("name")]
        return jsonify({"status": "success", "data": models})
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc), "data": []}), 500

@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    data = request.json
    prompt = data.get("prompt")
    model = data.get("model", "llama3")
    try:
        result = ollama_generate(model=model, prompt=prompt, timeout=30)
        return jsonify({"status": "success", "response": result.get("response", "")})
    except Exception as exc:
        return (
            jsonify(
                {"status": "error", "message": f"Ollama connection failed: {str(exc)}"}
            ),
            500,
        )

# --- PLAYBOOK API ---

@app.route("/api/playbooks", methods=["GET"])
def list_playbooks():
    playbooks = []
    for pb_file in PLAYBOOKS_DIR.glob("*.json"):
        with open(pb_file, 'r') as f:
            playbooks.append(json.load(f))
    return jsonify({"status": "success", "data": playbooks})

@app.route("/api/playbooks/<pb_id>", methods=["GET"])
def get_playbook(pb_id):
    pb = load_playbook(pb_id)
    if not pb:
        return jsonify({"status": "error", "message": "Playbook not found"}), 404
    return jsonify({"status": "success", "data": pb})

@app.route("/api/playbooks/session", methods=["POST"])
def start_playbook_session():
    payload = request.json or {}
    sid = payload.get("sid")
    pb_id = payload.get("playbook_id")
    
    if not sid or not pb_id:
        return jsonify({"status": "error", "message": "Missing sid or playbook_id"}), 400
        
    pb = load_playbook(pb_id)
    if not pb:
        return jsonify({"status": "error", "message": "Playbook not found"}), 404
        
    with playbook_lock:
        playbook_sessions[sid] = {
            "sid": sid,
            "playbook_id": pb_id,
            "current_node": pb["initial_state"],
            "history": [],
            "transition_log": [],
            "findings": {},
            "started_at": datetime.now().isoformat()
        }
        
    return jsonify({"status": "success", "data": playbook_sessions[sid]})

@app.route("/api/playbooks/session", methods=["GET"])
def get_playbook_session():
    sid = request.args.get("sid")
    if not sid:
        return jsonify({"status": "error", "message": "Missing sid"}), 400
    
    with playbook_lock:
        session = playbook_sessions.get(sid)
        if not session:
            return jsonify({"status": "error", "message": "No active session"}), 404
        return jsonify({"status": "success", "data": session})

@app.route("/api/playbooks/transition", methods=["POST"])
def transition_playbook():
    payload = request.json or {}
    sid = payload.get("sid")
    condition = payload.get("condition")
    finding_note = (payload.get("finding_note") or "").strip()
    
    if not sid or not condition:
        return jsonify({"status": "error", "message": "Missing sid or condition"}), 400
        
    with playbook_lock:
        session = playbook_sessions.get(sid)
        if not session:
            return jsonify({"status": "error", "message": "No active session"}), 404
            
        pb = load_playbook(session["playbook_id"])
        current_node_id = session["current_node"]
        node = pb["nodes"].get(current_node_id)
        
        next_node_id = node["transitions"].get(condition)
        if not next_node_id:
            return jsonify({"status": "error", "message": "Invalid transition condition"}), 400
            
        session["history"].append(current_node_id)
        session["current_node"] = next_node_id
        session.setdefault("transition_log", []).append(
            {
                "from": current_node_id,
                "condition": condition,
                "to": next_node_id,
                "note": finding_note,
                "at": datetime.now().isoformat(),
            }
        )
        if finding_note:
            session.setdefault("findings", {}).setdefault(current_node_id, []).append(finding_note)
        
        return jsonify({"status": "success", "data": session})

@socketio.on("start_terminal")
def handle_start_terminal(data):
    sid = request.sid

    cleanup_session(sid, emit_closed=False)

    try:
        start_session(sid, data or {})
    except Exception as exc:
        socketio.emit("terminal_error", {"message": str(exc)}, room=sid)


@socketio.on("terminal_input")
def handle_terminal_input(data):
    sid = request.sid
    with sessions_lock:
        session = sessions.get(sid)

    if not session:
        return

    input_str = (data or {}).get("input", "")
    if not isinstance(input_str, str):
        return

    try:
        os.write(session["master_fd"], input_str.encode())
        log_handle = session.get("log_handle")
        if log_handle:
            sanitized = (
                input_str.replace("\r", "\r").replace("\n", "\n\n")
            )
            log_handle.write(f"[input] {sanitized}")
            log_handle.flush()
    except OSError:
        cleanup_session(sid, emit_closed=True, reason="write-failed")


@socketio.on("terminal_resize")
def handle_terminal_resize(data):
    sid = request.sid
    with sessions_lock:
        session = sessions.get(sid)

    if not session:
        return

    cols = int((data or {}).get("cols", 80))
    rows = int((data or {}).get("rows", 24))
    packed = struct.pack("HHHH", rows, cols, 0, 0)

    try:
        fcntl.ioctl(session["master_fd"], termios.TIOCSWINSZ, packed)
    except OSError:
        pass


@socketio.on("terminate_terminal")
def handle_terminate_terminal():
    cleanup_session(request.sid, emit_closed=True, reason="terminated")


@socketio.on("disconnect")
def handle_disconnect():
    cleanup_session(request.sid, emit_closed=False, reason="disconnected")


@app.route("/api/tools", methods=["GET"])
def list_tools():
    return jsonify({"status": "success", "data": build_tools_payload()})


if __name__ == "__main__":
    ensure_presets_file()
    socketio.run(app, port=5000, debug=True)
