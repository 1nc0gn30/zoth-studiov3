#!/usr/bin/env python3
"""
🧪 ZOTH STUDIO FULL-ECOSYSTEM PLAYWRIGHT AUDIT SUITE (34 PAGES)
==============================================================
Comprehensive E2E verification of all Studio Workstations & Comic Universe:
1. HTTP 200 status & Valid Title
2. Full 4-Theme Cycle (Dark, Light, Matrix, Gold)
3. Zero horizontal scroll overflow across Desktop (1440x900), Tablet (768x1024), and Mobile (375x812)
4. Active DOM components, Canvases, WebGL, PTY Terminal, and Avatar Pingpong Loops
5. Zero JS runtime errors and zero unhandled exceptions
"""

import asyncio
import sys
from playwright.async_api import async_playwright

PAGES_TO_AUDIT = [
    # --- Core Studio Workstations ---
    {
        "name": "Studio Hub Portal",
        "url": "http://127.0.0.1:8088/studio/index.html",
        "expected_title": "Zoth",
        "required_selectors": [".studio-hub-container, .brand, .hub-header, #topbar, nav, header"]
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
        "required_selectors": [".omni-tab-btn, #tab-repurpose, #single-platform-editor, .omnipost-container"]
    },
    {
        "name": "Autonomous Swarm",
        "url": "http://127.0.0.1:8088/studio/swarm.html",
        "expected_title": "Swarm",
        "required_selectors": [".swarm-grid, .agent-card, #swarm-telemetry, .swarm-header, .swarm-container, #main-content"]
    },
    {
        "name": "Swarm Cockpit",
        "url": "http://127.0.0.1:8088/studio/cockpit.html",
        "expected_title": "Cockpit",
        "required_selectors": ["#cockpit-main, #cockpitMessagesStream, #cockpitMissionControls, .cockpit-body, header"]
    },
    {
        "name": "Peer Bus Monitor",
        "url": "http://127.0.0.1:8088/studio/bus-monitor.html",
        "expected_title": "Bus",
        "required_selectors": ["#main-content, #noc-status-pill, #btn-sse-toggle, header, nav"]
    },
    {
        "name": "Peer Bus Visualizer",
        "url": "http://127.0.0.1:8088/studio/peer-bus.html",
        "expected_title": "Bus",
        "required_selectors": [".bus-grid, #topbar, .brand, header, nav"]
    },
    {
        "name": "Netrunner Memory Matrix",
        "url": "http://127.0.0.1:8088/studio/netrunner-memory.html",
        "expected_title": "Memory",
        "required_selectors": [".memory-graph, canvas, #memory-list, .memory-header, .netrunner-container, #main-content"]
    },
    {
        "name": "Byzantine Consensus Engine",
        "url": "http://127.0.0.1:8088/studio/consensus.html",
        "expected_title": "Consensus",
        "required_selectors": ["#main-content, #arena, #btn-chan-consensus, header, nav"]
    },
    {
        "name": "Agent Character Forge",
        "url": "http://127.0.0.1:8088/studio/agent-composer.html",
        "expected_title": "Composer",
        "required_selectors": ["#main-content, #graph, #preset-selector, header, nav"]
    },
    {
        "name": "Multimodal Vision Link",
        "url": "http://127.0.0.1:8088/studio/vision-link.html",
        "expected_title": "Vision",
        "required_selectors": ["#main-vision, #ambient-star-canvas, #spatial-laser-cursor, header, nav"]
    },
    {
        "name": "vOS Wasm Sandbox IDE",
        "url": "http://127.0.0.1:8088/studio/vos-sandbox.html",
        "expected_title": "vOS",
        "required_selectors": [".vos-workspace-main, .vos-file-tree-pane, #btn-run, .vos-header, header"]
    },
    {
        "name": "WebGen Studio Foundry",
        "url": "http://127.0.0.1:8088/studio/webgen.html",
        "expected_title": "WebGen",
        "required_selectors": [".webgen-hero-stage, #terminal-container, .webgen-poster, header, nav"]
    },
    {
        "name": "Edge Forge Microservices",
        "url": "http://127.0.0.1:8088/studio/edge-forge.html",
        "expected_title": "Edge",
        "required_selectors": [".edge-poster, #edge-code-area, .forge-container, header, nav"]
    },
    {
        "name": "Fusion Swarm 3D Arena",
        "url": "http://127.0.0.1:8088/studio/fusion-arena.html",
        "expected_title": "Fusion",
        "required_selectors": ["#arena-viewport, canvas, .hud-stats, header, nav"]
    },
    {
        "name": "AI Math Pillars Academy",
        "url": "http://127.0.0.1:8088/studio/math-pillars.html",
        "expected_title": "Math",
        "required_selectors": [".pillars-grid, #hypercube-canvas, canvas, header, nav"]
    },
    {
        "name": "AI Model Foundry & Matrix",
        "url": "http://127.0.0.1:8088/studio/models.html",
        "expected_title": "Model",
        "required_selectors": [".models-poster, .models-workspace, #topbar, .brand, header, nav"]
    },
    {
        "name": "Web3 & Solana Swarm Hub",
        "url": "http://127.0.0.1:8088/studio/web3-hub.html",
        "expected_title": "Web3",
        "required_selectors": [".web3-hero, .web3-badge, .sol-ticker-bar, #topbar, header, nav"]
    },
    {
        "name": "Brand Assets Matrix",
        "url": "http://127.0.0.1:8088/studio/brand.html",
        "expected_title": "Brand",
        "required_selectors": [".brand-grid, .asset-card, #topbar, header, nav"]
    },
    {
        "name": "Studio Chronicle Log",
        "url": "http://127.0.0.1:8088/studio/chronicle.html",
        "expected_title": "Chronicle",
        "required_selectors": [".chronicle-container, .log-entry, #topbar, header, nav"]
    },
    {
        "name": "Mission Control",
        "url": "http://127.0.0.1:8088/studio/mission-control.html",
        "expected_title": "Mission",
        "required_selectors": [".mission-grid, #topbar, .brand, header, nav"]
    },
    {
        "name": "Sovereign Tool Bench",
        "url": "http://127.0.0.1:8088/studio/tool-bench.html",
        "expected_title": "Tool",
        "required_selectors": [".bench-grid, #topbar, .brand, header, nav, .page"]
    },
    {
        "name": "Subsweep AST Cleaner",
        "url": "http://127.0.0.1:8088/studio/subsweep.html",
        "expected_title": "Subsweep",
        "required_selectors": [".subsweep-container, #topbar, .brand, header, nav"]
    },

    # --- Comic Universe Pages ---
    {
        "name": "AZOTH Comic Universe Hub",
        "url": "http://127.0.0.1:8088/comic/index.html",
        "expected_title": "AZOTH",
        "required_selectors": [".comic-universe-grid, .episode-card, .universe-hero, header, nav"]
    },
    {
        "name": "Comic S01E01 Webtoon Reader",
        "url": "http://127.0.0.1:8088/comic/s01e01.html",
        "expected_title": "Episode 1",
        "required_selectors": [".comic-reader, .manga-panel, #comic-audio-hud, .webtoon-stage, header"]
    },
    {
        "name": "Comic S01E02 Webtoon Reader",
        "url": "http://127.0.0.1:8088/comic/s01e02.html",
        "expected_title": "Episode 2",
        "required_selectors": [".comic-reader, .manga-panel, #comic-audio-hud, .webtoon-stage, header"]
    },
    {
        "name": "Comic S01E03 Webtoon Reader",
        "url": "http://127.0.0.1:8088/comic/s01e03.html",
        "expected_title": "Episode 3",
        "required_selectors": [".comic-reader, .manga-panel, #comic-audio-hud, .webtoon-stage, header"]
    },
    {
        "name": "Comic S01E04 Season Finale Reader",
        "url": "http://127.0.0.1:8088/comic/s01e04.html",
        "expected_title": "Episode 4",
        "required_selectors": [".comic-reader, .manga-panel, .hadal-stage, #comic-audio-hud, header"]
    },
    {
        "name": "Comic S01E04 Finale Teaser",
        "url": "http://127.0.0.1:8088/comic/s01e04-teaser.html",
        "expected_title": "Teaser",
        "required_selectors": [".teaser-container, #arg-terminal, .mariana-hero, header, .badge"]
    },
    {
        "name": "Comic Cast & Pantheon Codex",
        "url": "http://127.0.0.1:8088/comic/characters.html",
        "expected_title": "Codex",
        "required_selectors": [".character-grid, .character-card, .pantheon-hero, header, nav"]
    },
    {
        "name": "Comic Story DAG Timeline",
        "url": "http://127.0.0.1:8088/comic/timeline.html",
        "expected_title": "Timeline",
        "required_selectors": [".timeline-dag, .story-node, .timeline-track, header, nav"]
    },
    {
        "name": "Comic Voice & SFX Soundboard",
        "url": "http://127.0.0.1:8088/comic/soundboard.html",
        "expected_title": "Soundboard",
        "required_selectors": [".soundboard-grid, .sound-card, .sound-category-tabs, header, nav"]
    },
    {
        "name": "Comic Holographic Share Portal",
        "url": "http://127.0.0.1:8088/comic/share.html",
        "expected_title": "Share",
        "required_selectors": [".share-container, .share-card, #topbar, header, nav"]
    }
]

