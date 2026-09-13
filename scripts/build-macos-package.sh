#!/usr/bin/env bash
# ==============================================================================
# ZOTH STUDIO: MACOS COMPILATION & PACKAGING PIPELINE v3.0.0
# Generates:
#   1. dist-macos/zoth-studio-v3.0.0-macos-universal.tar.gz (Universal macOS Archive)
#   2. dist-macos/zoth-studio-v3.0.0-macos.zip (Portable macOS ZIP)
#   3. dist-macos/zoth-macos-launcher.command (Native double-clickable launcher)
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT/dist-macos"
BUILD_DIR="$(mktemp -d -t zoth-mac-staging-XXXXXX)"
trap 'rm -rf "$BUILD_DIR"' EXIT
VERSION="3.0.0"
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
echo "⚡ $PKG_DISPLAY: MACOS PACKAGING PIPELINE v$VERSION"
echo "============================================================"

# Step 1: Ensure React Dashboard is built
echo "📦 Step 1: Compiling React Dashboard..."
ORCH_DIR="$ROOT/tools/null ai agent tools/local_null_ai_orchestrator"
if [[ -f "$ORCH_DIR/dashboard/package.json" ]]; then
  (cd "$ORCH_DIR/dashboard" && npm run build)
  echo "✓ React dashboard compiled into $ORCH_DIR/dashboard/dist"
fi

mkdir -p "$DIST_DIR"
STAGE="$BUILD_DIR/zoth-studio-v$VERSION-macos"
mkdir -p "$STAGE/public" "$STAGE/orchestrator" "$STAGE/scripts" "$STAGE/bin"

echo "📁 Step 2: Staging macOS application payload with .buildignore enforcement..."

# Copy public static hub using the variant ignore list
rsync -a --exclude-from="$IGNORE_FILE" "$ROOT/public/" "$STAGE/public/"

# Copy orchestrator & runtime with the variant ignore list
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/runtime" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/orchestrator.py" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/registry.local.json" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/playbooks" "$STAGE/orchestrator/"
if [[ -d "$ORCH_DIR/dashboard/dist" ]]; then
  rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/dashboard/dist/" "$STAGE/orchestrator/dashboard/"
fi

# Copy runner scripts
cp "$ROOT/scripts/zoth-start.sh" "$STAGE/scripts/" 2>/dev/null || true

# Generate native macOS double-clickable launcher
cat <<'LAUNCHER' > "$STAGE/zoth-macos-launcher.command"
#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "⚡ Starting Zoth Studio v3.0.0 (macOS Universal Native)..."

# Ensure Python 3 is installed
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ Python 3 is required. Install via Homebrew: brew install python3"
  exit 1
fi

# Launch Background Services
echo "🚀 Spawning Zoth Studio Workstations..."
python3 -m http.server 8088 --directory public >/dev/null 2>&1 &
WEB_PID=$!

python3 orchestrator/orchestrator.py serve --host 127.0.0.1 --port 8484 --public >/dev/null 2>&1 &
ORCH_PID=$!

cleanup() {
  echo "🛑 Shutting down Zoth Studio daemons..."
  kill $WEB_PID $ORCH_PID 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo "✅ Zoth Studio is LIVE at http://127.0.0.1:8088/"
echo "🎛️ Operator Deck is LIVE at http://127.0.0.1:8484/"

# Open browser automatically on macOS
open "http://127.0.0.1:8088/" 2>/dev/null || true

echo "Press [Ctrl+C] to terminate all Zoth Studio services."
wait
LAUNCHER
chmod +x "$STAGE/zoth-macos-launcher.command"

# Scrub staging payload of personal paths and references
find "$STAGE" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.md" -o -name "*.txt" -o -name "*.xml" -o -name "*.py" -o -name "*.command" -o -name "*.sh" \) -exec sed -i \
  -e 's|neal@nullai\.tech|team@nullai.tech|g' \
  -e 's|Zoth Studio Team|NullAI Team|g' \
  -e 's|DemoAgentOrg|NullAI-Studio|g' \
  -e 's|zoth\.nullai\.tech|nullai.tech|g' \
  {} + 2>/dev/null || true

echo "🔍 Step 3: Running Pre-Build Privacy & Secret Security Audit..."
LEAK_FOUND=0
for forbidden in byok.json conversations.json secrets.json .env .nvimlog .codex *.chat *.conv harness-settings.json repos.json; do
  MATCHES=$(find "$STAGE" -name "$forbidden" 2>/dev/null || true)
  if [[ -n "$MATCHES" ]]; then
    echo "❌ SECURITY LEAK FOUND: Forbidden file staged: $MATCHES"
    LEAK_FOUND=1
  fi
done

if [[ "$LEAK_FOUND" -ne 0 ]]; then
  echo "❌ BUILD ABORTED: Security/Privacy audit failed."
  exit 1
fi
echo "✓ Security & Privacy Audit PASSED (0 leaks detected)"

echo "📦 Step 4: Packaging macOS distribution bundles..."
cd "$BUILD_DIR"
tar -czf "$DIST_DIR/zoth-studio-v$VERSION-macos-universal.tar.gz" "zoth-studio-v$VERSION-macos"
zip -rq "$DIST_DIR/zoth-studio-v$VERSION-macos.zip" "zoth-studio-v$VERSION-macos"

echo "============================================================"
echo "🎉 MACOS PACKAGING COMPLETE!"
echo "   Artifacts generated in: $DIST_DIR"
ls -lh "$DIST_DIR"
echo "============================================================"
