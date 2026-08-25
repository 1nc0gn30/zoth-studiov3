[CmdletBinding()]
param(
    [switch]$Unattended,
    [switch]$NoPrompt,
    [switch]$Yes,
    [Alias("y")][switch]$YFlag,
    [switch]$NonInteractive,
    [string]$InstallDir = $null,
    [string]$BinDir = $null,
    [string]$Branch = "main"
)

# ==============================================================================
# ZOTH STUDIO — One-Line PowerShell Local Installer for Windows
# Usage:
#   irm https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.ps1 | iex
# ==============================================================================
$isUnattended = $Unattended.IsPresent -or $NoPrompt.IsPresent -or $Yes.IsPresent -or $YFlag.IsPresent -or $NonInteractive.IsPresent -or ($env:ZOTH_UNATTENDED -eq "1") -or ($env:CI -eq "true") -or ($env:CI -eq "1")

if ($isUnattended) {
    $env:GIT_TERMINAL_PROMPT = "0"
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "⚡ ZOTH STUDIO — Local-First AI Agent Powerhouse" -ForegroundColor Cyan
Write-Host "   100% Free · Sovereign · Zero Cloud Telemetry" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

$dest = if ($InstallDir) { $InstallDir } elseif ($env:ZOTH_INSTALL_DIR) { $env:ZOTH_INSTALL_DIR } else { Join-Path $env:USERPROFILE ".zoth-studio" }
$bin = if ($BinDir) { $BinDir } elseif ($env:ZOTH_BIN_DIR) { $env:ZOTH_BIN_DIR } else { Join-Path $env:USERPROFILE ".local\bin" }

if (Test-Path -Path (Join-Path $dest ".git")) {
    Write-Host "Updating existing Zoth Studio in $dest..." -ForegroundColor Yellow
    Set-Location $dest
    try {
        git fetch origin $Branch
        git pull --ff-only origin $Branch
    } catch {
        git pull origin $Branch
    }
} else {
    Write-Host "Cloning Zoth Studio ($Branch) into $dest..." -ForegroundColor Green
    git clone --depth 1 --branch $Branch https://github.com/NullAITech/zoth-studio.git $dest
}

# Setup CLI shim
$cliPath = $null
if (Test-Path (Join-Path $dest "core-app\bin\zoth")) {
    $cliPath = Join-Path $dest "core-app\bin\zoth"
} elseif (Test-Path (Join-Path $dest "bin\zoth")) {
    $cliPath = Join-Path $dest "bin\zoth"
}

if ($cliPath) {
    if (-not (Test-Path $bin)) { New-Item -ItemType Directory -Path $bin -Force | Out-Null }
    "@echo off`r`npython `"$cliPath`" %*" | Out-File -FilePath (Join-Path $bin "zoth.cmd") -Encoding ascii -Force
    "& python `"$cliPath`" `$args" | Out-File -FilePath (Join-Path $bin "zoth.ps1") -Encoding utf8 -Force
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎉 ZOTH STUDIO READY FOR LAUNCH!" -ForegroundColor Green
Write-Host ""
Write-Host "Commands:" -ForegroundColor White
Write-Host "  zoth status" -ForegroundColor Cyan
Write-Host "  zoth tui" -ForegroundColor Cyan
Write-Host "  zoth update" -ForegroundColor Cyan
Write-Host "  zoth start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Operator Deck: http://127.0.0.1:8484/" -ForegroundColor Yellow
Write-Host "Public Hub:    http://127.0.0.1:8088/" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

