/**
 * Zoth Universal Theme Engine (v2.0)
 * Manages Dark (Void), Light (Solar), Matrix (Phosphor), Gold (Alchemical) themes.
 * Zero FOUC, persistent localStorage, keyboard shortcuts (Shift+T), and live event broadcasting.
 */
(function () {
  var THEMES = [
    { id: "dark", label: "Dark", emoji: "🌙", color: "#05060a" },
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
    document.documentElement.className = document.documentElement.className
      .replace(/\btheme-[a-z]+\b/g, "")
      .trim() + " theme-" + themeId;
      
    document.documentElement.style.colorScheme = (themeId === "light" ? "light" : "dark");
    
    // Update theme-color meta
    var themeObj = THEMES.find(function(t) { return t.id === themeId; });
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && themeObj) {
      metaTheme.setAttribute("content", themeObj.color);
    }

    try {
      localStorage.setItem("zoth-theme", themeId);
    } catch (e) {}

    // Update active states on switcher buttons
    document.querySelectorAll(".zoth-theme-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-theme-id") === themeId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    // Dispatch broadcast event for charts, canvases, and WebGL scenes
    window.dispatchEvent(new CustomEvent("zoth-theme-change", { detail: { theme: themeId } }));
  }

  // Initial execution immediately to avoid FOUC
  var initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  // Global helper functions on window
  window.setZothTheme = applyTheme;
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

  // Inject UI widgets after DOM is loaded
  function mountThemeUI() {
    // If dock already exists, skip
    if (document.querySelector(".zoth-floating-theme-dock")) return;

    var dock = document.createElement("div");
    dock.className = "zoth-floating-theme-dock";
    dock.setAttribute("role", "region");
    dock.setAttribute("aria-label", "Color Theme Switcher");

    var switcher = document.createElement("div");
    switcher.className = "zoth-theme-switcher";

    THEMES.forEach(function (t) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoth-theme-btn" + (t.id === initialTheme ? " active" : "");
      btn.setAttribute("data-theme-id", t.id);
      btn.setAttribute("aria-label", "Switch to " + t.label + " theme");
      btn.setAttribute("title", t.label + " Theme (Shift+T to cycle)");
      btn.innerHTML = t.emoji + " <span style='font-size:11px;font-weight:600;margin-left:3px;'>" + t.label + "</span>";
      btn.onclick = function (e) {
        e.preventDefault();
        applyTheme(t.id);
      };
      switcher.appendChild(btn);
    });

    dock.appendChild(switcher);
    document.body.appendChild(dock);

    // Also inject in top navbar if navbar actions container exists
    var navTarget = document.querySelector(".nav-actions, .nav-right, header nav");
    if (navTarget && !navTarget.querySelector(".zoth-nav-theme-toggle")) {
      var navBtn = document.createElement("button");
      navBtn.type = "button";
      navBtn.className = "zoth-theme-btn zoth-nav-theme-toggle";
      navBtn.setAttribute("aria-label", "Toggle Color Theme");
      navBtn.setAttribute("title", "Toggle Theme (Shift+T)");
      navBtn.style.border = "1px solid var(--border-card)";
      navBtn.style.padding = "4px 8px";
      navBtn.style.borderRadius = "8px";
      navBtn.innerHTML = "🎨 <span style='font-size:11px;margin-left:2px;'>Theme</span>";
      navBtn.onclick = function (e) {
        e.preventDefault();
        window.cycleZothTheme();
      };
      navTarget.appendChild(navBtn);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemeUI);
  } else {
    mountThemeUI();
  }
})();
