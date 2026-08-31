/**
 * Zoth Studio — Universal Design Libraries & Company Design Systems Engine (v3.0.0)
 * 
 * Provides modular, battle-tested design system libraries for mainstream tech archetypes:
 * 1. Google Material You (Google Material 3 & Cloud Clean)
 * 2. Microsoft Fluent 2 (Mica / Acrylic specular depth & Segoe UI)
 * 3. Apple Cupertino HIG (Continuous Squircle OLED, Glassmorphic SF Pro)
 * 4. OpenAI Slate Minimalist (ChatGPT Zinc & Emerald Phosphor)
 * 5. AWS Cloud Obsidian (High-Density Builder Console & AWS Amber)
 * Plus Sovereign Core: Dark (Midnight Void), Light (Solar Alabaster), Matrix (Phosphor Green), Gold (Hermetic 24K)
 */
(function (global) {
  "use strict";

  const DESIGN_LIBRARIES = {
    "google": {
      id: "google",
      name: "Google Material You",
      brand: "Google",
      version: "3.0.0",
      emoji: "🌐",
      description: "Clean Material 3 elevation, tonal pastel surfaces, signature Google 4-color accents and smooth pill geometry.",
      colors: {
        bg: "#121212",
        bgSurface: "#1e1f20",
        bgElevated: "#28292a",
        bgHighlight: "#303134",
        text: "#f1f3f4",
        textPrimary: "#ffffff",
        textBody: "#e8eaed",
        textSubhead: "#bdc1c6",
        textMuted: "#9aa0a6",
        accent: "#8ab4f8",
        accentGlow: "rgba(138, 180, 248, 0.35)",
        primary: "#1a73e8",
        brandBlue: "#4285f4",
        brandRed: "#ea4335",
        brandYellow: "#fbbc04",
        brandGreen: "#34a853",
        line: "rgba(255, 255, 255, 0.12)",
        lineStrong: "rgba(138, 180, 248, 0.5)",
        borderCard: "rgba(255, 255, 255, 0.08)",
        borderFocus: "#8ab4f8",
        inputBg: "#1f1f1f",
        inputText: "#ffffff",
        codeBg: "#18181b",
        codeText: "#8ab4f8",
        glassBg: "rgba(30, 31, 32, 0.88)",
        phoneBezel: "rgba(138, 180, 248, 0.4)",
        phoneBg: "radial-gradient(ellipse at top, rgba(66, 133, 244, 0.15), transparent 70%), rgba(18, 18, 18, 0.98)"
      },
      typography: {
        fontHeading: ""Google Sans", "Product Sans", "Plus Jakarta Sans", system-ui, sans-serif",
        fontBody: ""Roboto", "Plus Jakarta Sans", system-ui, sans-serif",
        fontMono: ""Roboto Mono", "IBM Plex Mono", monospace",
        headingWeight: "600",
        bodyWeight: "400",
        letterSpacingHeading: "-0.01em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "8px",
        radiusMd: "16px",
        radiusLg: "24px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 1px 3px rgba(0,0,0,0.3)",
        md: "0 4px 14px rgba(0,0,0,0.4)",
        lg: "0 12px 32px rgba(0,0,0,0.6)",
        glow: "0 0 20px rgba(66, 133, 244, 0.35)"
      }
    },

    "microsoft": {
      id: "microsoft",
      name: "Microsoft Fluent 2",
      brand: "Microsoft",
      version: "2.0.0",
      emoji: "🪟",
      description: "Mica & Acrylic translucent specular materials, Segoe UI typography, and refined Windows 11 enterprise geometry.",
      colors: {
        bg: "#0a0d14",
        bgSurface: "#101622",
        bgElevated: "#162032",
        bgHighlight: "#1f2c44",
        text: "#f3f4f6",
        textPrimary: "#ffffff",
        textBody: "#e2e8f0",
        textSubhead: "#cbd5e1",
        textMuted: "#94a3b8",
        accent: "#0078d4",
        accentGlow: "rgba(0, 120, 212, 0.4)",
        primary: "#0078d4",
        brandBlue: "#00a4ef",
        brandOrange: "#f25022",
        brandGreen: "#7fba00",
        brandYellow: "#ffb900",
        line: "rgba(255, 255, 255, 0.08)",
        lineStrong: "rgba(0, 164, 239, 0.5)",
        borderCard: "rgba(255, 255, 255, 0.07)",
        borderFocus: "#00a4ef",
        inputBg: "#0f172a",
        inputText: "#ffffff",
        codeBg: "#080c14",
        codeText: "#38bdf8",
        glassBg: "rgba(16, 22, 34, 0.82)",
        phoneBezel: "rgba(0, 120, 212, 0.45)",
        phoneBg: "radial-gradient(ellipse at top, rgba(0, 120, 212, 0.18), transparent 70%), rgba(10, 13, 20, 0.98)"
      },
      typography: {
        fontHeading: ""Segoe UI", "Plus Jakarta Sans", system-ui, sans-serif",
        fontBody: ""Segoe UI", "Figtree", system-ui, sans-serif",
        fontMono: ""Cascadia Code", "IBM Plex Mono", monospace",
        headingWeight: "600",
        bodyWeight: "400",
        letterSpacingHeading: "-0.015em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "4px",
        radiusMd: "8px",
        radiusLg: "12px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 2px 4px rgba(0,0,0,0.25)",
        md: "0 8px 24px rgba(0,0,0,0.45)",
        lg: "0 16px 40px rgba(0,0,0,0.7)",
        glow: "0 0 24px rgba(0, 120, 212, 0.4)"
      }
    },

    "apple": {
      id: "apple",
      name: "Apple Cupertino HIG",
      brand: "Apple",
      version: "3.0.0",
      emoji: "🍎",
      description: "Ultra-deep OLED Obsidian blacks, continuous squircle curvature, frosted glass backdrop filters, and SF Pro precision.",
      colors: {
        bg: "#000000",
        bgSurface: "#0c0c0e",
        bgElevated: "#1c1c1e",
        bgHighlight: "#2c2c2e",
        text: "#f5f5f7",
        textPrimary: "#ffffff",
        textBody: "#e5e5ea",
        textSubhead: "#aeaeb2",
        textMuted: "#86868b",
        accent: "#0a84ff",
        accentGlow: "rgba(10, 132, 255, 0.35)",
        primary: "#0071e3",
        brandBlue: "#0a84ff",
        brandPurple: "#bf5af2",
        brandTeal: "#64d2ff",
        brandSilver: "#e5e5ea",
        line: "rgba(255, 255, 255, 0.12)",
        lineStrong: "rgba(10, 132, 255, 0.6)",
        borderCard: "rgba(255, 255, 255, 0.10)",
        borderFocus: "#0a84ff",
        inputBg: "#1c1c1e",
        inputText: "#ffffff",
        codeBg: "#050507",
        codeText: "#64d2ff",
        glassBg: "rgba(20, 20, 22, 0.80)",
        phoneBezel: "rgba(255, 255, 255, 0.25)",
        phoneBg: "radial-gradient(ellipse at top, rgba(10, 132, 255, 0.15), transparent 70%), rgba(0, 0, 0, 0.99)"
      },
      typography: {
        fontHeading: ""SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", sans-serif",
        fontBody: ""SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter", sans-serif",
        fontMono: ""SF Mono", "IBM Plex Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "-0.022em",
        letterSpacingBody: "-0.005em"
      },
      geometry: {
        radiusSm: "8px",
        radiusMd: "16px",
        radiusLg: "22px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 2px 8px rgba(0,0,0,0.4)",
        md: "0 12px 30px rgba(0,0,0,0.65)",
        lg: "0 24px 60px rgba(0,0,0,0.85)",
        glow: "0 0 28px rgba(10, 132, 255, 0.35)"
      }
    },

    "openai": {
      id: "openai",
      name: "OpenAI Slate Minimalist",
      brand: "OpenAI",
      version: "2.5.0",
      emoji: "✨",
      description: "ChatGPT dark slate minimalism, hairline zinc borders, crisp modern typography, and electric emerald neural phosphors.",
      colors: {
        bg: "#0d0d0d",
        bgSurface: "#171717",
        bgElevated: "#212121",
        bgHighlight: "#2f2f2f",
        text: "#ececec",
        textPrimary: "#ffffff",
        textBody: "#d1d5db",
        textSubhead: "#9ca3af",
        textMuted: "#8e8ea0",
        accent: "#10a37f",
        accentGlow: "rgba(16, 163, 127, 0.4)",
        primary: "#10a37f",
        brandEmerald: "#10a37f",
        brandMint: "#00a67e",
        brandTeal: "#14b8a6",
        brandZinc: "#2f2f2f",
        line: "rgba(255, 255, 255, 0.09)",
        lineStrong: "rgba(16, 163, 127, 0.55)",
        borderCard: "rgba(255, 255, 255, 0.08)",
        borderFocus: "#10a37f",
        inputBg: "#171717",
        inputText: "#ffffff",
        codeBg: "#09090b",
        codeText: "#34d399",
        glassBg: "rgba(23, 23, 23, 0.90)",
        phoneBezel: "rgba(16, 163, 127, 0.35)",
        phoneBg: "radial-gradient(ellipse at top, rgba(16, 163, 127, 0.15), transparent 70%), rgba(13, 13, 13, 0.98)"
      },
      typography: {
        fontHeading: ""Inter", "Plus Jakarta Sans", -apple-system, sans-serif",
        fontBody: ""Inter", "Plus Jakarta Sans", system-ui, sans-serif",
        fontMono: ""Söhne Mono", "IBM Plex Mono", monospace",
        headingWeight: "600",
        bodyWeight: "400",
        letterSpacingHeading: "-0.015em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "6px",
        radiusMd: "10px",
        radiusLg: "16px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 1px 2px rgba(0,0,0,0.3)",
        md: "0 6px 18px rgba(0,0,0,0.5)",
        lg: "0 16px 36px rgba(0,0,0,0.7)",
        glow: "0 0 20px rgba(16, 163, 127, 0.35)"
      }
    },

    "amazon": {
      id: "amazon",
      name: "AWS Cloud Obsidian",
      brand: "Amazon / AWS",
      version: "2.0.0",
      emoji: "☁️",
      description: "Technical builder console density, deep navy squid ink slate, high-contrast metrics, and radiant AWS amber highlights.",
      colors: {
        bg: "#0b131e",
        bgSurface: "#131f30",
        bgElevated: "#1a293f",
        bgHighlight: "#22354f",
        text: "#f1f5f9",
        textPrimary: "#ffffff",
        textBody: "#e2e8f0",
        textSubhead: "#cbd5e1",
        textMuted: "#879596",
        accent: "#ff9900",
        accentGlow: "rgba(255, 153, 0, 0.4)",
        primary: "#ec7211",
        brandOrange: "#ff9900",
        brandAmber: "#f59e0b",
        brandCyan: "#539fe5",
        brandGreen: "#1d8102",
        line: "rgba(255, 153, 0, 0.2)",
        lineStrong: "rgba(255, 153, 0, 0.7)",
        borderCard: "rgba(255, 153, 0, 0.15)",
        borderFocus: "#ff9900",
        inputBg: "#0f1b2b",
        inputText: "#ffffff",
        codeBg: "#070d14",
        codeText: "#ffb84d",
        glassBg: "rgba(19, 31, 48, 0.90)",
        phoneBezel: "rgba(255, 153, 0, 0.4)",
        phoneBg: "radial-gradient(ellipse at top, rgba(255, 153, 0, 0.18), transparent 70%), rgba(11, 19, 30, 0.98)"
      },
      typography: {
        fontHeading: ""Plus Jakarta Sans", "Inter", system-ui, sans-serif",
        fontBody: ""Inter", "Figtree", system-ui, sans-serif",
        fontMono: ""IBM Plex Mono", "JetBrains Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "-0.01em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "4px",
        radiusMd: "8px",
        radiusLg: "12px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 2px 4px rgba(0,0,0,0.25)",
        md: "0 6px 20px rgba(0,0,0,0.5)",
        lg: "0 14px 36px rgba(0,0,0,0.75)",
        glow: "0 0 22px rgba(255, 153, 0, 0.4)"
      }
    },

    "dark": {
      id: "dark",
      name: "Midnight Void (Zoth Core)",
      brand: "NullAI / Zoth",
      version: "4.0.0",
      emoji: "🌙",
      description: "Deep cosmic obsidian void with electric cyan & ultraviolet nebula emissions.",
      colors: {
        bg: "#05060a",
        bgSurface: "#0e1322",
        bgElevated: "#161e36",
        bgHighlight: "#1f2a4c",
        text: "#f8fafc",
        textPrimary: "#ffffff",
        textBody: "#f1f5f9",
        textSubhead: "#cbd5e1",
        textMuted: "#94a3b8",
        accent: "#00f0ff",
        accentGlow: "rgba(0, 240, 255, 0.35)",
        primary: "#00f0ff",
        brandCyan: "#00f0ff",
        brandViolet: "#a855f7",
        brandGreen: "#34d399",
        brandGold: "#fbbf24",
        line: "rgba(255, 255, 255, 0.12)",
        lineStrong: "rgba(0, 240, 255, 0.5)",
        borderCard: "rgba(0, 240, 255, 0.18)",
        borderFocus: "#00f0ff",
        inputBg: "#090d1a",
        inputText: "#ffffff",
        codeBg: "#050811",
        codeText: "#38bdf8",
        glassBg: "rgba(9, 13, 26, 0.88)",
        phoneBezel: "rgba(0, 240, 255, 0.35)",
        phoneBg: "radial-gradient(ellipse at top, rgba(0, 240, 255, 0.12), transparent 70%), rgba(7, 10, 18, 0.96)"
      },
      typography: {
        fontHeading: ""Fraunces", "Syne", serif",
        fontBody: ""Figtree", "Plus Jakarta Sans", system-ui, sans-serif",
        fontMono: ""IBM Plex Mono", "JetBrains Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "-0.015em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "6px",
        radiusMd: "12px",
        radiusLg: "18px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 2px 6px rgba(0,0,0,0.5)",
        md: "0 8px 24px rgba(0,0,0,0.6)",
        lg: "0 20px 48px rgba(0,0,0,0.8)",
        glow: "0 0 24px rgba(0, 240, 255, 0.35)"
      }
    },

    "light": {
      id: "light",
      name: "Solar Alabaster (Swiss Minimalist)",
      brand: "NullAI / Zoth",
      version: "4.0.0",
      emoji: "☀️",
      description: "Pristine architectural light minimalism, ultra-crisp typography, and warm solar accents.",
      colors: {
        bg: "#f7f9fc",
        bgSurface: "#ffffff",
        bgElevated: "#f0f2f5",
        bgHighlight: "#e4e7eb",
        text: "#1d1d1f",
        textPrimary: "#111827",
        textBody: "#1f2937",
        textSubhead: "#374151",
        textMuted: "#4b5563",
        accent: "#635bff",
        accentGlow: "rgba(99, 91, 255, 0.2)",
        primary: "#635bff",
        brandBlue: "#0071e3",
        brandViolet: "#5e5ce6",
        brandGreen: "#34c759",
        brandGold: "#f56300",
        line: "rgba(10, 37, 64, 0.08)",
        lineStrong: "rgba(99, 91, 255, 0.5)",
        borderCard: "rgba(10, 37, 64, 0.06)",
        borderFocus: "#635bff",
        inputBg: "#ffffff",
        inputText: "#1d1d1f",
        codeBg: "#f4f5f7",
        codeText: "#635bff",
        glassBg: "rgba(255, 255, 255, 0.85)",
        phoneBezel: "rgba(10, 37, 64, 0.1)",
        phoneBg: "#f7f9fc"
      },
      typography: {
        fontHeading: ""Plus Jakarta Sans", "Figtree", system-ui, sans-serif",
        fontBody: ""Plus Jakarta Sans", "Figtree", system-ui, sans-serif",
        fontMono: ""IBM Plex Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "-0.02em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "6px",
        radiusMd: "12px",
        radiusLg: "18px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 1px 3px rgba(10,37,64,0.06)",
        md: "0 4px 14px rgba(10,37,64,0.08)",
        lg: "0 12px 30px rgba(10,37,64,0.12)",
        glow: "0 0 20px rgba(99, 91, 255, 0.25)"
      }
    },

    "matrix": {
      id: "matrix",
      name: "Phosphor Matrix (90s Cyberpunk)",
      brand: "NullAI / Zoth",
      version: "4.0.0",
      emoji: "📟",
      description: "CRT phosphor raster scans, green console telemetry, terminal scanlines, and hacker monospace.",
      colors: {
        bg: "#000000",
        bgSurface: "#000f00",
        bgElevated: "#001f05",
        bgHighlight: "#00330a",
        text: "#d7ffd7",
        textPrimary: "#e8ffe8",
        textBody: "#b6f5b6",
        textSubhead: "#8fe08f",
        textMuted: "#5cb85c",
        accent: "#00ff00",
        accentGlow: "rgba(0, 255, 0, 0.7)",
        primary: "#00ff00",
        brandGreen: "#00ff00",
        brandCyan: "#33ff33",
        brandLime: "#ccff00",
        line: "rgba(0, 255, 0, 0.4)",
        lineStrong: "rgba(0, 255, 0, 0.9)",
        borderCard: "rgba(0, 255, 0, 0.5)",
        borderFocus: "#00ff00",
        inputBg: "#000000",
        inputText: "#00ff00",
        codeBg: "#000000",
        codeText: "#00ff00",
        glassBg: "rgba(0, 10, 0, 0.95)",
        phoneBezel: "rgba(0, 255, 0, 0.8)",
        phoneBg: "radial-gradient(ellipse at top, rgba(0, 255, 0, 0.25), transparent 70%), rgba(0, 5, 0, 0.99)"
      },
      typography: {
        fontHeading: ""Share Tech Mono", "IBM Plex Mono", monospace",
        fontBody: ""IBM Plex Mono", "Share Tech Mono", monospace",
        fontMono: ""Share Tech Mono", "IBM Plex Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "0.04em",
        letterSpacingBody: "0.02em"
      },
      geometry: {
        radiusSm: "2px",
        radiusMd: "4px",
        radiusLg: "8px",
        radiusPill: "4px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 0 6px rgba(0,255,0,0.3)",
        md: "0 0 16px rgba(0,255,0,0.5)",
        lg: "0 0 32px rgba(0,255,0,0.7)",
        glow: "0 0 24px rgba(0, 255, 0, 0.7)"
      }
    },

    "gold": {
      id: "gold",
      name: "Hermetic Gold (24K Alchemy)",
      brand: "NullAI / Zoth",
      version: "4.0.0",
      emoji: "⚗️",
      description: "24K celestial alchemical gold, hermetic serif typography, and amber obsidian depth.",
      colors: {
        bg: "#050300",
        bgSurface: "#0f0a00",
        bgElevated: "#160e00",
        bgHighlight: "#201500",
        text: "#fff8e8",
        textPrimary: "#fff6dc",
        textBody: "#f3e6c4",
        textSubhead: "#e8d5a3",
        textMuted: "#c4a86a",
        accent: "#ffd700",
        accentGlow: "rgba(255, 215, 0, 0.6)",
        primary: "#ffd700",
        brandGold: "#ffd700",
        brandAmber: "#fbbf24",
        brandBronze: "#c4a86a",
        line: "rgba(255, 215, 0, 0.35)",
        lineStrong: "rgba(255, 215, 0, 0.9)",
        borderCard: "rgba(255, 215, 0, 0.45)",
        borderFocus: "#ffd700",
        inputBg: "#050300",
        inputText: "#fffcf0",
        codeBg: "#030200",
        codeText: "#ffe599",
        glassBg: "rgba(8, 5, 0, 0.96)",
        phoneBezel: "rgba(255, 215, 0, 0.6)",
        phoneBg: "radial-gradient(ellipse at top, rgba(255, 215, 0, 0.25), transparent 70%), rgba(5, 3, 0, 0.99)"
      },
      typography: {
        fontHeading: ""Cinzel", "Fraunces", serif",
        fontBody: ""Fraunces", "Figtree", serif",
        fontMono: ""IBM Plex Mono", monospace",
        headingWeight: "700",
        bodyWeight: "400",
        letterSpacingHeading: "0.02em",
        letterSpacingBody: "0em"
      },
      geometry: {
        radiusSm: "6px",
        radiusMd: "12px",
        radiusLg: "18px",
        radiusPill: "9999px",
        borderWidth: "1px"
      },
      shadows: {
        sm: "0 2px 8px rgba(255,215,0,0.15)",
        md: "0 6px 22px rgba(255,215,0,0.28)",
        lg: "0 16px 44px rgba(255,215,0,0.4)",
        glow: "0 0 28px rgba(255, 215, 0, 0.6)"
      }
    }
  };

  const ZothDesignLibraries = {
    VERSION: "3.0.0",
    LIBRARIES: DESIGN_LIBRARIES,

    getLibrary(key) {
      if (!key) return DESIGN_LIBRARIES["dark"];
      const normalized = String(key).toLowerCase().trim();
      return DESIGN_LIBRARIES[normalized] || DESIGN_LIBRARIES["dark"];
    },

    listLibraries() {
      return Object.keys(DESIGN_LIBRARIES).map((key) => {
        const lib = DESIGN_LIBRARIES[key];
        return {
          id: lib.id,
          name: lib.name,
          brand: lib.brand,
          emoji: lib.emoji,
          description: lib.description,
          accent: lib.colors.accent,
          bg: lib.colors.bg
        };
      });
    },

    generateTailwindPreset(key) {
      const lib = this.getLibrary(key);
      return {
        theme: {
          extend: {
            colors: {
              brand: {
                bg: lib.colors.bg,
                surface: lib.colors.bgSurface,
                elevated: lib.colors.bgElevated,
                text: lib.colors.text,
                muted: lib.colors.textMuted,
                accent: lib.colors.accent,
                primary: lib.colors.primary,
                border: lib.colors.borderCard
              }
            },
            fontFamily: {
              heading: [lib.typography.fontHeading],
              body: [lib.typography.fontBody],
              mono: [lib.typography.fontMono]
            },
            borderRadius: {
              sm: lib.geometry.radiusSm,
              md: lib.geometry.radiusMd,
              lg: lib.geometry.radiusLg,
              pill: lib.geometry.radiusPill
            },
            boxShadow: {
              brand: lib.shadows.md,
              glow: lib.shadows.glow
            }
          }
        }
      };
    },

    generateCSSVariables(key) {
      const lib = this.getLibrary(key);
      const c = lib.colors;
      const t = lib.typography;
      const g = lib.geometry;
      const s = lib.shadows;

      return `/* ${lib.name} (${lib.brand}) Design System Tokens */
html[data-theme="${lib.id}"],
html.theme-${lib.id},
body[data-theme="${lib.id}"],
body.theme-${lib.id} {
  --theme-name: "${lib.id}";
  --theme-brand: "${lib.brand}";
  color-scheme: ${lib.id === "light" ? "light" : "dark"};

  --bg: ${c.bg};
  --bg-2: ${c.bgSurface};
  --bg-3: ${c.bgElevated};
  --panel: ${c.glassBg};
  --panel-solid: ${c.bgSurface};
  --surface-card: ${c.bgSurface};
  --surface-elevated: ${c.bgElevated};
  --surface-highlight: ${c.bgHighlight};

  --text: ${c.text};
  --text-primary: ${c.textPrimary};
  --text-body: ${c.textBody};
  --text-subhead: ${c.textSubhead};
  --muted: ${c.textMuted};

  --line: ${c.line};
  --line-strong: ${c.lineStrong};
  --border-card: ${c.borderCard};
  --border-focus: ${c.borderFocus};

  --accent: ${c.accent};
  --accent-glow: ${c.accentGlow};
  --primary: ${c.primary};

  --input-bg: ${c.inputBg};
  --input-text: ${c.inputText};
  --code-bg: ${c.codeBg};
  --code-text: ${c.codeText};
  --glass-bg: ${c.glassBg};
  --phone-bezel: ${c.phoneBezel};
  --phone-bg: ${c.phoneBg};

  --font-theme-heading: ${t.fontHeading};
  --font-theme-body: ${t.fontBody};
  --font-theme-mono: ${t.fontMono};
  --font-display: var(--font-theme-heading);
  --font-sans: var(--font-theme-body);
  --font-mono: var(--font-theme-mono);

  --radius-sm: ${g.radiusSm};
  --radius-md: ${g.radiusMd};
  --radius-lg: ${g.radiusLg};
  --radius-pill: ${g.radiusPill};

  --shadow-sm: ${s.sm};
  --shadow-md: ${s.md};
  --shadow-lg: ${s.lg};
  --shadow-glow: ${s.glow};
}`;
    },

    generateComponentSnippet(key, componentType, options = {}) {
      const lib = this.getLibrary(key);
      const label = options.label || "Action Button";
      const title = options.title || "Component Card";
      const desc = options.desc || "Standard interactive interface element styled with design library tokens.";

      switch (componentType) {
        case "button":
          return `<button class="zoth-btn zoth-btn-${lib.id}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:${lib.geometry.radiusMd};background:${lib.colors.accent};color:#000;font-family:${lib.typography.fontHeading};font-weight:600;border:none;cursor:pointer;box-shadow:${lib.shadows.sm};transition:transform 0.15s ease,box-shadow 0.15s ease;">
  <span>${lib.emoji}</span>
  <span>${label}</span>
</button>`;

        case "card":
          return `<div class="zoth-card zoth-card-${lib.id}" style="padding:24px;border-radius:${lib.geometry.radiusLg};background:${lib.colors.bgSurface};border:1px solid ${lib.colors.borderCard};box-shadow:${lib.shadows.md};color:${lib.colors.text};font-family:${lib.typography.fontBody};">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;color:${lib.colors.accent};font-weight:700;">${lib.brand}</span>
    <span style="font-size:1.2rem;">${lib.emoji}</span>
  </div>
  <h3 style="margin:0 0 8px 0;font-family:${lib.typography.fontHeading};font-size:1.25rem;color:${lib.colors.textPrimary};">${title}</h3>
  <p style="margin:0;color:${lib.colors.textSubhead};font-size:0.95rem;line-height:1.5;">${desc}</p>
</div>`;

        case "badge":
          return `<span class="zoth-badge zoth-badge-${lib.id}" style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:${lib.geometry.radiusPill};background:${lib.colors.bgElevated};border:1px solid ${lib.colors.lineStrong};color:${lib.colors.accent};font-size:0.8rem;font-weight:600;font-family:${lib.typography.fontHeading};">
  <span>${lib.emoji}</span>
  <span>${label}</span>
</span>`;

        default:
          return `<div class="zoth-element" style="color:${lib.colors.text};background:${lib.colors.bgSurface};border-radius:${lib.geometry.radiusMd};padding:16px;">${label}</div>`;
      }
    },

    exportThemePackage(key, format = "json") {
      const lib = this.getLibrary(key);
      if (format === "css") {
        return this.generateCSSVariables(key);
      }
      if (format === "tailwind") {
        return JSON.stringify(this.generateTailwindPreset(key), null, 2);
      }
      if (format === "esm") {
        return `export const theme = ${JSON.stringify(lib, null, 2)};
export default theme;`;
      }
      return JSON.stringify(lib, null, 2);
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ZothDesignLibraries;
  } else {
    global.ZothDesignLibraries = ZothDesignLibraries;
  }
})(typeof window !== "undefined" ? window : globalThis);
