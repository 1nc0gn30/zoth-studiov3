#!/usr/bin/env python3
"""
Z0TH Studio Agent Runner
Spawns Codex/Ollama to build a website based on instructions.

Usage: python3 agent-runner.py --task-dir DIR --studio astro|vite --model MODEL --output-dir DIR
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


def log(msg, task_dir):
    print(msg, flush=True)
    with open(Path(task_dir) / "agent.log", "a") as f:
        f.write(f"[{datetime.now(timezone.utc).isoformat()}] {msg}\n")


def write_status(task_dir, status):
    with open(Path(task_dir) / "status.json", "w") as f:
        json.dump(status, f, indent=2)


def run_cmd(cmd, cwd=None, timeout=300):
    try:
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout, shell=isinstance(cmd, str))
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


def find_codex():
    return shutil.which("codex")


def find_ollama():
    return shutil.which("ollama")


def ollama_is_running():
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        s.connect(("127.0.0.1", 11434))
        s.close()
        return True
    except Exception:
        return False


def build_with_codex(task_dir, output_dir, instructions, model):
    codex = find_codex()
    if not codex:
        return False, "Codex CLI not found"

    log(f"Spawning Codex agent with model {model}...", task_dir)

    prompt = f"""Build a complete website in this directory: {output_dir}

Instructions:
{instructions}

Your task:
1. Create ALL necessary files for a complete, production-ready website
2. Initialize the project with a proper package.json and all dependencies
3. Write all components, pages, layouts, and styles — no placeholder content
4. Make it visually stunning with proper dark UI styling
5. Ensure all pages are connected and functional
6. Run npm install when done
7. Run npm run build and ensure it succeeds
8. Fix any build errors before finishing
"""
    (Path(task_dir) / "prompt.txt").write_text(prompt)

    cmd = [codex, "exec", "-m", model, "--full-auto", "--skip-git-repo-check", "-C", str(output_dir), "-o", str(Path(task_dir) / "last-message.txt"), prompt]
    log(f"Running: codex exec -m {model} ...", task_dir)

    rc, out, err = run_cmd(cmd, cwd=str(output_dir), timeout=600)
    (Path(task_dir) / "codex-stdout.txt").write_text(out)
    (Path(task_dir) / "codex-stderr.txt").write_text(err)

    if rc != 0:
        return False, f"Codex exited with code {rc}: {err[:500]}"
    return True, "Codex completed successfully"


def build_with_ollama(task_dir, output_dir, instructions, model):
    ollama = find_ollama()
    if not ollama:
        return False, "Ollama not found"
    if not ollama_is_running():
        return False, "Ollama is not running. Start with: ollama serve"

    log(f"Using Ollama with model {model}...", task_dir)

    # For Ollama, generate site config and scaffold
    prompt = f"""You are a website builder AI. Build a complete website based on these instructions:

{instructions}

Create a JSON configuration for the site. Respond ONLY with a valid JSON object (no markdown):
{{
  "title": "Site Title",
  "description": "Site description",
  "nav": {{"brand": "Brand", "links": [{{"label": "Home", "url": "/"}}], "cta": {{"label": "Get Started", "url": "#cta"}}}},
  "sections": [
    {{"type": "hero", "id": "hero-1", "headline": "Main headline", "subheadline": "Subheadline", "cta": {{"label": "Action", "url": "#"}}, "centered": true}},
    {{"type": "features", "id": "features-1", "items": [{{"title": "Feature", "description": "Desc", "icon": "✦"}}]}},
    {{"type": "cta", "id": "cta-1", "headline": "Call to Action", "description": "CTA desc", "button": {{"label": "Go", "url": "#"}}}}
  ],
  "footer": {{"brand": "Brand", "copyright": "© 2025 Brand. Built By NullAI."}},
  "seo": {{"title": "Page Title", "description": "Meta description"}}
}}

