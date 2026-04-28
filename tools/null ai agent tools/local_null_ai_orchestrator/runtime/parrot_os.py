"""Parrot OS hardware and full tool detection for Null AI Framework.

Scans every executable in PATH, categorizes them, and provides
a comprehensive inventory for the Parrot Nexus dashboard.
"""

from __future__ import annotations

import os
import re
import subprocess
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


# ── Category mapping: binary name patterns → category ──

# ── Launch types ──
# on-demand: GUI or heavy tools (Maltego, Burp, OWASP ZAP) — available but NOT auto-launched
# cli: Command-line tools the user can invoke from the dashboard
# dev: Development runtimes always available
LAUNCH_TYPES: dict[str, str] = {
    "Information Gathering": "on-demand",
    "Vulnerability Analysis": "on-demand",
    "Web Application": "on-demand",
    "Password Attacks": "cli",
    "Wireless": "on-demand",
    "Exploitation": "on-demand",
    "Sniffing / Spoofing": "on-demand",
    "Post Exploitation": "cli",
    "Forensics": "on-demand",
    "Reverse Engineering": "on-demand",
    "Networking": "cli",
    "Development": "dev",
    "AI / Agents": "dev",
    "System Utilities": "cli",
}

TOOL_CATEGORIES: dict[str, list[str]] = {
    "Information Gathering": [
        "nmap", "masscan", "dnsrecon", "dnsenum", "dig", "whois", "fierce",
        "maltego", "spiderfoot", "recon-ng", "theharvester", "shodan",
        "censys", "amass", "subfinder", "httpx", "nuclei", "gobuster",
        "dirb", "dirbuster", "wpscan", "nikto", "whatweb", "wafw00f",
    ],
    "Vulnerability Analysis": [
        "nexfil", "vulscan", "openvas", "nessus", "lynis", "tiger",
        "chkrootkit", "rkhunter", "clamav", "sqlmap", "commix",
        "xsstrike", "sslyze", "testssl", "sslscan", "odat",
    ],
    "Web Application": [
        "burpsuite", "owasp-zap", "zap", "sqlmap", "xsser", "xsstrike",
        "w3af", "arachni", "skipfish", "watobo", "gtk-gnutella",
        "gobuster", "ffuf", "feroxbuster", "wfuzz", "dirsearch",
    ],
    "Password Attacks": [
        "hydra", "john", "hashcat", "medusa", "ncrack", "patator",
        "crunch", "cewl", "hashid", "pack", "kwprocessor", "phrasendrescher",
    ],
    "Wireless": [
        "aircrack-ng", "airodump-ng", "aireplay-ng", "airmon-ng", "kismet",
        "wifite", "reaver", "pixiewps", "bully", "fern-wifi-cracker",
        "pyrit", "cowpatty", "macchanger",
    ],
    "Exploitation": [
        "msfconsole", "msfvenom", "searchsploit", "exploitdb", "beef-xss",
        "setoolkit", "crackmapexec", "evil-winrm", "impacket", "responder",
        "mitm6", "ps1encode", "shellnoob", "terminator",
    ],
    "Sniffing / Spoofing": [
        "wireshark", "tshark", "tcpdump", "ettercap", "bettercap",
        "dsniff", "urlsnarf", "filesnarf", "arpspoof", "driftnet",
        "macchanger", "scapy", "mitmproxy", "charles",
    ],
    "Post Exploitation": [
        "mimikatz", "meterpreter", "powershell", "chisel", "ligolo",
        "socat", "ncat", "proxychains", "tor", "torspa",
        "sshuttle", "pivots", "pivotnacci",
    ],
    "Forensics": [
        "autopsy", "sleuthkit", "volatility", "binwalk", "foremost",
        "scalpel", "galleta", "p0f", "hashdeep", "dc3dd", "dd",
        "testdisk", "photorec", "extundelete",
    ],
    "Reverse Engineering": [
        "ghidra", "radare2", "r2", "objdump", "gdb", "strace", "ltrace",
        "readelf", "strings", "hexedit", "hexdump", "xxd", "binutils",
        "retdec", "cutter", "rizin", "rizinc",
    ],
    "Networking": [
        "curl", "wget", "nc", "ncat", "netcat", "socat", "ssh", "scp",
        "rsync", "ftp", "sftp", "telnet", "dns2tcp", "iodine",
        "nft", "iptables", "ip", "ifconfig", "bridge", "ethtool",
        "traceroute", "mtr", "ping", "arping", "ss", "iptraf",
    ],
    "Development": [
        "python3", "python", "pip3", "pip", "node", "npm", "npx", "yarn",
        "go", "rustc", "cargo", "gcc", "g++", "make", "cmake",
        "docker", "podman", "git", "gh", "code", "vim", "nano",
        "jq", "yq", "terraform", "ansible", "kubectl", "helm",
    ],
    "AI / Agents": [
        "ollama", "codex", "hermes", "openclaw", "aicommit",
        "torch", "tensorflow", "jupyter", "ipython",
    ],
}

