"""
⚡ ZOTH STUDIO — Mounted Drive Projects Vault & Template Importer
=============================================================================
Scans, indexes, and surfaces all 250+ websites, web apps, SaaS portals,
and client systems across the mounted external hard drive. Allows 1-click
importing of any existing project as an editable JSON template for the Website Builder.
=============================================================================
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, Any, List, Optional

MOUNT_ROOT = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908")

CATEGORY_MAP = {
    "00-workspaces": "Agent Workspaces",
    "01-clients-services": "Client Websites & Local Services",
    "02-netlify-ax-creator": "Netlify AX Production Generators",
    "03-ai-agents-llm": "AI Platforms & Agent Systems",
    "04-web-apps-saas": "SaaS & Web Applications",
    "05-portfolio-agency": "Portfolios & Agency Showcases",
    "06-learning-courses": "Learning Portals & Academies",
    "07-security-osint": "Security, OSINT & Recon Suites",
    "08-crypto-web3": "Web3 & Decentralized dApps",
    "09-games-experiments": "Games & Interactive Canvas",
    "10-python-tools": "Python & Streamlit Systems",
    "11-tools-scripts": "Utilities, CLI & Generators",
    "12-rust": "Rust Systems & Core Daemons",
    "13-creative-media": "Creative Media & Interactive Tools"
}

def scan_all_drive_projects() -> Dict[str, Any]:
    """Scan and index all projects across the mounted drive."""
    projects: List[Dict[str, Any]] = []
    category_counts: Dict[str, int] = {k: 0 for k in CATEGORY_MAP.keys()}

    if not MOUNT_ROOT.exists():
        return {"total": 0, "categories": {}, "projects": []}

    for cat_dir in sorted(MOUNT_ROOT.iterdir()):
        if not cat_dir.is_dir() or cat_dir.name not in CATEGORY_MAP:
            continue

        cat_key = cat_dir.name
        cat_title = CATEGORY_MAP.get(cat_key, cat_key)

        for proj_dir in sorted(cat_dir.iterdir()):
            if not proj_dir.is_dir() or proj_dir.name.startswith("."):
                continue

            # Detect project characteristics
            has_pkg = (proj_dir / "package.json").exists()
            has_html = (proj_dir / "index.html").exists() or (proj_dir / "public" / "index.html").exists() or (proj_dir / "dist" / "index.html").exists()
            has_astro = (proj_dir / "astro.config.mjs").exists() or (proj_dir / "astro.config.ts").exists() or (proj_dir / "src" / "pages").exists()
            has_python = any(proj_dir.glob("*.py"))
            has_readme = (proj_dir / "README.md").exists()

            # Framework categorization
            framework = "Vanilla Web"
            if has_astro:
                framework = "Astro Modern"
            elif has_pkg:
                try:
                    pkg_data = json.loads((proj_dir / "package.json").read_text(encoding="utf-8"))
                    deps = {**pkg_data.get("dependencies", {}), **pkg_data.get("devDependencies", {})}
                    if "next" in deps:
                        framework = "Next.js"
                    elif "react" in deps:
                        framework = "React"
                    elif "vue" in deps:
                        framework = "Vue"
                    elif "svelte" in deps:
                        framework = "Svelte"
                    else:
                        framework = "Node.js Web"
                except Exception:
                    framework = "Node.js"
            elif has_python:
                framework = "Python / Streamlit"

            # Extract summary / description
            description = ""
            if has_pkg:
                try:
                    pkg_data = json.loads((proj_dir / "package.json").read_text(encoding="utf-8"))
                    description = pkg_data.get("description", "")
                except Exception:
                    pass
            
            if not description and has_readme:
                try:
                    lines = (proj_dir / "README.md").read_text(encoding="utf-8").split("\n")
                    for l in lines:
                        l = l.strip()
                        if l and not l.startswith("#") and len(l) > 10:
                            description = l[:160]
                            break
                except Exception:
                    pass

            if not description:
                description = f"Autonomous {cat_title} project built with {framework}."

            entrypoint = None
            if (proj_dir / "index.html").exists():
                entrypoint = "index.html"
            elif (proj_dir / "public" / "index.html").exists():
                entrypoint = "public/index.html"
            elif (proj_dir / "dist" / "index.html").exists():
                entrypoint = "dist/index.html"

            # Project Record
            p_rec = {
                "id": proj_dir.name,
                "name": proj_dir.name.replace("-", " ").title(),
                "category_id": cat_key,
                "category_name": cat_title,
                "path": str(proj_dir),
                "relative_path": f"{cat_key}/{proj_dir.name}",
                "framework": framework,
                "has_preview": has_html,
                "entrypoint": entrypoint,
                "has_python": has_python,
                "has_package": has_pkg,
                "description": description
            }

            projects.append(p_rec)
            category_counts[cat_key] = category_counts.get(cat_key, 0) + 1

    return {
        "total": len(projects),
        "categories": {k: {"title": CATEGORY_MAP[k], "count": category_counts.get(k, 0)} for k in CATEGORY_MAP},
        "projects": projects
    }

def convert_project_to_template_blueprint(project_path: str) -> Dict[str, Any]:
    """
    Reads an existing project from the hard drive and converts it into an editable
    JSON Template Blueprint for the Zoth Website Builder.
    """
    p = Path(project_path)
    if not p.exists() or not p.is_dir():
        return {"status": "error", "message": f"Path not found: {project_path}"}

    name = p.name.replace("-", " ").title()
    description = ""
    keywords = [p.name, "zoth-studio", "web-app"]

    # 1. Inspect package.json
    if (p / "package.json").exists():
        try:
            pkg = json.loads((p / "package.json").read_text(encoding="utf-8"))
            name = pkg.get("name", name).replace("-", " ").title()
            description = pkg.get("description", "")
            if "keywords" in pkg and isinstance(pkg["keywords"], list):
                keywords.extend(pkg["keywords"])
        except Exception:
            pass

    # 2. Inspect site.json / theme.json if present
    theme_variant = "obsidian-gold"
    if (p / "src" / "configs" / "site.json").exists():
        try:
            sjson = json.loads((p / "src" / "configs" / "site.json").read_text(encoding="utf-8"))
            name = sjson.get("brandName", name)
            theme_variant = sjson.get("themeVariant", theme_variant)
            if "defaultSeo" in sjson:
                description = sjson["defaultSeo"].get("description", description)
                keywords.extend(sjson["defaultSeo"].get("keywords", []))
        except Exception:
            pass

    # 3. Create Clean Blueprint
    blueprint = {
        "brandName": name,
        "tagline": f"Production {name} System",
        "kicker": "Mounted Drive Blueprint",
        "heroHeadline": f"Next-Generation {name}",
        "heroSubheadline": description or f"Autonomous application scaffolded from {p.name}.",
        "sourcePath": str(p),
        "themeVariant": theme_variant,
        "primaryColor": "#00f0ff",
        "navLinks": [
            {"label": "Overview", "href": "#features"},
            {"label": "Interactive Sandbox", "href": "#sandbox"},
            {"label": "Pricing", "href": "#pricing"},
            {"label": "Docs", "href": "/docs/"}
        ],
        "features": [
            {"icon": "⚡", "title": "High Performance", "desc": "Optimized responsive layout with zero blocking resources."},
            {"icon": "🛡️", "title": "Security Hardened", "desc": "OWASP top 10 compliant with strict Content Security Policies."},
            {"icon": "🤖", "title": "AEO Optimized", "desc": "Schema.org JSON-LD graph and llms.txt Answer Engine discovery."}
        ],
        "pricing": [
            {"tier": "Starter", "price": "$0", "period": "/mo", "badge": "Free", "features": ["Full Source Code", "Local Loopback Runner", "Community Support"]},
            {"tier": "Pro", "price": "$29", "period": "/mo", "badge": "Popular", "featured": True, "features": ["Multi-Agent Swarm", "Netlify 1-Click Deploy", "Custom Domain"]},
            {"tier": "Enterprise", "price": "Custom", "period": "", "badge": "Scale", "features": ["Dedicated Infrastructure", "24/7 SLA", "Custom LoRA Tuning"]}
        ],
        "faqs": [
            {"q": f"How is {name} deployed?", "a": "Export as standalone static bundle or deploy directly with 1-click Netlify."},
            {"q": "Can I edit the code directly?", "a": "Yes! All HTML5, CSS, and JavaScript files are completely unbundled and editable."}
        ]
    }

    return {
        "status": "ok",
        "templateId": "custom-drive-import",
        "blueprint": blueprint
    }