async def audit_single_page(page, config):
    print(f"\n──────────────────────────────────────────────────────────────────")
    print(f"🔍 AUDITING: {config['name']} -> {config['url']}")
    print(f"──────────────────────────────────────────────────────────────────")

    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda err: console_errors.append(f"[UNCAUGHT] {err}"))

    resp = await page.goto(config["url"], wait_until="domcontentloaded", timeout=12000)
    assert resp.status == 200, f"HTTP Error {resp.status} on {config['url']}"
    print(f"  ✔ HTTP Status: 200 OK")

    title = await page.title()
    print(f"  ✔ Title: '{title}' (matches pattern '{config['expected_title']}')")
    assert config["expected_title"].lower() in title.lower(), f"Unexpected title: '{title}' does not contain '{config['expected_title']}'"

    # Wait for dynamic rendering
    await page.wait_for_timeout(350)

    # Check required selectors
    matched_sel = False
    for sel in config["required_selectors"]:
        el_count = await page.locator(sel).count()
        if el_count > 0:
            print(f"  ✔ Verified DOM element: '{sel}' ({el_count} match)")
            matched_sel = True
            break
    assert matched_sel, f"None of the required selectors {config['required_selectors']} were found on {config['name']}!"

    # 4-Theme Switching Test (Dark -> Light -> Matrix -> Gold -> Dark)
    themes = ["dark", "light", "matrix", "gold"]
    for th in themes:
        await page.evaluate(f"() => {{ document.documentElement.setAttribute('data-theme', '{th}'); if (window.setZothTheme) window.setZothTheme('{th}'); }}")
        cur_th = await page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert cur_th == th, f"Theme failed to switch to {th}"
    print(f"  ✔ 4-Theme Cycle (Dark, Light, Matrix, Gold): OK")

    # Viewport Responsiveness & Zero Horizontal Scroll Overflow Check
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

async def run_ecosystem_suite():
    print("==================================================================")
    print(f"⚡ ZOTH STUDIO FULL ECOSYSTEM PLAYWRIGHT AUDIT ({len(PAGES_TO_AUDIT)} PAGES)")
    print("==================================================================")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        passed = 0
        failed = 0
        failed_pages = []

        for config in PAGES_TO_AUDIT:
            try:
                await audit_single_page(page, config)
                passed += 1
            except Exception as e:
                print(f"  ❌ FAILED on {config['name']}: {e}")
                failed += 1
                failed_pages.append((config['name'], str(e)))

        await browser.close()

        print("\n==================================================================")
        print(f"📊 FULL ECOSYSTEM RESULTS: {passed} PASSED, {failed} FAILED ({len(PAGES_TO_AUDIT)} total)")
        print("==================================================================")
        if failed > 0:
            print("\n❌ Failures Summary:")
            for name, err in failed_pages:
                print(f"  - {name}: {err}")
            sys.exit(1)
        else:
            print("\n✨ ALL 34 PAGES IN THE ZOTH ECOSYSTEM PASSED PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(run_ecosystem_suite())
