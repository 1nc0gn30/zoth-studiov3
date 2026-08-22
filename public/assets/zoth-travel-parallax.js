/**
 * Zoth Studio — 3D Spatial Scroll Travel & Adaptive Pinned Parallax Engine (v6.0)
 * Seamlessly transitions between:
 *   1. Pinned 3D Spatial Travel Mode (Desktop / Widescreen > 880px)
 *   2. Natural Unconstrained Vertical Scroll Mode (Mobile / Tablet <= 880px / Touch / Reduced Motion)
 *
 * Guarantees:
 *   - Mobile users are NEVER stuck on the first section (#hero).
 *   - All stages (hero, for-everyone, about, agents, pets, install) are activated, revealed, and interactive.
 *   - Normalized scroll progress ticker and HUD dials calculate accurately on touch/mobile and desktop.
 *   - Waypoint buttons, mobile drawer links, and in-page anchor links smoothly scroll to exact sections.
 *   - Dynamic layout recalculation on resize, orientationchange, and media query breakpoint changes.
 */
(function () {
  "use strict";

  var WAYPOINTS = [
    { id: "hero", start: 0.00, center: 0.08, end: 0.18, title: "01 Swarm" },
    { id: "for-everyone", start: 0.18, center: 0.27, end: 0.38, title: "02 Creators" },
    { id: "about", start: 0.38, center: 0.46, end: 0.58, title: "03 Azoth Core" },
    { id: "agents", start: 0.58, center: 0.66, end: 0.76, title: "04 Pantheon" },
    { id: "pets", start: 0.76, center: 0.84, end: 0.90, title: "05 Comic & Pets" },
    { id: "install", start: 0.90, center: 0.96, end: 1.00, title: "06 Install" }
  ];

  function initTravelParallax() {
    var track = document.querySelector(".scroll-travel-track");
    var viewport = document.querySelector(".scroll-travel-viewport");
    var stages = document.querySelectorAll(".travel-scene-stage");
    var hudDial = document.getElementById("hudProgressDial");
    var waypointBtns = document.querySelectorAll(".hud-waypoint-btn");
    var spaceGrid = document.querySelector(".travel-grid-mesh");

    if (!track || stages.length === 0) return;

    var ticking = false;

    // Detect whether natural vertical scroll or pinned spatial travel applies
    function isNaturalScrollMode() {
      var mqSmall = window.matchMedia("(max-width: 1024px), (pointer: coarse), (hover: none)").matches;
      var mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (mqSmall || mqReduced) return true;

      if (viewport) {
        var style = window.getComputedStyle(viewport);
        var isSticky = style.position === "sticky" || style.position === "-webkit-sticky";
        if (!isSticky) return true;
      }

      if (track && track.offsetHeight <= (window.innerHeight * 1.5)) {
        return true;
      }

      return false;
    }

    // Reset all stages for natural mobile vertical scrolling
    function setNaturalScrollState() {
      document.documentElement.classList.add("zoth-natural-scroll");
      if (track) track.classList.add("natural-scroll-active");

      stages.forEach(function (stage) {
        stage.classList.add("active");
        stage.classList.remove("pushed-out");
        stage.style.opacity = "";
        stage.style.visibility = "";
        stage.style.transform = "";
        stage.style.filter = "";
        stage.style.pointerEvents = "";
      });
    }

    // Natural scroll progress calculation & waypoint focal-point tracking
    function updateNaturalScroll() {
      setNaturalScrollState();

      var scrollY = window.pageYOffset || window.scrollY || (document.documentElement ? document.documentElement.scrollTop : 0) || 0;
      var docHeight = Math.max(
        document.body ? (document.body.scrollHeight || 0) : 0,
        document.documentElement ? (document.documentElement.scrollHeight || 0) : 0,
        document.body ? (document.body.offsetHeight || 0) : 0,
        document.documentElement ? (document.documentElement.offsetHeight || 0) : 0,
        document.body ? (document.body.clientHeight || 0) : 0,
        document.documentElement ? (document.documentElement.clientHeight || 0) : 0
      );
      var vh = window.innerHeight || 800;
      var maxScroll = Math.max(1, (docHeight || vh) - vh);
      var globalProg = Math.max(0, Math.min(1, scrollY / maxScroll));
      if (isNaN(globalProg)) globalProg = 0;

      if (hudDial) {
        hudDial.textContent = "WARP " + Math.round(globalProg * 100) + "%";
      }

      // Determine active waypoint based on section focal point in viewport
      var vh = window.innerHeight;
      var focalY = vh * 0.38;
      var activeIdx = 0;
      var minDistance = Infinity;

      for (var i = 0; i < WAYPOINTS.length; i++) {
        var el = document.getElementById(WAYPOINTS[i].id);
        if (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top <= focalY && rect.bottom >= focalY) {
            activeIdx = i;
            break;
          }
          var dist = Math.abs(rect.top - focalY);
          if (dist < minDistance) {
            minDistance = dist;
            activeIdx = i;
          }
        }
      }

      waypointBtns.forEach(function (btn, idx) {
        btn.classList.toggle("active", idx === activeIdx);
      });
    }

    // Pinned Spatial 3D transitions (Desktop widescreen)
    function updatePinnedSpatial(prog) {
      document.documentElement.classList.remove("zoth-natural-scroll");
      if (track) track.classList.remove("natural-scroll-active");

      var activeIdx = 0;
      for (var i = 0; i < WAYPOINTS.length; i++) {
        if (prog >= WAYPOINTS[i].start && (prog < WAYPOINTS[i].end || i === WAYPOINTS.length - 1)) {
          activeIdx = i;
          break;
        }
      }

      stages.forEach(function (stage, idx) {
        if (idx === activeIdx) {
          stage.classList.add("active");
          stage.classList.remove("pushed-out");
        } else if (idx < activeIdx) {
          stage.classList.remove("active");
          stage.classList.add("pushed-out");
        } else {
          stage.classList.remove("active");
          stage.classList.remove("pushed-out");
        }
      });

      if (hudDial) {
        hudDial.textContent = "WARP " + Math.round(prog * 100) + "%";
      }

      waypointBtns.forEach(function (btn, idx) {
        btn.classList.toggle("active", idx === activeIdx);
      });

      if (spaceGrid) {
        spaceGrid.style.transform =
          "perspective(600px) rotateX(65deg) translateY(" +
          (120 - prog * 80) +
          "px) translateZ(" +
          (prog * 150) +
          "px) scale(2.2)";
      }
    }

    // Frame evaluation
    function onScrollOrFrame() {
      if (isNaturalScrollMode()) {
        updateNaturalScroll();
        return;
      }

      var trackRect = track.getBoundingClientRect();
      var maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) {
        updateNaturalScroll();
        return;
      }

      var scrolled = -trackRect.top;
      var prog = Math.max(0, Math.min(1, scrolled / maxScroll));
      updatePinnedSpatial(prog);
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScrollOrFrame();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Universal waypoint navigation: scrolls correctly in both natural and pinned modes
    function scrollToWaypoint(target, smooth) {
      var wp = null;
      var index = -1;

      if (typeof target === "number") {
        index = target;
        wp = WAYPOINTS[index];
      } else if (typeof target === "string") {
        var cleanId = target.replace(/^#?\/?#?/, "").trim();
        for (var i = 0; i < WAYPOINTS.length; i++) {
          if (WAYPOINTS[i].id === cleanId) {
            wp = WAYPOINTS[i];
            index = i;
            break;
          }
        }
      }

      if (!wp) return;

      var behavior = smooth !== false ? "smooth" : "auto";

      if (isNaturalScrollMode()) {
        var el = document.getElementById(wp.id);
        if (el) {
          var header = document.querySelector(".site-header") || document.querySelector("header.bar");
          var ribbon = document.getElementById("zoth-ribbon");
          var ribbonOffset = (ribbon && ribbon.classList.contains("on")) ? ribbon.offsetHeight : 0;
          var headerOffset = (header ? header.offsetHeight : 54) + ribbonOffset + 8;
          var rect = el.getBoundingClientRect();
          var currentY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
          var targetY = Math.max(0, rect.top + currentY - headerOffset);

          window.scrollTo({
            top: targetY,
            behavior: behavior
          });
        }
      } else {
        var trackRect = track.getBoundingClientRect();
        var currentY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
        var trackTop = trackRect.top + currentY;
        var maxScroll = track.offsetHeight - window.innerHeight;
        var targetY = trackTop + (wp.center * maxScroll);

        window.scrollTo({
          top: targetY,
          behavior: behavior
        });
      }

      waypointBtns.forEach(function (btn, idx) {
        btn.classList.toggle("active", idx === index);
      });
    }

    // Intercept in-page anchor links (header nav, drawer links, hero buttons)
    function handleAnchorClick(e) {
      var anchor = e.target && e.target.closest ? e.target.closest("a, button[data-warp]") : null;
      if (!anchor) return;

      var href = anchor.getAttribute("href") || anchor.getAttribute("data-warp") || "";
      if (!href) return;

      var match = href.match(/^(?:\/|index\.html)?#([a-zA-Z0-9_-]+)$/);
      if (match && match[1]) {
        var targetId = match[1];
        var isKnownWaypoint = WAYPOINTS.some(function (w) { return w.id === targetId; });
        if (isKnownWaypoint) {
          e.preventDefault();

          // Close mobile drawer if open
          if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
            var burger = document.getElementById("burger") || document.querySelector(".burger");
            if (burger) {
              burger.setAttribute("aria-expanded", "false");
              burger.textContent = "Menu";
            }
          }

          scrollToWaypoint(targetId, true);

          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", "#" + targetId);
          }
        }
      }
    }

    // Attach waypoint button click listeners
    waypointBtns.forEach(function (btn, idx) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToWaypoint(idx, true);
      });
    });

    // Global anchor click listener
    document.addEventListener("click", handleAnchorClick, false);

    // Scroll, touch, resize, and orientation listeners
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("touchmove", requestTick, { passive: true });
    window.addEventListener("touchend", requestTick, { passive: true });
    window.addEventListener("wheel", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(requestTick, 100);
    }, { passive: true });

    // Breakpoint change listener
    var mqlSmall = window.matchMedia("(max-width: 1024px), (pointer: coarse), (hover: none)");
    if (mqlSmall.addEventListener) {
      mqlSmall.addEventListener("change", requestTick);
    } else if (mqlSmall.addListener) {
      mqlSmall.addListener(requestTick);
    }

    // Hash change handler
    window.addEventListener("hashchange", function () {
      if (window.location.hash) {
        scrollToWaypoint(window.location.hash.replace(/^#/, ""), true);
      }
    });

    // Check initial hash on load
    if (window.location.hash) {
      var initialHash = window.location.hash.replace(/^#/, "");
      var hasWp = WAYPOINTS.some(function (w) { return w.id === initialHash; });
      if (hasWp) {
        setTimeout(function () {
          scrollToWaypoint(initialHash, false);
        }, 80);
      }
    }

    // Initial sync
    onScrollOrFrame();

    // Expose API for external modules
    window.ZothTravelParallax = {
      scrollToWaypoint: scrollToWaypoint,
      isNaturalScrollMode: isNaturalScrollMode,
      refresh: onScrollOrFrame
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTravelParallax);
  } else {
    initTravelParallax();
  }
})();
