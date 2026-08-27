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
| `zoth-vault-daemon-linux-x86_64` | Linux x86_64 ELF Binary | 2.4 MB | `d1906421413db54b0b2683c76d8daac9314413bde217f2f44c4ddd0bc2588804` |
| `zoth-vault-daemon-v0.1.0-linux-x86_64.tar.gz` | Linux x86_64 Archive (tar.gz) | 1.1 MB | `e045cc639a877b0e2f147a32aac72b291149cf94b0e934f6f717d5f1fed26496` |
| `zoth-vault-daemon-windows-x86_64.exe` | Windows x86_64 Native PE Binary | 2.3 MB | `7c3ad6ff574761a84d38f5a11bd505a09b4570ab0a6467daa57145a3712534e8` |
| `zoth-vault-daemon-v0.1.0-windows-x86_64.zip` | Windows x86_64 Archive (.zip) | 1.1 MB | `7c33a44abb8d611f86717cd9051c0abac174ab43a2020885e67cdcd849622c34` |
| `zoth-windows-x86_64.exe` | Windows x86_64 Self-Extracting Executable | 77 MB | `84fead88d515877788a8baf33a49424e25530a428f895bc6031e59e8ff57824d` |
| `zoth-studio-v2.6.0-windows-x86_64.zip` | Windows x86_64 Standalone Portable ZIP | 88 MB | `7d7fef03f3b407b31dba38b9c8cfb45e77485a69209ed2bb3aa5f1386810b2a6` |

---

### 🚀 1-Minute Bootstrap
```bash
# Download and run binary directly
curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/core-app/public/install.sh | bash

# Launch full TUI cockpit
zoth tui
```
