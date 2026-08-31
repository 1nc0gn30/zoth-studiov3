/**
 * ⚡ Zoth Studio — Glassmorphic Floating HUD Dock & Quick-Switch Matrix (v1.0)
 * Features macOS-style spring magnification, live tooltips, audio feedback,
 * scroll auto-hide, hotkey (Alt+D), and instant workstation launching.
 */
(function () {
  'use strict';

  if (window.__ZOTH_DOCK_LOADED__) return;
  window.__ZOTH_DOCK_LOADED__ = true;

  var DOCK_TOOLS = [
    { id: 'home', icon: '⚡', label: 'Zoth Home', desc: 'Homepage & Hero Matrix', href: '/' },
    { id: 'cockpit', icon: '🪐', label: 'The Cockpit', desc: '21-Agent Autonomous Swarm', href: '/studio/cockpit.html' },
    { id: 'consensus', icon: '⚔️', label: 'Consensus Arena', desc: '3-Agent Debate & AST Synthesis', href: '/studio/consensus.html' },
    { id: 'webgen', icon: '⚡', label: 'WebGen Studio', desc: 'PTY Terminal & Website Foundry', href: '/studio/webgen.html' },
    { id: 'nexus3d', icon: '📐', label: 'Nexus 3D', desc: 'CAD-Grade 3D Omniverse Viewport', href: '/studio/nexus-3d.html' },
    { id: 'omnipost', icon: '🎬', label: 'OmniPost Video', desc: '60 FPS Social Video & Motion Studio', href: '/studio/omnipost.html' },
    { id: 'swarm', icon: '🌐', label: '3D Swarm Arena', desc: 'Kinetic WebGL Battle Arena', href: '/studio/swarm.html' },
    { id: 'vault', icon: '🔐', label: 'Sovereign Vault', desc: 'Argon2id Secrets & Keyrings', href: '/vault/' },
    { id: 'web3', icon: '🪙', label: 'Web3 Solana', desc: 'DeFi Hub, Live SOL Ticker & Matrix', href: '/studio/web3-hub.html' },
    { id: 'divider', isDivider: true },
    { id: 'annotate', icon: '✏️', label: 'Annotator', desc: 'Visual On-Screen Feedback (Shift+A)', action: 'annotate' },
    { id: 'palette', icon: '🔍', label: 'Command Hub', desc: 'Global Command Palette (Ctrl+K)', action: 'palette' },
    { id: 'theme', icon: '🎨', label: 'Visual Theme', desc: 'Cycle 16 Themes (Shift+T)', action: 'theme' }
  ];

  function mountDock() {
    if (document.getElementById('zoth-floating-dock')) return;

    var dockWrap = document.createElement('div');
    dockWrap.id = 'zoth-floating-dock';
    dockWrap.className = 'zoth-dock-wrap';
    dockWrap.setAttribute('role', 'toolbar');
    dockWrap.setAttribute('aria-label', 'Zoth Studio Floating Workstation Dock');

    var currentPath = (window.location.pathname || '/').replace(/index\.html$/, '');
    if (!currentPath.endsWith('/')) currentPath += '/';

    var itemsHtml = DOCK_TOOLS.map(function (item) {
      if (item.isDivider) {
        return '<div class="dock-divider"></div>';
      }

      var isActive = false;
      if (item.href) {
        var hrefNorm = item.href.replace(/index\.html$/, '');
        if (!hrefNorm.endsWith('/') && !hrefNorm.includes('.')) hrefNorm += '/';
        isActive = hrefNorm === currentPath || (currentPath !== '/' && hrefNorm.length > 2 && currentPath.startsWith(hrefNorm));
      }

      return [
        '<button type="button" class="dock-item' + (isActive ? ' active' : '') + '" data-dock-id="' + item.id + '"' + (item.href ? ' data-href="' + item.href + '"' : '') + ' aria-label="' + item.label + '">',
        '  <span class="dock-icon">' + item.icon + '</span>',
        '  <span class="dock-tooltip">',
        '    <strong>' + item.label + '</strong>',
        '    <small>' + item.desc + '</small>',
        '  </span>',
        isActive ? '  <span class="dock-active-dot"></span>' : '',
        '</button>'
      ].join('');
    }).join('');

    dockWrap.innerHTML = [
      '<div class="dock-container">',
      '  <div class="dock-inner">',
      itemsHtml,
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(dockWrap);

    // Event delegation for dock clicks
    dockWrap.addEventListener('click', function (e) {
      var itemBtn = e.target.closest('.dock-item');
      if (!itemBtn) return;
      e.preventDefault();

      var dockId = itemBtn.getAttribute('data-dock-id');
      var href = itemBtn.getAttribute('data-href');

      if (window.ZothAudioFX) {
        window.ZothAudioFX.playClick(800, 0.08, 'sine');
      }

      if (href) {
        window.location.href = href;
      } else if (dockId === 'annotate') {
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === 'function') {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement('script');
          annotScript.src = '/assets/zoth-annotator.js';
          annotScript.onload = function () {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
      } else if (dockId === 'palette') {
        if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === 'function') {
          window.ZothWorkbench.openPalette();
        } else {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
        }
      } else if (dockId === 'theme') {
        if (window.cycleZothTheme) {
          window.cycleZothTheme();
        }
      }
    });

    // Spring magnification effect on mouse movement
    var dockInner = dockWrap.querySelector('.dock-inner');
    if (dockInner) {
      dockInner.addEventListener('mousemove', function (e) {
        var items = dockInner.querySelectorAll('.dock-item');
        var mouseX = e.clientX;

        items.forEach(function (item) {
          var rect = item.getBoundingClientRect();
          var itemCenter = rect.left + rect.width / 2;
          var distance = Math.abs(mouseX - itemCenter);
          var maxDist = 120;

          if (distance < maxDist) {
            var scale = 1 + 0.35 * Math.cos((distance / maxDist) * (Math.PI / 2));
            item.style.transform = 'scale(' + scale.toFixed(3) + ') translateY(-' + ((scale - 1) * 16).toFixed(1) + 'px)';
          } else {
            item.style.transform = 'scale(1) translateY(0)';
          }
        });
      });

      dockInner.addEventListener('mouseleave', function () {
        dockInner.querySelectorAll('.dock-item').forEach(function (item) {
          item.style.transform = 'scale(1) translateY(0)';
        });
      });
    }

    // Scroll auto-hide logic
    var lastScrollY = window.scrollY;
    window.addEventListener('scroll', function () {
      var currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 150) {
        dockWrap.classList.add('dock-hidden');
      } else {
        dockWrap.classList.remove('dock-hidden');
      }
      lastScrollY = currentY;
    }, { passive: true });

    // Keyboard shortcut: Alt+D to toggle dock
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        dockWrap.classList.toggle('dock-collapsed');
        if (window.ZothAudioFX) window.ZothAudioFX.playClick(600, 0.05);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountDock);
  } else {
    mountDock();
  }
})();
