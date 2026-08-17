#!/usr/bin/env python3
"""Automated unit and integration test suite for Zoth Studio Router, ASGI App, and Parrot OS.

Tests coverage:
- Zoth Swarm Router (studio-agents/zoth_router.py)
  - Intent classification (image_generation, research, tool_execution, local_inference)
  - Invalid / empty / non-string prompt handling
  - Non-dict api_keys resilience
  - Local model query fallback & timeouts
- Parrot OS Security Tools Integration (runtime/parrot_os.py)
  - System binary scan & categorization
  - Hardware / OS reporting
  - Version probe exclusions for GUI / daemon tools
- Starlette ASGI App Endpoints (runtime/asgi_app.py)
  - /api/health
  - /api/zoth/swarm (valid, empty prompt, non-dict JSON, malformed JSON)
  - /api/pets, /api/pets/{pet_id}, /api/pets/{pet_id}/brief, /api/pets/{pet_id}/heal
  - /api/fusion/arena (valid prompt, empty body, custom prompt)
  - /api/terminal/exec (valid command, missing command, malformed JSON, timeout simulation)
  - /api/exec (valid command, missing payload, timeout handling)
"""

import json
import os
import sys
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

# Setup import paths
TOOLS_DIR = Path(__file__).resolve().parent
ORCH_DIR = TOOLS_DIR / "null ai agent tools" / "local_null_ai_orchestrator"
if not ORCH_DIR.exists():
    ORCH_DIR = Path(__file__).resolve().parents[1] / "tools" / "null ai agent tools" / "local_null_ai_orchestrator"

sys.path.insert(0, str(ORCH_DIR))
sys.path.insert(0, str(ORCH_DIR / "studio-agents"))
sys.path.insert(0, str(ORCH_DIR / "runtime"))

from starlette.testclient import TestClient
from zoth_router import ZothSwarmRouter
from runtime.parrot_os import (
    detect_hardware,
    get_os_release,
    scan_all_tools,
    system_report,
    TOOL_CATEGORIES,
    _GUI_ONLY_TOOLS,
    _SKIP_VERSION_TOOLS,
)
from runtime.asgi_app import create_app


class TestZothSwarmRouter(unittest.TestCase):
    """Unit tests for ZothSwarmRouter."""

    def setUp(self):
        self.router = ZothSwarmRouter(default_timeout=2)

    def test_route_image_intent(self):
        plan = self.router.route_task("Create image with neon cyber logo", pet_id="kitsune", execute_local=False)
        self.assertEqual(plan["action_type"], "image_generation")
        self.assertEqual(plan["pet_id"], "kitsune")
        self.assertTrue(any(d["role"] == "image_generator" for d in plan["delegations"]))

    def test_route_research_intent(self):
        plan = self.router.route_task("Research latest CVEs and compare benchmarks", api_keys={"google": "fake_key"}, execute_local=False)
        self.assertEqual(plan["action_type"], "research")
        self.assertTrue(any(d["provider"] == "google" for d in plan["delegations"]))

    def test_route_tool_execution_intent(self):
        plan = self.router.route_task("Run security scan on local ports with nmap", execute_local=False)
        self.assertEqual(plan["action_type"], "tool_execution")
        self.assertTrue(any(d["role"] == "security_and_ops_sentinel" for d in plan["delegations"]))

    def test_route_local_inference_default(self):
        plan = self.router.route_task("Explain quantum computing basics", execute_local=False)
        self.assertEqual(plan["action_type"], "local_inference")

    def test_route_invalid_empty_prompt(self):
        plan = self.router.route_task("", execute_local=False)
        self.assertEqual(plan["status"], "invalid_payload")
        self.assertIn("error", plan)

    def test_route_none_or_non_string_prompt(self):
        plan1 = self.router.route_task(None, execute_local=False)
        self.assertEqual(plan1["status"], "invalid_payload")
        plan2 = self.router.route_task(12345, execute_local=False)
        self.assertEqual(plan2["status"], "invalid_payload")

    def test_route_non_dict_api_keys(self):
        plan = self.router.route_task("research quantum computing", api_keys="not-a-dict", execute_local=False)
        self.assertEqual(plan["action_type"], "research")

    def test_query_local_model_offline_fallback(self):
        # Querying non-listening port returns fallback_needed without raising uncaught exception
        custom_router = ZothSwarmRouter(ollama_host="http://127.0.0.1:59999", default_timeout=1)
        res = custom_router.query_local_model("test prompt", timeout=1)
        self.assertEqual(res["status"], "fallback_needed")
        self.assertIn("error", res)

    def test_query_local_model_empty_prompt(self):
        res = self.router.query_local_model("")
        self.assertEqual(res["status"], "error")


class TestParrotOSIntegration(unittest.TestCase):
    """Unit tests for Parrot OS hardware and security tool detection."""

    def test_hardware_detection(self):
        hw = detect_hardware()
        self.assertIsNotNone(hw.cpu_cores)
        self.assertIsInstance(hw.ram_total_gb, (int, float))
        self.assertIsInstance(hw.disk_total_gb, (int, float))

    def test_os_release(self):
        release = get_os_release()
        self.assertIsInstance(release, dict)

    def test_tool_scan(self):
        scan = scan_all_tools()
        self.assertIn("total", scan)
        self.assertIn("tools", scan)
        self.assertIn("categories", scan)
        self.assertIsInstance(scan["tools"], list)
        self.assertIsInstance(scan["categories"], dict)

    def test_system_report(self):
        report = system_report()
        self.assertIn("os", report)
        self.assertIn("hardware", report)
        self.assertIn("tools", report)
        self.assertIn("all_tools_count", report)

    def test_gui_tools_exclusion(self):
        self.assertIn("wireshark", _GUI_ONLY_TOOLS)
        self.assertIn("burpsuite", _GUI_ONLY_TOOLS)
        self.assertIn("ghidra", _GUI_ONLY_TOOLS)
        self.assertIn("zap", _SKIP_VERSION_TOOLS)


