#!/usr/bin/env bash
# ==============================================================================
# Zoth Studio — Linux Universal Binary & Package Builder
# Builds:
#   1) zoth-studio_2.6.0_all.deb (Debian/Ubuntu/Parrot/Kali native package)
#   2) zoth-linux-x86_64.run (Universal self-extracting single binary executable)
#   3) zoth-studio-v2.6.0-linux-x86_64.tar.gz (Portable tarball)
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT/dist-linux"
BUILD_DIR="$(mktemp -d -t zoth-build-staging-XXXXXX)"
trap 'rm -rf "$BUILD_DIR"' EXIT
VERSION="2.6.0"
PKG_NAME="zoth-studio"
VARIANT="${VARIANT:-regular}"
if [[ "$VARIANT" == "extreme" ]]; then
  IGNORE_FILE="$ROOT/.buildignore.extreme"
  PKG_DISPLAY="Zoth Studio (Extreme Edition)"
  echo "🔥 BUILDING VARIANT: EXTREME (Church of Malware lab included in local payload)"
else
  IGNORE_FILE="$ROOT/.buildignore"
  PKG_DISPLAY="Zoth Studio"
  echo "🛡️ BUILDING VARIANT: REGULAR (Standard clean build)"
fi

echo "============================================================"
echo "⚡ $PKG_DISPLAY: LINUX COMPILATION & PACKAGING PIPELINE v$VERSION"
echo "============================================================"

# Step 1: Build React Dashboard if needed
echo "📦 Step 1: Compiling React Dashboard..."
ORCH_DIR="$ROOT/tools/null ai agent tools/local_null_ai_orchestrator"
if [[ -f "$ORCH_DIR/dashboard/package.json" ]]; then
  (cd "$ORCH_DIR/dashboard" && npm run build)
  echo "✓ React dashboard compiled into $ORCH_DIR/dashboard/dist"
fi

# Clean output directories
mkdir -p "$DIST_DIR"

# Stage payload structure
STAGE="$BUILD_DIR/$PKG_NAME"
mkdir -p "$STAGE/usr/lib/$PKG_NAME"
mkdir -p "$STAGE/usr/bin"
mkdir -p "$STAGE/usr/share/applications"
mkdir -p "$STAGE/usr/share/icons/hicolor/scalable/apps"
mkdir -p "$STAGE/usr/lib/systemd/user"
mkdir -p "$STAGE/DEBIAN"

echo "📁 Step 2: Staging clean application payload with strict .buildignore enforcement..."

# Copy public static hub using .buildignore
mkdir -p "$STAGE/usr/lib/$PKG_NAME/public"
rsync -a --exclude-from="$IGNORE_FILE" "$ROOT/public/" "$STAGE/usr/lib/$PKG_NAME/public/"

# Copy orchestrator & runtime with .buildignore
mkdir -p "$STAGE/usr/lib/$PKG_NAME/orchestrator"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/runtime" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/playbooks" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/config" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/pets" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"

mkdir -p "$STAGE/usr/lib/$PKG_NAME/orchestrator/dashboard_dist"
rsync -a "$ORCH_DIR/dashboard/dist/" "$STAGE/usr/lib/$PKG_NAME/orchestrator/dashboard_dist/"
cp "$ORCH_DIR/orchestrator.py" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
cp "$ORCH_DIR/registry.local.json" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
cp "$ORCH_DIR/requirements.txt" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"
cp "$ORCH_DIR/HOWTO.md" "$STAGE/usr/lib/$PKG_NAME/orchestrator/"

# Ensure runtime data directory is clean (no user history, secrets, or byok)
mkdir -p "$STAGE/usr/lib/$PKG_NAME/orchestrator/runtime/data"
rm -rf "$STAGE/usr/lib/$PKG_NAME/orchestrator/runtime/data/"*
rm -rf "$STAGE/usr/lib/$PKG_NAME/orchestrator/reports"
rm -rf "$STAGE/usr/lib/$PKG_NAME/orchestrator/runtime/__pycache__"

# Copy runner scripts
mkdir -p "$STAGE/usr/lib/$PKG_NAME/scripts"
cp "$ROOT/scripts/zoth-start.sh" "$STAGE/usr/lib/$PKG_NAME/scripts/"
cp "$ROOT/scripts/deps-debian.sh" "$STAGE/usr/lib/$PKG_NAME/scripts/"

