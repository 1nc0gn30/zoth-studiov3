#!/usr/bin/env bash
# ==============================================================================
# ZOTH STUDIO — One-Line Universal Local Installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.sh | bash
#   ./scripts/install.sh --unattended
# ==============================================================================
set -euo pipefail

UNATTENDED="${ZOTH_UNATTENDED:-0}"
DEST="${ZOTH_INSTALL_DIR:-$HOME/.local/share/zoth-studio}"
BIN_DIR="${ZOTH_BIN_DIR:-$HOME/.local/bin}"
BRANCH="${ZOTH_BRANCH:-main}"

if [ "${CI:-}" = "true" ] || [ "${CI:-}" = "1" ] || [ "${DEBIAN_FRONTEND:-}" = "noninteractive" ] || [ ! -t 0 ]; then
  UNATTENDED=1
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes|-u|--unattended|--no-prompt|--non-interactive)
      UNATTENDED=1
      shift
      ;;
    -d|--dir|--install-dir)
      DEST="$2"
      shift 2
      ;;
    --bin-dir)
      BIN_DIR="$2"
      shift 2
      ;;
    -b|--branch)
      BRANCH="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [ "$UNATTENDED" -eq 1 ]; then
  export GIT_TERMINAL_PROMPT=0
fi

echo "============================================================"
echo "⚡ ZOTH STUDIO — Local-First AI Agent Powerhouse"
echo "   100% Free · Sovereign · Zero Cloud Telemetry"
echo "============================================================"

mkdir -p "$DEST" "$BIN_DIR"

if command -v git >/dev/null 2>&1; then
  if [ -d "$DEST/.git" ]; then
    echo "Updating existing Zoth Studio in $DEST..."
    (cd "$DEST" && git fetch origin "$BRANCH" && git pull --ff-only origin "$BRANCH" || git pull origin "$BRANCH" || true)
  else
    echo "Cloning Zoth Studio ($BRANCH) into $DEST..."
    git clone --depth 1 --branch "$BRANCH" https://github.com/NullAITech/zoth-studio.git "$DEST"
  fi
else
  echo "Downloading standalone release bundle..."
  TMP_TAR="$(mktemp -t zoth-tar-XXXXXX.tar.gz)"
  curl -fsSL "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/zoth-studio-v2.6.0-linux-x86_64.tar.gz" -o "$TMP_TAR"
  tar -xzf "$TMP_TAR" -C "$DEST" --strip-components=1
  rm -f "$TMP_TAR"
fi

# Ensure launchers are executable & link CLI
CLI_SRC=""
if [ -f "$DEST/core-app/bin/zoth" ]; then
  CLI_SRC="$DEST/core-app/bin/zoth"
elif [ -f "$DEST/bin/zoth" ]; then
  CLI_SRC="$DEST/bin/zoth"
elif [ -f "$DEST/scripts/zoth-start.sh" ]; then
  CLI_SRC="$DEST/scripts/zoth-start.sh"
fi

if [ -n "$CLI_SRC" ]; then
  chmod +x "$CLI_SRC" 2>/dev/null || true
  ln -sf "$CLI_SRC" "$BIN_DIR/zoth" 2>/dev/null || true
fi

chmod +x "$DEST"/scripts/*.sh 2>/dev/null || true

echo ""
echo "============================================================"
echo "🎉 ZOTH STUDIO INSTALLED SUCCESSFULLY!"
echo ""
echo "To start your local AI studio deck:"
echo "  zoth status"
echo "  zoth tui"
echo "  zoth update"
echo "  zoth start"
echo ""
echo "Operator Deck: http://127.0.0.1:8484/"
echo "Public Hub:    http://127.0.0.1:8088/"
echo "============================================================"

