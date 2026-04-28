# Design Catalog — AstroPlanet Framework

Generated from 37 themes × 81 components

---

## Theme System

**37 themes** available, each with light + dark mode.
Themes define colors, fonts, and surfaces for the entire design system.

### Theme Token Reference

Each theme JSON provides these tokens:
| Token | Light Example | Dark Example | Description |
|-------|--------------|--------------|-------------|
| `bg` | `#f5fbf7` | `#0d1b16` | Page background |
| `text` | `#10281d` | `#d9f2e7` | Body text color |
| `accent` | `#2b9c6b` | `#43c588` | Primary accent / CTAs |
| `surface` | `#e8f5ee` | `#122620` | Card/surface backgrounds |
| `surfaceElevated` | `#ddf0e5` | `#183129` | Elevated surfaces (modals) |
| `border` | `#98d0b2` | `#2f6650` | Border and divider colors |
| `textMuted` | `#365546` | `#9acdb3` | Secondary/muted text |
| `textInverse` | `#ffffff` | `#070f0c` | Text on accent backgrounds |
| `accentContrast` | `#0d3b27` | `#07331f` | Text on accent (readability) |
| `font` | Manrope | Manrope | Primary font family |
| `fontBody` | Manrope | Manrope | Body text font |
| `fontDisplay` | Fraunces | Fraunces | Heading/display font |

### Available Themes