# Scrub staging payload of personal paths and references
find "$STAGE" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.md" -o -name "*.txt" -o -name "*.xml" -o -name "*.py" \) -exec sed -i \
  -e 's|/media/neo/[^"'\'' ]*|/usr/lib/zoth-studio|g' \
  -e 's|/home/neo/[^"'\'' ]*|/usr/lib/zoth-studio|g' \
  -e 's|neal@nealfrazier\.tech|team@nullai.tech|g' \
  -e 's|Neal Frazier|NullAI Team|g' \
  -e 's|NealFrazierTech|NullAI-Studio|g' \
  -e 's|zoth\.nealfrazier\.tech|nullai.tech|g' \
  -e 's|nealfrazier\.tech|nullai.tech|g' \
  -e 's|nealfrazier|nullai|g' \
  {} + 2>/dev/null || true

echo "🔍 Step 3: Running Pre-Build Privacy & Secret Security Audit..."
LEAK_FOUND=0

# Scan for any leaked personal / secret files in staging
for forbidden in byok.json conversations.json secrets.json .env .nvimlog .codex *.chat *.conv harness-settings.json repos.json; do
  MATCHES=$(find "$STAGE" -name "$forbidden" 2>/dev/null || true)
  if [[ -n "$MATCHES" ]]; then
    echo "❌ SECURITY LEAK DETECTED: Found forbidden file '$forbidden' in build stage:"
    echo "$MATCHES"
    LEAK_FOUND=1
  fi
done

# Scan for actual private cryptographic key files or raw private keys (excluding scanner code)
KEY_MATCHES=$(grep -rn -E -- "-----[[:space:]]*BEGIN[[:space:]]+(RSA|EC|OPENSSH|DSA)?[[:space:]]*PRIVATE[[:space:]]+KEY[[:space:]]*-----" "$STAGE" 2>/dev/null | grep -v "secrets_scanner.py" || true)
if [[ -n "$KEY_MATCHES" ]]; then
  echo "❌ SECURITY LEAK DETECTED: Found actual private key in build stage:"
  echo "$KEY_MATCHES"
  LEAK_FOUND=1
fi

# Scan for PERSONAL INFO about Neal Frazier (must never ship in either variant)
PII_PATTERNS=("Neal Frazier" "neal@nealfrazier.tech" "nealfrazier.tech" "NealFrazierTech" "/media/neo" "/home/neo" "nealfrazier")
PII_MATCHES=""
for pat in "${PII_PATTERNS[@]}"; do
  hit=$(grep -rn -F -- "$pat" "$STAGE" 2>/dev/null | grep -v node_modules || true)
  if [[ -n "$hit" ]]; then
    PII_MATCHES+=$'\n'"$hit"
  fi
done
if [[ -n "$PII_MATCHES" ]]; then
  echo "❌ PII LEAK DETECTED: Personal info about Neal Frazier found in build stage:"
  echo "$PII_MATCHES"
  LEAK_FOUND=1
fi

if [[ "$LEAK_FOUND" -eq 1 ]]; then
  echo "🚨 BUILD ABORTED: Staged payload contained private/sensitive data."
  rm -rf "$BUILD_DIR"
  exit 1
fi
echo "✓ Privacy audit passed: 0 personal files, 0 conversations, and 0 secret keys in payload."

# Create /usr/bin/zoth binary symlink/launcher
cat << 'EOF' > "$STAGE/usr/bin/zoth"
#!/usr/bin/env bash
# Zoth Studio binary entrypoint
set -euo pipefail
APP_ROOT="/usr/lib/zoth-studio"
export PYTHONPATH="$APP_ROOT/orchestrator${PYTHONPATH:+:$PYTHONPATH}"

case "${1:-}" in
  deps|doctor)
    exec "$APP_ROOT/scripts/deps-debian.sh" "${@:2}"
    ;;
  --help|-h)
    echo "Zoth Studio v2.6.0 (Local-First AI Stack)"
    echo "Usage:"
    echo "  zoth          Start operator deck on http://127.0.0.1:8484/"
    echo "  zoth --hub    Also start public hub on http://127.0.0.1:8088/"
    echo "  zoth doctor   Run dependency and health audit"
    echo "  zoth deps     Check system libraries"
    echo "  zoth --version Show version"
    exit 0
    ;;
  --version|-v)
    echo "zoth-studio 2.6.0"
    exit 0
    ;;
  *)
    exec "$APP_ROOT/scripts/zoth-start.sh" "$@"
    ;;
