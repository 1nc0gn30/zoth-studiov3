#!/usr/bin/env bash
# ==============================================================================
# ZOTH STUDIO: WINDOWS COMPILATION & PACKAGING PIPELINE v2.6.0
# Generates:
#   1. dist-windows/zoth-studio-v2.6.0-windows-x86_64.zip (Portable ZIP)
#   2. dist-windows/zoth-windows-x86_64.exe (Standalone Windows Self-Extracting Executable)
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT/dist-windows"
BUILD_DIR="$(mktemp -d -t zoth-win-staging-XXXXXX)"
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
echo "⚡ $PKG_DISPLAY: WINDOWS PACKAGING PIPELINE v$VERSION"
echo "============================================================"

# Step 1: Ensure React Dashboard is built
echo "📦 Step 1: Compiling React Dashboard..."
ORCH_DIR="$ROOT/tools/null ai agent tools/local_null_ai_orchestrator"
if [[ -f "$ORCH_DIR/dashboard/package.json" ]]; then
  (cd "$ORCH_DIR/dashboard" && npm run build)
  echo "✓ React dashboard compiled into $ORCH_DIR/dashboard/dist"
fi

mkdir -p "$DIST_DIR"
STAGE="$BUILD_DIR/zoth-studio-v$VERSION-windows"
mkdir -p "$STAGE/public" "$STAGE/orchestrator" "$STAGE/scripts"

echo "📁 Step 2: Staging Windows application payload with .buildignore enforcement..."

# Copy public static hub using the variant ignore list
rsync -a --exclude-from="$IGNORE_FILE" "$ROOT/public/" "$STAGE/public/"

# Copy orchestrator & runtime with the variant ignore list
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/runtime" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/orchestrator.py" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/registry.local.json" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/playbooks" "$STAGE/orchestrator/"
rsync -a --exclude-from="$IGNORE_FILE" "$ORCH_DIR/dashboard/dist" "$STAGE/orchestrator/dashboard/"

# Scrub staging payload of personal paths and references
find "$STAGE" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.md" -o -name "*.txt" -o -name "*.xml" -o -name "*.py" -o -name "*.bat" -o -name "*.cmd" -o -name "*.ps1" \) -exec sed -i \
  -e 's|/media/neo/[^"'\'' ]*|orchestrator|g' \
  -e 's|/home/neo/[^"'\'' ]*|orchestrator|g' \
  -e 's|neal@nealfrazier\.tech|team@nullai.tech|g' \
  -e 's|Neal Frazier|NullAI Team|g' \
  -e 's|NealFrazierTech|NullAI-Studio|g' \
  -e 's|zoth\.nealfrazier\.tech|nullai.tech|g' \
  -e 's|nealfrazier\.tech|nullai.tech|g' \
  -e 's|nealfrazier|nullai|g' \
  {} + 2>/dev/null || true

# Step 3: Run Privacy and Security Audit
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

# Scan for actual private cryptographic key files or raw private keys
KEY_MATCHES=$(grep -rn -E -- "-----[[:space:]]*BEGIN[[:space:]]+(RSA|EC|OPENSSH|DSA)?[[:space:]]*PRIVATE[[:space:]]+KEY[[:space:]]*-----" "$STAGE" 2>/dev/null | grep -v "secrets_scanner.py" || true)
if [[ -n "$KEY_MATCHES" ]]; then
  echo "SECURITY LEAK DETECTED: Found actual private key in build stage:"
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
  echo "PII LEAK DETECTED: Personal info about Neal Frazier found in build stage:"
  echo "$PII_MATCHES"
  LEAK_FOUND=1
fi

if [[ "$LEAK_FOUND" -eq 1 ]]; then
  echo "🚨 BUILD ABORTED: Staged payload contained private/sensitive data."
  exit 1
fi
echo "✓ Privacy audit passed: 0 personal files, 0 conversations, and 0 secret keys in payload."

# Step 4: Create Windows Launchers & Batch Scripts
echo "🪟 Step 4: Generating Windows Launchers (zoth.bat, zoth.cmd, zoth.ps1)..."

# 1. Double-clickable root batch launcher
cat << 'EOF' > "$STAGE/zoth.bat"
@echo off
setlocal enabledelayedexpansion
title Zoth Studio v2.6.0 - Local-First AI Agent Powerhouse
echo ============================================================
echo   ZOTH STUDIO v2.6.0 (Windows Edition)
echo   Local-First AI Agent Powerhouse & WebGL Omniverse
echo ============================================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Python 3 was not found in your PATH.
        echo Please install Python 3.10+ from https://python.org/ or Microsoft Store.
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=py -3
    )
) else (
    set PYTHON_CMD=python
)

