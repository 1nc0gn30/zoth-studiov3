/**
 * ============================================================================
 * HERMETIC CELESTIAL TRAIL & AETHER PARTICLE ENGINE (v3.0)
 * ============================================================================
 * Sacred Geometry · Golden Ratio (Φ = 1.6180339887) Dynamics · Aether Bloom
 * Colors: #fbbf24 (Solar Gold) · #00f0ff (Aether Cyan) · #34d399 (Emerald Verde)
 * 60 FPS Delta-Normalized · Zero-CPU Idle Auto-Sleep · Clean Memory Lifecycle
 * ============================================================================
 */
(function (global) {
  "use strict";

  if (typeof window === "undefined") return;
  if (document.getElementById("celestial-cursor-canvas")) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Sacred Mathematical Constants
  var PHI = 1.618033988749895;              // Golden Ratio Φ
  var GOLDEN_ANGLE = 137.50776405003785 * (Math.PI / 180); // 2.39996323 rad
  var SPIRAL_EXP = 0.3063489;                // b = ln(Φ)/(pi/2)
  var DAMPING = 0.9412;                      // Φ-harmonic velocity damping

  // Hermetic Spectral Palette
  var PALETTE = [
    { r: 251, g: 191, b: 36,  hex: "#fbbf24", name: "solar-gold" },    // Hermetic Solar Gold
    { r: 0,   g: 240, b: 255, hex: "#00f0ff", name: "aether-cyan" },   // Celestial Mercury Cyan
    { r: 52,  g: 211, b: 153, hex: "#34d399", name: "emerald-verde" }, // Emerald Tablet Verde
    { r: 253, g: 230, b: 138, hex: "#fde68a", name: "gold-shimmer" },  // Radiant Solar Crown
    { r: 165, g: 243, b: 252, hex: "#a5f3fc", name: "aether-mist" }    // Ethereal Prism
  ];

  // Device & Pointer Capabilities
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var dpr = isFinePointer ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  var MAX_POINTS = isFinePointer ? 24 : 10;
  var MAX_SPARKS = isFinePointer ? 120 : 36;
  var MAX_WIDTH = isFinePointer ? 10.0 : 4.5;
  var VELOCITY_CAP = isFinePointer ? 28 : 12;
  var SPARK_CHANCE = isFinePointer ? 0.35 : 0.12;

  // DOM Canvas Construction
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  canvas.id = "celestial-cursor-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:28;contain:strict;";
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

  // ── SPARK OBJECT POOL (Zero GC Overhead) ──────────────────────────────────
  function HermeticSpark() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = PALETTE[0];
    this.size = 2;
    this.life = 0;
    this.maxLife = 20;
    this.type = 0; // 0 = Octagram, 1 = Diamond, 2 = Orb
    this.orbitAngle = 0;
    this.orbitRadius = 0;
    this.orbitSpeed = 0;
  }

  HermeticSpark.prototype.init = function (x, y, vx, vy, color, size, maxLife, type, orbitRadius, orbitSpeed) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color || PALETTE[0];
    this.size = size || 2;
    this.life = maxLife || 20;
    this.maxLife = maxLife || 20;
    this.type = typeof type === "number" ? type : 0;
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitRadius = orbitRadius || 0;
    this.orbitSpeed = orbitSpeed || 0;
  };

  HermeticSpark.prototype.step = function (dt) {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= Math.pow(DAMPING, dt);
    this.vy *= Math.pow(DAMPING, dt);

    if (this.orbitRadius > 0) {
      this.orbitAngle += this.orbitSpeed * dt;
      this.x += Math.cos(this.orbitAngle) * this.orbitRadius * dt * 0.1;
      this.y += Math.sin(this.orbitAngle) * this.orbitRadius * dt * 0.1;
    }

    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
    }
  };

  HermeticSpark.prototype.draw = function (c) {
    if (!this.active) return;
    var p = Math.max(0, this.life / this.maxLife);
    var alpha = Math.sin(p * Math.PI);
    var r = Math.max(0.3, this.size * (0.4 + 0.6 * p));
    var col = this.color;

    c.save();
    c.translate(this.x, this.y);

    if (this.type === 0) {
      // 8-Pointed Hermetic Octagram Star
      c.globalAlpha = alpha * 0.95;
      c.fillStyle = "rgba(" + col.r + ", " + col.g + ", " + col.b + ", " + alpha + ")";
      if (isFinePointer) {
        c.shadowColor = col.hex;
        c.shadowBlur = 8 * p;
      }

      c.beginPath();
      for (var k = 0; k < 8; k++) {
        var ang = (k * Math.PI) / 4;
        var len = k % 2 === 0 ? r * 1.8 : r * 0.6;
        var px = Math.cos(ang) * len;
        var py = Math.sin(ang) * len;
        if (k === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();

      // White hot center
      c.fillStyle = "rgba(255, 255, 255, " + (alpha * 0.8) + ")";
      c.beginPath();
      c.arc(0, 0, r * 0.4, 0, Math.PI * 2);
      c.fill();

    } else if (this.type === 1) {
      // 4-Pointed Sacred Diamond Spark
      c.globalAlpha = alpha * 0.85;
      c.fillStyle = "rgba(" + col.r + ", " + col.g + ", " + col.b + ", " + alpha + ")";
      if (isFinePointer) {
        c.shadowColor = col.hex;
        c.shadowBlur = 6 * p;
      }

      c.beginPath();
      c.moveTo(0, -r * 1.6);
      c.lineTo(r * 0.4, 0);
      c.lineTo(0, r * 1.6);
      c.lineTo(-r * 0.4, 0);
      c.closePath();
      c.fill();

    } else {
      // Luminous Ethereal Aether Orb with Soft Falloff
      c.globalAlpha = alpha * 0.75;
      var grad = c.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
      grad.addColorStop(0, "rgba(255, 255, 255, " + (alpha * 0.9) + ")");
      grad.addColorStop(0.35, "rgba(" + col.r + ", " + col.g + ", " + col.b + ", " + (alpha * 0.7) + ")");
      grad.addColorStop(1, "rgba(" + col.r + ", " + col.g + ", " + col.b + ", 0)");
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, r * 2.2, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  };

  // Pre-allocated Spark Pool
  var sparkPool = [];
  for (var spi = 0; spi < MAX_SPARKS; spi++) {
    sparkPool.push(new HermeticSpark());
  }

  function acquireSpark() {
    for (var i = 0; i < sparkPool.length; i++) {
      if (!sparkPool[i].active) return sparkPool[i];
    }
    return null;
  }

  // ── TRAIL STATE ──────────────────────────────────────────────────────────
  var points = [];
  var colorCycleIndex = 0;
  var lastMove = 0;
  var tracking = false;
  var rafId = 0;
  var isRunning = false;
  var lastFrameTime = performance.now();
  var documentHidden = false;

  // Golden Ratio Spiral Particle Emitter
  function spawnPhiSpiralBurst(x, y, count, speedMultiplier) {
    speedMultiplier = speedMultiplier || 1.0;
    var total = isFinePointer ? count : Math.min(count, 6);
    var startAngle = Math.random() * Math.PI * 2;

    for (var k = 0; k < total; k++) {
      var spark = acquireSpark();
      if (!spark) break;

      // Golden angle distribution for natural sacred spiral unpacking
      var theta = startAngle + k * GOLDEN_ANGLE;
      var spiralRadius = Math.exp(SPIRAL_EXP * (k / total) * 1.8);
      var speed = (0.8 + Math.random() * 1.4) * speedMultiplier * (spiralRadius * 0.5);
      var vx = Math.cos(theta) * speed;
      var vy = Math.sin(theta) * speed;

      // Color selection according to Hermetic sacred triad
      var col = PALETTE[k % PALETTE.length];
      var type = k % 5 === 0 ? 0 : (k % 2 === 0 ? 1 : 2);
      var life = 14 + Math.random() * 16;
      var size = (Math.random() * 2.2 + 1.2) * (isFinePointer ? 1.0 : 0.7);

      spark.init(
        x,
        y,
        vx,
        vy,
        col,
        size,
        life,
        type,
        k % 3 === 0 ? Math.random() * 2 + 1 : 0,
        (Math.random() - 0.5) * 0.15
      );
    }
  }

  function wakeEngine() {
    if (documentHidden) return;
    if (!isRunning) {
      isRunning = true;
      lastFrameTime = performance.now();
      rafId = requestAnimationFrame(renderLoop);
    }
  }

  function registerPointerPoint(x, y, isBurst) {
    lastMove = performance.now();
    tracking = true;

    // Push new vertex to trail
    points.unshift({ x: x, y: y, time: lastMove });
    if (points.length > MAX_POINTS) points.length = MAX_POINTS;

    colorCycleIndex = (colorCycleIndex + 0.15) % PALETTE.length;

    if (isBurst) {
      spawnPhiSpiralBurst(x, y, isFinePointer ? 18 : 8, isFinePointer ? 2.4 : 1.4);
    } else if (Math.random() < SPARK_CHANCE) {
      var spark = acquireSpark();
      if (spark) {
        var ang = Math.random() * Math.PI * 2;
        var spd = Math.random() * 1.2 + 0.3;
        var col = PALETTE[Math.floor(colorCycleIndex) % PALETTE.length];
        spark.init(
          x,
          y,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd,
          col,
          Math.random() * 2 + 1.0,
          12 + Math.random() * 10,
          Math.random() > 0.6 ? 1 : 2
        );
      }
    }

    wakeEngine();
  }

  // Pointer Event Listeners (Passive for high performance)
  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      if (!isFinePointer && e.pointerType === "mouse") return;
      registerPointerPoint(e.clientX, e.clientY, false);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    function (e) {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      registerPointerPoint(e.clientX, e.clientY, true);
    },
    { passive: true }
  );

  window.addEventListener("pointerup", function () { tracking = false; }, { passive: true });
  window.addEventListener("pointercancel", function () { tracking = false; }, { passive: true });

  // Tab Visibility Lifecycle Management (Zero CPU when backgrounded)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      documentHidden = true;
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    } else {
      documentHidden = false;
      if (points.length > 0) wakeEngine();
    }
  });

  // ── RENDER LOOP (60 FPS Delta Normalized) ─────────────────────────────────
  function renderLoop(now) {
    if (documentHidden) {
      isRunning = false;
      return;
    }

    var dt = Math.min((now - lastFrameTime) / 16.667, 3.0); // 60 FPS normalizer
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);

    // Fade old trail points when pointer stops
    if (!tracking && points.length > 0) {
      if (now - lastMove > 140) points.pop();
      if (now - lastMove > 280 && points.length > 0) points.pop();
    }

    // 1. Render Multi-Layer Aether Ribbon
    if (points.length > 1) {
      // Pass A: Volumetric Aether Glow (Composite: Screen / Lighter)
      ctx.save();
      ctx.globalCompositeOperation = isFinePointer ? "screen" : "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (var i = 0; i < points.length - 1; i++) {
        var a = points[i];
        var b = points[i + 1];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var v = Math.min(Math.sqrt(dx * dx + dy * dy), VELOCITY_CAP);
        var p = 1 - i / points.length;
        var ribbonWidth = Math.max(1.2, p * (MAX_WIDTH + v * (isFinePointer ? 0.22 : 0.08)));

        // Color tri-harmonic interpolation
        var colIdx = (Math.floor(colorCycleIndex) + i) % PALETTE.length;
        var col = PALETTE[colIdx];

        // Outer Ethereal Glow
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);

        if (isFinePointer) {
          ctx.shadowBlur = 12 * p;
          ctx.shadowColor = col.hex;
        }

        ctx.lineWidth = ribbonWidth * 1.5;
        ctx.strokeStyle = "rgba(" + col.r + ", " + col.g + ", " + col.b + ", " + (p * 0.45) + ")";
        ctx.stroke();

        // Inner Sharp Radiant Core
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(0.8, ribbonWidth * 0.4);
        ctx.strokeStyle = "rgba(255, 255, 255, " + (p * 0.85) + ")";
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Step & Draw Sparks from Object Pool
    var activeSparkCount = 0;
    for (var s = 0; s < sparkPool.length; s++) {
      var spark = sparkPool[s];
      if (spark.active) {
        spark.step(dt);
        spark.draw(ctx);
        if (spark.active) activeSparkCount++;
      }
    }

    // 3. Check Idle Sleep State
    if (points.length > 0 || activeSparkCount > 0) {
      rafId = requestAnimationFrame(renderLoop);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  // ── PUBLIC API EXPOSURE ──────────────────────────────────────────────────
  global.HermeticCelestialTrail = {
    burst: function (x, y, count) {
      spawnPhiSpiralBurst(x, y, count || 16, 2.0);
      wakeEngine();
    },
    pause: function () {
      documentHidden = true;
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    },
    resume: function () {
      documentHidden = false;
      wakeEngine();
    },
    destroy: function () {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      delete global.HermeticCelestialTrail;
    }
  };

  // Backwards compatibility alias
  global.CelestialTrail = global.HermeticCelestialTrail;

})(typeof window !== "undefined" ? window : this);

