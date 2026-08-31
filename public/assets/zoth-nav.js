
  // Ensure Universal Floating HUD Dock is loaded
  if (!document.querySelector('script[src*="zoth-interactive-dock.js"]')) {
    var dockScript = document.createElement("script");
    dockScript.src = "/assets/zoth-interactive-dock.js?v=9";
    dockScript.defer = true;
    document.head.appendChild(dockScript);
  }

  // Ensure Universal Spotlight & Magnetic Physics Engine is loaded
  if (!document.querySelector('script[src*="zoth-spotlight.js"]')) {
    var spotScript = document.createElement("script");
    spotScript.src = "/assets/zoth-spotlight.js?v=9";
    spotScript.defer = true;
    document.head.appendChild(spotScript);
  }


// ── Procedural Web Audio Synthesizer for UI Micro-Interactions (Zero Assets Needed) ──
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
        
        // Theme-specific procedural chimes
        if (themeId === "matrix") {
          // Retro 8-bit blip
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
          // 432Hz Harmonic Resonance
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
          // 80s Sawtooth shimmer
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(now + 0.22);
        } else {
          // Clean modern acoustic chime
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.setValueAtTime(987.77, now + 0.05); // B5
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

/**
 * Zoth Universal Master Navigation Engine (v5.2)
 * Manages Desktop Glassmorphic Dropdowns, Mobile Drawer Toggling,
 * Keyboard Accessibility, Active Route Highlighting, and Topbar Blur.
 */
(function () {
  'use strict';

  // Ensure Universal Theme Engine is loaded
  if (!window.setZothTheme && !document.querySelector('script[src*="zoth-theme.js"]')) {
    var themeScript = document.createElement("script");
    themeScript.src = "/assets/zoth-theme.js";
    document.head.appendChild(themeScript);
  }

  // Ensure Universal Pet HUD & Desk Companion is loaded
  if (!window.ZothPetHUD && !document.querySelector('script[src*="zoth-pet-hud.js"]')) {
    var petHudScript = document.createElement("script");
    petHudScript.src = "/assets/zoth-pet-hud.js";
    document.head.appendChild(petHudScript);
  }

  // Ensure Universal Workbench & Command Palette Engine is loaded
  if (!window.ZothWorkbench && !document.querySelector('script[src*="zoth-workbench.js"]')) {
    var wbScript = document.createElement("script");
    wbScript.src = "/assets/zoth-workbench.js";
    wbScript.defer = true;
    document.head.appendChild(wbScript);
  }

  function initNav() {

    // ── Universal Dynamic Link Injector (Ensures Web3 & Memory are present across all pages) ──
    function ensureUniversalNavLinks() {
      // 1. Studio Dropdowns (Desktop)
      document.querySelectorAll(".nav-dropdown").forEach(function(dd) {
        var btn = dd.querySelector(".nav-dropdown-btn");
        var menu = dd.querySelector(".nav-dropdown-menu");
        if (btn && menu) {
          var title = btn.textContent.trim();
          if (title.indexOf("Studio") !== -1) {
            if (!menu.querySelector('a[href*="/secure-comms/"]')) {
              var commsLink = document.createElement("a");
              commsLink.href = "/secure-comms/";
              commsLink.innerHTML = "<strong>🔒 SimpleX ↔ Matrix Bridge</strong><small>Zero-Knowledge E2EE SimpleX, Matrix &amp; Swarm QR</small>";
              menu.appendChild(commsLink);
            }
            if (!menu.querySelector('a[href*="web3-hub.html"]')) {
              var w3Link = document.createElement("a");
              w3Link.href = "/studio/web3-hub.html";
              w3Link.innerHTML = "<strong>🪙 Web3 &amp; Solana Bridge</strong><small>Multi-Chain Wallets, Live SOL Ticker &amp; Radar</small>";
              menu.appendChild(w3Link);
            }
            if (!menu.querySelector('a[href*="/secure-messaging/"]')) {
              var msgLink = document.createElement("a");
              msgLink.href = "/secure-messaging/";
              msgLink.innerHTML = "<strong>💬 Secure Signal Bridge</strong><small>E2EE Double Ratchet, Matrix &amp; Swarm Dispatch</small>";
              menu.appendChild(msgLink);
            }
            if (!menu.querySelector('a[href*="zoth-world.html"]')) {
              var worldLink = document.createElement("a");
              worldLink.href = "/zoth-world.html";
              worldLink.innerHTML = "<strong>🌌 Zoth World (3D Sanctum)</strong><small>3D Alchemical Multiverse &amp; Living Pet Matrix</small>";
              menu.insertBefore(worldLink, menu.firstChild);
            }
          }
          if (title.indexOf("Core") !== -1) {
            if (!menu.querySelector('a[href*="zoth-world.html"]')) {
              var worldCoreLink = document.createElement("a");
              worldCoreLink.href = "/zoth-world.html";
              worldCoreLink.innerHTML = "<strong>🌌 Zoth World 3D Universe</strong><small>Living Hermetic Swarm &amp; 20 Mascot Spirits</small>";
              menu.insertBefore(worldCoreLink, menu.firstChild);
            }
            if (!menu.querySelector('a[href*="/memory/"]')) {
              var memLink = document.createElement("a");
              memLink.href = "/memory/";
              memLink.innerHTML = "<strong>🧠 Netrunner Memory World</strong><small>Biomorphic Associative Graph &amp; Neural Stratum</small>";
              menu.appendChild(memLink);
            }
          }
        }
      });

      // 2. Mobile Drawer
      var drawer = document.getElementById("drawer") || document.querySelector(".drawer");
      if (drawer) {
        // In Studio section
        var studioHeadings = Array.from(drawer.querySelectorAll(".drawer-heading")).filter(function(h) {
          return h.textContent.indexOf("Studio") !== -1 || h.textContent.indexOf("Workstation") !== -1;
        });
        studioHeadings.forEach(function(sh) {
          if (sh.parentElement && !sh.parentElement.querySelector('a[href*="/secure-comms/"]')) {
            var aComms = document.createElement("a");
            aComms.href = "/secure-comms/";
            aComms.innerHTML = "🔒 SimpleX ↔ Matrix Bridge (E2EE)";
            sh.parentElement.appendChild(aComms);
          }
          if (sh.parentElement && !sh.parentElement.querySelector('a[href*="web3-hub.html"]')) {
            var a = document.createElement("a");
            a.href = "/studio/web3-hub.html";
            a.innerHTML = "🪙 Web3 &amp; Solana Swarm Bridge";
            sh.parentElement.appendChild(a);
          }
          if (sh.parentElement && !sh.parentElement.querySelector('a[href*="/secure-messaging/"]')) {
            var aMsg = document.createElement("a");
            aMsg.href = "/secure-messaging/";
            aMsg.innerHTML = "💬 Secure Signal Swarm Bridge";
            sh.parentElement.appendChild(aMsg);
          }
        });

        // In Core section
        var coreHeadings = Array.from(drawer.querySelectorAll(".drawer-heading")).filter(function(h) {
          return h.textContent.indexOf("Core") !== -1 || h.textContent.indexOf("Archetype") !== -1;
        });
        coreHeadings.forEach(function(ch) {
          if (ch.parentElement && !ch.parentElement.querySelector('a[href*="zoth-world.html"]')) {
            var aW = document.createElement("a");
            aW.href = "/zoth-world.html";
            aW.innerHTML = "🌌 Zoth World 3D Universe";
            ch.parentElement.appendChild(aW);
          }
          if (ch.parentElement && !ch.parentElement.querySelector('a[href*="/memory/"]')) {
            var a = document.createElement("a");
            a.href = "/memory/";
            a.innerHTML = "🧠 Netrunner Memory World";
            ch.parentElement.appendChild(a);
          }
        });
      }

      // 3. Topbar Direct Navbar
      var menuBar = document.querySelector("header.bar nav.menu") || document.querySelector("header#topbar nav.menu");
      if (menuBar && !menuBar.querySelector('a[href*="/secure-comms/"]')) {
        var directComms = document.createElement("a");
        directComms.className = "nav-link";
        directComms.href = "/secure-comms/";
        directComms.innerHTML = "🔒 SimpleX Matrix";
        directComms.style.color = "var(--cyan)";
        directComms.style.textShadow = "0 0 10px rgba(0,240,255,0.4)";
        // Insert right next to Web3 or before dropdowns
        var targetSibling = menuBar.querySelector('a[href*="web3-hub.html"]') || menuBar.querySelector('.nav-dropdown') || menuBar.lastElementChild;
        if (targetSibling) {
          menuBar.insertBefore(directComms, targetSibling.nextSibling);
        } else {
          menuBar.appendChild(directComms);
        }
      }
    }

    
      // 4. Desktop Quick Tools (Annotate, Command Palette, Compact Theme Dropdown)
      if (menuBar) {
        // Annotate Button
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
            } else if (window.location.pathname !== "/") {
              window.location.href = "/#annotate";
            }
          });
          
          var gitPill = menuBar.querySelector(".nav-pill.git") || menuBar.lastElementChild;
          if (gitPill) {
            menuBar.insertBefore(annotateBtn, gitPill);
          } else {
            menuBar.appendChild(annotateBtn);
          }
        }

        // Command Palette Quick Trigger
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
          if (annotateBtnRef) {
            menuBar.insertBefore(paletteBtn, annotateBtnRef);
          } else {
            menuBar.appendChild(paletteBtn);
          }
        }

        // ── Luxury Categorized Theme Command Center Popover (v8.0 Search & FX) ──
        var oldSwitcher = menuBar.querySelector(".zoth-nav-theme-switcher");
        if (oldSwitcher) {
          oldSwitcher.style.display = "none";
        }
        
        var existingThemeDd = menuBar.querySelector(".nav-theme-dropdown");
        if (existingThemeDd) {
          existingThemeDd.remove();
        }

        var themeDd = document.createElement("div");
        themeDd.className = "nav-dropdown nav-theme-dropdown";
        
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

        var isAudioOn = window.ZothAudioFX && window.ZothAudioFX.isEnabled();

        // Group themes by category
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
        if (gitPillRef) {
          menuBar.insertBefore(themeDd, gitPillRef);
        } else {
          menuBar.appendChild(themeDd);
        }

        // Handle trigger click & click outside to close
        var themeTriggerBtn = themeDd.querySelector(".nav-theme-current-btn");
        var themePopoverMenu = themeDd.querySelector(".nav-theme-popover-menu");
        var searchInput = themeDd.querySelector(".theme-search-input");
        var searchClear = themeDd.querySelector(".theme-search-clear");
        var audioToggleBtn = themeDd.querySelector(".theme-audio-toggle-btn");

        // Audio Toggle
        if (audioToggleBtn) {
          audioToggleBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var on = window.ZothAudioFX && window.ZothAudioFX.toggle();
            audioToggleBtn.textContent = on ? "🔊 Audio FX" : "🔇 Audio Off";
            if (on && window.ZothAudioFX) window.ZothAudioFX.playClick(880, 0.1, "sine");
          });
        }

        // Live Search Filtering
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

        // Close on escape
        document.addEventListener("keydown", function(e) {
          if (e.key === "Escape" && themeDd.classList.contains("open")) {
            themeDd.classList.remove("open");
            themeTriggerBtn.setAttribute("aria-expanded", "false");
            themeTriggerBtn.focus();
          }
        });

        // Listen for theme changes to update active label, swatch & play chime
        window.addEventListener("zoth-theme-change", function(e) {
          if (e && e.detail && e.detail.themeObj) {
            var em = themeDd.querySelector(".current-theme-emoji");
            var lb = themeDd.querySelector(".current-theme-label");
            var sw = themeDd.querySelector(".current-theme-swatch");
            if (em) em.textContent = e.detail.themeObj.emoji;
            if (lb) lb.textContent = e.detail.themeObj.label;
            if (sw) sw.style.backgroundColor = e.detail.themeObj.accent;
            
            themeDd.querySelectorAll(".theme-card-row").forEach(function(btn) {
              var isThis = btn.getAttribute("data-theme-id") === e.detail.theme;
              btn.classList.toggle("active", isThis);
              var check = btn.querySelector(".theme-card-check");
              if (isThis && !check) {
                var checkSpan = document.createElement("span");
                checkSpan.className = "theme-card-check";
                checkSpan.textContent = "✓";
                btn.appendChild(checkSpan);
              } else if (!isThis && check) {
                check.remove();
              }
            });

            // Play procedural chime
            if (window.ZothAudioFX) {
              window.ZothAudioFX.playThemeChime(e.detail.theme);
            }
          }
        });
        });
          });
        }
      }

    ensureUniversalNavLinks();
    var burger = document.getElementById("burger") || document.querySelector(".burger");
    var drawer = document.getElementById("drawer") || document.querySelector(".drawer");
    var topbar = document.getElementById("topbar") || document.querySelector("header.bar") || document.querySelector("header#topbar");

    // Topbar Scroll Blur Listener
    if (topbar && !topbar.dataset.scrollBound) {
      topbar.dataset.scrollBound = "true";
      var onScroll = function () {
        if (window.scrollY > 15) {
          topbar.classList.add("on");
        } else {
          topbar.classList.remove("on");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Mobile Burger & Drawer Controller
    if (burger && drawer && !burger.dataset.bound) {
      burger.dataset.bound = "true";
      burger.removeAttribute("onclick");
      
      var isMenuOpen = document.body.classList.contains("menu-open");
      burger.setAttribute("aria-expanded", String(isMenuOpen));
      burger.textContent = isMenuOpen ? "Close" : "Menu";

      burger.addEventListener("click", function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var isOpen = document.body.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.textContent = isOpen ? "Close" : "Menu";
      });

      // Close mobile drawer when clicking any link inside
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
        });
      });

      // Ensure Universe / Articles section in Mobile Drawer has direct link to Articles
      var universeHeading = Array.from(drawer.querySelectorAll(".drawer-heading")).find(function(h) {
        return h.textContent.includes("Universe") || h.textContent.includes("Media");
      });
      if (universeHeading && universeHeading.parentElement) {
        if (!universeHeading.parentElement.querySelector('a[href^="/articles"]')) {
          var artLink = document.createElement("a");
          artLink.href = "/articles/";
          artLink.innerHTML = "📜 Engineering Articles & Manifesto";
          universeHeading.parentElement.insertBefore(artLink, universeHeading.nextSibling);
        }
      }

      // Inject Mobile Annotator & Command Palette Trigger into Drawer if not already present
      if (!drawer.querySelector(".drawer-annotator-btn")) {
        var annotatorSection = document.createElement("div");
        annotatorSection.className = "drawer-section drawer-annotator-section";
        annotatorSection.innerHTML = [
          '<div class="drawer-heading">🛠️ Studio Developer Tools</div>',
          '<button type="button" class="drawer-palette-btn" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fbbf24;font-weight:700;font-size:0.85rem;cursor:pointer;margin-top:4px;">',
          '  <span style="display:flex;align-items:center;gap:8px;"><span>🔍</span> Command Palette</span>',
          '  <span style="font-size:0.7rem;background:rgba(251,191,36,0.25);padding:2px 8px;border-radius:999px;color:#fff;">Ctrl+K</span>',
          '</button>',
          '<button type="button" class="drawer-annotator-btn" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.35);color:#00f0ff;font-weight:700;font-size:0.85rem;cursor:pointer;margin-top:6px;">',
          '  <span style="display:flex;align-items:center;gap:8px;"><span>⚡</span> Visual Annotator & Notes</span>',
          '  <span style="font-size:0.7rem;background:rgba(0,240,255,0.25);padding:2px 8px;border-radius:999px;color:#fff;">Shift+A</span>',
          '</button>'
        ].join('');
        drawer.appendChild(annotatorSection);

        annotatorSection.querySelector(".drawer-palette-btn").addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
          if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === "function") {
            window.ZothWorkbench.openPalette();
          }
        });

        annotatorSection.querySelector(".drawer-annotator-btn").addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
          if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
            window.ZothAnnotator.toggle();
          } else {
            window.location.hash = "annotate";
            window.location.reload();
          }
        });
      }
    }

    // Desktop Glassmorphic Dropdowns
    document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
      if (dropdown.dataset.bound) return;
      dropdown.dataset.bound = "true";

      var btn = dropdown.querySelector(".nav-dropdown-btn");
      var menu = dropdown.querySelector(".nav-dropdown-menu");
      var leaveTimer = null;

      function openMenu() {
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        dropdown.classList.add("open");
        if (btn) btn.setAttribute("aria-expanded", "true");

        // Close sibling dropdowns
        document.querySelectorAll(".nav-dropdown.open").forEach(function (other) {
          if (other !== dropdown) {
            other.classList.remove("open");
            var otherBtn = other.querySelector(".nav-dropdown-btn");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
      }

      function closeMenu(delay) {
        if (delay) {
          if (leaveTimer) clearTimeout(leaveTimer);
          leaveTimer = setTimeout(function () {
            dropdown.classList.remove("open");
            if (btn) btn.setAttribute("aria-expanded", "false");
            leaveTimer = null;
          }, delay);
        } else {
          if (leaveTimer) {
            clearTimeout(leaveTimer);
            leaveTimer = null;
          }
          dropdown.classList.remove("open");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      }

      // Hover / Pointer Events with grace period
      dropdown.addEventListener("mouseenter", function () {
        openMenu();
      });

      dropdown.addEventListener("mouseleave", function () {
        closeMenu(180); // 180ms grace period so cursor doesn't drop menu on quick diagonal moves
      });

      // Click / Tap Toggle on Button
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (dropdown.classList.contains("open")) {
            closeMenu(0);
          } else {
            openMenu();
          }
        });

        // Keyboard navigation on button
        btn.addEventListener("keydown", function (e) {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMenu();
            if (menu) {
              var firstLink = menu.querySelector("a");
              if (firstLink) firstLink.focus();
            }
          } else if (e.key === "Escape") {
            closeMenu(0);
          }
        });
      }

      // Keyboard navigation within menu
      if (menu) {
        var menuLinks = Array.from(menu.querySelectorAll("a"));
        menuLinks.forEach(function (link, index) {
          link.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              var next = menuLinks[index + 1] || menuLinks[0];
              if (next) next.focus();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (index === 0) {
                if (btn) btn.focus();
              } else {
                var prev = menuLinks[index - 1];
                if (prev) prev.focus();
              }
            } else if (e.key === "Escape") {
              e.preventDefault();
              closeMenu(0);
              if (btn) btn.focus();
            }
          });

          // Close on link click
          link.addEventListener("click", function () {
            closeMenu(0);
          });
        });
      }
    });

    // Global Document Click & Escape Handlers
    if (!document.documentElement.dataset.navGlobalBound) {
      document.documentElement.dataset.navGlobalBound = "true";

      document.addEventListener("click", function (e) {
        // Close mobile drawer if clicking outside
        if (document.body.classList.contains("menu-open")) {
          var d = document.getElementById("drawer") || document.querySelector(".drawer");
          var b = document.getElementById("burger") || document.querySelector(".burger");
          if (d && b && !d.contains(e.target) && !b.contains(e.target)) {
            document.body.classList.remove("menu-open");
            b.setAttribute("aria-expanded", "false");
            b.textContent = "Menu";
          }
        }
        
        // Close desktop dropdowns if clicking outside
        if (!e.target.closest(".nav-dropdown")) {
          document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
            dd.classList.remove("open");
            var btn = dd.querySelector(".nav-dropdown-btn");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
            var b = document.getElementById("burger") || document.querySelector(".burger");
            if (b) {
              b.setAttribute("aria-expanded", "false");
              b.textContent = "Menu";
            }
          }
          document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
            dd.classList.remove("open");
            var btn = dd.querySelector(".nav-dropdown-btn");
            if (btn) {
              btn.setAttribute("aria-expanded", "false");
              btn.focus();
            }
          });
        }

        // Global Annotator Shortcut: Shift+A or Ctrl+Alt+A
        if ((e.shiftKey && e.key === "A" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) ||
            (e.ctrlKey && e.altKey && e.code === "KeyA")) {
          e.preventDefault();
          if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
            window.ZothAnnotator.toggle();
          } else {
            var annotScript = document.createElement("script");
            annotScript.src = "/assets/zoth-annotator.js";
            annotScript.onload = function() {
              if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
                window.ZothAnnotator.toggle();
              }
            };
            document.head.appendChild(annotScript);
          }
        }
      });
    }

    // Active Route Highlighting (both Direct & Parent Dropdown)
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
  }

  // Self-initialize on DOM ready and immediately if ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }

  // Export helper for dynamic page re-renders
  window.initZothNav = initNav;
})();
