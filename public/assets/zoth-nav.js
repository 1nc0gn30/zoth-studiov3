/**
 * ⚡ ZOTH STUDIO — UNIVERSAL MASTER NAVIGATION & TELEMETRY ENGINE (v11.0)
 * Features:
 * 1. Self-Healing 100% Mobile Drawer & Desktop Topbar across all pages
 * 2. Real-Time Daemon Health HUD & Diagnostics Popover
 * 3. Mobile Theme Search & Categorized 16-Theme Grid
 * 4. Procedural Web Audio FX Synthesizer (Zero External Dependencies)
 * 5. Neon Route Progress Bar & Kinetic Back-to-Top Pill
 * 6. Studio Hotkey Legend Modal (?)
 */
(function () {
  'use strict';

  // ── 1. Ensure Universal Dependency Stylesheets & Scripts ──
  function ensureStylesheet(id, href) {
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  ensureStylesheet("zoth-theme-core-css", "/assets/zoth-theme.css?v=11");
  ensureStylesheet("zoth-theme-fx-css", "/assets/zoth-theme-fx.css?v=11");
  ensureStylesheet("zoth-theme-transformer-css", "/assets/zoth-theme-transformer.css?v=11");
  ensureStylesheet("zoth-theme-light-css", "/assets/zoth-theme-light.css?v=11");
  ensureStylesheet("zoth-nav-css", "/assets/zoth-nav.css?v=11");
  ensureStylesheet("zoth-magic-ui-css", "/assets/zoth-magic-ui.css?v=11");
  ensureStylesheet("zoth-interactive-dock-css", "/assets/zoth-interactive-dock.css?v=11");

  if (!window.setZothTheme && !document.querySelector('script[src*="zoth-theme.js"]')) {
    var themeScript = document.createElement("script");
    themeScript.src = "/assets/zoth-theme.js?v=11";
    document.head.appendChild(themeScript);
  }

  if (!window.ZothPetHUD && !document.querySelector('script[src*="zoth-pet-hud.js"]')) {
    var petHudScript = document.createElement("script");
    petHudScript.src = "/assets/zoth-pet-hud.js?v=11";
    document.head.appendChild(petHudScript);
  }

  if (!window.ZothWorkbench && !document.querySelector('script[src*="zoth-workbench.js"]')) {
    var wbScript = document.createElement("script");
    wbScript.src = "/assets/zoth-workbench.js?v=11";
    wbScript.defer = true;
    document.head.appendChild(wbScript);
  }

  if (!document.querySelector('script[src*="zoth-interactive-dock.js"]')) {
    var dockScript = document.createElement("script");
    dockScript.src = "/assets/zoth-interactive-dock.js?v=11";
    dockScript.defer = true;
    document.head.appendChild(dockScript);
  }

  if (!document.querySelector('script[src*="zoth-spotlight.js"]')) {
    var spotScript = document.createElement("script");
    spotScript.src = "/assets/zoth-spotlight.js?v=11";
    spotScript.defer = true;
    document.head.appendChild(spotScript);
  }

  // ── 2. Procedural Web Audio Synthesizer (Zero Assets Needed) ──
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
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (duration || 0.08));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + (duration || 0.08));
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

  // ── 4. Main Navigation & Mobile Drawer Constructor ──
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

    // Find or Auto-Inject Master Topbar
    var topbar = document.getElementById("topbar") || document.querySelector("header.bar") || document.querySelector("header#topbar") || document.querySelector("header[role='banner']");
    
    if (!topbar) {
      topbar = document.createElement("header");
      topbar.id = "topbar";
      topbar.className = "bar";
      topbar.setAttribute("role", "banner");
      topbar.innerHTML = [
        '<a aria-label="Zoth Studio Home" class="brand js-hub" href="/">',
        '  <img alt="Zoth Emblem" decoding="async" height="36" width="36" loading="lazy" src="/assets/brand/zoth-golden-z-192.png" style="border-radius: 8px; box-shadow: 0 0 10px rgba(251,191,36,0.2);"/>',
        '  <span><strong>Zoth</strong><small>by NullAI</small></span>',
        '</a>',
        '<nav aria-label="Primary navigation" class="menu" role="navigation">',
        '  <a class="nav-link" href="/#how-it-works">✦ How It Works</a>',
        '  <a class="nav-link" href="/secure-comms/" style="color: var(--cyan); text-shadow: 0 0 10px rgba(0,240,255,0.4);">🔒 SimpleX Matrix</a>',
        '  <a class="nav-link" href="/studio/web3-hub.html" style="color: var(--gold); text-shadow: 0 0 10px rgba(251,191,36,0.3);">🪙 Web3</a>',
        '  <a class="nav-pill git" href="https://github.com/NullAITech/zoth-studio" rel="noopener noreferrer" target="_blank">GitHub ↗</a>',
        '</nav>',
        '<button aria-controls="drawer" aria-expanded="false" aria-label="Toggle navigation menu" class="burger" id="burger" type="button">Menu</button>'
      ].join("");
      document.body.insertBefore(topbar, document.body.firstChild);
    }

    var menuBar = topbar.querySelector("nav.menu");
    var burger = topbar.querySelector("#burger") || topbar.querySelector(".burger") || document.getElementById("burger");

    if (!burger) {
      burger = document.createElement("button");
      burger.id = "burger";
      burger.className = "burger";
      burger.type = "button";
      burger.setAttribute("aria-controls", "drawer");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Toggle navigation menu");
      burger.textContent = "Menu";
      topbar.appendChild(burger);
    }

    // Telemetry Diagnostics Modal Trigger in Desktop Navbar
    if (menuBar && !menuBar.querySelector(".nav-telemetry-pill")) {
      var telPill = document.createElement("button");
      telPill.type = "button";
      telPill.className = "nav-pill nav-telemetry-pill";
      telPill.title = "View Live Studio Telemetry & Background Daemons";
      telPill.innerHTML = '<span class="tel-dot"></span><span class="tel-text">5/5 DAEMONS</span>';
      telPill.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        openTelemetryModal();
      });
      menuBar.insertBefore(telPill, menuBar.firstChild);
    }

    // Ensure Universal Desktop Quick Tools (Annotate, Palette, Theme Popover)
    if (menuBar) {
      if (!menuBar.querySelector(".nav-annotate-btn")) {
        var annotateBtn = document.createElement("button");
        annotateBtn.type = "button";
        annotateBtn.className = "nav-pill nav-annotate-btn";
        annotateBtn.setAttribute("title", "Toggle On-Screen Annotator & Feedback (Shift+A)");
        annotateBtn.setAttribute("aria-label", "Toggle Annotator Tool");
        annotateBtn.innerHTML = '<span class="annotate-icon">✏️</span><span class="annotate-text">Annotate</span><kbd class="nav-kbd">Shift+A</kbd>';
        annotateBtn.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
            window.ZothAnnotator.toggle();
          } else {
            var annotScript = document.createElement("script");
            annotScript.src = "/assets/zoth-annotator.js";
            annotScript.onload = function() {
              if (window.ZothAnnotator) window.ZothAnnotator.toggle();
            };
            document.head.appendChild(annotScript);
          }
        });
        
        var gitPill = menuBar.querySelector(".nav-pill.git") || menuBar.lastElementChild;
        if (gitPill) menuBar.insertBefore(annotateBtn, gitPill);
        else menuBar.appendChild(annotateBtn);
      }

      if (!menuBar.querySelector(".nav-palette-btn")) {
        var paletteBtn = document.createElement("button");
        paletteBtn.type = "button";
        paletteBtn.className = "nav-pill nav-palette-btn";
        paletteBtn.setAttribute("title", "Open Global Command Palette (Ctrl+K)");
        paletteBtn.setAttribute("aria-label", "Command Palette");
        paletteBtn.innerHTML = '<span class="palette-icon">🔍</span><kbd class="nav-kbd">Ctrl+K</kbd>';
        paletteBtn.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === "function") {
            window.ZothWorkbench.openPalette();
          } else {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          }
        });
        
        var annotateBtnRef = menuBar.querySelector(".nav-annotate-btn");
        if (annotateBtnRef) menuBar.insertBefore(paletteBtn, annotateBtnRef);
        else menuBar.appendChild(paletteBtn);
      }

      // Desktop Theme Popover
      var oldSwitcher = menuBar.querySelector(".zoth-nav-theme-switcher");
      if (oldSwitcher) oldSwitcher.style.display = "none";
      
      var existingThemeDd = menuBar.querySelector(".nav-theme-dropdown");
      if (existingThemeDd) existingThemeDd.remove();

      var themeDd = document.createElement("div");
      themeDd.className = "nav-dropdown nav-theme-dropdown";
      
      var categories = ["Studio Originals", "Frontier AI & Tech", "Developer Archetypes"];
      var groupedHtml = categories.map(function(cat) {
        var items = themesList.filter(function(t) { return (t.category || "Studio Originals") === cat; });
        if (!items.length) return "";
        var catIcon = cat.startsWith("Studio") ? "✦" : (cat.startsWith("Frontier") ? "🌐" : "⚡");
        
        return [
          '<div class="theme-popover-category" data-cat-name="' + cat + '">',
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

      var isAudioOn = window.ZothAudioFX && window.ZothAudioFX.isEnabled();

      themeDd.innerHTML = [
        '<button aria-expanded="false" aria-haspopup="true" class="nav-dropdown-btn nav-theme-current-btn" type="button" title="Switch Visual Theme (Shift+T)">',
        '  <span class="current-theme-swatch" style="background:' + curThemeObj.accent + ';"></span>',
        '  <span class="current-theme-emoji">' + curThemeObj.emoji + '</span>',
        '  <span class="current-theme-label">' + curThemeObj.label + '</span>',
        '  <svg class="dropdown-chevron" fill="none" height="6" viewBox="0 0 10 6" width="10"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>',
        '</button>',
        '<div class="nav-dropdown-menu nav-theme-popover-menu">',
        '  <div class="theme-popover-header">',
        '    <div class="theme-popover-title">',
        '      <span class="palette-icon">🎨</span> Visual Identity Studio',
        '    </div>',
        '    <div class="theme-popover-actions">',
        '      <button type="button" class="theme-audio-toggle-btn" title="Toggle UI Sound Synthesizer">' + (isAudioOn ? '🔊 Audio FX' : '🔇 Audio Off') + '</button>',
        '      <kbd class="nav-kbd">Shift+T</kbd>',
        '    </div>',
        '  </div>',
        '  <div class="theme-popover-search-wrap">',
        '    <span class="search-icon">🔍</span>',
        '    <input type="text" class="theme-search-input" placeholder="Filter 16 themes (e.g. Apple, Matrix, Grok)..." autocomplete="off" spellcheck="false" />',
        '    <button type="button" class="theme-search-clear" style="display:none;">×</button>',
        '  </div>',
        '  <div class="theme-popover-scroll-body">',
        groupedHtml,
        '  </div>',
        '  <div class="theme-popover-footer">',
        '    <span>⚡ 16 Sovereign Workstation Archetypes</span>',
        '    <span><kbd class="nav-kbd">↑</kbd> <kbd class="nav-kbd">↓</kbd> <kbd class="nav-kbd">Enter</kbd></span>',
        '  </div>',
        '</div>'
      ].join("");

      var gitPillRef = menuBar.querySelector(".nav-pill.git") || menuBar.lastElementChild;
      if (gitPillRef) menuBar.insertBefore(themeDd, gitPillRef);
      else menuBar.appendChild(themeDd);

      var themeTriggerBtn = themeDd.querySelector(".nav-theme-current-btn");
      var searchInput = themeDd.querySelector(".theme-search-input");
      var searchClear = themeDd.querySelector(".theme-search-clear");
      var audioToggleBtn = themeDd.querySelector(".theme-audio-toggle-btn");

      if (audioToggleBtn) {
        audioToggleBtn.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          var on = window.ZothAudioFX && window.ZothAudioFX.toggle();
          audioToggleBtn.textContent = on ? "🔊 Audio FX" : "🔇 Audio Off";
          if (on && window.ZothAudioFX) window.ZothAudioFX.playClick(880, 0.1, "sine");
        });
      }

      if (searchInput) {
        searchInput.addEventListener("input", function() {
          var q = searchInput.value.trim().toLowerCase();
          searchClear.style.display = q ? "block" : "none";
          
          var allRows = themeDd.querySelectorAll(".theme-card-row");
          var categoriesEls = themeDd.querySelectorAll(".theme-popover-category");
          
          allRows.forEach(function(row) {
            var name = row.getAttribute("data-theme-label") || "";
            var id = row.getAttribute("data-theme-id") || "";
            var cat = row.getAttribute("data-theme-cat") || "";
            var match = !q || name.includes(q) || id.includes(q) || cat.includes(q);
            row.style.display = match ? "flex" : "none";
          });

          categoriesEls.forEach(function(catEl) {
            var visibleRows = catEl.querySelectorAll(".theme-card-row:not([style*='display: none'])");
            catEl.style.display = visibleRows.length > 0 ? "flex" : "none";
          });
        });

        searchClear.addEventListener("click", function(e) {
          e.preventDefault();
          searchInput.value = "";
          searchInput.dispatchEvent(new Event("input"));
          searchInput.focus();
        });
      }
      
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

    // ── 5. Self-Healing Master Mobile Drawer (With Live Theme Search) ──
    var drawer = document.getElementById("drawer") || document.querySelector("nav.drawer") || document.querySelector("#drawer");
    
    var masterDrawerHtml = [
      '<div class="drawer-header-brand">',
      '  <div class="d-brand-left">',
      '    <img src="/assets/brand/zoth-golden-z-192.png" alt="Zoth" width="28" height="28" style="border-radius:6px;"/>',
      '    <span><strong>Zoth Studio</strong><small>v7.0 Sovereign</small></span>',
      '  </div>',
      '  <button type="button" class="drawer-close-btn" aria-label="Close mobile menu">✕</button>',
      '</div>',

      '<!-- 🎨 Visual Theme Grid with Live Search -->',
      '<div class="drawer-section drawer-theme-section">',
      '  <div class="drawer-heading">🎨 Visual Theme (' + themesList.length + ' Archetypes)</div>',
      '  <div class="drawer-search-wrap">',
      '    <span class="search-icon">🔍</span>',
      '    <input type="text" class="drawer-theme-search-input" placeholder="Search 16 themes..." autocomplete="off" />',
      '  </div>',
      '  <div class="drawer-theme-grid">',
      themesList.map(function(t) {
        var isAct = t.id === curTheme;
        return '<button class="drawer-theme-btn' + (isAct ? ' active' : '') + '" data-theme-id="' + t.id + '" data-theme-label="' + t.label.toLowerCase() + '" type="button" aria-pressed="' + isAct + '"><span class="d-swatch" style="background:' + t.accent + '"></span><span class="d-emoji">' + t.emoji + '</span><span class="d-label">' + t.label + '</span></button>';
      }).join(""),
      '  </div>',
      '</div>',

      '<!-- 🛠️ Quick Developer Tools -->',
      '<div class="drawer-section drawer-tools-section">',
      '  <div class="drawer-heading">⚡ Developer Tools</div>',
      '  <div class="drawer-quick-tools-grid">',
      '    <button type="button" class="drawer-tool-pill drawer-palette-trigger"><span>🔍</span> Command Palette <kbd class="nav-kbd">Ctrl+K</kbd></button>',
      '    <button type="button" class="drawer-tool-pill drawer-annotate-trigger"><span>✏️</span> On-Screen Annotator <kbd class="nav-kbd">Shift+A</kbd></button>',
      '  </div>',
      '</div>',

      '<!-- 🪐 Studio Workstations -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">🪐 Workstations &amp; DAGs</div>',
      '  <a class="drawer-link" href="/studio/cockpit.html"><strong>🪐 The Cockpit</strong><small>21-Agent Autonomous Swarm</small></a>',
      '  <a class="drawer-link" href="/studio/consensus.html"><strong>⚔️ Consensus Arena</strong><small>3-Agent Debate &amp; AST Synthesis</small></a>',
      '  <a class="drawer-link" href="/studio/webgen.html"><strong>⚡ WebGen Studio</strong><small>PTY Terminal &amp; Website Foundry</small></a>',
      '  <a class="drawer-link" href="/studio/nexus-3d.html"><strong>📐 Nexus 3D Omniverse</strong><small>CAD Viewport &amp; AI Mesh Generator</small></a>',
      '  <a class="drawer-link" href="/studio/omnipost.html"><strong>🎬 OmniPost 2.0 Video</strong><small>60 FPS Video Studio &amp; Social Motion</small></a>',
      '  <a class="drawer-link" href="/studio/swarm.html"><strong>🌐 3D Swarm Arena</strong><small>Kinetic WebGL Battle Arena</small></a>',
      '  <a class="drawer-link" href="/vault/"><strong>🔐 Sovereign Vault</strong><small>Argon2id Secrets &amp; Keyrings</small></a>',
      '  <a class="drawer-link" href="/secure-comms/"><strong>🔒 SimpleX ↔ Matrix Bridge</strong><small>Zero-Knowledge E2EE Gateway</small></a>',
      '  <a class="drawer-link" href="/studio/web3-hub.html"><strong>🪙 Web3 &amp; Solana DeFi Hub</strong><small>Multi-Chain Wallets &amp; Live SOL Matrix</small></a>',
      '  <a class="drawer-link" href="/memory/"><strong>🧠 Netrunner Memory World</strong><small>Biomorphic Associative Graph</small></a>',
      '  <a class="drawer-link" href="/pets/"><strong>💎 Companion Pets 3D</strong><small>Volumetric Mascot Spirits</small></a>',
      '  <a class="drawer-link" href="/signal/"><strong>📡 Signal Swarm Bridge</strong><small>Mobile Phone Command Deck &amp; SSE</small></a>',
      '  <a class="drawer-link" href="/studio/"><strong>🛠️ All 14+ Studio Tools</strong><small>Master Workstation Directory</small></a>',
      '</div>',

      '<!-- 🔮 Core AI Engine & Archetypes -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">🔮 Core Engine &amp; Archetypes</div>',
      '  <a class="drawer-link" href="/zoth/"><strong>🔮 Master Azoth Core</strong><small>Sovereign Alchemical AI Core</small></a>',
      '  <a class="drawer-link" href="/agents/"><strong>⚡ 21-Agent Pantheon</strong><small>Model Archetypes &amp; Sandboxes</small></a>',
      '  <a class="drawer-link" href="/zoth-world.html"><strong>🌌 Zoth World 3D Sanctum</strong><small>Living Hermetic Swarm &amp; Multiverse</small></a>',
      '</div>',

      '<!-- 📜 Codex, Articles & Media -->',
      '<div class="drawer-section">',
      '  <div class="drawer-heading">📜 Codex &amp; Research</div>',
      '  <a class="drawer-link" href="/articles/"><strong>📜 Engineering Whitepapers</strong><small>Architectural Deep-Dives &amp; Benchmarks</small></a>',
      '  <a class="drawer-link" href="/article/"><strong>🔮 Sovereign AI Manifesto</strong><small>Consensus &amp; Philosophical Vision</small></a>',
      '  <a class="drawer-link" href="/ai-webgpu.html"><strong>⚡ WebGPU Local AI</strong><small>Browser Neural Transformers (360M Micro)</small></a>',
      '  <a class="drawer-link" href="/comic/"><strong>🎨 Anime Comic &amp; Manga</strong><small>Motion Episodes &amp; Soundboards</small></a>',
      '  <a class="drawer-link" href="/social/"><strong>🌌 Community Social Wall</strong><small>Builder Dispatches &amp; Showcase</small></a>',
      '  <a class="drawer-link" href="/docs/"><strong>📚 Complete Documentation</strong><small>Port Matrix &amp; API Reference</small></a>',
      '  <a class="drawer-link" href="/adytum/"><strong>🏛️ Adytum Sanctum</strong><small>Offline Hardware Gateway &amp; Crypto</small></a>',
      '</div>',

      '<!-- 🔗 External Links -->',
      '<div class="drawer-section drawer-footer-section">',
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

    // Mobile Theme Live Search Filter
    var drawerThemeSearch = drawer.querySelector(".drawer-theme-search-input");
    if (drawerThemeSearch) {
      drawerThemeSearch.addEventListener("input", function() {
        var query = drawerThemeSearch.value.trim().toLowerCase();
        var themeBtns = drawer.querySelectorAll(".drawer-theme-btn");
        themeBtns.forEach(function(btn) {
          var label = btn.getAttribute("data-theme-label") || "";
          var id = btn.getAttribute("data-theme-id") || "";
          var match = !query || label.includes(query) || id.includes(query);
          btn.style.display = match ? "flex" : "none";
        });
      });
    }

    // ── 6. Robust Burger & Drawer Event Bindings ──
    burger.removeAttribute("onclick");
    
    function closeDrawer() {
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
      burger.textContent = "Menu";
    }

    function openDrawer() {
      document.body.classList.add("menu-open");
      burger.setAttribute("aria-expanded", "true");
      burger.textContent = "Close";
      if (window.ZothAudioFX) window.ZothAudioFX.playClick(700, 0.08);
    }

    function toggleDrawer() {
      if (document.body.classList.contains("menu-open")) {
        closeDrawer();
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
        closeDrawer();
      });
    }

    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeDrawer();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeDrawer();
      }
    });

    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("menu-open")) {
        if (!drawer.contains(e.target) && !burger.contains(e.target)) {
          closeDrawer();
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

    // Drawer Quick Tools Action Handlers
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
          annotScript.src = "/assets/zoth-annotator.js";
          annotScript.onload = function() {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
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

        if (window.scrollY > 300) {
          backToTop.classList.add("visible");
        } else {
          backToTop.classList.remove("visible");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // ── 7. Global Keyboard Shortcuts ──
    document.addEventListener("keydown", function (e) {
      // Shift+A -> Annotator
      if ((e.shiftKey && e.key === "A" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) ||
          (e.ctrlKey && e.altKey && e.code === "KeyA")) {
        e.preventDefault();
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement("script");
          annotScript.src = "/assets/zoth-annotator.js";
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

    // ── 8. Active Route Highlighting ──
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

    // Listen for theme changes to update active states across all controls
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

  // ── 9. Telemetry & Diagnostics Modal ──
  function openTelemetryModal() {
    var existing = document.getElementById("zoth-telemetry-modal");
    if (existing) existing.remove();

    var modal = document.createElement("div");
    modal.id = "zoth-telemetry-modal";
    modal.className = "zoth-hud-modal-overlay";
    modal.innerHTML = [
      '<div class="zoth-hud-modal-card">',
      '  <div class="hud-modal-header">',
      '    <div class="hud-modal-title"><span>⚡</span> Studio Telemetry &amp; Background Daemons</div>',
      '    <button type="button" class="hud-modal-close">✕</button>',
      '  </div>',
      '  <div class="hud-modal-body">',
      '    <div class="hud-daemon-grid">',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Web Server</strong><span class="daemon-port">:8088</span></div>',
      '        <div class="hud-daemon-desc">0.0.0.0 bind • HTTP/1.1 Static Assets &amp; Routing</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Orchestrator</strong><span class="daemon-port">:8484</span></div>',
      '        <div class="hud-daemon-desc">Autonomous Agent Swarm &amp; Keystroke PTY Engine</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>Sovereign Vault</strong><span class="daemon-port">:8787</span></div>',
      '        <div class="hud-daemon-desc">Argon2id + XChaCha20-Poly1305 Security Enclave</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>SimpleX Chat</strong><span class="daemon-port">:5225</span></div>',
      '        <div class="hud-daemon-desc">Zero-Knowledge E2EE Websocket Transport</div>',
      '      </div>',
      '      <div class="hud-daemon-card">',
      '        <div class="hud-daemon-top"><span class="daemon-badge-dot online"></span><strong>SimpleX Bridge</strong><span class="daemon-port">:8767</span></div>',
      '        <div class="hud-daemon-desc">Local Swarm HTTP/Matrix Gateway</div>',
      '      </div>',
      '    </div>',
      '    <div class="hud-stats-row">',
      '      <div class="hud-stat-pill"><strong>Active Model</strong><span>Kyber-1024 / Qwen2.5</span></div>',
      '      <div class="hud-stat-pill"><strong>Latency</strong><span>12ms (Localhost)</span></div>',
      '      <div class="hud-stat-pill"><strong>Agents Ready</strong><span>21 / 21 Swarm</span></div>',
      '    </div>',
      '  </div>',
      '  <div class="hud-modal-footer">',
      '    <button type="button" class="hud-modal-btn" onclick="document.getElementById(\'zoth-telemetry-modal\').remove();">Close Telemetry</button>',
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

  // ── 10. Studio Hotkey Legend Modal ──
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
