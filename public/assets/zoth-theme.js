/**
 * ZOTH STUDIO — 16-THEME UNIVERSAL ENGINE (v7.0 Master)
 * Provides instant theme switching, localStorage persistence, Shift+T hotkey,
 * full metadata registry, and CustomEvent dispatch across all workstations.
 */
(function () {
  "use strict";

  var THEMES = [
    // ✦ Studio Originals
    { id: "dark", label: "Dark Void", emoji: "🌙", accent: "#00f0ff", bg: "#05060a", category: "Studio Originals", desc: "Zoth Tron Cyber HUD & Electric Cyan", company: "Zoth Core" },
    { id: "light", label: "Solar Light", emoji: "☀️", accent: "#0a2540", bg: "#f7f9fc", category: "Studio Originals", desc: "Swiss Precision & Pure Alabaster", company: "Swiss Minimalist" },
    { id: "matrix", label: "Matrix CRT", emoji: "📟", accent: "#00ff41", bg: "#000a00", category: "Studio Originals", desc: "Phosphor Green Terminal & Digital Rain", company: "Cyber Terminal" },
    { id: "gold", label: "Hermetic Gold", emoji: "⚗️", accent: "#fbbf24", bg: "#050300", category: "Studio Originals", desc: "24K Alchemical Obsidian & Golden Ratio", company: "Hermetic Alchemy" },

    // 🌐 Tech Giants & Frontier AI
    { id: "google", label: "Google Material", emoji: "🌐", accent: "#8ab4f8", bg: "#121212", category: "Frontier AI & Tech", desc: "Material You, Gemini 4-Color & 28px Curves", company: "Google Material" },
    { id: "microsoft", label: "Microsoft Fluent", emoji: "🪟", accent: "#0078d4", bg: "#0a0d14", category: "Frontier AI & Tech", desc: "Fluent 2, Mica Glass & Win11 Specular Glow", company: "Microsoft Fluent" },
    { id: "apple", label: "Apple Cupertino", emoji: "🍎", accent: "#0a84ff", bg: "#000000", category: "Frontier AI & Tech", desc: "Cupertino HIG, VisionOS Glass & OLED", company: "Apple Cupertino" },
    { id: "openai", label: "OpenAI Slate", emoji: "✨", accent: "#10a37f", bg: "#0d0d0d", category: "Frontier AI & Tech", desc: "ChatGPT Minimalist Zinc & Emerald Mint", company: "ChatGPT Slate" },
    { id: "amazon", label: "AWS Console", emoji: "☁️", accent: "#ff9900", bg: "#0b131e", category: "Frontier AI & Tech", desc: "AWS Squid-Ink Navy, Amber Sparks & Telemetry", company: "AWS Obsidian" },
    { id: "anthropic", label: "Claude Editorial", emoji: "🏺", accent: "#d97757", bg: "#141210", category: "Frontier AI & Tech", desc: "Terracotta Obsidian, Literary Serif & Warmth", company: "Anthropic Claude" },
    { id: "xai", label: "Grok Stark Cyber", emoji: "⚡", accent: "#00d4aa", bg: "#000000", category: "Frontier AI & Tech", desc: "xAI Pitch Black & 2px Brutalist Mint Wireframes", company: "xAI Grok" },

    // ⚡ Developer & Web3 Archetypes
    { id: "dracula", label: "Dracula Gothic", emoji: "🧛", accent: "#bd93f9", bg: "#282a36", category: "Developer Archetypes", desc: "Gothic Vampire Slate & Neon Pink/Purple", company: "Gothic Developer" },
    { id: "nord", label: "Nord Glacier", emoji: "❄️", accent: "#88c0d0", bg: "#2e3440", category: "Developer Archetypes", desc: "Arctic Scandinavian Frost & Clean Polar Slate", company: "Arctic Glacier" },
    { id: "synthwave", label: "Synthwave '84", emoji: "🌴", accent: "#ff2a85", bg: "#1a102f", category: "Developer Archetypes", desc: "80s Outrun Neon Sunset & Retrowave Grid", company: "80s Neon Outrun" },
    { id: "solana", label: "Solana Matrix", emoji: "🪙", accent: "#14f195", bg: "#120924", category: "Developer Archetypes", desc: "Web3 Concentrated Liquidity & Purple/Mint", company: "Web3 DeFi Matrix" },
    { id: "monokai", label: "Monokai Sublime", emoji: "🔥", accent: "#a6e22e", bg: "#272822", category: "Developer Archetypes", desc: "Hacker Sublime Syntax Charcoal & Acid Lime", company: "Hacker Sublime" }
  ];

  // Expose global themes registry for all sub-tools & UI builders
  window.ZOTH_THEMES = THEMES;

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem("zoth-theme");
      if (saved && THEMES.some(function(t) { return t.id === saved; })) {
        return saved;
      }
    } catch (e) {}
    return "dark";
  }

  function applyTheme(themeId) {
    if (!THEMES.some(function(t) { return t.id === themeId; })) {
      themeId = "dark";
    }

    document.documentElement.setAttribute("data-theme", themeId);
    if (document.body) {
      document.body.setAttribute("data-theme", themeId);
      document.body.className = document.body.className
        .replace(/\btheme-[a-z0-9_-]+\b/g, "")
        .trim() + " theme-" + themeId;
    }
    document.documentElement.className = document.documentElement.className
      .replace(/\btheme-[a-z0-9_-]+\b/g, "")
      .trim() + " theme-" + themeId;
    document.documentElement.classList.toggle("dark", themeId !== "light");
    document.documentElement.classList.toggle("light", themeId === "light");

    document.documentElement.style.colorScheme = (themeId === "light" ? "light" : "dark");

    try {
      localStorage.setItem("zoth-theme", themeId);
    } catch (e) {}

    var meta = document.querySelector('meta[name="theme-color"]');
    var currentThemeObj = THEMES.find(function(t) { return t.id === themeId; });
    if (meta && currentThemeObj) {
      meta.setAttribute("content", currentThemeObj.bg || currentThemeObj.color || "#05070e");
    }

    // Sync all theme buttons on the page
    document.querySelectorAll("[data-theme-id]").forEach(function(btn) {
      var btnId = btn.getAttribute("data-theme-id");
      var isThis = btnId === themeId;
      btn.classList.toggle("active", isThis);
      btn.setAttribute("aria-pressed", isThis ? "true" : "false");
    });

    // Sync all dropdown labels & emoji
    document.querySelectorAll(".current-theme-emoji").forEach(function(el) {
      el.textContent = currentThemeObj.emoji;
    });
    document.querySelectorAll(".current-theme-label").forEach(function(el) {
      el.textContent = currentThemeObj.label;
    });
    document.querySelectorAll(".current-theme-swatch").forEach(function(el) {
      el.style.backgroundColor = currentThemeObj.accent;
    });

    // Notify any WebGL / Canvas / Audio layers
    window.dispatchEvent(new CustomEvent("zoth-theme-change", {
      detail: { theme: themeId, themeObj: currentThemeObj }
    }));
  }

  window.getZothTheme = function() {
    return document.documentElement.getAttribute("data-theme") || getStoredTheme();
  };

  window.setZothTheme = function(themeId) {
    applyTheme(themeId);
  };

  window.cycleZothTheme = function() {
    var cur = window.getZothTheme();
    var idx = THEMES.findIndex(function(t) { return t.id === cur; });
    if (idx === -1) idx = 0;
    var next = THEMES[(idx + 1) % THEMES.length].id;
    applyTheme(next);
  };

  // Ensure Theme Style Sheets
  function ensureStylesheet(id, href) {
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadThemeFx() {
    ensureStylesheet("zoth-theme-core-css", "/assets/zoth-theme.css?v=7");
    ensureStylesheet("zoth-theme-fx-css", "/assets/zoth-theme-fx.css?v=7");
    ensureStylesheet("zoth-theme-light-css", "/assets/zoth-theme-light.css?v=7");
    ensureStylesheet("zoth-theme-transformer-css", "/assets/zoth-theme-transformer.css?v=7");
    
    if (window.ZothThemeFx) return;
    var existing = document.querySelector('script[src*="zoth-theme-fx.js"]');
    if (existing) return;
    var script = document.createElement("script");
    script.src = "/assets/zoth-theme-fx.js?v=7";
    script.async = true;
    document.head.appendChild(script);
  }

  // Keyboard shortcut: Shift+T
  document.addEventListener("keydown", function (e) {
    if (e.shiftKey && (e.key === "T" || e.key === "t") && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
      window.cycleZothTheme();
    }
  });

  // Global click event delegation for theme buttons
  document.addEventListener("click", function (e) {
    var themeBtn = e.target.closest("[data-theme-id]");
    if (themeBtn) {
      var targetTheme = themeBtn.getAttribute("data-theme-id");
      if (targetTheme) {
        e.preventDefault();
        applyTheme(targetTheme);
        return;
      }
    }

    var cycleBtn = e.target.closest(".zoth-topbar-theme-cycle");
    if (cycleBtn) {
      e.preventDefault();
      window.cycleZothTheme();
      return;
    }
  });

  function mountThemeUI() {
    var curTheme = window.getZothTheme();
    var curThemeObj = THEMES.find(function(t) { return t.id === curTheme; }) || THEMES[0];

    // Populate Mobile Drawer Theme Grid
    var drawerGrid = document.querySelector(".drawer-theme-grid");
    if (drawerGrid) {
      drawerGrid.innerHTML = THEMES.map(function (t) {
        var isActive = t.id === curTheme;
        return '<button class="drawer-theme-btn' + (isActive ? ' active' : '') + '" data-theme-id="' + t.id + '" type="button" aria-pressed="' + isActive + '"><span class="d-swatch" style="background:' + t.accent + '"></span><span class="d-emoji">' + t.emoji + '</span><span class="d-label">' + t.label + '</span></button>';
      }).join("");
    }

    applyTheme(curTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadThemeFx();
      mountThemeUI();
    });
  } else {
    loadThemeFx();
    mountThemeUI();
  }
})();