echo [INFO] Starting Zoth Studio Services...
echo [INFO] Operator Deck: http://127.0.0.1:8484/
echo [INFO] Public Hub:    http://127.0.0.1:8088/
echo.

set DIR=%~dp0
set PYTHONPATH=%DIR%orchestrator;%PYTHONPATH%

start "" http://127.0.0.1:8484/
%PYTHON_CMD% "%DIR%orchestrator\orchestrator.py" serve --host 127.0.0.1 --port 8484
pause
EOF

# 2. Command-line interface launcher
cat << 'EOF' > "$STAGE/zoth.cmd"
@echo off
setlocal enabledelayedexpansion
set DIR=%~dp0
set PYTHONPATH=%DIR%orchestrator;%PYTHONPATH%

where python >nul 2>nul
if %errorlevel% neq 0 (
    set PYTHON_CMD=py -3
) else (
    set PYTHON_CMD=python
)

if "%1"=="--help" goto help
if "%1"=="-h" goto help
if "%1"=="--version" goto version
if "%1"=="-v" goto version

%PYTHON_CMD% "%DIR%orchestrator\orchestrator.py" %*
goto end

:version
echo zoth-studio 2.6.0 (Windows x86_64)
goto end

:help
echo Zoth Studio v2.6.0 (Local-First AI Stack - Windows)
echo Usage:
echo   zoth                  Start operator deck on http://127.0.0.1:8484/
echo   zoth serve            Start dashboard server
echo   zoth list             List registered AI tools
echo   zoth run ^<tool^>       Execute local agent tool
echo   zoth doctor           Run dependency and health audit
goto end

:end
EOF

# 3. Modern PowerShell launcher
cat << 'EOF' > "$STAGE/zoth.ps1"
<#
.SYNOPSIS
    Zoth Studio PowerShell Entrypoint (Windows 10/11)
#>
[CmdletBinding()]
param(
    [switch]$Hub,
    [switch]$Help,
    [switch]$Version
)

$AppDir = $PSScriptRoot
$env:PYTHONPATH = "$AppDir\orchestrator;$env:PYTHONPATH"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "⚡ ZOTH STUDIO v2.6.0 (Windows Edition)" -ForegroundColor Cyan
Write-Host "Local-First Sovereign AI Agent Stack & WebGL Omniverse" -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan

if ($Help) {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\zoth.ps1         # Launch Operator Deck (:8484)"
    Write-Host "  .\zoth.ps1 -Hub    # Launch Operator Deck and Public Hub (:8088)"
    exit 0
}

if ($Version) {
    Write-Host "zoth-studio 2.6.0 (Windows x86_64)" -ForegroundColor Green
    exit 0
}

$pythonCmd = if (Get-Command python -ErrorAction SilentlyContinue) { "python" } elseif (Get-Command py -ErrorAction SilentlyContinue) { "py" } else { $null }

if (-not $pythonCmd) {
    Write-Error "Python 3 was not found on this system. Please install Python 3.10+ from https://python.org/"
    exit 1
}

