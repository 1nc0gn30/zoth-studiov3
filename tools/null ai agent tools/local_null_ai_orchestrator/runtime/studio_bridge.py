"""Parse model-emitted Zoth Studio presets and slash-commands from prose."""

from __future__ import annotations

import json
import re
from typing import Any

STUDIO_INSTRUCTIONS = """Zoth Studio generate tool is ONLY for websites / landing pages.

Do NOT emit <zoth_studio> for connectors, wallets, Solana, Stripe, GitHub, Netlify,
vault, pets, swarm, models, or BYOK. Those use /connect, /ping, /who, /vault, /pet.

ONLY if the human clearly wants a website or landing page, emit:

<zoth_studio>
{"name":"slug-name","instructions":"full brief","site_type":"landing","tone":"professional","frameworks":["astro"],"css_framework":"tailwind","features":["seo","forms","responsive","netlify"],"deploy_target":"netlify","pages":"home, about, contact","open":true,"step":2}
</zoth_studio>

To run a harness command yourself:

<run_command>/connect solana</run_command>
<run_command>/scan</run_command>

Prefer ask_user before deploys. For swarm: /who and /ping.
"""

_SITE_HINT = re.compile(
    r"\b(website|web ?app|landing page|"
    r"(make|build|create|spin up|generate)\b.{0,80}\b(website|landing page|web ?app|web page|site)|"
    r"new site|new website)\b",
    re.I,
)
_NOT_SITE = re.compile(
    r"\b(solana|metamask|phantom|stripe|netlify|github|gitlab|hostinger|"
    r"wallet|connector|connect|byok|vault|argon|bitwarden|pet|pets|"
    r"swarm|ollama|hermes)\b",
    re.I,
)


def parse_run_commands(text: str) -> tuple[str, list[str]]:
    if not text:
        return "", []
    cmds: list[str] = []
    cleaned = text
    for m in re.finditer(r"<run_command>\s*([^<]+?)\s*</run_command>", text, re.I):
        raw = m.group(1).strip()
        if not raw.startswith("/"):
            raw = "/" + raw.lstrip("/")
        cmds.append(raw)
        cleaned = cleaned.replace(m.group(0), "")
    for m in re.finditer(r"```(?:run_command|command)\s*([\s\S]*?)```", text, re.I):
        for line in m.group(1).splitlines():
            line = line.strip()
            if line:
                cmds.append(line if line.startswith("/") else "/" + line)
        cleaned = cleaned.replace(m.group(0), "")
    return re.sub(r"\n{3,}", "\n\n", cleaned).strip(), cmds


def parse_studio_preset(text: str) -> tuple[str, dict[str, Any] | None]:
    if not text:
        return "", None
    cleaned = text
    preset = None

    def _take(blob: str) -> dict[str, Any] | None:
        blob = blob.strip()
        try:
            data = json.loads(blob)
        except json.JSONDecodeError:
            return None
        if not isinstance(data, dict):
            return None
        name = str(data.get("name") or data.get("project") or "").strip()
        instructions = str(data.get("instructions") or data.get("brief") or "").strip()
        if not name and not instructions:
            return None
        out = {
            "name": name,
            "instructions": instructions,
            "site_type": data.get("site_type") or data.get("type"),
            "tone": data.get("tone"),
            "frameworks": data.get("frameworks") or [],
            "css_framework": data.get("css_framework") or "tailwind",
            "features": data.get("features") or [],
            "deploy_target": data.get("deploy_target") or "netlify",
            "pages": data.get("pages") or "home, about, contact",
            "theme": data.get("theme") or "",
            "open": data.get("open", True),
            "step": int(data.get("step") or 2),
        }
        if isinstance(out["frameworks"], str):
            out["frameworks"] = [out["frameworks"]]
        return out

    for m in re.finditer(r"<zoth_studio>([\s\S]*?)</zoth_studio>", text, re.I):
        preset = _take(m.group(1)) or preset
        cleaned = cleaned.replace(m.group(0), "")
    for m in re.finditer(r"```(?:zoth_studio|studio)\s*([\s\S]*?)```", text, re.I):
        preset = _take(m.group(1)) or preset
        cleaned = cleaned.replace(m.group(0), "")
    return re.sub(r"\n{3,}", "\n\n", cleaned).strip(), preset


_BUILD_SITE = re.compile(
    r"\b((?:make|build|create|spin[\s-]?up|generate|design)\b.{0,80}"
    r"\b(website|landing page|web ?app|web page|site)|new site|new website)\b",
    re.I,
)


def wants_site(user_prompt: str) -> bool:
    if not user_prompt:
        return False
    try:
        from runtime.commands import CONNECTOR_COMMANDS, parse_slash, rewrite_to_slash

        if rewrite_to_slash(user_prompt):
            return False
        parsed = parse_slash(user_prompt) if user_prompt.lstrip().startswith("/") else None
        if parsed and parsed[0] in CONNECTOR_COMMANDS:
            return False
    except Exception:
        pass
    if not _SITE_HINT.search(user_prompt):
        return False
    if _NOT_SITE.search(user_prompt) and not _BUILD_SITE.search(user_prompt):
        return False
    return True


def infer_studio_preset(user_prompt: str) -> dict[str, Any] | None:
    if not wants_site(user_prompt):
        return None
    low = user_prompt.lower()
    site_type = "landing"
    service = bool(re.search(r"\b(lawn|landscap|mow|yard|plumb|hvac|roof|paint)\b", low))
    rules = (
        (r"\b(saas|subscription)\b", "saas"),
        (r"\bportfolio\b", "portfolio"),
        (r"\b(e-?commerce|online store|webshop)\b", "ecommerce"),
        (r"\b(shop|store)\b", "ecommerce"),
        (r"\b(blog|cms)\b", "blog"),
        (r"\bdashboard\b", "dashboard"),
        (r"\bdocs?\b", "docs"),
        (r"\bagency\b", "agency"),
    )
    for pat, val in rules:
        if re.search(pat, low):
            if val == "ecommerce" and service and not re.search(r"\b(e-?commerce|online store|webshop)\b", low):
                continue
            site_type = val
            break
    slug = re.sub(r"[^a-z0-9]+", "-", low)
    slug = re.sub(r"-+", "-", slug).strip("-")
    slug = re.sub(r"^(build|make|create|spin-up|generate)-+(me-)?(a-)?", "", slug)
    slug = slug[:32].strip("-") or "new-site"
    quoted = re.search(r"[\"']([^\"']{2,40})[\"']", user_prompt)
    if quoted:
        slug = re.sub(r"[^a-z0-9]+", "-", quoted.group(1).lower()).strip("-") or slug
    return {
        "name": slug,
        "instructions": user_prompt.strip(),
        "site_type": site_type,
        "tone": "dark-mode" if "dark" in low else "professional",
        "frameworks": ["astro"],
        "css_framework": "tailwind",
        "features": ["seo", "responsive", "forms", "netlify"],
        "deploy_target": "netlify",
        "pages": "home, about, contact",
        "open": True,
        "step": 2,
        "inferred": True,
    }
