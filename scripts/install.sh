#!/usr/bin/env bash
# ==============================================================================
# ZOTH STUDIO — One-Line Universal Local Installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.sh | bash
# ==============================================================================
set -euo pipefail

echo "============================================================"
echo "⚡ ZOTH STUDIO v2.6.0 — Local-First AI Agent Powerhouse"
echo "   100% Free · Sovereign · Zero Cloud Telemetry"
echo "============================================================"

DEST="${ZOTH_INSTALL_DIR:-$HOME/.local/share/zoth-studio}"
BIN_DIR="$HOME/.local/bin"
mkdir -p "$DEST" "$BIN_DIR"

if command -v git >/dev/null 2>&1; then
  if [ -d "$DEST/.git" ]; then
    echo "Updating existing Zoth Studio in $DEST..."
    (cd "$DEST" && git pull --quiet origin main || true)
  else
    echo "Cloning Zoth Studio into $DEST..."
    git clone --depth 1 https://github.com/NullAITech/zoth-studio.git "$DEST"
  fi
else
  echo "Downloading standalone release bundle..."
  TMP_TAR="$(mktemp -t zoth-tar-XXXXXX.tar.gz)"
  curl -fsSL "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/zoth-studio-v2.6.0-linux-x86_64.tar.gz" -o "$TMP_TAR"
  tar -xzf "$TMP_TAR" -C "$DEST" --strip-components=1
  rm -f "$TMP_TAR"
fi

# Ensure launchers are executable
chmod +x "$DEST/scripts/zoth-start.sh" "$DEST/scripts/deps-debian.sh" 2>/dev/null || true
ln -sf "$DEST/scripts/zoth-start.sh" "$BIN_DIR/zoth" 2>/dev/null || true

echo ""
echo "============================================================"
echo "🎉 ZOTH STUDIO INSTALLED SUCCESSFULLY!"
echo ""
echo "To start your local AI studio deck:"
echo "  zoth"
echo "or:"
echo "  cd $DEST && ./scripts/zoth-start.sh"
echo ""
echo "Operator Deck: http://127.0.0.1:8484/"
echo "Public Hub:    http://127.0.0.1:8088/"
echo "============================================================"
