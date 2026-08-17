# Zoth Studio dependencies

First step toward a Windows / macOS / Linux app: **know what the deck needs**, and install it on Debian/Ubuntu before we wrap a `.deb` or a binary.

The whole *workspace* (133 other projects) is **not** the product. The shippable app is:

| Piece | Needs |
|-------|--------|
| Studio deck `:8484` | Python 3.10+, git, curl, Starlette/Uvicorn |
| Deck UI | Prebuilt `dashboard/dist` (Node only if you rebuild) |
| Public hub `:8088` | Docker + nginx **or** `python3 -m http.server` |
| Drive / GitHub tools | rclone, `gh` or a token |
| Vault daemon `:8787` | Rust (optional — UI works without it) |
| Local models | Ollama (optional) |

Tokens stay on the machine (BYOK). Never bake them into an installer.

## Debian / Ubuntu

```bash
cd /path/to/zoth
chmod +x scripts/deps-debian.sh scripts/zoth-start.sh
./scripts/deps-debian.sh              # report
./scripts/deps-debian.sh --install    # apt + pip
./scripts/zoth-start.sh               # http://127.0.0.1:8484/
./scripts/zoth-start.sh --hub         # plus http://127.0.0.1:8088/
```

Same check from the orchestrator:

```bash
cd "tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py deps
python3 orchestrator.py deps --install   # pip only
```

In chat: `/doctor` or `/deps`.

## Catalog

| id | Tier | Debian packages | Official docs |
|----|------|-----------------|---------------|
| python3 | required | `python3 python3-venv python3-pip python3-dev` | https://www.python.org/downloads/ |
| git | required | `git` | https://git-scm.com/downloads |
| curl | required | `curl ca-certificates` | https://curl.se/download.html |
| starlette | required | pip: `starlette uvicorn` | https://www.starlette.io/ |
| dashboard | required | prebuilt `dashboard/dist` | rebuild: https://nodejs.org/ |
| node | recommended | `nodejs npm` (or NodeSource) | https://nodejs.org/en/download |
| docker | recommended | `docker.io docker-compose-v2` | https://docs.docker.com/engine/install/ubuntu/ |
| rclone | recommended | `rclone` | https://rclone.org/install/ |
| gh | recommended | `gh` | https://cli.github.com/ |
| rust | optional | `cargo rustc` or rustup | https://rustup.rs/ |
| ollama | optional | installer script | https://ollama.com/download/linux |
| ffmpeg | optional | `ffmpeg` | https://ffmpeg.org/download.html |
| build-essential | optional | `build-essential pkg-config libssl-dev` | Debian build-essential |

Python modules live in `tools/null ai agent tools/local_null_ai_orchestrator/requirements.txt`.

## Next (not this pass)

See `PACKAGING.md`: `.deb` for Debian/Ubuntu, then a single-folder binary for macOS and Windows. Those wrappers will call this same catalog so we never ship a silent missing-library failure.
