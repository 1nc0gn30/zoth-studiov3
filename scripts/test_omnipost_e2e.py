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
        resp = await page.goto("http://127.0.0.1:8088/studio/omnipost.html", wait_until="domcontentloaded", timeout=15000)
        assert resp.status == 200, f"Status code: {resp.status}"
        await page.wait_for_timeout(500)

        # 1. Title & Heading Check
        title = await page.title()
        print(f"Page Title: {title}")
        assert "OmniPost" in title

        # 2. Check Agents Avatar Loop Animation
        print("--> Verifying Avatar Pingpong Loop Animations...")
        azoth_avatar = page.locator(".agent-chip-btn[data-agent='azoth'] .agent-avatar-sm")
        await azoth_avatar.wait_for(state="attached", timeout=10000)
        azoth_anim = await azoth_avatar.evaluate("el => window.getComputedStyle(el).animationName")
        print(f"Azoth Chip Avatar Animation: {azoth_anim}")
        assert "avatarPingPongAzoth" in azoth_anim or "agentAvatarAzothLoop" in azoth_anim, f"Azoth animation not applied, got {azoth_anim}"

        # Check all agent avatars in selector and on dossier
        agents = ["azoth", "kai", "athena", "draco", "kitsune", "pixel-neko", "hermes", "lycan"]
        for ag in agents:
            el = page.locator(f".agent-chip-btn[data-agent='{ag}']")
            assert await el.count() > 0, f"Missing chip for {ag}"
            await el.click()
            await page.wait_for_timeout(50)
            bio_avatar = page.locator("#agent-dossier-avatar")
            bio_anim = await bio_avatar.evaluate("el => window.getComputedStyle(el).animationName")
            print(f"  Agent {ag}: bio animation = {bio_anim}")
            assert bio_anim and bio_anim != "none", f"Expected active animation for {ag}, got {bio_anim}"

        # 3. Test WebGPU / Engine Switcher
        print("--> Testing WebGPU / Engine Switcher...")
        engine_select = page.locator("#ai-engine-select")
        if await engine_select.count() > 0:
            await engine_select.select_option("webgpu")
            await page.wait_for_timeout(100)
            engine_info = await page.locator("#webgpu-status-badge, .engine-badge, #engine-status").all_text_contents()
            print(f"Engine info: {engine_info}")

        # 4. Test Single Platform Pro Dual-Pane Editor & Pro Toolbar
        print("--> Testing Pro Dual-Pane Editor & Toolbar...")
        await page.locator(".omni-tab-btn[data-tab='tab-repurpose']").click()
        await page.wait_for_timeout(100)
        
        single_editor = page.locator("#single-platform-editor")
        if await single_editor.count() > 0:
            await single_editor.fill("Local AI Autonomous Swarm Architecture")
            # Test Unicode bold button
            bold_btn = page.locator("button[onclick=\"formatSelection('bold')\"]").first
            if await bold_btn.count() > 0:
                await bold_btn.click()
                await page.wait_for_timeout(50)
            # Test Rubin multi-pass reduce
            rubin_pass = page.locator("button[onclick*='rubinReducePass(0.4)']").first
            if await rubin_pass.count() > 0:
                await rubin_pass.click()
                await page.wait_for_timeout(100)
                txt = await single_editor.input_value()
                print(f"  Rubin reduced output: '{txt}'")

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

        # 6. Test Thread Splitter & Reordering
        print("--> Testing Thread Stitcher, Splitter & Card Reorder...")
        threads_tab = page.locator(".omni-tab-btn[data-tab='tab-threads']").first
        await threads_tab.click()
        await page.wait_for_timeout(150)
        
        thread_input = page.locator("#thread-source")
        if await thread_input.count() > 0:
            await thread_input.fill("Step 1: First insight on AI agents.\n\nStep 2: Second insight on decentralized memory.\n\nStep 3: Third insight on WebGPU inference.")
            split_btn = page.locator("#btn-stitch-thread, button[onclick*='stitchThread()']").first
            if await split_btn.count() > 0:
                await split_btn.click()
                await page.wait_for_timeout(200)
                thread_output_cards = page.locator("#thread-output-list .thread-card")
                t_count = await thread_output_cards.count()
                print(f"Thread split generated {t_count} segments")
                assert t_count >= 3, f"Expected at least 3 segments, got {t_count}"

                # Test Card Reorder Down on Post 1
                down_btn = page.locator("#thread-output-list .thread-card button[onclick*='moveThreadCard(0, 1)']").first
                if await down_btn.count() > 0:
                    await down_btn.click()
                    await page.wait_for_timeout(100)
                    print("Successfully moved thread card down")

        # 7. Test Procedural Music Forge & 16-Step Sequencer
        print("--> Testing Procedural Music Forge & 16-Step Sequencer...")
        music_tab = page.locator(".omni-tab-btn[data-tab='tab-music-forge']").first
        await music_tab.click()
        await page.wait_for_timeout(150)
        vis_canvas = page.locator("#music-oscilloscope, #music-visualizer-canvas")
        assert await vis_canvas.count() > 0, "Music visualizer canvas missing"
        
        # Test 16-Step Sequencer Matrix
        seq_buttons = page.locator("#step-seq-matrix .step-seq-btn")
        seq_count = await seq_buttons.count()
        print(f"Step sequencer buttons rendered: {seq_count}")
        assert seq_count == 16, f"Expected 16 step sequencer buttons, got {seq_count}"
        # Toggle step 1
        await seq_buttons.first.click()
        await page.wait_for_timeout(50)
        # Randomize sequencer
        rand_seq_btn = page.locator("button[onclick*='randomizeStepSeq()']").first
        if await rand_seq_btn.count() > 0:
            await rand_seq_btn.click()
            await page.wait_for_timeout(50)
            print("Successfully randomized step sequencer")

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

        # 10. Test Content Scheduler & 7-Day Calendar Grid
        print("--> Testing Content Scheduler & Calendar View...")
        sched_tab = page.locator(".omni-tab-btn[data-tab='tab-scheduler']").first
        await sched_tab.click()
        await page.wait_for_timeout(150)
        sched_tbody = page.locator("#schedule-tbody")
        assert await sched_tbody.count() > 0, "Schedule table body missing"

        # Switch to Calendar View
        cal_toggle = page.locator("#btn-sched-view-cal")
        if await cal_toggle.count() > 0:
            await cal_toggle.click()
            await page.wait_for_timeout(150)
            cal_cols = page.locator("#calendar-week-grid .cal-day-col")
            cal_count = await cal_cols.count()
            print(f"Calendar columns rendered: {cal_count}")
            assert cal_count == 7, f"Expected 7 calendar day columns, got {cal_count}"

        # Switch back to Table View
        table_toggle = page.locator("#btn-sched-view-table")
        if await table_toggle.count() > 0:
            await table_toggle.click()
            await page.wait_for_timeout(100)

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

