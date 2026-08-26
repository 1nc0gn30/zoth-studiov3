"""
⚡ ZOTH STUDIO — Autonomous AI Tools & Harnesses Installer Registry
=============================================================================
Provides cross-platform detection, live installation status probes, and
one-click OS-aware installation workflows for modern AI agent harnesses.
=============================================================================
"""

import os
import sys
import json
import shutil
import platform
import subprocess
from typing import Dict, Any, List

# Enhanced Search Paths across Linux, macOS, and Windows
_EXTRA_SEARCH_DIRS = [
    "/usr/local/bin", "/usr/local/sbin", "/usr/bin", "/usr/sbin",
    "/bin", "/sbin", "/snap/bin",
    os.path.expanduser("~/.local/bin"),
    os.path.expanduser("~/go/bin"),
    os.path.expanduser("~/.npm-global/bin"),
    os.path.expanduser("~/.cargo/bin"),
    os.path.expanduser("~/.hermes/bin")
]

AI_TOOL_CATALOG = [
    {
        "id": "antigravity",
        "name": "Google Antigravity CLI",
        "binary": "agy",
        "aliases": ["agy", "antigravity-cli"],
        "category": "Security & Architecture",
        "desc": "Autonomous pair programming agent with deep AST invariants, security verification, and multi-agent cascades.",
        "icon": "🐺",
        "doc_route": "/docs/antigravity.html",
        "github": "https://github.com/google/antigravity",
        "install": {
            "linux": "curl -fsSL https://antigravity.google.com/install.sh | bash",
            "macos": "brew install google/tap/antigravity || curl -fsSL https://antigravity.google.com/install.sh | bash",
            "windows": "irm https://antigravity.google.com/install.ps1 | iex"
        }
    },
    {
        "id": "hermes",
        "name": "Hermes Agent & ACP",
        "binary": "hermes",
        "aliases": ["hermes", "hermes-acp", "hermes-agent"],
        "category": "JSON Schemas & Tools",
        "desc": "Autonomous tool-calling agent with strict JSON schema compliance, visual DAG playbooks, and multi-provider slots.",
        "icon": "🐲",
        "doc_route": "/docs/hermes.html",
        "github": "https://github.com/NousResearch/Hermes-Agent",
        "install": {
            "linux": "pip install --upgrade hermes-agent || pip install hermes",
            "macos": "pip3 install hermes-agent",
            "windows": "pip install hermes-agent"
        }
    },
    {
        "id": "grok",
        "name": "Grok Build CLI",
        "binary": "grok",
        "aliases": ["grok", "grok-cli", "grok-build"],
        "category": "High-Throughput Coder",
        "desc": "High-velocity streaming code generator with GitHub Octokit harness and instant TUI.",
        "icon": "🦊",
        "doc_route": "/docs/grok.html",
        "github": "https://github.com/xai-org/grok-cli",
        "install": {
            "linux": "npm install -g @xai/grok-cli || cargo install grok-cli",
            "macos": "npm install -g @xai/grok-cli",
            "windows": "npm install -g @xai/grok-cli"
        }
    },
    {
        "id": "claude",
        "name": "Claude Code CLI",
        "binary": "claude",
        "aliases": ["claude", "claude-code"],
        "category": "Reasoning & Refactoring",
        "desc": "Agentic coding tool that navigates codebases, edits files, and executes commands with deep reasoning.",
        "icon": "🟣",
        "doc_route": "/docs/claude.html",
        "github": "https://github.com/anthropics/claude-code",
        "install": {
            "linux": "npm install -g @anthropic-ai/claude-code",
            "macos": "npm install -g @anthropic-ai/claude-code",
            "windows": "npm install -g @anthropic-ai/claude-code"
        }
    },
    {
        "id": "opencode",
        "name": "OpenCode / OpenClaw",
        "binary": "opencode",
        "aliases": ["opencode", "openclaw", "claw"],
        "category": "Fullstack Agent Harness",
        "desc": "Open agent execution protocol with full-stack DAG orchestrator and containerized tool execution.",
        "icon": "🧩",
        "doc_route": "/docs/opencode.html",
        "github": "https://github.com/openclaw-ai/opencode",
        "install": {
            "linux": "pip install opencode-ai || npm install -g opencode",
            "macos": "pip3 install opencode-ai",
            "windows": "pip install opencode-ai"
        }
    },
    {
        "id": "codex",
        "name": "Codex CLI",
        "binary": "codex",
        "aliases": ["codex", "openai-codex"],
        "category": "Production Architect",
        "desc": "Structured code generation and migration assistant with strict syntax guarantees.",
        "icon": "🤖",
        "doc_route": "/docs/codex.html",
        "github": "https://github.com/openai/codex-cli",
        "install": {
            "linux": "npm install -g @openai/codex",
            "macos": "npm install -g @openai/codex",
            "windows": "npm install -g @openai/codex"
        }
    },
    {
        "id": "aider",
        "name": "Aider Pair Programmer",
        "binary": "aider",
        "aliases": ["aider", "aider-chat"],
        "category": "Git-Aware Pair Coder",
        "desc": "AI pair programming in your terminal, with automated git commits and AST diff patching.",
        "icon": "⚡",
        "doc_route": "/docs/aider.html",
        "github": "https://github.com/paul-gauthier/aider",
        "install": {
            "linux": "pip install aider-chat",
            "macos": "brew install aider || pip install aider-chat",
            "windows": "pip install aider-chat"
        }
    },
    {
        "id": "ollama",
        "name": "Ollama Local Engine",
        "binary": "ollama",
        "aliases": ["ollama"],
        "category": "Zero-Cloud Local Inference",
        "desc": "Run open-weight frontier models (qwen2.5-coder, hermes3, llama3) completely offline on 127.0.0.1:11434.",
        "icon": "🦙",
        "doc_route": "/docs/ollama.html",
        "github": "https://github.com/ollama/ollama",
        "install": {
            "linux": "curl -fsSL https://ollama.com/install.sh | sh",
            "macos": "brew install ollama || curl -fsSL https://ollama.com/install.sh | sh",
            "windows": "winget install Ollama.Ollama"
        }
    },
    {
        "id": "lafvin",
        "name": "Lafvin Hardware Companion",
        "binary": "zoth_bridge.py",
        "aliases": ["zoth_bridge.py", "lafvin"],
        "category": "ESP32-S3 Hardware Hub",
        "desc": "Physical desktop companion bridge with ST7789 TFT screen rendering, DSP audio chime, and telemetry.",
        "icon": "🦾",
        "doc_route": "/hardware-arduino/docs/HARDWARE_PROTOCOL.md",
        "github": "https://github.com/NullAITech/zoth-studio",
        "install": {
            "linux": "pip install pyserial edge-tts Pillow",
            "macos": "pip3 install pyserial edge-tts Pillow",
            "windows": "pip install pyserial edge-tts Pillow"
        }
    },
    {
        "id": "zoth-vault",
        "name": "Argon2id Hardware Key Vault",
        "binary": "vault-daemon",
        "aliases": ["vault-daemon", "byok-vault"],
        "category": "Cryptographic Key Guard",
        "desc": "Rust-powered sovereign BYOK vault daemon keeping all API keys encrypted on loopback :8787.",
        "icon": "🔒",
        "doc_route": "/vault/index.html",
        "github": "https://github.com/NullAITech/zoth-studio",
        "install": {
            "linux": "cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/vault-daemon && cargo build --release",
            "macos": "cargo build --release",
            "windows": "cargo build --release"
        }
    },
    {
        "id": "subsweep",
        "name": "SubSweep OSINT Recon",
        "binary": "subsweep",
        "aliases": ["subsweep", "subsweep.py"],
        "category": "Attack Surface Scanner",
        "desc": "Fast attack surface discovery, TLS certificate monitoring, and security header auditing.",
        "icon": "🔍",
        "doc_route": "/studio/subsweep.html",
        "github": "https://github.com/NullAITech/zoth-studio",
        "install": {
            "linux": "pip install requests dnspython cryptography",
            "macos": "pip3 install requests dnspython cryptography",
            "windows": "pip install requests dnspython cryptography"
        }
    },
    {
        "id": "radare2",
        "name": "Radare2 / R2 Reverse Engineering",
        "binary": "r2",
        "aliases": ["r2", "radare2", "rizin"],
        "category": "Binary Analysis & Disassembly",
        "desc": "Advanced UNIX reverse engineering framework and command-line disassembler.",
        "icon": "💀",
        "doc_route": "/studio/malware-lab.html",
        "github": "https://github.com/radareorg/radare2",
        "install": {
            "linux": "sudo apt install radare2 || git clone https://github.com/radareorg/radare2 && radare2/sys/install.sh",
            "macos": "brew install radare2",
            "windows": "winget install radareorg.radare2"
        }
    },
    {
        "id": "cursor",
        "name": "Cursor AI Editor",
        "binary": "cursor",
        "aliases": ["cursor", "cursor-cli"],
        "category": "AI Code Workstation",
        "desc": "Next-generation AI code editor built on VS Code with codebase indexing and multi-file edits.",
        "icon": "⚡",
        "doc_route": "/docs/index.html",
        "github": "https://www.cursor.com",
        "install": {
            "linux": "curl -fsSL https://downloader.cursor.sh/linux/appImage/x64 -o cursor.AppImage && chmod +x cursor.AppImage",
            "macos": "brew install --cask cursor",
            "windows": "winget install Anysphere.Cursor"
        }
    },
    {
        "id": "fabric",
        "name": "Fabric AI Framework",
        "binary": "fabric",
        "aliases": ["fabric", "fabric-cli"],
        "category": "Prompt & Human Augmentation",
        "desc": "Open-source framework for augmenting humans using AI with reusable prompt patterns.",
        "icon": "🧵",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/danielmiessler/fabric",
        "install": {
            "linux": "go install github.com/danielmiessler/fabric@latest",
            "macos": "brew install fabric || go install github.com/danielmiessler/fabric@latest",
            "windows": "go install github.com/danielmiessler/fabric@latest"
        }
    },
    {
        "id": "vllm",
        "name": "vLLM Inference Server",
        "binary": "vllm",
        "aliases": ["vllm", "vllm_server"],
        "category": "High-Throughput Serving",
        "desc": "High-throughput, memory-efficient LLM serving engine with PagedAttention and OpenAI-compatible API.",
        "icon": "🚀",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/vllm-project/vllm",
        "install": {
            "linux": "pip install vllm",
            "macos": "pip install vllm",
            "windows": "pip install vllm"
        }
    },
    {
        "id": "llama-server",
        "name": "llama.cpp GGUF Engine",
        "binary": "llama-server",
        "aliases": ["llama-server", "llama-cli", "main"],
        "category": "Low-Level C/C++ Inference",
        "desc": "Lightweight pure C/C++ LLM inference engine supporting 4-bit and 8-bit GGUF quantization.",
        "icon": "🦙",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/ggerganov/llama.cpp",
        "install": {
            "linux": "sudo apt install llama.cpp || brew install llama.cpp",
            "macos": "brew install llama.cpp",
            "windows": "winget install ggerganov.llama.cpp"
        }
    },
    {
        "id": "sgpt",
        "name": "Shell-GPT (SGPT)",
        "binary": "sgpt",
        "aliases": ["sgpt", "shell-gpt"],
        "category": "Terminal Command Synthesizer",
        "desc": "Command-line AI assistant for shell commands, code snippets, git commits, and inline terminal queries.",
        "icon": "🐚",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/TheR1D/shell_gpt",
        "install": {
            "linux": "pip install shell-gpt",
            "macos": "brew install shell-gpt || pip install shell-gpt",
            "windows": "pip install shell-gpt"
        }
    },
    {
        "id": "aichat",
        "name": "AIChat Terminal",
        "binary": "aichat",
        "aliases": ["aichat"],
        "category": "Multi-Provider Terminal Client",
        "desc": "Rust-powered All-in-One AI CLI tool supporting 20+ LLM providers, local models, and RAG search.",
        "icon": "💬",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/sigoden/aichat",
        "install": {
            "linux": "cargo install aichat || brew install aichat",
            "macos": "brew install aichat",
            "windows": "winget install sigoden.aichat"
        }
    },
    {
        "id": "llm",
        "name": "LLM CLI (Simon Willison)",
        "binary": "llm",
        "aliases": ["llm"],
        "category": "Modular Python AI Hub",
        "desc": "CLI utility and Python library for accessing and embedding local and cloud LLMs with plugins.",
        "icon": "📦",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/simonw/llm",
        "install": {
            "linux": "pip install llm",
            "macos": "brew install llm || pip install llm",
            "windows": "pip install llm"
        }
    },
    {
        "id": "huggingface",
        "name": "Hugging Face Hub CLI",
        "binary": "huggingface-cli",
        "aliases": ["huggingface-cli", "hf"],
        "category": "Weights & Datasets Vault",
        "desc": "Official CLI for discovering, downloading, and managing transformer models, GGUF weights, and datasets.",
        "icon": "🤗",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/huggingface/huggingface_hub",
        "install": {
            "linux": "pip install --upgrade huggingface_hub",
            "macos": "pip3 install --upgrade huggingface_hub",
            "windows": "pip install --upgrade huggingface_hub"
        }
    },
    {
        "id": "litellm",
        "name": "LiteLLM Proxy & Gateway",
        "binary": "litellm",
        "aliases": ["litellm"],
        "category": "Universal API Proxy & Router",
        "desc": "Call 100+ LLMs using OpenAI format, load balancing, rate limiting, and fallback routing.",
        "icon": "🔀",
        "doc_route": "/docs/index.html",
        "github": "https://github.com/BerriAI/litellm",
        "install": {
            "linux": "pip install litellm[proxy]",
            "macos": "pip3 install litellm[proxy]",
            "windows": "pip install litellm[proxy]"
        }
    }
]

