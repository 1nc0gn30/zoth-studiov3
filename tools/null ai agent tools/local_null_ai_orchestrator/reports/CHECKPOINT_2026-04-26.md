# NULL AI Framework — Session Checkpoint

**Date:** 2026-04-26
**Status:** Active development

## What's been built

### Dashboard (Vite + React, served via `orchestrator.py serve`)
- **4 tabs**: Tools, GhostByte, System, Chains (Agents merged into System)
- **ToolGrid** — searchable, filterable 47-tool inventory with name, description, runtime badges, entrypoints
- **GhostByte** — agent launchpad with:
  - Left sidebar: tool search + list with descriptions
  - Command presets auto-generated from tool runtimes (python, node, vite, streamlit, astro, go)
  - Custom shell input
  - Agent selector strip: Codex, Hermes, Ollama, OpenClaw, Shell
  - In-dashboard terminal with stdout/stderr/exit code/duration
  - Settings panel (capture, paths, timeout)
- **SystemPanel** — OS/CPU/RAM/disk + runtime bar charts + category breakdown

### Orchestrator API additions
- `POST /api/exec` — runs commands inside tool directories, returns JSON
- `GET /api/tools` — now includes `description` field

### TOOL.md contracts (47/47 complete)
- All tools have purpose descriptions, runtime detection, safety notes (auth guards for security tools)
- Clean display names (e.g. `Cerberus_pentest_exploit` → `Cerberus`)
- Smoke tests: 249/249 passing

### Fixes applied
- Burp Suite loop fix: changed `burpsuite --version` → `which burpsuite` in `parrot_os.py`
- Same for `msfconsole` to avoid DB init on detection

## How to launch
```bash
cd /home/neo/Desktop/NULL\ AI\ AGENT\ FRAMEWORK
python3 tools/null\ ai\ agent\ tools/local_null_ai_orchestrator/orchestrator.py serve
# → http://127.0.0.1:8484/dashboard/
```

## Key files
| File | Purpose |
|---|---|
| `orchestrator.py` | Main CLI + HTTP server |
| `dashboard/src/App.jsx` | Main app with tab routing |
| `dashboard/src/components/GhostByte.jsx` | Agent launchpad |
| `dashboard/src/components/ToolGrid.jsx` | Tool inventory |
| `dashboard/src/components/SystemPanel.jsx` | System info |
| `dashboard/src/components/AgentBar.jsx` | Agent status |
| `dashboard/src/components/Terminal.jsx` | Terminal output |
| `dashboard/src/styles.css` | Dark cyber theme |
| `runtime/parrot_os.py` | System detection (burp fix) |
| `registry.local.json` | Tool registry with names + descriptions |

## Next possible work
1. Wire real Codex/Hermes/Ollama agent launch from GhostByte (currently runs Shell commands via subprocess)
2. Add auto-start configuration per tool (persisted to local config)
3. GhostByte chain execution — run multi-tool pipelines
4. Add more preset commands for each runtime
5. Dark mode theme refinements / mobile responsive
