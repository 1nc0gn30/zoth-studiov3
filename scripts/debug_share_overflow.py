import asyncio
import functools
import http.server
import os
import threading
from playwright.async_api import async_playwright

def start_server():
    public_dir = os.path.join(os.getcwd(), "public")
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=public_dir)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 8089), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd

async def check():
    httpd = start_server()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_viewport_size({"width": 360, "height": 640})
        await page.goto("http://127.0.0.1:8089/comic/share.html", wait_until="domcontentloaded")
        
        overflowing_elements = await page.evaluate("""() => {
            const results = [];
            const all = document.querySelectorAll("*");
            const winWidth = window.innerWidth;
            for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.width > winWidth + 1 || rect.right > winWidth + 1) {
                    results.push({
                        tag: el.tagName,
                        id: el.id,
                        className: el.className,
                        width: Math.round(rect.width),
                        right: Math.round(rect.right),
                        html: el.outerHTML.substring(0, 120)
                    });
                }
            }
            return results;
        }""")
        print(f"Found {len(overflowing_elements)} overflowing elements at 360px:")
        for el in overflowing_elements:
            print(f"Tag: {el['tag']} | ID: {el['id']} | Class: {el['className']} | Width: {el['width']} | Right: {el['right']} | HTML: {el['html']}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(check())
