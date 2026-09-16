# Signal and SimpleX

Both bridges call the same router: `tools-and-automation/signal_swarm_bridge.py` → `process_swarm_command`.

## Ports

| Port | Service |
| --- | --- |
| `:8765` | Signal HTTP + SSE |
| `:8767` | SimpleX HTTP bridge |
| `:5225` | SimpleX chat daemon |

## Thread memory

Each sender has a tagged ledger at `~/.zoth/bridge/conversations.json`.

Every message gets:

- `id` (`m12`)
- `tags` (`plan`, `vault`, `step:2`, `agent:azoth`, …)
- `kind` (`plan` / `followup` / `chat`)
- `related` ids (the cluster it belongs to)

A follow-up like “ok do step 2” links to the last plan. The next prompt includes that cluster plus an **ACTIVE PLAN** block. Plans also encode to Lucy on `:8788` when it is up.

## Commands

| Command | Effect |
| --- | --- |
| `/thread` | Show the cluster that would be retrieved |
| `/tags` | Tag → message ids |
| `/recall <topic>` | Pull that topic from the full convo |
| `/new` or `/reset` | Wipe this sender’s ledger |

Default chat still goes to Azoth (`agy`) with that context prepended. Ollama paths use `/api/chat` with the retrieved turns.
