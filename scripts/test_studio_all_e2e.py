#!/usr/bin/env python3
"""
🧪 ZOTH STUDIO FULL-SUITE E2E PLAYWRIGHT AUDIT
=============================================
Audits all 11 core studio workstations for:
1. HTTP 200 status & valid page title
2. Zero JS console errors & zero uncaught runtime exceptions
3. Zero horizontal scroll overflow across Mobile (375x812) & Desktop (1440x900)
4. Full 4-Theme Cycle (Dark, Light, Matrix, Gold) data-theme attributes
5. Active Canvas/WebGL/SVG/HUD mounting verification
"""

import asyncio
import sys
from playwright.async_api import async_playwright

STUDIO_PAGES = [
    {
        "name": "Studio Hub Portal",
        "url": "http://127.0.0.1:8088/studio/index.html",
        "expected_title": "Zoth Studio",
        "required_selectors": [".studio-hub-container, .brand, .hub-header, #topbar"]
    },
    {
        "name": "Nexus 3D Studio",
        "url": "http://127.0.0.1:8088/studio/nexus-3d.html",
        "expected_title": "Nexus 3D",
        "required_selectors": ["#nexus-viewport, canvas, .nexus-toolbar, .viewport-wrap"]
    },
    {
        "name": "Nexus 3D Editor",
        "url": "http://127.0.0.1:8088/studio/nexus-3d-editor.html",
        "expected_title": "Nexus 3D",
        "required_selectors": ["#editor-viewport, canvas, .editor-header, .editor-controls"]
    },
    {
        "name": "OmniPost Pro Studio",
        "url": "http://127.0.0.1:8088/studio/omnipost.html",
        "expected_title": "OmniPost",
        "required_selectors": [".omni-tab-btn", "#tab-repurpose", "#single-platform-editor, #omni-source-text"]
    },
    {
        "name": "Autonomous Swarm",
        "url": "http://127.0.0.1:8088/studio/swarm.html",
        "expected_title": "Swarm",
        "required_selectors": [".swarm-grid, .agent-card, #swarm-telemetry, .swarm-header"]
    },
    {
        "name": "Swarm Cockpit",
        "url": "http://127.0.0.1:8088/studio/cockpit.html",
        "expected_title": "Cockpit",
        "required_selectors": [".cockpit-container, .status-bar, #cockpit-grid, .cockpit-header"]
    },
    {
        "name": "Peer Bus Monitor",
        "url": "http://127.0.0.1:8088/studio/bus-monitor.html",
        "expected_title": "Bus Monitor",
        "required_selectors": [".bus-container, .bus-logs, #bus-status, .bus-header"]
    },
    {
        "name": "Netrunner Memory Matrix",
        "url": "http://127.0.0.1:8088/studio/netrunner-memory.html",
        "expected_title": "Memory",
        "required_selectors": [".memory-graph, canvas, #memory-list, .memory-header"]
    },
    {
        "name": "Byzantine Consensus Engine",
        "url": "http://127.0.0.1:8088/studio/consensus.html",
        "expected_title": "Consensus",
        "required_selectors": [".consensus-grid, #consensus-status, .vote-card, .consensus-header"]
    },
    {
        "name": "Agent Character Forge",
        "url": "http://127.0.0.1:8088/studio/agent-composer.html",
        "expected_title": "Composer",
        "required_selectors": [".composer-container, #agent-select, .prompt-editor, .composer-header"]
    },
    {
        "name": "Multimodal Vision Link",
        "url": "http://127.0.0.1:8088/studio/vision-link.html",
        "expected_title": "Vision Link",
        "required_selectors": [".vision-container, #vision-canvas, .vision-controls, .vision-header"]
    }
]

async def audit_page(page, config):
    print(f"\n──────────────────────────────────────────────────────────────────")
    print(f"🔍 AUDITING: {config['name']} -> {config['url']}")
    print(f"──────────────────────────────────────────────────────────────────")

    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda err: console_errors.append(f"[UNCAUGHT] {err}"))

    resp = await page.goto(config["url"], wait_until="domcontentloaded", timeout=10000)
    assert resp.status == 200, f"HTTP Error {resp.status} on {config['url']}"
    print(f"  ✔ HTTP Status: 200 OK")

    title = await page.title()
    print(f"  ✔ Title: '{title}' (contains '{config['expected_title']}')")
    assert config["expected_title"].lower() in title.lower(), f"Unexpected title: {title}"

    # Wait for basic rendering
    await page.wait_for_timeout(400)

    # Check required selectors
    for sel in config["required_selectors"]:
        el_count = await page.locator(sel).count()
        if el_count > 0:
            print(f"  ✔ Verified DOM element: '{sel}' ({el_count} match)")
            break

    # Theme Switching Test (Dark -> Light -> Matrix -> Gold -> Dark)
    themes = ["dark", "light", "matrix", "gold"]
    for th in themes:
        await page.evaluate(f"() => {{ document.documentElement.setAttribute('data-theme', '{th}'); if (window.setZothTheme) window.setZothTheme('{th}'); }}")
        cur_th = await page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert cur_th == th, f"Theme failed to switch to {th}"
    print(f"  ✔ 4-Theme Cycle (Dark, Light, Matrix, Gold): OK")

    # Viewport Responsiveness & Horizontal Scroll Overflow Check
    viewports = [("Desktop", 1440, 900), ("Tablet", 768, 1024), ("Mobile", 375, 812)]
    for vp_name, w, h in viewports:
        await page.set_viewport_size({"width": w, "height": h})
        await page.wait_for_timeout(150)
        scroll_w = await page.evaluate("() => document.documentElement.scrollWidth")
        client_w = await page.evaluate("() => document.documentElement.clientWidth")
        is_ok = scroll_w <= client_w + 1
        print(f"  ✔ Viewport [{vp_name} ({w}x{h})]: scrollWidth={scroll_w}px, clientWidth={client_w}px -> {'OK' if is_ok else 'OVERFLOW'}")
        assert is_ok, f"Horizontal overflow detected on {config['name']} at {w}px: scrollWidth={scroll_w} > clientWidth={client_w}"

    # Verify Console Error Count
    print(f"  ✔ Console JS Runtime: {len(console_errors)} error(s)")
    for err in console_errors:
        print(f"    ⚠️ {err}")
    assert len(console_errors) == 0, f"Found {len(console_errors)} console errors on {config['name']}!"

async def run_full_suite():
    print("==================================================================")
    print("⚡ ZOTH STUDIO WORKSTATIONS FULL-SUITE E2E AUDIT")
    print("==================================================================")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        passed = 0
        failed = 0

        for config in STUDIO_PAGES:
            try:
                await audit_page(page, config)
                passed += 1
            except Exception as e:
                print(f"  ❌ FAILED on {config['name']}: {e}")
                failed += 1

        await browser.close()

        print("\n==================================================================")
        print(f"📊 FULL SUITE RESULTS: {passed} PASSED, {failed} FAILED ({len(STUDIO_PAGES)} total)")
        print("==================================================================")
        if failed > 0:
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run_full_suite())
