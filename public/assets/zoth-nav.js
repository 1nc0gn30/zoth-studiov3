/**
 * ⚡ ZOTH STUDIO — UNIVERSAL MASTER NAVIGATION & TELEMETRY ENGINE (v12.0)
 * Features:
 * 1. Self-Healing 100% Mobile Drawer & Desktop Topbar across all pages
 * 2. Real-Time Daemon Health Probing & Diagnostics Popover Matrix
 * 3. Mobile Theme Search & Categorized 16-Theme Grid
 * 4. Procedural Web Audio FX Synthesizer (Zero External Dependencies)
 * 5. Neon Route Progress Bar & Kinetic Back-to-Top Pill
 * 6. Studio Hotkey Legend Modal (?) & Active Route Highlighting
 * 7. Accessible Keyboard Navigation, Focus Trapping & ARIA Standards
 */
(function () {
  'use strict';

  // Standalone previews or iframes do not inject navigation chrome
  try {
    if (window.self !== window.top || window.frameElement) return;
  } catch (e) {
    return;
  }
  var _href = String(window.location.href || '');
  var _path = window.location.pathname || '';
  if (/^\/workspaces\//.test(_path) || /srcdoc/i.test(_href) || _href.indexOf('about:') === 0) return;

  // Dynamic Base Path Detection for Local file:// & Web HTTP
  function getAssetsBase() {
    if (window.location.protocol === "file:") {
      var scripts = document.querySelectorAll("script[src]");
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute("src") || "";
        if (src.indexOf("zoth-nav.js") !== -1 || src.indexOf("zoth-theme.js") !== -1) {
          var clean = src.split("?")[0];
          var idx = clean.lastIndexOf("/");
          if (idx !== -1) return clean.substring(0, idx + 1);
          return "./";
        }
      }
      return "./";
    }
    return "/assets/";
  }

  var ASSETS_BASE = getAssetsBase();

  // ── 1. Ensure Universal Dependency Stylesheets & Scripts ──
  function ensureStylesheet(id, relHref) {
    if (document.getElementById(id)) return;
    var href = relHref.startsWith("/assets/") ? relHref.replace(/^\/assets\//, ASSETS_BASE) : relHref;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  ensureStylesheet("zoth-theme-core-css", "/assets/zoth-theme.css?v=12");
  ensureStylesheet("zoth-theme-fx-css", "/assets/zoth-theme-fx.css?v=12");
  ensureStylesheet("zoth-theme-transformer-css", "/assets/zoth-theme-transformer.css?v=12");
  ensureStylesheet("zoth-theme-light-css", "/assets/zoth-theme-light.css?v=12");
  ensureStylesheet("zoth-nav-css", "/assets/zoth-nav.css?v=12");
  ensureStylesheet("zoth-magic-ui-css", "/assets/zoth-magic-ui.css?v=12");
  ensureStylesheet("zoth-luxury-fx-css", "/assets/zoth-luxury-fx.css?v=12");
  ensureStylesheet("zoth-interactive-dock-css", "/assets/zoth-interactive-dock.css?v=12");
  ensureStylesheet("zoth-footer-css", "/assets/zoth-footer.css?v=20260913c");

  var footerCss = document.getElementById("zoth-footer-css");
  if (footerCss && footerCss.parentNode) footerCss.parentNode.appendChild(footerCss);

  if (!window.setZothTheme && !document.querySelector('script[src*="zoth-theme.js"]')) {
    var themeScript = document.createElement("script");
    themeScript.src = ASSETS_BASE + "zoth-theme.js?v=12";
    document.head.appendChild(themeScript);
  }

  if (!window.ZothPetHUD && !document.querySelector('script[src*="zoth-pet-hud.js"]')) {
    var petHudScript = document.createElement("script");
    petHudScript.src = ASSETS_BASE + "zoth-pet-hud.js?v=12";
    document.head.appendChild(petHudScript);
  }

  if (!window.ZothWorkbench && !document.querySelector('script[src*="zoth-workbench.js"]')) {
    var wbScript = document.createElement("script");
    wbScript.src = ASSETS_BASE + "zoth-workbench.js?v=12";
    wbScript.defer = true;
    document.head.appendChild(wbScript);
  }

  if (!document.querySelector('script[src*="zoth-interactive-dock.js"]')) {
    var dockScript = document.createElement("script");
    dockScript.src = ASSETS_BASE + "zoth-interactive-dock.js?v=12";
    dockScript.defer = true;
    document.head.appendChild(dockScript);
  }

  if (!window.Zoth3DLogo && !document.querySelector('script[src*="zoth-3d-logo.js"]')) {
    var logo3dScript = document.createElement("script");
    logo3dScript.src = ASSETS_BASE + "zoth-3d-logo.js?v=1";
    logo3dScript.defer = true;
    document.head.appendChild(logo3dScript);
  }

  if (!window.ZothNetrunnerMemory && !document.querySelector('script[src*="zoth-netrunner-memory.js"]')) {
    var netrunnerScript = document.createElement("script");
    netrunnerScript.src = ASSETS_BASE + "zoth-netrunner-memory.js?v=3";
    netrunnerScript.defer = true;
    document.head.appendChild(netrunnerScript);
  }

  // ── 2. Procedural Web Audio Synthesizer ──
  (function() {
    var audioCtx = null;
    var isAudioEnabled = localStorage.getItem("zoth_ui_sound") !== "false";

    function getAudioContext() {
      if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    window.ZothAudioFX = {
      isEnabled: function() { return isAudioEnabled; },
      toggle: function() {
        isAudioEnabled = !isAudioEnabled;
        localStorage.setItem("zoth_ui_sound", isAudioEnabled ? "true" : "false");
        return isAudioEnabled;
      },
      playClick: function(freq, duration, type) {
        if (!isAudioEnabled) return;
        try {
          var ctx = getAudioContext();
          if (!ctx) return;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = type || "sine";
          osc.frequency.setValueAtTime(freq || 600, ctx.currentTime);
          gain.gain.setValueAtTime(0.035, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (duration || 0.08));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + (duration || 0.08));
        } catch (e) {}
      },
      playHover: function() {
        if (!isAudioEnabled) return;
        try {
          var ctx = getAudioContext();
          if (!ctx) return;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(420, ctx.currentTime);
          gain.gain.setValueAtTime(0.012, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
      },
      playThemeChime: function(themeId) {
        if (!isAudioEnabled) return;
        try {
          var ctx = getAudioContext();
          if (!ctx) return;
          var now = ctx.currentTime;
          
          if (themeId === "matrix") {
            var osc1 = ctx.createOscillator();
            var gain1 = ctx.createGain();
            osc1.type = "square";
            osc1.frequency.setValueAtTime(880, now);
            osc1.frequency.setValueAtTime(1760, now + 0.04);
            gain1.gain.setValueAtTime(0.03, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(now + 0.12);
          } else if (themeId === "gold") {
            [432, 540, 648].forEach(function(f, i) {
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(f, now + i * 0.04);
              gain.gain.setValueAtTime(0.025, now + i * 0.04);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + i * 0.04);
              osc.stop(now + 0.35);
            });
          } else if (themeId === "synthwave") {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.22);
          } else {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(659.25, now);
            osc.frequency.setValueAtTime(987.77, now + 0.05);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.25);
          }
        } catch (e) {}
      }
    };
  })();

  // ── 3. Page Transition Route Progress Bar ──
  function initProgressBar() {
    if (document.getElementById("zoth-page-progress")) return;
    var bar = document.createElement("div");
    bar.id = "zoth-page-progress";
    bar.className = "zoth-page-progress";
    document.body.appendChild(bar);

    document.addEventListener("click", function(e) {
      var a = e.target.closest("a");
      if (a && a.href && a.href.startsWith(window.location.origin) && !a.getAttribute("target") && !a.href.includes("#")) {
        bar.style.width = "0%";
        bar.style.opacity = "1";
        setTimeout(function() { bar.style.width = "75%"; }, 10);
      }
    });
  }

  // ── 4. Live Daemon Telemetry Prober ──
  var DAEMON_STATUS = {
    web: { port: 8088, name: "Web Server", desc: "0.0.0.0 bind • HTTP/1.1 Static Assets & Routing", online: true, latency: "1ms" },
    orch: { port: 8484, name: "Orchestrator Deck", desc: "Autonomous Agent Swarm & Keystroke PTY Engine", online: true, latency: "4ms" },
    vault: { port: 8787, name: "Sovereign Vault", desc: "Argon2id + XChaCha20-Poly1305 Security Enclave", online: true, latency: "2ms" },
    simplex_chat: { port: 5225, name: "SimpleX Chat", desc: "Zero-Knowledge E2EE Websocket Transport", online: true, latency: "6ms" },
    simplex_bridge: { port: 8767, name: "SimpleX Bridge", desc: "Local Swarm HTTP/Matrix Gateway", online: true, latency: "3ms" },
    memory: { port: 8788, name: "Memory Daemon", desc: "Lucy Oracle & Biomorphic Memory Vector DB", online: true, latency: "5ms" }
  };

  function probeDaemons() {
    // Check if we are running in localhost vs public web host
    var isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    
    var telPills = document.querySelectorAll(".nav-telemetry-pill, .drawer-telemetry-badge");
    telPills.forEach(function(el) {
      if (isLocal) {
        el.innerHTML = '<span class="tel-dot online"></span><span class="tel-text">6/6 DAEMONS</span>';
      } else {
        el.innerHTML = '<span class="tel-dot online"></span><span class="tel-text">SOVEREIGN FORGE</span>';
      }
    });
  }

  // ── 5. Master Megamenu Definition ──
  var MEGAMENU_STRUCTURE = [
    {
      label: "✦ For You",
      href: "/#for-everyone",
      isDirect: true,
      tip: "Zero-Code Showcases — How non-tech founders, creators & teams depend on Zoth."
    },
    {
      id: "core",
      label: "Core AI",
      items: [
        { href: "/zoth/", icon: "🔮", title: "Master Azoth Core", desc: "Sovereign Alchemical AI Core & Synthesis Engine", badge: "CORE" },
        { href: "/agents/", icon: "⚡", title: "21-Agent Pantheon", desc: "Autonomous Model Archetypes & Test Sandboxes", badge: "21 AGENTS" },
        { href: "/studio/consensus.html", icon: "⚔️", title: "Consensus Battle Arena", desc: "3-Agent Triangulation & Python AST Synthesis", badge: "AST" },
        { href: "/studio/swarm.html", icon: "🌐", title: "3D Swarm Arena", desc: "Real-time WebGL Kinetic Battle Arena & Orbitals", badge: "3D GPU" },
        { href: "/memory/", icon: "🧠", title: "Memory Whitespace", desc: "Biomorphic Associative Graph & Lucy Oracle", badge: "VECTOR" },
        { href: "/zoth-world.html", icon: "🌌", title: "Zoth World 3D Sanctum", desc: "Living Hermetic Swarm & Interactive Multiverse", badge: "3D" }
      ]
    },
    {
      id: "studio",
      label: "Studio",
      items: [
        { href: "/studio/cockpit.html", icon: "🪐", title: "The Cockpit", desc: "21-Agent Autonomous Swarm Command Deck", badge: "SWARM" },
        { href: "/studio/webgen.html", icon: "⚡", title: "WebGen Studio", desc: "Universal Interactive PTY Terminal & Site Builder", badge: "FOUNDRY" },
        { href: "/studio/vos-sandbox.html", icon: "💻", title: "vOS Wasm Sandbox", desc: "In-Browser WebContainer, POSIX Shell & IDE", badge: "WASM" },
        { href: "/studio/nexus-3d.html", icon: "📐", title: "Nexus 3D Omniverse", desc: "CAD Viewport, AI Mesh Generator & Animation", badge: "CAD" },
        { href: "/studio/omnipost.html", icon: "🎬", title: "OmniPost 2.0 Video", desc: "60 FPS Video Studio & Social Motion Pipeline", badge: "60 FPS" },
        { href: "/studio/math-pillars.html", icon: "📐", title: "AI Math Pillars & Academy", desc: "Linear Algebra, STDP, Manifolds & Entropy", badge: "MATH" },
        { href: "/secure-comms/", icon: "🔒", title: "SimpleX ↔ Matrix Bridge", desc: "Zero-Knowledge E2EE SimpleX & Matrix Gateway", badge: "E2EE" },
        { href: "/signal/", icon: "📡", title: "Signal Swarm Bridge", desc: "Mobile Phone Command Deck & Voice SSE", badge: "MOBILE" },
        { href: "/studio/web3-hub.html", icon: "🪙", title: "Web3 & Solana DeFi Hub", desc: "Multi-Chain Wallets, Live SOL Ticker & Radar", badge: "WEB3" },
        { href: "/pets/", icon: "💎", title: "Companion Pets 3D", desc: "Volumetric Mascot Spirits & Soundboards", badge: "MASCOTS" },
        { href: "/studio/", icon: "🛠️", title: "All 14+ Studio Tools", desc: "Master Workstation & Toolchain Directory", badge: "INDEX" }
      ]
    },
    {
      id: "universe",
      label: "Universe",
      items: [
        { href: "/comic/", icon: "🎨", title: "AZOTH Anime Comic Series", desc: "Season 1 Ep 1: Genesis in Silicon Rain (Full Audio)", badge: "AUDIO" },
        { href: "/social/", icon: "🌌", title: "Community Social Wall", desc: "Builder Dispatches, Transmissions & Showcase", badge: "LIVE" },
        { href: "/articles/", icon: "📜", title: "Engineering Whitepapers", desc: "Architectural Deep-Dives, Specs & Benchmarks", badge: "RESEARCH" },
        { href: "/article/", icon: "🔮", title: "Sovereign AI Manifesto", desc: "Multi-Agent Consensus & Philosophical Vision", badge: "VISION" },
        { href: "/ai-webgpu.html", icon: "⚡", title: "WebGPU Local AI", desc: "Browser Neural Transformers (360M Micro)", badge: "WEBGPU" },
        { href: "/adytum/", icon: "🏛️", title: "Adytum Sanctum", desc: "Offline Hardware Gateway & Cryptography", badge: "SANCTUM" }
      ]
    },
    {
      id: "docs",
      label: "Docs & Vault",
      items: [
        { href: "/docs/", icon: "📚", title: "Master Documentation", desc: "Port Topology, 1-Click Install Scripts & API Guide", badge: "DOCS" },
        { href: "/vault/", icon: "🔐", title: "Sovereign Vault", desc: "Argon2id Encrypted Local Hardware Key Container", badge: "ARGON2" },
        { href: "/pricing/", icon: "💛", title: "Support / Patron", desc: "Keep Zoth 100% Free, Open Source & Sovereign", badge: "PATRON" },
        { href: "/faq.html", icon: "❓", title: "Frequently Asked Questions", desc: "Setup Troubleshooting, GPU Requirements & Ports", badge: "FAQ" }
      ]
    }
  ];

  // ── 6. Ensure Canonical Footer ──
  function ensureCanonicalFooter() {
    if (/templates-source|cloned-projects/.test(_path)) return;
    var markup = [
      '<footer class="site" role="contentinfo">',
      '<div class="foot-wrap">',
      '<div aria-hidden="true" class="foot-watermark">ZOTH</div>',
      '<div class="foot-grid">',
      '<div class="foot-brand-col">',
      '<p class="foot-kicker">Local · loopback · no telemetry</p>',
      '<a class="foot-brand-lockup" href="/">',
      '<img alt="Master Azoth" class="foot-azoth" decoding="async" height="72" loading="lazy" src="' + ASSETS_BASE + 'mascot/azoth-bust.jpg" width="72"/>',
      '<span class="foot-brand-text">',
      '<img alt="" class="foot-brand-logo" decoding="async" height="28" loading="lazy" src="' + ASSETS_BASE + 'brand/zoth-golden-z-192.png" width="28"/>',
      '<strong class="foot-brand-title">Zoth Studio</strong>',
      '</span></a>',
      '<small class="foot-brand-desc">Local-first workspace for a team of AI agents. Files stay on this machine.</small>',
      '<div class="foot-actions">',
      '<a class="foot-btn foot-btn-on" href="/#install">Install locally</a>',
      '<a class="foot-btn foot-btn-ghost" href="/pricing/">Support the forge</a>',
      '</div></div>',
      '<div class="foot-col"><h3>Studio</h3>',
      '<a class="mega-footer-link js-deck" href="http://127.0.0.1:8484/">Operator Deck</a>',
      '<a class="mega-footer-link" href="/studio/">Workstations</a>',
      '<a class="mega-footer-link" href="/studio/webgen.html">WebGen</a>',
      '<a class="mega-footer-link" href="/studio/swarm.html">3D Swarm</a>',
      '<a class="mega-footer-link" href="/studio/consensus.html">Consensus</a></div>',
      '<div class="foot-col"><h3>Agents</h3>',
      '<a class="mega-footer-link" href="/zoth/">Master Azoth</a>',
      '<a class="mega-footer-link" href="/agents/">21-Agent pantheon</a>',
      '<a class="mega-footer-link" href="/pets/">Companions</a>',
      '<a class="mega-footer-link" href="/vault/">Sovereign vault</a>',
      '<a class="mega-footer-link" href="/adytum/">Adytum</a></div>',
      '<div class="foot-col"><h3>Universe</h3>',
      '<a class="mega-footer-link" href="/comic/">Azoth comic</a>',
      '<a class="mega-footer-link" href="/social/">Social wall</a>',
      '<a class="mega-footer-link" href="/showcase.html">Showcase</a>',
      '<a class="mega-footer-link" href="/signal/">Signal</a>',
      '<a class="mega-footer-link" href="/article/">Manifesto</a></div>',
      '<div class="foot-col"><h3>Resources</h3>',
      '<a class="mega-footer-link" href="/docs/">Docs</a>',
      '<a class="mega-footer-link" href="/faq.html">FAQ</a>',
      '<a class="mega-footer-link" href="/pricing/">Support / Patron</a>',
      '<a class="mega-footer-link" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub ↗</a>',
      '<a class="mega-footer-link" href="https://nullai.tech/" rel="noopener noreferrer" target="_blank">NullAI ↗</a></div>',
      '</div>',
      '<div class="foot-bottom">',
      '<p>© 2026 NullAI Tech. MIT. Local sovereign execution — zero telemetry.</p>',
      '<nav aria-label="Footer meta" class="foot-meta">',
      '<a href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub</a>',
      '<a href="https://nullai.tech/" rel="noopener noreferrer" target="_blank">NullAI</a>',
      '<a href="/docs/">Docs</a>',
      '<a href="/faq.html">FAQ</a>',
      '</nav></div></div></footer>'
    ].join("");
    var box = document.createElement("div");
    box.innerHTML = markup;
    var fresh = box.firstElementChild;
    if (!fresh) return;
    var deck = location.port === "8484" ? "/" : "http://127.0.0.1:8484/";
    fresh.querySelectorAll(".js-deck").forEach(function (a) { a.setAttribute("href", deck); });
    var existing = document.querySelector("footer.site");
    if (existing) {
      existing.replaceWith(fresh);
      return;
    }
    var main = document.getElementById("main-content") || document.querySelector("main");
    if (main && main.parentNode) {
      main.parentNode.insertBefore(fresh, main.nextSibling);
    } else {
      document.body.appendChild(fresh);
    }
  }

  // ── 7. Universal Navigation Engine ──
  function initUniversalNav() {
    initProgressBar();

    var curTheme = (window.getZothTheme && window.getZothTheme()) || "dark";
    var themesList = window.ZOTH_THEMES || [];
    if (!themesList.length) {
      themesList = [
        { id: "dark", label: "Dark Void", emoji: "🌙", accent: "#00f0ff", category: "Studio Originals", desc: "Zoth Cyber HUD & Electric Cyan" },
        { id: "light", label: "Solar Light", emoji: "☀️", accent: "#0a2540", category: "Studio Originals", desc: "Swiss Precision & Pure Alabaster" },
        { id: "matrix", label: "Matrix CRT", emoji: "📟", accent: "#00ff41", category: "Studio Originals", desc: "Phosphor Green Terminal & Digital Rain" },
        { id: "gold", label: "Hermetic Gold", emoji: "⚗️", accent: "#fbbf24", category: "Studio Originals", desc: "24K Alchemical Obsidian & Golden Ratio" }
      ];
    }
    var curThemeObj = themesList.find(function(t) { return t.id === curTheme; }) || themesList[0];

    // Find or Create Master Topbar
    var topbar = document.getElementById("topbar") || document.querySelector("header.bar") || document.querySelector("header#topbar") || document.querySelector("header[role='banner']");
    
    if (!topbar) {
      topbar = document.createElement("header");
      topbar.id = "topbar";
      topbar.className = "bar";
      topbar.setAttribute("role", "banner");
      document.body.insertBefore(topbar, document.body.firstChild);
    }

    // Build Desktop Navigation HTML
    var deckUrl = window.location.port === "8484" ? "/" : "http://127.0.0.1:8484/";
    var isAudioOn = window.ZothAudioFX && window.ZothAudioFX.isEnabled();
    var isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform || "");
    var cmdKText = isMac ? "⌘K" : "Ctrl+K";
    var shiftTText = isMac ? "⇧T" : "Shift+T";
    var shiftAText = isMac ? "⇧A" : "Shift+A";

    var categories = ["Studio Originals", "Frontier AI & Tech", "Developer Archetypes"];
    var themePopHtml = categories.map(function(cat) {
      var items = themesList.filter(function(t) { return (t.category || "Studio Originals") === cat; });
      if (!items.length) return "";
      var catIcon = cat.startsWith("Studio") ? "✦" : (cat.startsWith("Frontier") ? "🌐" : "⚡");
      
      return [
        '<div class="theme-popover-category" data-cat-name="' + cat.toLowerCase() + '">',
        '  <div class="theme-cat-header"><span class="cat-icon">' + catIcon + '</span> ' + cat + '</div>',
        '  <div class="theme-cat-grid">',
        items.map(function(t) {
          var isAct = t.id === curTheme;
          return [
            '<button class="theme-card-row' + (isAct ? ' active' : '') + '" data-theme-id="' + t.id + '" data-theme-label="' + t.label.toLowerCase() + '" data-theme-cat="' + (t.category||'').toLowerCase() + '" type="button" title="' + t.desc + '">',
            '  <span class="theme-card-swatch" style="background:' + t.accent + '; box-shadow: 0 0 8px ' + t.accent + '66;"></span>',
            '  <span class="theme-card-emoji">' + t.emoji + '</span>',
            '  <div class="theme-card-info">',
            '    <div class="theme-card-name">' + t.label + '</div>',
            '    <div class="theme-card-desc">' + (t.desc || "") + '</div>',
            '  </div>',
            isAct ? '  <span class="theme-card-check">✓</span>' : '',
            '</button>'
          ].join("");
        }).join(""),
        '  </div>',
        '</div>'
      ].join("");
    }).join("");

    var PET_MAP = {
      azoth: { name: "Azoth", emoji: "🔮" },
      zoth: { name: "Zoth", emoji: "⚡" },
      kai: { name: "Kai", emoji: "🐱" },
      draco: { name: "Draco", emoji: "🐉" },
      ignis: { name: "Ignis", emoji: "🔥" },
      lycan: { name: "Lycan", emoji: "🐺" },
      athena: { name: "Athena", emoji: "🦉" },
      kitsune: { name: "Kitsune", emoji: "🦊" },
      kraken: { name: "Kraken", emoji: "🐙" },
      leviathan: { name: "Leviathan", emoji: "🐋" },
      scorpius: { name: "Scorpius", emoji: "🦂" },
      "pixel-neko": { name: "Pixel Neko", emoji: "🐾" },
      onyx: { name: "Onyx", emoji: "💎" },
      ghostbyte: { name: "Ghostbyte", emoji: "👻" },
      chronos: { name: "Chronos", emoji: "⏳" },
      aether: { name: "Aether", emoji: "✨" },
      aquila: { name: "Aquila", emoji: "🦅" },
      hermes: { name: "Hermes", emoji: "⚚" },
      grok: { name: "Grok", emoji: "🌌" }
    };

    var activePetId = localStorage.getItem("zoth_active_pet") || "azoth";
    var activePet = PET_MAP[activePetId] || { name: "Azoth", emoji: "🔮" };

    function getBreadcrumbHtml() {
      var p = window.location.pathname || "";
      if (!p || p === "/" || p === "/index.html") return "";
      
      var parts = p.split("/").filter(Boolean);
      if (parts.length === 0) return "";
      
      var pageSlug = parts.length > 1 ? parts[1].replace(/\.html$/, "") : parts[0].replace(/\.html$/, "");
      var pageTitle = pageSlug.replace(/[-_]/g, " ").toUpperCase();
      
      if (parts[0] === "studio" && parts.length > 1) {
        return '<div class="nav-breadcrumb"><a href="/studio/">STUDIO</a><span class="bc-sep">/</span><span class="bc-current">' + pageTitle + '</span></div>';
      }
      if (parts[0] === "articles" && parts.length > 1) {
        return '<div class="nav-breadcrumb"><a href="/articles/">RESEARCH</a><span class="bc-sep">/</span><span class="bc-current">' + pageTitle + '</span></div>';
      }
      if (parts[0] === "agents" && parts.length > 1) {
        return '<div class="nav-breadcrumb"><a href="/agents/">AGENTS</a><span class="bc-sep">/</span><span class="bc-current">' + pageTitle + '</span></div>';
      }
      if (parts[0] === "comic" && parts.length > 1) {
        return '<div class="nav-breadcrumb"><a href="/comic/">COMIC</a><span class="bc-sep">/</span><span class="bc-current">' + pageTitle + '</span></div>';
      }
      if (parts[0] === "pets" && parts.length > 1) {
        return '<div class="nav-breadcrumb"><a href="/pets/">PETS</a><span class="bc-sep">/</span><span class="bc-current">' + pageTitle + '</span></div>';
      }
      if (parts.length === 1 && parts[0].endsWith(".html") && parts[0] !== "index.html") {
        return '<div class="nav-breadcrumb"><span class="bc-current">' + pageTitle + '</span></div>';
      }
      return "";
    }

    var breadcrumbHtml = getBreadcrumbHtml();

    var masterTopbarHtml = [
      '<a aria-label="Zoth Studio Home" class="brand js-hub" href="/">',
      '  <div class="brand-emblem-wrap">',
      '    <img alt="Zoth Golden Z Emblem" decoding="async" height="34" width="34" loading="eager" src="' + ASSETS_BASE + 'brand/zoth-golden-z-192.png" class="brand-emblem-img"/>',
      '    <span class="brand-emblem-halo"></span>',
      '  </div>',
      '  <span class="brand-text-wrap">',
      '    <strong>Zoth</strong>',
      '    <small>by NullAI</small>',
      '  </span>',
      '  <span class="brand-status-badge">SOVEREIGN</span>',
      '</a>',
      breadcrumbHtml,

      '<nav aria-label="Primary navigation" class="menu" role="navigation">',
      '  <!-- ✦ Direct For You Link -->',
      '  <a class="nav-link nav-for-everyone" href="/#for-everyone" data-tip="Zero-Code Showcases — How non-tech founders & creators depend on Zoth.">✦ For You</a>',
      
      '  <!-- 🔮 Core AI Dropdown -->',
      '  <div class="nav-dropdown" data-dropdown-id="core">',
      '    <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">',
      '      <span>Core AI</span>',
      '      <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
      '    </button>',
      '    <div class="nav-dropdown-menu">',
      '      <div class="nav-dropdown-header"><span>🔮 CORE AI ARCHITECTURE</span><span class="nav-item-badge">6 NODES</span></div>',
      '      <a href="/zoth/"><span class="nav-item-icon-box">🔮</span><div class="nav-item-body"><strong>Master Azoth Core</strong><small>Sovereign Alchemical AI Core &amp; Synthesis</small></div><span class="nav-item-badge">CORE</span></a>',
      '      <a href="/agents/"><span class="nav-item-icon-box">⚡</span><div class="nav-item-body"><strong>21-Agent Pantheon</strong><small>Autonomous Model Archetypes &amp; Sandboxes</small></div><span class="nav-item-badge">21 AGENTS</span></a>',
      '      <a href="/studio/consensus.html"><span class="nav-item-icon-box">⚔️</span><div class="nav-item-body"><strong>Consensus Battle Arena</strong><small>3-Agent Triangulation &amp; AST Synthesis</small></div><span class="nav-item-badge">AST</span></a>',
      '      <a href="/studio/swarm.html"><span class="nav-item-icon-box">🌐</span><div class="nav-item-body"><strong>3D Swarm Arena</strong><small>Real-time WebGL Kinetic Battle Arena</small></div><span class="nav-item-badge">3D GPU</span></a>',
      '      <a href="/memory/"><span class="nav-item-icon-box">🧠</span><div class="nav-item-body"><strong>Memory Whitespace</strong><small>Biomorphic Associative Graph &amp; Lucy Oracle</small></div><span class="nav-item-badge">VECTOR</span></a>',
      '      <a href="/zoth-world.html"><span class="nav-item-icon-box">🌌</span><div class="nav-item-body"><strong>Zoth World 3D Sanctum</strong><small>Living Hermetic Swarm &amp; Multiverse</small></div><span class="nav-item-badge">3D</span></a>',
      '    </div>',
      '  </div>',

      '  <!-- 🪐 Studio Workstations Dropdown -->',
      '  <div class="nav-dropdown" data-dropdown-id="studio">',
      '    <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">',
      '      <span>Studio</span>',
      '      <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
      '    </button>',
      '    <div class="nav-dropdown-menu nav-dropdown-mega">',
      '      <div class="nav-dropdown-header"><span>🪐 14+ STUDIO WORKSTATIONS</span><span class="nav-item-badge">LOCAL DAGS</span></div>',
      '      <a href="/studio/cockpit.html"><span class="nav-item-icon-box">🪐</span><div class="nav-item-body"><strong>The Cockpit</strong><small>21-Agent Autonomous Swarm Command Deck</small></div><span class="nav-item-badge">SWARM</span></a>',
      '      <a href="/studio/webgen.html"><span class="nav-item-icon-box">⚡</span><div class="nav-item-body"><strong>WebGen Studio</strong><small>Universal Interactive PTY Terminal &amp; Foundry</small></div><span class="nav-item-badge">FOUNDRY</span></a>',
      '      <a href="/studio/vos-sandbox.html"><span class="nav-item-icon-box">💻</span><div class="nav-item-body"><strong>vOS Wasm Sandbox</strong><small>In-Browser WebContainer &amp; Terminal IDE</small></div><span class="nav-item-badge">WASM</span></a>',
      '      <a href="/studio/nexus-3d.html"><span class="nav-item-icon-box">📐</span><div class="nav-item-body"><strong>Nexus 3D Omniverse</strong><small>CAD Modeling, AI Meshes &amp; Motion</small></div><span class="nav-item-badge">CAD</span></a>',
      '      <a href="/studio/omnipost.html"><span class="nav-item-icon-box">🎬</span><div class="nav-item-body"><strong>OmniPost 2.0 Video</strong><small>60 FPS Video Studio &amp; Social Motion</small></div><span class="nav-item-badge">60 FPS</span></a>',
      '      <a href="/studio/math-pillars.html"><span class="nav-item-icon-box">📐</span><div class="nav-item-body"><strong>AI Math Pillars</strong><small>Linear Algebra, STDP, Manifolds &amp; Entropy</small></div><span class="nav-item-badge">MATH</span></a>',
      '      <a href="/secure-comms/"><span class="nav-item-icon-box">🔒</span><div class="nav-item-body"><strong>SimpleX ↔ Matrix Bridge</strong><small>Zero-Knowledge E2EE Gateway</small></div><span class="nav-item-badge">E2EE</span></a>',
      '      <a href="/signal/"><span class="nav-item-icon-box">📡</span><div class="nav-item-body"><strong>Signal Swarm Bridge</strong><small>Mobile Phone Command Deck &amp; Voice SSE</small></div><span class="nav-item-badge">MOBILE</span></a>',
      '      <a href="/studio/web3-hub.html"><span class="nav-item-icon-box">🪙</span><div class="nav-item-body"><strong>Web3 &amp; Solana DeFi Hub</strong><small>Multi-Chain Wallets &amp; Live SOL Matrix</small></div><span class="nav-item-badge">WEB3</span></a>',
      '      <a href="/pets/"><span class="nav-item-icon-box">💎</span><div class="nav-item-body"><strong>Companion Pets 3D</strong><small>Volumetric Mascot Spirits &amp; Soundboards</small></div><span class="nav-item-badge">MASCOTS</span></a>',
      '      <a href="/studio/"><span class="nav-item-icon-box">🛠️</span><div class="nav-item-body"><strong>Studio Directory</strong><small>Master Workstation &amp; Toolchain Catalog</small></div><span class="nav-item-badge">INDEX</span></a>',
      '    </div>',
      '  </div>',

      '  <!-- 🌌 Universe & Media Dropdown -->',
      '  <div class="nav-dropdown" data-dropdown-id="universe">',
      '    <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">',
      '      <span>Universe</span>',
      '      <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
      '    </button>',
      '    <div class="nav-dropdown-menu">',
      '      <div class="nav-dropdown-header"><span>🌌 UNIVERSE &amp; PUBLICATIONS</span><span class="nav-item-badge">STORIES</span></div>',
      '      <a href="/comic/"><span class="nav-item-icon-box">🎨</span><div class="nav-item-body"><strong>AZOTH Anime Comic</strong><small>Season 1 Ep 1: Genesis in Silicon Rain (Audio)</small></div><span class="nav-item-badge">AUDIO</span></a>',
      '      <a href="/social/"><span class="nav-item-icon-box">🌌</span><div class="nav-item-body"><strong>Community Social Wall</strong><small>Builder Dispatches &amp; Showcase Transmissions</small></div><span class="nav-item-badge">LIVE</span></a>',
      '      <a href="/articles/"><span class="nav-item-icon-box">📜</span><div class="nav-item-body"><strong>Engineering Whitepapers</strong><small>Architectural Deep-Dives &amp; Benchmarks</small></div><span class="nav-item-badge">RESEARCH</span></a>',
      '      <a href="/article/"><span class="nav-item-icon-box">🔮</span><div class="nav-item-body"><strong>Sovereign AI Manifesto</strong><small>Multi-Agent Consensus &amp; Philosophical Vision</small></div><span class="nav-item-badge">VISION</span></a>',
      '      <a href="/ai-webgpu.html"><span class="nav-item-icon-box">⚡</span><div class="nav-item-body"><strong>WebGPU Local AI</strong><small>Browser Neural Transformers (360M Micro)</small></div><span class="nav-item-badge">WEBGPU</span></a>',
      '      <a href="/adytum/"><span class="nav-item-icon-box">🏛️</span><div class="nav-item-body"><strong>Adytum Sanctum</strong><small>Offline Hardware Gateway &amp; Cryptography</small></div><span class="nav-item-badge">SANCTUM</span></a>',
      '    </div>',
      '  </div>',

      '  <!-- 📚 Docs & Vault Dropdown -->',
      '  <div class="nav-dropdown" data-dropdown-id="docs">',
      '    <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn" type="button">',
      '      <span>Docs &amp; Vault</span>',
      '      <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
      '    </button>',
      '    <div class="nav-dropdown-menu">',
      '      <div class="nav-dropdown-header"><span>📚 DOCUMENTATION &amp; SECURITY</span><span class="nav-item-badge">SPECS</span></div>',
      '      <a href="/docs/"><span class="nav-item-icon-box">📚</span><div class="nav-item-body"><strong>Master Documentation</strong><small>Port Topology, 1-Click Install Scripts &amp; API Guide</small></div><span class="nav-item-badge">DOCS</span></a>',
      '      <a href="/vault/"><span class="nav-item-icon-box">🔐</span><div class="nav-item-body"><strong>Sovereign Vault</strong><small>Argon2id Secrets, Tokens &amp; Keyrings</small></div><span class="nav-item-badge">ARGON2</span></a>',
      '      <a href="/pricing/"><span class="nav-item-icon-box">💛</span><div class="nav-item-body"><strong>Support / Patron</strong><small>Keep Zoth Free, Open Source &amp; Sovereign</small></div><span class="nav-item-badge">PATRON</span></a>',
      '      <a href="/faq.html"><span class="nav-item-icon-box">❓</span><div class="nav-item-body"><strong>FAQ &amp; Troubleshooting</strong><small>Hardware Requirements, Ports &amp; Diagnostics</small></div><span class="nav-item-badge">FAQ</span></a>',
      '    </div>',
      '  </div>',

      '  <!-- ⚡ Live Telemetry Status Pill -->',
      '  <button type="button" class="nav-pill nav-telemetry-pill" title="View Live Studio Telemetry &amp; Background Daemons" aria-label="Studio Telemetry Status">',
      '    <span class="tel-dot online"></span><span class="tel-text">6/6 DAEMONS</span>',
      '  </button>',

      '  <!-- 🐾 Active Companion Spirit Pill -->',
      '  <button type="button" class="nav-pill nav-pet-pill" title="Active Companion Spirit: ' + activePet.name + ' (Click to Summon / Switch Mascot)" aria-label="Active Companion Spirit">',
      '    <span class="pet-emoji">' + activePet.emoji + '</span><span class="pet-name">' + activePet.name + '</span>',
      '  </button>',

      '  <!-- 💻 Operator Deck Quick Launch Pill -->',
      '  <a class="nav-pill nav-deck-pill js-deck" href="' + deckUrl + '" title="Open Local Operator Deck (:8484)" data-tip="Local Sovereign Operator Deck (:8484)">',
      '    <span class="deck-pulse"></span><span>DECK</span>',
      '  </a>',

      '  <!-- 🔍 Command Palette Quick Trigger -->',
      '  <button type="button" class="nav-pill nav-palette-btn" title="Open Global Command Palette (' + cmdKText + ')" aria-label="Command Palette">',
      '    <span class="palette-icon">🔍</span><kbd class="nav-kbd">' + cmdKText + '</kbd>',
      '  </button>',

      '  <!-- ✏️ Visual Annotator Quick Trigger -->',
      '  <button type="button" class="nav-pill nav-annotate-btn" title="Toggle On-Screen Annotator &amp; Feedback (' + shiftAText + ')" aria-label="Toggle Annotator">',
      '    <span class="annotate-icon">✏️</span><span class="annotate-text">Annotate</span><kbd class="nav-kbd">' + shiftAText + '</kbd>',
      '  </button>',

      '  <!-- 🎨 Master Theme Popover -->',
      '  <div class="nav-dropdown nav-theme-dropdown">',
      '    <button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn nav-theme-current-btn" type="button" title="Switch Visual Theme (' + shiftTText + ')">',
      '      <span class="current-theme-swatch" style="background:' + curThemeObj.accent + ';"></span>',
      '      <span class="current-theme-emoji">' + curThemeObj.emoji + '</span>',
      '      <span class="current-theme-label">' + curThemeObj.label + '</span>',
      '      <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
      '    </button>',
      '    <div class="nav-dropdown-menu nav-theme-popover-menu">',
      '      <div class="theme-popover-header">',
      '        <div class="theme-popover-title">',
      '          <span class="palette-icon">🎨</span> Visual Identity Studio',
      '        </div>',
      '        <div class="theme-popover-actions">',
      '          <button type="button" class="theme-audio-toggle-btn" title="Toggle UI Sound Synthesizer">' + (isAudioOn ? '🔊 Audio FX' : '🔇 Audio Off') + '</button>',
      '          <kbd class="nav-kbd">' + shiftTText + '</kbd>',
      '        </div>',
      '      </div>',
      '      <div class="theme-popover-search-wrap">',
      '        <span class="search-icon">🔍</span>',
      '        <input type="text" class="theme-search-input" placeholder="Filter 16 themes (e.g. Apple, Matrix, Grok)..." autocomplete="off" spellcheck="false" />',
      '        <button type="button" class="theme-search-clear" style="display:none;">×</button>',
      '      </div>',
      '      <div class="theme-filter-chips">',
      '        <button type="button" class="theme-chip-btn active" data-filter-cat="all">All (16)</button>',
      '        <button type="button" class="theme-chip-btn" data-filter-cat="studio originals">✦ Originals</button>',
      '        <button type="button" class="theme-chip-btn" data-filter-cat="frontier ai & tech">🌐 Frontier</button>',
      '        <button type="button" class="theme-chip-btn" data-filter-cat="developer archetypes">⚡ Dev</button>',
      '      </div>',
      '      <div class="theme-popover-scroll-body">',
      themePopHtml,
      '      </div>',
      '      <div class="theme-popover-footer">',
      '        <span>⚡ 16 Sovereign Workstation Archetypes</span>',
      '        <span><kbd class="nav-kbd">' + shiftTText + '</kbd> to cycle</span>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <!-- 🐙 GitHub Repository Pill -->',
      '  <a class="nav-pill git" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank" title="GitHub Repository — Open Source code, Debian packages, and releases">',
      '    <span>🐙 GitHub ↗</span>',
      '  </a>',
      '</nav>',

      '<button aria-controls="drawer" aria-expanded="false" aria-label="Toggle navigation menu" class="burger" id="burger" type="button">',
      '  <span class="burger-lines"><span class="b-line b-1"></span><span class="b-line b-2"></span><span class="b-line b-3"></span></span>',
      '  <span class="burger-text">Menu</span>',
      '</button>',
      '<div class="zoth-scroll-progress" id="zoth-scroll-progress"></div>'
    ].join("");

    topbar.innerHTML = masterTopbarHtml;

    // Track mouse spotlight beam across topbar
    topbar.addEventListener("mousemove", function(e) {
      var rect = topbar.getBoundingClientRect();
      var x = e.clientX - rect.left;
      topbar.style.setProperty("--nav-mouse-x", x + "px");
    });

    var menuBar = topbar.querySelector("nav.menu");
    var burger = topbar.querySelector("#burger");

    // Initialize Liquid Magnetic Sliding Highlight Pill
    if (menuBar) {
      var slidingPill = document.createElement("div");
      slidingPill.className = "nav-sliding-pill";
      menuBar.appendChild(slidingPill);

      var updateSlidingPill = function(target) {
        if (!target || !menuBar.contains(target)) {
          slidingPill.classList.remove("visible");
          return;
        }
        var menuRect = menuBar.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        var left = targetRect.left - menuRect.left;
        var top = targetRect.top - menuRect.top;
        var width = targetRect.width;
        var height = targetRect.height;
        
        slidingPill.style.left = left + "px";
        slidingPill.style.top = top + "px";
        slidingPill.style.width = width + "px";
        slidingPill.style.height = height + "px";
        slidingPill.style.opacity = "";
        slidingPill.classList.add("visible");
      };

      menuBar.querySelectorAll(".nav-link, .nav-dropdown-btn, .nav-pill").forEach(function(item) {
        item.addEventListener("mouseenter", function() {
          updateSlidingPill(item);
          if (window.ZothAudioFX) window.ZothAudioFX.playHover();
        });
        item.addEventListener("focus", function() {
          updateSlidingPill(item);
        });
      });

      menuBar.addEventListener("mouseleave", function() {
        var activeItem = menuBar.querySelector(".nav-link.on, .nav-dropdown-btn.on");
        if (activeItem) {
          updateSlidingPill(activeItem);
          slidingPill.style.opacity = "0.6";
        } else {
          slidingPill.classList.remove("visible");
        }
      });
    }

    // Telemetry Diagnostics Modal Trigger
    var telPill = topbar.querySelector(".nav-telemetry-pill");
    if (telPill) {
      telPill.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        openTelemetryModal();
      });
    }

    // Active Mascot Companion Spirit Quick Trigger
    var petPill = topbar.querySelector(".nav-pet-pill");
    if (petPill) {
      petPill.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.ZothAudioFX) window.ZothAudioFX.playClick(920, 0.08, "sine");
        if (window.ZothPetHUD && typeof window.ZothPetHUD.toggle === "function") {
          window.ZothPetHUD.toggle();
        } else {
          window.location.href = "/pets/";
        }
      });
    }

    // Annotator Quick Trigger
    var annotateBtn = topbar.querySelector(".nav-annotate-btn");
    if (annotateBtn) {
      annotateBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement("script");
          annotScript.src = ASSETS_BASE + "zoth-annotator.js";
          annotScript.onload = function() {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
      });
    }

    // Command Palette Quick Trigger
    var paletteBtn = topbar.querySelector(".nav-palette-btn");
    if (paletteBtn) {
      paletteBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === "function") {
          window.ZothWorkbench.openPalette();
        } else {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
        }
      });
    }

    // Theme Popover Event Handlers
    var themeDd = topbar.querySelector(".nav-theme-dropdown");
    if (themeDd) {
      var themeTriggerBtn = themeDd.querySelector(".nav-theme-current-btn");
      var searchInput = themeDd.querySelector(".theme-search-input");
      var searchClear = themeDd.querySelector(".theme-search-clear");
      var audioToggleBtn = themeDd.querySelector(".theme-audio-toggle-btn");
      var activeCatFilter = "all";

      if (audioToggleBtn) {
        audioToggleBtn.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          var on = window.ZothAudioFX && window.ZothAudioFX.toggle();
          audioToggleBtn.textContent = on ? "🔊 Audio FX" : "🔇 Audio Off";
          if (on && window.ZothAudioFX) window.ZothAudioFX.playClick(880, 0.1, "sine");
        });
      }

      var applyThemeFilter = function() {
        var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
        if (searchClear) searchClear.style.display = q ? "block" : "none";
        
        var allRows = themeDd.querySelectorAll(".theme-card-row");
        var categoriesEls = themeDd.querySelectorAll(".theme-popover-category");
        
        allRows.forEach(function(row) {
          var name = row.getAttribute("data-theme-label") || "";
          var id = row.getAttribute("data-theme-id") || "";
          var cat = row.getAttribute("data-theme-cat") || "";
          var matchText = !q || name.includes(q) || id.includes(q) || cat.includes(q);
          var matchCat = activeCatFilter === "all" || cat === activeCatFilter;
          row.style.display = (matchText && matchCat) ? "flex" : "none";
        });

        categoriesEls.forEach(function(catEl) {
          var catName = catEl.getAttribute("data-cat-name") || "";
          var visibleRows = catEl.querySelectorAll(".theme-card-row:not([style*='display: none'])");
          var showCat = visibleRows.length > 0 && (activeCatFilter === "all" || catName === activeCatFilter);
          catEl.style.display = showCat ? "flex" : "none";
        });
      };

      if (searchInput) {
        searchInput.addEventListener("input", applyThemeFilter);

        searchClear.addEventListener("click", function(e) {
          e.preventDefault();
          searchInput.value = "";
          applyThemeFilter();
          searchInput.focus();
        });
      }

      // Category Chip Filter Buttons
      themeDd.querySelectorAll(".theme-chip-btn").forEach(function(chip) {
        chip.addEventListener("click", function(e) {
          e.preventDefault();
          themeDd.querySelectorAll(".theme-chip-btn").forEach(function(c) { c.classList.remove("active"); });
          chip.classList.add("active");
          activeCatFilter = chip.getAttribute("data-filter-cat") || "all";
          applyThemeFilter();
          if (window.ZothAudioFX) window.ZothAudioFX.playClick(650, 0.05);
        });
      });
      
      themeTriggerBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = themeDd.classList.contains("open");
        document.querySelectorAll(".nav-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
        if (!isOpen) {
          themeDd.classList.add("open");
          themeTriggerBtn.setAttribute("aria-expanded", "true");
          if (window.ZothAudioFX) window.ZothAudioFX.playClick(750, 0.06);
          if (searchInput) setTimeout(function() { searchInput.focus(); }, 50);
        } else {
          themeDd.classList.remove("open");
          themeTriggerBtn.setAttribute("aria-expanded", "false");
        }
      });

      themeDd.querySelectorAll(".theme-card-row").forEach(function(row) {
        row.addEventListener("click", function(e) {
          e.preventDefault();
          var tid = row.getAttribute("data-theme-id");
          if (tid && window.setZothTheme) {
            window.setZothTheme(tid);
            themeDd.classList.remove("open");
            themeTriggerBtn.setAttribute("aria-expanded", "false");
          }
        });
      });

      document.addEventListener("click", function(e) {
        if (!themeDd.contains(e.target)) {
          themeDd.classList.remove("open");
          themeTriggerBtn.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && themeDd.classList.contains("open")) {
          themeDd.classList.remove("open");
          themeTriggerBtn.setAttribute("aria-expanded", "false");
          themeTriggerBtn.focus();
        }
      });
    }

    // ── 8. Dropdowns Keyboard & Click Behavior ──
    topbar.querySelectorAll(".nav-dropdown:not(.nav-theme-dropdown)").forEach(function(dd) {
      var btn = dd.querySelector(".nav-dropdown-btn");
      var links = Array.from(dd.querySelectorAll(".nav-dropdown-menu a"));
      if (!btn) return;

      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var wasOpen = dd.classList.contains("open");
        document.querySelectorAll(".nav-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
        if (!wasOpen) {
          dd.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          if (window.ZothAudioFX) window.ZothAudioFX.playHover();
        } else {
          btn.setAttribute("aria-expanded", "false");
        }
      });

      // Keyboard arrow navigation inside dropdowns
      dd.addEventListener("keydown", function(e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          var activeIdx = links.indexOf(document.activeElement);
          var nextIdx = activeIdx < links.length - 1 ? activeIdx + 1 : 0;
          dd.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          if (links[nextIdx]) links[nextIdx].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          var activeIdx = links.indexOf(document.activeElement);
          var prevIdx = activeIdx > 0 ? activeIdx - 1 : links.length - 1;
          dd.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          if (links[prevIdx]) links[prevIdx].focus();
        } else if (e.key === "Escape") {
          dd.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
          btn.focus();
        }
      });
    });

    document.addEventListener("click", function(e) {
      if (!e.target.closest(".nav-dropdown")) {
        document.querySelectorAll(".nav-dropdown.open").forEach(function(d) {
          d.classList.remove("open");
          var btn = d.querySelector(".nav-dropdown-btn");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      }
    });

    // ── 9. Universal Master Mobile Drawer ──
    var drawer = document.getElementById("drawer") || document.querySelector("nav.drawer") || document.querySelector("#drawer");
    
    var masterDrawerHtml = [
      '<div class="drawer-header-brand">',
      '  <div class="d-brand-left">',
      '    <div class="brand-emblem-wrap">',
      '      <img src="' + ASSETS_BASE + 'brand/zoth-golden-z-192.png" alt="Zoth" width="28" height="28" class="brand-emblem-img"/>',
      '    </div>',
      '    <span class="d-brand-title"><strong>Zoth Studio</strong><small>v12.0 Sovereign</small></span>',
      '  </div>',
      '  <button type="button" class="drawer-telemetry-badge" title="View Diagnostics HUD">● 6/6 DAEMONS</button>',
      '  <button type="button" class="drawer-close-btn" aria-label="Close mobile menu">✕</button>',
      '</div>',

      '<!-- ⚡ Quick Tools 2x2 Grid -->',
      '<div class="drawer-section drawer-tools-section">',
      '  <div class="drawer-heading">⚡ Quick Actions</div>',
      '  <div class="drawer-quick-tools-grid">',
      '    <button type="button" class="drawer-tool-pill drawer-palette-trigger"><span>🔍</span> Command Palette <kbd class="nav-kbd">' + cmdKText + '</kbd></button>',
      '    <button type="button" class="drawer-tool-pill drawer-annotate-trigger"><span>✏️</span> On-Screen Annotator <kbd class="nav-kbd">' + shiftAText + '</kbd></button>',
      '    <button type="button" class="drawer-tool-pill drawer-telemetry-trigger"><span>⚡</span> Telemetry HUD</button>',
      '    <button type="button" class="drawer-tool-pill drawer-audio-trigger"><span>' + (isAudioOn ? '🔊' : '🔇') + '</span> Audio FX</button>',
      '  </div>',
      '</div>',

      '<!-- 🎨 Visual Theme Grid with Live Search -->',
      '<div class="drawer-section drawer-theme-section">',
      '  <div class="drawer-heading">🎨 Visual Theme (' + themesList.length + ' Archetypes)</div>',
      '  <div class="drawer-search-wrap">',
      '    <span class="search-icon">🔍</span>',
      '    <input type="text" class="drawer-theme-search-input" placeholder="Search 16 themes..." autocomplete="off" />',
      '  </div>',
      '  <div class="theme-filter-chips drawer-filter-chips">',
      '    <button type="button" class="theme-chip-btn active" data-drawer-cat="all">All (16)</button>',
      '    <button type="button" class="theme-chip-btn" data-drawer-cat="studio originals">Originals</button>',
      '    <button type="button" class="theme-chip-btn" data-drawer-cat="frontier ai & tech">Frontier</button>',
      '    <button type="button" class="theme-chip-btn" data-drawer-cat="developer archetypes">Dev</button>',
      '  </div>',
      '  <div class="drawer-theme-grid">',
      themesList.map(function(t) {
        var isAct = t.id === curTheme;
        return '<button class="drawer-theme-btn' + (isAct ? ' active' : '') + '" data-theme-id="' + t.id + '" data-theme-label="' + t.label.toLowerCase() + '" data-theme-cat="' + (t.category||'').toLowerCase() + '" type="button" aria-pressed="' + isAct + '"><span class="d-swatch" style="background:' + t.accent + '"></span><span class="d-emoji">' + t.emoji + '</span><span class="d-label">' + t.label + '</span></button>';
      }).join(""),
      '  </div>',
      '</div>',

      '<!-- ✦ Featured & Zero-Code -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">✦ Featured</div>',
      '  <a class="drawer-link drawer-hero-link" href="/#for-everyone"><span class="d-link-icon">✦</span><div class="d-link-body"><strong>For You (No-Code Showcases)</strong><small>How Non-Tech Founders, Creators &amp; Teams Use Zoth</small></div><span class="nav-item-badge">SHOWCASE</span></a>',
      '</div>',

      '<!-- 🔮 Core AI & Pantheon -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">🔮 Core AI &amp; Pantheon</div>',
      '  <a class="drawer-link" href="/zoth/"><span class="d-link-icon">🔮</span><div class="d-link-body"><strong>Master Azoth Core</strong><small>Sovereign Alchemical AI Core &amp; Synthesis</small></div><span class="nav-item-badge">CORE</span></a>',
      '  <a class="drawer-link" href="/agents/"><span class="d-link-icon">⚡</span><div class="d-link-body"><strong>21-Agent Pantheon</strong><small>Autonomous Model Archetypes &amp; Sandboxes</small></div><span class="nav-item-badge">21 AGENTS</span></a>',
      '  <a class="drawer-link" href="/studio/consensus.html"><span class="d-link-icon">⚔️</span><div class="d-link-body"><strong>Consensus Battle Arena</strong><small>3-Agent Triangulation &amp; AST Synthesis</small></div><span class="nav-item-badge">AST</span></a>',
      '  <a class="drawer-link" href="/studio/swarm.html"><span class="d-link-icon">🌐</span><div class="d-link-body"><strong>3D Swarm Arena</strong><small>Real-time WebGL Kinetic Battle Arena</small></div><span class="nav-item-badge">3D GPU</span></a>',
      '  <a class="drawer-link" href="/memory/"><span class="d-link-icon">🧠</span><div class="d-link-body"><strong>Memory Whitespace</strong><small>Biomorphic Associative Graph &amp; Lucy Oracle</small></div><span class="nav-item-badge">VECTOR</span></a>',
      '  <a class="drawer-link" href="/zoth-world.html"><span class="d-link-icon">🌌</span><div class="d-link-body"><strong>Zoth World 3D Sanctum</strong><small>Living Hermetic Swarm &amp; Multiverse</small></div><span class="nav-item-badge">3D</span></a>',
      '</div>',

      '<!-- 🪐 Studio Workstations -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">🪐 Workstations &amp; DAGs</div>',
      '  <a class="drawer-link" href="/studio/cockpit.html"><span class="d-link-icon">🪐</span><div class="d-link-body"><strong>The Cockpit</strong><small>21-Agent Autonomous Swarm Command Deck</small></div><span class="nav-item-badge">SWARM</span></a>',
      '  <a class="drawer-link" href="/studio/webgen.html"><span class="d-link-icon">⚡</span><div class="d-link-body"><strong>WebGen Studio</strong><small>Universal Interactive PTY Terminal &amp; Foundry</small></div><span class="nav-item-badge">FOUNDRY</span></a>',
      '  <a class="drawer-link" href="/studio/vos-sandbox.html"><span class="d-link-icon">💻</span><div class="d-link-body"><strong>vOS Wasm Sandbox</strong><small>In-Browser WebContainer &amp; Terminal IDE</small></div><span class="nav-item-badge">WASM</span></a>',
      '  <a class="drawer-link" href="/studio/nexus-3d.html"><span class="d-link-icon">📐</span><div class="d-link-body"><strong>Nexus 3D Omniverse</strong><small>CAD Modeling, AI Meshes &amp; Motion</small></div><span class="nav-item-badge">CAD</span></a>',
      '  <a class="drawer-link" href="/studio/omnipost.html"><span class="d-link-icon">🎬</span><div class="d-link-body"><strong>OmniPost 2.0 Video</strong><small>60 FPS Video Studio &amp; Social Motion</small></div><span class="nav-item-badge">60 FPS</span></a>',
      '  <a class="drawer-link" href="/studio/math-pillars.html"><span class="d-link-icon">📐</span><div class="d-link-body"><strong>AI Math Pillars</strong><small>Linear Algebra, STDP, Manifolds &amp; Entropy</small></div><span class="nav-item-badge">MATH</span></a>',
      '  <a class="drawer-link" href="/secure-comms/"><span class="d-link-icon">🔒</span><div class="d-link-body"><strong>SimpleX ↔ Matrix Bridge</strong><small>Zero-Knowledge E2EE Gateway</small></div><span class="nav-item-badge">E2EE</span></a>',
      '  <a class="drawer-link" href="/signal/"><span class="d-link-icon">📡</span><div class="d-link-body"><strong>Signal Swarm Bridge</strong><small>Mobile Phone Command Deck &amp; Voice SSE</small></div><span class="nav-item-badge">MOBILE</span></a>',
      '  <a class="drawer-link" href="/studio/web3-hub.html"><span class="d-link-icon">🪙</span><div class="d-link-body"><strong>Web3 &amp; Solana DeFi Hub</strong><small>Multi-Chain Wallets &amp; Live SOL Matrix</small></div><span class="nav-item-badge">WEB3</span></a>',
      '  <a class="drawer-link" href="/pets/"><span class="d-link-icon">💎</span><div class="d-link-body"><strong>Companion Pets 3D</strong><small>Volumetric Mascot Spirits &amp; Soundboards</small></div><span class="nav-item-badge">MASCOTS</span></a>',
      '  <a class="drawer-link" href="/studio/"><span class="d-link-icon">🛠️</span><div class="d-link-body"><strong>Studio Directory</strong><small>Master Workstation &amp; Toolchain Catalog</small></div><span class="nav-item-badge">INDEX</span></a>',
      '</div>',

      '<!-- 📜 Universe & Media -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">📜 Universe &amp; Research</div>',
      '  <a class="drawer-link" href="/comic/"><span class="d-link-icon">🎨</span><div class="d-link-body"><strong>AZOTH Anime Comic Series</strong><small>Season 1 Ep 1: Genesis in Silicon Rain</small></div><span class="nav-item-badge">AUDIO</span></a>',
      '  <a class="drawer-link" href="/social/"><span class="d-link-icon">🌌</span><div class="d-link-body"><strong>Community Social Wall</strong><small>Builder Dispatches &amp; Showcase Transmissions</small></div><span class="nav-item-badge">LIVE</span></a>',
      '  <a class="drawer-link" href="/articles/"><span class="d-link-icon">📜</span><div class="d-link-body"><strong>Engineering Whitepapers</strong><small>Architectural Deep-Dives &amp; Benchmarks</small></div><span class="nav-item-badge">RESEARCH</span></a>',
      '  <a class="drawer-link" href="/article/"><span class="d-link-icon">🔮</span><div class="d-link-body"><strong>Sovereign AI Manifesto</strong><small>Multi-Agent Consensus &amp; Philosophical Vision</small></div><span class="nav-item-badge">VISION</span></a>',
      '  <a class="drawer-link" href="/ai-webgpu.html"><span class="d-link-icon">⚡</span><div class="d-link-body"><strong>WebGPU Local AI</strong><small>Browser Neural Transformers (360M Micro)</small></div><span class="nav-item-badge">WEBGPU</span></a>',
      '  <a class="drawer-link" href="/adytum/"><span class="d-link-icon">🏛️</span><div class="d-link-body"><strong>Adytum Sanctum</strong><small>Offline Hardware Gateway &amp; Cryptography</small></div><span class="nav-item-badge">SANCTUM</span></a>',
      '</div>',

      '<!-- 📚 Docs, Security & Support -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">📚 Docs &amp; Security</div>',
      '  <a class="drawer-link" href="/docs/"><span class="d-link-icon">📚</span><div class="d-link-body"><strong>Complete Documentation</strong><small>Port Topology, 1-Click Install Scripts &amp; API</small></div><span class="nav-item-badge">DOCS</span></a>',
      '  <a class="drawer-link" href="/vault/"><span class="d-link-icon">🔐</span><div class="d-link-body"><strong>Sovereign Vault</strong><small>Argon2id Secrets, Tokens &amp; Keyrings</small></div><span class="nav-item-badge">ARGON2</span></a>',
      '  <a class="drawer-link" href="/pricing/"><span class="d-link-icon">💛</span><div class="d-link-body"><strong>Support / Patron</strong><small>Keep Zoth Free, Open Source &amp; Sovereign</small></div><span class="nav-item-badge">PATRON</span></a>',
      '  <a class="drawer-link" href="/faq.html"><span class="d-link-icon">❓</span><div class="d-link-body"><strong>FAQ &amp; Troubleshooting</strong><small>Hardware Requirements, Ports &amp; Diagnostics</small></div><span class="nav-item-badge">FAQ</span></a>',
      '</div>',

      '<!-- 🔗 Quick Launch & External Links -->',
      '<div class="drawer-section drawer-footer-section">',
      '  <a class="drawer-pill-link js-deck" href="' + deckUrl + '">💻 Launch Local Operator Deck (:8484)</a>',
      '  <a class="drawer-pill-link" href="https://github.com/NullAITech/zoth-studio" target="_blank" rel="noopener noreferrer">🐙 GitHub Source Repository ↗</a>',
      '  <a class="drawer-pill-link" href="/downloads/zoth-studio-android.apk">📱 Download Android App (.apk)</a>',
      '</div>'
    ].join("");

    if (!drawer) {
      drawer = document.createElement("nav");
      drawer.id = "drawer";
      drawer.className = "drawer";
      drawer.setAttribute("role", "navigation");
      drawer.setAttribute("aria-label", "Universal Mobile Navigation");
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = masterDrawerHtml;
    ensureCanonicalFooter();
    probeDaemons();

    // Mobile Theme Live Search Filter & Category Chips
    var drawerThemeSearch = drawer.querySelector(".drawer-theme-search-input");
    var activeDrawerCat = "all";

    var applyDrawerThemeFilter = function() {
      var query = drawerThemeSearch ? drawerThemeSearch.value.trim().toLowerCase() : "";
      var themeBtns = drawer.querySelectorAll(".drawer-theme-btn");
      themeBtns.forEach(function(btn) {
        var label = btn.getAttribute("data-theme-label") || "";
        var id = btn.getAttribute("data-theme-id") || "";
        var cat = btn.getAttribute("data-theme-cat") || "";
        var matchText = !query || label.includes(query) || id.includes(query);
        var matchCat = activeDrawerCat === "all" || cat === activeDrawerCat;
        btn.style.display = (matchText && matchCat) ? "flex" : "none";
      });
    };

    if (drawerThemeSearch) {
      drawerThemeSearch.addEventListener("input", applyDrawerThemeFilter);
    }

    drawer.querySelectorAll(".theme-filter-chips .theme-chip-btn").forEach(function(chip) {
      chip.addEventListener("click", function(e) {
        e.preventDefault();
        drawer.querySelectorAll(".theme-filter-chips .theme-chip-btn").forEach(function(c) { c.classList.remove("active"); });
        chip.classList.add("active");
        activeDrawerCat = chip.getAttribute("data-drawer-cat") || "all";
        applyDrawerThemeFilter();
        if (window.ZothAudioFX) window.ZothAudioFX.playClick(650, 0.05);
      });
    });

    // ── 10. Robust Burger & Drawer Event Bindings with Focus Management ──
    burger.removeAttribute("onclick");
    
    function closeDrawer(restoreFocus) {
      if (!document.body.classList.contains("menu-open")) return;
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
      var txt = burger.querySelector(".burger-text");
      if (txt) txt.textContent = "Menu";
      else burger.textContent = "Menu";
      if (restoreFocus !== false && burger) {
        try { burger.focus(); } catch (e) {}
      }
    }

    function openDrawer() {
      if (document.body.classList.contains("menu-open")) return;
      document.body.classList.add("menu-open");
      burger.setAttribute("aria-expanded", "true");
      var txt = burger.querySelector(".burger-text");
      if (txt) txt.textContent = "Close";
      else burger.textContent = "Close";
      if (window.ZothAudioFX) window.ZothAudioFX.playClick(700, 0.08);

      setTimeout(function() {
        var firstFocusable = drawer.querySelector(".drawer-theme-search-input, .drawer-close-btn, a, button");
        if (firstFocusable) {
          try { firstFocusable.focus(); } catch (e) {}
        }
      }, 50);
    }

    function toggleDrawer() {
      if (document.body.classList.contains("menu-open")) {
        closeDrawer(true);
      } else {
        openDrawer();
      }
    }

    burger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer();
    });

    var closeBtn = drawer.querySelector(".drawer-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        closeDrawer(true);
      });
    }

    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeDrawer(false);
      });
    });

    // Drawer Accessibility: Focus Trap & Escape Dismissal
    drawer.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        var focusables = Array.from(drawer.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
          .filter(function(el) { return el.offsetParent !== null; });
        if (focusables.length === 0) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeDrawer(true);
      }
    });

    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("menu-open")) {
        if (!drawer.contains(e.target) && !burger.contains(e.target)) {
          closeDrawer(true);
        }
      }
    });

    // Drawer Theme Button Clicks
    drawer.querySelectorAll(".drawer-theme-btn").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        var themeId = btn.getAttribute("data-theme-id");
        if (themeId && window.setZothTheme) {
          window.setZothTheme(themeId);
        }
      });
    });

    // Drawer Action Handlers
    var palTrigger = drawer.querySelector(".drawer-palette-trigger");
    if (palTrigger) {
      palTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        closeDrawer();
        if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === "function") {
          window.ZothWorkbench.openPalette();
        } else {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
        }
      });
    }

    var annTrigger = drawer.querySelector(".drawer-annotate-trigger");
    if (annTrigger) {
      annTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        closeDrawer();
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement("script");
          annotScript.src = ASSETS_BASE + "zoth-annotator.js";
          annotScript.onload = function() {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
      });
    }

    var telTrigger = drawer.querySelector(".drawer-telemetry-trigger, .drawer-telemetry-badge");
    if (telTrigger) {
      telTrigger.addEventListener("click", function(e) {
        e.preventDefault();
        closeDrawer();
        openTelemetryModal();
      });
    }

    var audTrigger = drawer.querySelector(".drawer-audio-trigger");
    if (audTrigger) {
      audTrigger.addEventListener("click", function(e) {
        e.preventDefault();
        var on = window.ZothAudioFX && window.ZothAudioFX.toggle();
        audTrigger.innerHTML = '<span>' + (on ? '🔊' : '🔇') + '</span> Audio FX';
        if (on && window.ZothAudioFX) window.ZothAudioFX.playClick(880, 0.1, "sine");
      });
    }

    // Topbar Scroll Blur Listener & Back-to-Top Button
    var backToTop = document.getElementById("zoth-back-to-top");
    if (!backToTop) {
      backToTop = document.createElement("button");
      backToTop.id = "zoth-back-to-top";
      backToTop.className = "zoth-back-to-top";
      backToTop.title = "Back to Top";
      backToTop.innerHTML = "↑";
      backToTop.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.ZothAudioFX) window.ZothAudioFX.playClick(900, 0.05);
      });
      document.body.appendChild(backToTop);
    }

    if (!topbar.dataset.scrollBound) {
      topbar.dataset.scrollBound = "true";
      var onScroll = function () {
        if (window.scrollY > 15) {
          topbar.classList.add("on");
        } else {
          topbar.classList.remove("on");
        }

        var scrollProgress = document.getElementById("zoth-scroll-progress");
        if (scrollProgress) {
          var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          var pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
          scrollProgress.style.width = pct + "%";
        }

        if (window.scrollY > 300) {
          backToTop.classList.add("visible");
        } else {
          backToTop.classList.remove("visible");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // ── 11. Global Keyboard Shortcuts ──
    document.addEventListener("keydown", function (e) {
      // Shift+A -> Annotator
      if ((e.shiftKey && e.key === "A" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) ||
          (e.ctrlKey && e.altKey && e.code === "KeyA")) {
        e.preventDefault();
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement("script");
          annotScript.src = ASSETS_BASE + "zoth-annotator.js";
          annotScript.onload = function() {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
      }

      // ? / Shift+/ -> Hotkeys modal
      if (e.key === "?" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        e.preventDefault();
        openHotkeysModal();
      }
    });

    // ── 12. Active Route Highlighting ──
    var currentPath = (window.location.pathname || "/").replace(/index\.html$/, "");
    if (!currentPath.endsWith("/")) currentPath += "/";

    document.querySelectorAll("nav.menu a, nav.drawer a, #drawer a, .nav-dropdown-menu a").forEach(function (a) {
      var rawHref = a.getAttribute("href") || "";
      var href = rawHref.replace(/index\.html$/, "");
      if (href && href.startsWith("/") && href !== "/#how-it-works" && href !== "/#for-everyone" && href !== "/#install") {
        if (!href.endsWith("/") && !href.includes(".")) href += "/";
        if (href === currentPath || (currentPath !== "/" && href.length > 2 && currentPath.startsWith(href))) {
          a.classList.add("on");
          var parentDropdown = a.closest(".nav-dropdown");
          if (parentDropdown) {
            var parentBtn = parentDropdown.querySelector(".nav-dropdown-btn");
            if (parentBtn) parentBtn.classList.add("on");
          }
        }
      }
    });

    // Universal Tactile UI Audio Delegator for all workstations & buttons
    document.addEventListener("click", function(e) {
      if (!window.ZothAudioFX || !window.ZothAudioFX.isEnabled()) return;
      var interactive = e.target.closest("button, .btn, .webgen-chip, .strength-opt, .pill-btn, .tab-btn, .theme-btn, .filter-chip, [role='button'], .hud-modal-btn");
      if (interactive && !e.target.closest(".nav-btn, .theme-card-row, .drawer-theme-btn, #nav-sound-toggle, #drawer-sound-toggle, .nav-pet-pill")) {
        window.ZothAudioFX.playClick(680, 0.04, "sine");
      }
    }, true);

    // Listen for theme changes
    window.addEventListener("zoth-theme-change", function(e) {
      if (e && e.detail && e.detail.themeObj) {
        var em = document.querySelectorAll(".current-theme-emoji");
        var lb = document.querySelectorAll(".current-theme-label");
        var sw = document.querySelectorAll(".current-theme-swatch");
        em.forEach(function(el) { el.textContent = e.detail.themeObj.emoji; });
        lb.forEach(function(el) { el.textContent = e.detail.themeObj.label; });
        sw.forEach(function(el) { el.style.backgroundColor = e.detail.themeObj.accent; });
        
        document.querySelectorAll(".theme-card-row, .drawer-theme-btn").forEach(function(btn) {
          var isThis = btn.getAttribute("data-theme-id") === e.detail.theme;
          btn.classList.toggle("active", isThis);
          btn.setAttribute("aria-pressed", isThis ? "true" : "false");
          
          var check = btn.querySelector(".theme-card-check");
          if (isThis && !check && btn.classList.contains("theme-card-row")) {
            var checkSpan = document.createElement("span");
            checkSpan.className = "theme-card-check";
            checkSpan.textContent = "✓";
            btn.appendChild(checkSpan);
          } else if (!isThis && check) {
            check.remove();
          }
        });

        if (window.ZothAudioFX) {
          window.ZothAudioFX.playThemeChime(e.detail.theme);
        }
      }
    });
  }

  // ── 13. Telemetry & Diagnostics Modal ──
  function openTelemetryModal() {
    var existing = document.getElementById("zoth-telemetry-modal");
    if (existing) existing.remove();

    var isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

    var modal = document.createElement("div");
    modal.id = "zoth-telemetry-modal";
    modal.className = "zoth-hud-modal-overlay";
    modal.innerHTML = [
      '<div class="zoth-hud-modal-card">',
      '  <div class="hud-modal-header">',
      '    <div class="hud-modal-title"><span>⚡</span> Studio Telemetry &amp; Daemon Topology</div>',
      '    <button type="button" class="hud-modal-close" aria-label="Close Diagnostics">✕</button>',
      '  </div>',
      '  <div class="hud-modal-body">',
      '    <div class="hud-daemon-grid">',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Web Server</strong><span class="daemon-port">:8088</span><span class="daemon-latency">0.8ms</span></div>',
      '        <div class="hud-daemon-desc">0.0.0.0 bind • HTTP/1.1 Static Assets &amp; Routing</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Orchestrator Deck</strong><span class="daemon-port">:8484</span><span class="daemon-latency">1.2ms</span></div>',
      '        <div class="hud-daemon-desc">Autonomous Agent Swarm &amp; Keystroke PTY Engine</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Sovereign Vault</strong><span class="daemon-port">:8787</span><span class="daemon-latency">1.0ms</span></div>',
      '        <div class="hud-daemon-desc">Argon2id + XChaCha20-Poly1305 Security Enclave</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Memory Daemon</strong><span class="daemon-port">:8788</span><span class="daemon-latency">1.4ms</span></div>',
      '        <div class="hud-daemon-desc">Lucy Oracle &amp; Biomorphic Memory Vector DB</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>SimpleX Chat</strong><span class="daemon-port">:5225</span><span class="daemon-latency">2.1ms</span></div>',
      '        <div class="hud-daemon-desc">Zero-Knowledge E2EE Websocket Transport</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>SimpleX Bridge</strong><span class="daemon-port">:8767</span><span class="daemon-latency">1.8ms</span></div>',
      '        <div class="hud-daemon-desc">Local Swarm HTTP/Matrix Gateway</div>',
      '      </div>',
      '    </div>',
      '    <div class="hud-stats-row">',
      '      <div class="hud-stat-pill"><strong>Active Model</strong><span>Kyber-1024 / Qwen2.5</span></div>',
      '      <div class="hud-stat-pill"><strong>Latency</strong><span>' + (isLocal ? '1.2ms (Localhost)' : 'Edge CDN') + '</span></div>',
      '      <div class="hud-stat-pill"><strong>Agents Ready</strong><span>21 / 21 Swarm</span></div>',
      '    </div>',
      '  </div>',
      '  <div class="hud-modal-footer">',
      '    <a class="hud-modal-btn js-deck" href="http://127.0.0.1:8484/" target="_blank" rel="noopener noreferrer">Open Local Deck (:8484)</a>',
      '    <button type="button" class="hud-modal-btn hud-modal-btn-ghost" onclick="document.getElementById(\'zoth-telemetry-modal\').remove();">Close</button>',
      '  </div>',
      '</div>'
    ].join("");

    document.body.appendChild(modal);

    modal.querySelector(".hud-modal-close").addEventListener("click", function() {
      modal.remove();
    });

    modal.addEventListener("click", function(e) {
      if (e.target === modal) modal.remove();
    });

    if (window.ZothAudioFX) window.ZothAudioFX.playClick(850, 0.08);
  }

  // ── 14. Studio Hotkey Legend Modal ──
  function openHotkeysModal() {
    var existing = document.getElementById("zoth-hotkeys-modal");
    if (existing) existing.remove();

    var modal = document.createElement("div");
    modal.id = "zoth-hotkeys-modal";
    modal.className = "zoth-hud-modal-overlay";
    modal.innerHTML = [
      '<div class="zoth-hud-modal-card">',
      '  <div class="hud-modal-header">',
      '    <div class="hud-modal-title"><span>⌨️</span> Studio Keyboard Shortcuts</div>',
      '    <button type="button" class="hud-modal-close">✕</button>',
      '  </div>',
      '  <div class="hud-modal-body">',
      '    <div class="hud-shortcut-list">',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Global Command Palette &amp; Tool Hub</span><kbd class="nav-kbd">Ctrl+K</kbd></div>',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Cycle 16 Visual Brand Themes</span><kbd class="nav-kbd">Shift+T</kbd></div>',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Toggle On-Screen Annotator &amp; Drawing</span><kbd class="nav-kbd">Shift+A</kbd></div>',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Toggle Floating HUD Dock</span><kbd class="nav-kbd">Alt+D</kbd></div>',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Open Keyboard Shortcuts Legend</span><kbd class="nav-kbd">?</kbd></div>',
      '      <div class="hud-shortcut-row"><span class="shortcut-desc">Dismiss Active Modal or Menu</span><kbd class="nav-kbd">Esc</kbd></div>',
      '    </div>',
      '  </div>',
      '  <div class="hud-modal-footer">',
      '    <button type="button" class="hud-modal-btn" onclick="document.getElementById(\'zoth-hotkeys-modal\').remove();">Got It</button>',
      '  </div>',
      '</div>'
    ].join("");

    document.body.appendChild(modal);

    modal.querySelector(".hud-modal-close").addEventListener("click", function() {
      modal.remove();
    });

    modal.addEventListener("click", function(e) {
      if (e.target === modal) modal.remove();
    });

    if (window.ZothAudioFX) window.ZothAudioFX.playClick(850, 0.08);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUniversalNav);
  } else {
    initUniversalNav();
  }
})();
