import asyncio
from playwright.async_api import async_playwright

async def test_omnipost():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(f"[UNCAUGHT] {err}"))
        page.on("response", lambda resp: console_errors.append(f"[HTTP {resp.status}] {resp.url}") if resp.status >= 400 else None)

        print("--> Navigating to OmniPost...")
        resp = await page.goto("http://127.0.0.1:8088/studio/omnipost.html", wait_until="networkidle")
        assert resp.status == 200, f"Status code: {resp.status}"

        # 1. Title & Heading Check
        title = await page.title()
        print(f"Page Title: {title}")
        assert "OmniPost" in title

        # 2. Check Agents Avatar Loop Animation
        print("--> Verifying Avatar Pingpong Loop Animations...")
        azoth_avatar = page.locator(".agent-chip-btn[data-agent='azoth'] .agent-avatar-sm")
        await azoth_avatar.wait_for(state="visible", timeout=5000)
        azoth_anim = await azoth_avatar.evaluate("el => window.getComputedStyle(el).animationName")
        print(f"Azoth Chip Avatar Animation: {azoth_anim}")
        assert "agentAvatarAzothLoop" in azoth_anim, f"Azoth animation not applied, got {azoth_anim}"

        # Check all agent avatars in selector and on dossier
        agents = [
            ("azoth", "agentAvatarAzothLoop"),
            ("kai", "agentAvatarKaiLoop"),
            ("athena", "agentAvatarAthenaLoop"),
            ("draco", "agentAvatarDracoLoop"),
            ("kitsune", "agentAvatarKitsuneLoop"),
            ("pixel-neko", "agentAvatarNekoLoop"),
            ("hermes", "agentAvatarHermesLoop"),
            ("lycan", "agentAvatarLycanLoop")
        ]
        for ag, expected_anim in agents:
            el = page.locator(f".agent-chip-btn[data-agent='{ag}']")
            assert await el.count() > 0, f"Missing chip for {ag}"
            await el.click()
            await page.wait_for_timeout(50)
            bio_avatar = page.locator("#agent-dossier-avatar, .agent-bio-avatar")
            bio_anim = await bio_avatar.evaluate("el => window.getComputedStyle(el).animationName")
            print(f"  Agent {ag}: bio animation = {bio_anim}")
            assert expected_anim in bio_anim, f"Expected {expected_anim}, got {bio_anim}"

        # 3. Test WebGPU / Engine Switcher
        print("--> Testing WebGPU / Engine Switcher...")
        engine_select = page.locator("#ai-engine-select")
        if await engine_select.count() > 0:
            await engine_select.select_option("webgpu")
            await page.wait_for_timeout(100)
            engine_info = await page.locator("#webgpu-status-badge, .engine-badge, #engine-status").all_text_contents()
            print(f"Engine info: {engine_info}")

        # 4. Test Single Platform Repurposer & Rubin Reduction
        print("--> Testing Repurposer & Rubin Reduction...")
        await page.locator(".omni-tab-btn[data-tab='tab-repurpose']").click()
        await page.wait_for_timeout(100)
        
        # Type into input
        input_area = page.locator("#omni-source-text")
        if await input_area.count() > 0:
            await input_area.fill("This is basically a literally amazing innovative groundbreaking synergy tool for 2026.")
            # Trigger Rubin Reduction
            rubin_btn = page.locator("button[onclick='rubinReduceCurrentSingle()'], #btn-rubin-reduce, button:has-text('Rick Rubin')").first
            if await rubin_btn.count() > 0:
                await rubin_btn.click()
                await page.wait_for_timeout(150)
                reduced_text = await input_area.input_value()
                print(f"Reduced text: '{reduced_text}'")

        # 5. Test Viral Hook Lab
        print("--> Testing Viral Hook Lab...")
        hooks_tab = page.locator(".omni-tab-btn[data-tab='tab-hooks']").first
        await hooks_tab.click()
        await page.wait_for_timeout(150)
        hook_cards = page.locator(".hook-card, .hook-item")
        hook_count = await hook_cards.count()
        print(f"Rendered hooks count: {hook_count}")
        assert hook_count > 0, "No hooks rendered in Viral Hook Lab"

        # Click Inject into Editor on first hook
        inject_btn = page.locator(".hook-card button, .btn-inject-hook").first
        if await inject_btn.count() > 0:
            await inject_btn.click()
            await page.wait_for_timeout(100)
            print("Successfully clicked hook inject button")

        # 6. Test Thread Splitter
        print("--> Testing Thread Stitcher & Splitter...")
        threads_tab = page.locator(".omni-tab-btn[data-tab='tab-threads']").first
        await threads_tab.click()
        await page.wait_for_timeout(150)
        
        thread_input = page.locator("#thread-raw-input")
        if await thread_input.count() > 0:
            await thread_input.fill("Step 1: First insight on AI agents.\n\nStep 2: Second insight on decentralized memory.\n\nStep 3: Third insight on WebGPU inference.")
            split_btn = page.locator("#btn-stitch-thread, #btn-split-thread").first
            if await split_btn.count() > 0:
                await split_btn.click()
                await page.wait_for_timeout(200)
                thread_output_cards = page.locator("#thread-output-list .thread-card, .thread-segment")
                t_count = await thread_output_cards.count()
                print(f"Thread split generated {t_count} segments")
                assert t_count >= 3, f"Expected at least 3 segments, got {t_count}"

        # 7. Test Procedural Music Forge
        print("--> Testing Procedural Music Forge...")
        music_tab = page.locator(".omni-tab-btn[data-tab='tab-music-forge']").first
        await music_tab.click()
        await page.wait_for_timeout(150)
        vis_canvas = page.locator("#music-oscilloscope, #music-visualizer-canvas")
        assert await vis_canvas.count() > 0, "Music visualizer canvas missing"
        
        # Test visualizer mode toggle
        vis_toggle = page.locator("button[onclick*='toggleVisualizerMode'], #btn-vis-mode-toggle").first
        if await vis_toggle.count() > 0:
            await vis_toggle.click()
            await page.wait_for_timeout(100)
            print("Successfully toggled visualizer mode")

        # 8. Test 60 FPS Shorts Video Studio
        print("--> Testing 60 FPS Shorts Video Studio...")
        shorts_tab = page.locator(".omni-tab-btn[data-tab='tab-shorts']").first
        await shorts_tab.click()
        await page.wait_for_timeout(150)
        shorts_canvas = page.locator("#shorts-canvas")
        assert await shorts_canvas.count() > 0, "Shorts canvas missing"

        # 9. Test Graphic & Thumbnail Forge
        print("--> Testing Graphic & Thumbnail Forge...")
        thumb_tab = page.locator(".omni-tab-btn[data-tab='tab-thumb-forge']").first
        await thumb_tab.click()
        await page.wait_for_timeout(150)
        thumb_canvas = page.locator("#thumb-canvas")
        assert await thumb_canvas.count() > 0, "Thumb canvas missing"

        # 10. Test Content Scheduler
        print("--> Testing Content Scheduler...")
        sched_tab = page.locator(".omni-tab-btn[data-tab='tab-scheduler']").first
        await sched_tab.click()
        await page.wait_for_timeout(150)
        sched_tbody = page.locator("#schedule-tbody")
        assert await sched_tbody.count() > 0, "Schedule table body missing"

        # 11. Test Mobile Viewports (375px, 390px, 768px)
        viewports = [(375, 812), (390, 844), (768, 1024)]
        for w, h in viewports:
            print(f"--> Testing Responsive Viewport {w}x{h}...")
            await page.set_viewport_size({"width": w, "height": h})
            await page.wait_for_timeout(200)

            # Check for horizontal overflow
            scroll_width = await page.evaluate("document.documentElement.scrollWidth")
            client_width = await page.evaluate("document.documentElement.clientWidth")
            print(f"  Viewport {w}px: scrollWidth = {scroll_width}, clientWidth = {client_width}")
            assert scroll_width <= client_width + 1, f"Horizontal overflow detected at {w}px: scrollWidth {scroll_width} > clientWidth {client_width}"

            # Check mobile bottom nav bar visibility on mobile
            if w <= 768:
                mobile_bar = page.locator(".omni-mobile-bar, #omni-mobile-bar")
                assert await mobile_bar.count() > 0, f"Mobile nav bar missing at {w}px"
                # Check mobile bar has agent avatar and name
                mob_name = page.locator("#mobile-bar-agent-name")
                assert await mob_name.count() > 0, "Mobile bar agent name missing"

        # Check console errors
        print("\n--- Console Error Audit ---")
        print(f"Total error events: {len(console_errors)}")
        for err in console_errors:
            print(f"  {err}")
        assert len(console_errors) == 0, f"Found {len(console_errors)} console errors during test run!"

        print("\n--> ALL OMNIPOST TESTS PASSED WITH 0 CONSOLE ERRORS!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_omnipost())
