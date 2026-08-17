#!/usr/bin/env python3
"""
Zoth Multi-Agent Swarm Router & Tool Dispatcher
Connects `zoth-ai:latest` with specialized AI models & local tools:
- Local code & fast inference (zoth-ai:latest / qwen2.5-coder)
- Image/Visual generation delegation
- In-depth research & external queries (Google AI / OpenAI / Claude)
- Local tool execution across 298+ indexed drive tools & Parrot OS arsenal
"""

import json
import urllib.request
import urllib.error
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

ORCH_DIR = Path(__file__).resolve().parents[1]

class ZothSwarmRouter:
    """Intelligent multi-model & tool router for Zoth Studio."""

    def __init__(self, ollama_host: str = "http://127.0.0.1:11434", default_model: str = "zoth-ai:latest", default_timeout: int = 45):
        self.ollama_host = ollama_host
        self.default_model = default_model
        self.default_timeout = default_timeout

    def query_local_model(self, prompt: str, system: Optional[str] = None, model: Optional[str] = None, timeout: Optional[int] = None) -> Dict[str, Any]:
        """Query Ollama running locally (defaulting to zoth-ai:latest)."""
        target_model = model or self.default_model
        to = timeout or self.default_timeout
        if not prompt or not isinstance(prompt, str):
            return {
                "provider": "ollama-local",
                "model": target_model,
                "error": "Empty or invalid prompt provided",
                "status": "error"
            }

        payload = {
            "model": target_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "top_p": 0.9
            }
        }
        if system:
            payload["system"] = system

        try:
            req = urllib.request.Request(
                f"{self.ollama_host}/api/generate",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=to) as res:
                data = json.loads(res.read().decode("utf-8"))
                return {
                    "provider": "ollama-local",
                    "model": target_model,
                    "response": data.get("response", ""),
                    "total_duration_ms": data.get("total_duration", 0) // 1_000_000 if isinstance(data.get("total_duration"), int) else 0,
                    "eval_count": data.get("eval_count", 0),
                    "status": "success"
                }
        except TimeoutError:
            return {
                "provider": "ollama-local",
                "model": target_model,
                "error": f"Request timed out after {to}s",
                "status": "timeout"
            }
        except urllib.error.URLError as ue:
            return {
                "provider": "ollama-local",
                "model": target_model,
                "error": f"Local model unavailable ({ue.reason if hasattr(ue, 'reason') else str(ue)})",
                "status": "fallback_needed"
            }
        except Exception as e:
            return {
                "provider": "ollama-local",
                "model": target_model,
                "error": str(e),
                "status": "fallback_needed"
            }

    def route_task(self, prompt: str, pet_id: Optional[str] = None, api_keys: Optional[Dict[str, str]] = None, execute_local: bool = True) -> Dict[str, Any]:
        """
        Analyzes the prompt, determines required capabilities (tools, image gen, research, code),
        and routes to the appropriate local or peer models.
        """
        if prompt is None or not isinstance(prompt, str):
            clean_prompt = ""
        else:
            clean_prompt = str(prompt).strip()

        p_lower = clean_prompt.lower()
        keys = api_keys if isinstance(api_keys, dict) else {}
        clean_pet_id = str(pet_id).strip() if pet_id and isinstance(pet_id, str) else "kai"

        task_plan: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "prompt": clean_prompt,
            "pet_id": clean_pet_id,
            "delegations": [],
            "action_type": "local_inference"
        }

        if not clean_prompt:
            task_plan["error"] = "Empty prompt"
            task_plan["status"] = "invalid_payload"
            return task_plan

        # 1. Image Generation Intent
        if any(w in p_lower for w in ["generate image", "create image", "logo", "graphic", "wallpaper", "banner", "visual"]):
            task_plan["action_type"] = "image_generation"
            task_plan["delegations"].append({
                "role": "image_generator",
                "provider": "local_asset_synthesizer / dalle_gemini",
                "prompt": clean_prompt,
                "note": "Piped to visual generation engine."
            })

        # 2. Deep Research / Broad Web Intent
        elif any(w in p_lower for w in ["research", "search web", "literature", "latest news", "compare benchmarks"]):
            task_plan["action_type"] = "research"
            provider = "google" if keys.get("google") else "openai" if keys.get("openai") else "local_search"
            task_plan["delegations"].append({
                "role": "deep_researcher",
                "provider": provider,
                "prompt": clean_prompt,
                "note": "Delegating to external research model / search agent."
            })

        # 3. Tool Execution & Inspection Intent
        elif any(w in p_lower for w in ["run", "scan", "audit", "security", "parrot", "doctor", "nmap", "reindex"]):
            task_plan["action_type"] = "tool_execution"
            task_plan["delegations"].append({
                "role": "security_and_ops_sentinel",
                "provider": "zoth_local_terminal",
                "command": clean_prompt,
                "note": "Executing via Parrot OS security arsenal & local orchestrator."
            })

        # Execute primary reasoning with zoth-ai if enabled
        if execute_local:
            local_result = self.query_local_model(clean_prompt)
            task_plan["local_model_execution"] = local_result

        return task_plan

router = ZothSwarmRouter()

if __name__ == "__main__":
    test_res = router.route_task("What are the 9 cyber pets in Zoth Studio?")
    print(json.dumps(test_res, indent=2))