| # | Theme | Mode | Light BG | Light Text | Accent | Surface |
|---|-------|------|----------|------------|--------|---------|
| 1 | `acid-grid` | ☀️+🌙 | `#f3ffe7` | `#18240d` | `#77b600` | `#e8f7d0` |
| 2 | `alpine-charcoal` | ☀️+🌙 | `#f6f8f7` | `#1f2b27` | `#2f8a78` | `#e8eeec` |
| 3 | `arctic-minimal` | ☀️+🌙 | `#f8fcff` | `#12263a` | `#2b8cff` | `#eef6ff` |
| 4 | `aurora-dream` | ☀️+🌙 | `#f5f9ff` | `#1f2740` | `#6e7bff` | `#e9efff` |
| 5 | `brutalist-ink` | ☀️+🌙 | `#f8f8f8` | `#111111` | `#ff3d00` | `#efefef` |
| 6 | `candy-pop` | ☀️+🌙 | `#fff8ff` | `#352048` | `#ff5ea8` | `#ffeefe` |
| 7 | `celestial-violet` | ☀️+🌙 | `#f9f6ff` | `#251645` | `#7d4cff` | `#efe8ff` |
| 8 | `citrus-punch` | ☀️+🌙 | `#fffef3` | `#2b2a14` | `#ff7a00` | `#fff3d8` |
| 9 | `cobalt-amber` | ☀️+🌙 | `#f8fbff` | `#17253a` | `#ff9b2f` | `#eaf1fb` |
| 10 | `copper-slate` | ☀️+🌙 | `#f4f1ee` | `#241d18` | `#b06c43` | `#e8e1da` |
| 11 | `editorial-serene` | ☀️+🌙 | `#fffdf8` | `#2b1f16` | `#a45a3f` | `#f6efe5` |
| 12 | `ember-canyon` | ☀️+🌙 | `#fbf2ea` | `#2f1d14` | `#d8733d` | `#f1e1d3` |
| 13 | `emerald-ink` | ☀️+🌙 | `#f0f8f4` | `#0e2c1f` | `#2d9e73` | `#e3f2ea` |
| 14 | `forest-mist` | ☀️+🌙 | `#f5fbf7` | `#10281d` | `#2b9c6b` | `#e8f5ee` |
| 15 | `glacier-ink` | ☀️+🌙 | `#f6fbff` | `#1a2b3b` | `#2f7dd1` | `#eaf3fb` |
| 16 | `graffiti-3d-burst` | ☀️+🌙 | `#fff7f1` | `#1e1330` | `#ff4ea3` | `#ffeef8` |
| 17 | `graphite-rose` | ☀️+🌙 | `#f7f4f6` | `#231b20` | `#c15781` | `#ece4e9` |
| 18 | `ivory-luxe` | ☀️+🌙 | `#fbf7f0` | `#261f17` | `#a66c2f` | `#efe7d9` |
| 19 | `lagoon-studio` | ☀️+🌙 | `#eefaf8` | `#103033` | `#1aa7a2` | `#dcf2ef` |
| 20 | `liquid-chrome` | ☀️+🌙 | `#eef3f7` | `#16222f` | `#4a8bd9` | `#dde8f2` |
| 21 | `midnight-neon` | ☀️+🌙 | `#edf0ff` | `#131738` | `#4e68ff` | `#dde3ff` |
| 22 | `minty-lab` | ☀️+🌙 | `#f4fffb` | `#13352e` | `#00a87a` | `#e2f9f1` |
| 23 | `mono-zen` | ☀️+🌙 | `#f7f7f7` | `#151515` | `#4f46e5` | `#ebebeb` |
| 24 | `neon-circuit` | ☀️+🌙 | `#f7fbff` | `#0f172a` | `#00b7ff` | `#eaf6ff` |
| 25 | `noir-sakura` | ☀️+🌙 | `#f9f3f6` | `#2b1521` | `#cf4f84` | `#efe1e8` |
| 26 | `nordic-frost` | ☀️+🌙 | `#f2f8ff` | `#11243b` | `#2f7fdf` | `#e7f0fb` |
| 27 | `obsidian-gold` | ☀️+🌙 | `#f5f2eb` | `#1b1a16` | `#b8892d` | `#ece6db` |
| 28 | `oceanic-noir` | ☀️+🌙 | `#f2fbff` | `#0f2d3a` | `#169bb4` | `#e1f4fb` |
| 29 | `pixel-playground` | ☀️+🌙 | `#f4fff5` | `#113511` | `#15b74e` | `#e4fbe7` |
| 30 | `retro-terminal` | ☀️+🌙 | `#f2fff3` | `#0f3a14` | `#00a33a` | `#e4fbe7` |
| 31 | `royal-opera` | ☀️+🌙 | `#fbf8ff` | `#2b1d4a` | `#7f57d8` | `#efe8ff` |
| 32 | `solar-flare` | ☀️+🌙 | `#fff8ee` | `#34170a` | `#ff6b00` | `#ffe9d6` |
| 33 | `sunset-editorial` | ☀️+🌙 | `#fff8f3` | `#3b1c11` | `#f06a3c` | `#ffece1` |
| 34 | `synth-candy` | ☀️+🌙 | `#fef6ff` | `#2e2041` | `#ff4fe1` | `#f6e8ff` |
| 35 | `terracotta-earth` | ☀️+🌙 | `#fff8f2` | `#3a2519` | `#c46a3d` | `#f5e8dd` |
| 36 | `ultraviolet-glass` | ☀️+🌙 | `#f3f1ff` | `#211a4b` | `#6f58f3` | `#e3defa` |
| 37 | `velvet-noir` | ☀️+🌙 | `#fdf8fb` | `#2e1a2d` | `#8b2f6a` | `#f7edf4` |

### Fonts Used

- `'Cabin', sans-serif`
- `'Chakra Petch', sans-serif`
- `'Exo 2', sans-serif`
- `'Figtree', sans-serif`
- `'IBM Plex Mono', monospace`
- `'IBM Plex Sans', sans-serif`
- `'Instrument Sans', sans-serif`
- `'Inter', sans-serif`
- `'Karla', sans-serif`
- `'Lato', sans-serif`
- `'Manrope', sans-serif`
- `'Mulish', sans-serif`
- `'Nunito Sans', sans-serif`
- `'Nunito', sans-serif`
- `'Outfit', sans-serif`
- `'Plus Jakarta Sans', sans-serif`
- `'Quicksand', sans-serif`
- `'Raleway', sans-serif`
- `'Rubik', sans-serif`
- `'Sora', sans-serif`
- `'Source Sans 3', sans-serif`
- `'Space Grotesk', sans-serif`
- `'Space Mono', monospace`
- `'Urbanist', sans-serif`
- `'VT323', monospace`
- `'Work Sans', sans-serif`

