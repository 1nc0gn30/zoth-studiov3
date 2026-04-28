# Z0TH Orchestrator

Multi-agent AI orchestration framework for Parrot OS. Indexes, manages, and chains 47+ tools across security, SEO, media, website generation, and automation.

## Quick Start

```bash
# Index all tools
python3 orchestrator.py scan

# Check system health
python3 orchestrator.py doctor

# List registered tools
python3 orchestrator.py list

# Start the API + dashboard
python3 orchestrator.py serve --port 8484
```

Then open `http://127.0.0.1:8484/dashboard` in your browser.

## Architecture

```
orchestrator.py          # CLI entrypoint + HTTP API server
├── runtime/
│   ├── parrot_os.py     # Hardware detection + full PATH binary scan (5000+ tools)
│   ├── python_env.py    # Python/pip version detection
│   ├── preview_container.py  # Podman-based preview management
│   ├── secrets_scanner.py    # Workspace secret/credential scanner
│   └── agent/
│       ├── __init__.py
│       └── runner.py    # Agent execution backend
├── studio-agents/
│   └── agent-runner.py # Codex/Ollama site builder
├── dashboard/           # React + Vite web UI
│   └── src/
│       ├── App.jsx          # Main app with tab routing
│       ├── api.js           # All API client functions (58 endpoints)
│       ├── styles.css       # Global styles + component styles
│       └── components/
│           ├── ZothStudio.jsx      # Multi-framework AI site builder
│           ├── AgentFactory.jsx    # Agent design/management
│           ├── ToolGrid.jsx       # Tool card grid
│           ├── AgentBar.jsx       # Agent backend status
│           ├── SystemPanel.jsx    # System info + runtime stats
│           ├── GhostByte.jsx      # Command execution terminal
│           ├── SecurityScanner.jsx # Secret scanner UI
│           ├── ParrotNexus.jsx    # Full Parrot OS tool inventory
│           ├── ServerManager.jsx  # Running server management
│           └── Terminal.jsx       # Terminal output renderer
├── config/              # Agent + system configuration
├── playbooks/           # Agent workflow playbooks
├── reports/             # Scan reports + security findings
└── runs/                # Tool execution logs
```

## Dashboard Tabs

| Tab | Component | Description |
|-----|-----------|-------------|
| **Tools** | `ToolGrid` | Searchable, filterable grid of all 21 registered Z0TH tools with runtime badges |
| **Agents** | `AgentBar` | Auto-detected agent backends (Codex, Hermes, OpenClaw, Ollama, etc.) with status |
| **GhostByte** | `GhostByte` | Command execution terminal — select a tool, pick a command preset or custom, run it |
| **System** | `SystemPanel` | OS, CPU, RAM, disk, runtime/category breakdowns |
| **Chains** | (inline) | Tool chain definitions with step-by-step execution plans |
| **Z0TH Studio** | `ZothStudio` | Multi-framework AI site builder (4-step wizard → agent execution) |
| **Security** | `SecurityScanner` | Workspace-wide secret/credential scanner with severity filtering |
| **Parrot Nexus** | `ParrotNexus` | Full inventory of all 5000+ Parrot OS CLI tools, categorized |
| **Agent Factory** | `AgentFactory` | Design, configure, and manage custom AI agents with skills/personalities |
| **Servers** | `ServerManager` | Running server/process management with preview container support |

## Z0TH Studio — How It Works

Z0TH Studio is a 4-step wizard that creates real projects using real AI agents:

### Step 1: Brief
- Enter project name, instructions, keywords
- Pick site type (Landing, SaaS, Portfolio, E-Commerce, Blog, Dashboard, Docs, Agency)
- Pick tone (Professional, Creative, Minimal, Bold, Playful, Corporate, Dark UI)
- Optional logo URL

### Step 2: Config
- Select frameworks: Astro, React+Vite, Vite, Vanilla HTML/CSS, Python, Vue, Angular, Svelte, Next.js
- Pick a theme from the gallery (30+ themes built into Zoth Studio engine)
- Toggle features: SEO, Responsive, Dark Mode, Analytics, Auth, CMS, Forms, Animations, A11y, PWA, i18n, API
- Choose AI agent model: Codex, o3, Ollama, Kimi K2.6 Cloud
- Build an agent pipeline (optional chaining: Architect → Designer → Engineer → SEO → Security → DevOps)