def detect_host_os() -> str:
    """Identify host operating system."""
    sys_name = platform.system().lower()
    if "linux" in sys_name:
        return "linux"
    elif "darwin" in sys_name or "mac" in sys_name:
        return "macos"
    elif "windows" in sys_name:
        return "windows"
    return "linux"

def find_tool_binary(tool_def: dict) -> tuple[bool, str, str]:
    """Check whether a tool binary is present in search paths and probe version."""
    bin_names = tool_def.get("aliases", [tool_def.get("binary")])
    found_path = None
    
    # 1. Check PATH via shutil.which
    for b in bin_names:
        p = shutil.which(b)
        if p and os.path.isfile(p) and os.access(p, os.X_OK):
            found_path = p
            break
            
    # 2. Check extra search directories
    if not found_path:
        for d in _EXTRA_SEARCH_DIRS:
            for b in bin_names:
                cand = os.path.join(d, b)
                if os.path.isfile(cand) and os.access(cand, os.X_OK):
                    found_path = cand
                    break
            if found_path:
                break

    if not found_path:
        return False, "", "Not Detected"

    # Version probe
    ver = "Installed"
    try:
        res = subprocess.run([found_path, "--version"], capture_output=True, text=True, timeout=3)
        out = (res.stdout or res.stderr or "").strip().split("\n")[0]
        if out:
            ver = out[:45]
    except Exception:
        pass

    return True, found_path, ver

