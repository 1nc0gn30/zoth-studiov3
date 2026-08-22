/**
 * Zoth Studio — Universal High-Performance Parallax & Pinned Stage Engine (v4.0)
 * Computes hardware-accelerated intersection reveals, multi-layer velocity parallax,
 * and pinned stage transitions across all desktop and mobile viewports.
 */
(function () {
  "use strict";

  function initParallax() {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = document.querySelectorAll("section, .parallax-section, .hero, .creators-showcase, .note, .pets, .social-wall-section, .install");
    var parallaxCards = document.querySelectorAll(".parallax-card, .glass-stage-card, .hero-value-card, .tool-card, .pet-card, .social-card");

    // 1. Intersection Observer for Pinned Stage Focus & Reveal Ratios
    if ("IntersectionObserver" in window) {
      var observerOptions = {
        root: null,
        rootMargin: "0px 0px -5% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0]
      };

      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var ratio = entry.intersectionRatio;
          var target = entry.target;

          target.style.setProperty("--reveal-ratio", ratio.toFixed(3));
          
          if (entry.isIntersecting) {
            target.classList.add("in-view");
            if (ratio >= 0.35) {
              target.classList.add("in-focal-point");
            } else {
              target.classList.remove("in-focal-point");
            }
          } else {
            target.classList.remove("in-view");
            target.classList.remove("in-focal-point");
          }
        });
      }, observerOptions);

      sections.forEach(function (sec) {
        sectionObserver.observe(sec);
      });

      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            entry.target.style.setProperty("--reveal-ratio", Math.max(0.6, entry.intersectionRatio).toFixed(3));
          }
        });
      }, { threshold: [0.1, 0.5] });

      parallaxCards.forEach(function (card) {
        cardObserver.observe(card);
      });
    }

    // 2. High-Performance RequestAnimationFrame Parallax Ticker
    if (!prefersReducedMotion) {
      var ticking = false;
      var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

      function updateParallax() {
        var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        var vh = window.innerHeight;

        sections.forEach(function (sec) {
          var rect = sec.getBoundingClientRect();
          // Check if section is within or near viewport
          if (rect.bottom > -100 && rect.top < vh + 100) {
            var centerOffset = (rect.top + rect.height / 2) - (vh / 2);
            var normalizedOffset = centerOffset / vh;
            sec.style.setProperty("--parallax-offset", (centerOffset * 0.18).toFixed(1) + "px");
            sec.style.setProperty("--scroll-progress", normalizedOffset.toFixed(3));

            // Shift ambient orbs
            var orbs = sec.querySelectorAll(".parallax-orb");
            orbs.forEach(function (orb, i) {
              var factor = (i % 2 === 0) ? 0.12 : -0.15;
              orb.style.transform = "translate3d(0, " + (centerOffset * factor).toFixed(1) + "px, 0)";
            });
          }
        });

        lastScrollY = currentScrollY;
        ticking = false;
      }

      window.addEventListener("scroll", function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });

      // Initial run
      updateParallax();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParallax);
  } else {
    initParallax();
  }
})();