esac
EOF
chmod +x "$STAGE/usr/bin/zoth"

# Desktop menu entry
cat << EOF > "$STAGE/usr/share/applications/zoth-studio.desktop"
[Desktop Entry]
Name=Zoth Studio
GenericName=Local-First AI Agent Studio
Comment=Autonomous Multi-Agent AI Orchestrator & 3D Creative Suite
Exec=zoth --hub
Icon=zoth-studio
Terminal=true
Type=Application
Categories=Development;Engineering;Utility;
Keywords=AI;Agent;LocalFirst;3D;Ollama;
StartupNotify=true
EOF

# Copy Icon
if [[ -f "$ROOT/public/assets/brand/zoth-seal-hermetic-on-dark.svg" ]]; then
  cp "$ROOT/public/assets/brand/zoth-seal-hermetic-on-dark.svg" "$STAGE/usr/share/icons/hicolor/scalable/apps/zoth-studio.svg"
fi

# Systemd User Unit
cat << EOF > "$STAGE/usr/lib/systemd/user/zoth.service"
[Unit]
Description=Zoth Studio Local-First Operator Deck
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/zoth --hub
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

# DEBIAN control file
cat << EOF > "$STAGE/DEBIAN/control"
Package: $PKG_NAME
Version: $VERSION
Section: devel
Priority: optional
Architecture: all
Maintainer: NullAI Packaging <packaging@nullai.tech>
Homepage: https://nullai.tech/studio
Depends: python3 (>= 3.10), python3-pip, python3-venv, git, curl, ca-certificates
Recommends: nodejs, npm, docker.io, rclone, gh
Description: Local-First Zoth Studio Deck & Multi-Agent Powerhouse
 Autonomous multi-agent orchestration, 3D Omniverse, OmniPost social media suite,
 and BYOK Argon2id vault running locally on loopback.
EOF

# Build 1: Debian Package (.deb)
echo "🔨 Step 3: Building Debian Package (.deb)..."
DEB_FILE="$DIST_DIR/${PKG_NAME}_${VERSION}_all.deb"
dpkg-deb --build "$STAGE" "$DEB_FILE"
echo "✓ Generated: $DEB_FILE"

# Build 2: Portable Universal Tarball
echo "📦 Step 4: Building Portable Tarball (.tar.gz)..."
PORTABLE_DIR="$BUILD_DIR/zoth-studio-v$VERSION-linux"
mkdir -p "$PORTABLE_DIR"
cp -a "$STAGE/usr/lib/$PKG_NAME/." "$PORTABLE_DIR/"

cat << 'EOF' > "$PORTABLE_DIR/zoth"
#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
export PYTHONPATH="$DIR/orchestrator${PYTHONPATH:+:$PYTHONPATH}"
case "${1:-}" in
  deps|doctor)
    exec "$DIR/scripts/deps-debian.sh" "${@:2}"
    ;;
  *)
    exec "$DIR/scripts/zoth-start.sh" "$@"
    ;;
esac
EOF
chmod +x "$PORTABLE_DIR/zoth"

TAR_FILE="$DIST_DIR/zoth-studio-v${VERSION}-linux-x86_64.tar.gz"
tar --warning=no-file-shrank --warning=no-file-changed -czf "$TAR_FILE" -C "$BUILD_DIR" "zoth-studio-v$VERSION-linux" || tar -czf "$TAR_FILE" -C "$BUILD_DIR" "zoth-studio-v$VERSION-linux" || true
echo "✓ Generated: $TAR_FILE"

# Build 3: Self-Extracting Single Executable (.run / standalone binary)
echo "🚀 Step 5: Building Self-Extracting Universal Binary (zoth-linux-x86_64.run)..."
RUN_FILE="$DIST_DIR/zoth-linux-x86_64.run"

