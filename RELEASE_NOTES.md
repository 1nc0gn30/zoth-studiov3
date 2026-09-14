# ⚡ Zoth Studio v6.7.0 — Sovereign Multi-Agent Workstation

Local-first AI workstation: public hub, private operator deck, encrypted key
vault, and a full tool orchestrator. This release restores the **complete
cross-platform artifact suite** — Linux, Windows, macOS, and Android — for the
first time since v4.6.0.

---

## 🆕 What's in this release

### 🐧 Linux suite (full)
- `zoth-studio_*_all.deb` — native Debian/Ubuntu/Parrot/Kali package
- `zoth-linux-x86_64.run` — self-extracting single-file executable
- `zoth-studio-v*-linux-x86_64.tar.gz` — portable tarball
- `Zoth_Studio-v*-x86_64.AppImage` — portable AppImage

### 🪟 Windows suite (full)
- `zoth-studio-v*-windows-x86_64.zip` — standalone portable ZIP
- `zoth-windows-x86_64.exe` — self-extracting launcher
- `zoth-vault-daemon-windows-x86_64.exe` — vault daemon (native PE)

### 🍎 macOS suite
- `zoth-studio-v*-macos-universal.tar.gz` — universal payload
- `zoth-studio-v*-macos.zip`

### 🤖 Android
- `zoth-signal-bridge-*-android.apk` — Zoth Signal Bridge (Kotlin + Jetpack
  Compose). Ships the pantheon roster, consensus arena, soundboard, notes
  reviewer, and an in-app studio WebView bridge.

### 🔐 Sovereign Rust Key Vault (`zoth-vault-daemon`)
- **Memory-hard KDF:** RFC 9106 Argon2id v19 (`m=64 MiB, t=3, p=4`).
- **Symmetric encryption:** authenticated XChaCha20-Poly1305, 192-bit random nonces.
- **Volatile RAM zeroization:** `ZeroizeOnDrop` overwrites plaintext secrets on drop.
- **Loopback only:** binds `127.0.0.1:8787`; `0.0.0.0` exposure is refused.

---

## 🔧 Release-pipeline fixes in this version

Earlier releases published vault-daemon binaries only. Root cause and fixes:

1. **Wrong path prefixes** — the workflow referenced `core-app/...`, but on
   GitHub the repository root *is* `core-app/`. Every packaging step therefore
   resolved to a non-existent directory and silently no-opped. Paths are now
   repo-root relative.
2. **Silent build failures** — packaging steps were wrapped in `|| true`, so
   failures exited zero and produced empty release sections. Steps now run with
   `set -euo pipefail` and a final suite check fails the job if any platform
   directory is empty.
3. **Missing build manifests** — `.buildignore` (required by
   `rsync --exclude-from`) was gitignored. It is now tracked.
4. **Swallowed Gradle sources** — a `models/` rule meant for LLM weights also
   matched the Android Kotlin data models. Negated for the Android tree.
5. **Unguarded prerequisites** — `registry.local.json` (local-only, absent on
   CI) and `dashboard/dist` are now optional; the orchestrator self-generates
   its registry on first `scan`.
6. **Brittle checksum step** — replaced bare globs with a `find`-based pass that
   always emits `SHA256SUMS.txt`.

---

## ✅ Verify your download

```bash
sha256sum -c SHA256SUMS.txt
```

Every asset is covered by `SHA256SUMS.txt` attached to this release.

---

## 🚀 1-Minute Bootstrap

```bash
# Linux — install script
curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/public/install.sh | bash

# Launch the operator deck
zoth
```

Canonical local commands:

```bash
./start-zoth-studio.sh --with-bridge --with-vault   # full workspace
zoth doctor                                          # health + dependency audit
```

---

## 🔒 Security posture

- Private surfaces (operator deck `:8484`, vault `:8787`, hardware bridge `:8585`)
  are **loopback-only** and must never be proxied through a public tunnel.
- Packaged payloads are scrubbed of personal paths and conversation data, and
  the Linux build aborts outright if a staged payload contains private keys,
  secret files, or PII.