### Step 3: Review
- See the generated master prompt
- Edit the prompt if needed
- Review agent pipeline visualization
- See the project directory path

### Step 4: Build
The orchestrator does the following:

1. **Scaffolds the project directory**: `projects/{safe-name}/`
2. **Writes `INSTRUCTIONS.md`** with the master prompt into that directory
3. **Creates `project.json`** manifest with all configuration
4. **If Python selected**: creates a virtual environment at `projects/{name}/venv/`
5. **If Astro selected**: creates a user-config in the Zoth Studio engine
6. **Spawns the AI agent**:
   ```
   codex exec -m {model} --full-auto --skip-git-repo-check \
     -C projects/{name}/ \
     -o agent-task/last-message.txt \
     INSTRUCTIONS.md
   ```
   The agent works **inside the project directory** — creating files, installing deps, building the site.
7. **Frontend polls** `/api/studio/agent-status` every 3 seconds for live updates
8. When the agent finishes, the build result and preview are shown

### Agent Fallback Chain
If Codex is unavailable:
1. Falls back to `agent-runner.py` (supports Codex + Ollama)
2. Falls back to bare `npm run build` in the Astro tool directory

## Agent Factory

Design custom AI agents with:
- **6 skill categories**: Frontend (10), Backend (8), DevOps (5), SEO (5), AI (4), Security (4)
- **5 personalities**: Precise, Creative, Thorough, Fast, Mentor
- **5 model backends**: Codex, GPT-4, Ollama, Hermes, OpenClaw
- **6 built-in agents**: Architect, Frontend Designer, Backend Engineer, SEO Specialist, Security Auditor, DevOps Deploy
- Full CRUD with server-side persistence via `/api/agents`

## Parrot Nexus

Scans every executable in `$PATH` (~5,000+ on Parrot OS) and categorizes them into:
- Information Gathering, Vulnerability Analysis, Web Application, Password Attacks
- Wireless, Exploitation, Sniffing/Spoofing, Post Exploitation
- Forensics, Reverse Engineering, Networking, Development, AI/Agents
- System Utilities (everything else)

The scan runs on every page load via the `/api/parrot-nexus/tools` endpoint, pulling from `runtime/parrot_os.py`'s `scan_all_tools()` function which iterates all directories in PATH and categorizes known binaries.

### Launch Types — Important

Parrot OS tools are **available to launch but NOT auto-started**. Each tool is tagged with a launch type:

| Launch Type | Color | Meaning | Examples |
|------------|-------|---------|----------|
| **Available to Launch** | Amber ⏸ | GUI or heavy tools that the user can start on demand | Maltego, OWASP ZAP, Burp Suite, Wireshark, Autopsy |
| **CLI** | Blue ⟩ | Command-line tools invocable from terminal or GhostByte | nmap, sqlmap, hydra, gobuster, ffuf |
| **Runtime** | Green ⚙ | Development runtimes always available | python3, node, go, docker, git |

This means:
- Opening the Parrot Nexus tab **does not launch Maltego, Burp, or any other GUI tool**
- These tools are simply **indexed and available** — the user sees they exist on their system
- Clicking a tool shows its path, category, version, and a "Launch" button (on-demand) or "Copy Command" button (CLI)
- Only when the user explicitly clicks **Launch** does the tool start

## Python Venv Handling

When Python is selected as a framework in Z0TH Studio:
1. The orchestrator creates `projects/{name}/venv/` using `python3 -m venv`
2. The INSTRUCTIONS.md includes a "Python Environment" section instructing the agent to use `source venv/bin/activate` before any Python commands
3. The agent is responsible for creating `requirements.txt` and installing dependencies within the venv

## API Reference

### Core Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard` | Dashboard summary (tool count, status) |
| GET | `/api/system` | Full system report (OS, hardware, all Parrot OS tools) |
| GET | `/api/tools` | List all registered Z0TH tools |
| GET | `/api/tools/:id` | Single tool detail |
| GET | `/api/categories` | Tool category breakdown |
| GET | `/api/chains` | Built-in tool chains |
| POST | `/api/exec` | Execute a tool command |

