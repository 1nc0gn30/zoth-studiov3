/**
 * Zoth Universal Theme Engine (v3.5)
 * Sovereign Multi-Theme Architecture:
 * - Dark (Midnight Void)
 * - Light (Solar Alabaster)
 * - Matrix (Phosphor Cyber Green)
 * - Gold (Hermetic Alchemical Amber)
 * Zero FOUC, persistent localStorage, global event delegation, Shift+T shortcut.
 */
(function () {
  "use strict";

  var THEMES = [
    { id: "dark", label: "Dark", emoji: "🌙", color: "#05070e" },
    { id: "light", label: "Light", emoji: "☀️", color: "#f8fafc" },
    { id: "matrix", label: "Matrix", emoji: "📟", color: "#020b06" },
    { id: "gold", label: "Gold", emoji: "⚗️", color: "#0c0a09" }
  ];

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem("zoth-theme");
      if (saved && THEMES.some(function(t) { return t.id === saved; })) {
        return saved;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
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
        .replace(/\btheme-[a-z]+\b/g, "")
        .trim() + " theme-" + themeId;
    }
    document.documentElement.className = document.documentElement.className
      .replace(/\btheme-[a-z]+\b/g, "")
      .trim() + " theme-" + themeId;

    document.documentElement.style.colorScheme = (themeId === "light" ? "light" : "dark");

    // Update theme-color meta
    var themeObj = THEMES.find(function(t) { return t.id === themeId; }) || THEMES[0];
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", themeObj.color);
    }

    try {
      localStorage.setItem("zoth-theme", themeId);
    } catch (e) {}

    // Update active states on all switcher buttons across navbar, drawer, and widgets
    document.querySelectorAll(".zoth-theme-btn, .drawer-theme-btn, [data-theme-id]").forEach(function (btn) {
      var targetId = btn.getAttribute("data-theme-id");
      if (targetId) {
        var active = targetId === themeId;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      }
    });

    // Update compact topbar mobile cycle button
    var topbarCycle = document.querySelector(".zoth-topbar-theme-cycle");
    if (topbarCycle) {
      topbarCycle.innerHTML = themeObj.emoji + " <span class='zoth-cycle-label'>" + themeObj.label + "</span>";
      topbarCycle.setAttribute("title", "Current: " + themeObj.label + " Theme (Tap to switch)");
      topbarCycle.setAttribute("aria-label", "Switch color theme. Current theme: " + themeObj.label);
    }

    // Dispatch broadcast event for charts, WebGL, 3D canvases
    window.dispatchEvent(new CustomEvent("zoth-theme-change", { detail: { theme: themeId } }));
  }

  // Execute immediately to prevent FOUC
  var initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  // Global helper functions
  window.setZothTheme = applyTheme;
  window.setTheme = applyTheme;
  window.getZothTheme = function() { return document.documentElement.getAttribute("data-theme") || "dark"; };
  window.cycleZothTheme = function() {
    var cur = window.getZothTheme();
    var idx = THEMES.findIndex(function(t) { return t.id === cur; });
    var next = THEMES[(idx + 1) % THEMES.length].id;
    applyTheme(next);
  };

  // Keyboard shortcut: Shift + T
  document.addEventListener("keydown", function (e) {
    if (e.shiftKey && (e.key === "T" || e.key === "t") && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
      window.cycleZothTheme();
    }
  });

  // Global click event delegation - ALWAYS catches any theme button anywhere on page!
  document.addEventListener("click", function (e) {
    // 1. Direct or parent theme button with [data-theme-id]
    var themeBtn = e.target.closest("[data-theme-id]");
    if (themeBtn) {
      var targetTheme = themeBtn.getAttribute("data-theme-id");
      if (targetTheme) {
        e.preventDefault();
        applyTheme(targetTheme);
        return;
      }
    }

    // 2. Cycle button in topbar
    var cycleBtn = e.target.closest(".zoth-topbar-theme-cycle");
    if (cycleBtn) {
      e.preventDefault();
      window.cycleZothTheme();
      return;
    }
  });

  // Inject UI if needed for pages without pre-rendered theme controls
  function mountThemeUI() {
    var curTheme = window.getZothTheme();
    var curThemeObj = THEMES.find(function(t) { return t.id === curTheme; }) || THEMES[0];

    // Ensure all existing buttons match active theme
    applyTheme(curTheme);

    // If page doesn't have topbar cycle button, inject it
    var topbar = document.querySelector("header.bar, header#topbar, .site-header");
    var burger = document.getElementById("burger") || document.querySelector(".burger");
    if (topbar && !topbar.querySelector(".zoth-topbar-theme-cycle")) {
      var cycleBtn = document.createElement("button");
      cycleBtn.type = "button";
      cycleBtn.className = "zoth-topbar-theme-cycle";
      cycleBtn.setAttribute("aria-label", "Switch color theme. Current theme: " + curThemeObj.label);
      cycleBtn.setAttribute("title", "Current: " + curThemeObj.label + " Theme (Tap to switch)");
      cycleBtn.innerHTML = curThemeObj.emoji + " <span class='zoth-cycle-label'>" + curThemeObj.label + "</span>";

      if (burger && burger.parentNode === topbar) {
        topbar.insertBefore(cycleBtn, burger);
      } else {
        topbar.appendChild(cycleBtn);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemeUI);
  } else {
    mountThemeUI();
  }
})();
