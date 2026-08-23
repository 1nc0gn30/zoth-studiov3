# codex_agent

## Purpose

Autonomous Codex agent orchestration for running multi-step security and dev workflows.

## Agent Contract

- **ID**: `local_null_ai_codex_agent`
- **Category**: Security Operations
- **Runtimes**: node, python, vite
- **Path**: `cybersecurity/local_null_ai_codex_agent`

## Entrypoints

- `parrot_nexus/backend/main.py`
- `parrot_nexus/frontend/package.json`
- `parrot_nexus/frontend/vite.config.js`

## Available Scripts

- No npm scripts detected.

## Agent Rules

- Work in this folder unless the operator explicitly expands scope.
- Do not create or commit secrets.
- Do not assume dependencies are installed.
- Prefer dry-run, inspect, help, build, lint, or smoke-test commands before active workflows.
- Write generated outputs to `runs/`, `reports/`, `exports/`, or another documented local output folder.

## Safety Notes

- **Authorized use only.** Do not run active scans, exploitation, or payload generation
  without explicit written authorization for the target environment.
- Requires active authorization/scope notes before agent-callable active workflows.
- Run `--dry-run` or `--help` first to understand what each entrypoint does.
- Standard reconnaissance and analysis steps are safe in local/sandboxed environments.

## Validation

- Start with the smallest safe validation available for this tool.
- If validation is blocked by missing dependencies, document the exact missing command or package.

## Install / Dependencies

Python backend deps are pinned in `parrot_nexus/backend/requirements.txt`
(Flask 3.1.1, flask-cors, flask-socketio 5.5.1, requests). Install with:

```bash
python3 -m pip install -r parrot_nexus/backend/requirements.txt
```
