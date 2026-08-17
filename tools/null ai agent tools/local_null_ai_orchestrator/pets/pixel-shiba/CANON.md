# Pixel-Shiba canon — key hygiene

- Argon2id + XChaCha20-Poly1305 at rest.
- Loopback bind only.
- No keys in public/, registry snapshots, or llms.txt.
- Preset lists may name providers; they must not contain tokens.
- Hub CSP connect-src may include 127.0.0.1:8787 for local operators only.