---

## Component Library

**81 components** organized by category.

### Components by Category

#### Core (12 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `ConfigPageRenderer` | `src/components/ConfigPageRenderer.astro` | title, description, ogImage, keywords, author | — | 117 |
| `Content` | `src/components/Content.astro` | data | — | 211 |
| `Features` | `src/components/Features.astro` | data, cvariant | Astro.props;, (cvariant ?? data?.cvariant ?? 'default') as FeaturesVariant; | 38 |
| `Footer` | `src/components/Footer.astro` | weight, data, cvariant | Astro.props;, (cvariant ?? footerData?.cvariant ?? 'default') as FooterVariant; | 46 |
| `Form` | `src/components/Form.astro` | data, cvariant | Astro.props;, (cvariant ?? data?.cvariant ?? 'slate') as FormVariant; | 87 |
| `Gallery` | `src/components/Gallery.astro` | data | — | 133 |
| `Hero` | `src/components/Hero.astro` | data, cvariant | Astro.props;, (cvariant ?? data?.cvariant ?? 'default') as HeroVariant; | 83 |
| `Navbar` | `src/components/Navbar.astro` | data, cvariant | Astro.props;, (cvariant ?? navData?.cvariant ?? 'default') as NavbarVariant; | 46 |
| `SectionBreak` | `src/components/SectionBreak.astro` | label | — | 32 |
| `SectionRenderer` | `src/components/SectionRenderer.astro` | wrapperClass, wrapperStyle, containerClass | override.cvariant ?? section.cvariant; | 138 |
| `SocialLinks` | `src/components/SocialLinks.astro` | data, cvariant | Astro.props;, (cvariant ?? data?.cvariant ?? 'default') as SocialVariant; | 38 |
| `UIKit` | `src/components/UIKit.astro` | data, cvariant | Astro.props;, (cvariant ?? data?.cvariant ?? 'buttons') as UIKitVariant; | 102 |

#### features (3 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `FeaturesDefaultGrid` | `src/components/features/FeaturesDefaultGrid.astro` | label, url, variant | — | 170 |
| `FeaturesSplitShowcase` | `src/components/features/FeaturesSplitShowcase.astro` | label, url, variant | — | 176 |
| `FeaturesStepsRail` | `src/components/features/FeaturesStepsRail.astro` | label, url, variant | — | 193 |

#### footers (11 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `FooterAccentBand` | `src/components/footers/FooterAccentBand.astro` | platform, url | — | 101 |
| `FooterCenteredStack` | `src/components/footers/FooterCenteredStack.astro` | platform, url | — | 119 |
| `FooterDefault` | `src/components/footers/FooterDefault.astro` | label, url | — | 196 |
| `FooterDenseLine` | `src/components/footers/FooterDenseLine.astro` | platform, url | — | 123 |
| `FooterDockedPills` | `src/components/footers/FooterDockedPills.astro` | platform, url | — | 105 |
| `FooterFloatingCard` | `src/components/footers/FooterFloatingCard.astro` | platform, url | — | 113 |
| `FooterGlassRow` | `src/components/footers/FooterGlassRow.astro` | platform, url | — | 108 |
| `FooterGridPanel` | `src/components/footers/FooterGridPanel.astro` | platform, url | — | 117 |
| `FooterInlineBar` | `src/components/footers/FooterInlineBar.astro` | platform, url | — | 112 |
| `FooterSplitColumns` | `src/components/footers/FooterSplitColumns.astro` | platform, url | — | 115 |
| `FooterStackedCards` | `src/components/footers/FooterStackedCards.astro` | platform, url | — | 118 |