cat << 'EOF' > "$RUN_FILE"
#!/usr/bin/env bash
# ==============================================================================
# Zoth Studio — Universal Self-Extracting Linux Executable
# Run standalone: ./zoth-linux-x86_64.run
# Install to ~/.local: ./zoth-linux-x86_64.run --install
# ==============================================================================
set -euo pipefail

VERSION="2.6.0"
APP_NAME="zoth-studio"

if [[ "${1:-}" == "--version" || "${1:-}" == "-v" ]]; then
  echo "Zoth Studio v$VERSION (Self-Extracting Universal Binary)"
  exit 0
fi

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Zoth Studio v$VERSION"
  echo "Usage:"
  echo "  ./zoth-linux-x86_64.run            # Run immediately on :8484 and :8088"
  echo "  ./zoth-linux-x86_64.run --install  # Install into ~/.local/bin/zoth"
  echo "  ./zoth-linux-x86_64.run --extract  # Extract files to current directory"
  exit 0
fi

TMP_DIR="$(mktemp -d -t zoth-run-XXXXXX)"
cleanup() { rm -rf "$TMP_DIR"; }

if [[ "${1:-}" == "--install" ]]; then
  DEST="$HOME/.local/share/zoth-studio"
  BIN_DEST="$HOME/.local/bin"
  mkdir -p "$DEST" "$BIN_DEST"
  echo "Installing Zoth Studio to $DEST..."
  ARCHIVE_LINE=$(grep -a -n '^__ARCHIVE_BELOW__' "$0" | cut -d: -f1)
  tail -n +"$((ARCHIVE_LINE + 1))" "$0" | base64 -d | tar -xz -C "$DEST" --strip-components=1
  ln -sf "$DEST/zoth" "$BIN_DEST/zoth"
  echo "✓ Installed successfully!"
  echo "Add ~/.local/bin to your PATH if not already present."
  echo "Run with: zoth"
  exit 0
fi

if [[ "${1:-}" == "--extract" ]]; then
  echo "Extracting Zoth Studio to ./zoth-studio-v$VERSION-linux..."
  ARCHIVE_LINE=$(grep -a -n '^__ARCHIVE_BELOW__' "$0" | cut -d: -f1)
  tail -n +"$((ARCHIVE_LINE + 1))" "$0" | base64 -d | tar -xz
  echo "✓ Extracted to ./zoth-studio-v$VERSION-linux"
  exit 0
fi

trap cleanup EXIT
ARCHIVE_LINE=$(grep -a -n '^__ARCHIVE_BELOW__' "$0" | cut -d: -f1)
tail -n +"$((ARCHIVE_LINE + 1))" "$0" | base64 -d | tar -xz -C "$TMP_DIR"

echo "⚡ Starting Zoth Studio v$VERSION..."
exec "$TMP_DIR/zoth-studio-v$VERSION-linux/zoth" --hub "$@"

__ARCHIVE_BELOW__
EOF

# Append base64 tarball payload to .run file
base64 "$TAR_FILE" >> "$RUN_FILE"
chmod +x "$RUN_FILE"
echo "✓ Generated: $RUN_FILE"

# Build 4: Linux AppImage (Zoth_Studio-2.6.0-x86_64.AppImage)
echo "📦 Step 6: Building Linux AppImage (Zoth_Studio-v$VERSION-x86_64.AppImage)..."
APPDIR="$BUILD_DIR/AppDir"
mkdir -p "$APPDIR/usr/lib/$PKG_NAME" "$APPDIR/usr/bin"
cp -a "$STAGE/usr/lib/$PKG_NAME/." "$APPDIR/usr/lib/$PKG_NAME/"
cp "$STAGE/usr/bin/zoth" "$APPDIR/usr/bin/zoth"
cp "$STAGE/usr/share/applications/zoth-studio.desktop" "$APPDIR/zoth-studio.desktop"
cp "$STAGE/usr/share/icons/hicolor/scalable/apps/zoth-studio.svg" "$APPDIR/zoth-studio.svg"
cp "$STAGE/usr/share/icons/hicolor/scalable/apps/zoth-studio.svg" "$APPDIR/.DirIcon"