TOOL_PROFILES: dict[str, dict[str, Any]] = {
    "nmap": {
        "description": "Network discovery and service enumeration for authorized assets.",
        "how_to": [
            "Start with a low-noise service/version scan against hosts you own or are approved to test.",
            "Use output files so results can be attached to a playbook or report.",
            "Follow with targeted scripts only after confirming scope and permission.",
        ],
        "examples": ["nmap -sV -oA scans/service-scan 192.168.1.10"],
        "playbooks": ["network-recon", "asset-inventory", "service-baseline"],
    },
    "masscan": {
        "description": "High-speed port discovery. Use carefully and rate-limit on local or approved networks.",
        "how_to": [
            "Set an explicit rate limit before scanning.",
            "Export discovered ports, then verify with nmap before reporting.",
        ],
        "examples": ["masscan 192.168.1.0/24 -p80,443 --rate 1000"],
        "playbooks": ["fast-port-sweep", "exposure-triage"],
    },
    "nikto": {
        "description": "Web server misconfiguration and known-issue scanner.",
        "how_to": [
            "Run against an owned URL after confirming the target hostname.",
            "Review findings manually before treating them as exploitable.",
        ],
        "examples": ["nikto -h https://example.test"],
        "playbooks": ["web-baseline", "misconfig-review"],
    },
    "whatweb": {
        "description": "Fingerprint web technologies, headers, plugins, and server hints.",
        "how_to": [
            "Fingerprint first, then choose targeted checks based on detected technology.",
        ],
        "examples": ["whatweb https://example.test"],
        "playbooks": ["web-fingerprint", "target-profile"],
    },
    "gobuster": {
        "description": "Directory, DNS, and virtual-host brute forcing with wordlists.",
        "how_to": [
            "Use small wordlists first to avoid noisy scans.",
            "Capture output and verify interesting paths manually.",
        ],
        "examples": ["gobuster dir -u https://example.test -w wordlists/common.txt"],
        "playbooks": ["content-discovery", "web-recon"],
    },
    "ffuf": {
        "description": "Fast web fuzzer for directories, parameters, and virtual hosts.",
        "how_to": [
            "Tune status-code filters and matchers before broad fuzzing.",
            "Keep scope tight and log output to a file.",
        ],
        "examples": ["ffuf -u https://example.test/FUZZ -w wordlists/common.txt"],
        "playbooks": ["content-discovery", "parameter-discovery"],
    },
    "sqlmap": {
        "description": "SQL injection validation tool for explicitly authorized testing.",
        "how_to": [
            "Start with detection-only settings and a single approved URL.",
            "Do not use destructive or data-dumping modes without explicit written approval.",
        ],
        "examples": ["sqlmap -u 'https://example.test/item?id=1' --batch --risk=1 --level=1"],
        "playbooks": ["injection-validation", "web-risk-triage"],
    },
    "hydra": {
        "description": "Credential audit tool for approved login surfaces.",
        "how_to": [
            "Use only against systems you own or have written permission to test.",
            "Throttle attempts and prefer test accounts.",
        ],
        "examples": ["hydra -L users.txt -P passwords.txt ssh://192.168.1.10"],
        "playbooks": ["credential-audit", "access-control-review"],
    },
    "john": {
        "description": "Offline password hash auditing.",
        "how_to": [
            "Work only with hashes collected under an approved assessment.",
            "Record rulesets and wordlists for repeatable reporting.",
        ],
        "examples": ["john --wordlist=wordlists/rockyou.txt hashes.txt"],
        "playbooks": ["password-policy-audit", "offline-hash-review"],
    },
    "hashcat": {
        "description": "GPU-capable offline password hash auditing.",
        "how_to": [
            "Confirm hash mode before running.",
            "Keep workload local and document attack mode, mask, and wordlist.",
        ],
        "examples": ["hashcat -m 1000 hashes.txt wordlists/rockyou.txt"],
        "playbooks": ["password-policy-audit", "hash-cracking-lab"],
    },
    "aircrack-ng": {
        "description": "Wireless audit toolkit for capture and key-strength testing.",
        "how_to": [
            "Use only on networks you own or are authorized to test.",
            "Capture, document channel/BSSID, and keep evidence organized.",
        ],
        "examples": ["aircrack-ng capture.cap -w wordlists/wifi.txt"],
        "playbooks": ["wifi-audit", "wireless-baseline"],
    },
    "wireshark": {
        "description": "Packet capture and protocol analysis GUI.",
        "how_to": [
            "Capture only traffic you are authorized to inspect.",
            "Use display filters to narrow analysis and export evidence snippets.",
        ],
        "examples": ["wireshark"],
        "playbooks": ["packet-analysis", "network-debug"],
    },
    "tcpdump": {
        "description": "Terminal packet capture for focused network evidence.",
        "how_to": [
            "Filter by host, port, or protocol to minimize captured data.",
            "Write pcap files for later review in Wireshark.",
        ],
        "examples": ["tcpdump -i any host 192.168.1.10 -w capture.pcap"],
        "playbooks": ["packet-capture", "network-debug"],
    },
    "burpsuite": {
        "description": "Interactive web application testing proxy.",
        "how_to": [
            "Configure the browser proxy and install the CA certificate only in a test profile.",
            "Keep interception scoped to approved targets.",
        ],
        "examples": ["burpsuite"],
        "playbooks": ["web-app-assessment", "manual-proxy-testing"],
    },
    "zap": {
        "description": "OWASP ZAP web application scanner and proxy.",
        "how_to": [
            "Start with passive scanning before active checks.",
            "Review target scope before spidering or active scanning.",
        ],
        "examples": ["zaproxy"],
        "playbooks": ["web-app-assessment", "passive-web-review"],
    },
    "msfconsole": {
        "description": "Metasploit console for approved exploit validation and lab work.",
        "how_to": [
            "Use in lab or written-scope engagements only.",
            "Prefer check/safe validation modules before exploit attempts.",
        ],
        "examples": ["msfconsole"],
        "playbooks": ["exploit-validation-lab", "module-research"],
    },
    "searchsploit": {
        "description": "Local Exploit-DB search utility for vulnerability research.",
        "how_to": [
            "Search by product/version, then read exploit notes before any use.",
            "Treat results as research leads, not proof of exploitability.",
        ],
        "examples": ["searchsploit apache 2.4"],
        "playbooks": ["vulnerability-research", "version-triage"],
    },
    "binwalk": {
        "description": "Firmware and binary blob analysis/extraction tool.",
        "how_to": [
            "Run signature analysis first, then extract to a controlled working folder.",
        ],
        "examples": ["binwalk firmware.bin"],
        "playbooks": ["firmware-triage", "binary-forensics"],
    },
    "ghidra": {
        "description": "Reverse engineering suite for binary analysis.",
        "how_to": [
            "Create a project per sample and document imports, hashes, and observations.",
        ],
        "examples": ["ghidraRun"],
        "playbooks": ["reverse-engineering", "malware-lab"],
    },
    "curl": {
        "description": "HTTP/API client for requests, headers, downloads, and health checks.",
        "how_to": [
            "Use verbose mode for debugging and output files for repeatable evidence.",
        ],
        "examples": ["curl -I https://example.test"],
        "playbooks": ["api-health-check", "http-debug"],
    },
    "ffmpeg": {
        "description": "Media conversion, compression, extraction, and packaging toolkit.",
        "how_to": [
            "Inspect inputs with ffprobe before conversion.",
            "Choose explicit codecs and output names to keep runs repeatable.",
        ],
        "examples": ["ffmpeg -i input.mov -c:v libx264 -crf 20 output.mp4"],
        "playbooks": ["media-conversion", "asset-optimization"],
    },
    "python3": {
        "description": "Python runtime. Use isolated venvs for project dependencies.",
        "how_to": [
            "Create a venv inside the tool/project before installing packages.",
            "Run scripts with the venv Python for reproducible behavior.",
        ],
        "examples": ["python3 -m venv .null_ai_venv"],
        "playbooks": ["python-tool-setup", "local-automation"],
    },
    "node": {
        "description": "JavaScript runtime for Vite, React, Astro, and build tooling.",
        "how_to": [
            "Pair with npm scripts and run production builds before shipping UI changes.",
        ],
        "examples": ["node --version"],
        "playbooks": ["frontend-build", "tooling-check"],
    },
    "npm": {
        "description": "Node package manager and script runner.",
        "how_to": [
            "Use package scripts first: build, lint, typecheck, test.",
        ],
        "examples": ["npm run build"],
        "playbooks": ["frontend-validation", "dependency-check"],
    },
    "podman": {
        "description": "Rootless container runtime for preview hosts and isolated services.",
        "how_to": [
            "Apply CPU and memory caps for long-running local preview services.",
        ],
        "examples": ["podman ps"],
        "playbooks": ["preview-container", "local-service-isolation"],
    },
    "git": {
        "description": "Version control for local changes, diffs, and history.",
        "how_to": [
            "Inspect status and diff before committing or handing off changes.",
        ],
        "examples": ["git status --short"],
        "playbooks": ["handoff-review", "change-audit"],
    },
    "codex": {
        "description": "Local Codex agent CLI for project-scoped implementation work.",
        "how_to": [
            "Run inside the intended project folder with explicit instructions.",
            "Keep generated work scoped to the target directory.",
        ],
        "examples": ["codex exec -C ./projects/example 'Build the requested site'"],
        "playbooks": ["agent-build", "zoth-studio-project"],
    },
    "ollama": {
        "description": "Local model runtime for offline AI workflows.",
        "how_to": [
            "Confirm a model is pulled and the service is running before assigning local AI work.",
        ],
        "examples": ["ollama list"],
        "playbooks": ["local-ai-check", "offline-agent"],
    },
}

