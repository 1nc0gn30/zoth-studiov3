#!/usr/bin/env bash
# Check (and optionally install) Zoth Studio dependencies on Debian/Ubuntu.
# Usage:
#   ./scripts/deps-debian.sh              # report only
#   ./scripts/deps-debian.sh --install    # apt + pip for missing required/recommended
#   ./scripts/deps-debian.sh --json
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ORCH="$ROOT/tools/null ai agent tools/local_null_ai_orchestrator"
INSTALL=0
JSON=0

for arg in "$@"; do
  case "$arg" in
    --install|-i) INSTALL=1 ;;
    --json) JSON=1 ;;
    -h|--help)
      sed -n '2,8p' "$0"
      exit 0
      ;;
  esac
done

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is missing. On Debian/Ubuntu:"
  echo "  sudo apt-get update && sudo apt-get install -y python3 python3-venv python3-pip python3-dev curl ca-certificates git"
  echo "Docs: https://www.python.org/downloads/  packages: https://packages.debian.org/stable/python3"
  exit 2
fi

export PYTHONPATH="$ORCH${PYTHONPATH:+:$PYTHONPATH}"
cd "$ORCH"

if [[ "$JSON" -eq 1 ]]; then
  python3 -c "import json; from runtime.deps import probe; print(json.dumps(probe(), indent=2))"
  exit 0
fi

python3 - <<'PY'
from runtime.deps import format_report, probe, is_debian_family, debian_id
print(format_report())
info = debian_id()
if info["id"]:
    print(f"\nDetected OS: {info['id']} {info['version']} (like {info['like'] or 'n/a'})")
if not is_debian_family():
    print("This helper is written for Debian/Ubuntu. On other systems use the URLs in the report.")
PY

if [[ "$INSTALL" -ne 1 ]]; then
  echo
  echo "Report only. To install missing Debian packages + Python modules:"
  echo "  $0 --install"
  exit 0
fi

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

APT_LINE="$(python3 -c "from runtime.deps import apt_line; print(apt_line())")"
if [[ -n "$APT_LINE" ]]; then
  echo
  echo "Installing apt packages…"
  echo "  $APT_LINE"
  # apt_line already includes sudo; strip if we are root
  if [[ -z "$SUDO" ]]; then
    APT_LINE="${APT_LINE#sudo }"
  fi
  eval "$APT_LINE"
else
  echo
  echo "No missing apt packages (or they have no Debian package)."
fi

echo
echo "Installing Python modules for the deck…"
python3 -m pip install --user -r "$ORCH/requirements.txt"

echo
echo "Recheck:"
python3 -c "from runtime.deps import format_report; print(format_report())"
echo
echo "Ollama (optional local models): https://ollama.com/download/linux"
echo "  curl -fsSL https://ollama.com/install.sh | sh"
echo "rclone Drive: after apt, run  rclone config"
echo "GitHub: gh auth login   or paste GITHUB_TOKEN in the deck BYOK panel"
echo
echo "Start the deck:  $ROOT/scripts/zoth-start.sh"
