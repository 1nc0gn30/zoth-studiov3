---
type: design_system
title: Zoth Studio Design System & Visual Engine
status: active
tags: #design-system #ui-ux #glassmorphism #cyberpunk #css
last_updated: 2026-08-03
---

# 🎨 Zoth Studio Design System & Visual Engine

> Visual aesthetic guidelines, UI design tokens, glassmorphism rules, and media generation standards for **Zoth Studio** and generated web applications.

---

## 🎨 Color Palette & Design Tokens

Zoth Studio uses a dark mode, high-contrast, cyberpunk glassmorphism visual aesthetic:

```css
:root {
  /* Surface Colors */
  --bg-dark: #07090e;
  --bg-surface: #0e121b;
  --bg-glass: rgba(14, 18, 27, 0.75);
  --border-glass: rgba(255, 255, 255, 0.12);

  /* Primary Cyberpunk Accents */
  --accent-cyan: #00f2fe;     /* Primary Tech Glow */
  --accent-magenta: #ff007f;  /* Powerhouse Agent Glow */
  --accent-green: #00ff87;    /* Verified / Success Glow */
  --accent-amber: #ffaa00;    /* Warning / Action Glow */
  --accent-purple: #9d4edd;   /* Media / Generative Studio */

  /* Text Colors */
  --text-main: #f0f4fc;
  --text-muted: #8a99b5;
  --text-glow: rgba(0, 242, 254, 0.4);

  /* Glassmorphism Filters */
  --blur-glass: blur(16px);
  --shadow-neon: 0 0 20px rgba(0, 242, 254, 0.25);
}
```

---

## 📐 Typography Hierarchy

- **Headings & Titles**: `Outfit`, `Inter`, or `Orbitron` (Sans-Serif, High Precision, Futuristic).
- **Body & Controls**: `Inter` or `System-UI` (Clean readability at small scale).
- **Code & Terminals**: `Fira Code` or `JetBrains Mono` (Monospaced with ligatures).

---

## 💎 UI Component Tokens

### 1. Cybernetic Glass Card
```css
.zoth-card {
  background: var(--bg-glass);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoth-card:hover {
  border-color: var(--accent-cyan);
  box-shadow: var(--shadow-neon);
  transform: translateY(-2px);
}
```

### 2. Glowing Status Badge
```css
.zoth-badge-active {
  background: rgba(0, 255, 135, 0.15);
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 0 10px rgba(0, 255, 135, 0.3);
}
```

---

## 🖼️ Media Generation Prompt Standards

When generating visual assets for projects, categories, or banners in Zoth Studio, follow this prompt structure:

> `"Sleek cyberpunk visual cover representing [Topic/Category]: [Core Concepts]. Futuristic glassmorphism interface, glowing holographic HUD elements, neon cyan (#00f2fe), magenta (#ff007f), and emerald green (#00ff87) ambient lights, dark technical background, high resolution, 8k, ultra detailed, state of the art UI."`

---

## 🌐 Web Generator Aesthetic Rules

1. **Never use browser default styles**: Always load custom typography from Google Fonts (`Inter`, `Outfit`).
2. **Glassmorphism everywhere**: Use `backdrop-filter: blur(12px)` for headers, floating controls, and modals.
3. **Interactive Micro-animations**: Hover states must include smooth scaling, glow intensification, or subtle border pulses.
4. **Dark Mode First**: Default to sleek dark mode with vibrant neon accents rather than plain stark white backgrounds.
