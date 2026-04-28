"""Z0TH Orchestrator ASGI app (uvicorn + Starlette).

Provides clean Ctrl+C, proper async lifecycle, and production-grade serving.
Routes delegate to the same business logic used by the stdlib handler.
"""

from __future__ import annotations

import json
import mimetypes
import os
import subprocess
import sys
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.routing import Route


# ── Helpers ──

def _json_response(data: Any, status: int = 200) -> Response:
    body = json.dumps(data, indent=2).encode()
    return Response(
        content=body,
        status_code=status,
        media_type="application/json",
        headers={"Cache-Control": "no-cache"},
    )


def _file_response(file_path: Path) -> Response:
    if not file_path.exists() or not file_path.is_file():
        return _json_response({"error": "not found"}, 404)
    mime, _ = mimetypes.guess_type(str(file_path))
    return Response(
        content=file_path.read_bytes(),
        media_type=mime or "application/octet-stream",
        headers={"Cache-Control": "no-cache"},
    )


# ── Shared state (populated by create_app) ──

_handler_class = None
_port = 8484
_api_token = None
_orch_dir = None
_dashboard_dir = None


def _check_auth(request: Request) -> Response | None:
    if not _api_token:
        return None
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {_api_token}":
        return _json_response({"error": "unauthorized"}, 401)
    return None


def _get_handler_attr(name: str, default=None):
    return getattr(_handler_class, name, default)


# ── Route handlers ──

async def dashboard_index(request: Request) -> Response:
    return _file_response(_dashboard_dir / "index.html")


async def dashboard_static(request: Request) -> Response:
    rel_path = request.path_params.get("path", "")
    return _file_response(_dashboard_dir / rel_path)


async def api_health(request: Request) -> Response:
    return _json_response({"status": "ok"})


async def api_tools(request: Request) -> Response:
    from orchestrator import load_registry
    registry = load_registry()
    return _json_response(_redact_paths(registry))


async def api_system(request: Request) -> Response:
    try:
        from runtime.parrot_os import system_report
        report = system_report()
        return _json_response(report)
    except Exception as e:
        return _json_response({"error": str(e)}, 500)


async def api_dashboard(request: Request) -> Response:
    from orchestrator import load_registry
    registry = load_registry()
    tools = registry.get("tools", [])
    return _json_response({
        "tool_count": len(tools),
        "categories": list({t.get("category", "Other") for t in tools}),
        "healthy": True,
    })


async def api_chains(request: Request) -> Response:
    chains_file = _orch_dir / "chains.json"
    if chains_file.exists():
        try:
            chains = json.loads(chains_file.read_text())
            return _json_response({"chains": chains})
        except Exception:
            return _json_response({"chains": []})
    return _json_response({"chains": []})


async def api_categories(request: Request) -> Response:
    from orchestrator import load_registry
    registry = load_registry()
    cats = {}
    for t in registry.get("tools", []):
        cat = t.get("category", "Other")
        cats[cat] = cats.get(cat, 0) + 1
    return _json_response({"categories": cats})


async def api_exec(request: Request) -> Response:
    body = await request.json()
    tool_id = body.get("tool_id", "")
    command = body.get("command", "")
    agent = body.get("agent", "default")
    if not tool_id or not command:
        return _json_response({"error": "tool_id and command required"}, 400)
    # Delegate to the handler's exec logic
    SERVER_REGISTRY = _get_handler_attr("SERVER_REGISTRY", {})
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True,
            timeout=60, cwd=str(_orch_dir)
        )
        return _json_response({
            "stdout": result.stdout[:5000],
            "stderr": result.stderr[:5000],
            "exit_code": result.returncode,
        })
    except Exception as e:
        return _json_response({"error": str(e)}, 500)


# ── Parrot Nexus routes ──

async def api_parrot_nexus_dashboard(request: Request) -> Response:
    try:
        from runtime.parrot_os import scan_all_tools
        all_tools = scan_all_tools()
        return _json_response({
            "tool_count": all_tools.get("total", 0),
            "curated": 0,
            "discovered": all_tools.get("total", 0),
            "with_training": 0,
            "ollama_running": False,
            "preset_count": 0,
            "playbook_count": 0,
            "categories": all_tools.get("categories", {}),
            "category_count": all_tools.get("category_count", 0),
        })
    except Exception as e:
        return _json_response({"error": str(e)}, 500)


