/**
 * Zoth Studio — 3D Spatial Scroll Travel & Pinned Parallax Engine (v5.2)
 * Mobile-First: Gracefully disabled on mobile viewports (<= 880px) ensuring natural vertical scrolling.
 */
(function () {
  "use strict";

  function initTravelParallax() {
    var track = document.querySelector(".scroll-travel-track");
    var stages = document.querySelectorAll(".travel-scene-stage");
    var hudDial = document.getElementById("hudProgressDial");
    var waypointBtns = document.querySelectorAll(".hud-waypoint-btn");
    var spaceGrid = document.querySelector(".travel-grid-mesh");

    if (!track || stages.length === 0) return;

    function isMobile() {
      return window.innerWidth <= 880;
    }

    function resetMobileStages() {
      stages.forEach(function (s) {
        s.classList.add("active");
        s.classList.remove("pushed-out");
        s.style.opacity = "";
        s.style.transform = "";
        s.style.visibility = "";
        s.style.filter = "";
      });
    }

    if (isMobile()) {
      resetMobileStages();
      return;
    }

    var ticking = false;

    var waypoints = [
      { id: "hero", start: 0.00, center: 0.08, end: 0.18, title: "01 Swarm" },
      { id: "for-everyone", start: 0.18, center: 0.27, end: 0.38, title: "02 Creators" },
      { id: "about", start: 0.38, center: 0.46, end: 0.58, title: "03 Azoth Core" },
      { id: "agents", start: 0.58, center: 0.66, end: 0.76, title: "04 Pantheon" },
      { id: "pets", start: 0.76, center: 0.84, end: 0.90, title: "05 Comic & Pets" },
      { id: "install", start: 0.90, center: 0.96, end: 1.00, title: "06 Install" }
    ];

    function updateScenes(prog) {
      if (isMobile()) {
        resetMobileStages();
        return;
      }

      var activeIdx = 0;
      for (var i = 0; i < waypoints.length; i++) {
        if (prog >= waypoints[i].start && (prog < waypoints[i].end || i === waypoints.length - 1)) {
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
        spaceGrid.style.transform = "perspective(600px) rotateX(65deg) translateY(" + (120 - prog * 80) + "px) translateZ(" + (prog * 150) + "px) scale(2.2)";
      }
    }

    function onScroll() {
      if (isMobile()) return;
      var trackRect = track.getBoundingClientRect();
      var maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      var scrolled = -trackRect.top;
      var prog = Math.max(0, Math.min(1, scrolled / maxScroll));

      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateScenes(prog);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function() {
      if (isMobile()) {
        resetMobileStages();
      } else {
        onScroll();
      }
    });

    waypointBtns.forEach(function (btn, idx) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var wp = waypoints[idx];
        if (!wp) return;
        var maxScroll = track.offsetHeight - window.innerHeight;
        var targetY = track.offsetTop + (wp.center * maxScroll);
        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      });
    });

    // Initial sync
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTravelParallax);
  } else {
    initTravelParallax();
  }
})();
