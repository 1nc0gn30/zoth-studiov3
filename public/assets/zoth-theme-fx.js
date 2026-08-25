/**
 * Theme atmosphere: Matrix rain, gold sunlight/dust, light grain, dark motes.
 * applyTheme() in zoth-theme.js calls ZothThemeFx.set().
 */
(function () {
  "use strict";
  var root, rainCanvas, dustCanvas, rainTimer, dustTimer, resizeRain, resizeDust;
  var cols, drops, active, particles;
  var GLYPHS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ0123456789ZOTH#$*";

  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function ensure() {
    if (root && document.body && root.parentNode) return root;
    if (!document.body) return null;
    root = document.getElementById("zoth-theme-fx");
    if (!root) {
      root = document.createElement("div");
      root.id = "zoth-theme-fx";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML =
        '<canvas id="zoth-fx-matrix"></canvas>' +
        '<div class="fx-layer" id="zoth-fx-crt"></div>' +
        '<div class="fx-layer" id="zoth-fx-sun"></div>' +
        '<div class="fx-layer" id="zoth-fx-sun-orb"></div>' +
        '<div class="fx-layer" id="zoth-fx-day"></div>' +
        '<div class="fx-layer" id="zoth-fx-void"></div>' +
        '<canvas id="zoth-fx-dust" class="fx-layer"></canvas>';
      document.body.insertBefore(root, document.body.firstChild);
    }
    rainCanvas = document.getElementById("zoth-fx-matrix");
    dustCanvas = document.getElementById("zoth-fx-dust");
    return root;
  }

  function stopRain() {
    if (rainTimer) {
      cancelAnimationFrame(rainTimer);
      rainTimer = 0;
    }
    if (resizeRain) {
      window.removeEventListener("resize", resizeRain);
      resizeRain = null;
    }
    if (rainCanvas) {
      var ctx = rainCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    }
  }

  function startRain() {
    if (!rainCanvas || reduced()) return;
    stopRain();
    var ctx = rainCanvas.getContext("2d");
    resizeRain = function () {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
      cols = Math.max(10, Math.floor(rainCanvas.width / 18));
      drops = new Array(cols);
      active = new Array(cols);
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * -50;
        var edge = i < cols * 0.28 || i > cols * 0.72;
        active[i] = edge ? Math.random() > 0.22 : Math.random() > 0.62;
      }
    };
    resizeRain();
    window.addEventListener("resize", resizeRain, { passive: true });
    function tick() {
      ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
      ctx.font = "14px 'Share Tech Mono', monospace";
      for (var i = 0; i < cols; i++) {
        if (!active[i]) continue;
        var x = i * 18;
        var head = drops[i] * 16;
        for (var t = 0; t < 12; t++) {
          var y = head - t * 16;
          if (y < 0) break;
          var a = t === 0 ? 1 : Math.max(0.12, 0.7 - t * 0.06);
          ctx.fillStyle = t === 0 ? "rgba(232,255,232," + a + ")" : "rgba(0,255,80," + a + ")";
          ctx.fillText(GLYPHS.charAt((i * 13 + t + ((head / 16) | 0)) % GLYPHS.length), x, y);
        }
        if (head > rainCanvas.height + 180 && Math.random() > 0.96) drops[i] = Math.random() * -20;
        drops[i] += 0.75 + Math.random() * 0.4;
      }
      rainTimer = requestAnimationFrame(tick);
    }
    rainTimer = requestAnimationFrame(tick);
  }

  function stopDust() {
    if (dustTimer) {
      cancelAnimationFrame(dustTimer);
      dustTimer = 0;
    }
    if (resizeDust) {
      window.removeEventListener("resize", resizeDust);
      resizeDust = null;
    }
    if (dustCanvas) {
      var ctx = dustCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    }
    particles = null;
  }

  function startDust(kind) {
    if (!dustCanvas || reduced()) return;
    var ctx = dustCanvas.getContext("2d");
    function spawn() {
      var w = dustCanvas.width;
      var h = dustCanvas.height;
      var n = kind === "gold" ? 48 : kind === "light" ? 28 : 36;
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: kind === "gold" ? 1.2 + Math.random() * 2.2 : 0.6 + Math.random() * 1.4,
          vx: kind === "gold" ? 0.15 + Math.random() * 0.35 : (Math.random() - 0.5) * 0.18,
          vy: kind === "gold" ? 0.08 + Math.random() * 0.22 : (Math.random() - 0.5) * 0.12,
          a: 0.25 + Math.random() * 0.5,
          fill: kind === "gold" ? "255, 214, 120" : kind === "light" ? "180, 150, 80" : (Math.random() > 0.5 ? "0, 240, 255" : "168, 85, 247")
        });
      }
    }
    resizeDust = function () {
      dustCanvas.width = window.innerWidth;
      dustCanvas.height = window.innerHeight;
      spawn();
    };
    resizeDust();
    window.addEventListener("resize", resizeDust, { passive: true });
    function tick() {
      ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > dustCanvas.width) p.x = 0;
        if (p.x < 0) p.x = dustCanvas.width;
        if (p.y > dustCanvas.height) p.y = 0;
        if (p.y < 0) p.y = dustCanvas.height;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.fill + "," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      dustTimer = requestAnimationFrame(tick);
    }
    dustTimer = requestAnimationFrame(tick);
  }

  function set(themeId) {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () { set(themeId); }, { once: true });
      return;
    }
    ensure();
    stopRain();
    stopDust();
    if (themeId === "matrix") startRain();
    else if (themeId === "gold") startDust("gold");
    else if (themeId === "dark") startDust("dark");
    else if (themeId === "light") startDust("light");
  }

  window.ZothThemeFx = { set: set, ensure: ensure };

  window.addEventListener("zoth-theme-change", function (e) {
    if (e && e.detail && e.detail.theme) set(e.detail.theme);
  });

  function boot() {
    ensure();
    set(document.documentElement.getAttribute("data-theme") || "dark");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