#### forms (10 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `FormCapsuleInline` | `src/components/forms/FormCapsuleInline.astro` | type, label, placeholder, required | — | 112 |
| `FormGlassFloat` | `src/components/forms/FormGlassFloat.astro` | type, label, placeholder, required | — | 134 |
| `FormMonoStack` | `src/components/forms/FormMonoStack.astro` | type, label, placeholder, required | — | 111 |
| `FormNeonCard` | `src/components/forms/FormNeonCard.astro` | type, label, placeholder, required | — | 159 |
| `FormPanelGrid` | `src/components/forms/FormPanelGrid.astro` | type, label, placeholder, required | — | 125 |
| `FormPaperStack` | `src/components/forms/FormPaperStack.astro` | type, label, placeholder, required | — | 122 |
| `FormQuickInline` | `src/components/forms/FormQuickInline.astro` | type, label, placeholder, required | — | 124 |
| `FormSidebarTicket` | `src/components/forms/FormSidebarTicket.astro` | type, label, placeholder, required | — | 141 |
| `FormSlateSplit` | `src/components/forms/FormSlateSplit.astro` | type, label, placeholder, required | — | 133 |
| `FormUnderlineFlow` | `src/components/forms/FormUnderlineFlow.astro` | type, label, placeholder, required | — | 108 |

#### heros (11 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `HeroAuroraSplit` | `src/components/heros/HeroAuroraSplit.astro` | label, url, variant | — | 435 |
| `HeroCompactLaunchpad` | `src/components/heros/HeroCompactLaunchpad.astro` | label, url, variant | — | 286 |
| `HeroContrastBand` | `src/components/heros/HeroContrastBand.astro` | label, url, variant | — | 289 |
| `HeroDefault` | `src/components/heros/HeroDefault.astro` | label, url, variant | — | 409 |
| `HeroDiagonalSpotlight` | `src/components/heros/HeroDiagonalSpotlight.astro` | label, url, variant | — | 272 |
| `HeroDockedCards` | `src/components/heros/HeroDockedCards.astro` | label, url, variant | — | 306 |
| `HeroEditorialStack` | `src/components/heros/HeroEditorialStack.astro` | label, url, variant | — | 297 |
| `HeroFrameShowcase` | `src/components/heros/HeroFrameShowcase.astro` | label, url, variant | — | 296 |
| `HeroMetricGrid` | `src/components/heros/HeroMetricGrid.astro` | label, url, variant | — | 282 |
| `HeroMosaicPanel` | `src/components/heros/HeroMosaicPanel.astro` | label, url, variant | — | 275 |
| `HeroStepsTimeline` | `src/components/heros/HeroStepsTimeline.astro` | label, url, variant | — | 314 |

#### navbars (12 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `BrandMark` | `src/components/navbars/BrandMark.astro` | name, logoUrl, fallbackIcon | — | 163 |
| `NavbarBoldCTA` | `src/components/navbars/NavbarBoldCTA.astro` | homeUrl | — | 754 |
| `NavbarCenteredBrand` | `src/components/navbars/NavbarCenteredBrand.astro` | homeUrl | — | 438 |
| `NavbarCleanUnderline` | `src/components/navbars/NavbarCleanUnderline.astro` | homeUrl | — | 390 |
| `NavbarDefault` | `src/components/navbars/NavbarDefault.astro` | label, url | — | 753 |
| `NavbarDoubleDecker` | `src/components/navbars/NavbarDoubleDecker.astro` | label, url | — | 663 |
| `NavbarFloatingIsland` | `src/components/navbars/NavbarFloatingIsland.astro` | label, url | — | 616 |
| `NavbarFullWidthMega` | `src/components/navbars/NavbarFullWidthMega.astro` | homeUrl | — | 582 |
| `NavbarGlassmorphism` | `src/components/navbars/NavbarGlassmorphism.astro` | label, url | — | 648 |
| `NavbarIconDriven` | `src/components/navbars/NavbarIconDriven.astro` | homeUrl | — | 412 |
| `NavbarMinimalistSidebar` | `src/components/navbars/NavbarMinimalistSidebar.astro` | homeUrl | — | 468 |
| `NavbarStackedBrand` | `src/components/navbars/NavbarStackedBrand.astro` | homeUrl | — | 448 |

