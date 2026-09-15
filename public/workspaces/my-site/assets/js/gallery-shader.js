/**
 * AURUM / V. KESTREL — Tactile Image Gallery ("The Vault")
 * 2.5D Parallax Physics, Fluid Ripple Distortion & Interactive Depth Shader
 */

(function () {
  'use strict';

  class VaultGalleryInteractions {
    constructor() {
      this.cards = document.querySelectorAll('.vault-card');
      if (!this.cards.length) return;

      this.initParallaxTilt();
      this.initRippleShaders();
    }

    initParallaxTilt() {
      this.cards.forEach((card) => {
        const inner = card.querySelector('.vault-card-inner');
        const img = card.querySelector('img');
        const badge = card.querySelector('.vault-badge');

        let bounds;
        let isHovered = false;

        const updateBounds = () => {
          bounds = card.getBoundingClientRect();
        };

        const onMouseEnter = () => {
          isHovered = true;
          updateBounds();
        };

        const onMouseMove = (e) => {
          if (!isHovered || !bounds) return;

          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;

          // Normalize mouse coordinates to [-1, 1]
          const normX = (mouseX / bounds.width) * 2 - 1;
          const normY = (mouseY / bounds.top) * 2 - 1;

          // 2.5D Tilt limits (gentle, editorial feel)
          const rotateX = -normY * 7.5;
          const rotateY = normX * 7.5;

          if (inner) {
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          }

          if (img) {
            // Subtle counter-translation for layered depth parallax
            img.style.transform = `scale(1.08) translate3d(${normX * 8}px, ${normY * 8}px, 20px)`;
          }

          if (badge) {
            badge.style.transform = `translate3d(${normX * 14}px, ${normY * 14}px, 40px)`;
          }
        };

        const onMouseLeave = () => {
          isHovered = false;
          if (inner) {
            inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          }
          if (img) {
            img.style.transform = 'scale(1) translate3d(0, 0, 0)';
          }
          if (badge) {
            badge.style.transform = 'translate3d(0, 0, 0)';
          }
        };

        card.addEventListener('mouseenter', onMouseEnter, { passive: true });
        card.addEventListener('mousemove', onMouseMove, { passive: true });
        card.addEventListener('mouseleave', onMouseLeave, { passive: true });
      });
    }

    initRippleShaders() {
      // Dynamic Canvas Ripple Generator for Canvas/Shader Overlays on Cards
      this.cards.forEach((card) => {
        const canvas = card.querySelector('.ripple-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = card.offsetWidth);
        let height = (canvas.height = card.offsetHeight);
        let ripples = [];
        let animId = null;

        const addRipple = (x, y) => {
          ripples.push({
            x,
            y,
            radius: 0,
            maxRadius: Math.max(width, height) * 0.75,
            alpha: 0.35,
            speed: 3.5
          });

          if (!animId) {
            renderRipples();
          }
        };

        const renderRipples = () => {
          ctx.clearRect(0, 0, width, height);

          for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.radius += r.speed;
            r.alpha *= 0.94;

            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(212, 175, 55, ${r.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Inner cyan micro-ring
            ctx.beginPath();
            ctx.arc(r.x, r.y, Math.max(0, r.radius - 8), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 229, 255, ${r.alpha * 0.6})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();

            if (r.alpha < 0.01 || r.radius > r.maxRadius) {
              ripples.splice(i, 1);
            }
          }

          if (ripples.length > 0) {
            animId = requestAnimationFrame(renderRipples);
          } else {
            animId = null;
          }
        };

        card.addEventListener('mouseenter', (e) => {
          const rect = card.getBoundingClientRect();
          width = canvas.width = card.offsetWidth;
          height = canvas.height = card.offsetHeight;
          addRipple(e.clientX - rect.left, e.clientY - rect.top);
        }, { passive: true });

        card.addEventListener('click', (e) => {
          const rect = card.getBoundingClientRect();
          addRipple(e.clientX - rect.left, e.clientY - rect.top);
        }, { passive: true });
      });
    }
  }

  // Expose globally
  window.VaultGalleryInteractions = VaultGalleryInteractions;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VaultGalleryInteractions());
  } else {
    new VaultGalleryInteractions();
  }
})();
