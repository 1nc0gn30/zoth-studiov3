# ⚡ Zoth Studio v0.1.0 — Sovereign AI Multi-Agent Workstation

### 🔐 Sovereign Rust Key Vault (`zoth-vault-daemon`)
- **Memory-Hard KDF:** RFC 9106 Argon2id v19 ($m=64\text{ MiB}, t=3, p=4$).
- **Symmetric Encryption:** Authenticated XChaCha20-Poly1305 stream cipher with 192-bit random nonces.
- **Volatile RAM Zeroization:** Integrated `ZeroizeOnDrop` ensuring plaintext secrets are overwritten with `0x00` on memory drop.
- **Port:** Localhost loopback `:8787` (`0.0.0.0` exposure strictly prevented).

---

### 📦 Release Assets & Checksums

| Asset | Platform / Architecture | Size | SHA256 Hash |
| :--- | :--- | :--- | :--- |
| `zoth-vault-daemon-linux-x86_64` | Linux x86_64 ELF | 2.4 MB | `d1906421413db54b0b2683c76d8daac9314413bde217f2f44c4ddd0bc2588804` |
| `zoth-vault-daemon-v0.1.0-linux-x86_64.tar.gz` | Linux Archive (tar.gz) | 1.1 MB | `9a2c56fda1c148a8c6ca9145154f594e694c4e52af395d82d5aab43e853b8b28` |

---

### 🚀 1-Minute Bootstrap
```bash
# Download and run binary directly
curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/core-app/public/install.sh | bash

# Launch full TUI cockpit
zoth tui
```