# Build reverse lookup: binary → category
_BIN_TO_CATEGORY: dict[str, str] = {}
for cat, bins in TOOL_CATEGORIES.items():
    for b in bins:
        _BIN_TO_CATEGORY[b] = cat

_TOOLS_CACHE: dict[str, Any] = {"at": 0.0, "data": None}
_TOOLS_CACHE_TTL = 120


# ── Tools that are GUI-only and cannot run in a terminal workspace ──
# These show up in the dashboard as "available" but should be on-demand only,
# never auto-launched or probed for version info.
_GUI_ONLY_TOOLS: set[str] = {
    "ghidra", "dirbuster", "burpsuite", "zaproxy", "owasp-zap",
    "wireshark", "maltego", "autopsy", "fern-wifi-cracker",
    "arachni", "skipfish", "w3af", "watobo", "cutter", "zenmap",
    "dbbrowser-sqlite", "etherape",
}


def _scan_system_binaries() -> list[dict[str, Any]]:
    """Scan all executables in PATH and return structured tool list.
    System Utilities are excluded to keep the payload manageable —
    they are still counted in the total but not sent to the frontend.
    """
    tools = []
    seen = set()
    path_dirs = os.environ.get("PATH", "").split(":")

    for dir_path in path_dirs:
        dir_path = dir_path.strip()
        if not dir_path or not Path(dir_path).is_dir():
            continue
        try:
            for entry in Path(dir_path).iterdir():
                if not entry.is_file():
                    continue
                name = entry.name
                if name in seen:
                    continue
                if not os.access(entry, os.X_OK):
                    continue
                seen.add(name)
                category = _BIN_TO_CATEGORY.get(name, "System Utilities")
                # Skip System Utilities — too many (3000+), not useful in dashboard
                if category == "System Utilities":
                    continue
                launch_type = LAUNCH_TYPES.get(category, "cli")
                # Mark GUI-only tools so the frontend can handle them differently
                if name in _GUI_ONLY_TOOLS:
                    launch_type = "on-demand"
                profile = TOOL_PROFILES.get(name, {})
                command = profile.get("command") or name
                tools.append({
                    "name": name,
                    "command": command,
                    "path": str(entry),
                    "category": category,
                    "launch_type": launch_type,
                    "installed": True,
                    "description": profile.get("description") or _default_description(name, category),
                    "how_to": profile.get("how_to") or _default_how_to(name, category, launch_type),
                    "examples": profile.get("examples") or [command],
                    "playbooks": profile.get("playbooks") or _default_playbooks(category, launch_type),
                })
        except PermissionError:
            continue

    return sorted(tools, key=lambda t: (t["category"], t["name"]))


