# ⚡ Zoth Studio v6.7.0 — Sovereign Multi-Agent Workstation

Local-first AI workstation: public hub, private operator deck, encrypted key
vault, and a full tool orchestrator. This release restores the **complete
cross-platform artifact suite** — Linux, Windows, macOS and Android — for the
first time since v4.6.0, and is the first release ever to ship an Android APK.

---

## 🆕 In this release

### 🤖 Android — first APK ever published
`zoth-signal-bridge-6.7.0-android.apk` (~94 MB). The Zoth Signal Bridge
(Kotlin + Jetpack Compose): pantheon roster, consensus arena, soundboard, notes
reviewer and an in-app studio WebView bridge.

The Android project previously lived **outside version control**, which is why
the APK step silently no-opped on every prior run. It is now part of this repo
(build output and `local.properties` stay gitignored) with versionCode 7 /
versionName 6.7.0.

### 🐧 Linux suite
- `zoth-studio_6.7.0_all.deb` — native Debian/Ubuntu/Parrot/Kali package (~650 MB)
- `zoth-linux-x86_64.run` — self-extracting single-file executable (~918 MB)
- `zoth-studio-v6.7.0-linux-x86_64.tar.gz` — portable tarball (~679 MB)
- `Zoth_Studio-v6.7.0-x86_64.AppImage` — portable AppImage (~602 MB)

### 🪟 Windows suite
- `zoth-studio-v6.7.0-windows-x86_64.zip` — standalone portable ZIP (~678 MB)
- `zoth-windows-package.zip` — identical fallback copy (see limitations)
- `zoth-vault-daemon-windows-x86_64.exe` — vault daemon, native PE (~2.4 MB)

### 🍎 macOS suite
- `zoth-studio-v6.7.0-macos-universal.tar.gz` (~680 MB)
- `zoth-studio-v6.7.0-macos.zip` (~681 MB)

### 🔐 Sovereign Rust Key Vault (`zoth-vault-daemon`)
- **Memory-hard KDF:** RFC 9106 Argon2id v19 (`m=64 MiB, t=3, p=4`)
- **Authenticated encryption:** XChaCha20-Poly1305, 192-bit random nonces
- **Volatile RAM zeroization:** `ZeroizeOnDrop` overwrites plaintext secrets on drop
- **Loopback only:** binds `127.0.0.1:8787`; `0.0.0.0` exposure is refused

---

## 🔧 Release-pipeline repairs (why earlier releases shipped so little)

Every release since v4.6.0 published vault-daemon binaries only. Root causes,
all found by reading the packagers rather than guessing:

1. **Wrong path prefixes** — the workflow referenced `core-app/...`, but on
   GitHub the repository root *is* `core-app`. Every packaging step resolved to
   a non-existent directory and no-opped behind `|| true`.
2. **An unbuildable privacy gate** — `build-linux-packages.sh` aborted *every*
   build unconditionally: its PII check listed `"."` and `"~"` as fixed-string
   grep patterns, which match virtually every file in a staged payload, so
   `LEAK_FOUND=1` forced `exit 1` before any artifact existed.
3. **Incomplete payload scrubbing** — the scrub only neutralised `./` and `~/`
   paths, so absolute local filesystem paths passed straight into shipped
   artifacts.
4. **Silent failures** — packaging was wrapped in `|| true`, so broken builds
   exited zero and produced empty release sections. Steps now run under
   `set -euo pipefail` with a final check that fails the job if any platform
   directory is empty.
5. **Missing build inputs** — `.buildignore` (required by `rsync
   --exclude-from`) was gitignored, and a `models/` rule meant for LLM weights
   was silently stripping the Android Kotlin data models.
6. **Missing CI tools** — `squashfs-tools` (`mksquashfs` is fatal in the AppImage
   step) and 7z resolution for the Windows packer.
7. **Brittle checksum step** — bare globs replaced with a `find`-based pass that
   always writes `SHA256SUMS.txt`. This is what killed the v6.6.0 job.

---

## ⚠️ Known limitations

- **Windows self-extracting `.exe` launcher is not produced in this build.**
  The packager needs a 7z SFX stub that is not present on the CI runner, so it
  degrades to the portable ZIP by design (`zoth-windows-package.zip`) rather than
  failing the release. The native `zoth-vault-daemon-windows-x86_64.exe` *is*
  included.
- Text-to-video asset generation is not wired up (no video-provider credentials
  configured), so the new showcase reel in this cycle is a re-cut of existing
  Azoth footage rather than freshly generated footage.

---

## ✅ Verify your download

```bash
sha256sum -c SHA256SUMS.txt
```

Every asset is covered by `SHA256SUMS.txt` attached to this release.

---

## 🚀 1-Minute Bootstrap

```bash
curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/public/install.sh | bash
zoth
```

---

## 🔒 Security posture

- Private surfaces (operator deck `:8484`, vault `:8787`, hardware bridge `:8585`)
  are **loopback-only** and must never be proxied through a public tunnel.
- Packaged payloads are scrubbed of personal paths and conversation data; the
  Linux build aborts if a staged payload contains private keys, secret files or
  PII.
- `/workspaces/*` and `/data/memories.json` are now denied at the edge and
  excluded from release payloads: that directory held session prompts and
  absolute local paths and was publicly readable.
