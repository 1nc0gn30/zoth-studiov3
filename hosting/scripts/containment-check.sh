#!/usr/bin/env bash
# Assert the public hub never exposes operator APIs.
set -euo pipefail
HUB="${ZOTH_HUB_URL:-http://127.0.0.1:8088}"
fail=0

expect() {
  local url="$1" want="$2" label="$3"
  local code
  code="$(curl -sS -m 3 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo down)"
  if [[ "$code" == "$want" ]]; then
    echo "OK    $label  $code"
  else
    echo "FAIL  $label  got $code want $want  ($url)"
    fail=$((fail + 1))
  fi
}

echo "=== containment ($HUB) ==="
expect "$HUB/" 200 "hub html"
expect "$HUB/studio/" 200 "studio launch pad"
expect "$HUB/vault/" 200 "vault ui"
expect "$HUB/api/dashboard" 404 "no studio api"
expect "$HUB/api/tools" 404 "no tools api"
expect "$HUB/dashboard" 404 "no dashboard proxy"
expect "$HUB/ws" 404 "no websocket proxy"

if [[ "$fail" -gt 0 ]]; then
  echo "summary: $fail containment failure(s)"
  exit 1
fi
echo "summary: public hub is static-only"
exit 0
