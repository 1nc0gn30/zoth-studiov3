import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        await page.goto("http://127.0.0.1:8088/", timeout=10000, wait_until="load")
        await page.evaluate('document.documentElement.setAttribute("data-theme", "light")')
        await page.wait_for_timeout(2000)
        
        await page.screenshot(path="light_mode_test.jpg", type="jpeg", full_page=True, quality=90)
        await browser.close()

asyncio.run(main())
