#!/usr/bin/env python3
"""
Zoth Local AI Dataset Synthesizer & Modelfile Builder
Extracts comprehensive knowledge from:
- Zoth Studio architecture, components, and doctrines
- All 9 Cyber Pet companions (SYSTEM.md, PLAYBOOK.md, CANON.md)
- All 298 local tool registry definitions (tools.json / registry.local.json)
- Obsidian Vault Category Summaries (00-workspaces through 14-uncategorized)
- Detailed Pour prompt-to-production engine workflows and micro-tasks

Formats everything into JSONL instruction tuning dataset (`zoth_training_dataset.jsonl`)
and generates an Ollama Modelfile (`Modelfile.zoth`) for `zoth-ai:latest`.
"""

import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ORCHESTRATOR_DIR = REPO_ROOT / "tools" / "null ai agent tools" / "local_null_ai_orchestrator"
PETS_DIR = ORCHESTRATOR_DIR / "pets"
REGISTRY_JSON = REPO_ROOT / "public" / "registry" / "tools.json"
REGISTRY_LOCAL = ORCHESTRATOR_DIR / "registry.local.json"
VAULT_CATEGORIES_DIR = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/Obsidian Vault/Categories")
SPARK_POUR_PLAYBOOK = ORCHESTRATOR_DIR / "playbooks" / "spark-pour.json"

DATASET_FILE = REPO_ROOT / "zoth_training_dataset.jsonl"
MODELFILE = REPO_ROOT / "Modelfile.zoth"


def clean_markdown(md_text: str) -> str:
    """Clean frontmatter and excessive whitespace from markdown text."""
    text = md_text.strip()
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2].strip()
    # Remove dataview blocks
    text = re.sub(r"```dataview[\s\S]*?```", "", text).strip()
    return text


