#!/usr/bin/env bash
# Health check: zoth-web hub + vault UI + vault-daemon (loopback only).
# Does not start services — report only. Safe to run anytime.
set -euo pipefail

HUB="${ZOTH_HUB_URL:-http://127.0.0.1:8088}"
DAEMON="${ZOTH_VAULT_URL:-http://127.0.0.1:8787}"
TIMEOUT="${ZOTH_CURL_TIMEOUT:-2}"

pass=0
fail=0

check() {
  local label="$1"
  local url="$2"
  local expect_substr="${3:-}"
  local code body
  # shellcheck disable=SC2086
  body="$(curl -sS -m "$TIMEOUT" -w '\n%{http_code}' "$url" 2>/dev/null)" || {
    echo "FAIL  $label  ($url)  unreachable"
    fail=$((fail + 1))
    return
  }
  code="$(printf '%s' "$body" | tail -n1)"
  body="$(printf '%s' "$body" | sed '$d')"
  if [[ "$code" != "200" ]]; then
    echo "FAIL  $label  ($url)  HTTP $code"
    fail=$((fail + 1))
    return
  fi
  if [[ -n "$expect_substr" ]] && ! printf '%s' "$body" | grep -q "$expect_substr"; then
    echo "FAIL  $label  ($url)  HTTP 200 but missing expected content"
    fail=$((fail + 1))
    return
  fi
  echo "OK    $label  ($url)  HTTP $code"
  pass=$((pass + 1))
}

echo "=== zoth vault stack status ==="
echo "hub:    $HUB"
echo "daemon: $DAEMON"
echo

check "hub /"            "$HUB/"
check "vault page"       "$HUB/vault/" "vault"
check "daemon /health"   "$DAEMON/health" "zoth-vault-daemon"
check "daemon /v1/status" "$DAEMON/v1/status" "exists"

echo
echo "=== compose (if running) ==="
if command -v docker >/dev/null 2>&1; then
  (
    cd "$(dirname "$0")/.."
    docker compose ps 2>/dev/null || echo "(compose not running or docker unavailable)"
  )
else
  echo "(docker not in PATH)"
fi

echo
echo "summary: $pass ok · $fail failed"
if [[ "$fail" -gt 0 ]]; then
  echo
  echo "Hints:"
  echo "  hub/vault:  cd hosting && ./scripts/up.sh local"
  echo "  daemon:     cd ../vault-daemon && ./scripts/run-local.sh"
  echo "  docs:       hosting/HOSTING.md  (Local vault stack)"
  exit 1
fi
exit 0
