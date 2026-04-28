# Local Null AI Tool Enhancement Plan

Generated: 2026-04-25T17:08:57.144325+00:00
Tools assessed: 47

## Operating Rules

- Work in `local_null_ai_*` folders first; leave original folders alone.
- Consolidate behavior before consolidating code: shared manifests, adapters, run logs, and report schemas first.
- For security tools, require authorization/scope notes before active scan, exploitation, or disruption workflows are agent-callable.
- Every hardened tool should expose purpose, commands, inputs, outputs, logs, and validation.

## Priority Queue

### local_null_ai_crypt0-extract

- Path: `cybersecurity/churchofmalware/local_null_ai_crypt0-extract`
- Category: Security Operations
- Runtimes: unknown
- Score: 31 (needs-inventory)
- Action: Add a TOOL.md that identifies how this tool should run locally.
- Action: Expose one predictable local entrypoint or document why this is data/config only.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_REAPER-github secrets scanner_exploiter

- Path: `cybersecurity/churchofmalware/local_null_ai_REAPER-github secrets scanner_exploiter`
- Category: Security Operations
- Runtimes: unknown
- Score: 31 (needs-inventory)
- Action: Add a TOOL.md that identifies how this tool should run locally.
- Action: Expose one predictable local entrypoint or document why this is data/config only.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_skills-for-codex

- Path: `house-of-skills/local_null_ai_skills-for-codex`
- Category: Agent Skills
- Runtimes: unknown
- Score: 34 (needs-inventory)
- Action: Add a TOOL.md that identifies how this tool should run locally.
- Action: Expose one predictable local entrypoint or document why this is data/config only.

### local_null_ai_newlistingsinvb

- Path: `seo/local_null_ai_newlistingsinvb`
- Category: SEO Intelligence
- Runtimes: unknown
- Score: 63 (needs-contract)
- Action: Add a TOOL.md that identifies how this tool should run locally.

### local_null_ai_codex_agent

- Path: `cybersecurity/local_null_ai_codex_agent`
- Category: Security Operations
- Runtimes: node, python, vite
- Score: 70 (needs-contract)
- Action: Surface nested package scripts in TOOL.md or add a wrapper command.
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_netlify-dev-hub

- Path: `cybersecurity/local_null_ai_netlify-dev-hub`
- Category: Security Operations
- Runtimes: node, python, vite
- Score: 70 (needs-contract)
- Action: Surface nested package scripts in TOOL.md or add a wrapper command.
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_Netlify-Ghost-Hub

- Path: `cybersecurity/local_null_ai_Netlify-Ghost-Hub`
- Category: Security Operations
- Runtimes: node, python, vite
- Score: 70 (needs-contract)
- Action: Surface nested package scripts in TOOL.md or add a wrapper command.
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_nullai_001

- Path: `cybersecurity/local_null_ai_nullai_001`
- Category: Security Operations
- Runtimes: node, python, vite
- Score: 70 (needs-contract)
- Action: Surface nested package scripts in TOOL.md or add a wrapper command.
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_backdoor_detector

- Path: `cybersecurity/churchofmalware/local_null_ai_backdoor_detector`
- Category: Security Operations
- Runtimes: python
- Score: 75 (needs-contract)
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_Cerberus_pentest_exploit

- Path: `cybersecurity/churchofmalware/local_null_ai_Cerberus_pentest_exploit`
- Category: Security Operations
- Runtimes: python
- Score: 75 (needs-contract)
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_cloudTOWN_cloudEXPLOITS

- Path: `cybersecurity/churchofmalware/local_null_ai_cloudTOWN_cloudEXPLOITS`
- Category: Security Operations
- Runtimes: python
- Score: 78 (needs-contract)
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_pixelz

- Path: `media generators/local_null_ai_pixelz`
- Category: Media Generation
- Runtimes: unknown
- Score: 79 (needs-contract)
- Action: Add a TOOL.md that identifies how this tool should run locally.

### local_null_ai_skillz

- Path: `house-of-skills/local_null_ai_skillz`
- Category: Agent Skills
- Runtimes: unknown
- Score: 79 (needs-contract)
- Action: Add a TOOL.md that identifies how this tool should run locally.

### local_null_ai_convertor

- Path: `script generators/09-utilities-and-data-apps/local_null_ai_convertor`
- Category: Automation & Builders
- Runtimes: python
- Score: 81 (ready-for-hardening)
- Action: Add a smoke-test command that does not require network or privileged access.

### local_null_ai_streamlitapps

- Path: `script generators/local_null_ai_streamlitapps`
- Category: Automation & Builders
- Runtimes: python, streamlit
- Score: 81 (ready-for-hardening)
- Action: Add a smoke-test command that does not require network or privileged access.

### local_null_ai_video-editor

- Path: `media generators/local_null_ai_video-editor`
- Category: Media Generation
- Runtimes: python
- Score: 86 (ready-for-hardening)
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.

### local_null_ai_ghostmode_weponized_QRcodes

- Path: `cybersecurity/churchofmalware/local_null_ai_ghostmode_weponized_QRcodes`
- Category: Security Operations
- Runtimes: python
- Score: 91 (ready-for-hardening)
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.
- Action: Add explicit authorization/scope notes before exposing active scan or exploit commands to agents.

### local_null_ai_neonevents

- Path: `website generators/astroplanet-with-codex/local_null_ai_neonevents`
- Category: Website Generation
- Runtimes: astro, frontend, node
- Score: 92 (ready-for-hardening)

### local_null_ai_nona

- Path: `website generators/astroplanet-with-codex/local_null_ai_nona`
- Category: Website Generation
- Runtimes: astro, frontend, node
- Score: 92 (ready-for-hardening)