def get_complete_tools_inventory() -> dict:
    """Return complete status and install metadata for all supported AI harnesses."""
    host_os = detect_host_os()
    result = {
        "host_os": host_os,
        "os_name": platform.platform(),
        "tools": []
    }

    for item in AI_TOOL_CATALOG:
        installed, path, ver = find_tool_binary(item)
        
        # Special check for local Ollama daemon port
        running_service = False
        if item["id"] == "ollama" and installed:
            try:
                import socket
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.3)
                running_service = (s.connect_ex(("127.0.0.1", 11434)) == 0)
                s.close()
            except Exception:
                pass

        cmd_for_os = item["install"].get(host_os, item["install"]["linux"])
        result["tools"].append({
            "id": item["id"],
            "name": item["name"],
            "binary": item["binary"],
            "category": item["category"],
            "desc": item["desc"],
            "icon": item["icon"],
            "doc_route": item["doc_route"],
            "github": item["github"],
            "installed": installed,
            "path": path,
            "version": ver,
            "running": running_service,
            "install_cmd": cmd_for_os,
            "install_options": item["install"]
        })

    return result

def run_automated_installer(tool_id: str) -> dict:
    """Execute safe built-in installer on host machine."""
    tool_def = next((t for t in AI_TOOL_CATALOG if t["id"] == tool_id), None)
    if not tool_def:
        return {"status": "error", "message": f"Unknown tool ID: {tool_id}"}

    host_os = detect_host_os()
    install_cmd = tool_def["install"].get(host_os)
    if not install_cmd:
        return {"status": "error", "message": f"No installer available for {host_os}"}

    # Prepare environment with expanded PATH
    env = os.environ.copy()
    env["PATH"] = env.get("PATH", "") + os.pathsep + os.pathsep.join(_EXTRA_SEARCH_DIRS)

    try:
        proc = subprocess.Popen(
            install_cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            text=True
        )
        return {
            "status": "started",
            "tool_id": tool_id,
            "tool_name": tool_def["name"],
            "pid": proc.pid,
            "install_cmd": install_cmd,
            "message": f"Installer initiated for {tool_def['name']}."
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
