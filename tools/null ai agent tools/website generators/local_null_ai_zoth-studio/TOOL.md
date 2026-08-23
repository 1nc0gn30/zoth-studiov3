# Z0TH Studio — Multi-Agent Website Builder

## Purpose
Interactive dashboard for planning and generating websites using AI agents. Select an agent (Codex, Hermes, OpenClaw, or Custom), answer guided questions, and get master artifacts (Master Prompt / Instructions / Blueprint) to hand off to a build agent. Client-side only — no backend.

## How It Works
1. **Select Agent** — Choose from 3 specialized agents or create a custom agent with skills
2. **Choose Framework** — Pick from 10 framework options (Astro, Vite+React, Next.js, etc.)
3. **Discovery Chat** — Agent asks 3 core questions with intelligent follow-ups
4. **Master Artifacts** — Generates Master Prompt, Master Instructions, and Master Blueprint
5. **Export** — Copy artifacts or export as .txt, then hand to the build agent

## Key Files (actual, verified 2026-08)
- `src/pages/index.astro` — the entire dashboard ("v3.0 Ultra"), self-contained (~1,300 lines). Imports no components.
- `package.json` — astro ^5 + lucide-static only
- `astro.config.mjs` — static output to `./dist`

## Unwired Asset Library (available but NOT imported by index.astro)
- `src/components/` — Hero, Features, Gallery, CTA, FAQ, Pricing, Testimonials, etc.
- `src/configs/themes/` — theme variants
- `src/configs/ui-kit/` — prebuilt UI kit configs
- `public/assets/default-library/` — icons, logos, illustrations, patterns

These are raw material for future builds; the live page does not reference them.

## Development
```bash
npm run dev      # dev server
npm run build    # static build -> ./dist (verified working)
npm run preview  # preview build
```

## API (via orchestrator)
- Dashboard handles all planning interactively via client-side JS
- Build agent runs separately via terminal commands
