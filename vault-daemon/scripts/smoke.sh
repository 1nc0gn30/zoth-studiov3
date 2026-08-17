#!/usr/bin/env bash
# End-to-end smoke test against a local vault-daemon.
# Spawns a temp daemon, exercises all major endpoints, tears down.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN="${ZOTH_VAULT_BIN:-$ROOT/target/release/zoth-vault-daemon}"
PORT="${ZOTH_SMOKE_PORT:-18787}"
BASE="http://127.0.0.1:${PORT}"
PASS='correct horse battery staple smoke'
EXPORT_PASS='export backup passphrase!!'
TMPDIR="$(mktemp -d /tmp/zoth-vault-smoke.XXXXXX)"
DAEMON_PID=""

cleanup() {
  if [[ -n "${DAEMON_PID}" ]] && kill -0 "${DAEMON_PID}" 2>/dev/null; then
    kill "${DAEMON_PID}" 2>/dev/null || true
    wait "${DAEMON_PID}" 2>/dev/null || true
  fi
  rm -rf "${TMPDIR}"
}
trap cleanup EXIT

fail() { echo "FAIL: $*" >&2; exit 1; }
ok() { echo "  ok: $*"; }

need_jq() {
  command -v jq >/dev/null 2>&1 || fail "jq is required for smoke.sh"
}

json_get() {
  # usage: json_get '.field' <<< "$json"
  jq -er "$1"
}

echo "== zoth-vault-daemon smoke =="
need_jq

if [[ ! -x "$BIN" ]]; then
  echo "Building release binary..."
  (cd "$ROOT" && cargo build --release)
fi

# Offline status (no server)
echo "-- offline status"
OFFLINE="$("$BIN" status --data-dir "$TMPDIR")"
echo "$OFFLINE" | json_get '.offline == true' >/dev/null
echo "$OFFLINE" | json_get '.exists == false' >/dev/null
ok "offline status (empty data dir)"

echo "-- start daemon on $BASE data=$TMPDIR"
"$BIN" --port "$PORT" --data-dir "$TMPDIR" --bind 127.0.0.1 \
  --session-ttl 300 --idle-secs 300 &
DAEMON_PID=$!

# Wait for health
for i in $(seq 1 50); do
  if curl -sf "$BASE/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
  if [[ $i -eq 50 ]]; then
    fail "daemon did not become healthy"
  fi
done

echo "-- health / status / security"
H="$(curl -sf "$BASE/health")"
echo "$H" | json_get '.ok == true' >/dev/null
echo "$H" | json_get '.service == "zoth-vault-daemon"' >/dev/null
ok "GET /health"

S="$(curl -sf "$BASE/v1/status")"
echo "$S" | json_get '.exists == false' >/dev/null
echo "$S" | json_get '.unlocked == false' >/dev/null
echo "$S" | json_get '.secure == true' >/dev/null
ok "GET /v1/status (locked, empty)"

SEC="$(curl -sf "$BASE/v1/security")"
echo "$SEC" | json_get '.score >= 0' >/dev/null
echo "$SEC" | json_get '.checks | length > 0' >/dev/null
ok "GET /v1/security"

echo "-- vault init / unlock"
curl -sf -X POST "$BASE/v1/vault/init" \
  -H 'content-type: application/json' \
  -d "{\"passphrase\":\"$PASS\"}" | json_get '.ok == true' >/dev/null
ok "POST /v1/vault/init"

UNLOCK="$(curl -sf -X POST "$BASE/v1/vault/unlock" \
  -H 'content-type: application/json' \
  -d "{\"passphrase\":\"$PASS\"}")"
TOKEN="$(echo "$UNLOCK" | json_get '.session_token')"
[[ -n "$TOKEN" && "$TOKEN" != "null" ]] || fail "missing session_token"
echo "$UNLOCK" | json_get '.ok == true' >/dev/null
ok "POST /v1/vault/unlock"

AUTH=(-H "authorization: Bearer $TOKEN" -H 'content-type: application/json')

echo "-- session"
curl -sf "$BASE/v1/session" -H "authorization: Bearer $TOKEN" \
  | json_get '.ok == true' >/dev/null
curl -sf -X POST "$BASE/v1/session" -H "authorization: Bearer $TOKEN" \
  | json_get '.ok == true' >/dev/null
ok "GET/POST /v1/session"

echo "-- keys CRUD"
CREATE="$(curl -sf -X POST "$BASE/v1/keys" "${AUTH[@]}" \
  -d '{"provider":"openai","label":"smoke-demo","secret":"sk-smoke-not-real-0001","tags":["smoke"],"favorite":true}')"
KEY_ID="$(echo "$CREATE" | json_get '.id')"
PREVIEW="$(echo "$CREATE" | json_get '.secret_preview')"
echo "$PREVIEW" | grep -q '••••' || fail "secret_preview missing mask"
echo "$CREATE" | jq -e 'has("secret") | not' >/dev/null || fail "create response leaked secret field"
ok "POST /v1/keys (create, masked)"

LIST="$(curl -sf "$BASE/v1/keys" -H "authorization: Bearer $TOKEN")"
echo "$LIST" | json_get 'length == 1' >/dev/null
echo "$LIST" | jq -e '.[0] | has("secret") | not' >/dev/null || fail "list leaked secret"
ok "GET /v1/keys (list, no secrets)"

REVEAL="$(curl -sf "$BASE/v1/keys/$KEY_ID" -H "authorization: Bearer $TOKEN")"
echo "$REVEAL" | json_get '.secret == "sk-smoke-not-real-0001"' >/dev/null
ok "GET /v1/keys/:id (reveal)"