def collect_dataset():
    dataset = []
    
    # 1. System Prompt
    system_prompt = (
        "You are Zoth-AI, the specialized, authoritative, lightweight, local-first artificial intelligence built directly into the Zoth Studio ecosystem.\n\n"
        "### CORE ARCHITECTURE & SYSTEM CAPABILITIES:\n"
        "- **3-Tier Local Architecture**:\n"
        "  1. Public Hub (http://127.0.0.1:8088): Static showcase & product story served via Docker Nginx.\n"
        "  2. Operator Deck (http://127.0.0.1:8484): Private FastAPI/Starlette control deck for agent execution, multi-model Fusion Arena, 298+ tool registry, and live terminal.\n"
        "  3. BYOK Vault Daemon (http://127.0.0.1:8787): Local Rust encryption service using Argon2id + XChaCha20-Poly1305 for zero-leak API key protection.\n\n"
        "### POUR WEBSITE GENERATION ENGINE:\n"
        "Pour is Zoth Studio's automated prompt-to-production website and SaaS generator (`http://127.0.0.1:8484/#pour` / `http://127.0.0.1:8765/`).\n"
        "It follows an 8-microstep workflow: (1) Craft/Subject, (2) Audience, (3) Action/CTAs, (4) Brand Name (1-2 words), (5) Headline (<10 words), (6) Offers/Works (3 distinct items), (7) Look & Theme tokens, and (8) Pour/Stamp to compile production-ready static assets in `sites/<slug>/`.\n\n"
        "### 9 CYBER PET COMPANIONS:\n"
        "1. Kai (Workspace & Code Inspector), 2. Draco (Multi-Agent Fusion Compiler), 3. Ignis (Refactoring & Resurrector), 4. Lycan (OWASP Security Sentinel), 5. Athena (Knowledge Graph & AEO), 6. Kitsune (Vibe Coding & Aesthetics), 7. Pixel-Neko (Tool Registry Sentinel), 8. Pixel-Shiba (BYOK Vault Guardian), 9. Radical Minion (Hermes Execution Partner).\n\n"
        "### TOOL REGISTRY & VAULT CATEGORIES:\n"
        "Full awareness of 298 indexed tools spanning 15 categories: 00-workspaces, 01-clients-services, 02-netlify-ax-creator, 03-ai-agents-llm, 04-web-apps-saas, 05-portfolio-agency, 06-learning-courses, 07-security-osint, 08-crypto-web3, 09-games-experiments, 10-python-tools, 11-tools-scripts, 12-rust, 13-creative-media, 14-uncategorized.\n\n"
        "Always provide concise, actionable, technically precise, and privacy-respecting answers."
    )
    
    # Core Architecture & System QAs
    core_qas = [
        {
            "instruction": "What is Zoth Studio and how is it structured?",
            "output": (
                "Zoth Studio is a local-first AI agent powerhouse and flagship control deck. It operates on a 3-tier local architecture:\n"
                "1. **Public Hub** (http://127.0.0.1:8088): Static showcase & product story served via Docker Nginx.\n"
                "2. **Operator Deck** (http://127.0.0.1:8484): Private FastAPI/Starlette control deck for agent execution, multi-model Fusion Arena, 298+ tool registry, and live terminal.\n"
                "3. **BYOK Vault Daemon** (http://127.0.0.1:8787): Local Rust encryption service using Argon2id + XChaCha20-Poly1305 for API keys."
            )
        },
        {
            "instruction": "How do I run Zoth Studio locally?",
            "output": (
                "To run Zoth Studio locally:\n"
                "- **Start Public Hub**: `cd hosting && ./scripts/up.sh local` (serves on http://127.0.0.1:8088)\n"
                "- **Start Operator Deck**: `cd \"tools/null ai agent tools/local_null_ai_orchestrator\" && python3 orchestrator.py serve --host 127.0.0.1 --port 8484`\n"
                "- **Start Vault Daemon**: `cd vault-daemon && ./scripts/run-local.sh` (serves on http://127.0.0.1:8787)"
            )
        },
        {
            "instruction": "List the 9 Zoth Cyber Pet companions and their specializations.",
            "output": (
                "The 9 Zoth Cyber Pet companions and their roles are:\n"
                "1. **Kai** (3D Holographic Cat) — Workspace & Code Inspector\n"
                "2. **Draco** (3D Cyber Dragon) — Multi-Agent Fusion Compiler\n"
                "3. **Ignis** (3D Neon Phoenix) — Refactoring & Pipeline Resurrector\n"
                "4. **Lycan** (3D Cybernetic Wolf) — OWASP Security & Hardening Sentinel\n"
                "5. **Athena** (3D Mecha Owl) — Knowledge Graph & AEO Intelligence\n"
                "6. **Kitsune** (16-Bit Cyber Fox) — Vibe Coding & Aesthetics Master\n"
                "7. **Pixel-Neko** (16-Bit Retro Cat) — Drive Tool Indexer & Registry Sentinel\n"
                "8. **Pixel-Shiba** (16-Bit Cyber Doge) — BYOK Key Vault & Storage Guardian\n"
                "9. **Radical Minion** (Hermes AI) — Autonomous Hermes Execution Partner"
            )
        },
        {
            "instruction": "How does the BYOK Vault Daemon protect sensitive credentials in Zoth Studio?",
            "output": (
                "The BYOK (Bring Your Own Key) Vault Daemon runs as a lightweight, zero-network Rust daemon on port 8787. "
                "It uses Argon2id key derivation combined with XChaCha20-Poly1305 AEAD authenticated encryption to securely store "
                "local API keys (OpenAI, Anthropic, Gemini, Perplexity, OpenRouter, Groq) in an encrypted vault (`~/.zoth/vault.enc`). "
                "Keys are decrypted only in memory when dispatched to model providers and never leave the local environment or touch disk in plaintext."
            )
        }
    ]
    dataset.extend(core_qas)

    # 2. Ingest Detailed Pour Engine Workflows
    pour_qas = [
        {
            "instruction": "What is the Pour engine in Zoth Studio and how does it generate websites?",
            "output": (
                "Pour is Zoth Studio's automated prompt-to-production website and SaaS generator, accessible via `http://127.0.0.1:8484/#pour` "
                "or the standalone Spark service on `http://127.0.0.1:8765/`. "
                "Pour guides operators through an 8-microstep spec-to-production workflow where the local AI writes the copy and site brief "
                "while the Pour engine kit handles file generation, static asset compilation, OWASP security defaults, and Netlify configuration."
            )
        },
        {
            "instruction": "Explain the 8-microstep workflow of the Zoth Studio Pour engine.",
            "output": (
                "The Pour engine executes an 8-microstep workflow designed for deterministic, high-aesthetic site generation:\n"
                "1. **Craft / Subject**: Define the domain, niche, or core service offering.\n"
                "2. **Audience**: Identify the target persona, clients, or user community.\n"
                "3. **Action / Conversion**: Define primary and secondary CTAs (e.g., 'See the work', 'Start a commission').\n"
                "4. **Brand / Name**: Generate a punchy 1-2 word brand name.\n"
                "5. **Headline / Tagline**: Generate a high-impact heading under 10 words.\n"
                "6. **Offers / Works**: Synthesize exactly 3 distinct showcase items, services, or product offerings with meta descriptions.\n"
                "7. **Look & Theme**: Select visual palette tokens, glassmorphism styles, typography, and dark/cyberpunk accents.\n"
                "8. **Pour / Stamp**: Execute `python3 scripts/pour.py \"<brief>\"` to output a ready-to-deploy static web application in `sites/<slug>/` with `index.html`, `style.css`, `_redirects`, and `netlify.toml`."
            )
        },
        {
            "instruction": "What are the output artifacts produced by a Pour engine build?",
            "output": (
                "When the Pour engine stamps a site into `sites/<slug>/`, it creates:\n"
                "- `index.html`: Fully semantic HTML5 structure with responsive hero sections, interactive work grids, and accessible semantics.\n"
                "- `style.css`: Modern glassmorphic and cyberpunk styling with fluid responsive typography and CSS variables.\n"
                "- `_redirects`: Netlify SPA routing rules (`/* /index.html 200`).\n"
                "- `netlify.toml`: Netlify build configuration specifying publish directory and single-page routing.\n"
                "- `images/`: Packaged media and visual assets copied directly from the kit library."
            )
        },
        {
            "instruction": "What is the role of Spark CPU site pour in local AI orchestration?",
            "output": (
                "Spark CPU site pour (`playbooks/spark-pour.json`) is the localized, CPU-efficient playbook within Zoth Studio. "
                "It strictly enforces single-step model calls per suggestion micro-task rather than trying to one-shot an entire codebase, "
                "preventing hallucination while enabling lightweight models (like `qwen2.5-coder:1.5b` or `smollm2:360m`) to generate concise copy "
                "while deterministic Python and Rust harness scripts write the underlying codebase."
            )
        }
    ]
    dataset.extend(pour_qas)

    # 3. Ingest Pet Doctrines into Dataset
    if PETS_DIR.exists():
        for pet_folder in sorted(PETS_DIR.iterdir()):
            if pet_folder.is_dir():
                pet_name = pet_folder.name
                sys_file = pet_folder / "SYSTEM.md"
                play_file = pet_folder / "PLAYBOOK.md"
                canon_file = pet_folder / "CANON.md"
                
                content_pieces = []
                for f in [sys_file, play_file, canon_file]:
                    if f.exists():
                        content_pieces.append(f.read_text(encoding="utf-8"))
                
                if content_pieces:
                    full_doctrine = "\n\n".join(content_pieces)
                    dataset.append({
                        "instruction": f"Explain the doctrine, playbook, and canon for Cyber Pet companion {pet_name}.",
                        "output": full_doctrine
                    })
                    dataset.append({
                        "instruction": f"What is the system prompt and operational role of the cyber pet {pet_name} in Zoth Studio?",
                        "output": sys_file.read_text(encoding="utf-8") if sys_file.exists() else full_doctrine[:500]
                    })

    # 4. Ingest Obsidian Vault Categories (00-workspaces through 14-uncategorized)
    if VAULT_CATEGORIES_DIR.exists():
        category_files = sorted(VAULT_CATEGORIES_DIR.glob("*.md"))
        all_categories_summary = []
        
        for cat_file in category_files:
            cat_name = cat_file.stem
            raw_content = cat_file.read_text(encoding="utf-8")
            clean_content = clean_markdown(raw_content)
            
            all_categories_summary.append(f"- **{cat_name}**: {clean_content[:180].replace(chr(10), ' ')}...")
            
            dataset.append({
                "instruction": f"Provide the category summary and project index for Obsidian Vault category '{cat_name}'.",
                "output": f"### Obsidian Vault Category: {cat_name}\n\n{clean_content}"
            })
            dataset.append({
                "instruction": f"What projects and workflows are mapped under category {cat_name} in the Zoth ecosystem?",
                "output": f"Category {cat_name} includes the following projects and ecosystem role:\n\n{clean_content}"
            })
            
        dataset.append({
            "instruction": "Summarize all 15 project categories (00-workspaces through 14-uncategorized) in the Zoth Studio ecosystem.",
            "output": "The Zoth Studio ecosystem is organized across 15 structured categories:\n\n" + "\n".join(all_categories_summary)
        })

    # 5. Ingest All 298 Tool Registry Definitions
    tools_data = None
    if REGISTRY_JSON.exists():
        try:
            tools_data = json.loads(REGISTRY_JSON.read_text(encoding="utf-8"))
        except Exception:
            pass
    if not tools_data and REGISTRY_LOCAL.exists():
        try:
            tools_data = json.loads(REGISTRY_LOCAL.read_text(encoding="utf-8"))
        except Exception:
            pass

    if tools_data and "tools" in tools_data:
        tools_list = tools_data["tools"]
        print(f"[+] Loaded {len(tools_list)} tools from registry.")
        
        # Ingest category groupings of tools
        categories_dict = {}
        for tool in tools_list:
            c = tool.get("category", "Uncategorized")
            categories_dict.setdefault(c, []).append(tool)
            
            # Individual Tool QA
            tool_id = tool.get("id", "")
            tool_name = tool.get("name", tool_id)
            tool_desc = tool.get("description", "")
            tool_cat = tool.get("category", "")
            tool_path = tool.get("relative_path", "")
            tool_runtimes = ", ".join(tool.get("runtimes", [])) or "None specified"
            tool_tags = ", ".join(tool.get("tags", [])) or "None"
            
            dataset.append({
                "instruction": f"Describe the tool '{tool_name}' ({tool_id}) in the Zoth Studio local tool registry.",
                "output": (
                    f"**Tool Name:** {tool_name}\n"
                    f"**ID:** {tool_id}\n"
                    f"**Category:** {tool_cat}\n"
                    f"**Relative Path:** `{tool_path}`\n"
                    f"**Runtimes:** {tool_runtimes}\n"
                    f"**Tags:** {tool_tags}\n"
                    f"**Description:** {tool_desc}"
                )
            })
            
        # Category-level tool listings
        for cat_name, cat_tools in categories_dict.items():
            tool_summaries = [
                f"- **{t.get('name', t.get('id'))}** (`{t.get('id')}`): {t.get('description', '')} [Path: `{t.get('relative_path')}`]"
                for t in cat_tools
            ]
            dataset.append({
                "instruction": f"List all tools under the '{cat_name}' category in Zoth Studio's tool registry.",
                "output": f"The '{cat_name}' category contains {len(cat_tools)} registered tools:\n\n" + "\n".join(tool_summaries)
            })
            
        # Full Registry Overview QA
        dataset.append({
            "instruction": "What is the total count and distribution of tools in the Zoth Studio local tool registry?",
            "output": (
                f"The Zoth Studio registry indexes {len(tools_list)} tools across {len(categories_dict)} categories:\n"
                + "\n".join([f"- **{c}**: {len(ts)} tools" for c, ts in sorted(categories_dict.items(), key=lambda x: -len(x[1]))])
            )
        })

    # Write Dataset JSONL
    with open(DATASET_FILE, "w", encoding="utf-8") as f:
        for item in dataset:
            entry = {
                "system": system_prompt,
                "user": item["instruction"],
                "assistant": item["output"]
            }
            f.write(json.dumps(entry) + "\n")
            
    print(f"[+] Dataset written: {DATASET_FILE} ({len(dataset)} examples)")
    return system_prompt


def build_modelfile(system_prompt: str):
    # Escape triple quotes for the modelfile
    escaped_sys = system_prompt.replace('"""', '\\"\\"\\"')
    modelfile_content = f"""FROM qwen2.5-coder:1.5b

# System Prompt embedding Zoth Studio Knowledge Base
SYSTEM \"\"\"{escaped_sys}\"\"\"

# Hyperparameters tailored for fast, precise local execution
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|endoftext|>"

TEMPLATE \"\"\"<|im_start|>system
{{{{ .System }}}}<|im_end|>
<|im_start|>user
{{{{ .Prompt }}}}<|im_end|>
<|im_start|>assistant
\"\"\"
"""

    with open(MODELFILE, "w", encoding="utf-8") as f:
        f.write(modelfile_content)
        
    print(f"[+] Modelfile created: {MODELFILE}")


if __name__ == "__main__":
    sys_prompt = collect_dataset()
    build_modelfile(sys_prompt)
