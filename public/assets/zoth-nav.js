/**
 * Zoth Universal Master Navigation Engine (v4.1)
 * Automatically attaches burger menu toggle, drawer closing, active page highlight,
 * and preview ribbon offset handlers on every page across the public website.
 */
(function () {
  function initNav() {
    var burger = document.getElementById("burger") || document.querySelector(".burger");
    var drawer = document.getElementById("drawer") || document.querySelector(".drawer");
    
    if (burger && drawer) {
      function toggleMenu(e) {
        if (e) e.stopPropagation();
        var isOpen = document.body.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.textContent = isOpen ? "Close" : "Menu";
      }

      burger.addEventListener("click", toggleMenu);

      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
        });
      });

      document.addEventListener("click", function (e) {
        if (document.body.classList.contains("menu-open")) {
          if (!drawer.contains(e.target) && !burger.contains(e.target)) {
            document.body.classList.remove("menu-open");
            burger.setAttribute("aria-expanded", "false");
            burger.textContent = "Menu";
          }
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
          document.body.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.textContent = "Menu";
        }
      });
    }

    // Active page highlighting
    var currentPath = (window.location.pathname || "/").replace(/index\.html$/, "");
    if (!currentPath.endsWith("/")) currentPath += "/";

    document.querySelectorAll("nav.menu a, nav.drawer a, #drawer a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/index\.html$/, "");
      if (href && href.startsWith("/") && href !== "/#for-everyone" && href !== "/#install") {
        if (!href.endsWith("/") && !href.includes(".")) href += "/";
        if (href === currentPath) {
          a.classList.add("on");
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
