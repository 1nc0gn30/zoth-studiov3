#!/usr/bin/env python3
"""
Fetch recent posts from NealFrazierTech's X timeline using the user's
already-logged-in Chrome profile. Requires Playwright and Chromium.

Run locally:
    python3 scripts/fetch-x-timeline.py

The script launches a visible browser window, navigates to the profile,
waits for posts to load, then prints a JSON array of posts and exits.
"""

import json
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright, Page, BrowserContext

HANDLE = "NealFrazierTech"
MAX_POSTS = 60
SCROLL_PAUSE = 1.2
MAX_SCROLLS = 25
OUTPUT = Path(__file__).resolve().parent / f"{HANDLE}-timeline.json"


@dataclass
class Post:
    text: str
    url: str
    date: str
    stats: dict


def chrome_user_data_dir() -> Path | None:
    candidates = [
        Path.home() / ".config" / "google-chrome",
        Path.home() / ".config" / "chromium",
        Path.home() / ".var" / "app" / "com.google.Chrome" / "config" / "google-chrome",
    ]
    for p in candidates:
        if p.exists():
            return p
    return None


def normalize_url(href: str) -> str:
    if not href:
        return ""
    if href.startswith("http"):
        return href
    return urljoin("https://x.com/", href)


def extract_post_id(url: str) -> str:
    m = re.search(r"/status/(\d+)", url)
    return m.group(1) if m else ""


def scrape_posts(page: Page) -> list[Post]:
    posts: list[Post] = []
    seen_ids: set[str] = set()
    last_height = 0
    scrolls = 0

    while len(posts) < MAX_POSTS and scrolls < MAX_SCROLLS:
        # Article elements are the tweet/post cells on X.
        articles = page.locator("article").all()
        for article in articles:
            try:
                link_el = article.locator("a[href*='/status/']").first
                href = link_el.get_attribute("href") or ""
                post_url = normalize_url(href)
                post_id = extract_post_id(post_url)
                if not post_id or post_id in seen_ids:
                    continue

                text_parts = article.locator("[data-testid='tweetText']").all_inner_texts()
                text = " ".join(text_parts).strip()
                if not text:
                    continue

                # Try to find a visible timestamp link for this post.
                time_el = article.locator("time").first
                date = time_el.get_attribute("datetime") or ""

                stats = {}
                for testid in ["reply", "retweet", "like"]:
                    try:
                        val = article.locator(f"[data-testid='{testid}']").get_attribute("aria-label") or ""
                        stats[testid] = val
                    except Exception:
                        stats[testid] = ""

                seen_ids.add(post_id)
                posts.append(Post(text=text, url=post_url, date=date, stats=stats))
            except Exception:
                continue

        # Scroll to load more.
        page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
        time.sleep(SCROLL_PAUSE)
        new_height = page.evaluate("document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
        scrolls += 1

    return posts[:MAX_POSTS]


def main() -> int:
    user_data = chrome_user_data_dir()
    if not user_data:
        print("Could not find a Chrome/Chromium user-data directory.", file=sys.stderr)
        print("Log into X in Chrome first, then re-run.", file=sys.stderr)
        return 1

    profile = "Default"
    # Common Linux profile names if Default doesn't exist.
    for cand in ["Default", "Profile 1", "Profile 2"]:
        if (user_data / cand).is_dir():
            profile = cand
            break

    print(f"Using Chrome profile: {user_data / profile}")

    with sync_playwright() as p:
        context: BrowserContext = p.chromium.launch_persistent_context(
            user_data_dir=str(user_data / profile),
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ],
            viewport={"width": 1280, "height": 900},
        )

        page = context.new_page()
        page.goto(f"https://x.com/{HANDLE}", wait_until="domcontentloaded", timeout=60000)
        print("Waiting for timeline to populate...")
        try:
            page.wait_for_selector("article", timeout=30000)
        except Exception:
            print("No posts loaded in 30s. You may not be logged in, or X is showing a login wall.", file=sys.stderr)
            context.close()
            return 1

        # Extra wait for lazy content.
        time.sleep(2)
        posts = scrape_posts(page)

        output_data = [
            {
                "text": p.text,
                "url": p.url,
                "date": p.date,
                "stats": p.stats,
            }
            for p in posts
        ]

        OUTPUT.write_text(json.dumps(output_data, indent=2, ensure_ascii=False))
        print(f"\nSaved {len(posts)} posts to {OUTPUT}")
        # Also print concise summary so the user can paste it easily.
        for p in posts:
            print(f"\n[{p.date[:16] if p.date else 'no-date'}] {p.url}")
            print(p.text[:240].replace("\n", " "))

        context.close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
