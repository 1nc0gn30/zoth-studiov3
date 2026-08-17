#!/usr/bin/env bash
# Start sandboxed Zoth hub (optional Cloudflare tunnel)
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-local}"  # local | tunnel | studio

case "$MODE" in
  local)
    echo "→ Starting public hub on http://127.0.0.1:8088 (no tunnel)"
    docker compose up -d web
    ;;
  tunnel)
    if [[ ! -f .env ]] || ! grep -q 'CLOUDFLARE_TUNNEL_TOKEN=.\+' .env 2>/dev/null; then
      echo "Missing hosting/.env with CLOUDFLARE_TUNNEL_TOKEN"
      echo "Copy .env.example → .env and paste your tunnel token from Cloudflare Zero Trust."
      exit 1
    fi
    echo "→ Starting public hub + Cloudflare tunnel"
    docker compose --profile tunnel up -d
    ;;
  studio)
    echo "→ Starting public hub + local studio proxy (127.0.0.1:8089 → host :8484)"
    docker compose --profile studio up -d web studio-proxy
    ;;
  *)
    echo "Usage: $0 [local|tunnel|studio]"
    exit 1
    ;;
esac

docker compose ps
echo
echo "Local hub:    http://127.0.0.1:8088/"
echo "Public URL:   https://zoth.nealfrazier.tech/  (after tunnel + DNS)"
echo "Stop:         ./scripts/down.sh"
