# Z0TH Studio — Multi-Agent Website Builder

## Purpose
Interactive dashboard for planning and generating websites using AI agents. Select an agent (Codex, Hermes, OpenClaw, or Custom), answer guided questions, and get a master blueprint to hand off to a build agent.

## How It Works
1. **Select Agent** — Choose from 3 specialized agents or create a custom agent with skills
2. **Choose Framework** — Pick from 10 framework options (Astro, Vite+React, Next.js, etc.)
3. **Discovery Chat** — Agent asks 3 core questions with intelligent follow-ups
4. **Master Artifacts** — Agent generates a Master Prompt, Master Instructions, and Master Blueprint
5. **Export** — Copy artifacts or export as .txt, then hand to the build agent

## Key Files
- `src/pages/index.astro` — Dashboard entry point
- `src/components/AgentDashboard.astro` — Full interactive dashboard (no framework deps)
- `src/configs/navigation.json` — Nav config
- `src/configs/site.json` — Site branding config

## Asset Library
- `public/assets/default-library/` — Icons, logos, illustrations, patterns, lottie, 3D assets
- `public/assets/logo.svg` — Brand logo

## Reusable Components
- `src/components/` — Hero, Features, Gallery, CTA, FAQ, Pricing, Testimonials, etc.
- `src/configs/themes/` — 38+ theme variants
- `src/configs/ui-kit/` — Prebuilt UI kit configs (buttons, chips, galleries, etc.)

## Development
```bash
npm run dev    # Start dev server
npm run build  # Build static site
npm run preview # Preview build
```

## API (via orchestrator)
- Dashboard handles all planning interactively via client-side JS
- Build agent runs separately via terminal commands
