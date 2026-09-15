<div align="center">

# <img src="../assets/brand/zoth-golden-z-192.png" width="48" height="48" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" /> ZOTH STUDIO `vault-ui`

**Zero-Trust Hardware-Encrypted Sovereign Key Enclave with Argon2id & XChaCha20-Poly1305**

[![Security](https://img.shields.io/badge/security-Zero--Leak%20Client-f472b6?style=for-the-badge&logo=shield&logoColor=white)](http://127.0.0.1:8088/vault/)
[![Cryptography](https://img.shields.io/badge/crypto-Argon2id%20v19%20%7C%20m%3D64MB-fbbf24?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)
[![Airgap](https://img.shields.io/badge/airgap-Parrot%20OS%20mlock--Volatile%20RAM-10b981?style=for-the-badge&logo=linux&logoColor=white)](http://127.0.0.1:8787)

<br>

<p align="center">
  <img src="../assets/media/cyber-vault-photoreal.jpg" alt="Zoth Vault Photoreal" width="640" style="border-radius: 12px; border: 1px solid rgba(251,191,36,0.4); box-shadow: 0 0 20px rgba(251,191,36,0.3);" />
</p>

</div>

---

## 🔐 Overview

**Sovereign Key Vault** is the zero-trust, local-first cryptographic enclave for storing **BYOK API keys, private tokens, SimpleX/Matrix E2EE credentials, and sovereign seed material** without ever exposing secrets to cloud KMS providers.

Keys never leave the operator's machine. The client connects strictly over local loopback (`http://127.0.0.1:8787`) to the native Rust-based Vault Daemon, with seamless in-browser Web Crypto (AES-256-GCM volatile memory) fallback when offline.

---

## ⚡ Live Cryptographic Telemetry HUD

| Parameter | Specification | Purpose & Security Guarantee |
|:---|:---|:---|
| **KDF Algorithm** | `Argon2id v19` (RFC 9106) | Memory-hard hybrid Key Derivation Function resistant to GPU/ASIC cracking |
| **Memory Cost ($m$)** | `65,536 KiB` (64 MiB DRAM) | Enforces memory bandwidth saturation during passphrase stretching |
| **Time Cost ($t$)** | `3 Iterations` (Folds) | Multi-pass sequential matrix folding preventing rainbow table attacks |
| **Parallelism ($p$)** | `4 Parallel Lanes` | 16,384 KiB allocation per lane slice for multicore SIMD computation |
| **Authenticated Cipher** | `XChaCha20-Poly1305` | 256-bit symmetric stream cipher with extended 192-bit nonce |
| **Volatile RAM Sweeping** | `mlock()` + DoD 5220.22-M | Prevents paging to swap; instant cryptographic zeroization upon lock |

---

## ✨ Key Capabilities

| Feature | Description |
|:---|:---|
| **Cryptographic Telemetry** | Real-time Shannon entropy counter (`7.994 b/byte`), live `/dev/urandom` TRNG hex streams, and KDF benchmark runner. |
| **Auto-Detect Service** | Paste `sk-ant-…`, `gsk_…`, `sk_test_…` → instantly infers the provider with confidence score and validated envelope. |
| **Preset Packs** | 160+ presets across Agent stacks, LLMs (Anthropic, OpenAI, Grok, DeepSeek, Ollama), Vector DBs, SaaS, Indie, and Web3. |
| **Smart Paste** | Paste complete `.env` configuration files or `export KEY=…` lists to bulk import with automatic parsing. |
| **3D WebGL Crystal Viz** | Interactive Three.js particle shard viz with Orbit (`R`), Focus (`F`), and Scatter/Explode (`X`) modes. |
| **Biometric WebAuthn** | FIDO2 Hardware security key & WebAuthn biometric unlock integration. |

---

## 🎨 Full 4-Theme Visual System

Complies with the master `zoth-theme-system`:

- **Dark Void (Default)**: Deep obsidian `#050508` with radiant imperial gold accents (`#fbbf24`) and Syne/Figtree typography.
- **Light Mode**: High-contrast paper slate `#f7f9fc` with charcoal ink (`#111827`), emerald badges, and zero washed-out white text.
- **Matrix Terminal**: Phosphor green `#00ff66` on `#020d04` black with `Share Tech Mono` and matrix grid atmosphere.
- **Gold Sanctum**: Obsidian gold with `Cinzel` / `Fraunces` serif headlines and amber gradients.

---

## 🕹️ Keyboard Shortcuts

`N` New Key · `P` Presets · `/` Search Filter · `E` Export · `L` Lock Session · `R` Orbit · `F` Focus · `X` Scatter · `C` Copy · `V` Reveal · `S` Favorite · `Shift+T` Theme · `Shift+A` Annotator · `Ctrl+K` Command Palette