def _default_description(name: str, category: str) -> str:
    if category == "System Utilities":
        return f"Installed Parrot OS command available on this machine: {name}."
    return f"Installed {category.lower()} tool available on this Parrot OS machine."


def _default_how_to(name: str, category: str, launch_type: str) -> list[str]:
    if launch_type == "on-demand":
        return [
            "Launch only when needed from the dashboard, menu, or terminal.",
            "Confirm target scope before using active scanning or testing features.",
        ]
    if category == "Development":
        return [
            "Use the command in a project-specific folder.",
            "Prefer existing package scripts, venvs, and local config before global changes.",
        ]
    return [
        "Run the command with --help first to confirm options.",
        "Save output to a reports or runs folder when it supports file output.",
    ]


def _default_playbooks(category: str, launch_type: str) -> list[str]:
    if category == "System Utilities":
        return ["system-check", "operator-shell"]
    if launch_type == "on-demand":
        return ["authorized-assessment", "manual-review"]
    return ["cli-triage", category.lower().replace(" / ", "-").replace(" ", "-")]

# ── GUI / daemon tools that launch an app instead of printing a version ──
# Running `--version` on these spawns a GUI window or background daemon.
_SKIP_VERSION_TOOLS: set[str] = {
    # Security GUI apps — spawn windows, Java GUIs, or hang on --version
    "zaproxy", "owasp-zap", "zap", "burpsuite", "burp", "maltego",
    "wireshark", "etherape", "knockpy-gui", "openvas",
    "ghidra", "dirbuster", "autopsy", "fern-wifi-cracker",
    "arachni", "skipfish", "w3af", "watobo", "cutter",
    "zenmap", "knockpy", "dbbrowser-sqlite",
    # Desktop / heavy apps — GUI that blocks or spawns windows
    "firefox", "chromium", "google-chrome", "code", "codium",
    "gedit", "nano", "vim", "gvim", "emacs",
    "libreoffice", "gimp", "inkscape", "vlc", "eog", "nautilus",
    # Daemons that background on version check
    "docker", "apache2", "nginx", "mysql", "postgres",
    "ollama", "mongod", "redis-server", "named", "dhcpd",
}