class TestASGIEndpoints(unittest.TestCase):
    """Integration & Error handling tests for Starlette ASGI app endpoints."""

    @classmethod
    def setUpClass(cls):
        class DummyHandler:
            SERVER_REGISTRY = {}
            STUDIO_PROJECTS = {}
            AGENTS_STORE = {}
        cls.app = create_app(
            handler_class=DummyHandler,
            host="127.0.0.1",
            port=8484,
            api_token=None,
            orch_dir=ORCH_DIR,
            dashboard_dir=ORCH_DIR / "dashboard"
        )
        cls.client = TestClient(cls.app, raise_server_exceptions=False)

    def test_api_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ok"})

    # --- /api/zoth/swarm tests ---
    def test_zoth_swarm_valid_payload(self):
        with patch.object(ZothSwarmRouter, "query_local_model", return_value={"status": "mock_success", "response": "OK"}):
            res = self.client.post("/api/zoth/swarm", json={"prompt": "audit network security", "pet_id": "lycan"})
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["action_type"], "tool_execution")
            self.assertEqual(data["pet_id"], "lycan")

    def test_zoth_swarm_empty_prompt_400(self):
        res = self.client.post("/api/zoth/swarm", json={"prompt": ""})
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_zoth_swarm_missing_prompt_400(self):
        res = self.client.post("/api/zoth/swarm", json={"pet_id": "kai"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_zoth_swarm_malformed_json_400(self):
        res = self.client.post(
            "/api/zoth/swarm",
            content="NOT_VALID_JSON{",
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_zoth_swarm_non_object_json_400(self):
        res = self.client.post("/api/zoth/swarm", json=["array", "not", "object"])
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    # --- /api/pets tests ---
    def test_api_pets_list(self):
        res = self.client.get("/api/pets")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("pets", data)
        self.assertGreaterEqual(len(data["pets"]), 9)

    def test_api_pets_single_valid(self):
        res = self.client.get("/api/pets/kai")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], "kai")

    def test_api_pets_single_unknown_404(self):
        res = self.client.get("/api/pets/nonexistent_companion_xyz")
        self.assertEqual(res.status_code, 404)
        self.assertIn("error", res.json())

    def test_api_pets_brief_get(self):
        res = self.client.get("/api/pets/draco/brief?task=multi-model%20fusion")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], "draco")
        self.assertIn("prompt", data)

    def test_api_pets_brief_post_valid(self):
        res = self.client.post("/api/pets/lycan/brief", json={"task": "harden OWASP headers"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], "lycan")

    def test_api_pets_heal_single(self):
        res = self.client.post("/api/pets/kai/heal")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], "kai")
        self.assertIn("health", data)

    def test_api_pets_heal_invalid_404(self):
        res = self.client.post("/api/pets/unknown_alien/heal")
        self.assertEqual(res.status_code, 404)

    # --- /api/fusion/arena tests ---
    def test_fusion_arena_valid_payload(self):
        res = self.client.post("/api/fusion/arena", json={"prompt": "Design responsive cyber deck"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("fused_master_code", data)
        self.assertIn("consensus_score", data)
        self.assertIn("models", data)

    def test_fusion_arena_empty_body_fallback(self):
        res = self.client.post("/api/fusion/arena", content="", headers={"Content-Type": "application/json"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("fused_master_code", data)

    def test_fusion_arena_malformed_json_fallback(self):
        res = self.client.post("/api/fusion/arena", content="{invalid_json", headers={"Content-Type": "application/json"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("fused_master_code", data)

    # --- /api/terminal/exec tests ---
    def test_terminal_exec_valid_command(self):
        res = self.client.post("/api/terminal/exec", json={"command": "--help"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("output", data)
        self.assertEqual(data["command"], "--help")

    def test_terminal_exec_missing_command_400(self):
        res = self.client.post("/api/terminal/exec", json={})
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_terminal_exec_empty_command_400(self):
        res = self.client.post("/api/terminal/exec", json={"command": "   "})
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_terminal_exec_malformed_json_400(self):
        res = self.client.post(
            "/api/terminal/exec",
            content="bad_json_string",
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def test_terminal_exec_timeout_graceful(self):
        # Simulate timeout with a custom small timeout parameter using TimeoutExpired
        with patch("subprocess.run", side_effect=subprocess.TimeoutExpired(cmd="sleep 10", timeout=0.2)):
            res = self.client.post("/api/terminal/exec", json={"command": "sleep 10", "timeout": 0.2})
            self.assertEqual(res.status_code, 408)
            data = res.json()
            self.assertIn("error", data)
            self.assertEqual(data.get("status"), "timeout")

    # --- /api/exec tests ---
    def test_api_exec_valid(self):
        res = self.client.post("/api/exec", json={"tool_id": "test", "command": "echo 'zoth_ok'"})
        self.assertEqual(res.status_code, 200)
        self.assertIn("zoth_ok", res.json()["stdout"])

    def test_api_exec_missing_fields_400(self):
        res = self.client.post("/api/exec", json={"tool_id": "test"})
        self.assertEqual(res.status_code, 400)

    def test_api_exec_malformed_json_400(self):
        res = self.client.post(
            "/api/exec",
            content="[broken",
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(res.status_code, 400)

    # --- Catch-all 404 ---
    def test_api_catchall_404(self):
        res = self.client.get("/api/unknown/endpoint/route")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["error"], "not found")


if __name__ == "__main__":
    unittest.main(verbosity=2)
