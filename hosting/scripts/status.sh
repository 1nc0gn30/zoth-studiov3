#!/usr/bin/env bash
# Report hub / studio / vault independently. Hub-only is a healthy public stack.
set -u
cd "$(dirname "$0")/.."
timeout="${ZOTH_CURL_TIMEOUT:-2}"

probe() {
  local label="$1" url="$2"
  local code
  code="$(curl -sS -m "$timeout" -o /dev/null -w '%{http_code}' "$url" 2>/dev/null)" || code="down"
  printf '%-22s %s  %s\n' "$label" "$code" "$url"
}

echo "=== containers ==="
docker compose ps 2>/dev/null || true
echo
echo "=== surfaces (independent) ==="
probe "hub"            "http://127.0.0.1:8088/"
probe "hub /studio/"   "http://127.0.0.1:8088/studio/"
probe "hub /vault/"    "http://127.0.0.1:8088/vault/"
probe "hub /api (404)" "http://127.0.0.1:8088/api/dashboard"
probe "studio :8484"   "http://127.0.0.1:8484/api/dashboard"
probe "vault :8787"    "http://127.0.0.1:8787/health"
echo
echo "hub can be 200 while studio/vault are down — that is contained and correct."
echo
echo "=== docker resource use ==="
ids="$(docker compose ps -q 2>/dev/null || true)"
if [[ -n "$ids" ]]; then
  docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}' $ids 2>/dev/null || true
fi