### Studio Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/studio/frameworks` | Available frameworks list |
| GET | `/api/studio/projects` | All studio projects |
| GET | `/api/studio/project/:name` | Project detail |
| GET | `/api/studio/agent-status?name=X` | Agent status polling |
| POST | `/api/studio/generate` | Scaffold project dir + write INSTRUCTIONS.md |
| POST | `/api/studio/build` | Spawn AI agent in project directory |
| POST | `/api/studio/deploy` | Initiate deployment |
| POST | `/api/studio/generate-prompt` | Generate master prompt from config |
| POST | `/api/studio/assign-agents` | Assign agent pipeline to project |

### Agent Factory Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents` | List all agents |
| GET | `/api/agents/skills` | Skill categories catalog |
| POST | `/api/agents` | Create custom agent |
| PUT | `/api/agents/:id` | Update agent |
| DELETE | `/api/agents/:id` | Delete agent |

### Parrot Nexus Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/parrot-nexus/dashboard` | Full tool count + category breakdown |
| GET | `/api/parrot-nexus/tools` | All system binaries (5000+) |
| GET | `/api/parrot-nexus/presets` | Tool execution presets |
| GET | `/api/parrot-nexus/playbooks` | Agent playbooks |

### Security Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/security/scan-status` | Last scan results |
| POST | `/api/security/scan` | Run full workspace scan |

### Server Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/servers` | Running servers/processes |
| POST | `/api/servers/:id/stop` | Stop a server |
| GET | `/api/preview-container/status` | Preview container status |
| POST | `/api/preview-container/config` | Update container config |
| POST | `/api/preview-container/stop` | Stop container |

### Astro/Zoth Studio Engine Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/astro/status` | Engine status |
| GET | `/api/astro/sites` | User-config sites |
| GET | `/api/astro/themes` | 30+ theme configs |
| GET | `/api/astro/sections` | Available section types |
| GET | `/api/astro/templates` | Site templates |
| POST | `/api/astro/generate` | Create site config |
| POST | `/api/astro/build` | Build the Astro engine |
| POST | `/api/astro/preview` | Start dev preview |
| POST | `/api/astro/preview-stop` | Stop preview |
| GET | `/api/astro/preview-status` | Running previews |
| POST | `/api/astro/generate-ai` | AI-assisted generation |
| POST | `/api/astro/smart-build` | Smart build pipeline |
| POST | `/api/astro/generate-agent` | Generate via agent task |

## Development

```bash
# Frontend dev server (hot reload, proxies API to :8484)
cd dashboard && npm run dev

# Build for production
cd dashboard && npm run build

# Python syntax check
python3 -c "import ast; ast.parse(open('orchestrator.py').read())"
```

## Project Directory Structure (generated by Zoth Studio)

```
projects/{name}/
├── INSTRUCTIONS.md       # Master prompt fed to the AI agent
├── project.json          # Project manifest (config, status, metadata)
├── agent-task/           # Agent execution logs
│   ├── status.json       # Agent status (running, stage, timestamps)
│   ├── agent.log         # Timestamped agent log
│   ├── codex-stdout.log  # Codex stdout capture
│   ├── codex-stderr.log  # Codex stderr capture
│   └── last-message.txt  # Agent final output
├── venv/                 # Python virtualenv (if Python framework)
└── ...                    # Agent-generated site files
```

## Tool Registry

Tools are registered in `registry.local.json` via `orchestrator.py scan`. Each entry includes:
- `id`, `name`, `description`
- `category` (Security Operations, Website Generation, etc.)
- `runtimes` (python, node, vite, astro, etc.)
- `entrypoints` (main.py, package.json, etc.)
- `tags`, `notes`, `readme` path

## Environment Requirements

- **Parrot OS** (or any Debian-based Linux)
- **Python 3.10+**
- **Node.js 18+** (for dashboard dev/build + Astro engine)
- **Codex CLI** (optional, for agent execution)
- **Ollama** (optional, for local AI models)
- **Podman** (optional, for containerized previews)
