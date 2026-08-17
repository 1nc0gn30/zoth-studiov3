# Packaging Zoth for Debian, then Windows and macOS

`nullai.tech` is the public domain. The **app users run** is the local deck + optional hub — not this whole disk.

## Shape of the product

```
zoth-studio/
  public/                 static hub
  dashboard/dist/         already-built UI (no Node at runtime)
  orchestrator + runtime  Python
  scripts/zoth-start.sh
  scripts/deps-*.sh
```

Out of the tarball: vault source, `node_modules`, 298-tool registry paths on *this* machine, BYOK, conversations.

## Phase 1 — now

- Dependency catalog (`runtime/deps.py`)
- Debian/Ubuntu check + install (`scripts/deps-debian.sh`)
- Start script that refuses to boot if required items are missing

## Phase 2 — Debian package

- `fpm` or a small `debian/` control set
- Depends: `python3 (>= 3.10), python3-pip, git, curl, ca-certificates`
- Recommends: `nodejs, npm, docker.io, rclone, gh`
- Postinst: `pip install -r requirements.txt` into `/usr/lib/zoth/venv`
- Binary: `/usr/bin/zoth` → `zoth-start.sh`
- User systemd unit for `:8484` on loopback only

## Phase 3 — one-folder executables

- **Linux:** PyInstaller or Briefcase around `orchestrator.py serve` + ship `dashboard/dist` + `public/`
- **Windows:** same, plus `deps-windows.ps1` (winget: Python.Python.3.12, Git.Git, rclone)
- **macOS:** Briefcase `.app` + `brew` fallbacks (python, git, rclone)

The catalog stays the source of truth. Each OS script only changes *how* to install, not *what*.

## Rules that survive packaging

- Bind `127.0.0.1` unless the user opts in
- Never ship `byok.json` or tokens
- Vault daemon is optional; UI must run without Rust
- Public hub is static files; Hostinger can host those separately (`HOSTINGER-NULLAI.md`)
