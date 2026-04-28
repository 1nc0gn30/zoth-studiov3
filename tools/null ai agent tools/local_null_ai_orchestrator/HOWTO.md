# NULL AI Agent Framework — How-To Guide

The complete guide to running, chaining, and managing 47+ AI tools on Parrot OS.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tool Discovery & Inventory](#tool-discovery--inventory)
3. [Running Tools](#running-tools)
4. [Python Environment Management](#python-environment-management)
5. [Agent Sessions](#agent-sessions)
6. [Tool Chaining](#tool-chaining)
7. [HTTP API Mode](#http-api-mode)
8. [System Dashboard & Diagnostics](#system-dashboard--diagnostics)
9. [Security Tool Workflow](#security-tool-workflow)
10. [Working with Agent Backends](#working-with-agent-backends)
11. [Playbooks](#playbooks)
12. [Adding New Tools](#adding-new-tools)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
cd "tools/null ai agent tools/local_null_ai_orchestrator"

# 1. See the full system health dashboard
python3 orchestrator.py dashboard

# 2. Re-index all tools (do this after adding new tools)
python3 orchestrator.py scan

# 3. List everything with summary counts
python3 orchestrator.py list --summary

# 4. Inspect a specific tool
python3 orchestrator.py show local_null_ai_seotrendtool

# 5. Install Python deps for a tool
python3 orchestrator.py install local_null_ai_seotrendtool

# 6. Start an agent session
python3 orchestrator.py session local_null_ai_nexus --launch
```

---

## Tool Discovery & Inventory

### List all tools
```bash
python3 orchestrator.py list
```

### Filter by category
```bash
python3 orchestrator.py list --category "Security Operations"
python3 orchestrator.py list --category "Media Generation"
```

### Filter by runtime
```bash
python3 orchestrator.py list --runtime python
python3 orchestrator.py list --runtime node
python3 orchestrator.py list --runtime go
```

### Filter by tag
```bash
python3 orchestrator.py list --tag python
python3 orchestrator.py list --tag seo
```

### Summary view
```bash
python3 orchestrator.py list --summary
```
Output:
```
Total tools: 47

By category:
  Automation & Builders              23
  Security Operations                11
  ...

By runtime:
  node                 32
  python               14
  go                   2
  ...
```

### Inspect a single tool
```bash
# Basic info
python3 orchestrator.py show local_null_ai_seotrendtool

# Full JSON
python3 orchestrator.py show local_null_ai_seotrendtool --json
```

---

## Running Tools

### Dry-run (default — safe)
```bash
# See what would run without executing
python3 orchestrator.py run local_null_ai_nexus -- npm run dev
```

### Execute with confirmation
```bash
python3 orchestrator.py run local_null_ai_nexus -- npm run dev --confirm
```

### Run any command in a tool's folder
```bash
python3 orchestrator.py run local_null_ai_pixelz -- python3 scripts/generate_pixel_logos.py --confirm
python3 orchestrator.py run local_null_ai_convertor -- python3 app.py --confirm
```

### Run logs
Every confirmed run is logged to:
```
runs/<timestamp>-<toolname>/
  run.json      # Metadata (tool, command, exit code, timestamps)
  stdout.log    # Standard output
  stderr.log    # Standard error
```

---

## Python Environment Management

The framework creates isolated virtual environments per tool (no global pip chaos).

### Install dependencies
```bash
# Auto-creates venv + pip installs from requirements.txt / pyproject.toml
python3 orchestrator.py install local_null_ai_seotrendtool
```

### List what would be installed
```bash
python3 orchestrator.py install local_null_ai_seotrendtool --list
```
Output:
```
Requirements files found:
  requirements.txt
  requirements-ai.txt
Venv exists: False
```

### Force recreate and run
```bash
# Recreate venv from scratch, install deps, then run the first Python entrypoint
python3 orchestrator.py install local_null_ai_convertor --force --run
```

### How it works
- Each tool gets a `.null_ai_venv/` folder in its directory
- The framework detects `requirements.txt`, `requirements-ai.txt`, and `pyproject.toml`
- Packages are tracked via `pip list --format=json`
- Tools without requirements files are noted but not installed

---

## Agent Sessions

Sessions prepare a structured handoff for Codex, OpenClaw, or Hermes agents.

### Prepare a session (dry-run)
```bash
python3 orchestrator.py session local_null_ai_pixelz --dry-run
```
Generates a session JSON with:
- Tool metadata (ID, category, runtimes)
- Detected entrypoints
- Available actions (status, install-deps, run-*)
- Agent rules and safety notes

### Launch a session
```bash
python3 orchestrator.py session local_null_ai_seotrendtool --launch
```
This opens Codex (or your chosen agent) in the tool's working directory with a structured prompt.

### Use a specific agent
```bash
python3 orchestrator.py session local_null_ai_nexus --agent openclaw --launch
python3 orchestrator.py session local_null_ai_signalnest --agent hermes --launch
```

### Session artifacts
Each session creates:
```
runs/session_<timestamp>.json              # Full session metadata
runs/session_<timestamp>_prompt.txt        # Agent prompt file
```

### Manual launch from prompt file
```bash
cd <tool_path> && codex -p runs/session_<timestamp>_prompt.txt
```

---

## Tool Chaining

Chains allow you to pipeline multiple tools together sequentially.

### List available chains
```bash
python3 orchestrator.py chain --list
```

Built-in chains:

| Chain ID | Name | Pipeline |
|----------|------|----------|
| `seo-audit` | SEO Audit Pipeline | seotrendtool → lead-scanner |
| `security-scan` | Security Scan Pipeline | backdoor_detector → PHISH_HUNTER_PRO |
| `media-pipeline` | Media Generation Pipeline | pixelz → sonicvision-ai |
| `site-deploy` | Site Build & Deploy | lumina-builder → host-&-build-directory |

### Prepare a chain
```bash
python3 orchestrator.py chain --run seo-audit
```

### Execute chained commands manually
```bash
# Step 1: SEO analysis
python3 orchestrator.py run local_null_ai_seotrendtool -- python3 seotrendtool_core.py --confirm

# Step 2: Lead scan (uses SEO results)
python3 orchestrator.py run local_null_ai_local-business-lead-scanner -- npm run scan --confirm
```

---

## HTTP API Mode

Start a lightweight REST API so external agents or scripts can query tool status.

```bash
python3 orchestrator.py serve
# Listening on http://127.0.0.1:8484
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Framework health check |
| `GET /api/tools` | List all tools |
| `GET /api/tools/<id>` | Single tool details |
| `GET /api/system` | Parrot OS hardware & tool detection |
| `GET /api/categories` | Category counts |
| `GET /api/chains` | Available tool chains |
| `GET /api/dashboard` | Full dashboard data |

### Custom host/port
```bash
python3 orchestrator.py serve --host 0.0.0.0 --port 9000
```

### Example queries
```bash
curl http://127.0.0.1:8484/api/health
curl http://127.0.0.1:8484/api/system
curl http://127.0.0.1:8484/api/tools/local_null_ai_seotrendtool
```

---

## System Dashboard & Diagnostics

### Full dashboard
```bash
python3 orchestrator.py dashboard
```
Shows:
- **Parrot OS Report** — OS version, CPU, RAM, disk, GPU, 18 security/dev tools
- **Tool Inventory** — 47 tools across 8 categories, unknown runtime warnings
- **Tool Health** — Ready vs needs-contract counts
- **Available Chains** — Pipeline listings
- **Quick Start** — Command cheatsheet

### System doctor
```bash
python3 orchestrator.py doctor
```
More detailed: agent backends, runtime executables, Python/pip versions.

### Environment dump
```bash
python3 orchestrator.py env
```
Shows: Python, Node versions, PATH, key environment variables, system arch.

---

## Security Tool Workflow

Security tools have additional safety layers built in.

### Tool structure
Each security tool (`cybersecurity/*/local_null_ai_*`) has:
```
TOOL.md       # With REQUIRED authorization notice
evidence/     # All findings go here
runs/         # Command logs
reports/      # Consolidated reports
```

### Before using a security tool
1. **Read the TOOL.md** — every security tool has an auth/scope notice
2. **Document scope** — write your target scope to a session note
3. **Use dry-runs first** — `python3 orchestrator.py run <tool> -- <cmd>` without `--confirm`
4. **Log everything** — all findings go to `evidence/`

### Security tool chain (recommended workflow)
```bash
# 1. Recon
python3 orchestrator.py run local_null_ai_PHISH_HUNTER_PRO -- python3 cli.py --confirm

# 2. Backdoor detection
python3 orchestrator.py run local_null_ai_backdoor_detector -- python3 backdoor_detector.py --confirm

# 3. Report
# Findings automatically land in each tool's evidence/ folder
```

---

## Working with Agent Backends

The framework auto-detects 3 agent backends:

| Agent | Status on this system |
|-------|----------------------|
| Codex | ✓ `/bin/codex` (v0.125.0) |
| OpenClaw | ✓ `/bin/openclaw` |
| Hermes | ✓ `~/.local/bin/hermes` (v0.10.0) |

### Generating agent commands
```bash
# Get the launch command for Codex targeting a specific tool
python3 orchestrator.py agent-command codex --tool local_null_ai_nexus

# Generate a playbook prompt for Hermes
python3 orchestrator.py agent-prompt hermes playbooks/parrot-tool-hardening.json --tool local_null_ai_pixelz
```

### Configuring agent backends
Edit `config/agents.json`:
```json
{
  "codex": {
    "label": "Codex",
    "executable": "codex",
    "args": [],
    "notes": "Primary coding agent"
  }
}
```

---

## Playbooks

Playbooks are JSON workflow documents that guide agents through multi-step tool operations.

### Available playbooks

| Playbook | Purpose |
|----------|---------|
| `playbooks/framework-bootstrap.json` | Initialize framework: scan → assess → contracts → dashboard |
| `playbooks/parrot-tool-hardening.json` | Harden a tool for Parrot OS with agent contracts |
| `playbooks/site-modernization.json` | Modernize a web tool for production |
| `playbooks/agent-codex-workflow.json` | Handoff template for Codex tool work |
| `playbooks/security-audit-chain.json` | Coordinated security audit pipeline |

### Using a playbook
```bash
python3 orchestrator.py agent-prompt codex playbooks/framework-bootstrap.json
```

Playbook structure:
```json
{
  "id": "my-workflow",
  "name": "My Workflow",
  "intent": "What this workflow accomplishes",
  "scope": ["Rules for the agent"],
  "steps": [
    {"id": "step-1", "title": "First step", "prompt": "Instructions..."},
    {"id": "step-2", "title": "Second step", "prompt": "Instructions..."}
  ]
}
```

---

## Adding New Tools

### Method 1: Drop in a folder
1. Create a folder named `local_null_ai_your-tool` anywhere under `tools/null ai agent tools/`
2. Run `python3 orchestrator.py scan` — it's automatically indexed
3. Run `python3 orchestrator.py show local_null_ai_your-tool` to verify detection

### Method 2: Bootstrap contracts
```bash
# Generate TOOL.md and manifest.json for ALL tools
python3 orchestrator.py bootstrap-contracts

# Limit to a category
python3 orchestrator.py bootstrap-contracts --category "Security Operations"

# Overwrite existing contracts
python3 orchestrator.py bootstrap-contracts --force
```

### Required structure
```
local_null_ai_your-tool/
├── TOOL.md                        # Agent contract (auto-generated or manual)
├── local_null_ai_manifest.json    # Tool metadata (auto-generated)
├── requirements.txt               # Python deps (if Python tool)
├── package.json                   # Node deps (if Node tool)
├── runs/                          # Run logs (created automatically)
├── reports/                       # Reports output
└── exports/                       # Generated assets
```

---

## Troubleshooting

### Tool not found
```bash
# Re-index
python3 orchestrator.py scan

# Check it exists
python3 orchestrator.py list | grep your-tool
```

### Unknown runtime
```bash
# Bootstrap contracts
python3 orchestrator.py bootstrap-contracts

# The tool may be data-only (skills, configs) — that's fine
```

### Install fails
```bash
# Check what requirements exist
python3 orchestrator.py install local_null_ai_your-tool --list

# Recreate venv
python3 orchestrator.py install local_null_ai_your-tool --force
```

### Permission denied (serve)
The HTTP API binds to `127.0.0.1:8484` by default. If you get a permission error:
```bash
# Use a non-privileged port
python3 orchestrator.py serve --port 9000
```

### Dashboard is slow
The first run detects all Parrot OS tools which takes ~5-8 seconds. Subsequent runs use cached results.

### Agent not launching
```bash
# Check if agent is installed
which codex
which openclaw
which hermes

# Try manual launch
cd <tool_path> && codex
```

---


---

## Advanced: Chain Execution

Chains can now execute tools end-to-end with output piping between steps.

### Execute a chain
```bash
python3 orchestrator.py chain --run seo-audit
```

The chain runner will:
1. Find each tool in the chain
2. Resolve the best command from the tool's entrypoints
3. Execute with captured output
4. Inject output variables as `NULLAI_CHAIN_*` env vars for the next step
5. Log the full chain run to `runs/chain_<id>_<timestamp>.json`

### Dry-run a chain first
```bash
python3 orchestrator.py chain --run security-scan --dry-run
```

### Fail fast
```bash
python3 orchestrator.py chain --run site-deploy --fail-fast
```

### Chain run output
Each chain execution creates a detailed JSON log:
```json
{
  "chain_id": "seo-audit",
  "steps_total": 2,
  "steps_completed": 2,
  "outputs": [
    {"step": 1, "tool": "seotrendtool", "exit_code": 0, "stdout_preview": "..."},
    {"step": 2, "tool": "lead-scanner", "exit_code": 0, "stdout_preview": "..."}
  ]
}
```

---

## Advanced: Run with Captured Output

The `--capture` flag returns command output directly instead of logging to files.

```bash
# Capture Python version from any tool
python3 orchestrator.py run local_null_ai_seotrendtool -- python3 --version --confirm --capture

# Capture directory listing
python3 orchestrator.py run local_null_ai_pixelz -- ls -la --confirm --capture
```

Captured output is both logged to `runs/` and printed with size info:
```
Exit code: 0
--- stdout (14 chars) ---
Python 3.13.5
```

---

## Environment Variable Management

The `check-env` command scans all tools for `.env` files and reports secrets exposure risks.

```bash
# Scan all tools
python3 orchestrator.py check-env

# Scan a specific tool
python3 orchestrator.py check-env --tool local_null_ai_signalnest

# JSON output for scripting
python3 orchestrator.py check-env --json
```

### What it detects
- `.env` and `.env.example` files across all 47 tools
- Variable names (e.g., `GEMINI_API_KEY`, `VITE_SUPABASE_URL`)
- Whether files contain actual secrets vs placeholder values
- Tools with real `.env` files (potential exposure risk)

### Example output
```
Tools checked:   47
Tools with .env: 23
.env files:      26

Unique variable names:
  GEMINI_API_KEY, VITE_SUPABASE_URL, OLLAMA_API_KEY, ...

Safety check:
  ⚠ 3 tools have real .env files (may contain secrets)
    packageforge-ai, signalnest, streamlitapps
```

---

## Smoke Testing

Validate that tools are properly structured and functional.

```bash
# Test all 47 tools
python3 orchestrator.py smoke

# Test a single tool
python3 orchestrator.py smoke --tool local_null_ai_convertor

# Test by category
python3 orchestrator.py smoke --category "Security Operations"

# Test by runtime
python3 orchestrator.py smoke --runtime python

# Limit to N tools (useful for quick checks)
python3 orchestrator.py smoke --limit 10

# JSON output for programmatic use
python3 orchestrator.py smoke --json
```

### What's tested per tool
| Test | Description |
|------|-------------|
| `path-exists` | Tool folder exists on disk |
| `manifest` | `local_null_ai_manifest.json` present |
| `tool-md` | `TOOL.md` agent contract present |
| `entrypoints` | All entrypoint files exist |
| `requirements` | Requirements file exists (Python only, warning if missing) |
| `syntax-*` | Python AST parse (Python only) |
| `package-json-parse` | Valid JSON (Node only) |

### Health results (last run)
```
Results: 248/248 passed, 0 failed
Tools: 47/47 fully healthy
```

---

## Web Dashboard

A live HTML dashboard connects to the HTTP API.

```bash
# Terminal 1: Start the API server
python3 orchestrator.py serve

# Terminal 2: Open the dashboard
xdg-open dashboard.html
```

The dashboard shows:
- **Stats cards**: Tool count, system info (CPU/RAM/OS), available chains
- **Tool table**: Searchable, filterable by category/runtime
- **Details panel**: Click any tool to see entrypoints, scripts, and path
- **Quick links**: Run commands directly from the UI

---

## Complete Command Reference

| Command | Description |
|---------|-------------|
| `dashboard` | Full Parrot OS + tools health report |
| `scan` | Re-index all tools |
| `list [--summary]` | List tools with optional filters and summary |
| `show <tool>` | Tool details (JSON with `--json`) |
| `doctor` | System + agent diagnostics |
| `env` | Environment details |
| `check-env [--tool]` | Detect `.env` files and secret exposure |
| `run <tool> -- <cmd>` | Execute command (dry-run by default, `--confirm` to execute, `--capture` for output) |
| `install <tool>` | Python venv + dependencies |
| `session <tool>` | Interactive agent session |
| `chain --list` | List tool pipelines |
| `chain --run <id>` | Execute a chain end-to-end |
| `smoke [--tool]` | Validate tools with smoke tests |
| `serve [--port]` | HTTP API for external agents |
| `agent-prompt <agent> <playbook>` | Generate JSON agent prompt |
| `agent-command <agent>` | Generate agent launch command |
| `assess` | Score tools + enhancement plan |
| `bootstrap-contracts` | Create manifests for all tools |
