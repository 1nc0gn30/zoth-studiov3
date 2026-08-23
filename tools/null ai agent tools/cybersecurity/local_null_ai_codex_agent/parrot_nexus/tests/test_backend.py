"""Backend API tests for parrot_nexus.

Uses the Flask test client only. Anything that shells out, touches
hardware/PTYs, or hits the network is mocked. No real security tools
are ever executed.
"""

import json
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

import main  # noqa: E402


@pytest.fixture()
def client():
    main.app.config["TESTING"] = True
    with main.app.test_client() as c:
        yield c


# ---------------------------------------------------------------- /api/tools

def test_list_tools_success(client):
    with patch.object(main, "discover_installed_tools", return_value={}), \
         patch("main.shutil.which", return_value="/usr/bin/nmap"):
        main._TOOLS_CACHE["data"] = None  # bust cache
        resp = client.get("/api/tools")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["status"] == "success"
    assert isinstance(body["data"], list)
    assert len(body["data"]) > 0
    sample = body["data"][0]
    assert "name" in sample


def test_list_tools_cache_hit(client):
    cached = [{"name": "cached-tool"}]
    main._TOOLS_CACHE["data"] = cached
    main._TOOLS_CACHE["at"] = __import__("time").time()
    try:
        resp = client.get("/api/tools")
        assert resp.status_code == 200
        assert resp.get_json()["data"] == cached
    finally:
        main._TOOLS_CACHE["data"] = None


# -------------------------------------------------------------- /api/presets

def test_list_presets(client, tmp_path):
    presets = [{"id": "test-preset", "name": "Test", "cmd": ["/bin/echo", "hi"], "cwd": "/tmp"}]
    with patch.object(main, "PRESETS_PATH", tmp_path / "presets.json"):
        main.PRESETS_PATH.write_text(json.dumps(presets))
        resp = client.get("/api/presets")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["status"] == "success"
    assert body["data"] == presets


def test_list_presets_missing_file(client, tmp_path):
    with patch.object(main, "PRESETS_PATH", tmp_path / "nope.json"):
        resp = client.get("/api/presets")
    assert resp.status_code == 200
    assert resp.get_json()["data"] == []


def test_launch_preset_missing_id(client):
    resp = client.post("/api/presets/launch", json={})
    assert resp.status_code == 400
    assert resp.get_json()["status"] == "error"


def test_launch_preset_not_found(client, tmp_path):
    with patch.object(main, "PRESETS_PATH", tmp_path / "presets.json"):
        main.PRESETS_PATH.write_text(json.dumps([]))
        resp = client.post("/api/presets/launch", json={"preset_id": "ghost"})
    assert resp.status_code == 404


def test_launch_preset_success(client, tmp_path):
    preset = {"id": "echo", "name": "Echo", "cmd": ["/bin/echo", "{msg}"], "cwd": "/tmp"}
    with patch.object(main, "PRESETS_PATH", tmp_path / "presets.json"):
        main.PRESETS_PATH.write_text(json.dumps([preset]))
        resp = client.post(
            "/api/presets/launch",
            json={"preset_id": "echo", "variables": {"msg": "hello"}},
        )
    assert resp.status_code == 200
    data = resp.get_json()["data"]
    # The command is built, never executed.
    assert data["cmd"] == ["/bin/echo", "hello"]
    assert data["cwd"] == "/tmp"


# ------------------------------------------------------------ /api/playbooks

def test_list_playbooks(client, tmp_path):
    pb = {"id": "demo", "name": "Demo Playbook", "steps": []}
    (tmp_path / "demo.json").write_text(json.dumps(pb))
    with patch.object(main, "PLAYBOOKS_DIR", tmp_path):
        resp = client.get("/api/playbooks")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["status"] == "success"
    assert body["data"] == [pb]


def test_get_playbook_found(client, tmp_path):
    pb = {"id": "demo", "name": "Demo Playbook"}
    (tmp_path / "demo.json").write_text(json.dumps(pb))
    with patch.object(main, "PLAYBOOKS_DIR", tmp_path):
        resp = client.get("/api/playbooks/demo")
    assert resp.status_code == 200
    assert resp.get_json()["data"]["id"] == "demo"


def test_get_playbook_not_found(client, tmp_path):
    with patch.object(main, "PLAYBOOKS_DIR", tmp_path):
        resp = client.get("/api/playbooks/ghost")
    assert resp.status_code == 404


def test_playbook_session_requires_sid(client):
    resp = client.post("/api/playbooks/session", json={})
    assert resp.status_code == 400
    assert resp.get_json()["status"] == "error"


# ------------------------------------------------- misc safe read-only routes

def test_agent_status(client):
    resp = client.get("/api/agent/status")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "success"


def test_heartbeat_status(client):
    resp = client.get("/api/heartbeat/status")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "success"


def test_ai_models_no_network(client):
    # Mock requests so no network call can happen.
    with patch.object(main.requests, "get") as mock_get:
        mock_get.return_value.json.return_value = {"models": [{"name": "fake"}]}
        resp = client.get("/api/ai/models")
    assert resp.status_code == 200
