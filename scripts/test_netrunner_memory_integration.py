#!/usr/bin/env python3
"""
🧪 ZOTH NETRUNNER DUAL-VERSION MEMORY INTEGRATION TEST
======================================================
Verifies that every tool run and code modification creates both:
1. Human Digestion Version (`human_digest` / clean narrative story)
2. AI Full Spectrum Version (`ai_spectrum` / lossless structured telemetry)
And verifies round-trip fidelity across Python, APIs, CLI, and LLM prompt context XML.
"""

import json
import os
import sys
import subprocess
import time
import urllib.request
import urllib.parse
from pathlib import Path

CORE_APP_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(CORE_APP_DIR / "tools" / "null ai agent tools" / "local_null_ai_orchestrator"))

from runtime.netrunner_memory import (
    record_tool_run,
    record_code_change,
    recall_memories,
    trigger_memory,
    is_memory_daemon_online,
    get_prompt_context,
    format_human_digest,
    format_ai_spectrum,
    MEMORY_API_BASE
)

def run_tests():
    print("==================================================================")
    print("⚡ TESTING ZOTH DUAL-VERSION NETRUNNER MEMORY MATRIX (:8788)")
    print("==================================================================")

    # 1. Daemon Liveness Check
    print("\n[1/7] Checking Netrunner Memory Daemon Liveness (:8788)...")
    daemon_live = is_memory_daemon_online(timeout=1.0)
    print(f"  Daemon Online: {'✔ YES' if daemon_live else '❌ NO'}")
    assert daemon_live, "Netrunner memory daemon on :8788 must be reachable!"

    # 2. Record Tool Run with Dual Versions (Human Digest + AI Spectrum)
    print("\n[2/7] Recording Tool Run Event with Dual Versions...")
    t_res = record_tool_run(
        tool_id="test_security_scanner",
        command="python3 -m pytest tests/security -v",
        agent_id="draco",
        exit_code=0,
        stdout="24 passed, 0 failed in 0.42s. Invariant integrity: VERIFIED.",
        duration_ms=42.1,
        metadata={"category": "security", "rigor": "military_grade", "tags": ["pentest", "auth"]},
        sync=True
    )
    print(f"  Tool Memory ID: {t_res.get('id', 'N/A') if t_res else 'None'}")
    assert t_res and "id" in t_res, "Tool run must encode successfully and return a valid memory ID!"
    assert "human_digest" in t_res, "Tool memory must have human_digest!"
    assert "ai_spectrum" in t_res, "Tool memory must have ai_spectrum!"
    print(f"  ✔ Human Digest: {t_res['human_digest']}")
    print(f"  ✔ AI Spectrum Modality: {t_res['ai_spectrum'].get('modality') if isinstance(t_res['ai_spectrum'], dict) else 'ok'}")
    tool_mem_id = t_res.get("id")

    # 3. Record Code Change with Dual Versions (Human Digest + AI Spectrum)
    print("\n[3/7] Recording Code Change Event with Dual Versions...")
    c_res = record_code_change(
        file_path="src/components/HolographicMatrix.tsx",
        action="refactor",
        agent_id="azoth",
        diff_summary="Added chromatic iridescent shader pass and synaptic glow bindings",
        lines_added=142,
        lines_removed=18,
        language="typescript",
        ast_verified=True,
        metadata={"component": "HolographicMatrix", "version": "3.2.0", "project": "ZothStudio"},
        sync=True
    )
    print(f"  Code Change ID: {c_res.get('id', 'N/A') if c_res else 'None'}")
    assert c_res and "id" in c_res, "Code change must encode successfully and return a valid memory ID!"
    assert "human_digest" in c_res, "Code change must have human_digest!"
    assert "ai_spectrum" in c_res, "Code change must have ai_spectrum!"
    print(f"  ✔ Human Digest: {c_res['human_digest']}")
    print(f"  ✔ AI Spectrum Modality: {c_res['ai_spectrum'].get('modality') if isinstance(c_res['ai_spectrum'], dict) else 'ok'}")
    code_mem_id = c_res.get("id")

    # 4. Recall Memories with Normalized Dual Representations
    print("\n[4/7] Testing Semantic Memory Recall & Dual Normalization...")
    time.sleep(0.2)
    mems = recall_memories(query="HolographicMatrix", limit=5, mode="dual")
    print(f"  Found {len(mems)} matching memories for 'HolographicMatrix':")
    assert len(mems) > 0, "Must be able to recall recently encoded code change!"
    first_mem = mems[0]
    assert "human_digest" in first_mem, "Recalled memory must include human_digest!"
    assert "ai_spectrum" in first_mem, "Recalled memory must include ai_spectrum!"
    print(f"    • [{first_mem.get('id')[:8]}] Human: {first_mem.get('human_digest')[:80]}...")
    print(f"    • [{first_mem.get('id')[:8]}] AI Spectrum Type: {type(first_mem.get('ai_spectrum')).__name__}")

    # 5. Synaptic Activation / Rehearsal
    print("\n[5/7] Testing Synaptic Memory Activation / Rehearsal...")
    trig_res = trigger_memory(code_mem_id, agent_id="grok")
    print(f"  Trigger Result: {len(trig_res) if isinstance(trig_res, list) else trig_res} memory node(s) activated")
    assert trig_res is not None, "Trigger must return valid activated memory node response!"

    # 6. Prompt Context XML Generation (with <human_digest> and <ai_spectrum>)
    print("\n[6/7] Testing Prompt Context XML Generation (Dual Representation)...")
    ctx_xml = get_prompt_context(limit=3, topic="HolographicMatrix", mode="dual")
    assert "<memory_context" in ctx_xml, "Must produce valid XML <memory_context> block!"
    assert "<human_digest>" in ctx_xml, "Must include <human_digest> tag in prompt context!"
    assert "<ai_spectrum>" in ctx_xml, "Must include <ai_spectrum> tag in prompt context!"
    print("  ✔ Verified <human_digest> and <ai_spectrum> present in LLM prompt context XML!")

    # 7. CLI Dual-Mode Inspection Test (`zoth mem list` vs `zoth mem list --spectrum`)
    print("\n[7/7] Testing CLI Dual-View Mode Execution...")
    cli_human = subprocess.run(
        [sys.executable, str(CORE_APP_DIR / "bin" / "zoth"), "mem", "list", "--limit", "2"],
        capture_output=True, text=True
    )
    assert cli_human.returncode == 0, f"CLI mem list failed: {cli_human.stderr}"
    assert "Stored Memory Engrams" in cli_human.stdout, "CLI output must show memories header"
    print("  ✔ CLI Human Digest View rendered cleanly.")

    cli_spec = subprocess.run(
        [sys.executable, str(CORE_APP_DIR / "bin" / "zoth"), "mem", "list", "--spectrum", "--limit", "1"],
        capture_output=True, text=True
    )
    assert cli_spec.returncode == 0, f"CLI mem list --spectrum failed: {cli_spec.stderr}"
    assert "AI Telemetry Spectrum" in cli_spec.stdout or "AI Full Spectrum" in cli_spec.stdout, "CLI output must show AI Telemetry Spectrum"
    print("  ✔ CLI AI Full Spectrum View rendered cleanly.")

    print("\n==================================================================")
    print("✔ ALL 7 NETRUNNER DUAL-VERSION MEMORY TESTS PASSED PERFECTLY!")
    print("==================================================================")

if __name__ == "__main__":
    run_tests()
