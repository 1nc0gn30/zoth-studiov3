# ==============================================================================
# ZOTH STUDIO — One-Line PowerShell Local Installer for Windows
# Usage:
#   irm https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.ps1 | iex
# ==============================================================================
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "⚡ ZOTH STUDIO v2.6.0 — Local-First AI Agent Powerhouse" -ForegroundColor Cyan
Write-Host "   100% Free · Sovereign · Zero Cloud Telemetry" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

$dest = Join-Path $env:USERPROFILE ".zoth-studio"

if (Test-Path -Path (Join-Path $dest ".git")) {
    Write-Host "Updating existing Zoth Studio in $dest..." -ForegroundColor Yellow
    Set-Location $dest
    git pull --quiet origin main
} else {
    Write-Host "Cloning Zoth Studio into $dest..." -ForegroundColor Green
    git clone --depth 1 https://github.com/NullAITech/zoth-studio.git $dest
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎉 ZOTH STUDIO READY FOR LAUNCH!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Operator Deck at http://127.0.0.1:8484/ ..." -ForegroundColor Yellow
Set-Location $dest
if (Test-Path ".\zoth.bat") {
    Start-Process ".\zoth.bat"
} else {
    python .\orchestrator\orchestrator.py serve --host 127.0.0.1 --port 8484
}
Write-Host "============================================================" -ForegroundColor Cyan