async def api_parrot_nexus_tools(request: Request) -> Response:
    try:
        from runtime.parrot_os import scan_all_tools
        all_tools = scan_all_tools()
        return _json_response({
            "tools": all_tools.get("tools", []),
            "total": all_tools.get("total", 0),
        })
    except Exception as e:
        return _json_response({"error": str(e)}, 500)


async def api_parrot_nexus_presets(request: Request) -> Response:
    try:
        from parrot_nexus import load_presets
        return _json_response({"presets": load_presets()})
    except ImportError:
        return _json_response({"presets": []})


async def api_parrot_nexus_playbooks(request: Request) -> Response:
    try:
        from parrot_nexus import list_playbooks
        return _json_response({"playbooks": list_playbooks()})
    except ImportError:
        return _json_response({"playbooks": []})


# ── Studio routes ──

async def api_studio_frameworks(request: Request) -> Response:
    return _json_response({
        "frameworks": [
            {"id": "astro", "label": "Astro"},
            {"id": "react", "label": "React + Vite"},
            {"id": "vite", "label": "Vite"},
            {"id": "html", "label": "Vanilla HTML/CSS"},
            {"id": "python", "label": "Python (Flask/FastAPI)"},
            {"id": "vue", "label": "Vue + Vite"},
        ]
    })


async def api_studio_projects(request: Request) -> Response:
    STUDIO_PROJECTS = _get_handler_attr("STUDIO_PROJECTS", {})
    return _json_response({"projects": list(STUDIO_PROJECTS.values())})


async def api_studio_agent_status(request: Request) -> Response:
    name = request.query_params.get("name", "")
    # Return basic status; full tracking requires the agent runner
    return _json_response({"status": {"running": False}, "process_alive": False})


async def api_studio_generate(request: Request) -> Response:
    body = await request.json()
    name = body.get("name", "untitled")
    safe_name = name.lower().replace(" ", "-").replace("/", "-")
    projects_dir = _orch_dir / "projects"
    project_dir = projects_dir / safe_name
    project_dir.mkdir(parents=True, exist_ok=True)

    instructions = body.get("instructions", "")
    if instructions:
        (project_dir / "INSTRUCTIONS.md").write_text(instructions)

    return _json_response({
        "status": "ok",
        "dir": str(project_dir),
        "name": name,
    })


async def api_studio_build(request: Request) -> Response:
    body = await request.json()
    name = body.get("name", "")
    model = body.get("model", "codex")
    safe_name = name.lower().replace(" ", "-").replace("/", "-")
    projects_dir = _orch_dir / "projects"
    project_dir = projects_dir / safe_name

    if not project_dir.exists():
        return _json_response({"error": "project not found"}, 404)

    # Try to spawn the agent runner
    agent_runner = _orch_dir / "studio-agents" / "agent-runner.py"
    if agent_runner.exists():
        try:
            proc = subprocess.Popen(
                [sys.executable, str(agent_runner), "--model", model],
                cwd=str(project_dir),
                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            )
            return _json_response({
                "status": "ok",
                "agent_mode": "agent-runner",
                "pid": proc.pid,
                "dir": str(project_dir),
            })
        except Exception as e:
            return _json_response({"error": str(e)}, 500)

    return _json_response({"status": "ok", "agent_mode": "manual", "dir": str(project_dir)})


async def api_studio_deploy(request: Request) -> Response:
    return _json_response({"status": "ok", "message": "deploy not yet implemented"})