#### social-links (3 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `SocialLinksCompactBar` | `src/components/social-links/SocialLinksCompactBar.astro` | label, url, handle, description, platform | — | 119 |
| `SocialLinksDefault` | `src/components/social-links/SocialLinksDefault.astro` | label, url, handle, description, platform | — | 126 |
| `SocialLinksOrbit` | `src/components/social-links/SocialLinksOrbit.astro` | label, url, handle, description, platform | — | 144 |

#### ui-kit (19 components)

| Component | File | Props | Variants | Lines |
|-----------|------|-------|----------|-------|
| `UIKitBentoShowcase` | `src/components/ui-kit/UIKitBentoShowcase.astro` | data, config | — | 53 |
| `UIKitButtonsMatrix` | `src/components/ui-kit/UIKitButtonsMatrix.astro` | data, config | — | 121 |
| `UIKitButtonsStack` | `src/components/ui-kit/UIKitButtonsStack.astro` | data, config | — | 109 |
| `UIKitCaseStudyDeck` | `src/components/ui-kit/UIKitCaseStudyDeck.astro` | — | — | 47 |
| `UIKitChipsCloud` | `src/components/ui-kit/UIKitChipsCloud.astro` | data, config | — | 119 |
| `UIKitChipsRail` | `src/components/ui-kit/UIKitChipsRail.astro` | data, config | — | 107 |
| `UIKitCommandPanel` | `src/components/ui-kit/UIKitCommandPanel.astro` | — | — | 42 |
| `UIKitComparisonLanes` | `src/components/ui-kit/UIKitComparisonLanes.astro` | — | — | 44 |
| `UIKitFaqAccordion` | `src/components/ui-kit/UIKitFaqAccordion.astro` | data, config | — | 127 |
| `UIKitFeatureMatrix` | `src/components/ui-kit/UIKitFeatureMatrix.astro` | data, config | — | 131 |
| `UIKitGalleryMasonry` | `src/components/ui-kit/UIKitGalleryMasonry.astro` | data, config | — | 128 |
| `UIKitHeroCanvas` | `src/components/ui-kit/UIKitHeroCanvas.astro` | data, config | — | 143 |
| `UIKitLayoutOrchestra` | `src/components/ui-kit/UIKitLayoutOrchestra.astro` | data, config | — | 154 |
| `UIKitLayoutStarters` | `src/components/ui-kit/UIKitLayoutStarters.astro` | data, config | — | 143 |
| `UIKitLogoTicker` | `src/components/ui-kit/UIKitLogoTicker.astro` | data, config | — | 121 |
| `UIKitPricingDeck` | `src/components/ui-kit/UIKitPricingDeck.astro` | data, config | — | 143 |
| `UIKitStatsRibbon` | `src/components/ui-kit/UIKitStatsRibbon.astro` | data, config | — | 114 |
| `UIKitTestimonialsWall` | `src/components/ui-kit/UIKitTestimonialsWall.astro` | data, config | — | 133 |
| `UIKitTimelineCards` | `src/components/ui-kit/UIKitTimelineCards.astro` | data, config | — | 134 |

---

## Quick Reference for Agents

When building a page with AstroPlanet:

1. Choose a **theme** from the table above
2. Set `themeVariant` in your page config to the theme name
3. Compose **sections** using components from the library
4. Each section can specify a `cvariant` for visual variation
5. Set `seo` metadata (title, description, ogImage) in the page config

### Page Config Structure

```json
{
  "weight": 1,
  "themeVariant": "forest-mist",
  "seo": {
    "title": "Page Title (<70 chars)",
    "description": "Meta description (<160 chars)",
    "ogImage": "/assets/og.png",
    "keywords": ["keyword1", "keyword2"]
  },
  "sections": [
    {
      "type": "hero",
      "id": "page-hero",
      "cvariant": "default",
      "heading": "Headline",
      "subtext": "Supporting text",
      "buttons": [...]
    }
  ]
}
```

