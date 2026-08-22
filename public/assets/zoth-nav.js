/**
 * Zoth Universal Master Navigation Engine (v5.0)
 * Manages Desktop Glassmorphic Dropdowns, Mobile Drawer Toggling,
 * Keyboard Accessibility, Active Route Highlighting, and Deck Port Discovery.
 */
(function () {
  function initNav() {
    var burger = document.getElementById("burger") || document.querySelector(".burger");
    var drawer = document.getElementById("drawer") || document.querySelector(".drawer");

    if (burger && drawer) {
      // Remove any inline onclick attributes that cause toggle fights
      burger.removeAttribute("onclick");
      
      // Ensure drawer is initialized
      burger.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
      burger.textContent = document.body.classList.contains("menu-open") ? "Close" : "Menu";

      // Burger click handler (single authoritative source)
      burger.onclick = function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var isOpen = document.body.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.textContent = isOpen ? "Close" : "Menu";
      };

      // Close mobile drawer when clicking any link
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
        });
      });

      // Close when clicking outside
      document.addEventListener("click", function (e) {
        if (document.body.classList.contains("menu-open")) {
          if (!drawer.contains(e.target) && !burger.contains(e.target)) {
            document.body.classList.remove("menu-open");
            burger.setAttribute("aria-expanded", "false");
            burger.textContent = "Menu";
          }
        }
        
        // Close desktop dropdowns when clicking outside
        document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
          if (!dd.contains(e.target)) {
            dd.classList.remove("open");
            var btn = dd.querySelector(".nav-dropdown-btn");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });
      });

      // ESC key to close
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
            burger.setAttribute("aria-expanded", "false");
            burger.textContent = "Menu";
          }
          document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
            dd.classList.remove("open");
            var btn = dd.querySelector(".nav-dropdown-btn");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
        }
      });
    }

    // Desktop Dropdown Button Click / Keyboard Navigation
    document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
      var btn = dropdown.querySelector(".nav-dropdown-btn");
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = dropdown.classList.toggle("open");
          btn.setAttribute("aria-expanded", String(isOpen));
          
          // Close sibling dropdowns
          document.querySelectorAll(".nav-dropdown").forEach(function (other) {
            if (other !== dropdown) {
              other.classList.remove("open");
              var otherBtn = other.querySelector(".nav-dropdown-btn");
              if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            }
          });
        });
      }
    });

    // Active Route Highlighting (both Direct & Parent Dropdown)
    var currentPath = (window.location.pathname || "/").replace(/index\.html$/, "");
    if (!currentPath.endsWith("/")) currentPath += "/";

    document.querySelectorAll("nav.menu a, nav.drawer a, #drawer a, .nav-dropdown-menu a").forEach(function (a) {
      var rawHref = a.getAttribute("href") || "";
      var href = rawHref.replace(/index\.html$/, "");
      if (href && href.startsWith("/") && href !== "/#for-everyone" && href !== "/#install") {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }
})();
