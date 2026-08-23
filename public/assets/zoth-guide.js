/**
 * Zoth presence: crop the hero figure into empty film, and pop a
 * three-line digest bubble when a [data-guide] section enters view.
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var FACE = "/assets/mascot/azoth-mask.jpg";
  var BUST = "/assets/mascot/azoth-mask.jpg";
  var SEAL = "/assets/brand/azoth-seal-masterpiece.jpg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function placeFaces() {
    document.querySelectorAll("[data-face]").forEach(function (stage) {
      if (stage === document.body || stage === document.documentElement) return;
      if (stage.querySelector(".zoth-face")) return;
      var side = stage.getAttribute("data-face") || "east";
      if (side === "off") return;
      var img = document.createElement("img");
      img.className = "zoth-face " + side;
      img.src = FACE;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      stage.appendChild(img);
    });
    document.querySelectorAll("[data-seal]").forEach(function (el) {
      if (el.querySelector(".zoth-seal")) return;
      var img = document.createElement("img");
      img.className = "zoth-seal " + (el.getAttribute("data-seal") || "tr");
      img.src = SEAL;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      el.appendChild(img);
    });
  }

  function ensureGuide() {
    var box = document.getElementById("zoth-guide");
    if (box) return box;
    box = document.createElement("aside");
    box.id = "zoth-guide";
    box.hidden = true;
    box.setAttribute("aria-live", "polite");
    box.innerHTML =
      '<img src="' + BUST + '" alt="" width="72" height="92" />' +
      '<div class="bubble">' +
      '<p class="who"><a href="/zoth/" style="color:inherit;text-decoration:none">Azoth</a></p>' +
      '<ol class="lines"></ol>' +
      '<button class="x" type="button" aria-label="Dismiss">×</button>' +
      "</div>";
    document.body.appendChild(box);
    box.querySelector(".x").addEventListener("click", function () {
      hide(box);
      box.setAttribute("data-hold", "1");
    });
    return box;
  }

  function hide(box) {
    box.classList.remove("on");
    window.setTimeout(function () {
      if (!box.classList.contains("on")) box.hidden = true;
    }, 280);
  }

  function show(box, lines) {
    if (box.getAttribute("data-hold") === "1") return;
    var ol = box.querySelector(".lines");
    ol.innerHTML = "";
    lines.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      ol.appendChild(li);
    });
    box.hidden = false;
    window.requestAnimationFrame(function () {
      box.classList.add("on");
    });
  }

  function splitGuide(raw) {
    return String(raw || "")
      .split("|")
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
      .slice(0, 3);
  }

  function watchGuides(box) {
    var nodes = [].slice.call(document.querySelectorAll("[data-guide]"));
    if (!nodes.length) return;
    var current = null;

    function pick() {
      if (box.getAttribute("data-hold") === "1") return;
      var vh = window.innerHeight || 800;
      var best = null;
      var bestScore = 0;
      nodes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (vis < Math.min(140, r.height * 0.28)) return;
        var score = vis / Math.max(r.height, 1);
        if (score > bestScore) {
          bestScore = score;
          best = el;
        }
      });
      if (best !== current) {
        current = best;
        if (!best) hide(box);
        else show(box, splitGuide(best.getAttribute("data-guide")));
      }
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function () { pick(); }, {
        threshold: [0.18, 0.4, 0.65],
        rootMargin: "-8% 0px -18% 0px"
      });
      nodes.forEach(function (el) { io.observe(el); });
    }
    window.addEventListener("scroll", pick, { passive: true });
    pick();
  }

  function boot() {
    placeFaces();
    if (reduce) return;
    var box = ensureGuide();
    watchGuides(box);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