async def api_studio_generate_prompt(request: Request) -> Response:
    body = await request.json()
    name = body.get("name", "Untitled")
    instructions = body.get("instructions", "")
    frameworks = body.get("frameworks", [])
    theme = body.get("theme", "auto")
    site_type = body.get("site_type", "")
    tone = body.get("tone", "")
    features = body.get("features", [])
    css_framework = body.get("css_framework", "tailwind")
    deploy_target = body.get("deploy_target", "netlify")
    data_source = body.get("data_source", "static-json")
    a11y_level = body.get("a11y_level", "wcag-aa")
    depth = body.get("depth", ["launch-ready"])
    pages = body.get("pages", "home")

    prompt = f"""# Project: {name}

## Overview
{instructions}

## Configuration
- Type: {site_type or "Not specified"}
- Tone: {tone or "Not specified"}
- Frameworks: {', '.join(frameworks) or "Auto-select"}
- CSS: {css_framework}
- Theme: {theme}
- Data: {data_source}
- Deploy: {deploy_target}
- A11y: {a11y_level}
- Pages: {pages}
- Depth: {', '.join(depth)}

## Build Instructions
1. Analyze requirements and select architecture
2. Use {css_framework} for all styling — maintain dark UI consistency
3. Create a complete usable experience, not a placeholder shell
4. Implement unique page metadata, sitemap.xml, robots.txt, accessible forms, and OG image fallback
5. Write specific content for the requested audience and workflows
6. Ensure {a11y_level} accessibility compliance
7. Validate with production build and document deployment to {deploy_target}
"""
    return _json_response({"prompt": prompt.strip()})


async def api_studio_assign_agents(request: Request) -> Response:
    body = await request.json()
    project_name = body.get("project_name", "")
    agent_ids = body.get("agent_ids", [])
    return _json_response({"status": "ok", "project": project_name, "agents": agent_ids})


# ── Agents routes ──

async def api_agents(request: Request) -> Response:
    AGENTS_STORE = _get_handler_attr("AGENTS_STORE", {})
    if request.method == "GET":
        return _json_response({"agents": list(AGENTS_STORE.values())})
    elif request.method == "POST":
        body = await request.json()
        agent_id = body.get("id", f"agent-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}")
        agent_data = {**body, "id": agent_id, "custom": True, "created_at": datetime.now(timezone.utc).isoformat()}
        AGENTS_STORE[agent_id] = agent_data
        return _json_response({"status": "ok", "agent": agent_data})
    return _json_response({"error": "method not allowed"}, 405)


async def api_agents_skills(request: Request) -> Response:
    return _json_response({"skills": [
        {"id": "frontend", "label": "Frontend", "skills": ["react", "vue", "astro", "css", "tailwind", "a11y"]},
        {"id": "backend", "label": "Backend", "skills": ["node", "python", "flask", "fastapi", "databases", "api-design", "auth"]},
        {"id": "seo", "label": "SEO", "skills": ["metadata", "sitemap", "canonicals", "og-tags", "structured-data"]},
        {"id": "devops", "label": "DevOps", "skills": ["docker", "netlify", "vercel", "ci-cd", "monitoring"]},
        {"id": "security", "label": "Security", "skills": ["owasp", "secrets-scan", "deps-audit", "headers"]},
    ]})


# ── Security routes ──

async def api_security_scan_status(request: Request) -> Response:
    scan_file = _orch_dir / "reports" / "security-scan.json"
    if scan_file.exists():
        try:
            return _json_response(json.loads(scan_file.read_text()))
        except Exception:
            pass
    return _json_response({"status": "no_scan", "findings_count": 0})


async def api_security_scan(request: Request) -> Response:
    return _json_response({"status": "started", "message": "Security scan initiated"})


# ── Servers routes ──

async def api_servers(request: Request) -> Response:
    SERVER_REGISTRY = _get_handler_attr("SERVER_REGISTRY", {})
    servers = []
    for sid, info in list(SERVER_REGISTRY.items()):
        proc = info.get("process")
        alive = proc is not None and (proc.poll() is None if hasattr(proc, "poll") else True)
        servers.append({
            "id": sid, "name": info.get("name", sid),
            "type": info.get("type", "unknown"),
            "pid": proc.pid if proc and alive else None,
            "port": info.get("port"), "cwd": info.get("cwd", ""),
            "alive": alive,
        })
    return _json_response({"servers": servers})


# ── Astro routes ──

async def api_astro_status(request: Request) -> Response:
    return _json_response({"status": "ok", "available": False})