cat << 'EOF' > "$APPDIR/AppRun"
#!/bin/sh
APPDIR="$(dirname "$(readlink -f "$0")")"
export APPDIR
export PATH="$APPDIR/usr/bin:$APPDIR/usr/lib/zoth-studio/scripts:$PATH"
export PYTHONPATH="$APPDIR/usr/lib/zoth-studio/orchestrator${PYTHONPATH:+:$PYTHONPATH}"
exec "$APPDIR/usr/lib/zoth-studio/scripts/zoth-start.sh" "$@"
EOF
chmod +x "$APPDIR/AppRun"

APPIMAGE_FILE="$DIST_DIR/Zoth_Studio-v${VERSION}-x86_64.AppImage"
SQFS_FILE="$BUILD_DIR/app.sqfs"
mksquashfs "$APPDIR" "$SQFS_FILE" -comp xz -noappend -quiet 2>/dev/null || mksquashfs "$APPDIR" "$SQFS_FILE" -noappend -quiet

cat << 'EOF' > "$APPIMAGE_FILE"
#!/usr/bin/env bash
# ==============================================================================
# Zoth Studio — Universal Linux AppImage v2.6.0
# ==============================================================================
set -euo pipefail

case "${1:-}" in
  --appimage-help)
    echo "Zoth Studio AppImage v2.6.0 (Local-First AI Agent Powerhouse)"
    echo "Usage:"
    echo "  ./Zoth_Studio-v2.6.0-x86_64.AppImage            # Launch operator deck on :8484"
    echo "  ./Zoth_Studio-v2.6.0-x86_64.AppImage --hub      # Also launch public hub on :8088"
    echo "  ./Zoth_Studio-v2.6.0-x86_64.AppImage --appimage-extract # Extract AppDir to ./squashfs-root"
    echo "  ./Zoth_Studio-v2.6.0-x86_64.AppImage --version  # Print version"
    exit 0
    ;;
  --appimage-version|--version|-v)
    echo "zoth-studio 2.6.0"
    exit 0
    ;;
  --appimage-extract)
    echo "Extracting AppImage to ./squashfs-root..."
    ARCHIVE_OFFSET=$(grep -a -n '^__APPIMAGE_PAYLOAD__' "$0" | cut -d: -f1)
    TMP_SQ="$(mktemp -t zoth-sq-XXXXXX.sqfs)"
    tail -n +"$((ARCHIVE_OFFSET + 1))" "$0" > "$TMP_SQ"
    unsquashfs -d ./squashfs-root "$TMP_SQ" >/dev/null 2>&1 || true
    rm -f "$TMP_SQ"
    echo "✓ Extracted to ./squashfs-root"
    exit 0
    ;;
esac

TMP_MOUNT="$(mktemp -d -t zoth-appimage-XXXXXX)"
cleanup() { rm -rf "$TMP_MOUNT"; }
trap cleanup EXIT INT TERM

ARCHIVE_OFFSET=$(grep -a -n '^__APPIMAGE_PAYLOAD__' "$0" | cut -d: -f1)
TMP_SQ="$TMP_MOUNT/app.sqfs"
tail -n +"$((ARCHIVE_OFFSET + 1))" "$0" > "$TMP_SQ"

if command -v unsquashfs >/dev/null 2>&1; then
  unsquashfs -d "$TMP_MOUNT/AppDir" "$TMP_SQ" >/dev/null 2>&1 || true
fi
rm -f "$TMP_SQ"

if [[ -f "$TMP_MOUNT/AppDir/AppRun" ]]; then
  export APPDIR="$TMP_MOUNT/AppDir"
  exec "$APPDIR/AppRun" "$@"
else
  echo "Error: Failed to mount AppImage payload."
  exit 1
fi

__APPIMAGE_PAYLOAD__
EOF

cat "$SQFS_FILE" >> "$APPIMAGE_FILE"
chmod +x "$APPIMAGE_FILE"
echo "✓ Generated: $APPIMAGE_FILE"

# Clean temporary build staging
rm -rf "$BUILD_DIR"

echo "============================================================"
echo "🎉 LINUX BUILD SUCCESSFUL! Artifacts generated in dist-linux/:"
ls -lh "$DIST_DIR"
echo "============================================================"
