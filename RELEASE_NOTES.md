# Zoth Studio — Release Notes

## v12.0.0 — September 18, 2026

### 🔥 Major New Features

- **Cyberpunk Tactical HUD** — Full-viewport multi-panel cockpit with 360° radar, oscilloscope, 6-pillar telemetry math engine, and real-time loopback daemon monitoring. Mobile: zero-text symbol buttons (🚀 Studio, 🎛️ Tactical) with true edge-to-edge fullscreen popups.
- **Mobile Fullscreen Popup Architecture** — All mobile HUD sheets now open edge-to-edge (100vw × 100dvh, top:0, no border-radius). Nested slide navigation with 48px header + 44px slide nav bar.
- **Global Fuzzy Command Palette** (Ctrl+K) — Instant search across 298+ tools, 21 agents, 9 flagship workstations, 4 themes, and sensory toggles.
- **Multi-Agent REPL Debate Simulator** — Terminal commands: `debate <topic>`, `swarm <query>`, `synthesize <topic>`. Authentic agent personas: Athena (strategic), Draco (red team), Azoth (synthesis), Hermes (delivery). Staggered stream output with consensus synthesis card.
- **OmniPost Sovereign Social Engine** — Live multi-platform preview cards (X/Twitter threads, Warpcast, Bluesky, LinkedIn, Signal). AI tone-shifters: Azoth Alchemical, Hermes Pragmatic, Grok Unfiltered, Lycan Tactical.
- **Nexus-3D Procedural Shaders** — 5 new presets: Hologram Grid, Azoth Gold Leaf, Obsidian Matte, Neon Edge Wireframe, Bioluminescent Pulse. 1-click GLTF/USDZ exporter and 4K/1080p WebCodecs turnaround recorder.
- **Netrunner 3D Memory Graph** — Interactive force-directed synaptic graph connected to Lucy daemon (:8788). Particle link pulses, agent/tag filtering, Obsidian Markdown dossier export.
- **Android App v12.0.0** — 6 new flagship workstations added to presets, version bumped to 12.0.0.

### ✅ Quality

- **30/30 tests passing** in `zoth-cyberpunk-hud.test.js`
- Zero text overlap on mobile — symbol-only top bar
- Full 4-theme system support across all new workstations

### 🛠️ Technical

- Cyberpunk HUD CSS: 7400+ lines with semantic classes for all UI components
- HUD JS: 8400+ lines — Command Palette, REPL Debate Simulator, toast notification system, keyboard shortcut matrix
- Telemetry pillar progress bars with animated fill transitions
- Swarm agent cards with CSS-driven active/hover states

### 🐧 Linux suite

- `zoth-studio_12.0.0_all.deb` — native Debian/Ubuntu/Parrot/Kali package
- `zoth-linux-x86_64.run` — self-extracting single-file executable
- `zoth-studio-v12.0.0-linux-x86_64.tar.gz` — portable tarball
- `Zoth_Studio-v12.0.0-x86_64.AppImage` — portable AppImage

### 🪟 Windows suite

- `zoth-studio-v12.0.0-windows-x86_64.zip` — standalone portable ZIP
- `zoth-vault-daemon-windows-x86_64.exe` — native Rust Argon2id PE binary

### 🍎 macOS suite

- `zoth-studio-v12.0.0-macos-universal.tar.gz`
- `zoth-studio-v12.0.0-macos.zip`

### 🤖 Android

- `zoth-signal-bridge-v12.0.0-android.apk` — Kotlin + Jetpack Compose: 6 new flagship workstation presets, versionCode 12 / versionName 12.0.0

### ✅ Verify your download

```bash
sha256sum -c SHA256SUMS.txt
```

---

## v11.0.0 — September 12, 2026

...(previous entries preserved below)

---

# ⚡ Zoth Studio v6.8.0 — Sovereign Multi-Agent Workstation

Local-first AI workstation: public hub, private operator deck, encrypted key
vault, biomorphic STDP memory matrix, and full 23-tool orchestrator suite.
This release features a complete overhaul across all 23 studio workstations,
AAA Cyberpunk HUD dock, biomorphic netrunner memory matrix, vector icon architecture,
governance specifications, and automated cross-platform artifact suite (Linux, Windows, macOS, Android APK).

---

## 🆕 In this release (v6.8.0)

### 🎨 Studio Workstations & UI Elevation
- Comprehensive UI elevation across all 23 studio workstations with 4-theme token systems (Cyberpunk, Matrix Neon, Minimalist, High Contrast).
- AAA Cyberpunk Floating Dock with responsive vector SVG iconography, keyboard shortcuts (`Alt+1..5`, `Alt+H`, `Alt+P`), and zero-layout-shift drawer mechanics.
- Pet HUD Mascot system with ergonomic anti-collision positioning, mobile viewport elevation, and procedural Web Audio SFX.
- Biomorphic Netrunner Memory Whitespace Matrix (`/studio/netrunner-memory.html`) with dual-layer associative vector topology and STDP synaptic decay.

### 📜 Open Source Governance & Community Infrastructure
- Full standardized open source governance suite: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CITATION.cff`, `REPO_METADATA.md`, `.github/FUNDING.yml`, and standardized Issue/PR templates.
- Machine-readable Entity Graph (`JSON-LD`), `llms.txt`, `llms-full.txt`, and exhaustive `sitemap.xml` for AI search crawlers.

### 🤖 Android — Zoth Signal Bridge APK
`zoth-signal-bridge-6.8.0-android.apk` (Kotlin + Jetpack Compose): pantheon roster, consensus arena, soundboard, notes reviewer, and in-app studio bridge (versionCode 8 / versionName 6.8.0).

### 🐧 Linux suite
- `zoth-studio_6.8.0_all.deb` — native Debian/Ubuntu/Parrot/Kali package
- `zoth-linux-x86_64.run` — self-extracting single-file executable
- `zoth-studio-v6.8.0-linux-x86_64.tar.gz` — portable tarball
- `Zoth_Studio-v6.8.0-x86_64.AppImage` — portable AppImage

### 🪟 Windows suite
- `zoth-studio-v6.8.0-windows-x86_64.zip` — standalone portable ZIP
- `zoth-vault-daemon-windows-x86_64.exe` — native Rust Argon2id PE binary

### 🍎 macOS suite
- `zoth-studio-v6.8.0-macos-universal.tar.gz`
- `zoth-studio-v6.8.0-macos.zip`

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
