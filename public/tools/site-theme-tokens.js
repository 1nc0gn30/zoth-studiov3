/**
 * Zoth Studio — Design Tokens & 12 Theme Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothThemeTokens = {
    VERSION: '2.0.0',
    THEMES: {
      'obsidian-gold': { name: 'Obsidian Gold', bg: '#07080b', accent: '#e8c872' },
      'midnight-neon': { name: 'Midnight Neon', bg: '#030611', accent: '#00f0ff' },
      'acid-grid': { name: 'Acid Grid', bg: '#050805', accent: '#34d399' },
      'ultraviolet-glass': { name: 'Ultraviolet Glass', bg: '#080414', accent: '#c084fc' },
      'retro-terminal': { name: 'Retro Terminal', bg: '#0a0d0a', accent: '#4ade80' },
      'minimalist-clean': { name: 'Minimalist Clean', bg: '#0f1117', accent: '#ffffff' },
      'solar-flare': { name: 'Solar Flare', bg: '#0c0704', accent: '#f97316' },
      'deep-cyber': { name: 'Deep Cyber', bg: '#040714', accent: '#38bdf8' },
      'emerald-sanctum': { name: 'Emerald Sanctum', bg: '#040d08', accent: '#10b981' },
      'crimson-aegis': { name: 'Crimson Aegis', bg: '#100507', accent: '#f43f5e' },
      'arctic-monolith': { name: 'Arctic Monolith', bg: '#060a10', accent: '#7dd3fc' },
      'royal-amethyst': { name: 'Royal Amethyst', bg: '#0b0614', accent: '#a855f7' }
    },
    getTailwindTokens(themeKey) {
      const theme = this.THEMES[themeKey] || this.THEMES['obsidian-gold'];
      return {
        theme: {
          extend: {
            colors: {
              brand: { bg: theme.bg, accent: theme.accent }
            }
          }
        }
      };
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothThemeTokens;
  else global.ZothThemeTokens = ZothThemeTokens;
})(typeof window !== 'undefined' ? window : globalThis);
