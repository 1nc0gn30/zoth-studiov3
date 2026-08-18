#!/usr/bin/env bash
# ⚡ Zoth Studio — Signal Swarm Bridge Launcher
# Usage:
#   ./scripts/zoth-signal-daemon.sh status    # View active agents & locks
#   ./scripts/zoth-signal-daemon.sh link      # Link your mobile Signal app (QR Code)
#   ./scripts/zoth-signal-daemon.sh daemon    # Run live Signal listener daemon
#   ./scripts/zoth-signal-daemon.sh cli       # Interactive test console

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PYTHON="${PYTHON:-python3}"

ACTION="${1:-status}"
shift || true

case "${ACTION}" in
  status|who)
    ${PYTHON} "${ROOT_DIR}/tools/signal_swarm_bridge.py" status "$@"
    ;;
  link)
    ${PYTHON} "${ROOT_DIR}/tools/signal_swarm_bridge.py" link "$@"
    ;;
  daemon|start)
    ${PYTHON} "${ROOT_DIR}/tools/signal_swarm_bridge.py" daemon "$@"
    ;;
  cli|sim)
    ${PYTHON} "${ROOT_DIR}/tools/signal_swarm_bridge.py" cli "$@"
    ;;
  doctor)
    ${PYTHON} "${ROOT_DIR}/tools/signal_swarm_bridge.py" doctor "$@"
    ;;
  *)
    echo "Usage: $0 {status|link|daemon|cli|doctor} [options]"
    exit 1
    ;;
esac
