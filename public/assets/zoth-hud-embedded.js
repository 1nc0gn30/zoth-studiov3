/**
 * ⚡ ZOTH STUDIO — CYBERPUNK HUD EMBEDDED WORKSPACE & AUTO-ADAPTER (v5.0 SOVEREIGN)
 * 
 * Auto-adapts any Zoth Studio tool or page when rendered inside the Cyberpunk HUD Stage iframe:
 * 1. Suppresses duplicate navigation bars, marketing headers, and massive hero banners.
 * 2. Expands the workspace to 100% viewport height with zero wasted scroll margin.
 * 3. Synchronizes theme ('dark', 'light', 'matrix', 'gold') in real-time with parent HUD.
 * 4. Adds a floating [ 🎮 LAUNCH IN CYBERPUNK HUD ] badge when opened standalone in a browser.
 */

(function (win, doc) {
  'use strict';

  var isEmbedded = false;
  try {
    isEmbedded = (win.self !== win.top) || win.location.search.indexOf('embed=1') !== -1 || win.location.search.indexOf('hud=1') !== -1;
  } catch (e) {
    isEmbedded = true;
  }

  function applyEmbeddedMode() {
    if (isEmbedded) {
      doc.documentElement.classList.add('hud-embedded-mode');
      if (doc.body) doc.body.classList.add('in-hud', 'hud-embedded-view');

      // Listen for theme sync events from parent HUD
      win.addEventListener('message', function (event) {
        if (event && event.data && event.data.type === 'ZOTH_HUD_THEME_CHANGE') {
          var newTheme = event.data.theme;
          if (newTheme) {
            doc.documentElement.setAttribute('data-theme', newTheme);
            if (doc.body) doc.body.setAttribute('data-theme', newTheme);
            if (win.ZothTheme && win.ZothTheme.setTheme) {
              win.ZothTheme.setTheme(newTheme);
            }
          }
        }
      });

      // Notify parent that tool is mounted
      try {
        if (win.parent && win.parent.postMessage) {
          win.parent.postMessage({
            type: 'ZOTH_TOOL_MOUNTED',
            url: win.location.pathname + win.location.search,
            title: doc.title
          }, '*');
        }
      } catch (e) {}

    } else {
      // Standalone mode: mount floating launcher badge
      mountStandaloneHUDLauncher();
    }
  }

  function mountStandaloneHUDLauncher() {
    if (doc.querySelector('.hud-standalone-launcher-banner')) return;

    var currentPath = win.location.pathname;
    var filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'omnipost.html';
    var toolId = filename.replace('.html', '');

    var banner = doc.createElement('div');
    banner.className = 'hud-standalone-launcher-banner';
    banner.innerHTML = '' +
      '<a href="/studio/cockpit.html?tool=' + encodeURIComponent(toolId) + '" class="hud-launch-cockpit-btn" title="Open this tool inside the Cyberpunk HUD Cockpit">' +
        '<span class="hud-launch-icon">⚡</span>' +
        '<span class="hud-launch-text">OPEN IN CYBERPUNK HUD</span>' +
        '<span class="hud-launch-tag">COCKPIT ➔</span>' +
      '</a>';

    if (doc.body) {
      doc.body.appendChild(banner);
    } else {
      doc.addEventListener('DOMContentLoaded', function () {
        doc.body.appendChild(banner);
      });
    }
  }

  // Run immediately or on DOM ready
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', applyEmbeddedMode);
  } else {
    applyEmbeddedMode();
  }

})(window, document);
