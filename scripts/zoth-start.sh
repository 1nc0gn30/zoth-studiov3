#!/usr/bin/env bash
# Start the local Zoth deck after a dependency check.
#   ./scripts/zoth-start.sh           # :8484 only
#   ./scripts/zoth-start.sh --hub     # also serve public/ on :8088
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ -d "$ROOT/orchestrator" ]]; then
  ORCH="$ROOT/orchestrator"
elif [[ -d "$ROOT/tools/null ai agent tools/local_null_ai_orchestrator" ]]; then
  ORCH="$ROOT/tools/null ai agent tools/local_null_ai_orchestrator"
else
  echo "Error: Orchestrator directory not found in $ROOT"
  exit 1
fi

HUB=1
NO_BROWSER=0
for arg in "$@"; do
  [[ "$arg" == "--no-hub" ]] && HUB=0
  [[ "$arg" == "--no-browser" ]] && NO_BROWSER=1
done

export PYTHONPATH="$ORCH${PYTHONPATH:+:$PYTHONPATH}"
cd "$ORCH"

echo "============================================================"
echo "⚡ ZOTH STUDIO v2.6.0 — Local-First AI Agent Powerhouse"
echo "============================================================"

# Background Hub server
if [[ "$HUB" -eq 1 && -d "$ROOT/public" ]]; then
  python3 -m http.server 8088 --bind 127.0.0.1 --directory "$ROOT/public" >/dev/null 2>&1 &
  HUB_PID=$!
  trap 'kill $HUB_PID 2>/dev/null || true' EXIT INT TERM
  echo "🌐 Public Studio Hub: http://127.0.0.1:8088/"
fi

# Background Memory Daemon & 3D Maze (:8788)
MEM_DAEMON="$(cd "$ROOT/.." && pwd)/memory-daemon/memory-ui-server.py"
if [[ -f "$MEM_DAEMON" ]]; then
  if ! nc -z 127.0.0.1 8788 2>/dev/null; then
    python3 "$MEM_DAEMON" 8788 >/dev/null 2>&1 &
    echo "🧠 Memory Daemon & 3D Maze: http://127.0.0.1:8788/ui/"
  fi
fi

echo "🚀 Operator Deck:     http://127.0.0.1:8484/"
echo "============================================================"

# Auto-open browser if running on desktop
if [[ "$NO_BROWSER" -eq 0 && -n "${DISPLAY:-}" && -x "$(command -v xdg-open)" ]]; then
  (sleep 1 && xdg-open "http://127.0.0.1:8484/" >/dev/null 2>&1) &
fi

exec python3 orchestrator.py serve --host 127.0.0.1 --port 8484
