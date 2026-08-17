/**
 * Celestial Space-Liquid Particle & Touch Trail Engine
 * Ultra-smooth, fluid Catmull-Rom spline interpolation & bounded physics.
 * Zero jitter, zero spaz, silky 60FPS fluid motion.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // Prevent duplicate instances
  if (document.getElementById('celestial-cursor-canvas')) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.id = 'celestial-cursor-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  canvas.style.opacity = '0.92';
  document.body.appendChild(canvas);

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const particles = [];
  const points = [];
  const maxPoints = 28;

  const pointers = new Map();
  let hue = 180;

  // Smooth Stardust Spark Particle
  class CosmicSpark {
    constructor(x, y, vx, vy, color, size, life) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.maxLife = life;
      this.life = life;
      this.rotation = Math.random() * Math.PI;
      this.vRot = (Math.random() - 0.5) * 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.rotation += this.vRot;
      this.life--;
    }
    draw(ctx) {
      const progress = this.life / this.maxLife;
      const alpha = Math.sin(progress * Math.PI);
      const rad = Math.max(0.1, this.size * progress);

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = alpha * 0.85;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;

      // 4-point diamond star
      ctx.beginPath();
      ctx.moveTo(0, -rad * 1.6);
      ctx.lineTo(rad * 0.5, 0);
      ctx.lineTo(0, rad * 1.6);
      ctx.lineTo(-rad * 0.5, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  function spawnSparks(x, y, count, baseSpeed) {
    if (particles.length > 90) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 1.8 + 0.4) * (baseSpeed || 1);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const sparkHue = (hue + (Math.random() - 0.5) * 40 + 360) % 360;
      const color = `hsl(${sparkHue}, 100%, 70%)`;
      const size = Math.random() * 4 + 2;
      const life = Math.random() * 20 + 16;
      particles.push(new CosmicSpark(x, y, vx, vy, color, size, life));
    }
  }

  function onPointerMove(id, x, y) {
    pointers.set(id, { x, y, targetX: x, targetY: y, moved: true });
  }

  window.addEventListener('mousemove', (e) => onPointerMove('mouse', e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    for (let i = 0; i < Math.min(e.touches.length, 8); i++) {
      const t = e.touches[i];
      onPointerMove('touch-' + i, t.clientX, t.clientY);
    }
  }, { passive: true });

  window.addEventListener('mousedown', (e) => spawnSparks(e.clientX, e.clientY, 14, 2.2), { passive: true });
  window.addEventListener('touchstart', (e) => {
    for (let i = 0; i < Math.min(e.touches.length, 8); i++) {
      const t = e.touches[i];
      spawnSparks(t.clientX, t.clientY, 10, 2.2);
    }
  }, { passive: true });

  function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);

    hue = (hue + 1.0) % 360;

    pointers.forEach((p, id) => {
      if (p.moved) {
        p.x += (p.targetX - p.x) * 0.45;
        p.y += (p.targetY - p.y) * 0.45;
        points.unshift({ x: p.x, y: p.y, id });
        if (points.length > maxPoints * pointers.size) points.length = maxPoints * pointers.size;

        if (Math.random() < 0.35) spawnSparks(p.x, p.y, 1, 0.8);
      }
    });

    // Draw Smooth Connected Ribbon using Quadratic Bezier curves with velocity-based width
    if (points.length > 2) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const xc = (a.x + b.x) / 2;
        const yc = (a.y + b.y) / 2;
        const progress = 1 - (i / points.length);
        const nodeHue = (hue - i * 5 + 360) % 360;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        const lineWidth = Math.max(1, progress * (14 + velocity * 0.6));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, xc, yc);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer Glow Ribbon
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `hsla(${nodeHue}, 100%, 65%, ${progress * 0.65})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `hsl(${nodeHue}, 100%, 60%)`;
        ctx.stroke();

        // Inner Core Beam
        ctx.lineWidth = Math.max(1, lineWidth * 0.3);
        ctx.strokeStyle = `rgba(255, 255, 255, ${progress * 0.85})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.stroke();

        ctx.restore();
      }
    }

    // Update & Draw Particles with strict bounding
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  render();
})();
