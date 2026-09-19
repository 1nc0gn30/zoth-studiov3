/* ═══════════════════════════════════════════════════════════════════════════
   ZOTH STUDIO — MATRIX CYBERPUNK JS EFFECTS v2.0
   Deep matrix rain, RGB glitch, holographic parallax, ambient telemetry
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  // ── Matrix rain canvas (hero-scoped, mirrors theme-fx rain) ──
  function initMatrixRain() {
    var wrap = document.querySelector('.hero .matrix-canvas-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'matrix-canvas-wrap';
      hero.insertBefore(wrap, hero.firstChild);
    }
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    wrap.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var cols, drops, active;
    var GLYPHS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ0123456789ZOTH#$*';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.max(12, Math.floor(canvas.width / 16));
      drops = new Array(cols);
      active = new Array(cols);
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * -60 - 20;
        var edge = i < cols * 0.25 || i > cols * 0.75;
        active[i] = edge ? Math.random() > 0.18 : Math.random() > 0.58;
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var frame;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px "Share Tech Mono", monospace';
      for (var i = 0; i < cols; i++) {
        if (!active[i]) continue;
        var x = i * 16;
        var head = drops[i] * 15;
        for (var t = 0; t < 14; t++) {
          var y = head - t * 15;
          if (y < 0) break;
          var a = t === 0 ? 1 : Math.max(0.08, 0.65 - t * 0.05);
          var bright = t === 0 ? '220,255,220' : '0,255,80';
          ctx.fillStyle = 'rgba(' + bright + ',' + a + ')';
          var ch = GLYPHS.charAt((i * 17 + t + ((head / 15) | 0)) % GLYPHS.length);
          ctx.fillText(ch, x, y);
        }
        if (head > canvas.height + 200 && Math.random() > 0.94) {
          drops[i] = Math.random() * -30 - 10;
        } else {
          drops[i] += 0.7 + Math.random() * 0.45;
        }
      }
      frame = requestAnimationFrame(tick);
    }
    tick();

    return function stop() {
      if (frame) cancelAnimationFrame(frame);
      if (wrap) wrap.remove();
    };
  }

  // ── RGB chromatic glitch burst ──
  function triggerGlitch(intensity) {
    intensity = intensity || 1.0;
    var glitch = hero.querySelector('.glitch-rgb');
    if (!glitch) {
      glitch = document.createElement('div');
      glitch.className = 'glitch-rgb';
      hero.appendChild(glitch);
    }
    glitch.classList.remove('active');
    void glitch.offsetWidth;
    glitch.style.opacity = '1';
    glitch.classList.add('active');
    setTimeout(function () {
      glitch.classList.remove('active');
      setTimeout(function () { glitch.style.opacity = '0'; }, 80);
    }, 90 * intensity);
  }

  // ── Hero image floating + rotation ──
  function initHeroFloat() {
    var azoth = hero.querySelector('.hero-azoth');
    if (!azoth) return;
    var tick = 0;
    function float() {
      tick += 0.018;
      var floatY = Math.sin(tick * 0.8) * 5;
      var floatX = Math.cos(tick * 0.6) * 2.5;
      var rotY = -10 + Math.sin(tick * 0.5) * 2;
      var rotX = 5 + Math.cos(tick * 0.7) * 1.5;
      azoth.style.transform =
        'perspective(900px) rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg) translateY(' + floatY + 'px) translateX(' + floatX + 'px)';
      requestAnimationFrame(float);
    }
    float();
  }

  // ── Metric counter glow pulse ──
  function pulseMetricGlow() {
    var nums = hero.querySelectorAll('.metric-num');
    if (!nums.length) return;
    var tick = 0;
    function pulse() {
      tick += 0.04;
      var glow = 0.3 + Math.sin(tick * 1.3) * 0.25 + Math.sin(tick * 2.7) * 0.1;
      nums.forEach(function (el) {
        var size = 8 + glow * 14;
        var alpha = 0.25 + glow * 0.35;
        el.style.textShadow =
          '0 0 ' + size + 'px rgba(0,255,102,' + alpha + '), ' +
          '0 0 ' + (size * 1.8) + 'px rgba(0,240,255,' + (alpha * 0.4) + ')';
      });
      requestAnimationFrame(pulse);
    }
    pulse();
  }

  // ── Scanline intensity on scroll ──
  function updateScanIntensity() {
    var scanlines = hero.querySelectorAll('.scanline-fine');
    var scrollY = window.scrollY || window.pageYOffset || 0;
    scanlines.forEach(function (el) {
      var intensity = Math.max(0.3, 1 - scrollY / 250);
      el.style.opacity = intensity;
    });
  }

  // ── Holographic grid mouse parallax ──
  function initHoloParallax() {
    var holo = hero.querySelector('.holo-grid');
    if (!holo || reduceMotion) return;
    document.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width - 0.5;
      var cy = (e.clientY - rect.top) / rect.height - 0.5;
      var rotY = cx * 6;
      var rotX = 58 - cy * 8;
      holo.style.transform = 'rotateX(' + rotX + 'deg) scale(1.1)';
    }, { passive: true });
  }

  // ── Glitch scheduling (random 10-28s) ──
  function scheduleGlitch() {
    if (reduceMotion) return;
    var delay = 10000 + Math.random() * 18000;
    setTimeout(function () {
      triggerGlitch(0.6 + Math.random() * 0.4);
      scheduleGlitch();
    }, delay);
  }

  // ── Init ──
  function init() {
    initMatrixRain();
    initHeroFloat();
    pulseMetricGlow();
    updateScanIntensity();
    window.addEventListener('scroll', updateScanIntensity, { passive: true });
    initHoloParallax();
    scheduleGlitch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
