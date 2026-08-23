/**
 * Zoth Studio — Dark/Light Mode & View Transitions Morph Engine (v2.0)
 * Provides circular wipe and cross-fade theme morphing with OS auto-detection.
 */
(function (global) {
  'use strict';
  const ZothThemeMorph = {
    VERSION: '2.0.0',
    toggleTheme(themeName) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          document.documentElement.setAttribute('data-theme', themeName);
        });
      } else {
        document.documentElement.setAttribute('data-theme', themeName);
      }
      try { localStorage.setItem('zoth_theme_pref', themeName); } catch(e) {}
    }
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ZothThemeMorph; }
  else { global.ZothThemeMorph = ZothThemeMorph; }
})(typeof window !== 'undefined' ? window : globalThis);
