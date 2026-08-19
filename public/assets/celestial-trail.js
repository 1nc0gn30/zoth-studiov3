/**
 * Gold/void pointer trail. Fine pointer keeps the ribbon.
 * Coarse / touch stays thin, capped, and idle-pauses so mobile
 * does not grow a giant lagging smear.
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (document.getElementById("celestial-cursor-canvas")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var dpr = fine ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
  var maxPoints = fine ? 20 : 9;
  var maxWidth = fine ? 9 : 4.2;
  var velCap = fine ? 20 : 8;
  var sparkChance = fine ? 0.28 : 0.08;
  var maxSparks = fine ? 48 : 16;
  var blur = fine ? 10 : 0;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { alpha: true });
  canvas.id = "celestial-cursor-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:28;";
  document.body.appendChild(canvas);

  var width = 0;
  var height = 0;
  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  var points = [];
  var sparks = [];
  var hue = 42;
  var lastX = 0;
  var lastY = 0;
  var lastMove = 0;
  var tracking = false;
  var raf = 0;
  var running = false;

  function Spark(x, y, vx, vy, color, size, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.max = life;
  }
  Spark.prototype.step = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.life--;
  };
  Spark.prototype.draw = function (c) {
    var p = this.life / this.max;
    var r = Math.max(0.2, this.size * p);
    c.globalAlpha = Math.sin(p * Math.PI) * 0.75;
    c.fillStyle = this.color;
    c.beginPath();
    c.moveTo(this.x, this.y - r * 1.5);
    c.lineTo(this.x + r * 0.45, this.y);
    c.lineTo(this.x, this.y + r * 1.5);
    c.lineTo(this.x - r * 0.45, this.y);
    c.closePath();
    c.fill();
    c.globalAlpha = 1;
  };

  function spawn(x, y, n, speed) {
    var i;
    var a;
    var s;
    n = fine ? n : Math.min(n, 3);
    for (i = 0; i < n; i++) {
      if (sparks.length >= maxSparks) return;
      a = Math.random() * Math.PI * 2;
      s = (Math.random() * 1.4 + 0.3) * speed;
      sparks.push(
        new Spark(
          x,
          y,
          Math.cos(a) * s,
          Math.sin(a) * s,
          "hsl(" + ((hue + (Math.random() - 0.5) * 28 + 360) % 360) + ", 90%, 68%)",
          Math.random() * (fine ? 3.2 : 2) + 1.2,
          Math.random() * 14 + 10
        )
      );
    }
  }

  function kick() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function onPoint(x, y, burst) {
    lastX = x;
    lastY = y;
    lastMove = performance.now();
    tracking = true;
    points.unshift({ x: x, y: y });
    if (points.length > maxPoints) points.length = maxPoints;
    if (burst) spawn(x, y, fine ? 8 : 3, fine ? 1.8 : 1.1);
    else if (Math.random() < sparkChance) spawn(x, y, 1, 0.7);
    kick();
  }

  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      if (!fine && e.pointerType === "mouse") return;
      onPoint(e.clientX, e.clientY, false);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    function (e) {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      onPoint(e.clientX, e.clientY, true);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerup",
    function () {
      tracking = false;
    },
    { passive: true }
  );
  window.addEventListener(
    "pointercancel",
    function () {
      tracking = false;
    },
    { passive: true }
  );

  function tick(now) {
    ctx.clearRect(0, 0, width, height);
    hue = (hue + (fine ? 0.55 : 0.3)) % 360;

    if (!tracking && points.length) {
      if (now - lastMove > 220) points.pop();
      if (now - lastMove > 420 && points.length) points.pop();
    }

    if (points.length > 1) {
      var i;
      var a;
      var b;
      var dx;
      var dy;
      var v;
      var w;
      var p;
      var h;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (i = 0; i < points.length - 1; i++) {
        a = points[i];
        b = points[i + 1];
        dx = b.x - a.x;
        dy = b.y - a.y;
        v = Math.min(Math.sqrt(dx * dx + dy * dy), velCap);
        p = 1 - i / points.length;
        w = Math.max(1.1, p * (maxWidth + v * (fine ? 0.18 : 0.08)));
        h = (hue - i * 4 + 360) % 360;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        if (blur) {
          ctx.shadowBlur = blur * p;
          ctx.shadowColor = "hsl(" + h + ", 90%, 58%)";
        }
        ctx.lineWidth = w;
        ctx.strokeStyle = "hsla(" + h + ", 92%, 64%, " + p * 0.55 + ")";
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(0.8, w * 0.28);
        ctx.strokeStyle = "rgba(255,255,255," + p * 0.72 + ")";
        ctx.stroke();
      }
    }

    for (var s = sparks.length - 1; s >= 0; s--) {
      sparks[s].step();
      sparks[s].draw(ctx);
      if (sparks[s].life <= 0) sparks.splice(s, 1);
    }

    if (points.length || sparks.length) {
      raf = requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, width, height);
    }
  }
})();