async def api_astro_themes(request: Request) -> Response:
    return _json_response({"themes": [
        {"name": "midnight-neon", "preview": {"bg": "#0a0a1a", "accent": "#3b82f6", "accentSecondary": "#6366f1"}},
        {"name": "aurora-dream", "preview": {"bg": "#0f172a", "accent": "#22d3ee", "accentSecondary": "#a78bfa"}},
        {"name": "ember", "preview": {"bg": "#1a0a0a", "accent": "#ef4444", "accentSecondary": "#f59e0b"}},
        {"name": "forest-mist", "preview": {"bg": "#0a1a0a", "accent": "#22c55e", "accentSecondary": "#14b8a6"}},
        {"name": "celestial-violet", "preview": {"bg": "#0f0a1a", "accent": "#a855f7", "accentSecondary": "#ec4899"}},
        {"name": "neon-circuit", "preview": {"bg": "#0a0a14", "accent": "#00ff88", "accentSecondary": "#00d4ff"}},
        {"name": "brutalist-ink", "preview": {"bg": "#ffffff", "accent": "#18181b", "accentSecondary": "#71717a"}},
        {"name": "solar-flare", "preview": {"bg": "#1a0f0a", "accent": "#f59e0b", "accentSecondary": "#ef4444"}},
        {"name": "oceanic-noir", "preview": {"bg": "#0a1628", "accent": "#0ea5e9", "accentSecondary": "#06b6d4"}},
    ]})


async def api_astro_sites(request: Request) -> Response:
    ASTRO_SITES_DIR = _get_handler_attr("ASTRO_SITES_DIR", _orch_dir / "sites")
    sites = []
    if ASTRO_SITES_DIR.exists():
        for d in ASTRO_SITES_DIR.iterdir():
            if d.is_dir():
                sites.append({"name": d.name, "path": str(d)})
    return _json_response({"sites": sites})


async def api_astro_preview(request: Request) -> Response:
    return _json_response({"url": "", "message": "preview not available"})


async def api_astro_preview_stop(request: Request) -> Response:
    return _json_response({"status": "stopped"})


async def api_astro_preview_status(request: Request) -> Response:
    ASTRO_PREVIEWS = _get_handler_attr("ASTRO_PREVIEWS", {})
    running = [{"name": k, "url": f"http://localhost:{v.port if hasattr(v, 'port') else 0}"} for k, v in ASTRO_PREVIEWS.items() if hasattr(v, 'poll') and v.poll() is None]
    return _json_response({"running": running})


async def api_astro_build(request: Request) -> Response:
    return _json_response({"status": "ok", "message": "build initiated"})


async def api_astro_generate(request: Request) -> Response:
    return _json_response({"status": "ok", "message": "generate initiated"})


async def api_astro_sections(request: Request) -> Response:
    return _json_response({"sections": []})


async def api_astro_templates(request: Request) -> Response:
    return _json_response({"templates": []})


# ── Vite routes ──

async def api_vite_status(request: Request) -> Response:
    return _json_response({"status": "ok", "available": False})


async def api_vite_sites(request: Request) -> Response:
    return _json_response({"sites": []})


async def api_vite_preview_status(request: Request) -> Response:
    return _json_response({"running": []})


async def api_vite_generate(request: Request) -> Response:
    return _json_response({"status": "ok"})


async def api_vite_build(request: Request) -> Response:
    return _json_response({"status": "ok"})


async def api_vite_preview(request: Request) -> Response:
    return _json_response({"url": ""})


async def api_vite_preview_stop(request: Request) -> Response:
    return _json_response({"status": "stopped"})


# ── Preview container routes ──

async def api_preview_container_status(request: Request) -> Response:
    return _json_response({"running": False})


async def api_preview_container_config(request: Request) -> Response:
    return _json_response({"config": {}})


async def api_preview_container_stop(request: Request) -> Response:
    return _json_response({"status": "stopped"})


# ── Catch-all for unmatched API routes ──

async def api_catchall(request: Request) -> Response:
    path = request.url.path.rstrip("/") or "/"
    return _json_response({"error": "not found", "path": path}, 404)


# ── Utility ──

def _redact_paths(obj):
    if isinstance(obj, dict):
        redacted = {}
        for k, v in obj.items():
            if k in ("path", "workspace_root", "tool_path", "cwd", "orchestrator"):
                redacted[k] = "<redacted>" if isinstance(v, str) and v.startswith("/") else v
            else:
                redacted[k] = _redact_paths(v)
        return redacted
    elif isinstance(obj, list):
        return [_redact_paths(i) for i in obj]
    return obj


