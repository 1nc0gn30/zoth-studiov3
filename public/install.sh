#!/usr/bin/env bash
set -e

echo -e "\033[36m"
cat << "ASCIIEOF"
  _____       _   _      _____ _             _ _
 |__  /___   | |_| |__  / ___/| |_ _   _  __| (_) ___
   / // _ \  | __| '_ \ \___ \| __| | | |/ _` | |/ _ \
  / /| (_) | | |_| | | | ___) | |_| |_| | (_| | | (_) |
 /____\___/   \__|_| |_||____/ \__|\__,_|\__,_|_|\___/
ASCIIEOF
echo -e "\033[0m"
echo -e "\033[1mWelcome to Zoth Studio\033[0m"
echo -e "Initializing Sovereign Local-First AI Agent Environment...\n"

if ! command -v git &> /dev/null; then
    echo -e "\033[31mError: git is required to install Zoth Studio.\033[0m"
    exit 1
fi

INSTALL_DIR="$HOME/.zoth"
REPO_URL="https://github.com/NullAITech/zoth-studio.git"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "Zoth Studio is already installed in $INSTALL_DIR"
    echo -e "Updating latest blueprints..."
    cd "$INSTALL_DIR" && git pull origin main
else
    echo -e "Cloning Zoth Studio into $INSTALL_DIR..."
    git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

echo -e "\n\033[32m✔ Zoth Studio Core Architecture Installed Successfully!\033[0m"
echo -e "\nTo launch the Zoth Studio local portal:"
echo -e "  1. \033[36mcd ~/.zoth/core-app\033[0m"
echo -e "  2. \033[36mnpx serve public -p 8484\033[0m"
echo -e "\nThen open \033[32mhttp://127.0.0.1:8484\033[0m in your browser.\n"