Write-Host "✓ Python runtime located: $pythonCmd" -ForegroundColor Green
Write-Host "🚀 Launching Operator Deck on http://127.0.0.1:8484/..." -ForegroundColor Cyan
Start-Process "http://127.0.0.1:8484/"

if ($Hub) {
    Write-Host "🌐 Launching Public Hub on http://127.0.0.1:8088/..." -ForegroundColor Cyan
    Start-Job -ScriptBlock {
        param($dir, $py)
        Set-Location $dir
        & $py -m http.server 8088 --directory "$dir\public" --bind 127.0.0.1
    } -ArgumentList $AppDir, $pythonCmd | Out-Null
    Start-Process "http://127.0.0.1:8088/"
}

& $pythonCmd "$AppDir\orchestrator\orchestrator.py" serve --host 127.0.0.1 --port 8484
EOF

# Copy quick start instructions
cat << 'EOF' > "$STAGE/README-WINDOWS.txt"
==============================================================================
ZOTH STUDIO v2.6.0 — WINDOWS QUICK START
==============================================================================

Welcome to Zoth Studio! Everything runs 100% locally on your machine.

REQUIREMENTS:
- Windows 10 or Windows 11 (64-bit)
- Python 3.10+ installed (from python.org or Microsoft Store)
- Optional: Ollama for local offline AI (https://ollama.ai/)

QUICK START:
1. Double-click "zoth.bat" to start Zoth Studio.
2. Your default browser will open automatically at http://127.0.0.1:8484/

POWERSHELL USERS:
- Run: .\zoth.ps1
- Run with Public Hub: .\zoth.ps1 -Hub

COMMAND LINE USAGE:
- Add this directory to your User PATH to use 'zoth' anywhere in CMD/PowerShell.
- Type 'zoth list' to view all 47+ agent tools.
- Type 'zoth run <tool_name>' to execute a workflow.

SERVICES & PORTS:
- Operator Deck: http://127.0.0.1:8484/
- Public Studio Hub: http://127.0.0.1:8088/
- BYOK Vault: http://127.0.0.1:8787/
- Local Ollama AI: http://127.0.0.1:11434/

PRIVACY & SECURITY:
- Zero secrets or private keys are transmitted over the network.
- Everything runs strictly on loopback (127.0.0.1).

(c) 2026 Zoth Studio · NullAI · Sovereign Local-First Stack
==============================================================================
EOF

# Build 1: Portable Windows ZIP Archive
echo "📦 Step 5: Building Portable Windows ZIP Archive..."
WIN_ZIP="$DIST_DIR/zoth-studio-v${VERSION}-windows-x86_64.zip"
(cd "$BUILD_DIR" && zip -q -r "$WIN_ZIP" "zoth-studio-v$VERSION-windows")
echo "✓ Generated: $WIN_ZIP"

# Build 2: Windows Self-Extracting Executable (SFX .exe)
echo "🚀 Step 6: Building Windows Self-Extracting Executable (zoth-windows-x86_64.exe)..."
WIN_EXE="$DIST_DIR/zoth-windows-x86_64.exe"
WIN_7Z="$BUILD_DIR/payload.7z"
(cd "$BUILD_DIR" && 7z a -t7z -mx=9 "$WIN_7Z" "zoth-studio-v$VERSION-windows" >/dev/null)

if [[ -f "/usr/lib/7zip/7zCon.sfx" ]]; then
  cat /usr/lib/7zip/7zCon.sfx "$WIN_7Z" > "$WIN_EXE"
  chmod +x "$WIN_EXE"
  echo "✓ Generated: $WIN_EXE (Self-Extracting 7z Windows Executable)"
else
  # Fallback to copy zip
  cp "$WIN_ZIP" "$DIST_DIR/zoth-windows-package.zip"
  echo "✓ Generated Windows Package in $DIST_DIR"
fi

echo "============================================================"
echo "🎉 WINDOWS BUILD SUCCESSFUL! Artifacts generated in dist-windows/:"
ls -lh "$DIST_DIR"
echo "============================================================"
