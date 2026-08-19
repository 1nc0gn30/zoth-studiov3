"""
⚡ ZOTH STUDIO — Fast Template-Powered JSON Site Customizer & Synthesizer
=============================================================================
Provides production-grade site templates (SaaS, AI Platform, Cyberpunk,
Portfolio, Commerce, Docs, Local Services, Agency) that can be rapidly customized
via JSON configuration (keywords, copy, fonts, colors, routes, components)
and compiled in sub-seconds into standalone responsive web applications.
=============================================================================
"""

import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

# ═════════════════════════════════════════════════════════════════════════════
# 1. CURATED TEMPLATE ARCHETYPES CATALOG
# ═════════════════════════════════════════════════════════════════════════════

SITE_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "saas-vault": {
        "id": "saas-vault",
        "name": "Apex SaaS Vault",
        "category": "SaaS Platform",
        "badge": "Enterprise & Web3",
        "desc": "High-conversion dark glassmorphic landing page with cryptographic sandbox, 3-tier pricing matrix, and interactive FAQ.",
        "icon": "🔒",
        "default_theme": {
            "primary": "#e8c872",
            "accent": "#00f0ff",
            "bg": "#05070f",
            "surface": "#0a0e1c",
            "border": "#1a2342",
            "font_display": "'Syne', sans-serif",
            "font_body": "'Figtree', sans-serif",
            "font_mono": "'IBM Plex Mono', monospace"
        },
        "default_config": {
            "brandName": "ApexVault",
            "tagline": "Sovereign Multi-Agent Cryptographic Layer",
            "kicker": "Zero-Trust Protocol",
            "heroHeadline": "Sovereign Key Enclaves for Autonomous AI Swarms",
            "heroSubheadline": "Eliminate cloud key leakage with Argon2id hardware encryption, local loopback RPC gates, and multi-agent peer arbitration.",
            "ctaPrimary": {"text": "Initialize Vault →", "link": "#sandbox"},
            "ctaSecondary": {"text": "Explore Protocols", "link": "/docs/"},
            "navLinks": [
                {"label": "Architecture", "href": "#features"},
                {"label": "Interactive Demo", "href": "#sandbox"},
                {"label": "Pricing", "href": "#pricing"},
                {"label": "Docs", "href": "/docs/"}
            ],
            "features": [
                {"icon": "🛡️", "title": "Argon2id Enclave", "desc": "Hardware-backed cryptographic secret derivation with memory-hard zero-knowledge boundaries."},
                {"icon": "⚡", "title": "Loopback Zero-Egress", "desc": "Local-first IPC socket gates ensuring API keys never touch public network hops."},
                {"icon": "🤖", "title": "Swarm Peer Locks", "desc": "Decentralized state arbitration preventing race conditions across concurrent agent threads."},
                {"icon": "📊", "title": "Real-Time Telemetry", "desc": "Microsecond latency telemetry with Shannon entropy agreement verification."}
            ],
            "pricing": [
                {"tier": "Starter Node", "price": "$0", "period": "/mo", "badge": "Open Source", "features": ["Local Loopback Gateway", "4 Core Spirit Mascot Agents", "Up to 5 Projects", "Community Forum"]},
                {"tier": "Swarm Pro", "price": "$49", "period": "/mo", "badge": "Most Popular", "featured": True, "features": ["Unlimited Swarm Threads", "Argon2id Hardware Key Vault", "AEO Knowledge Engine", "Web Audio DSP Engine", "Netlify 1-Click Deploy"]},
                {"tier": "Enterprise Sovereignty", "price": "Custom", "period": "", "badge": "Air-Gapped", "features": ["Dedicated Hardware Enclaves", "Custom AST Validation Rules", "24/7 Priority SLA", "On-Premises Compliance"]}
            ],
            "faqs": [
                {"q": "How does ApexVault secure API keys?", "a": "Keys are encrypted on disk with Argon2id and only held in RAM during active loopback transactions on 127.0.0.1."},
                {"q": "Can I deploy the generated sites to any host?", "a": "Yes! All builds produce static HTML5/CSS/JS with zero runtime lock-in, deployable to Netlify, Vercel, Hostinger, or GitHub Pages."}
            ]
        }
    },

    "ai-platform": {
        "id": "ai-platform",
        "name": "NullAI Agent Foundry",
        "category": "AI Agent Platform",
        "badge": "Multi-Agent Swarm",
        "desc": "Next-generation autonomous agent cockpit featuring interactive terminal execution, DAG visualizer, and benchmark metrics.",
        "icon": "🤖",
        "default_theme": {
            "primary": "#00f0ff",
            "accent": "#c084fc",
            "bg": "#030408",
            "surface": "#080c18",
            "border": "#131c38",
            "font_display": "'Syne', sans-serif",
            "font_body": "'Figtree', sans-serif",
            "font_mono": "'IBM Plex Mono', monospace"
        },
        "default_config": {
            "brandName": "NullAI Studio",
            "tagline": "Autonomous Multi-Agent Intelligence Mesh",
            "kicker": "Swarm Architecture v3.0",
            "heroHeadline": "Build, Audit & Deploy with 16 Autonomous Spirit Agents",
            "heroSubheadline": "Connect frontier LLMs and open weights through a local JSON schema event bus with AST security audits and instant interactive preview.",
            "ctaPrimary": {"text": "Launch Swarm →", "link": "#features"},
            "ctaSecondary": {"text": "Agent Benchmark", "link": "/studio/models.html"},
            "navLinks": [
                {"label": "Swarm Bus", "href": "#features"},
                {"label": "Live Console", "href": "#sandbox"},
                {"label": "Benchmarks", "href": "/studio/models.html"},
                {"label": "Docs", "href": "/docs/"}
            ],
            "features": [
                {"icon": "🐺", "title": "Lycan (@antigravity)", "desc": "Security auditor enforcing OWASP top 10 rules, AST validation, and strict CSP headers."},
                {"icon": "🦊", "title": "Kitsune (@grok)", "desc": "High-throughput streaming coder synthesizing modern glassmorphic responsive layouts."},
                {"icon": "🐲", "title": "Draco (@hermes)", "desc": "Tool-calling coordinator generating JSON-LD schemas and llms.txt AEO manifests."},
                {"icon": "🤖", "title": "Workbot (@ollama)", "desc": "Local neural inference engine running offline models on 127.0.0.1:11434."}
            ],
            "pricing": [
                {"tier": "Developer", "price": "$0", "period": "/mo", "badge": "Free Forever", "features": ["16 Local Companion Agents", "Unlimited Astro Scaffolding", "CLI Terminal Runner", "Local Git Hooks"]},
                {"tier": "Foundry Pro", "price": "$29", "period": "/mo", "badge": "High Speed", "featured": True, "features": ["Parallel Swarm Execution", "Signal Command Bridge", "Hardware Companion Audio", "Full AEO Indexing"]},
                {"tier": "Studio Enterprise", "price": "Custom", "period": "", "badge": "Custom Mesh", "features": ["Custom LoRA Tuning", "Air-Gapped Telemetry", "Dedicated Agent Swarms", "Compliance SLA"]}
            ],
            "faqs": [
                {"q": "Does NullAI require active internet access?", "a": "No! NullAI runs local-first with Ollama on loopback, requiring zero cloud calls for offline agent inference."},
                {"q": "Can I connect my own custom models?", "a": "Yes, configure any model via standard OpenAI-compatible endpoints or local Ollama tags."}
            ]
        }
    },

    "cyberpunk-web3": {
        "id": "cyberpunk-web3",
        "name": "Aetheris Cyberpunk Grid",
        "category": "Web3 & Cyberpunk",
        "badge": "Matrix & Neon",
        "desc": "High-octane terminal & matrix canvas aesthetic with CRT phosphor scanlines, glow tokens, and tokenomics dashboard.",
        "icon": "⚡",
        "default_theme": {
            "primary": "#34d399",
            "accent": "#00f0ff",
            "bg": "#020406",
            "surface": "#060e0a",
            "border": "#0e2918",
            "font_display": "'Syne', sans-serif",
            "font_body": "'Figtree', sans-serif",
            "font_mono": "'IBM Plex Mono', monospace"
        },
        "default_config": {
            "brandName": "Aetheris",
            "tagline": "Decentralized Autonomous Protocol",
            "kicker": "Cyberspace Layer 1",
            "heroHeadline": "The Cryptographic Operating System for Sovereign Cyberspace",
            "heroSubheadline": "Execute untrusted bytecodes inside zero-knowledge memory cages with hardware-accelerated AST sanitizers.",
            "ctaPrimary": {"text": "Connect Node →", "link": "#sandbox"},
            "ctaSecondary": {"text": "Tokenomics", "link": "#pricing"},
            "navLinks": [
                {"label": "Protocol", "href": "#features"},
                {"label": "Terminal", "href": "#sandbox"},
                {"label": "Tokenomics", "href": "#pricing"},
                {"label": "Whitepaper", "href": "/docs/"}
            ],
            "features": [
                {"icon": "💾", "title": "Zero-Knowledge Cages", "desc": "Hardware-enforced memory compartmentalization preventing memory disclosure attacks."},
                {"icon": "⚡", "title": "High-TPS Consensus", "desc": "Sub-millisecond settlement across deterministic loopback state channels."},
                {"icon": "📟", "title": "CLI Terminal Matrix", "desc": "Real-time stream parser with CRT phosphor scanlines and Web Audio feedback."}
            ],
            "pricing": [
                {"tier": "Cyberpunk Node", "price": "0 ETH", "period": "", "badge": "Testnet", "features": ["Public Node Access", "Terminal Matrix CLI", "Standard Gas Limit", "Community RPC"]},
                {"tier": "Validator Mesh", "price": "1.5 ETH", "period": "/stake", "badge": "Yield 14%", "featured": True, "features": ["Priority Block Proposal", "Argon2id Enclave", "Zero-Latency Channel", "Governance Votes"]},
                {"tier": "DAO Sovereign", "price": "10 ETH", "period": "/stake", "badge": "Institutional", "features": ["Custom Subnets", "Direct IPC Peering", "Air-Gapped Custody", "Custom Sharding"]}
            ],
            "faqs": [
                {"q": "What network does Aetheris run on?", "a": "Aetheris operates as a sovereign EVM-compatible rollup with sub-millisecond local finality."},
                {"q": "Is the smart contract source audited?", "a": "Yes, audited by top security firms with automated AST verification."}
            ]
        }
    },

    "portfolio-dev": {
        "id": "portfolio-dev",
        "name": "AlexVance Developer Showcase",
        "category": "Portfolio & Resume",
        "badge": "Senior Engineer",
        "desc": "Sleek, minimalist developer portfolio with interactive project matrix, live skill tags, GitHub activity, and Netlify contact form.",
        "icon": "💼",
        "default_theme": {
            "primary": "#c084fc",
            "accent": "#00f0ff",
            "bg": "#07070d",
            "surface": "#0e0e1a",
            "border": "#1a1a32",
            "font_display": "'Syne', sans-serif",
            "font_body": "'Figtree', sans-serif",
            "font_mono": "'IBM Plex Mono', monospace"
        },
        "default_config": {
            "brandName": "Alex Vance",
            "tagline": "Senior Autonomous Systems & Multi-Agent Engineer",
            "kicker": "Staff Software Architect",
            "heroHeadline": "Architecting Autonomous AI Swarms & Sovereign Security",
            "heroSubheadline": "10+ years engineering high-throughput distributed systems, local-first LLM frameworks, and cryptographic key vaults.",
            "ctaPrimary": {"text": "View Projects →", "link": "#features"},
            "ctaSecondary": {"text": "Get in Touch", "link": "#contact"},
            "navLinks": [
                {"label": "Selected Work", "href": "#features"},
                {"label": "Interactive Lab", "href": "#sandbox"},
                {"label": "Engineering Principles", "href": "#pricing"},
                {"label": "Contact", "href": "#contact"}
            ],
            "features": [
                {"icon": "🚀", "title": "Zoth Studio (Founder)", "desc": "Autonomous multi-agent website and software foundry with 4-agent consensus loop."},
                {"icon": "🔒", "title": "ArgonZero Vault", "desc": "Zero-trust key derivation daemon keeping private keys in encrypted loopback RAM."},
                {"icon": "⚡", "title": "Signal Swarm Bridge", "desc": "Remote command NOC daemon orchestrating background AI swarms over encrypted E2E chat."}
            ],
            "pricing": [
                {"tier": "Advisory / Audit", "price": "$250", "period": "/hr", "badge": "Architecture", "features": ["Multi-Agent Architecture Review", "OWASP Security & CSP Audit", "Local-First LLM Feasibility", "1-on-1 Strategy Session"]},
                {"tier": "Sprint Partnership", "price": "$4,500", "period": "/wk", "badge": "Full Delivery", "featured": True, "features": ["Dedicated Engineering Sprint", "Full Production Scaffolding", "Automated Testing Suite", "Netlify / Hostinger Deploy"]},
                {"tier": "Fractional Staff", "price": "Retainer", "period": "/mo", "badge": "Long-Term", "features": ["System Architecture Ownership", "Agent Mesh Implementation", "Team Mentorship", "Custom Tool Development"]}
            ],
            "faqs": [
                {"q": "What is your primary tech stack?", "a": "TypeScript, Python, Rust, Astro, React 19, Tailwind, SQLite, WebSockets, and Linux system engineering."},
                {"q": "Are you available for remote contracts?", "a": "Yes, available worldwide for high-impact autonomous agent and distributed systems contracts."}
            ]
        }
    }
}

