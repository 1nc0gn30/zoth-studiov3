/**
 * 🌌 ZOTH STUDIO — THREE.JS & WEBGL MOBILE SAFEGUARD & OVERLAY SUITE (v2.0)
 * Graceful WebGL Error Recovery · Mobile Fullscreen 3D Viewport Launcher · Zero Broken Screens
 */

(function (window, document) {
  'use strict';

  var Zoth3DGuard = {
    isMobile: function () {
      return (
        window.innerWidth <= 768 ||
        document.documentElement.getAttribute('data-device') === 'mobile' ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    },

    checkWebGLSupport: function () {
      try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!(window.WebGLRenderingContext && gl);
      } catch (e) {
        return false;
      }
    },

    renderFallback: function (containerEl, customMessage) {
      if (!containerEl) return;
      var msg = customMessage || 'WebGL Hardware Acceleration Disabled or Context Lost — Operating in 2D Precision Mode.';
      containerEl.innerHTML =
        '<div class="zoth-3d-fallback-box">' +
        '  <span class="zoth-3d-fallback-badge">⚠️ WebGL Fallback Active</span>' +
        '  <div class="zoth-3d-fallback-title">3D Viewport Hardware Acceleration Offline</div>' +
        '  <div class="zoth-3d-fallback-desc">' + msg + '</div>' +
        '</div>';
    },

    attachContextLossHandler: function (canvasEl, onRestore) {
      if (!canvasEl) return;
      canvasEl.addEventListener('webglcontextlost', function (event) {
        event.preventDefault();
        console.warn('[Zoth3DGuard] WebGL context lost on canvas:', canvasEl);
        if (canvasEl.parentElement) {
          Zoth3DGuard.renderFallback(canvasEl.parentElement, 'WebGL Context Lost due to GPU Reset or Memory Pressure. Attempting automatic recovery...');
        }
      }, false);

      canvasEl.addEventListener('webglcontextrestored', function () {
        console.log('[Zoth3DGuard] WebGL context restored on canvas:', canvasEl);
        if (typeof onRestore === 'function') {
          onRestore();
        }
      }, false);
    },

    setupMobileOverlay: function (options) {
      options = options || {};
      var containerEl = typeof options.container === 'string' ? document.getElementById(options.container) : options.container;
      var canvasEl = typeof options.canvas === 'string' ? document.getElementById(options.canvas) : options.canvas;
      var title = options.title || '3D WebGL Immersive Viewport';

      if (!containerEl && !canvasEl) return;

      // Ensure Fullscreen Overlay DOM exists
      var overlayEl = document.getElementById('zoth-3d-fullscreen-overlay');
      if (!overlayEl) {
        overlayEl = document.createElement('div');
        overlayEl.id = 'zoth-3d-fullscreen-overlay';
        overlayEl.className = 'zoth-3d-fullscreen-overlay';
        overlayEl.innerHTML =
          '<div class="zoth-3d-hud-topbar">' +
          '  <div class="zoth-3d-hud-title"><span style="font-size:1.1rem;">🌌</span> <span id="zoth-3d-hud-title-text">' + title + '</span></div>' +
          '  <div class="zoth-3d-hud-badges">' +
          '    <span class="zoth-3d-hud-badge">● 60 FPS</span>' +
          '    <span class="zoth-3d-hud-badge">WEBGL2</span>' +
          '    <button type="button" class="zoth-3d-exit-btn" id="zoth-3d-exit-btn">✕ EXIT 3D VIEW</button>' +
          '  </div>' +
          '</div>' +
          '<div class="zoth-3d-fullscreen-viewport" id="zoth-3d-fullscreen-viewport"></div>' +
          '<div class="zoth-3d-hud-controls">' +
          '  <button type="button" class="zoth-3d-ctrl-btn" onclick="window.Zoth3DGuard && window.Zoth3DGuard.resetCamera && window.Zoth3DGuard.resetCamera()">🎯 Reset View</button>' +
          '  <button type="button" class="zoth-3d-ctrl-btn" onclick="window.Zoth3DGuard && window.Zoth3DGuard.toggleWireframe && window.Zoth3DGuard.toggleWireframe()">🕸️ Wireframe</button>' +
          '  <button type="button" class="zoth-3d-ctrl-btn" id="zoth-3d-exit-btn-bottom">✕ Exit View</button>' +
          '</div>';
        document.body.appendChild(overlayEl);

        var exitHandler = function () {
          Zoth3DGuard.closeFullscreenOverlay();
        };

        var exitBtn = document.getElementById('zoth-3d-exit-btn');
        var exitBtnBtm = document.getElementById('zoth-3d-exit-btn-bottom');
        if (exitBtn) exitBtn.addEventListener('click', exitHandler);
        if (exitBtnBtm) exitBtnBtm.addEventListener('click', exitHandler);
      }

      // If on Mobile, inject Mobile Launch Card into container
      if (Zoth3DGuard.isMobile() && containerEl) {
        var launchCardId = 'zoth-mobile-launch-card-' + (containerEl.id || Math.random().toString(36).substring(2, 6));
        if (!document.getElementById(launchCardId)) {
          var cardHtml =
            '<div class="zoth-3d-mobile-launch-card" id="' + launchCardId + '">' +
            '  <div class="zoth-3d-mobile-launch-title"><span>🌌</span> ' + title + '</div>' +
            '  <button type="button" class="zoth-3d-mobile-launch-btn">🌌 LAUNCH FULLSCREEN 3D VIEWPORT</button>' +
            '</div>';
          
          var tempWrap = document.createElement('div');
          tempWrap.innerHTML = cardHtml;
          var cardEl = tempWrap.firstElementChild;
          containerEl.appendChild(cardEl);

          var launchBtn = cardEl.querySelector('.zoth-3d-mobile-launch-btn');
          if (launchBtn) {
            launchBtn.addEventListener('click', function () {
              Zoth3DGuard.openFullscreenOverlay({
                container: containerEl,
                canvas: canvasEl,
                title: title,
                onResize: options.onResize
              });
            });
          }
        }
      }
    },

    openFullscreenOverlay: function (options) {
      options = options || {};
      var overlayEl = document.getElementById('zoth-3d-fullscreen-overlay');
      var viewportEl = document.getElementById('zoth-3d-fullscreen-viewport');
      var titleTextEl = document.getElementById('zoth-3d-hud-title-text');

      if (!overlayEl || !viewportEl) return;

      if (titleTextEl && options.title) {
        titleTextEl.textContent = options.title;
      }

      var canvasEl = typeof options.canvas === 'string' ? document.getElementById(options.canvas) : options.canvas;
      if (canvasEl) {
        // Store original parent to restore later
        if (!canvasEl.__origParent) {
          canvasEl.__origParent = canvasEl.parentElement;
          canvasEl.__origNext = canvasEl.nextSibling;
        }
        viewportEl.appendChild(canvasEl);
      }

      overlayEl.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      // Dispatch window resize so Three.js camera/renderer updates aspect ratio
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
        if (typeof options.onResize === 'function') {
          options.onResize();
        }
      }, 50);
    },

    closeFullscreenOverlay: function () {
      var overlayEl = document.getElementById('zoth-3d-fullscreen-overlay');
      var viewportEl = document.getElementById('zoth-3d-fullscreen-viewport');
      if (!overlayEl || !viewportEl) return;

      overlayEl.classList.remove('is-active');
      document.body.style.overflow = '';

      var canvasEl = viewportEl.querySelector('canvas');
      if (canvasEl && canvasEl.__origParent) {
        if (canvasEl.__origNext) {
          canvasEl.__origParent.insertBefore(canvasEl, canvasEl.__origNext);
        } else {
          canvasEl.__origParent.appendChild(canvasEl);
        }
      }

      setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  };

  window.Zoth3DGuard = Zoth3DGuard;

  // Auto-init fallback checks on load
  document.addEventListener('DOMContentLoaded', function () {
    if (!Zoth3DGuard.checkWebGLSupport()) {
      console.warn('[Zoth3DGuard] Hardware WebGL unavailable. Fallback badges armed.');
    }
  });

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : this);
