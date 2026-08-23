/**
 * Zoth Studio — Offline PWA & Service Worker Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothPWA = {
    VERSION: '2.0.0',
    generateManifest(name, themeColor = '#05060a') {
      return JSON.stringify({
        name: name,
        short_name: name,
        start_url: '/',
        display: 'standalone',
        background_color: themeColor,
        theme_color: themeColor,
        icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }]
      }, null, 2);
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothPWA;
  else global.ZothPWA = ZothPWA;
})(typeof window !== 'undefined' ? window : globalThis);