Available section types: hero, features, pricing, testimonial, cta, stats, faq, team, blog, timeline, newsletter, logoTicker, content, social-links, form, gallery
"""

    cmd = [ollama, "run", model, prompt]
    log("Running Ollama generation...", task_dir)

    rc, out, err = run_cmd(cmd, cwd=str(output_dir), timeout=300)
    (Path(task_dir) / "ollama-stdout.txt").write_text(out)
    (Path(task_dir) / "ollama-stderr.txt").write_text(err)

    if rc != 0:
        return False, f"Ollama exited with code {rc}: {err[:500]}"

    try:
        json_match = re.search(r'\{[\s\S]*\}', out)
        if json_match:
            config = json.loads(json_match.group())
            config_path = Path(output_dir) / "src" / "configs" / "site.json"
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_text(json.dumps(config, indent=2))
            log(f"Generated config with {len(config.get('sections', []))} sections", task_dir)
            return True, "Config generated successfully"
        return False, "No JSON found in Ollama output"
    except json.JSONDecodeError as e:
        return False, f"Failed to parse JSON: {e}"


def install_and_build(output_dir, task_dir):
    if not (Path(output_dir) / "package.json").exists():
        log("No package.json found — skipping npm install/build", task_dir)
        return True, "No build needed (no package.json)"

    log("Installing dependencies...", task_dir)
    rc, out, err = run_cmd(["npm", "install"], cwd=str(output_dir), timeout=300)
    if rc != 0:
        log(f"npm install failed: {err[:500]}", task_dir)
        return False, f"npm install failed: {err[:500]}"
    log("npm install completed", task_dir)

    log("Building site...", task_dir)
    rc, out, err = run_cmd(["npm", "run", "build"], cwd=str(output_dir), timeout=300)
    (Path(task_dir) / "build-stdout.txt").write_text(out)
    (Path(task_dir) / "build-stderr.txt").write_text(err)
    if rc != 0:
        log(f"Build failed: {err[:500]}", task_dir)
        return False, f"Build failed: {err[:500]}"
    log("Build succeeded!", task_dir)
    return True, "Build succeeded"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--task-dir", required=True)
    parser.add_argument("--studio", default="astro")
    parser.add_argument("--model", default="codex")
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    task_dir = Path(args.task_dir)
    output_dir = Path(args.output_dir)
    instructions = ""
    instr_path = task_dir / "INSTRUCTIONS.md"
    prompt_path = output_dir / "PROMPT.md"
    if prompt_path.exists():
        instructions = prompt_path.read_text()
    elif instr_path.exists():
        instructions = instr_path.read_text()

    log(f"Agent started for {args.studio} studio", task_dir)
    log(f"Output dir: {output_dir}", task_dir)
    log(f"Model: {args.model}", task_dir)

    write_status(task_dir, {"running": True, "stage": "generating", "started_at": datetime.now(timezone.utc).isoformat()})

    model = args.model
    success = False
    message = ""

    # Determine which AI backend to use based on model name
    codex = find_codex()
    ollama = find_ollama()

    # Codex-compatible models: gpt-*, o3, o1, codex, etc.
    codex_models = model.startswith(("gpt", "o3", "o1", "o4", "codex"))
    ollama_models = model.startswith(("llama", "mistral", "codellama", "phi", "qwen", "deepseek", "gemma", "kimi", "llava", "neural"))

    if codex and (codex_models or not ollama):
        success, message = build_with_codex(task_dir, output_dir, instructions, model)
    elif ollama and (ollama_models or not codex):
        success, message = build_with_ollama(task_dir, output_dir, instructions, model)
    elif codex:
        success, message = build_with_codex(task_dir, output_dir, instructions, model)
    elif ollama:
        success, message = build_with_ollama(task_dir, output_dir, instructions, model)
    else:
        message = "No AI backend available (neither Codex nor Ollama found)"
        log(message, task_dir)

    if success:
        write_status(task_dir, {"running": True, "stage": "building", "message": message})
        build_success, build_msg = install_and_build(output_dir, task_dir)
        write_status(task_dir, {
            "running": False,
            "stage": "complete" if build_success else "build_failed",
            "success": build_success,
            "message": build_msg,
            "completed_at": datetime.now(timezone.utc).isoformat(),
        })
        log(f"Agent finished: {build_msg}", task_dir)
    else:
        write_status(task_dir, {
            "running": False, "stage": "failed", "success": False,
            "message": message, "completed_at": datetime.now(timezone.utc).isoformat(),
        })
        log(f"Agent failed: {message}", task_dir)


if __name__ == "__main__":
    main()
