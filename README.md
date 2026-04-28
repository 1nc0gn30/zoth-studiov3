# NULL AI Agent Framework

A local-first, multi-agent AI orchestration framework built for **Parrot OS**. 
Indexes, manages, chains, and runs 47+ AI/security/development tools through a unified Python CLI with support for **Codex**, **OpenClaw**, and **Hermes** agent backends.

## Architecture

```
NULL AI AGENT FRAMEWORK/
├── README.md                          # This file
├── tools/
│   ├── null ai agent tools/           # Main tool library (47 tools)
│   │   ├── local_null_ai_orchestrator/ # Central orchestrator
│   │   │   ├── orchestrator.py         # CLI — scan, list, run, session, chain, install, dashboard
│   │   │   ├── runtime/               # Python runtime infrastructure
│   │   │   │   ├── python_env.py       # Virtualenv & dependency management
│   │   │   │   ├── parrot_os.py        # Parrot OS hardware & tool detection
│   │   │   │   └── agent_protocol.py   # Standard agent interface protocol
│   │   │   ├── config/agents.json      # Agent backend definitions
│   │   │   ├── playbooks/              # JSON agent workflow playbooks
│   │   │   └── registry.local.json     # Auto-generated tool registry
│   │   ├── cybersecurity/             # Security & pentesting tools (11 tools)
│   │   ├── website generators/        # Astro/Vite site builders (4 tools)
│   │   ├── script generators/         # Automation & app builders (23 tools)
│   │   ├── media generators/          # Image/video generation (2 tools)
│   │   ├── design/                    # Design intelligence (2 tools)
│   │   ├── seo/                       # SEO intelligence (2 tools)
│   │   ├── social-media/              # Social automation (1 tool)
│   │   └── house-of-skills/           # Agent skill libraries (2 tools)
│   ├── potential ideas of services/   # Project catalog (~40 service ideas)
│   └── 100websitesproject/            # 100 Websites Challenge artifacts
└── 100 Websites in 30 Days/           # Quality audit & tracking docs
```

## Quick Start

```bash
cd "tools/null ai agent tools/local_null_ai_orchestrator"

# See the full system dashboard
python3 orchestrator.py dashboard

# Scan and index all tools
python3 orchestrator.py scan

# List tools with summary
python3 orchestrator.py list --summary

# See detailed system info
python3 orchestrator.py doctor
```

## Core Commands

| Command | Description |
|---------|-------------|
| `dashboard` | Full Parrot OS + tool health report |
| `scan` | Re-index all `local_null_ai_*` folders |
| `list` | List tools (filter by `--category`, `--runtime`, `--tag`) |
| `show <tool>` | Detailed tool information |
| `doctor` | System, agent, and runtime checks |
| `run <tool> -- <cmd>` | Dry-run or execute commands in a tool folder |
| `install <tool>` | Install Python dependencies in a venv |
| `session <tool>` | Prepare an interactive agent session |
| `chain --list` | List available tool chains |
| `chain --run <id>` | Prepare a chain of tools |
| `env` | Environment details |
| `assess` | Score tools and generate enhancement plan |

## Multi-Agent Support

The framework auto-detects installed agent backends:

```bash
# Start a Codex session for a specific tool
python3 orchestrator.py session local_null_ai_seotrendtool --launch

# Dry-run a session (shows the contract JSON)
python3 orchestrator.py session local_null_ai_nexus --dry-run

# List available tool chains
python3 orchestrator.py chain --list
```

## Python Environment Management

Python tools automatically get managed virtual environments:

```bash
# Install deps for a Streamlit tool
python3 orchestrator.py install local_null_ai_streamlitapps

# List what would be installed
python3 orchestrator.py install local_null_ai_seotrendtool --list

# Force recreate venv and run
python3 orchestrator.py install local_null_ai_convertor --force --run
```

## Parrot OS Integration

The framework detects **18 security and development tools** on Parrot OS:

- **Recon**: nmap, nikto, gobuster, ffuf, netcat
- **Exploitation**: metasploit, hydra, sqlmap
- **Analysis**: wireshark/tshark, tcpdump, john, aircrack-ng
- **Development**: python3, node, ollama, docker, git

## Tool Chaining

Built-in chains connect tools into pipelines:

| Chain | Tools |
|-------|-------|
| SEO Audit Pipeline | seotrendtool → lead-scanner |
| Security Scan Pipeline | backdoor_detector → PHISH_HUNTER_PRO |
| Media Pipeline | pixelz → sonicvision-ai |
| Site Deploy Pipeline | lumina-builder → host-&-build-directory |

## Agent Backends

- **Codex**: Primary coding agent (installed: `/bin/codex`)
- **OpenClaw**: Operator/orchestration backend (installed: `/bin/openclaw`)
- **Hermes**: Local agent runner (installed: `~/.local/bin/hermes`)

## Framework Design Principles

1. **Local-first** — No cloud dependency. All tools run on your machine.
2. **Agent-agnostic** — Works with Codex, OpenClaw, Hermes, or any CLI agent.
3. **Parrot-native** — Detects and integrates with Parrot OS security tools.
4. **Dependency-free core** — The orchestrator runs with zero pip installs.
5. **Safe by default** — `run` is dry-run unless `--confirm` is passed.
6. **Sidecar copies** — All work happens in `local_null_ai_*` folders; originals stay untouched.

## License

This is a local agent framework. Use responsibly. Security tools require explicit authorization before active use.
