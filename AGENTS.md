# AGENTS.md — NULL AI Agent Framework

## For AI agents working in this repo

### Project purpose
This is a local-first, multi-agent AI orchestration framework running on Parrot OS.
It indexes, manages, and chains 47+ tools across security, SEO, media, website gen, and automation.

### Key paths
- `tools/null ai agent tools/local_null_ai_orchestrator/orchestrator.py` — Central CLI (single entrypoint)
- `tools/null ai agent tools/local_null_ai_orchestrator/runtime/` — Python runtime modules
- `tools/null ai agent tools/local_null_ai_orchestrator/registry.local.json` — Tool registry
- `tools/null ai agent tools/local_null_ai_orchestrator/playbooks/` — Agent workflow playbooks

### Rules
- Work in `local_null_ai_*` folders only; never modify original non-prefixed folders.
- Run `orchestrator.py` commands for tool operations (scan, list, show, run, install, session, chain).
- Use `dashboard` or `doctor` to check system health before starting work.
- For Python tools, use `install` command to manage venv/dependencies.
- `run` defaults to dry-run; pass `--confirm` to execute.
- All tool metadata goes in `TOOL.md` and `local_null_ai_manifest.json`.
- Document all commands in the final handoff.
