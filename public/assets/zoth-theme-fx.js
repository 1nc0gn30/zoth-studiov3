/**
 * Theme atmosphere: Matrix rain, gold sunlight/dust, light grain, dark motes,
 * plus company-specific atmospheric particles (Google 4-color, Microsoft Fluent, Apple OLED, OpenAI Emerald, AWS Amber).
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

  function getPaletteForKind(kind) {
    if (kind === "google") {
      return ["66, 133, 244", "234, 67, 53", "251, 188, 4", "52, 168, 83", "138, 180, 248"];
    }
    if (kind === "microsoft") {
      return ["0, 164, 239", "242, 80, 34", "127, 186, 0", "255, 185, 0", "0, 120, 212"];
    }
    if (kind === "apple") {
      return ["10, 132, 255", "191, 90, 242", "229, 229, 234", "100, 210, 255", "255, 255, 255"];
    }
    if (kind === "openai") {
      return ["16, 163, 127", "0, 166, 126", "52, 211, 153", "20, 184, 166"];
    }
    if (kind === "amazon") {
      return ["255, 153, 0", "236, 114, 17", "245, 158, 11", "83, 159, 229"];
    }
    if (kind === "anthropic") {
      return ["217, 119, 87", "232, 168, 124", "240, 195, 180", "250, 248, 245"];
    }
    if (kind === "xai") {
      return ["0, 212, 170", "78, 224, 194", "255, 255, 255", "0, 255, 180"];
    }
    if (kind === "dracula") {
      return ["189, 147, 249", "255, 121, 198", "139, 233, 253", "80, 250, 123", "255, 184, 108"];
    }
    if (kind === "nord") {
      return ["136, 192, 208", "129, 161, 193", "94, 129, 172", "163, 190, 140", "236, 239, 244"];
    }
    if (kind === "synthwave") {
      return ["255, 42, 133", "0, 240, 255", "255, 230, 0", "184, 69, 242"];
    }
    if (kind === "solana") {
      return ["153, 69, 255", "20, 241, 149", "220, 31, 255", "0, 255, 163"];
    }
    if (kind === "monokai") {
      return ["230, 219, 116", "249, 38, 114", "166, 226, 46", "102, 217, 239", "174, 129, 255"];
    }
    if (kind === "gold") {
      return ["255, 214, 120", "251, 191, 36", "245, 158, 11"];
    }
    if (kind === "light") {
      return ["99, 91, 255", "180, 150, 80", "52, 199, 89"];
    }
    // dark default
    return ["0, 240, 255", "168, 85, 247", "52, 211, 153", "251, 191, 36"];
  }

  function startDust(kind) {
    if (!dustCanvas || reduced()) return;
    var ctx = dustCanvas.getContext("2d");
    var palette = getPaletteForKind(kind);

    function spawn() {
      var w = dustCanvas.width;
      var h = dustCanvas.height;
      var n = kind === "gold" ? 48 : kind === "google" ? 40 : kind === "microsoft" ? 36 : kind === "openai" ? 38 : kind === "apple" ? 32 : kind === "amazon" ? 42 : 36;
      particles = [];
      for (var i = 0; i < n; i++) {
        var color = palette[Math.floor(Math.random() * palette.length)];
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (kind === "gold" || kind === "google") ? 1.2 + Math.random() * 2.0 : 0.6 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.25 - 0.05,
          a: 0.25 + Math.random() * 0.55,
          fill: color
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
    else startDust(themeId);
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
