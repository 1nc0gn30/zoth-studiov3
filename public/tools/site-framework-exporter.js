// Zoth Studio — Multi-Framework Site Exporter Engine (JS Module v3.0)
// Universal browser and Node.js exporter generating complete Astro 5, Vite + React, and Next.js 15 repositories.

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothFrameworkExporter = factory();
    if (typeof window !== "undefined") {
      window.ZothFrameworkExporter = root.ZothFrameworkExporter;
    }
  }
})(typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : this), function () {
  "use strict";

  // ============================================================================
  // MASTER THEMES & DESIGN TOKENS
  // ============================================================================
  var THEMES = {
    "obsidian-gold": {
      id: "obsidian-gold",
      name: "Obsidian Gold",
      bg: "#07080b",
      surface: "#101420",
      surface2: "#181e30",
      border: "rgba(232, 200, 114, 0.22)",
      border_hover: "rgba(232, 200, 114, 0.65)",
      accent: "#e8c872",
      accent_glow: "rgba(232, 200, 114, 0.25)",
      text: "#f7f4ee",
      text_muted: "#a8a4c2",
      badge_bg: "rgba(232, 200, 114, 0.12)"
    },
    "midnight-neon": {
      id: "midnight-neon",
      name: "Midnight Neon",
      bg: "#030611",
      surface: "#0a1226",
      surface2: "#122040",
      border: "rgba(0, 240, 255, 0.25)",
      border_hover: "rgba(0, 240, 255, 0.75)",
      accent: "#00f0ff",
      accent_glow: "rgba(0, 240, 255, 0.35)",
      text: "#ffffff",
      text_muted: "#8ea5d0",
      badge_bg: "rgba(0, 240, 255, 0.12)"
    },
    "acid-grid": {
      id: "acid-grid",
      name: "Acid Grid",
      bg: "#050805",
      surface: "#0c180e",
      surface2: "#142818",
      border: "rgba(52, 211, 153, 0.28)",
      border_hover: "rgba(52, 211, 153, 0.8)",
      accent: "#34d399",
      accent_glow: "rgba(52, 211, 153, 0.3)",
      text: "#f0fdf4",
      text_muted: "#86efac",
      badge_bg: "rgba(52, 211, 153, 0.14)"
    },
    "ultraviolet-glass": {
      id: "ultraviolet-glass",
      name: "Ultraviolet Glass",
      bg: "#080414",
      surface: "#160e2a",
      surface2: "#241644",
      border: "rgba(192, 132, 252, 0.28)",
      border_hover: "rgba(192, 132, 252, 0.75)",
      accent: "#c084fc",
      accent_glow: "rgba(192, 132, 252, 0.35)",
      text: "#faf5ff",
      text_muted: "#d8b4fe",
      badge_bg: "rgba(192, 132, 252, 0.12)"
    },
    "retro-terminal": {
      id: "retro-terminal",
      name: "Retro Terminal",
      bg: "#0a0d0a",
      surface: "#0e160e",
      surface2: "#182618",
      border: "rgba(74, 222, 128, 0.35)",
      border_hover: "#4ade80",
      accent: "#4ade80",
      accent_glow: "rgba(74, 222, 128, 0.4)",
      text: "#4ade80",
      text_muted: "#86efac",
      badge_bg: "rgba(74, 222, 128, 0.15)"
    },
    "minimalist-clean": {
      id: "minimalist-clean",
      name: "Minimalist Clean",
      bg: "#0f1117",
      surface: "#1a1d27",
      surface2: "#262a38",
      border: "rgba(255, 255, 255, 0.12)",
      border_hover: "rgba(255, 255, 255, 0.45)",
      accent: "#ffffff",
      accent_glow: "rgba(255, 255, 255, 0.2)",
      text: "#ffffff",
      text_muted: "#94a3b8",
      badge_bg: "rgba(255, 255, 255, 0.1)"
    }
  };

  // ============================================================================
  // MASTER NICHES & COPY
  // ============================================================================
  var NICHES = {
    ai_swarm: {
      title: "Autonomous AI Swarm Platform",
      default_tagline: "Coordinated Multi-Agent Intelligence & Spatial Computation",
      hero_desc: "Deploy sovereign, hardware-isolated AI multi-agent swarms that deliberate, write AST-verified code, and execute distributed workflows with zero cloud latency.",
      badge: "⚡ Autonomous Swarm Node",
      features: [
        { title: "Multi-Agent Consensus Arena", desc: "3-way triangulation between specialized models with Shannon entropy verification.", icon: "⚔️" },
        { title: "Zero-Cloud Hardware Vault", desc: "Argon2id encrypted key containers running 100% on local loopback.", icon: "🔐" },
        { title: "Real-Time Telemetry Stream", desc: "Sub-millisecond SSE event feeds and live kinetic node state visualization.", icon: "⚡" }
      ],
      metrics: [
        { label: "Local Loopback Latency", value: "< 0.4ms" },
        { label: "Swarm Agents Active", value: "21 Nodes" },
        { label: "Cloud Leakage", value: "0.00%" }
      ]
    },
    saas: {
      title: "Enterprise Cloud & Developer Platform",
      default_tagline: "Sub-Millisecond Edge Compute & API Orchestration",
      hero_desc: "High-velocity infrastructure platform delivering serverless edge compute, real-time analytics, and automated multi-cloud deployment pipelines.",
      badge: "🚀 Enterprise SaaS Ready",
      features: [
        { title: "Global Edge Mesh", desc: "Sub-10ms response times across 280+ edge points of presence.", icon: "🌐" },
        { title: "Deterministic Build Pipelines", desc: "Zero-drift containerized hydration with instant rollbacks.", icon: "⚙️" },
        { title: "Real-Time Metric HUD", desc: "High-density telemetry dashboards with custom alerting hooks.", icon: "📊" }
      ],
      metrics: [
        { label: "Global Edge PoPs", value: "280+" },
        { label: "Build Pipeline Velocity", value: "1.2s" },
        { label: "Uptime SLA", value: "99.99%" }
      ]
    },
    cyberpunk: {
      title: "Neural Command Deck & Hacker Terminal",
      default_tagline: "Off-Grid Cybernetic Operations & Threat Matrix",
      hero_desc: "Terminal-driven sovereign interface equipped with ANSI parsers, 60 FPS matrix cascades, and cryptographic air-gapped security tools.",
      badge: "📟 Sovereign Command Deck",
      features: [
        { title: "Hex Matrix Visualizer", desc: "GPU-accelerated 60 FPS canvas rain with custom symbol density controls.", icon: "🟩" },
        { title: "Air-Gapped Tool Sandbox", desc: "20+ offline security diagnostics with zero external network calls.", icon: "🛡️" },
        { title: "Synthesized Audio SFX", desc: "Binaural and Solfeggio frequency pulse generator for focused workflows.", icon: "🔊" }
      ],
      metrics: [
        { label: "Frame Rate", value: "60 FPS" },
        { label: "Air-Gapped Tools", value: "20+ Offline" },
        { label: "Telemetry Egress", value: "0 B/s" }
      ]
    },
    spatial_3d: {
      title: "3D Spatial Computing & Creative Studio",
      default_tagline: "GPU Volumetric Computing & Interactive Shaders",
      hero_desc: "Immersive 3D web studio featuring procedural Three.js figurines, gestural hand tracking, and 22+ custom post-processing shaders.",
      badge: "🧊 3D WebGL Studio",
      features: [
        { title: "Volumetric Figurine Renderer", desc: "Three.js GPU-rendered 3D companion figurines with orbital camera controls.", icon: "💎" },
        { title: "Touchless Air-Draw HUD", desc: "Google MediaPipe vision tracking for spatial neon mid-air graffiti.", icon: "🖐️" },
        { title: "Kinetic Sound Synthesizer", desc: "Real-time Web Audio soundscapes tied to 3D particle velocities.", icon: "🎵" }
      ],
      metrics: [
        { label: "Shader Pipelines", value: "22 Shaders" },
        { label: "Mesh Resolution", value: "Procedural" },
        { label: "Tracking Latency", value: "12ms" }
      ]
    },
    security: {
      title: "Zero-Trust Cybersecurity & OSINT Suite",
      default_tagline: "Autonomous Threat Surface Recon & Key Containment",
      hero_desc: "Comprehensive attack surface management with automated DNS mapping, secret leak scanners, and hardware-level encryption.",
      badge: "🔒 Zero-Trust Sentinel",
      features: [
        { title: "3D Attack Surface Radar", desc: "Orbital visualization of subdomains, open ports, and DNS topology.", icon: "🛰️" },
        { title: "Secret Leak Auditor", desc: "AST regex scanner detecting exposed tokens and plaintext keys in bundles.", icon: "🔍" },
        { title: "Argon2id Hardware Vault", desc: "Memory-hard cryptographic isolation for mission-critical credentials.", icon: "🛡️" }
      ],
      metrics: [
        { label: "Entropy Strength", value: "Argon2id" },
        { label: "Leak Scan Speed", value: "50k LoC/s" },
        { label: "Attack Surface Vectors", value: "14 Audits" }
      ]
    },
    creator: {
      title: "Creator Studio & Digital Product Foundry",
      default_tagline: "Monetize Digital Artifacts, Blueprints & Workflows",
      hero_desc: "Turn your workflows, code blueprints, and AI agents into high-converting digital products with interactive previews and instant licensing.",
      badge: "✨ Creator Product Hub",
      features: [
        { title: "Interactive Live Previews", desc: "Let buyers test workflows directly in a sandboxed viewport before purchasing.", icon: "👁️" },
        { title: "Instant Checkout Bridge", desc: "Zero-friction payments with automatic license key generation.", icon: "💳" },
        { title: "AEO Search Optimization", desc: "Structured Schema.org markup ensuring top placement on AI search engines.", icon: "📈" }
      ],
      metrics: [
        { label: "Conversion Boost", value: "+34.8%" },
        { label: "Instant Delivery", value: "< 1.5s" },
        { label: "Search Schema", value: "JSON-LD" }
      ]
    }
  };

  // ============================================================================
  // SPEC NORMALIZER
  // ============================================================================
  function sanitizeSlug(text) {
    return (text || "apex-app").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "apex-app";
  }

  function normalizeSpec(raw) {
    raw = raw || {};
    var name = raw.name || "Apex Cloud";
    var slug = raw.slug || sanitizeSlug(name);
    var nicheKey = raw.niche && NICHES[raw.niche] ? raw.niche : "ai_swarm";
    var niche = NICHES[nicheKey];
    var themeKey = raw.theme && THEMES[raw.theme] ? raw.theme : "obsidian-gold";
    var theme = THEMES[themeKey];
    var tagline = raw.tagline || niche.default_tagline;
    var description = raw.description || niche.hero_desc;
    var year = raw.year || 2026;

    return {
      name: name,
      slug: slug,
      nicheKey: nicheKey,
      niche: niche,
      themeKey: themeKey,
      theme: theme,
      tagline: tagline,
      description: description,
      year: year
    };
  }

  // ============================================================================
  // 1. ASTRO 5 PROJECT GENERATOR (IN-MEMORY FILE TREE)
  // ============================================================================
  function generateAstroFiles(rawSpec) {
    var spec = normalizeSpec(rawSpec);
    var files = {};

    // 1. package.json
    files["package.json"] = JSON.stringify({
      name: spec.slug + "-astro",
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "astro dev",
        start: "astro dev",
        build: "astro build",
        preview: "astro preview"
      },
      dependencies: {
        astro: "^5.1.0",
        "@astrojs/tailwind": "^5.1.4",
        tailwindcss: "^3.4.17"
      }
    }, null, 2);

    // 2. astro.config.mjs
    files["astro.config.mjs"] = [
      "import { defineConfig } from 'astro/config';",
      "import tailwind from '@astrojs/tailwind';",
      "",
      "// https://astro.build/config",
      "export default defineConfig({",
      "  integrations: [tailwind({ applyBaseStyles: false })],",
      "  server: { port: 3000, host: true }",
      "});",
      ""
    ].join("\n");

    // 3. tailwind.config.mjs
    files["tailwind.config.mjs"] = [
      "/** @type {import('tailwindcss').Config} */",
      "export default {",
      "  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],",
      "  theme: {",
      "    extend: {",
      "      colors: {",
      "        'theme-bg': '" + spec.theme.bg + "',",
      "        'theme-surface': '" + spec.theme.surface + "',",
      "        'theme-surface2': '" + spec.theme.surface2 + "',",
      "        'theme-border': '" + spec.theme.border + "',",
      "        'theme-border-hover': '" + spec.theme.border_hover + "',",
      "        'theme-accent': '" + spec.theme.accent + "',",
      "        'theme-accent-glow': '" + spec.theme.accent_glow + "',",
      "        'theme-text': '" + spec.theme.text + "',",
      "        'theme-text-muted': '" + spec.theme.text_muted + "',",
      "        'theme-badge': '" + spec.theme.badge_bg + "',",
      "      },",
      "      fontFamily: {",
      "        display: ['Syne', 'sans-serif'],",
      "        sans: ['Figtree', 'sans-serif'],",
      "        mono: ['\"IBM Plex Mono\"', 'monospace'],",
      "      },",
      "      boxShadow: {",
      "        'glow-accent': '0 0 24px " + spec.theme.accent_glow + "',",
      "        'glow-accent-lg': '0 0 40px " + spec.theme.accent_glow + "',",
      "      }",
      "    },",
      "  },",
      "  plugins: [],",
      "};",
      ""
    ].join("\n");

    // 4. netlify.toml
    files["netlify.toml"] = [
      "[build]",
      '  command = "npm run build"',
      '  publish = "dist"',
      "",
      "[build.environment]",
      '  NODE_VERSION = "20"',
      '  NPM_FLAGS = "--legacy-peer-deps"',
      "",
      "[[headers]]",
      '  for = "/*"',
      "  [headers.values]",
      '    X-Frame-Options = "DENY"',
      '    X-Content-Type-Options = "nosniff"',
      '    Referrer-Policy = "strict-origin-when-cross-origin"',
      ""
    ].join("\n");

    // 5. .gitignore
    files[".gitignore"] = "node_modules/\ndist/\n.astro/\n.env\n.env.*\n!.env.example\n.DS_Store\n";

    // 6. src/layouts/Layout.astro
    files["src/layouts/Layout.astro"] = [
      "---",
      "interface Props {",
      "  title?: string;",
      "  description?: string;",
      "}",
      "",
      "const { title = '" + spec.name + " — " + spec.tagline + "', description = '" + spec.description + "' } = Astro.props;",
      "---",
      "",
      "<!doctype html>",
      '<html lang="en">',
      "  <head>",
      '    <meta charset="UTF-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      "    <title>{title}</title>",
      '    <meta name="description" content={description} />',
      '    <meta name="theme-color" content="' + spec.theme.bg + '" />',
      '    <link rel="preconnect" href="https://fonts.googleapis.com" />',
      '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
      '    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />',
      "    <style is:global>",
      "      :root {",
      "        --bg: " + spec.theme.bg + ";",
      "        --surface: " + spec.theme.surface + ";",
      "        --surface2: " + spec.theme.surface2 + ";",
      "        --border: " + spec.theme.border + ";",
      "        --border-hover: " + spec.theme.border_hover + ";",
      "        --accent: " + spec.theme.accent + ";",
      "        --accent-glow: " + spec.theme.accent_glow + ";",
      "        --text: " + spec.theme.text + ";",
      "        --text-muted: " + spec.theme.text_muted + ";",
      "        --badge-bg: " + spec.theme.badge_bg + ";",
      "      }",
      "      * { box-sizing: border-box; margin: 0; padding: 0; }",
      "      body {",
      "        background: var(--bg);",
      "        color: var(--text);",
      "        font-family: 'Figtree', sans-serif;",
      "        line-height: 1.6;",
      "        min-height: 100vh;",
      "        overflow-x: hidden;",
      "      }",
      "    </style>",
      "  </head>",
      '  <body class="bg-theme-bg text-theme-text font-sans antialiased min-h-screen">',
      '    <div class="max-w-6xl mx-auto px-5 py-6">',
      "      <slot />",
      "    </div>",
      "  </body>",
      "</html>",
      ""
    ].join("\n");

    // 7. src/components/Navbar.astro
    files["src/components/Navbar.astro"] = [
      "---",
      "interface Props {",
      "  name?: string;",
      "}",
      "const { name = '" + spec.name + "' } = Astro.props;",
      "---",
      "",
      '<header class="flex items-center justify-between py-5 border-b border-theme-border">',
      '  <a href="/" class="flex items-center gap-2.5 font-display font-extrabold text-xl text-white tracking-tight no-underline">',
      '    <span class="w-2.5 h-2.5 rounded-full bg-theme-accent shadow-glow-accent"></span>',
      "    <span>{name}</span>",
      "  </a>",
      '  <nav class="flex items-center gap-5 text-sm font-semibold">',
      '    <a href="#features" class="text-theme-text-muted hover:text-white transition-colors">Features</a>',
      '    <a href="#sandbox" class="text-theme-text-muted hover:text-white transition-colors">Sandbox</a>',
      '    <a href="#metrics" class="text-theme-text-muted hover:text-white transition-colors">Metrics</a>',
      '    <button id="ctaHeaderBtn" class="bg-theme-accent text-gray-950 px-4 py-2 rounded-xl font-display font-bold text-xs shadow-glow-accent hover:brightness-110 transition-all">',
      "      Get Started",
      "    </button>",
      "  </nav>",
      "</header>",
      "",
      "<script>",
      "  document.getElementById('ctaHeaderBtn')?.addEventListener('click', () => {",
      "    alert('⚡ Action triggered in " + spec.name + "!');",
      "  });",
      "</script>",
      ""
    ].join("\n");

    // 8. src/components/Hero.astro
    files["src/components/Hero.astro"] = [
      "---",
      "interface Props {",
      "  name?: string;",
      "  tagline?: string;",
      "  badge?: string;",
      "  desc?: string;",
      "}",
      "const {",
      "  name = '" + spec.name + "',",
      "  tagline = '" + spec.tagline + "',",
      "  badge = '" + spec.niche.badge + "',",
      "  desc = '" + spec.description + "'",
      "} = Astro.props;",
      "---",
      "",
      '<section class="py-20 text-center relative">',
      '  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-badge border border-theme-border text-theme-accent font-mono text-xs font-bold uppercase tracking-wider mb-5">',
      "    {badge}",
      "  </div>",
      '  <h1 class="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5 tracking-tight">',
      "    {name} <br />",
      '    <span class="text-theme-accent shadow-glow-accent">{tagline}</span>',
      "  </h1>",
      '  <p class="text-theme-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">',
      "    {desc}",
      "  </p>",
      '  <div class="flex items-center justify-center gap-3 flex-wrap">',
      '    <button id="launchBtn" class="bg-theme-accent text-gray-950 px-6 py-3 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all">',
      "      ⚡ Launch Workstation",
      "    </button>",
      '    <button id="docsBtn" class="bg-white/5 border border-theme-border text-white px-6 py-3 rounded-xl font-display font-bold text-sm hover:border-theme-border-hover transition-all">',
      "      📖 Documentation",
      "    </button>",
      "  </div>",
      "</section>",
      "",
      "<script>",
      "  document.getElementById('launchBtn')?.addEventListener('click', () => {",
      "    alert('⚡ Workstation initialized on local loopback!');",
      "  });",
      "  document.getElementById('docsBtn')?.addEventListener('click', () => {",
      "    alert('📖 Documentation manual ready for operator review.');",
      "  });",
      "</script>",
      ""
    ].join("\n");

    // 9. src/components/Sandbox.astro
    files["src/components/Sandbox.astro"] = [
      "---",
      "// Interactive Web Audio & Live Sandbox",
      "---",
      "",
      '<section class="bg-theme-surface border border-theme-border rounded-2xl p-6 my-10 shadow-2xl" id="sandbox">',
      '  <div class="flex items-center justify-between pb-3 mb-4 border-b border-theme-border">',
      '    <div class="flex items-center gap-2 font-display font-bold text-white text-base">',
      "      <span>⚡</span>",
      "      <span>Interactive Live Execution Sandbox</span>",
      "    </div>",
      '    <span class="font-mono text-xs text-theme-accent font-bold tracking-wider">ONLINE · 100% LOCAL</span>',
      "  </div>",
      '  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">',
      "    <div>",
      '      <p class="text-theme-text-muted text-sm mb-4">',
      "        Dispatch reactive state events and test Web Audio synthesized tones directly in your browser:",
      "      </p>",
      '      <div class="flex gap-2.5 flex-wrap">',
      '        <button id="pulseBtn" class="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all">',
      "          ⚡ Send Pulse",
      "        </button>",
      '        <button id="verifyBtn" class="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all">',
      "          🔍 Verify AST",
      "        </button>",
      '        <button id="clearBtn" class="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all">',
      "          🗑️ Clear",
      "        </button>",
      "      </div>",
      "    </div>",
      '    <div id="sandboxLog" class="bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-theme-accent h-40 overflow-y-auto space-y-1">',
      "      <div>[00:00:01] System initialized. Ready for operations.</div>",
      "      <div>[00:00:02] Connected to local loopback node. Zero cloud latency.</div>",
      "    </div>",
      "  </div>",
      "</section>",
      "",
      "<script>",
      "  let audioCtx = null;",
      "  function playTone(freq, type, duration) {",
      "    try {",
      "      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();",
      "      const osc = audioCtx.createOscillator();",
      "      const gain = audioCtx.createGain();",
      "      osc.type = type || 'sine';",
      "      osc.frequency.setValueAtTime(freq || 440, audioCtx.currentTime);",
      "      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);",
      "      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.15));",
      "      osc.connect(gain);",
      "      gain.connect(audioCtx.destination);",
      "      osc.start();",
      "      osc.stop(audioCtx.currentTime + (duration || 0.15));",
      "    } catch(e) {}",
      "  }",
      "",
      "  function appendLog(msg) {",
      "    const log = document.getElementById('sandboxLog');",
      "    if (!log) return;",
      "    const now = new Date().toTimeString().split(' ')[0];",
      "    const row = document.createElement('div');",
      "    row.textContent = '[' + now + '] ' + msg;",
      "    log.appendChild(row);",
      "    log.scrollTop = log.scrollHeight;",
      "  }",
      "",
      "  document.getElementById('pulseBtn')?.addEventListener('click', () => {",
      "    playTone(660, 'sine', 0.12);",
      "    appendLog('Pulse broadcasted across 21 autonomous agent nodes.');",
      "  });",
      "",
      "  document.getElementById('verifyBtn')?.addEventListener('click', () => {",
      "    playTone(880, 'triangle', 0.2);",
      "    appendLog('Consensus verified with 100% AST integrity.');",
      "  });",
      "",
      "  document.getElementById('clearBtn')?.addEventListener('click', () => {",
      "    playTone(330, 'sine', 0.08);",
      "    const log = document.getElementById('sandboxLog');",
      "    if (log) log.innerHTML = '<div>[00:00:00] Console cleared.</div>';",
      "  });",
      "</script>",
      ""
    ].join("\n");

    // 10. src/components/Features.astro
    var featCards = spec.niche.features.map(function (f) {
      return [
        '  <div class="bg-theme-surface border border-theme-border rounded-2xl p-6 hover:border-theme-border-hover hover:-translate-y-1 hover:shadow-2xl transition-all">',
        '    <div class="text-3xl mb-3">' + f.icon + '</div>',
        '    <h3 class="font-display font-bold text-lg text-white mb-2">' + f.title + '</h3>',
        '    <p class="text-theme-text-muted text-sm leading-relaxed">' + f.desc + '</p>',
        "  </div>"
      ].join("\n");
    }).join("\n");

    files["src/components/Features.astro"] = [
      "---",
      "// Features Grid",
      "---",
      "",
      '<section id="features" class="grid grid-cols-1 md:grid-cols-3 gap-5 my-12">',
      featCards,
      "</section>",
      ""
    ].join("\n");

    // 11. src/components/Metrics.astro
    var metricCards = (spec.niche.metrics || []).map(function (m) {
      return [
        '  <div class="bg-theme-surface/50 border border-theme-border/70 rounded-xl p-5 text-center">',
        '    <div class="font-display font-extrabold text-2xl text-theme-accent mb-1">' + m.value + '</div>',
        '    <div class="text-theme-text-muted text-xs font-mono uppercase tracking-wider">' + m.label + '</div>',
        "  </div>"
      ].join("\n");
    }).join("\n");

    files["src/components/Metrics.astro"] = [
      "---",
      "// High-Density Metrics HUD",
      "---",
      "",
      '<section id="metrics" class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">',
      metricCards,
      "</section>",
      ""
    ].join("\n");

    // 12. src/components/CTA.astro
    files["src/components/CTA.astro"] = [
      "---",
      "interface Props {",
      "  name?: string;",
      "}",
      "const { name = '" + spec.name + "' } = Astro.props;",
      "---",
      "",
      '<section class="bg-gradient-to-b from-theme-surface2 to-theme-surface border border-theme-border rounded-2xl p-10 text-center my-12 shadow-2xl relative overflow-hidden">',
      '  <div class="relative z-10 max-w-xl mx-auto">',
      '    <h2 class="font-display font-extrabold text-3xl text-white mb-3">',
      '      Ready to Deploy <span class="text-theme-accent">{name}</span>?',
      "    </h2>",
      '    <p class="text-theme-text-muted text-sm mb-6">',
      "      Launch your multi-agent application on sovereign infrastructure in seconds.",
      "    </p>",
      '    <button id="bottomCtaBtn" class="bg-theme-accent text-gray-950 px-8 py-3.5 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all">',
      "      ⚡ Get Started Instantly",
      "    </button>",
      "  </div>",
      "</section>",
      "",
      "<script>",
      "  document.getElementById('bottomCtaBtn')?.addEventListener('click', () => {",
      "    alert('⚡ Instant setup started for " + spec.name + "!');",
      "  });",
      "</script>",
      ""
    ].join("\n");

    // 13. src/components/Footer.astro
    files["src/components/Footer.astro"] = [
      "---",
      "interface Props {",
      "  name?: string;",
      "  year?: number;",
      "}",
      "const { name = '" + spec.name + "', year = " + spec.year + " } = Astro.props;",
      "---",
      "",
      '<footer class="border-t border-theme-border pt-8 pb-12 mt-16 text-center text-xs text-theme-text-muted">',
      "  <p>© {year} {name}. Built autonomously with Zoth Studio Rapid Site Engine.</p>",
      "</footer>",
      ""
    ].join("\n");

    // 14. src/pages/index.astro
    files["src/pages/index.astro"] = [
      "---",
      "import Layout from '../layouts/Layout.astro';",
      "import Navbar from '../components/Navbar.astro';",
      "import Hero from '../components/Hero.astro';",
      "import Sandbox from '../components/Sandbox.astro';",
      "import Features from '../components/Features.astro';",
      "import Metrics from '../components/Metrics.astro';",
      "import CTA from '../components/CTA.astro';",
      "import Footer from '../components/Footer.astro';",
      "---",
      "",
      '<Layout title="' + spec.name + " — " + spec.tagline + '" description="' + spec.description + '">',
      '  <Navbar name="' + spec.name + '" />',
      "  <main>",
      '    <Hero name="' + spec.name + '" tagline="' + spec.tagline + '" badge="' + spec.niche.badge + '" desc="' + spec.description + '" />',
      "    <Sandbox />",
      "    <Features />",
      "    <Metrics />",
      '    <CTA name="' + spec.name + '" />',
      "  </main>",
      '  <Footer name="' + spec.name + '" year={' + spec.year + '} />',
      "</Layout>",
      ""
    ].join("\n");

    // 15. README.md
    files["README.md"] = [
      "# " + spec.name + " — Astro 5 Application",
      "",
      "> " + spec.tagline,
      "",
      "Built autonomously with **Zoth Studio Multi-Framework Exporter Engine**.",
      "",
      "## 🛠️ Tech Stack",
      "- **Framework**: Astro 5 (Static Site & Edge Ready)",
      "- **Styling**: Tailwind CSS + Custom Design Tokens (" + spec.theme.name + ")",
      "- **Hosting**: Netlify AX (Node 20 LTS Pinned)",
      "",
      "## 🚀 Quick Start",
      "```bash",
      "# 1. Install dependencies",
      "npm install",
      "",
      "# 2. Start local development server",
      "npm run dev",
      "",
      "# 3. Build for production",
      "npm run build",
      "",
      "# 4. Preview production build",
      "npm run preview",
      "```",
      "",
      "## 📦 Deployment",
      "This repository is pre-configured with `netlify.toml` for seamless 1-click Netlify deployment with Node 20 LTS.",
      ""
    ].join("\n");

    return files;
  }

  // ============================================================================
  // 2. VITE + REACT PROJECT GENERATOR (IN-MEMORY FILE TREE)
  // ============================================================================
  function generateViteReactFiles(rawSpec) {
    var spec = normalizeSpec(rawSpec);
    var files = {};

    // 1. package.json
    files["package.json"] = JSON.stringify({
      name: spec.slug + "-vite-react",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        autoprefixer: "^10.4.20",
        postcss: "^8.4.49",
        tailwindcss: "^3.4.17",
        vite: "^6.0.7"
      }
    }, null, 2);

    // 2. vite.config.js
    files["vite.config.js"] = [
      "import { defineConfig } from 'vite';",
      "import react from '@vitejs/plugin-react';",
      "",
      "// https://vite.dev/config/",
      "export default defineConfig({",
      "  plugins: [react()],",
      "  server: { port: 3000, host: true }",
      "});",
      ""
    ].join("\n");

    // 3. postcss.config.js
    files["postcss.config.js"] = "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n";

    // 4. tailwind.config.js
    files["tailwind.config.js"] = [
      "/** @type {import('tailwindcss').Config} */",
      "export default {",
      "  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],",
      "  theme: {",
      "    extend: {",
      "      colors: {",
      "        'theme-bg': '" + spec.theme.bg + "',",
      "        'theme-surface': '" + spec.theme.surface + "',",
      "        'theme-surface2': '" + spec.theme.surface2 + "',",
      "        'theme-border': '" + spec.theme.border + "',",
      "        'theme-border-hover': '" + spec.theme.border_hover + "',",
      "        'theme-accent': '" + spec.theme.accent + "',",
      "        'theme-accent-glow': '" + spec.theme.accent_glow + "',",
      "        'theme-text': '" + spec.theme.text + "',",
      "        'theme-text-muted': '" + spec.theme.text_muted + "',",
      "        'theme-badge': '" + spec.theme.badge_bg + "',",
      "      },",
      "      fontFamily: {",
      "        display: ['Syne', 'sans-serif'],",
      "        sans: ['Figtree', 'sans-serif'],",
      "        mono: ['\"IBM Plex Mono\"', 'monospace'],",
      "      },",
      "      boxShadow: {",
      "        'glow-accent': '0 0 24px " + spec.theme.accent_glow + "',",
      "        'glow-accent-lg': '0 0 40px " + spec.theme.accent_glow + "',",
      "      }",
      "    },",
      "  },",
      "  plugins: [],",
      "};",
      ""
    ].join("\n");

    // 5. netlify.toml
    files["netlify.toml"] = [
      "[build]",
      '  command = "npm run build"',
      '  publish = "dist"',
      "",
      "[build.environment]",
      '  NODE_VERSION = "20"',
      '  NPM_FLAGS = "--legacy-peer-deps"',
      "",
      "[[redirects]]",
      '  from = "/*"',
      '  to = "/index.html"',
      "  status = 200",
      "",
      "[[headers]]",
      '  for = "/*"',
      "  [headers.values]",
      '    X-Frame-Options = "DENY"',
      '    X-Content-Type-Options = "nosniff"',
      '    Referrer-Policy = "strict-origin-when-cross-origin"',
      ""
    ].join("\n");

    // 6. .gitignore
    files[".gitignore"] = "node_modules/\ndist/\ndist-ssr/\n*.local\n.env\n.env.*\n!.env.example\n.DS_Store\n";

    // 7. index.html
    files["index.html"] = [
      "<!doctype html>",
      '<html lang="en">',
      "  <head>",
      '    <meta charset="UTF-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      "    <title>" + spec.name + " — " + spec.tagline + "</title>",
      '    <meta name="description" content="' + spec.description + '" />',
      '    <meta name="theme-color" content="' + spec.theme.bg + '" />',
      '    <link rel="preconnect" href="https://fonts.googleapis.com" />',
      '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
      '    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />',
      "  </head>",
      '  <body class="bg-theme-bg text-theme-text font-sans antialiased min-h-screen">',
      '    <div id="root"></div>',
      '    <script type="module" src="/src/main.jsx"></script>',
      "  </body>",
      "</html>",
      ""
    ].join("\n");

    // 8. src/index.css
    files["src/index.css"] = [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      ":root {",
      "  --bg: " + spec.theme.bg + ";",
      "  --surface: " + spec.theme.surface + ";",
      "  --surface2: " + spec.theme.surface2 + ";",
      "  --border: " + spec.theme.border + ";",
      "  --border-hover: " + spec.theme.border_hover + ";",
      "  --accent: " + spec.theme.accent + ";",
      "  --accent-glow: " + spec.theme.accent_glow + ";",
      "  --text: " + spec.theme.text + ";",
      "  --text-muted: " + spec.theme.text_muted + ";",
      "  --badge-bg: " + spec.theme.badge_bg + ";",
      "}",
      "",
      "* { box-sizing: border-box; margin: 0; padding: 0; }",
      "body {",
      "  background: var(--bg);",
      "  color: var(--text);",
      "  font-family: 'Figtree', sans-serif;",
      "  line-height: 1.6;",
      "  min-height: 100vh;",
      "  overflow-x: hidden;",
      "}",
      ""
    ].join("\n");

    // 9. src/main.jsx
    files["src/main.jsx"] = [
      "import React from 'react';",
      "import ReactDOM from 'react-dom/client';",
      "import App from './App.jsx';",
      "import './index.css';",
      "",
      "ReactDOM.createRoot(document.getElementById('root')).render(",
      "  <React.StrictMode>",
      "    <App />",
      "  </React.StrictMode>",
      ");",
      ""
    ].join("\n");

    // 10. src/components/Navbar.jsx
    files["src/components/Navbar.jsx"] = [
      "import React from 'react';",
      "",
      "export default function Navbar({ name = '" + spec.name + "' }) {",
      "  const handleAction = () => {",
      "    alert('⚡ Action triggered in " + spec.name + "!');",
      "  };",
      "",
      "  return (",
      '    <header class="flex items-center justify-between py-5 border-b border-theme-border">',
      '      <a href="#" className="flex items-center gap-2.5 font-display font-extrabold text-xl text-white tracking-tight no-underline">',
      '        <span className="w-2.5 h-2.5 rounded-full bg-theme-accent shadow-glow-accent"></span>',
      "        <span>{name}</span>",
      "      </a>",
      '      <nav className="flex items-center gap-5 text-sm font-semibold">',
      '        <a href="#features" className="text-theme-text-muted hover:text-white transition-colors">Features</a>',
      '        <a href="#sandbox" className="text-theme-text-muted hover:text-white transition-colors">Sandbox</a>',
      '        <a href="#metrics" className="text-theme-text-muted hover:text-white transition-colors">Metrics</a>',
      "        <button",
      "          onClick={handleAction}",
      '          className="bg-theme-accent text-gray-950 px-4 py-2 rounded-xl font-display font-bold text-xs shadow-glow-accent hover:brightness-110 transition-all"',
      "        >",
      "          Get Started",
      "        </button>",
      "      </nav>",
      "    </header>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 11. src/components/Hero.jsx
    files["src/components/Hero.jsx"] = [
      "import React from 'react';",
      "",
      "export default function Hero({",
      "  name = '" + spec.name + "',",
      "  tagline = '" + spec.tagline + "',",
      "  badge = '" + spec.niche.badge + "',",
      "  desc = '" + spec.description + "'",
      "}) {",
      "  return (",
      '    <section className="py-20 text-center relative">',
      '      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-badge border border-theme-border text-theme-accent font-mono text-xs font-bold uppercase tracking-wider mb-5">',
      "        {badge}",
      "      </div>",
      '      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5 tracking-tight">',
      "        {name} <br />",
      '        <span className="text-theme-accent shadow-glow-accent">{tagline}</span>',
      "      </h1>",
      '      <p className="text-theme-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">',
      "        {desc}",
      "      </p>",
      '      <div className="flex items-center justify-center gap-3 flex-wrap">',
      "        <button",
      "          onClick={() => alert('⚡ Workstation initialized on local loopback!')}",
      '          className="bg-theme-accent text-gray-950 px-6 py-3 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all"',
      "        >",
      "          ⚡ Launch Workstation",
      "        </button>",
      "        <button",
      "          onClick={() => alert('📖 Documentation manual ready for operator review.')}",
      '          className="bg-white/5 border border-theme-border text-white px-6 py-3 rounded-xl font-display font-bold text-sm hover:border-theme-border-hover transition-all"',
      "        >",
      "          📖 Documentation",
      "        </button>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 12. src/components/Sandbox.jsx
    files["src/components/Sandbox.jsx"] = [
      "import React, { useState, useRef } from 'react';",
      "",
      "export default function Sandbox() {",
      "  const [logs, setLogs] = useState([",
      "    '[00:00:01] System initialized. Ready for operations.',",
      "    '[00:00:02] Connected to local loopback node. Zero cloud latency.'",
      "  ]);",
      "  const audioCtxRef = useRef(null);",
      "",
      "  const playTone = (freq, type = 'sine', duration = 0.15) => {",
      "    try {",
      "      if (!audioCtxRef.current) {",
      "        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();",
      "      }",
      "      const ctx = audioCtxRef.current;",
      "      const osc = ctx.createOscillator();",
      "      const gain = ctx.createGain();",
      "      osc.type = type;",
      "      osc.frequency.setValueAtTime(freq, ctx.currentTime);",
      "      gain.gain.setValueAtTime(0.08, ctx.currentTime);",
      "      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);",
      "      osc.connect(gain);",
      "      gain.connect(ctx.destination);",
      "      osc.start();",
      "      osc.stop(ctx.currentTime + duration);",
      "    } catch (e) {}",
      "  };",
      "",
      "  const handlePulse = () => {",
      "    playTone(660, 'sine', 0.12);",
      "    const now = new Date().toTimeString().split(' ')[0];",
      "    setLogs(prev => [...prev, `[${now}] Pulse broadcasted across 21 autonomous agent nodes.`]);",
      "  };",
      "",
      "  const handleVerify = () => {",
      "    playTone(880, 'triangle', 0.2);",
      "    const now = new Date().toTimeString().split(' ')[0];",
      "    setLogs(prev => [...prev, `[${now}] Consensus verified with 100% AST integrity.`]);",
      "  };",
      "",
      "  const handleClear = () => {",
      "    playTone(330, 'sine', 0.08);",
      "    setLogs(['[00:00:00] Console cleared.']);",
      "  };",
      "",
      "  return (",
      '    <section className="bg-theme-surface border border-theme-border rounded-2xl p-6 my-10 shadow-2xl" id="sandbox">',
      '      <div className="flex items-center justify-between pb-3 mb-4 border-b border-theme-border">',
      '        <div className="flex items-center gap-2 font-display font-bold text-white text-base">',
      "          <span>⚡</span>",
      "          <span>Interactive Live Execution Sandbox</span>",
      "        </div>",
      '        <span className="font-mono text-xs text-theme-accent font-bold tracking-wider">ONLINE · 100% LOCAL</span>',
      "      </div>",
      '      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">',
      "        <div>",
      '          <p className="text-theme-text-muted text-sm mb-4">',
      "            Dispatch reactive state events and test Web Audio synthesized tones directly in your browser:",
      "          </p>",
      '          <div className="flex gap-2.5 flex-wrap">',
      "            <button",
      "              onClick={handlePulse}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              ⚡ Send Pulse",
      "            </button>",
      "            <button",
      "              onClick={handleVerify}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              🔍 Verify AST",
      "            </button>",
      "            <button",
      "              onClick={handleClear}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              🗑️ Clear",
      "            </button>",
      "          </div>",
      "        </div>",
      '        <div className="bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-theme-accent h-40 overflow-y-auto space-y-1">',
      "          {logs.map((log, i) => (",
      "            <div key={i}>{log}</div>",
      "          ))}",
      "        </div>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 13. src/components/Features.jsx
    files["src/components/Features.jsx"] = [
      "import React from 'react';",
      "",
      "const FEATURES_DATA = " + JSON.stringify(spec.niche.features, null, 2) + ";",
      "",
      "export default function Features() {",
      "  return (",
      '    <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-5 my-12">',
      "      {FEATURES_DATA.map((f, i) => (",
      '        <div key={i} className="bg-theme-surface border border-theme-border rounded-2xl p-6 hover:border-theme-border-hover hover:-translate-y-1 hover:shadow-2xl transition-all">',
      '          <div className="text-3xl mb-3">{f.icon}</div>',
      '          <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>',
      '          <p className="text-theme-text-muted text-sm leading-relaxed">{f.desc}</p>',
      "        </div>",
      "      ))}",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 14. src/components/Metrics.jsx
    files["src/components/Metrics.jsx"] = [
      "import React from 'react';",
      "",
      "const METRICS_DATA = " + JSON.stringify(spec.niche.metrics || [], null, 2) + ";",
      "",
      "export default function Metrics() {",
      "  return (",
      '    <section id="metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">',
      "      {METRICS_DATA.map((m, i) => (",
      '        <div key={i} className="bg-theme-surface/50 border border-theme-border/70 rounded-xl p-5 text-center">',
      '          <div className="font-display font-extrabold text-2xl text-theme-accent mb-1">{m.value}</div>',
      '          <div className="text-theme-text-muted text-xs font-mono uppercase tracking-wider">{m.label}</div>',
      "        </div>",
      "      ))}",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 15. src/components/CTA.jsx
    files["src/components/CTA.jsx"] = [
      "import React from 'react';",
      "",
      "export default function CTA({ name = '" + spec.name + "' }) {",
      "  return (",
      '    <section className="bg-gradient-to-b from-theme-surface2 to-theme-surface border border-theme-border rounded-2xl p-10 text-center my-12 shadow-2xl relative overflow-hidden">',
      '      <div className="relative z-10 max-w-xl mx-auto">',
      '        <h2 className="font-display font-extrabold text-3xl text-white mb-3">',
      '          Ready to Deploy <span className="text-theme-accent">{name}</span>?',
      "        </h2>",
      '        <p className="text-theme-text-muted text-sm mb-6">',
      "          Launch your multi-agent application on sovereign infrastructure in seconds.",
      "        </p>",
      "        <button",
      "          onClick={() => alert('⚡ Instant setup started for " + spec.name + "!')}",
      '          className="bg-theme-accent text-gray-950 px-8 py-3.5 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all"',
      "        >",
      "          ⚡ Get Started Instantly",
      "        </button>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 16. src/components/Footer.jsx
    files["src/components/Footer.jsx"] = [
      "import React from 'react';",
      "",
      "export default function Footer({ name = '" + spec.name + "', year = " + spec.year + " }) {",
      "  return (",
      '    <footer className="border-t border-theme-border pt-8 pb-12 mt-16 text-center text-xs text-theme-text-muted">',
      "      <p>© {year} {name}. Built autonomously with Zoth Studio Rapid Site Engine.</p>",
      "    </footer>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 17. src/App.jsx
    files["src/App.jsx"] = [
      "import React from 'react';",
      "import Navbar from './components/Navbar';",
      "import Hero from './components/Hero';",
      "import Sandbox from './components/Sandbox';",
      "import Features from './components/Features';",
      "import Metrics from './components/Metrics';",
      "import CTA from './components/CTA';",
      "import Footer from './components/Footer';",
      "",
      "export default function App() {",
      "  return (",
      '    <div className="max-w-6xl mx-auto px-5 py-6">',
      '      <Navbar name="' + spec.name + '" />',
      "      <main>",
      "        <Hero",
      '          name="' + spec.name + '"',
      '          tagline="' + spec.tagline + '"',
      '          badge="' + spec.niche.badge + '"',
      '          desc="' + spec.description + '"',
      "        />",
      "        <Sandbox />",
      "        <Features />",
      "        <Metrics />",
      '        <CTA name="' + spec.name + '" />',
      "      </main>",
      '      <Footer name="' + spec.name + '" year={' + spec.year + '} />',
      "    </div>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 18. README.md
    files["README.md"] = [
      "# " + spec.name + " — Vite + React Application",
      "",
      "> " + spec.tagline,
      "",
      "Built autonomously with **Zoth Studio Multi-Framework Exporter Engine**.",
      "",
      "## 🛠️ Tech Stack",
      "- **Framework**: React 18 + Vite 6",
      "- **Styling**: Tailwind CSS + Custom Design Tokens (" + spec.theme.name + ")",
      "- **Hosting**: Netlify AX (Node 20 LTS Pinned + SPA Fallback)",
      "",
      "## 🚀 Quick Start",
      "```bash",
      "# 1. Install dependencies",
      "npm install",
      "",
      "# 2. Start local development server",
      "npm run dev",
      "",
      "# 3. Build for production",
      "npm run build",
      "",
      "# 4. Preview production build",
      "npm run preview",
      "```",
      "",
      "## 📦 Deployment",
      "This repository is pre-configured with `netlify.toml` for seamless 1-click Netlify deployment with Node 20 LTS and SPA redirect rules.",
      ""
    ].join("\n");

    return files;
  }

  // ============================================================================
  // 3. NEXT.JS 15 PROJECT GENERATOR (IN-MEMORY FILE TREE)
  // ============================================================================
  function generateNextjsFiles(rawSpec) {
    var spec = normalizeSpec(rawSpec);
    var files = {};

    // 1. package.json
    files["package.json"] = JSON.stringify({
      name: spec.slug + "-nextjs",
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        preview: "next start"
      },
      dependencies: {
        next: "^15.1.4",
        react: "^19.0.0",
        "react-dom": "^19.0.0"
      },
      devDependencies: {
        "@types/node": "^20.17.12",
        "@types/react": "^19.0.4",
        "@types/react-dom": "^19.0.2",
        autoprefixer: "^10.4.20",
        postcss: "^8.4.49",
        tailwindcss: "^3.4.17",
        typescript: "^5.7.3"
      }
    }, null, 2);

    // 2. next.config.js
    files["next.config.js"] = "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n};\n\nmodule.exports = nextConfig;\n";

    // 3. tsconfig.json
    files["tsconfig.json"] = JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: {
          "@/*": ["./*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);

    // 4. postcss.config.mjs
    files["postcss.config.mjs"] = "/** @type {import('postcss-load-config').Config} */\nconst config = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n\nexport default config;\n";

    // 5. tailwind.config.ts
    files["tailwind.config.ts"] = [
      "import type { Config } from 'tailwindcss';",
      "",
      "const config: Config = {",
      "  content: [",
      "    './pages/**/*.{js,ts,jsx,tsx,mdx}',",
      "    './components/**/*.{js,ts,jsx,tsx,mdx}',",
      "    './app/**/*.{js,ts,jsx,tsx,mdx}',",
      "  ],",
      "  theme: {",
      "    extend: {",
      "      colors: {",
      "        'theme-bg': '" + spec.theme.bg + "',",
      "        'theme-surface': '" + spec.theme.surface + "',",
      "        'theme-surface2': '" + spec.theme.surface2 + "',",
      "        'theme-border': '" + spec.theme.border + "',",
      "        'theme-border-hover': '" + spec.theme.border_hover + "',",
      "        'theme-accent': '" + spec.theme.accent + "',",
      "        'theme-accent-glow': '" + spec.theme.accent_glow + "',",
      "        'theme-text': '" + spec.theme.text + "',",
      "        'theme-text-muted': '" + spec.theme.text_muted + "',",
      "        'theme-badge': '" + spec.theme.badge_bg + "',",
      "      },",
      "      fontFamily: {",
      "        display: ['Syne', 'sans-serif'],",
      "        sans: ['Figtree', 'sans-serif'],",
      "        mono: ['\"IBM Plex Mono\"', 'monospace'],",
      "      },",
      "      boxShadow: {",
      "        'glow-accent': '0 0 24px " + spec.theme.accent_glow + "',",
      "        'glow-accent-lg': '0 0 40px " + spec.theme.accent_glow + "',",
      "      }",
      "    },",
      "  },",
      "  plugins: [],",
      "};",
      "",
      "export default config;",
      ""
    ].join("\n");

    // 6. netlify.toml
    files["netlify.toml"] = [
      "[build]",
      '  command = "npm run build"',
      '  publish = ".next"',
      "",
      "[build.environment]",
      '  NODE_VERSION = "20"',
      '  NPM_FLAGS = "--legacy-peer-deps"',
      "",
      "[[headers]]",
      '  for = "/*"',
      "  [headers.values]",
      '    X-Frame-Options = "DENY"',
      '    X-Content-Type-Options = "nosniff"',
      '    Referrer-Policy = "strict-origin-when-cross-origin"',
      ""
    ].join("\n");

    // 7. .gitignore
    files[".gitignore"] = "node_modules/\n.next/\nout/\nbuild/\ndist/\n.env*.local\n.env\n.DS_Store\n*.tsbuildinfo\nnext-env.d.ts\n";

    // 8. app/globals.css
    files["app/globals.css"] = [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      ":root {",
      "  --bg: " + spec.theme.bg + ";",
      "  --surface: " + spec.theme.surface + ";",
      "  --surface2: " + spec.theme.surface2 + ";",
      "  --border: " + spec.theme.border + ";",
      "  --border-hover: " + spec.theme.border_hover + ";",
      "  --accent: " + spec.theme.accent + ";",
      "  --accent-glow: " + spec.theme.accent_glow + ";",
      "  --text: " + spec.theme.text + ";",
      "  --text-muted: " + spec.theme.text_muted + ";",
      "  --badge-bg: " + spec.theme.badge_bg + ";",
      "}",
      "",
      "* { box-sizing: border-box; margin: 0; padding: 0; }",
      "body {",
      "  background: var(--bg);",
      "  color: var(--text);",
      "  font-family: 'Figtree', sans-serif;",
      "  line-height: 1.6;",
      "  min-height: 100vh;",
      "  overflow-x: hidden;",
      "}",
      ""
    ].join("\n");

    // 9. app/layout.tsx
    files["app/layout.tsx"] = [
      "import type { Metadata } from 'next';",
      "import './globals.css';",
      "",
      "export const metadata: Metadata = {",
      "  title: '" + spec.name + " — " + spec.tagline + "',",
      "  description: '" + spec.description + "',",
      "};",
      "",
      "export default function RootLayout({",
      "  children,",
      "}: {",
      "  children: React.ReactNode;",
      "}) {",
      "  return (",
      '    <html lang="en">',
      "      <head>",
      '        <link rel="preconnect" href="https://fonts.googleapis.com" />',
      '        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />',
      '        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />',
      "      </head>",
      '      <body className="bg-theme-bg text-theme-text font-sans antialiased min-h-screen">',
      '        <div className="max-w-6xl mx-auto px-5 py-6">',
      "          {children}",
      "        </div>",
      "      </body>",
      "    </html>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 10. components/Navbar.tsx
    files["components/Navbar.tsx"] = [
      "'use client';",
      "",
      "import React from 'react';",
      "",
      "interface NavbarProps {",
      "  name?: string;",
      "}",
      "",
      "export default function Navbar({ name = '" + spec.name + "' }: NavbarProps) {",
      "  const handleAction = () => {",
      "    alert('⚡ Action triggered in " + spec.name + "!');",
      "  };",
      "",
      "  return (",
      '    <header className="flex items-center justify-between py-5 border-b border-theme-border">',
      '      <a href="#" className="flex items-center gap-2.5 font-display font-extrabold text-xl text-white tracking-tight no-underline">',
      '        <span className="w-2.5 h-2.5 rounded-full bg-theme-accent shadow-glow-accent"></span>',
      "        <span>{name}</span>",
      "      </a>",
      '      <nav className="flex items-center gap-5 text-sm font-semibold">',
      '        <a href="#features" className="text-theme-text-muted hover:text-white transition-colors">Features</a>',
      '        <a href="#sandbox" className="text-theme-text-muted hover:text-white transition-colors">Sandbox</a>',
      '        <a href="#metrics" className="text-theme-text-muted hover:text-white transition-colors">Metrics</a>',
      "        <button",
      "          onClick={handleAction}",
      '          className="bg-theme-accent text-gray-950 px-4 py-2 rounded-xl font-display font-bold text-xs shadow-glow-accent hover:brightness-110 transition-all"',
      "        >",
      "          Get Started",
      "        </button>",
      "      </nav>",
      "    </header>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 11. components/Hero.tsx
    files["components/Hero.tsx"] = [
      "'use client';",
      "",
      "import React from 'react';",
      "",
      "interface HeroProps {",
      "  name?: string;",
      "  tagline?: string;",
      "  badge?: string;",
      "  desc?: string;",
      "}",
      "",
      "export default function Hero({",
      "  name = '" + spec.name + "',",
      "  tagline = '" + spec.tagline + "',",
      "  badge = '" + spec.niche.badge + "',",
      "  desc = '" + spec.description + "'",
      "}: HeroProps) {",
      "  return (",
      '    <section className="py-20 text-center relative">',
      '      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-badge border border-theme-border text-theme-accent font-mono text-xs font-bold uppercase tracking-wider mb-5">',
      "        {badge}",
      "      </div>",
      '      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5 tracking-tight">',
      "        {name} <br />",
      '        <span className="text-theme-accent shadow-glow-accent">{tagline}</span>',
      "      </h1>",
      '      <p className="text-theme-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">',
      "        {desc}",
      "      </p>",
      '      <div className="flex items-center justify-center gap-3 flex-wrap">',
      "        <button",
      "          onClick={() => alert('⚡ Workstation initialized on local loopback!')}",
      '          className="bg-theme-accent text-gray-950 px-6 py-3 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all"',
      "        >",
      "          ⚡ Launch Workstation",
      "        </button>",
      "        <button",
      "          onClick={() => alert('📖 Documentation manual ready for operator review.')}",
      '          className="bg-white/5 border border-theme-border text-white px-6 py-3 rounded-xl font-display font-bold text-sm hover:border-theme-border-hover transition-all"',
      "        >",
      "          📖 Documentation",
      "        </button>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 12. components/Sandbox.tsx
    files["components/Sandbox.tsx"] = [
      "'use client';",
      "",
      "import React, { useState, useRef } from 'react';",
      "",
      "export default function Sandbox() {",
      "  const [logs, setLogs] = useState<string[]>([",
      "    '[00:00:01] System initialized. Ready for operations.',",
      "    '[00:00:02] Connected to local loopback node. Zero cloud latency.'",
      "  ]);",
      "  const audioCtxRef = useRef<AudioContext | null>(null);",
      "",
      "  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.15) => {",
      "    try {",
      "      if (typeof window === 'undefined') return;",
      "      if (!audioCtxRef.current) {",
      "        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();",
      "      }",
      "      const ctx = audioCtxRef.current;",
      "      const osc = ctx.createOscillator();",
      "      const gain = ctx.createGain();",
      "      osc.type = type;",
      "      osc.frequency.setValueAtTime(freq, ctx.currentTime);",
      "      gain.gain.setValueAtTime(0.08, ctx.currentTime);",
      "      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);",
      "      osc.connect(gain);",
      "      gain.connect(ctx.destination);",
      "      osc.start();",
      "      osc.stop(ctx.currentTime + duration);",
      "    } catch (e) {}",
      "  };",
      "",
      "  const handlePulse = () => {",
      "    playTone(660, 'sine', 0.12);",
      "    const now = new Date().toTimeString().split(' ')[0];",
      "    setLogs(prev => [...prev, `[${now}] Pulse broadcasted across 21 autonomous agent nodes.`]);",
      "  };",
      "",
      "  const handleVerify = () => {",
      "    playTone(880, 'triangle', 0.2);",
      "    const now = new Date().toTimeString().split(' ')[0];",
      "    setLogs(prev => [...prev, `[${now}] Consensus verified with 100% AST integrity.`]);",
      "  };",
      "",
      "  const handleClear = () => {",
      "    playTone(330, 'sine', 0.08);",
      "    setLogs(['[00:00:00] Console cleared.']);",
      "  };",
      "",
      "  return (",
      '    <section className="bg-theme-surface border border-theme-border rounded-2xl p-6 my-10 shadow-2xl" id="sandbox">',
      '      <div className="flex items-center justify-between pb-3 mb-4 border-b border-theme-border">',
      '        <div className="flex items-center gap-2 font-display font-bold text-white text-base">',
      "          <span>⚡</span>",
      "          <span>Interactive Live Execution Sandbox</span>",
      "        </div>",
      '        <span className="font-mono text-xs text-theme-accent font-bold tracking-wider">ONLINE · 100% LOCAL</span>',
      "      </div>",
      '      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">',
      "        <div>",
      '          <p className="text-theme-text-muted text-sm mb-4">',
      "            Dispatch reactive state events and test Web Audio synthesized tones directly in your browser:",
      "          </p>",
      '          <div className="flex gap-2.5 flex-wrap">',
      "            <button",
      "              onClick={handlePulse}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              ⚡ Send Pulse",
      "            </button>",
      "            <button",
      "              onClick={handleVerify}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              🔍 Verify AST",
      "            </button>",
      "            <button",
      "              onClick={handleClear}",
      '              className="bg-white/5 border border-theme-border text-white px-3.5 py-2 rounded-xl font-mono text-xs font-semibold hover:border-theme-border-hover transition-all"',
      "            >",
      "              🗑️ Clear",
      "            </button>",
      "          </div>",
      "        </div>",
      '        <div className="bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-theme-accent h-40 overflow-y-auto space-y-1">',
      "          {logs.map((log, i) => (",
      "            <div key={i}>{log}</div>",
      "          ))}",
      "        </div>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 13. components/Features.tsx
    files["components/Features.tsx"] = [
      "import React from 'react';",
      "",
      "interface FeatureItem {",
      "  icon: string;",
      "  title: string;",
      "  desc: string;",
      "}",
      "",
      "const FEATURES_DATA: FeatureItem[] = " + JSON.stringify(spec.niche.features, null, 2) + ";",
      "",
      "export default function Features() {",
      "  return (",
      '    <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-5 my-12">',
      "      {FEATURES_DATA.map((f, i) => (",
      '        <div key={i} className="bg-theme-surface border border-theme-border rounded-2xl p-6 hover:border-theme-border-hover hover:-translate-y-1 hover:shadow-2xl transition-all">',
      '          <div className="text-3xl mb-3">{f.icon}</div>',
      '          <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>',
      '          <p className="text-theme-text-muted text-sm leading-relaxed">{f.desc}</p>',
      "        </div>",
      "      ))}",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 14. components/Metrics.tsx
    files["components/Metrics.tsx"] = [
      "import React from 'react';",
      "",
      "interface MetricItem {",
      "  label: string;",
      "  value: string;",
      "}",
      "",
      "const METRICS_DATA: MetricItem[] = " + JSON.stringify(spec.niche.metrics || [], null, 2) + ";",
      "",
      "export default function Metrics() {",
      "  return (",
      '    <section id="metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">',
      "      {METRICS_DATA.map((m, i) => (",
      '        <div key={i} className="bg-theme-surface/50 border border-theme-border/70 rounded-xl p-5 text-center">',
      '          <div className="font-display font-extrabold text-2xl text-theme-accent mb-1">{m.value}</div>',
      '          <div className="text-theme-text-muted text-xs font-mono uppercase tracking-wider">{m.label}</div>',
      "        </div>",
      "      ))}",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 15. components/CTA.tsx
    files["components/CTA.tsx"] = [
      "'use client';",
      "",
      "import React from 'react';",
      "",
      "interface CTAProps {",
      "  name?: string;",
      "}",
      "",
      "export default function CTA({ name = '" + spec.name + "' }: CTAProps) {",
      "  return (",
      '    <section className="bg-gradient-to-b from-theme-surface2 to-theme-surface border border-theme-border rounded-2xl p-10 text-center my-12 shadow-2xl relative overflow-hidden">',
      '      <div className="relative z-10 max-w-xl mx-auto">',
      '        <h2 className="font-display font-extrabold text-3xl text-white mb-3">',
      '          Ready to Deploy <span className="text-theme-accent">{name}</span>?',
      "        </h2>",
      '        <p className="text-theme-text-muted text-sm mb-6">',
      "          Launch your multi-agent application on sovereign infrastructure in seconds.",
      "        </p>",
      "        <button",
      "          onClick={() => alert('⚡ Instant setup started for " + spec.name + "!')}",
      '          className="bg-theme-accent text-gray-950 px-8 py-3.5 rounded-xl font-display font-bold text-sm shadow-glow-accent hover:scale-105 transition-all"',
      "        >",
      "          ⚡ Get Started Instantly",
      "        </button>",
      "      </div>",
      "    </section>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 16. components/Footer.tsx
    files["components/Footer.tsx"] = [
      "import React from 'react';",
      "",
      "interface FooterProps {",
      "  name?: string;",
      "  year?: number;",
      "}",
      "",
      "export default function Footer({ name = '" + spec.name + "', year = " + spec.year + " }: FooterProps) {",
      "  return (",
      '    <footer className="border-t border-theme-border pt-8 pb-12 mt-16 text-center text-xs text-theme-text-muted">',
      "      <p>© {year} {name}. Built autonomously with Zoth Studio Rapid Site Engine.</p>",
      "    </footer>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 17. app/page.tsx
    files["app/page.tsx"] = [
      "import Navbar from '@/components/Navbar';",
      "import Hero from '@/components/Hero';",
      "import Sandbox from '@/components/Sandbox';",
      "import Features from '@/components/Features';",
      "import Metrics from '@/components/Metrics';",
      "import CTA from '@/components/CTA';",
      "import Footer from '@/components/Footer';",
      "",
      "export default function HomePage() {",
      "  return (",
      "    <>",
      '      <Navbar name="' + spec.name + '" />',
      "      <main>",
      "        <Hero",
      '          name="' + spec.name + '"',
      '          tagline="' + spec.tagline + '"',
      '          badge="' + spec.niche.badge + '"',
      '          desc="' + spec.description + '"',
      "        />",
      "        <Sandbox />",
      "        <Features />",
      "        <Metrics />",
      '        <CTA name="' + spec.name + '" />',
      "      </main>",
      '      <Footer name="' + spec.name + '" year={' + spec.year + '} />',
      "    </>",
      "  );",
      "}",
      ""
    ].join("\n");

    // 18. README.md
    files["README.md"] = [
      "# " + spec.name + " — Next.js 15 Application",
      "",
      "> " + spec.tagline,
      "",
      "Built autonomously with **Zoth Studio Multi-Framework Exporter Engine**.",
      "",
      "## 🛠️ Tech Stack",
      "- **Framework**: Next.js 15 (App Router + React 19 + TypeScript)",
      "- **Styling**: Tailwind CSS + Custom Design Tokens (" + spec.theme.name + ")",
      "- **Hosting**: Netlify AX (Node 20 LTS Pinned)",
      "",
      "## 🚀 Quick Start",
      "```bash",
      "# 1. Install dependencies",
      "npm install",
      "",
      "# 2. Start local development server",
      "npm run dev",
      "",
      "# 3. Build for production",
      "npm run build",
      "",
      "# 4. Start production server",
      "npm run start",
      "```",
      "",
      "## 📦 Deployment",
      "This repository is pre-configured with `netlify.toml` for seamless 1-click Netlify deployment with Node 20 LTS.",
      ""
    ].join("\n");

    return files;
  }

  // ============================================================================
  // UNIVERSAL EXPORTER FACADE
  // ============================================================================
  function exportProjectFiles(spec, framework) {
    var fw = (framework || "all").toLowerCase().trim();
    if (fw === "astro") {
      return { astro: generateAstroFiles(spec) };
    }
    if (fw === "vite-react" || fw === "react" || fw === "vite") {
      return { "vite-react": generateViteReactFiles(spec) };
    }
    if (fw === "nextjs" || fw === "next" || fw === "next-15") {
      return { nextjs: generateNextjsFiles(spec) };
    }
    if (fw === "sveltekit" || fw === "svelte") {
      return { "vite-react": generateViteReactFiles(spec) };
    }
    if (fw === "static_html" || fw === "static" || fw === "html" || fw === "html5") {
      return { astro: generateAstroFiles(spec) };
    }
    if (fw === "all" || !fw) {
      return {
        astro: generateAstroFiles(spec),
        "vite-react": generateViteReactFiles(spec),
        nextjs: generateNextjsFiles(spec)
      };
    }
    // Safe default to all rather than throwing an exception
    return {
      astro: generateAstroFiles(spec),
      "vite-react": generateViteReactFiles(spec),
      nextjs: generateNextjsFiles(spec)
    };
  }

  // Browser ZIP downloader helper (requires JSZip or loads dynamically)
  function downloadZipBundle(spec, framework, JSZipConstructor) {
    var jszip = JSZipConstructor || (typeof window !== "undefined" ? window.JSZip : null);
    if (!jszip) {
      throw new Error("JSZip is required for browser zip downloads.");
    }
    var zip = new jszip();
    var exported = exportProjectFiles(spec, framework);
    var specNorm = normalizeSpec(spec);

    Object.keys(exported).forEach(function (fwKey) {
      var folder = Object.keys(exported).length > 1 ? zip.folder(specNorm.slug + "-" + fwKey) : zip;
      var fileTree = exported[fwKey];
      Object.keys(fileTree).forEach(function (filePath) {
        folder.file(filePath, fileTree[filePath]);
      });
    });

    return zip.generateAsync({ type: "blob" }).then(function (content) {
      if (typeof document !== "undefined") {
        var url = URL.createObjectURL(content);
        var a = document.createElement("a");
        a.href = url;
        a.download = specNorm.slug + "-" + (framework === "all" ? "all-frameworks" : framework) + ".zip";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }
      return content;
    });
  }

  return {
    THEMES: THEMES,
    NICHES: NICHES,
    normalizeSpec: normalizeSpec,
    generateAstroFiles: generateAstroFiles,
    generateViteReactFiles: generateViteReactFiles,
    generateNextjsFiles: generateNextjsFiles,
    exportProjectFiles: exportProjectFiles,
    downloadZipBundle: downloadZipBundle
  };
});
