#!/usr/bin/env python3
"""Zoth Studio & Swarm Router Verification Script.

Runs comprehensive end-to-end integration and error-handling tests on all Zoth Studio
endpoints (/api/zoth/swarm, /api/pets, /api/fusion/arena, /api/terminal/exec, /api/exec, /api/health)
and Parrot OS tool inventory.
"""

import json
import sys
import time
from pathlib import Path
from unittest.mock import patch

TOOLS_DIR = Path(__file__).resolve().parent
ORCH_DIR = TOOLS_DIR / "null ai agent tools" / "local_null_ai_orchestrator"
if not ORCH_DIR.exists():
    ORCH_DIR = Path(__file__).resolve().parents[1] / "tools" / "null ai agent tools" / "local_null_ai_orchestrator"

sys.path.insert(0, str(ORCH_DIR))
sys.path.insert(0, str(ORCH_DIR / "studio-agents"))
sys.path.insert(0, str(ORCH_DIR / "runtime"))

from starlette.testclient import TestClient
from zoth_router import ZothSwarmRouter
from runtime.asgi_app import create_app
from runtime.parrot_os import system_report, scan_all_tools


def run_verification():
    print("=" * 70)
    print("🔍 ZOTH STUDIO SWARM ROUTER & SECURITY ARSENAL VERIFICATION AUDIT")
    print("=" * 70)

    class DummyHandler:
        SERVER_REGISTRY = {}
        STUDIO_PROJECTS = {}
        AGENTS_STORE = {}

    app = create_app(
        handler_class=DummyHandler,
        host="127.0.0.1",
        port=8484,
        api_token=None,
        orch_dir=ORCH_DIR,
        dashboard_dir=ORCH_DIR / "dashboard"
    )
    client = TestClient(app, raise_server_exceptions=False)

    total_tests = 0
    passed_tests = 0
    failed_tests = []

    def check(name: str, condition: bool, details: str = ""):
        nonlocal total_tests, passed_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  ✅ [PASS] {name} {details}")
        else:
            failed_tests.append((name, details))
            print(f"  ❌ [FAIL] {name} {details}")

    # 1. Parrot OS Security Tools & Hardware
    print("\n--- 1. Parrot OS Security Arsenal & Hardware Audit ---")
    report = system_report()
    check("OS detection", bool(report.get("os")), f"OS: {report.get('os', {}).get('name')}")
    check("Hardware stats", report.get("hardware", {}).get("cpu_cores", 0) > 0, f"Cores: {report.get('hardware', {}).get('cpu_cores')}, RAM: {report.get('hardware', {}).get('memory_total_gb')}GB")
    scan = scan_all_tools()
    check("System tool scanning", scan.get("total", 0) > 0, f"Total tools detected: {scan.get('total')}")
    check("Tool categories indexed", len(scan.get("categories", {})) > 0, f"Categories: {list(scan.get('categories', {}).keys())[:4]}...")

    # 2. Zoth Swarm Router Unit Checks
    print("\n--- 2. Zoth Swarm Router Capabilities Audit ---")
    router = ZothSwarmRouter(default_timeout=2)
    p_img = router.route_task("Create banner logo for Zoth Studio", execute_local=False)
    check("Image generation intent routing", p_img.get("action_type") == "image_generation")
    
    p_res = router.route_task("Research OWASP Top 10 vulnerabilities", execute_local=False)
    check("Deep research intent routing", p_res.get("action_type") == "research")

    p_sec = router.route_task("Run nmap audit on internal network", execute_local=False)
    check("Tool execution intent routing", p_sec.get("action_type") == "tool_execution")

    p_empty = router.route_task("", execute_local=False)
    check("Empty prompt error resilience", p_empty.get("status") == "invalid_payload")

    p_none = router.route_task(None, execute_local=False)
    check("NoneType prompt error resilience", p_none.get("status") == "invalid_payload")

    # 3. Endpoint: /api/zoth/swarm
    print("\n--- 3. Endpoint Audit: /api/zoth/swarm ---")
    with patch.object(ZothSwarmRouter, "query_local_model", return_value={"status": "mock_success", "response": "Mocked local response"}):
        res = client.post("/api/zoth/swarm", json={"prompt": "Generate banner logo", "pet_id": "kitsune"})
        check("Swarm route valid payload (200)", res.status_code == 200 and res.json().get("action_type") == "image_generation")

        res_empty = client.post("/api/zoth/swarm", json={"prompt": ""})
        check("Swarm route empty prompt (400)", res_empty.status_code == 400 and "error" in res_empty.json())

        res_malformed = client.post("/api/zoth/swarm", content="{bad_json:", headers={"Content-Type": "application/json"})
        check("Swarm route malformed JSON (400)", res_malformed.status_code == 400 and "error" in res_malformed.json())

        res_non_obj = client.post("/api/zoth/swarm", json=["invalid", "array"])
        check("Swarm route non-object payload (400)", res_non_obj.status_code == 400 and "error" in res_non_obj.json())

    # 4. Endpoint: /api/pets
    print("\n--- 4. Endpoint Audit: /api/pets ---")
    res_pets = client.get("/api/pets")
    check("Get all pets roster (200)", res_pets.status_code == 200 and len(res_pets.json().get("pets", [])) >= 9)

    res_pet_kai = client.get("/api/pets/kai")
    check("Get single pet 'kai' (200)", res_pet_kai.status_code == 200 and res_pet_kai.json().get("id") == "kai")

    res_pet_404 = client.get("/api/pets/ghost_pet_nonexistent")
    check("Get unknown pet returns 404", res_pet_404.status_code == 404)

    res_brief = client.post("/api/pets/draco/brief", json={"task": "Synthesize fusion models"})
    check("Post pet brief for draco (200)", res_brief.status_code == 200 and "prompt" in res_brief.json())

    res_heal = client.post("/api/pets/kai/heal")
    check("Post pet heal for kai (200)", res_heal.status_code == 200 and "health" in res_heal.json())

    # 5. Endpoint: /api/fusion/arena
    print("\n--- 5. Endpoint Audit: /api/fusion/arena ---")
    res_arena = client.post("/api/fusion/arena", json={"prompt": "Build neural cyber UI with Framer Motion"})
    check("Fusion arena valid POST (200)", res_arena.status_code == 200 and res_arena.json().get("status") == "success")
    check("Fusion arena model scoring", res_arena.json().get("consensus_score", 0) > 90)

    res_arena_empty = client.post("/api/fusion/arena", content="", headers={"Content-Type": "application/json"})
    check("Fusion arena empty payload graceful fallback (200)", res_arena_empty.status_code == 200 and "fused_master_code" in res_arena_empty.json())

    # 6. Endpoint: /api/terminal/exec & /api/exec
    print("\n--- 6. Endpoint Audit: /api/terminal/exec & /api/exec (Timeouts & Errors) ---")
    res_term = client.post("/api/terminal/exec", json={"command": "--help"})
    check("Terminal exec valid command (200)", res_term.status_code == 200 and "output" in res_term.json())

    res_term_missing = client.post("/api/terminal/exec", json={})
    check("Terminal exec missing command (400)", res_term_missing.status_code == 400)

    res_term_malformed = client.post("/api/terminal/exec", content="{corrupt", headers={"Content-Type": "application/json"})
    check("Terminal exec malformed JSON (400)", res_term_malformed.status_code == 400)

    import subprocess
    with patch("subprocess.run", side_effect=subprocess.TimeoutExpired(cmd="sleep 10", timeout=1)):
        res = client.post("/api/terminal/exec", json={"command": "sleep 10", "timeout": 1})
        check("Terminal exec timeout handling (408)", res.status_code == 408 and res.json().get("status") == "timeout")

    res_exec = client.post("/api/exec", json={"tool_id": "probe", "command": "echo 'zoth_live'"})
    check("Core exec valid command (200)", res_exec.status_code == 200 and "zoth_live" in res_exec.json().get("stdout", ""))

    res_exec_bad = client.post("/api/exec", content="not_json", headers={"Content-Type": "application/json"})
    check("Core exec malformed payload (400)", res_exec_bad.status_code == 400)

    # 7. Endpoint: /api/health
    print("\n--- 7. Health & Fallback Audit ---")
    res_health = client.get("/api/health")
    check("Health check (200)", res_health.status_code == 200 and res_health.json().get("status") == "ok")

    res_404 = client.get("/api/unknown_route")
    check("Catch-all unmatched API route (404)", res_404.status_code == 404)

    print("\n" + "=" * 70)
    print(f"📊 SUMMARY: {passed_tests}/{total_tests} tests passed ({round((passed_tests/total_tests)*100, 1)}%)")
    print("=" * 70)

    if failed_tests:
        print("\n❌ Failed tests:")
        for name, details in failed_tests:
            print(f"  - {name}: {details}")
        return 1
    else:
        print("\n✨ All tests and endpoint validations passed successfully!")
        return 0


if __name__ == "__main__":
    sys.exit(run_verification())
