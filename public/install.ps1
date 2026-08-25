$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ███████╗ ██████╗ ████████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ " -ForegroundColor Yellow
Write-Host "  ╚══███╔╝██╔═══██╗╚══██╔══╝██║  ██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗" -ForegroundColor Yellow
Write-Host "    ███╔╝ ██║   ██║   ██║   ███████║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║" -ForegroundColor Yellow
Write-Host "   ███╔╝  ██║   ██║   ██║   ██╔══██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║" -ForegroundColor Yellow
Write-Host "  ███████╗╚██████╔╝   ██║   ██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝" -ForegroundColor Yellow
Write-Host "  ╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ " -ForegroundColor Yellow
Write-Host "  [ Sovereign Local-First AI Agent Environment · Windows Edition ]" -ForegroundColor DarkGray
Write-Host ""

Write-Host "Initializing Zoth Studio Architecture..." -ForegroundColor White

if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Error: git is required to install Zoth Studio." -ForegroundColor Red
    Write-Host "  Install via winget: winget install --id Git.Git"
    exit 1
}

$InstallDir = "$env:USERPROFILE\.zoth"
$RepoUrl = "https://github.com/NullAITech/zoth-studio.git"

if (Test-Path $InstallDir) {
    Write-Host "Updating existing installation in $InstallDir..." -ForegroundColor DarkGray
    Set-Location $InstallDir
    git pull origin main
} else {
    Write-Host "Cloning Zoth Studio into $InstallDir..." -ForegroundColor DarkGray
    git clone --depth 1 $RepoUrl $InstallDir
}

Write-Host "`n══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✔ Zoth Studio Core Architecture Installed Successfully!" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "⚡ Quick Start (CLI & TUI):" -ForegroundColor White
Write-Host "  python $InstallDir\core-app\bin\zoth status" -ForegroundColor Cyan
Write-Host "  python $InstallDir\core-app\bin\zoth tui" -ForegroundColor Cyan
Write-Host "  python $InstallDir\core-app\bin\zoth start" -ForegroundColor Cyan
Write-Host "  python $InstallDir\core-app\bin\zoth doctor" -ForegroundColor Cyan

Write-Host "`n🌐 Web Dashboard & Workstations:" -ForegroundColor White
Write-Host "  • Studio Workstations:   http://127.0.0.1:8088/studio/" -ForegroundColor Cyan
Write-Host "  • Operator Deck (:8484): http://127.0.0.1:8484/" -ForegroundColor Cyan
Write-Host "  • Website Foundry:       http://127.0.0.1:8088/studio/site-generator.html" -ForegroundColor Cyan
Write-Host "  • Master Azoth:          http://127.0.0.1:8088/zoth/`n" -ForegroundColor Cyan