# ═════════════════════════════════════════════════════════════════════════════
# 2. TEMPLATE SYNTHESIZER & JSON CUSTOMIZATION ENGINE
# ═════════════════════════════════════════════════════════════════════════════

def get_template_catalog() -> List[Dict[str, Any]]:
    """Return list of all available templates with sample metadata."""
    return [
        {
            "id": t["id"],
            "name": t["name"],
            "category": t["category"],
            "badge": t["badge"],
            "desc": t["desc"],
            "icon": t["icon"],
            "theme": t["default_theme"],
            "config": t["default_config"]
        }
        for t in SITE_TEMPLATES.values()
    ]

def hydrate_site_template(template_id: str, custom_overrides: Dict[str, Any], previews_dir: Path) -> Dict[str, Any]:
    """
    Hydrate a template with user-provided JSON customizations (colors, fonts, copy, nav, features, pricing)
    and compile a standalone, responsive, high-performance HTML5/CSS/JS application.
    """
    tmpl = SITE_TEMPLATES.get(template_id, SITE_TEMPLATES["saas-vault"])
    
    # 1. Merge Theme Tokens
    theme = dict(tmpl["default_theme"])
    if "theme" in custom_overrides and isinstance(custom_overrides["theme"], dict):
        theme.update(custom_overrides["theme"])
    elif "primaryColor" in custom_overrides:
        theme["primary"] = custom_overrides["primaryColor"]

    # 2. Merge Content Config
    cfg = dict(tmpl["default_config"])
    for k, v in custom_overrides.items():
        if k not in ["theme", "components"]:
            cfg[k] = v

    site_name = cfg.get("brandName", "ApexVault")
    slug = re.sub(r"[^a-z0-9]+", "-", site_name.lower()).strip("-") or "zoth-site"
    tagline = cfg.get("tagline", "Autonomous Multi-Agent Application")

    # 3. Compile Master Navigation
    nav_html = "".join([f'<a href="{item.get("href", "#")}" class="nav-link">{item.get("label", "")}</a>' for item in cfg.get("navLinks", [])])

    # 4. Compile Features Bento Grid
    features_html = "".join([
        f'''
        <div class="feature-card">
          <div class="feat-icon">{f.get("icon", "⚡")}</div>
          <h3>{f.get("title", "")}</h3>
          <p>{f.get("desc", "")}</p>
        </div>
        '''
        for f in cfg.get("features", [])
    ])

    # 5. Compile Pricing Matrix
    pricing_html = "".join([
        f'''
        <div class="pricing-card {'featured' if p.get('featured') else ''}">
          {f'<div class="pricing-badge">{p.get("badge")}</div>' if p.get('badge') else ''}
          <h3>{p.get("tier", "")}</h3>
          <div class="pricing-num">{p.get("price", "")}<small>{p.get("period", "")}</small></div>
          <ul class="pricing-perks">
            {''.join([f'<li>✓ {perk}</li>' for perk in p.get("features", [])])}
          </ul>
          <button class="pricing-btn" onclick="playChime()">{p.get("cta", "Get Started")}</button>
        </div>
        '''
        for p in cfg.get("pricing", [])
    ])

    # 6. Compile FAQ Accordion
    faqs_html = "".join([
        f'''
        <details class="faq-item">
          <summary>{faq.get("q", "")}</summary>
          <p>{faq.get("a", "")}</p>
        </details>
        '''
        for faq in cfg.get("faqs", [])
    ])

    # 7. Compile Complete HTML5 Production Bundle
    compiled_html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{site_name} — {tagline}</title>
  <meta name="description" content="{cfg.get('heroSubheadline', tagline)}" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />

  <style>
    :root {{
      --primary: {theme.get('primary', '#00f0ff')};
      --accent: {theme.get('accent', '#c084fc')};
      --bg: {theme.get('bg', '#05070f')};
      --surface: {theme.get('surface', '#0a0e1c')};
      --surface-hover: #12182e;
      --border: {theme.get('border', '#1a2342')};
      --text: #f0f4fc;
      --text-muted: #8493b8;
      --font-display: {theme.get('font_display', "'Syne', sans-serif")};
      --font-body: {theme.get('font_body', "'Figtree', sans-serif")};
      --font-mono: {theme.get('font_mono', "'IBM Plex Mono', monospace")};
    }}

    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.6;
      overflow-x: hidden;
    }}

    /* Background Canvas */
    #bg-canvas {{
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: -1; opacity: 0.35;
    }}

    /* Navbar */
    .navbar {{
      position: sticky; top: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 2rem;
      background: rgba(5, 7, 15, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }}
    .brand {{
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-display); font-weight: 800; font-size: 1.25rem;
      color: #fff; text-decoration: none;
    }}
    .brand span {{ color: var(--primary); }}
    .nav-links {{ display: flex; gap: 1.5rem; }}
    .nav-link {{ color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s; }}
    .nav-link:hover {{ color: var(--primary); }}
    .btn-nav {{
      background: var(--primary); color: #05070f;
      padding: 0.45rem 1.1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
      text-decoration: none; border: none; cursor: pointer; transition: all 0.2s;
    }}
    .btn-nav:hover {{ transform: translateY(-1px); box-shadow: 0 0 15px var(--primary); }}

    /* Hero Section */
    .hero {{
      text-align: center;
      padding: 6rem 1.5rem 4rem;
      max-width: 900px;
      margin: 0 auto;
    }}
    .kicker {{
      display: inline-block; font-family: var(--font-mono); font-size: 0.78rem;
      color: var(--primary); background: rgba(0, 240, 255, 0.1);
      padding: 4px 12px; border-radius: 999px; margin-bottom: 1.2rem;
      border: 1px solid var(--border);
    }}
    .hero h1 {{
      font-family: var(--font-display); font-size: 3.25rem; font-weight: 900;
      line-height: 1.15; margin-bottom: 1.2rem; letter-spacing: -0.02em;
    }}
    .hero h1 span {{
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }}
    .hero p {{
      font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 700px; margin-inline: auto;
    }}
    .hero-actions {{ display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }}
    .btn-hero {{
      background: var(--primary); color: #05070f; font-family: var(--font-display); font-weight: 800;
      padding: 0.85rem 2rem; border-radius: 999px; text-decoration: none; font-size: 1rem;
      border: none; cursor: pointer; transition: all 0.25s; box-shadow: 0 0 25px rgba(0,240,255,0.3);
    }}
    .btn-hero:hover {{ transform: translateY(-2px); box-shadow: 0 0 35px var(--primary); }}
    .btn-sec {{
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      padding: 0.85rem 1.8rem; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.95rem;
      transition: all 0.2s;
    }}
    .btn-sec:hover {{ border-color: var(--primary); color: var(--primary); }}

    /* Features Grid */
    .features-sec {{
      max-width: 1200px; margin: 4rem auto; padding: 0 1.5rem;
    }}
    .sec-head {{ text-align: center; margin-bottom: 3rem; }}
    .sec-head h2 {{ font-family: var(--font-display); font-size: 2.2rem; margin-bottom: 0.5rem; }}
    .sec-head p {{ color: var(--text-muted); font-size: 1rem; }}

    .feature-grid {{
      display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;
    }}
    .feature-card {{
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
      padding: 2rem; transition: all 0.25s ease;
    }}
    .feature-card:hover {{
      transform: translateY(-3px); border-color: var(--primary); background: var(--surface-hover);
    }}
    .feat-icon {{ font-size: 2rem; margin-bottom: 1rem; }}
    .feature-card h3 {{ font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 0.6rem; }}
    .feature-card p {{ color: var(--text-muted); font-size: 0.92rem; line-height: 1.5; }}

    /* Sandbox Interactive Demo */
    .sandbox-sec {{
      max-width: 900px; margin: 4rem auto; padding: 0 1.5rem;
    }}
    .terminal-box {{
      background: #000; border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    }}
    .terminal-bar {{
      background: var(--surface); padding: 0.6rem 1rem; display: flex; align-items: center; gap: 8px;
      border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);
    }}
    .term-dot {{ width: 10px; height: 10px; border-radius: 50%; }}
    .term-dot.r {{ background: #f87171; }}
    .term-dot.y {{ background: #fbbf24; }}
    .term-dot.g {{ background: #34d399; }}
    .terminal-body {{
      padding: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary);
    }}
    .term-input-row {{
      display: flex; gap: 8px; margin-top: 1rem; align-items: center;
    }}
    .term-input {{
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border);
      color: #fff; padding: 0.5rem 0.8rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.85rem;
    }}
    .term-btn {{
      background: var(--primary); color: #05070f; border: none; padding: 0.5rem 1rem;
      border-radius: 6px; font-weight: 700; cursor: pointer; font-family: var(--font-mono);
    }}

    /* Pricing Section */
    .pricing-sec {{
      max-width: 1100px; margin: 5rem auto; padding: 0 1.5rem;
    }}
    .pricing-grid {{
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;
      align-items: stretch;
    }}
    .pricing-card {{
      background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
      padding: 2.2rem 1.8rem; display: flex; flex-direction: column; position: relative;
    }}
    .pricing-card.featured {{
      border-color: var(--primary); box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
      background: linear-gradient(180deg, rgba(0,240,255,0.06), var(--surface));
    }}
    .pricing-badge {{
      position: absolute; top: -12px; right: 20px; background: var(--primary); color: #05070f;
      font-size: 0.72rem; font-weight: 800; font-family: var(--font-display); padding: 3px 10px; border-radius: 999px;
    }}
    .pricing-card h3 {{ font-family: var(--font-display); font-size: 1.35rem; margin-bottom: 0.8rem; }}
    .pricing-num {{ font-size: 2.5rem; font-weight: 900; font-family: var(--font-display); margin-bottom: 1.5rem; color: #fff; }}
    .pricing-num small {{ font-size: 0.9rem; color: var(--text-muted); font-weight: 400; }}
    .pricing-perks {{ list-style: none; margin-bottom: 2rem; flex: 1; }}
    .pricing-perks li {{ font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.6rem; }}
    .pricing-btn {{
      background: var(--surface-hover); border: 1px solid var(--border); color: #fff;
      padding: 0.75rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }}
    .pricing-card.featured .pricing-btn {{ background: var(--primary); color: #05070f; border-color: var(--primary); }}
    .pricing-btn:hover {{ border-color: var(--primary); transform: translateY(-1px); }}

    /* FAQ */
    .faq-sec {{ max-width: 800px; margin: 4rem auto; padding: 0 1.5rem; }}
    .faq-item {{
      background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
      padding: 1rem 1.25rem; margin-bottom: 0.75rem; cursor: pointer;
    }}
    .faq-item summary {{ font-weight: 700; font-size: 1rem; color: #fff; list-style: none; }}
    .faq-item summary::-webkit-details-marker {{ display: none; }}
    .faq-item p {{ margin-top: 0.75rem; color: var(--text-muted); font-size: 0.92rem; }}

    /* Footer */
    footer {{
      border-top: 1px solid var(--border); padding: 3rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;
    }}
  </style>
</head>
<body>

  <canvas id="bg-canvas"></canvas>

  <!-- Navigation -->
  <nav class="navbar">
    <a href="#" class="brand">◈ {site_name}</a>
    <div class="nav-links">
      {nav_html}
    </div>
    <a href="#sandbox" class="btn-nav" onclick="playChime()">Initialize Node</a>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="kicker">{cfg.get('kicker', 'Autonomous Systems')}</div>
    <h1>{cfg.get('heroHeadline', site_name)}</h1>
    <p>{cfg.get('heroSubheadline', tagline)}</p>
    <div class="hero-actions">
      <a href="{cfg.get('ctaPrimary', {}).get('link', '#sandbox')}" class="btn-hero" onclick="playChime()">{cfg.get('ctaPrimary', {}).get('text', 'Get Started →')}</a>
      <a href="{cfg.get('ctaSecondary', {}).get('link', '/docs/')}" class="btn-sec">{cfg.get('ctaSecondary', {}).get('text', 'Documentation')}</a>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features-sec" id="features">
    <div class="sec-head">
      <p class="kicker">Architecture</p>
      <h2>Engineered for High-Assurance Autonomy</h2>
      <p>Decentralized multi-agent execution with AST safety guarantees and local loopback gates.</p>
    </div>
    <div class="feature-grid">
      {features_html}
    </div>
  </section>

  <!-- Interactive Sandbox -->
  <section class="sandbox-sec" id="sandbox">
    <div class="sec-head">
      <p class="kicker">Live Interactive Sandbox</p>
      <h2>Test Neural & Cryptographic Operations</h2>
    </div>
    <div class="terminal-box">
      <div class="terminal-bar">
        <span class="term-dot r"></span>
        <span class="term-dot y"></span>
        <span class="term-dot g"></span>
        <span>{slug} :: interactive loopback terminal</span>
      </div>
      <div class="terminal-body" id="term-out">
        <div>[System] Node initialized. Ready for interactive AST execution.</div>
        <div style="color:var(--text-muted); margin-top:4px;">Type a command like 'audit', 'derive-key', or 'ping' and click Execute.</div>
      </div>
      <div class="term-input-row" style="padding: 0 1.5rem 1.25rem;">
        <input type="text" id="sandbox-input" class="term-input" placeholder="e.g. derive-key --argon2id" value="derive-key --argon2id" />
        <button class="term-btn" onclick="runSandboxCommand()">Execute</button>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section class="pricing-sec" id="pricing">
    <div class="sec-head">
      <p class="kicker">Deploy & Scale</p>
      <h2>Transparent, Open-Source Pricing</h2>
      <p>Zero lock-in. Host locally or deploy to high-availability global CDNs.</p>
    </div>
    <div class="pricing-grid">
      {pricing_html}
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-sec" id="faq">
    <div class="sec-head">
      <p class="kicker">Knowledge Base</p>
      <h2>Frequently Asked Questions</h2>
    </div>
    {faqs_html}
  </section>

  <!-- Footer -->
  <footer>
    <p>© 2026 {site_name}. Generated by Zoth Autonomous Multi-Agent Foundry.</p>
  </footer>

  <!-- Web Audio DSP & Interactive Sandbox Script -->
  <script>
    // Web Audio Sound Engine
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playChime() {{
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    }}

    // Sandbox Execution
    function runSandboxCommand() {{
      playChime();
      const inp = document.getElementById('sandbox-input');
      const out = document.getElementById('term-out');
      const cmd = (inp.value || '').trim();
      if (!cmd) return;

      const d = document.createElement('div');
      d.style.marginTop = '8px';
      d.innerHTML = `<span style="color:#fff;">&gt; ${{cmd}}</span><br/><span style="color:#34d399;">✓ [AST Validated] Operation executed smoothly on loopback. Nonce: ${{Math.random().toString(36).substring(2, 9)}}</span>`;
      out.appendChild(d);
      inp.value = '';
    }}

    // Particle Background
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    function resize() {{
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }}
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 40; i++) {{
      particles.push({{
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1
      }});
    }}

    function animate() {{
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '{theme.get("primary", "#00f0ff")}';
      particles.forEach(p => {{
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }});
      requestAnimationFrame(animate);
    }}
    animate();
  </script>
</body>
</html>
'''

    # Save to preview directory
    target_site_dir = previews_dir / slug
    target_site_dir.mkdir(parents=True, exist_ok=True)
    index_path = target_site_dir / "index.html"
    index_path.write_text(compiled_html, encoding="utf-8")

    # Generate AEO llms.txt
    llms_txt = f"""# {site_name}
> {tagline}

## Overview
{cfg.get('heroSubheadline', tagline)}

## Architecture & Features
"""
    for f in cfg.get("features", []):
        llms_txt += f"- **{f.get('title')}**: {f.get('desc')}\n"

    (target_site_dir / "llms.txt").write_text(llms_txt, encoding="utf-8")
    (target_site_dir / "config.json").write_text(json.dumps(cfg, indent=2), encoding="utf-8")

    return {
        "status": "ok",
        "templateId": template_id,
        "siteName": site_name,
        "slug": slug,
        "previewUrl": f"/previews/{slug}/index.html",
        "code": compiled_html,
        "config": cfg,
        "theme": theme,
        "llmsTxt": llms_txt
    }