curl -sf -X PUT "$BASE/v1/keys/$KEY_ID" "${AUTH[@]}" \
  -d "{\"provider\":\"openai\",\"label\":\"smoke-demo\",\"secret\":\"sk-smoke-updated-0002\",\"tags\":[\"smoke\"],\"favorite\":false}" \
  | json_get '.id == "'"$KEY_ID"'"' >/dev/null
ok "PUT /v1/keys/:id"

echo "-- bulk-delete + re-create"
# create a second key then bulk-delete both after export tests
CREATE2="$(curl -sf -X POST "$BASE/v1/keys" "${AUTH[@]}" \
  -d '{"provider":"anthropic","label":"smoke-2","secret":"sk-ant-smoke-0003"}')"
KEY2="$(echo "$CREATE2" | json_get '.id')"
ok "second key created"

echo "-- export env / json"
ENV_OUT="$(curl -sf -X POST "$BASE/v1/export/env" -H "authorization: Bearer $TOKEN")"
echo "$ENV_OUT" | json_get '.ok == true' >/dev/null
echo "$ENV_OUT" | json_get '.env | length > 0' >/dev/null
# env export intentionally contains secrets — only assert shape here
ok "POST /v1/export/env"

JSON_EXP="$(curl -sf -X POST "$BASE/v1/export/json" "${AUTH[@]}" \
  -d "{\"export_passphrase\":\"$EXPORT_PASS\"}")"
echo "$JSON_EXP" | json_get '.ok == true' >/dev/null
echo "$JSON_EXP" | json_get '.encrypted_under == "export_passphrase"' >/dev/null
echo "$JSON_EXP" | json_get '.blob.v == 1' >/dev/null
echo "$JSON_EXP" | json_get '.blob.kdf == "argon2id"' >/dev/null
echo "$JSON_EXP" | json_get '.blob.aead == "xchacha20poly1305"' >/dev/null
# Ensure master secrets are not in cleartext in the export response
echo "$JSON_EXP" | grep -q 'sk-smoke' && fail "export/json leaked plaintext secret" || true
echo "$JSON_EXP" | jq -e '.blob.ciphertext_b64 | length > 20' >/dev/null
ok "POST /v1/export/json (portable VaultBlob)"

echo "-- import env"
IMP="$(curl -sf -X POST "$BASE/v1/import/env" "${AUTH[@]}" \
  -d '{"text":"CUSTOM_SMOKE_KEY=smk-imported-value-99\n# comment\n"}')"
echo "$IMP" | json_get '.added >= 1' >/dev/null
ok "POST /v1/import/env"

echo "-- audit (categories, no secret leakage)"
AUD="$(curl -sf "$BASE/v1/audit" -H "authorization: Bearer $TOKEN")"
echo "$AUD" | json_get '.ok == true' >/dev/null
echo "$AUD" | json_get '.events | length > 0' >/dev/null
# every event should have category
echo "$AUD" | jq -e '[.events[] | select(.category == null)] | length == 0' >/dev/null \
  || fail "audit events missing category"
# must not contain the real secrets we used
echo "$AUD" | grep -E 'sk-smoke-not-real|sk-smoke-updated|smk-imported' \
  && fail "audit log leaked secrets" || true
ok "GET /v1/audit (categories present, no secrets)"

echo "-- bulk-delete"
BD="$(curl -sf -X POST "$BASE/v1/keys/bulk-delete" "${AUTH[@]}" \
  -d "{\"ids\":[\"$KEY_ID\",\"$KEY2\"]}")"
echo "$BD" | json_get '.removed >= 1' >/dev/null
ok "POST /v1/keys/bulk-delete"

echo "-- change-passphrase"
NEW_PASS='correct horse battery staple smoke v2'
curl -sf -X POST "$BASE/v1/vault/change-passphrase" "${AUTH[@]}" \
  -d "{\"current_passphrase\":\"$PASS\",\"new_passphrase\":\"$NEW_PASS\"}" \
  | json_get '.ok == true' >/dev/null
ok "POST /v1/vault/change-passphrase"
PASS="$NEW_PASS"

echo "-- lock"
curl -sf -X POST "$BASE/v1/vault/lock" -H "authorization: Bearer $TOKEN" \
  | json_get '.ok == true' >/dev/null
S2="$(curl -sf "$BASE/v1/status")"
echo "$S2" | json_get '.unlocked == false' >/dev/null
# old token must fail
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$BASE/v1/keys" -H "authorization: Bearer $TOKEN")"
[[ "$CODE" == "401" ]] || fail "expected 401 after lock, got $CODE"
ok "POST /v1/vault/lock"

echo "-- wrong unlock"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/v1/vault/unlock" \
  -H 'content-type: application/json' \
  -d '{"passphrase":"wrong passphrase that is long enough!!"}')"
[[ "$CODE" == "401" ]] || fail "expected 401 on bad unlock, got $CODE"
ok "bad unlock → 401"

echo "-- re-unlock + wipe"
curl -sf -X POST "$BASE/v1/vault/unlock" \
  -H 'content-type: application/json' \
  -d "{\"passphrase\":\"$PASS\"}" | json_get '.ok == true' >/dev/null
curl -sf -X POST "$BASE/v1/vault/wipe" \
  -H 'content-type: application/json' \
  -d "{\"passphrase\":\"$PASS\",\"confirm\":\"WIPE\"}" \
  | json_get '.ok == true' >/dev/null
S3="$(curl -sf "$BASE/v1/status")"
echo "$S3" | json_get '.exists == false' >/dev/null
ok "POST /v1/vault/wipe"

# Offline status after wipe
OFF2="$("$BIN" status --data-dir "$TMPDIR")"
echo "$OFF2" | json_get '.exists == false' >/dev/null
ok "offline status after wipe"

echo ""
echo "ALL SMOKE CHECKS PASSED"
echo "  base=$BASE data=$TMPDIR (cleaned on exit)"
