# 🌌 Parrot Nexus | Unified Security & Intelligence Hub

## 📝 Project Overview
Parrot Nexus is a high-performance, dark-themed operator's dashboard designed for Parrot OS. It transforms the experience of using security tools by moving away from fragmented terminal windows into a single, integrated "Tool Workspace" that combines live execution, AI intelligence, and rapid-reference documentation.

### 🚀 Current Capabilities
- **Tool Discovery**: Automatically scans `/usr/bin` to identify installed security tools.
- **Interactive Workspaces**: Integrated `Xterm.js` terminals using `pty` for real-time tool interaction.
- **AI Integration**: Direct bridge to local **Ollama** instances for security auditing assistance.
- **Smart Cheat Sheets**: One-click command insertion (fill-in-the-blank) for rapid tool deployment.
- **Intelligence Hub**: Dedicated category for AI tools like Codex, OpenClaw, and Ollama.
- **Null AI Branding**: Themed with the Null AI ghost mascot and a high-contrast neon aesthetic.

## 🛠️ Technical Stack
- **Backend**: Python / Flask / Flask-SocketIO / PTY (Pseudo-Terminals)
- **Frontend**: HTML5 / Tailwind CSS / Xterm.js / Socket.io
- **AI Engine**: Ollama (Local Llama3)
- **OS Target**: Parrot OS (Linux)

---

## 📋 TODO List (Future Roadmap)

### ⚡ Phase 1: Advanced Operator Features (High Priority)
- [ ] **AI Recipes**: Create "One-Click Audit" chains (e.g., Nmap $\to$ Gobuster $\to$ Nikto) that sequence tools automatically.
- [ ] **Session Snapshots**: Ability to save terminal output and AI chat logs into a "Case File" for later review.
- [ ] **Command History**: A persistent history of all commands run across different tool workspaces.

### 🧠 Phase 2: Intelligence Expansion (Medium Priority)
- [ ] **Direct AI Command Suggestion**: A button in the terminal that sends the current terminal output to the AI for analysis/explanation.
- [ ] **Custom Tool Knowledge Base**: Allow the user to edit `TOOL_DATA` via the UI to add their own custom cheat sheets and a la carte docs.
- [ ] **Model Selector**: Add a dropdown in the AI panel to switch between different local Ollama models (e.g., Mistral, Codellama).

### 🎨 Phase 3: UI/UX Polish (Low Priority)
- [ ] **Multi-Terminal Tabs**: Allow opening multiple tool workspaces in a tabbed interface.
- [ ] **System Telemetry**: Add a "System Pulse" bar (CPU/RAM/Net) to the top of the dashboard.
- [ ] **Custom Themes**: Add "Matrix Green", "Cyberpunk Pink", and "Classic Parrot" theme toggles.

---

## 🚦 Quick Start Guide
1. **Start Backend**: `cd backend && python3 main.py`
2. **Start AI**: `ollama serve`
3. **Launch UI (React/Vite)**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
