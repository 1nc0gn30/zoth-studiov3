/**
 * Zoth Studio — 3D Spatial Scroll Travel & Pinned Parallax Engine (v5.0)
 * Transforms linear scrolling into deep 3D spatial camera travel, bringing 3D chambers
 * into center focus and pushing past completed stages with depth blur and velocity.
 */
(function () {
  "use strict";

  function initTravelParallax() {
    var isMobile = window.innerWidth <= 880;
    var track = document.querySelector(".scroll-travel-track");
    var stages = document.querySelectorAll(".travel-scene-stage");
    var hudDial = document.getElementById("hudProgressDial");
    var waypointBtns = document.querySelectorAll(".hud-waypoint-btn");
    var spaceGrid = document.querySelector(".travel-grid-mesh");

    if (!track || stages.length === 0) return;

    // Mobile fallback gracefully uses standard layout
    if (isMobile) {
      stages.forEach(function(s) { s.classList.add("active"); });
      return;
    }

    var ticking = false;
    var currentProgress = 0;

    // 6 Waypoint ranges [start, center, end]
    var waypoints = [
      { id: "hero", start: 0.00, center: 0.08, end: 0.18, title: "01 Swarm" },
      { id: "for-everyone", start: 0.18, center: 0.27, end: 0.38, title: "02 Creators" },
      { id: "about", start: 0.38, center: 0.46, end: 0.58, title: "03 Azoth Core" },
      { id: "agents", start: 0.58, center: 0.66, end: 0.76, title: "04 Pantheon" },
      { id: "pets", start: 0.76, center: 0.84, end: 0.90, title: "05 Comic & Pets" },
      { id: "install", start: 0.90, center: 0.96, end: 1.00, title: "06 Install" }
    ];

    function updateScenes(prog) {
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

      // Update HUD Dial & Waypoints
      if (hudDial) {
        hudDial.textContent = "WARP " + Math.round(prog * 100) + "%";
      }

      waypointBtns.forEach(function (btn, idx) {
        btn.classList.toggle("active", idx === activeIdx);
      });

      // Shift 3D Cyber Space Grid
      if (spaceGrid) {
        spaceGrid.style.transform = "perspective(600px) rotateX(65deg) translateY(" + (120 - prog * 80) + "px) translateZ(" + (prog * 150) + "px) scale(2.2)";
      }
    }

    function onScroll() {
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

    // Interactive Waypoint Clicks
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

    // Keyboard Arrow/Page Navigation
    window.addEventListener("keydown", function (e) {
      if (["ArrowDown", "PageDown", " "].indexOf(e.key) !== -1 && !e.target.matches("input, textarea, select")) {
        var trackRect = track.getBoundingClientRect();
        var maxScroll = track.offsetHeight - window.innerHeight;
        var scrolled = -trackRect.top;
        var prog = Math.max(0, Math.min(1, scrolled / maxScroll));
        
        var currentIdx = 0;
        for (var i = 0; i < waypoints.length; i++) {
          if (prog >= waypoints[i].start && (prog < waypoints[i].end || i === waypoints.length - 1)) {
            currentIdx = i;
            break;
          }
        }
        
        if (currentIdx < waypoints.length - 1) {
          e.preventDefault();
          var nextWp = waypoints[currentIdx + 1];
          var targetY = track.offsetTop + (nextWp.center * maxScroll);
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      } else if (["ArrowUp", "PageUp"].indexOf(e.key) !== -1 && !e.target.matches("input, textarea, select")) {
        var trackRect = track.getBoundingClientRect();
        var maxScroll = track.offsetHeight - window.innerHeight;
        var scrolled = -trackRect.top;
        var prog = Math.max(0, Math.min(1, scrolled / maxScroll));
        
        var currentIdx = 0;
        for (var i = 0; i < waypoints.length; i++) {
          if (prog >= waypoints[i].start && (prog < waypoints[i].end || i === waypoints.length - 1)) {
            currentIdx = i;
            break;
          }
        }
        
        if (currentIdx > 0) {
          e.preventDefault();
          var prevWp = waypoints[currentIdx - 1];
          var targetY = track.offsetTop + (prevWp.center * maxScroll);
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
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
