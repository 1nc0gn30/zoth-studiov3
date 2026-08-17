#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose --profile tunnel --profile studio down
echo "Zoth hosting stack stopped."
