#!/usr/bin/env bash
set -e

# ANSI Color Tokens (Golden & Cyber Cyan Theme)
GOLD="\033[38;2;251;191;36m"
CYAN="\033[38;2;0;240;255m"
GREEN="\033[38;2;52;211;153m"
PURPLE="\033[38;2;192;132;252m"
RED="\033[38;2;244;63;94m"
GRAY="\033[38;2;148;163;184m"
BOLD="\033[1m"
DIM="\033[2m"
RESET="\033[0m"

echo -e "${GOLD}${BOLD}"
cat << "ASCIIEOF"
  ███████╗ ██████╗ ████████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
  ╚══███╔╝██╔═══██╗╚══██╔══╝██║  ██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ███╔╝ ██║   ██║   ██║   ███████║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
   ███╔╝  ██║   ██║   ██║   ██╔══██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
  ███████╗╚██████╔╝   ██║   ██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
  ╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
ASCIIEOF
echo -e "${RESET}${GRAY}  [ Sovereign Local-First AI Agent Environment · Autonomous Multi-Node Studio ]${RESET}\n"

echo -e "${BOLD}Initializing Zoth Studio Architecture...${RESET}\n"

# Step 1: Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✖ Error: git is required to install Zoth Studio.${RESET}"
    echo -e "  Install with: sudo apt-get install git / brew install git"
    exit 1
fi
echo -e "  ${GREEN}✔${RESET} Git found: $(git --version)"

# Step 2: Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✖ Error: python3 (3.10+) is required to run the orchestrator.${RESET}"
    exit 1
fi
echo -e "  ${GREEN}✔${RESET} Python found: $(python3 --version)"

INSTALL_DIR="$HOME/.zoth"
REPO_URL="https://github.com/NullAITech/zoth-studio.git"
BIN_DIR="$HOME/.local/bin"

echo -e "\n${BOLD}Fetching Repository & Workstations...${RESET}"
if [ -d "$INSTALL_DIR" ]; then
    echo -e "  ${GRAY}Updating existing installation in $INSTALL_DIR...${RESET}"
    cd "$INSTALL_DIR" && git pull origin main
else
    echo -e "  ${GRAY}Cloning Zoth Studio into $INSTALL_DIR...${RESET}"
    git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

# Step 3: Symlink CLI Binary to ~/.local/bin/zoth
mkdir -p "$BIN_DIR"
chmod +x "$INSTALL_DIR/core-app/bin/zoth" 2>/dev/null || true
ln -sf "$INSTALL_DIR/core-app/bin/zoth" "$BIN_DIR/zoth"
echo -e "  ${GREEN}✔${RESET} CLI binary linked to ${CYAN}$BIN_DIR/zoth${RESET}"

# Step 4: Success Banner & Next Steps
echo -e "\n${GREEN}${BOLD}══════════════════════════════════════════════════════════════════${RESET}"
echo -e "  ${GREEN}${BOLD}✔ Zoth Studio Installed Successfully!${RESET}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════════════${RESET}\n"

echo -e "${BOLD}⚡ Quick Start (CLI & TUI):${RESET}"
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo -e "  ${GOLD}Note:${RESET} Add ${CYAN}$BIN_DIR${RESET} to your PATH in ~/.bashrc or ~/.zshrc:"
    echo -e "  ${GRAY}export PATH=\"\$HOME/.local/bin:\$PATH\"${RESET}\n"
fi

echo -e "  ${CYAN}zoth tui${RESET}        Launch interactive Terminal Cockpit (Live Telemetry)"
echo -e "  ${CYAN}zoth start${RESET}      Start all local services (:8484 Orchestrator, :8088 Web)"
echo -e "  ${CYAN}zoth status${RESET}     View real-time status of all ports and tool pipelines"
echo -e "  ${CYAN}zoth doctor${RESET}     Run system health check & diagnostics"
echo -e "  ${CYAN}zoth list${RESET}       Inspect all 298+ registered tools\n"

echo -e "${BOLD}🌐 Web Dashboard & Hub Routes:${RESET}"
echo -e "  • Studio Workstations:  ${CYAN}http://127.0.0.1:8088/studio/${RESET}"
echo -e "  • Operator Deck (:8484): ${CYAN}http://127.0.0.1:8484/${RESET}"
echo -e "  • Website Foundry:       ${CYAN}http://127.0.0.1:8088/studio/site-generator.html${RESET}"
echo -e "  • Master Azoth:          ${CYAN}http://127.0.0.1:8088/zoth/${RESET}\n"

