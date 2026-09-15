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
    nav_html = "".join([f'<a href="{item.get("href", "#")}" class="zoth-nav-link">{item.get("label", "")}</a>' for item in cfg.get("navLinks", [])])

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
        <div class="zoth-price-card {'featured' if p.get('featured') else ''}">
          {f'<div class="zoth-price-badge">{p.get("badge")}</div>' if p.get('badge') else ''}
          <h3>{p.get("tier", "")}</h3>
          <div class="zoth-price-num">{p.get("price", "")}<small>{p.get("period", "")}</small></div>
          <ul class="zoth-price-perks">
            {''.join([f'<li>✓ {perk}</li>' for perk in p.get("features", [])])}
          </ul>
          <button class="zoth-price-btn" onclick="playChime()">{p.get("cta", "Get Started")}</button>
        </div>
        '''
        for p in cfg.get("pricing", [])
    ])

    # 6. Compile FAQ Accordion
    faqs_html = "".join([
        f'''
        <details class="zoth-faq-item">
          <summary>{faq.get("q", "")}</summary>
          <p>{faq.get("a", "")}</p>
        </details>
        '''
        for faq in cfg.get("faqs", [])
    ])

    # Build mobile nav sheet links
    nav_html_sheet = "".join([
        f'<li><a href="{item.get("href", "#")}" class="zoth-sheet-link">{item.get("label", "")}</a></li>'
        for item in cfg.get("navLinks", [])
    ])
    js_script_raw = r"""
    // Web Audio Sound Engine
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playChime() {
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
    }

    // Sandbox Execution
    function runSandboxCommand() {
      playChime();
      const inp = document.getElementById('sandbox-input');
      const out = document.getElementById('term-out');
      const cmd = (inp.value || '').trim();
      if (!cmd) return;

      const d = document.createElement('div');
      d.style.marginTop = '8px';
      d.innerHTML = `<span style="color:#fff;">&gt; ${cmd}</span><br/><span style="color:#34d399;">✓ [AST Validated] Operation executed smoothly on loopback. Nonce: ${Math.random().toString(36).substring(2, 9)}</span>`;
      out.appendChild(d);
      inp.value = '';
    }

    // Particle Background
    (function() {
      const bg = document.querySelector('.zoth-bg');
      if (!bg) return;
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
      bg.appendChild(c);
      const ctx = c.getContext('2d');
      let w, h, particles = [];

      function resize() {
        w = c.width = bg.offsetWidth;
        h = c.height = bg.offsetHeight;
        particles = [];
        for (let i = 0; i < 45; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6
          });
        }
      }
      window.addEventListener('resize', resize);
      resize();

      function animate() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'var(--z-primary)';
        ctx.globalAlpha = 0.3;
        for (const p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
      }
      animate();
    })();

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
        """
    
    primary_js = json.dumps(theme.get("primary", "#00f0ff"))
    compiled_html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{site_name} — {tagline}</title>
  <meta name="description" content="{cfg.get('heroSubheadline', tagline)}" />

  <!-- Shared Zoth Design System -->
  <link rel="stylesheet" href="/assets/zoth-generated.css" />
  <style>
    :root {{
      --z-primary: {theme.get('primary', '#00f0ff')};
      --z-accent:  {theme.get('accent', '#c084fc')};
      --z-bg:      {theme.get('bg', '#05070f')};
      --z-surface: {theme.get('surface', '#0a0e1c')};
      --z-surface-2: {theme.get('surface-hover', '#12182e')};
      --z-border:  {theme.get('border', '#1a2342')};
    }}
    .zoth-bg {{ opacity: 0.85; }}
    .zoth-hero::before {{
      width: 600px; height: 320px;
      background: radial-gradient(ellipse at center, color-mix(in srgb, var(--z-primary) 22%, transparent) 0%, transparent 70%);
    }}
    .zoth-nav-link--active {{ color: var(--z-text); }}
    .zoth-nav-link--active::after {{ transform: scaleX(1); }}
    .zoth-price-card.featured {{
      border-color: var(--z-primary);
      box-shadow: 0 0 30px color-mix(in srgb, var(--z-primary) 20%, transparent), 0 0 0 1px color-mix(in srgb, var(--z-primary) 40%, transparent);
      background: linear-gradient(180deg, color-mix(in srgb, var(--z-primary) 6%, transparent), var(--z-surface) 60%);
    }}
  </style>
</head>
<body>

  <div class="zoth-bg" aria-hidden="true"></div>

  <div class="zoth-site">
    <!-- Navigation -->
    <nav class="zoth-nav" id="zoth-nav">
      <a href="#" class="zoth-brand">
        <span class="zoth-brand-dot" aria-hidden="true"></span>
        <span class="zoth-brand-name">{site_name}</span>
      </a>
      <ul class="zoth-nav-links">
        {nav_html}
      </ul>
      <a href="#sandbox" class="zoth-nav-cta desktop-only" onclick="playChime()">Initialize Node</a>
      <button class="zoth-nav-sheet-btn" id="zoth-nav-open" aria-label="Open menu">
        <span class="zoth-brand-dot" style="width:7px;height:7px"></span>
        MENU
      </button>
    </nav>

    <!-- Mobile Nav Sheet -->
    <div class="zoth-nav-sheet" id="zoth-nav-sheet" role="dialog" aria-modal="true" aria-label="Site navigation">
      <button class="zoth-sheet-close" id="zoth-nav-close" aria-label="Close menu">×</button>
      <ul class="zoth-sheet-links">
        {nav_html_sheet}
      </ul>
    </div>

    <!-- Hero -->
    <section class="zoth-hero zoth-section">
      <div class="zoth-kicker">{cfg.get('kicker', 'Autonomous Systems')}</div>
      <h1 class="zoth-title">{cfg.get('heroHeadline', site_name)}</h1>
      <p class="zoth-lead">{cfg.get('heroSubheadline', tagline)}</p>
      <div class="zoth-actions">
        <a href="{cfg.get('ctaPrimary', {}).get('link', '#sandbox')}" class="zoth-btn zoth-btn-primary" onclick="playChime()">
          {cfg.get('ctaPrimary', {}).get('text', 'Initialize Node →')}
        </a>
        <a href="{cfg.get('ctaSecondary', {}).get('link', '/docs/')}" class="zoth-btn zoth-btn-ghost">
          {cfg.get('ctaSecondary', {}).get('text', 'Documentation')}
        </a>
      </div>
    </section>

    <!-- Features -->
    <section class="zoth-section" id="features">
      <div class="zoth-section-head">
        <p class="zoth-section-eyebrow">Architecture</p>
        <h2 class="zoth-section-title">Engineered for High-Assurance Autonomy</h2>
        <p class="zoth-section-sub">Decentralized multi-agent execution with AST safety guarantees and local loopback gates.</p>
      </div>
      <div class="zoth-features">
        {features_html}
      </div>
    </section>

    <!-- Sandbox -->
    <section class="zoth-section" id="sandbox">
      <div class="zoth-section-head">
        <p class="zoth-section-eyebrow">Live Interactive Sandbox</p>
        <h2 class="zoth-section-title">Test Neural &amp; Cryptographic Operations</h2>
      </div>
      <div class="zoth-terminal">
        <div class="zoth-term-bar">
          <span class="zoth-term-dot r"></span>
          <span class="zoth-term-dot y"></span>
          <span class="zoth-term-dot g"></span>
          <span>{slug} :: interactive loopback terminal</span>
        </div>
        <div class="zoth-term-body" id="term-out">
          <div><span class="zoth-term-prompt">[System]</span> Node initialized. Ready for interactive AST execution.</div>
          <div style="color:var(--z-muted); margin-top:4px;">Type a command like 'audit', 'derive-key', or 'ping' and click Execute.</div>
        </div>
        <div class="zoth-term-input-row">
          <input type="text" id="sandbox-input" class="zoth-term-input" placeholder="e.g. derive-key --argon2id" value="derive-key --argon2id" />
          <button class="zoth-term-btn" onclick="runSandboxCommand()">Execute</button>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="zoth-section" id="pricing">
      <div class="zoth-section-head">
        <p class="zoth-section-eyebrow">Deploy &amp; Scale</p>
        <h2 class="zoth-section-title">Transparent, Open-Source Pricing</h2>
        <p class="zoth-section-sub">Zero lock-in. Host locally or deploy to high-availability global CDNs.</p>
      </div>
      <div class="zoth-pricing">
        {pricing_html}
      </div>
    </section>

    <!-- FAQ -->
    <section class="zoth-section" id="faq">
      <div class="zoth-section-head">
        <p class="zoth-section-eyebrow">Knowledge Base</p>
        <h2 class="zoth-section-title">Frequently Asked Questions</h2>
      </div>
      <div class="zoth-faq">
        {faqs_html}
      </div>
    </section>

    <!-- Footer -->
    <footer class="zoth-footer">
      <p>© 2026 <strong>{site_name}</strong>. Generated by Zoth Autonomous Multi-Agent Foundry.</p>
      <p class="zoth-foot-meta">Zero-cloud egress · Loopback-first · AST-verified output</p>
    </footer>
  </div>

  <!-- Web Audio DSP & Interactive Sandbox Script -->
  <script>
    const ZOTH_PRIMARY = {primary_js};
  </script>
  {js_script_raw}
  <script>
    (function() {{
      const bg = document.querySelector('.zoth-bg');
      if (bg && !bg.querySelector('canvas')) {{
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
        bg.appendChild(canvas);
      }}
    }})();
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
