/**
 * Zoth Studio — Design Tokens & Theme Engine (v3.0.0)
 * Supports all 12+ Sovereign Themes and Mainstream Company Design Systems:
 * - Google Material You (Google)
 * - Microsoft Fluent 2 (Microsoft)
 * - Apple Cupertino HIG (Apple)
 * - OpenAI Slate Minimalist (OpenAI)
 * - AWS Cloud Obsidian (Amazon AWS)
 * - Obsidian Gold / Hermetic Alchemy
 * - Midnight Void / Cyber Neon
 * - Acid Matrix Grid / Terminal
 */
(function(global) {
  "use strict";

  const ZothThemeTokens = {
    VERSION: "3.0.0",
    THEMES: {
      // Mainstream Company Design Libraries
      "google": { name: "Google Material You", brand: "Google", bg: "#121212", accent: "#8ab4f8", primary: "#1a73e8", surface: "#1e1f20", emoji: "🌐" },
      "google-material": { name: "Google Material You", brand: "Google", bg: "#121212", accent: "#8ab4f8", primary: "#1a73e8", surface: "#1e1f20", emoji: "🌐" },
      "microsoft": { name: "Microsoft Fluent 2", brand: "Microsoft", bg: "#0a0d14", accent: "#0078d4", primary: "#0078d4", surface: "#101622", emoji: "🪟" },
      "microsoft-fluent": { name: "Microsoft Fluent 2", brand: "Microsoft", bg: "#0a0d14", accent: "#0078d4", primary: "#0078d4", surface: "#101622", emoji: "🪟" },
      "apple": { name: "Apple Cupertino HIG", brand: "Apple", bg: "#000000", accent: "#0a84ff", primary: "#0071e3", surface: "#0c0c0e", emoji: "🍎" },
      "apple-cupertino": { name: "Apple Cupertino HIG", brand: "Apple", bg: "#000000", accent: "#0a84ff", primary: "#0071e3", surface: "#0c0c0e", emoji: "🍎" },
      "openai": { name: "OpenAI Slate Minimalist", brand: "OpenAI", bg: "#0d0d0d", accent: "#10a37f", primary: "#10a37f", surface: "#171717", emoji: "✨" },
      "openai-slate": { name: "OpenAI Slate Minimalist", brand: "OpenAI", bg: "#0d0d0d", accent: "#10a37f", primary: "#10a37f", surface: "#171717", emoji: "✨" },
      "amazon": { name: "AWS Cloud Obsidian", brand: "Amazon", bg: "#0b131e", accent: "#ff9900", primary: "#ec7211", surface: "#131f30", emoji: "☁️" },
      "amazon-aws": { name: "AWS Cloud Obsidian", brand: "Amazon", bg: "#0b131e", accent: "#ff9900", primary: "#ec7211", surface: "#131f30", emoji: "☁️" },

      // Sovereign Core Themes
      "dark": { name: "Midnight Void", brand: "Zoth", bg: "#05060a", accent: "#00f0ff", primary: "#00f0ff", surface: "#0e1322", emoji: "🌙" },
      "light": { name: "Solar Alabaster", brand: "Zoth", bg: "#f7f9fc", accent: "#635bff", primary: "#635bff", surface: "#ffffff", emoji: "☀️" },
      "matrix": { name: "Phosphor Matrix", brand: "Zoth", bg: "#000000", accent: "#00ff00", primary: "#00ff00", surface: "#000f00", emoji: "📟" },
      "gold": { name: "Hermetic Gold", brand: "Zoth", bg: "#050300", accent: "#ffd700", primary: "#ffd700", surface: "#0f0a00", emoji: "⚗️" },

      // Legacy Token Themes
      "obsidian-gold": { name: "Obsidian Gold", bg: "#07080b", accent: "#e8c872", surface: "#0f1117" },
      "midnight-neon": { name: "Midnight Neon", bg: "#030611", accent: "#00f0ff", surface: "#080e22" },
      "acid-grid": { name: "Acid Grid", bg: "#050805", accent: "#34d399", surface: "#091209" },
      "ultraviolet-glass": { name: "Ultraviolet Glass", bg: "#080414", accent: "#c084fc", surface: "#120a24" },
      "retro-terminal": { name: "Retro Terminal", bg: "#0a0d0a", accent: "#4ade80", surface: "#101610" },
      "minimalist-clean": { name: "Minimalist Clean", bg: "#0f1117", accent: "#ffffff", surface: "#1a1f2c" },
      "solar-flare": { name: "Solar Flare", bg: "#0c0704", accent: "#f97316", surface: "#1a0f08" },
      "deep-cyber": { name: "Deep Cyber", bg: "#040714", accent: "#38bdf8", surface: "#081026" },
      "emerald-sanctum": { name: "Emerald Sanctum", bg: "#040d08", accent: "#10b981", surface: "#081810" },
      "crimson-aegis": { name: "Crimson Aegis", bg: "#100507", accent: "#f43f5e", surface: "#200a0f" },
      "arctic-monolith": { name: "Arctic Monolith", bg: "#060a10", accent: "#7dd3fc", surface: "#0d1522" },
      "royal-amethyst": { name: "Royal Amethyst", bg: "#0b0614", accent: "#a855f7", surface: "#160c28" }
    },

    getTailwindTokens(themeKey) {
      const theme = this.THEMES[themeKey] || this.THEMES["dark"] || this.THEMES["obsidian-gold"];
      return {
        theme: {
          extend: {
            colors: {
              brand: {
                bg: theme.bg,
                accent: theme.accent,
                primary: theme.primary || theme.accent,
                surface: theme.surface || theme.bg
              }
            }
          }
        }
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = ZothThemeTokens;
  else global.ZothThemeTokens = ZothThemeTokens;
})(typeof window !== "undefined" ? window : globalThis);
