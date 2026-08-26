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

  function initNav() {
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

      // Inject Mobile Annotator Trigger into Drawer if not already present
      if (!drawer.querySelector(".drawer-annotator-btn")) {
        var annotatorSection = document.createElement("div");
        annotatorSection.className = "drawer-section drawer-annotator-section";
        annotatorSection.innerHTML = [
          '<div class="drawer-heading">🛠️ Studio Developer Tools</div>',
          '<button type="button" class="drawer-annotator-btn" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.35);color:#00f0ff;font-weight:700;font-size:0.85rem;cursor:pointer;margin-top:4px;">',
          '  <span style="display:flex;align-items:center;gap:8px;"><span>⚡</span> Visual Annotator & Notes</span>',
          '  <span style="font-size:0.7rem;background:rgba(0,240,255,0.25);padding:2px 8px;border-radius:999px;color:#fff;">Active</span>',
          '</button>'
        ].join('');
        drawer.appendChild(annotatorSection);

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
          if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === "function") {
            e.preventDefault();
            window.ZothAnnotator.toggle();
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
