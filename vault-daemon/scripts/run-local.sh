#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="${ZOTH_VAULT_DATA:-$HOME/.local/share/zoth-vault-daemon}"
PORT="${ZOTH_VAULT_PORT:-8787}"
BIN="$ROOT/target/release/zoth-vault-daemon"
if [[ ! -x "$BIN" ]]; then
  echo "Building release binary..."
  (cd "$ROOT" && cargo build --release)
fi
mkdir -p "$DATA"
echo "Starting zoth-vault-daemon on 127.0.0.1:$PORT"
echo "Data: $DATA"
exec "$BIN" --port "$PORT" --data-dir "$DATA" --bind 127.0.0.1
