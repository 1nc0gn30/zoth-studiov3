/**
 * Zoth Universal Theme Engine (v3.0)
 * Sovereign Multi-Theme Architecture:
 * - Dark (Midnight Void)
 * - Light (Solar Alabaster)
 * - Matrix (Phosphor Cyber Green)
 * - Gold (Hermetic Alchemical Amber)
 * Zero FOUC, persistent localStorage, Shift+T shortcut, Topbar & Drawer integration.
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
    var themeObj = THEMES.find(function(t) { return t.id === themeId; });
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && themeObj) {
      metaTheme.setAttribute("content", themeObj.color);
    }

    try {
      localStorage.setItem("zoth-theme", themeId);
    } catch (e) {}

    // Update active states on all switcher buttons across navbar, drawer, and widgets
    document.querySelectorAll(".zoth-theme-btn, .drawer-theme-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-theme-id") === themeId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    // Update compact topbar mobile cycle button
    var topbarCycle = document.querySelector(".zoth-topbar-theme-cycle");
    if (topbarCycle && themeObj) {
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

  // Inject / sync Theme UI widgets in top navbar and mobile drawer
  function mountThemeUI() {
    // 1. Remove obsolete bottom-floating dock if any exists
    var oldDock = document.querySelector(".zoth-floating-theme-dock");
    if (oldDock) {
      oldDock.remove();
    }

    var curTheme = window.getZothTheme();
    var curThemeObj = THEMES.find(function(t) { return t.id === curTheme; }) || THEMES[0];

    // 2. Inject Segmented Theme Switcher in Desktop Navbar (.menu)
    var navMenu = document.querySelector("header.bar nav.menu, header#topbar nav.menu, nav.menu, .nav-desktop");
    if (navMenu && !navMenu.querySelector(".zoth-nav-theme-switcher")) {
      var switcher = document.createElement("div");
      switcher.className = "zoth-nav-theme-switcher";
      switcher.setAttribute("role", "group");
      switcher.setAttribute("aria-label", "Visual theme selector");

      THEMES.forEach(function (t) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "zoth-theme-btn" + (t.id === curTheme ? " active" : "");
        btn.setAttribute("data-theme-id", t.id);
        btn.setAttribute("aria-label", "Switch to " + t.label + " theme");
        btn.setAttribute("aria-pressed", String(t.id === curTheme));
        btn.setAttribute("title", t.label + " Theme (Shift+T to cycle)");
        btn.innerHTML = "<span class='theme-emoji'>" + t.emoji + "</span> <span class='theme-name'>" + t.label + "</span>";
        btn.onclick = function (e) {
          e.preventDefault();
          applyTheme(t.id);
        };
        switcher.appendChild(btn);
      });

      // Insert before deck pill or git link if present, else append
      var deckPill = navMenu.querySelector(".js-deck, .git, .nav-pill");
      if (deckPill) {
        navMenu.insertBefore(switcher, deckPill);
      } else {
        navMenu.appendChild(switcher);
      }
    }

    // 3. Inject Compact Theme Toggle Button in Header Bar for Mobile/Tablet
    var topbar = document.querySelector("header.bar, header#topbar, .site-header");
    var burger = document.getElementById("burger") || document.querySelector(".burger");
    if (topbar && !topbar.querySelector(".zoth-topbar-theme-cycle")) {
      var cycleBtn = document.createElement("button");
      cycleBtn.type = "button";
      cycleBtn.className = "zoth-topbar-theme-cycle";
      cycleBtn.setAttribute("aria-label", "Switch color theme. Current theme: " + curThemeObj.label);
      cycleBtn.setAttribute("title", "Current: " + curThemeObj.label + " Theme (Tap to cycle)");
      cycleBtn.innerHTML = curThemeObj.emoji + " <span class='zoth-cycle-label'>" + curThemeObj.label + "</span>";
      cycleBtn.onclick = function (e) {
        e.preventDefault();
        window.cycleZothTheme();
      };

      if (burger && burger.parentNode === topbar) {
        topbar.insertBefore(cycleBtn, burger);
      } else {
        topbar.appendChild(cycleBtn);
      }
    }

    // 4. Inject Theme Selector Section inside Mobile Drawer (#drawer)
    var drawer = document.getElementById("drawer") || document.querySelector("nav.drawer, .drawer");
    if (drawer && !drawer.querySelector(".drawer-theme-section")) {
      var themeSec = document.createElement("div");
      themeSec.className = "drawer-section drawer-theme-section";

      var heading = document.createElement("div");
      heading.className = "drawer-heading";
      heading.textContent = "🎨 Visual Theme";
      themeSec.appendChild(heading);

      var grid = document.createElement("div");
      grid.className = "drawer-theme-grid";

      THEMES.forEach(function (t) {
        var dBtn = document.createElement("button");
        dBtn.type = "button";
        dBtn.className = "drawer-theme-btn" + (t.id === curTheme ? " active" : "");
        dBtn.setAttribute("data-theme-id", t.id);
        dBtn.setAttribute("aria-label", "Set theme to " + t.label);
        dBtn.setAttribute("aria-pressed", String(t.id === curTheme));
        dBtn.innerHTML = "<span class='d-emoji'>" + t.emoji + "</span><span class='d-label'>" + t.label + "</span>";
        dBtn.onclick = function (e) {
          e.preventDefault();
          applyTheme(t.id);
        };
        grid.appendChild(dBtn);
      });

      themeSec.appendChild(grid);

      // Insert at the very top of drawer
      if (drawer.firstChild) {
        drawer.insertBefore(themeSec, drawer.firstChild);
      } else {
        drawer.appendChild(themeSec);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      applyTheme(getStoredTheme());
      mountThemeUI();
    });
  } else {
    applyTheme(getStoredTheme());
    mountThemeUI();
  }
})();
