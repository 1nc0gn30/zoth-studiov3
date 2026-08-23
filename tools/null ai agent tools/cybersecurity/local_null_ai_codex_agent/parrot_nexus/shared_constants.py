"""
shared_constants.py — Single source of truth for values duplicated between
backend/main.py and parrot_nexus.py.
"""

# ── Ollama service ─────────────────────────────────────────────
OLLAMA_HOST = "localhost"
OLLAMA_PORT = 11434
OLLAMA_BASE_URL = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}"
OLLAMA_TAGS_URL = f"{OLLAMA_BASE_URL}/api/tags"
OLLAMA_GENERATE_URL = f"{OLLAMA_BASE_URL}/api/generate"

# ── Default AI model ───────────────────────────────────────────
DEFAULT_MODEL = "gemma4:31b-cloud"

# ── Config data file names ─────────────────────────────────────
PRESETS_FILENAME = "presets.json"
TOOL_OVERRIDES_FILENAME = "tool_overrides.json"
TOOLS_SNAPSHOT_FILENAME = "loaded_tools.json"
