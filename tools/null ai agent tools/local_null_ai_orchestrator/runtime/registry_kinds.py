"""Split the disk catalog into real tools vs design templates.

The local registry indexes every project folder. Most of those folders are
sites, courses, and client shells — not something Zoth should /run.
"""

from __future__ import annotations

from typing import Any

TEMPLATE_CATEGORIES = {
    "Client Services",
    "Portfolio & Agency",
    "Web Apps & SaaS",
    "Learning & Courses",
    "Games & Experiments",
    "Netlify & Creator Tools",
    "Creative & Media",
    "Crypto & Web3",
}

TOOL_CATEGORIES = {
    "Python Tools",
    "Automation & Tools",
    "Security Operations & OSINT",
    "Rust Projects",
    "Workspaces",
}

TOOL_HINTS = (
    "adytum",
    "alchemist",
    "osint",
    "hexstrike",
    "fuzzer",
    "scraper",
    "scanner",
    "convertor",
    "converter",
    "oletools",
    "payload",
    "subsweep",
    "envguard",
    "idlekey",
    "mrotp",
    "regexdroid",
    "quick-qr",
    "seo-trend",
    "sensor-gui",
    "crypto-tracker",
    "backup-drive",
    "privacy-toolbelt",
    "lead-scanner",
    "file-convert",
    "html-to-pdf",
    "powershell-tools",
    "ghostbox",
    "x-cleanup",
    "audiocipher",
)

# Vite-only apps that are still real tools (not a client site)
KEEP_VITE_TOOLS = (
    "adytum",
    "idlekey",
    "lead-scanner",
    "crypto-tracker",
    "envguard",
    "subsweep",
    "privacy-toolbelt",
    "regexdroid",
    "hexstrike",
    "backup-drive",
    "audiocipher",
)

FORCE_TEMPLATE = (
    "boilerplate",
    "boilertemplate",
    "30-days",
    "100-websites",
    "kids-hacker",
    "santa-claus",
    "complete-rust-programming",
    "badge3d",
    "certpath",
    "neon-icon",
    "cisa-grc",
    "pet-popup",
    "netlify-client-dev-portal",
    "netlify-cli-agent-runner",
    "study-portal",
)


def classify_entry(entry: dict[str, Any]) -> str:
    """Return 'tool' or 'template'."""
    eid = str(entry.get("id") or "")
    name = str(entry.get("name") or "")
    blob = f"{eid} {name}".lower()
    cat = str(entry.get("category") or "")
    runtimes = set(entry.get("runtimes") or [])
    if any(x.lower() in blob for x in FORCE_TEMPLATE):
        return "template"
    vite_only = runtimes <= {"frontend", "node", "vite", "astro"} and bool(runtimes)
    if vite_only and not any(h in blob for h in KEEP_VITE_TOOLS):
        return "template"
    if any(h in blob for h in TOOL_HINTS):
        return "tool"
    if cat in TOOL_CATEGORIES:
        return "tool"
    if runtimes <= {"python", "shell"} and "python" in runtimes:
        return "tool"
    if cat in TEMPLATE_CATEGORIES:
        return "template"
    return "template"


def annotate_registry(registry: dict[str, Any]) -> dict[str, Any]:
    tools = []
    n_tool = 0
    n_template = 0
    for raw in registry.get("tools") or []:
        item = dict(raw)
        kind = classify_entry(item)
        item["kind"] = kind
        if kind == "tool":
            n_tool += 1
        else:
            n_template += 1
        tools.append(item)
    out = dict(registry)
    out["tools"] = tools
    out["tool_count"] = n_tool
    out["template_count"] = n_template
    out["catalog_count"] = n_tool + n_template
    return out
