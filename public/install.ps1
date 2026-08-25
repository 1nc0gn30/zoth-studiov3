$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  _____       _   _      _____ _             _ _ " -ForegroundColor Cyan
Write-Host " |__  /___   | |_| |__  / ___/| |_ _   _  __| (_) ___" -ForegroundColor Cyan
Write-Host "   / // _ \  | __| '_ \ \___ \| __| | | |/ _` | |/ _ \" -ForegroundColor Cyan
Write-Host "  / /| (_) | | |_| | | | ___) | |_| |_| | (_| | | (_) |" -ForegroundColor Cyan
Write-Host " /____\___/   \__|_| |_||____/ \__|\__,_|\__,_|_|\___/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Welcome to Zoth Studio" -ForegroundColor White -NoNewline
Write-Host " (Windows Edition)" -ForegroundColor DarkGray
Write-Host "Initializing Sovereign Local-First AI Agent Environment..."

if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: git is required to install Zoth Studio." -ForegroundColor Red
    exit 1
}

$InstallDir = "$env:USERPROFILE\.zoth"
$RepoUrl = "https://github.com/NullAITech/zoth-studio.git"

if (Test-Path $InstallDir) {
    Write-Host "Zoth Studio is already installed in $InstallDir"
    Write-Host "Updating latest blueprints..."
    Set-Location $InstallDir
    git pull origin main
} else {
    Write-Host "Cloning Zoth Studio into $InstallDir..."
    git clone --depth 1 $RepoUrl $InstallDir
}

Write-Host "`n✔ Zoth Studio Core Architecture Installed Successfully!" -ForegroundColor Green
Write-Host "`nTo launch the Zoth Studio local portal:"
Write-Host "  1. cd $env:USERPROFILE\.zoth\core-app" -ForegroundColor Cyan
Write-Host "  2. npx serve public -p 8484" -ForegroundColor Cyan
Write-Host "`nThen open http://127.0.0.1:8484 in your browser.`n" -ForegroundColor Green