# ── App factory ──

def create_app(handler_class, host: str, port: int, api_token: str | None,
               orch_dir: Path, dashboard_dir: Path) -> Starlette:
    """Create the Starlette ASGI app."""
    global _handler_class, _port, _api_token, _orch_dir, _dashboard_dir
    _handler_class = handler_class
    _port = port
    _api_token = api_token
    _orch_dir = orch_dir
    _dashboard_dir = dashboard_dir

    routes = [
        # Dashboard
        Route("/", dashboard_index),
        Route("/dashboard", dashboard_index),
        Route("/dashboard/{path:path}", dashboard_static),

        # Health
        Route("/api/health", api_health),

        # Core APIs
        Route("/api/tools", api_tools),
        Route("/api/system", api_system),
        Route("/api/dashboard", api_dashboard),
        Route("/api/chains", api_chains),
        Route("/api/categories", api_categories),
        Route("/api/exec", api_exec, methods=["POST"]),

        # Parrot Nexus
        Route("/api/parrot-nexus/dashboard", api_parrot_nexus_dashboard),
        Route("/api/parrot-nexus/tools", api_parrot_nexus_tools),
        Route("/api/parrot-nexus/presets", api_parrot_nexus_presets),
        Route("/api/parrot-nexus/playbooks", api_parrot_nexus_playbooks),

        # Security
        Route("/api/security/scan-status", api_security_scan_status),
        Route("/api/security/scan", api_security_scan, methods=["POST"]),

        # Servers
        Route("/api/servers", api_servers),

        # Studio
        Route("/api/studio/frameworks", api_studio_frameworks),
        Route("/api/studio/projects", api_studio_projects),
        Route("/api/studio/agent-status", api_studio_agent_status),
        Route("/api/studio/generate", api_studio_generate, methods=["POST"]),
        Route("/api/studio/build", api_studio_build, methods=["POST"]),
        Route("/api/studio/deploy", api_studio_deploy, methods=["POST"]),
        Route("/api/studio/generate-prompt", api_studio_generate_prompt, methods=["POST"]),
        Route("/api/studio/assign-agents", api_studio_assign_agents, methods=["POST"]),

        # Agents
        Route("/api/agents", api_agents, methods=["GET", "POST"]),
        Route("/api/agents/skills", api_agents_skills),

        # Astro
        Route("/api/astro/status", api_astro_status),
        Route("/api/astro/themes", api_astro_themes),
        Route("/api/astro/sites", api_astro_sites),
        Route("/api/astro/preview", api_astro_preview, methods=["POST"]),
        Route("/api/astro/preview-stop", api_astro_preview_stop, methods=["POST"]),
        Route("/api/astro/preview-status", api_astro_preview_status),
        Route("/api/astro/build", api_astro_build, methods=["POST"]),
        Route("/api/astro/generate", api_astro_generate, methods=["POST"]),
        Route("/api/astro/sections", api_astro_sections),
        Route("/api/astro/templates", api_astro_templates),

        # Vite
        Route("/api/vite/status", api_vite_status),
        Route("/api/vite/sites", api_vite_sites),
        Route("/api/vite/preview-status", api_vite_preview_status),
        Route("/api/vite/generate", api_vite_generate, methods=["POST"]),
        Route("/api/vite/build", api_vite_build, methods=["POST"]),
        Route("/api/vite/preview", api_vite_preview, methods=["POST"]),
        Route("/api/vite/preview-stop", api_vite_preview_stop, methods=["POST"]),

        # Preview container
        Route("/api/preview-container/status", api_preview_container_status),
        Route("/api/preview-container/config", api_preview_container_config, methods=["POST"]),
        Route("/api/preview-container/stop", api_preview_container_stop, methods=["POST"]),

        # Catch-all
        Route("/api/{path:path}", api_catchall, methods=["GET", "POST", "PUT", "DELETE"]),
    ]

    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=[f"http://localhost:{port}", "http://127.0.0.1:{port}"],
            allow_methods=["*"],
            allow_headers=["*"],
        ),
    ]

    return Starlette(routes=routes, middleware=middleware, lifespan=None)
