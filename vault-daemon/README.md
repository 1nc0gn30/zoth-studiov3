# zoth-vault-daemon

**Rust** local-only BYOK vault backend. This is the real security boundary — the browser UI is a client.

## Threat model (honest)

| Protected | Not protected |
|-----------|----------------|
| At-rest secrets (Argon2id + XChaCha20-Poly1305) | Malware with your user privileges / unlocked session |
| Network exposure (loopback bind by default) | Shoulder-surfing while unlocked |
| Brute-force offline (memory-hard KDF) | You writing secrets into chat logs |
| Accidental list leaks (masks only) | Compromised browser extension while session live |
| Audit trail of reveals/exports | Physical access to unlocked machine |

If you need multi-user cloud KMS, this is the wrong tool. This is **operator laptop vault**.

## Crypto

- **KDF:** Argon2id · m=64 MiB · t=3 · p=1 · 32-byte key
- **AEAD:** XChaCha20-Poly1305 · random 24-byte nonce · AAD bound to alg version
- **Sessions:** 32-byte hex tokens · constant-time compare · TTL + idle lock
- **Memory:** passphrase/`MasterKey` zeroized on drop
- **Disk:** `vault.zoth` mode `0600`, data dir `0700`, best-effort wipe on destroy

## Run

```bash
cd 13-creative-media/zoth/vault-daemon
cargo run --release -- --port 8787
```

Health: http://127.0.0.1:8787/health  
Data default: `~/.local/share/zoth-vault-daemon/` (or platform equivalent)

```bash
# custom data dir
cargo run --release -- --data-dir /path/to/vault-data --port 8787

# env
ZOTH_VAULT_PORT=8787 ZOTH_VAULT_DATA=./data cargo run --release

# convenience launcher
./scripts/run-local.sh
```

**Never** pass `--i-understand-network-risk` unless you fully accept binding off-loopback.

### Offline status (no server)

```bash
# JSON report: exists, vault mode, data-dir mode, size — never unlocks, never prints secrets
cargo run --release -- status
cargo run --release -- status --data-dir /path/to/vault-data
```

## API (all localhost)

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/health` | — | liveness + security headers |
| GET | `/v1/status` | — | exists / unlocked / TTL / file mode |
| GET | `/v1/security` | — | posture score + checks (A–D) |
| GET | `/v1/session` | Bearer | remaining TTL, counts |
| POST | `/v1/session` | Bearer | keep-alive (touch idle) |
| GET | `/v1/audit` | Bearer | last 50 events (no secrets; includes `category`) |
| POST | `/v1/vault/init` | — | `{ "passphrase": "…" }` min 12 chars |
| POST | `/v1/vault/unlock` | — | returns `session_token` |
| POST | `/v1/vault/lock` | Bearer | zeroizes session |
| POST | `/v1/vault/change-passphrase` | Bearer | rotate master pass |
| POST | `/v1/vault/wipe` | — | `{ passphrase, confirm: "WIPE" }` |
| GET | `/v1/keys` | Bearer | **metadata + masks only** |
| GET | `/v1/keys/:id` | Bearer | **reveals secret** (audited) |
| POST | `/v1/keys` | Bearer | create **or upsert** by id |
| PUT | `/v1/keys/:id` | Bearer | update |
| DELETE | `/v1/keys/:id` | Bearer | delete |
| POST | `/v1/keys/bulk-delete` | Bearer | `{ "ids": [...] }` |
| POST | `/v1/export/env` | Bearer | full `.env` plaintext (audited) |
| POST | `/v1/export/json` | Bearer | portable encrypted `VaultBlob` under **export passphrase** |
| POST | `/v1/import/env` | Bearer | `{ "text": "KEY=…" }` |

Unlock fails → rate limit → HTTP 429 lockout after 5 failures.

### `POST /v1/export/json` — portable backup

Re-encrypts the **current unlocked vault payload** with a **new** passphrase you supply (not the master vault passphrase). Useful for backups you can restore elsewhere without sharing the live master password.

```bash
curl -s -X POST http://127.0.0.1:8787/v1/export/json \
  -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"export_passphrase":"backup passphrase here"}'
```

Response shape:

```json
{
  "ok": true,
  "format": "zoth-vault-blob-v1",
  "encrypted_under": "export_passphrase",
  "blob": {
    "v": 1,
    "kdf": "argon2id",
    "aead": "xchacha20poly1305",
    "salt_b64": "...",
    "nonce_b64": "...",
    "ciphertext_b64": "...",
    "argon2_m_kib": 65536,
    "argon2_t": 3,
    "argon2_p": 1
  }
}
```

Decrypt offline with the same Argon2id + XChaCha20-Poly1305 envelope as `vault.zoth` (`crypto::decrypt_blob`). `export_passphrase` min length: 12.

### Audit events

Each audit line is JSON with:

| Field | Meaning |
|-------|---------|
| `ts` | RFC3339 timestamp |
| `category` | prefix of action: `vault`, `key`, `export`, `import`, … |
| `action` | dotted name e.g. `key.reveal`, `export.json` |
| `key_id` | optional key id (never the secret) |
| `detail` | short non-secret note |

Secrets are never written to the audit log.

## Quick curl test

```bash
curl -s http://127.0.0.1:8787/health
curl -s -X POST http://127.0.0.1:8787/v1/vault/init \
  -H 'content-type: application/json' \
  -d '{"passphrase":"correct horse battery staple test"}'
TOKEN=$(curl -s -X POST http://127.0.0.1:8787/v1/vault/unlock \
  -H 'content-type: application/json' \
  -d '{"passphrase":"correct horse battery staple test"}' | jq -r .session_token)
curl -s -X POST http://127.0.0.1:8787/v1/keys \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"provider":"openai","label":"demo","secret":"sk-demo-not-real-0001"}'
curl -s http://127.0.0.1:8787/v1/keys -H "authorization: Bearer $TOKEN"
```

## Tests & smoke

```bash
# Unit tests (crypto roundtrip, store temp-dir roundtrip, mask_secret, session lockout)
cargo test --release

# Release binary
cargo build --release

# Full HTTP smoke (spawns temp daemon, curls all endpoints, wipes)
./scripts/smoke.sh
```

`scripts/smoke.sh` needs `jq` and a free loopback port (default `18787`, override with `ZOTH_SMOKE_PORT`).

## Frontend

The vault UI at `/vault/` probes `http://127.0.0.1:8787` and prefers the daemon when online; falls back to browser `localStorage` encryption if the daemon is down.