_SKIP_VERSION_PREFIXES: tuple[str, ...] = (
    # Parrot OS menu launchers always open a GUI
    "parrot-", "pentest-", "menu-",
    # X11/GTK/Qt GUI launchers
    "xfce4-", "gnome-", "mate-", "lxde-", "gtk3-", "qt5-", "qt6-",
)


def _get_version(name: str, path: str) -> str:
    """Try to get a version string for a tool."""
    # Never probe tools that spawn GUIs or daemons on --version
    lower = name.lower()
    if lower in _SKIP_VERSION_TOOLS:
        return ""
    if any(lower.startswith(p) for p in _SKIP_VERSION_PREFIXES):
        return ""
    for flag in ["--version", "-V", "-v", "version"]:
        try:
            result = subprocess.run(
                [path, flag], capture_output=True, text=True,
                check=False, timeout=3
            )
            output = (result.stdout or result.stderr or "").strip()
            if output and result.returncode in (0, 1):
                first_line = output.split("\n")[0][:120]
                return first_line
        except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
            continue
    return ""


# ── Hardware detection ──

@dataclass
class ParrotOSHardware:
    cpu_model: str = ""
    cpu_cores: int = 0
    ram_total_gb: float = 0.0
    disk_total_gb: float = 0.0
    disk_free_gb: float = 0.0
    gpu_info: list[str] = field(default_factory=list)


def detect_hardware() -> ParrotOSHardware:
    hw = ParrotOSHardware()
    try:
        with open("/proc/cpuinfo") as f:
            text = f.read()
        model_match = re.search(r"model name\s+:\s+(.+)", text)
        if model_match:
            hw.cpu_model = model_match.group(1).strip()
        hw.cpu_cores = text.count("processor\t:")
    except OSError:
        pass
    try:
        with open("/proc/meminfo") as f:
            text = f.read()
        match = re.search(r"MemTotal:\s+(\d+)", text)
        if match:
            hw.ram_total_gb = round(int(match.group(1)) / 1024 / 1024, 1)
    except OSError:
        pass
    try:
        st = os.statvfs("/")
        hw.disk_total_gb = round(st.f_frsize * st.f_blocks / (1024**3), 1)
        hw.disk_free_gb = round(st.f_frsize * st.f_bfree / (1024**3), 1)
    except OSError:
        pass
    try:
        result = subprocess.run(["lspci"], capture_output=True, text=True, check=False, timeout=5)
        for line in result.stdout.splitlines():
            if any(kw in line.lower() for kw in ["vga", "3d", "display", "gpu"]):
                hw.gpu_info.append(line.strip())
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    return hw


