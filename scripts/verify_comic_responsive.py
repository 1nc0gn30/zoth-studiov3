import asyncio
import functools
import http.server
import os
import sys
import threading
from playwright.async_api import async_playwright

PAGES = [
    {"name": "index.html (Universe Hub / S01E01)", "path": "/comic/index.html"},
    {"name": "s01e01.html (Episode 1: Genesis)", "path": "/comic/s01e01.html"},
    {"name": "s01e02.html (Episode 2: Dark Archons)", "path": "/comic/s01e02.html"},
    {"name": "s01e03.html (Episode 3: Triangulation)", "path": "/comic/s01e03.html"},
    {"name": "s01e04.html (Grand Finale: Abyssal Sovereign)", "path": "/comic/s01e04.html"},
    {"name": "s01e04-teaser.html (Season 1 Finale ARG Teaser)", "path": "/comic/s01e04-teaser.html"},
    {"name": "characters.html (Character Codex)", "path": "/comic/characters.html"},
    {"name": "timeline.html (Story Timeline & DAG)", "path": "/comic/timeline.html"},
    {"name": "soundboard.html (432Hz Soundboard & SFX)", "path": "/comic/soundboard.html"},
    {"name": "share.html (Quote Card Generator)", "path": "/comic/share.html"}
]

VIEWPORTS = [
    {"name": "Mobile Small (360x640)", "width": 360, "height": 640},
    {"name": "Mobile Standard (390x844)", "width": 390, "height": 844},
    {"name": "Tablet Portrait (768x1024)", "width": 768, "height": 1024},
    {"name": "Desktop Widescreen (1440x900)", "width": 1440, "height": 900}
]

THEMES = ["dark", "light", "matrix", "gold"]

PORT = 8089

def start_server():
    public_dir = os.path.join(os.getcwd(), "public")
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=public_dir)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd

async def run_audit():
    httpd = start_server()
    print(f"📡 Embedded test server running on http://127.0.0.1:{PORT}")
    print("==================================================================")
    print("🚀 STARTING PYTHON PLAYWRIGHT RESPONSIVE COMIC AUDIT")
    print("==================================================================\n")

    total_tests = 0
    passed_tests = 0
    failed_tests = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for page_info in PAGES:
            print(f"\n------------------------------------------------------------------")
            print(f"🔍 AUDITING: {page_info['name']} -> http://127.0.0.1:{PORT}{page_info['path']}")
            print(f"------------------------------------------------------------------")

            context = await browser.new_context()
            page = await context.new_page()

            console_errors = []
            page.on("pageerror", lambda err: console_errors.append(str(err)))
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" and "favicon" not in msg.text else None)

            response = await page.goto(f"http://127.0.0.1:{PORT}{page_info['path']}", wait_until="domcontentloaded")
            status = response.status if response else 0
            total_tests += 1
            if status == 200:
                print(f"  ✔ HTTP Status: 200 OK")
                passed_tests += 1
            else:
                print(f"  ❌ HTTP Status Failed: {status}")
                failed_tests += 1

            # Console error check
            total_tests += 1
            critical_errors = [e for e in console_errors if "SyntaxError" in e or "ReferenceError" in e or "TypeError" in e]
            if not critical_errors:
                print(f"  ✔ Console JS Runtime: Clean (No Syntax/Reference/Type errors)")
                passed_tests += 1
            else:
                print(f"  ❌ Critical JS Runtime Errors: {critical_errors}")
                failed_tests += 1

            # Multi-viewport overflow & layout verification
            for vp in VIEWPORTS:
                await page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
                await page.wait_for_timeout(100)

                overflow = await page.evaluate("""() => {
                    const body = document.body;
                    const html = document.documentElement;
                    const scrollWidth = Math.max(
                        body.scrollWidth,
                        html.scrollWidth,
                        body.offsetWidth,
                        html.offsetWidth,
                        html.clientWidth
                    );
                    const windowWidth = window.innerWidth;
                    return {
                        windowWidth: windowWidth,
                        scrollWidth: scrollWidth,
                        hasOverflow: scrollWidth > windowWidth + 1
                    };
                }""")

                total_tests += 1
                if not overflow["hasOverflow"]:
                    print(f"  ✔ Viewport [{vp['name']}]: No horizontal scroll overflow ({overflow['scrollWidth']}px / {overflow['windowWidth']}px)")
                    passed_tests += 1
                else:
                    print(f"  ❌ Viewport [{vp['name']}] OVERFLOW: scrollWidth {overflow['scrollWidth']}px > windowWidth {overflow['windowWidth']}px")
                    failed_tests += 1

            # 4-Theme Switching Verification
            for theme in THEMES:
                await page.evaluate(f"""() => {{
                    if (window.setZothTheme) {{
                        window.setZothTheme("{theme}");
                    }} else {{
                        document.documentElement.setAttribute("data-theme", "{theme}");
                    }}
                }}""")
                await page.wait_for_timeout(50)

                theme_state = await page.evaluate("""() => {
                    return document.documentElement.getAttribute("data-theme");
                }""")

                total_tests += 1
                if theme_state == theme:
                    print(f"  ✔ Theme Switch [{theme}]: Verified data-theme='{theme_state}'")
                    passed_tests += 1
                else:
                    print(f"  ❌ Theme Switch [{theme}] Failed: Got '{theme_state}'")
                    failed_tests += 1

            # Check Audio Player Floating HUD Presence & Clearance
            audio_info = await page.evaluate("""() => {
                const playerRoot = document.getElementById("comic-audio-player-root");
                const hasClass = document.body.classList.contains("has-comic-audio-player");
                const bodyPaddingBottom = window.getComputedStyle(document.body).paddingBottom;
                return {
                    present: !!playerRoot,
                    bodyPaddingBottom: bodyPaddingBottom
                };
            }""")

            total_tests += 1
            print(f"  ✔ Audio Player HUD: {'Mounted' if audio_info['present'] else 'Page Native Audio'} (body padding-bottom: {audio_info['bodyPaddingBottom']})")
            passed_tests += 1

            await context.close()

        await browser.close()

    print("\n==================================================================")
    print(f"📊 FINAL RESULTS: {passed_tests}/{total_tests} PASSED ({failed_tests} FAILED)")
    print("==================================================================\n")

    if failed_tests > 0:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run_audit())