### local_null_ai_astro-for-ai

- Path: `website generators/astroplanet-with-codex/local_null_ai_astro-for-ai`
- Category: Website Generation
- Runtimes: astro, frontend, node, python
- Score: 94 (ready-for-hardening)
- Action: Document Python setup path if dependencies live in a nested folder.
- Action: Add a smoke-test command that does not require network or privileged access.

## Consolidation Candidates

### Site ops and Netlify control planes

- Candidate tools: 4
- Strategy: Do not merge code first. Share a common adapter for site inventory, health checks, deploy logs, and agent-safe command recipes.
- `local_null_ai_ghostmode_weponized_QRcodes` -> `cybersecurity/churchofmalware/local_null_ai_ghostmode_weponized_QRcodes`
- `local_null_ai_netlify-dev-hub` -> `cybersecurity/local_null_ai_netlify-dev-hub`
- `local_null_ai_Netlify-Ghost-Hub` -> `cybersecurity/local_null_ai_Netlify-Ghost-Hub`
- `local_null_ai_host-&-build-directory` -> `script generators/04-devtools-and-builder-tools/local_null_ai_host-&-build-directory`

### Agent and app builders

- Candidate tools: 8
- Strategy: Keep products separate, consolidate manifest format, project templates, local run contract, and export/build validation.
- `local_null_ai_ai-agent-ui-gallery` -> `script generators/04-devtools-and-builder-tools/local_null_ai_ai-agent-ui-gallery`
- `local_null_ai_nexus-3d-editor` -> `script generators/04-devtools-and-builder-tools/local_null_ai_nexus-3d-editor`
- `local_null_ai_one-shot` -> `script generators/04-devtools-and-builder-tools/local_null_ai_one-shot`
- `local_null_ai_nexus` -> `script generators/local_null_ai_nexus`
- `local_null_ai_packageforge-ai` -> `script generators/local_null_ai_packageforge-ai`
- `local_null_ai_signalnest` -> `script generators/local_null_ai_signalnest`
- `local_null_ai_astro-for-ai` -> `website generators/astroplanet-with-codex/local_null_ai_astro-for-ai`
- `local_null_ai_lumina-builder` -> `website generators/local_null_ai_lumina-builder`

### Security operations utilities

- Candidate tools: 7
- Strategy: Keep separate until each has scope controls. Consolidate shared evidence folders, target authorization notes, and report output format first.
- `local_null_ai_backdoor_detector` -> `cybersecurity/churchofmalware/local_null_ai_backdoor_detector`
- `local_null_ai_Cerberus_pentest_exploit` -> `cybersecurity/churchofmalware/local_null_ai_Cerberus_pentest_exploit`
- `local_null_ai_cloudTOWN_cloudEXPLOITS` -> `cybersecurity/churchofmalware/local_null_ai_cloudTOWN_cloudEXPLOITS`
- `local_null_ai_crypt0-extract` -> `cybersecurity/churchofmalware/local_null_ai_crypt0-extract`
- `local_null_ai_ghostmode_weponized_QRcodes` -> `cybersecurity/churchofmalware/local_null_ai_ghostmode_weponized_QRcodes`
- `local_null_ai_PHISH_HUNTER_PRO` -> `cybersecurity/churchofmalware/local_null_ai_PHISH_HUNTER_PRO`
- `local_null_ai_REAPER-github secrets scanner_exploiter` -> `cybersecurity/churchofmalware/local_null_ai_REAPER-github secrets scanner_exploiter`

### Media generation and editing

- Candidate tools: 7
- Strategy: Consolidate asset catalogs, input/output folders, and batch job manifests before merging UI code.
- `local_null_ai_pixelz` -> `media generators/local_null_ai_pixelz`
- `local_null_ai_video-editor` -> `media generators/local_null_ai_video-editor`
- `local_null_ai_audiocipher-by-tech-pro` -> `script generators/04-devtools-and-builder-tools/local_null_ai_audiocipher-by-tech-pro`
- `local_null_ai_avatar-studio` -> `script generators/04-devtools-and-builder-tools/local_null_ai_avatar-studio`
- `local_null_ai_badge3d---logo-to-coin-generator` -> `script generators/04-devtools-and-builder-tools/local_null_ai_badge3d---logo-to-coin-generator`
- `local_null_ai_datamosh-studio` -> `script generators/04-devtools-and-builder-tools/local_null_ai_datamosh-studio`
- `local_null_ai_sonicvision-ai` -> `script generators/local_null_ai_sonicvision-ai`

### SEO and social intelligence

- Candidate tools: 4
- Strategy: Share crawl/import/export schemas and reporting style. Keep acquisition, SEO, and publishing surfaces separate.
- `local_null_ai_seotrendtool` -> `script generators/09-utilities-and-data-apps/local_null_ai_seotrendtool`
- `local_null_ai_local-business-lead-scanner` -> `seo/local_null_ai_local-business-lead-scanner`
- `local_null_ai_newlistingsinvb` -> `seo/local_null_ai_newlistingsinvb`
- `local_null_ai_omnipost---social-media-manager` -> `social-media/local_null_ai_omnipost---social-media-manager`

## Suggested First Pass

1. Add `TOOL.md` contracts to the lowest-scoring tools.
2. Add wrapper commands for compound tools with nested backends/frontends.
3. Add non-network smoke tests where possible.
4. Standardize output folders: `runs/`, `reports/`, `exports/`, or `casefiles/` depending on tool type.
5. Only merge tools after two or more tools share a stable manifest and runner contract.