def get_os_release() -> dict[str, str]:
    info = {}
    try:
        with open("/etc/os-release") as f:
            for line in f:
                line = line.strip()
                if "=" in line:
                    k, v = line.split("=", 1)
                    info[k] = v.strip('"')
    except OSError:
        pass
    return info


def scan_all_tools() -> dict[str, Any]:
    """Full system scan — every executable in PATH, categorized."""
    now = time.time()
    if _TOOLS_CACHE["data"] is not None and now - _TOOLS_CACHE["at"] < _TOOLS_CACHE_TTL:
        return _TOOLS_CACHE["data"]
    tools = _scan_system_binaries()
    categories = {}
    for t in tools:
        cat = t["category"]
        categories[cat] = categories.get(cat, 0) + 1

    # Get versions for non-GUI, non-system tools only
    key_tools = [t for t in tools if t["launch_type"] != "on-demand" or t["name"] not in _GUI_ONLY_TOOLS]
    for t in key_tools[:150]:
        t["version"] = _get_version(t["name"], t["path"])

    result = {
        "total": len(tools),
        "tools": tools,
        "categories": categories,
        "category_count": len(categories),
        "source": "PATH",
        "available_only": True,
        "generated_at": datetime_like_iso(),
    }
    _TOOLS_CACHE["at"] = now
    _TOOLS_CACHE["data"] = result
    return result


def datetime_like_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def system_report() -> dict[str, Any]:
    hw = detect_hardware()
    os_release = get_os_release()
    all_tools = scan_all_tools()

    key_tools_found = {}
    for t in all_tools["tools"]:
        if t["category"] != "System Utilities" and t.get("version"):
            key_tools_found[t["name"]] = t["version"]

    return {
        "os": {
            "name": os_release.get("PRETTY_NAME", "unknown"),
            "version": os_release.get("VERSION_ID", ""),
            "codename": os_release.get("VERSION_CODENAME", ""),
            "kernel": os.uname().release if hasattr(os, "uname") else "",
        },
        "hardware": {
            "cpu_model": hw.cpu_model,
            "cpu_cores": hw.cpu_cores,
            "cpu": hw.cpu_model,
            "memory_total_gb": hw.ram_total_gb,
            "memory_total": hw.ram_total_gb * 1073741824 if hw.ram_total_gb else None,
            "disk_total_gb": hw.disk_total_gb,
            "disk_total": hw.disk_total_gb,
            "disk_free_gb": hw.disk_free_gb,
            "disk_free": hw.disk_free_gb,
            "gpu": hw.gpu_info,
        },
        "desktop": os.environ.get("XDG_CURRENT_DESKTOP") or os.environ.get("DESKTOP_SESSION"),
        "shell": os.environ.get("SHELL"),
        "tools": key_tools_found,
        "tools_available": sum(1 for v in key_tools_found.values() if v),
        "tools_total": len(key_tools_found),
        "all_tools_count": all_tools["total"],
        "all_tools_categories": all_tools["categories"],
    }


# ── Legacy compat ──

def detect_installed_tools() -> dict:
    report = system_report()
    return report.get("tools", {})

def format_report(system_info=None, agent_backends=None) -> str:
    info = system_info or system_report()
    hw = info.get("hardware", {})
    os_info = info.get("os", {})
    tools = info.get("tools", {})
    lines = [
        f"OS: {os_info.get('name', 'unknown')}",
        f"CPU: {hw.get('cpu_model', 'unknown')} ({hw.get('cpu_cores', 0)} cores)",
        f"RAM: {hw.get('memory_total_gb', 0)} GB",
        f"Disk: {hw.get('disk_free_gb', 0)} GB free",
        f"Security tools: {info.get('tools_available', 0)}/{info.get('tools_total', 0)}",
        f"Total system tools: {info.get('all_tools_count', 0)}",
    ]
    for name, ver in sorted(tools.items()):
        if ver:
            lines.append(f"  {name}: {ver[:80]}")
    return "\n".join(lines)


__all__ = [
    "ParrotOSHardware",
    "detect_hardware",
    "detect_installed_tools",
    "get_os_release",
    "system_report",
    "scan_all_tools",
    "format_report",
]
