import re
from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

with open('old_hero.html', 'r', encoding='utf-8') as f:
    # Need to isolate just the <section id="hero"> from old_hero.html
    old_hero_soup = BeautifulSoup(f, 'html.parser')

old_hero_section = old_hero_soup.find('section', id='hero')
if old_hero_section:
    # Now let's apply the UI facelifts properly to old_hero_section BEFORE replacing it
    
    # 1. H1 text gradient
    h1 = old_hero_section.find('h1', class_='hero-h1')
    if h1:
        # Keep inner HTML but change style
        h1['style'] = "font-family:var(--font-display);font-size:clamp(48px, 8vw, 88px);font-weight:900;letter-spacing:-0.04em;line-height:1.05;margin:0 0 24px 0; background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"

    # 2. Phosphor icons for trust strip
    # We must find the EXACT div that has 100% Local but NOT the huge wrapper
    for div in old_hero_section.find_all('div'):
        # Check if this div directly contains the trust strip by checking its class or direct children
        if "100% Local" in div.text and "flex" in div.get("class", []) and "mt-6" in div.get("class", []):
            div.clear()
            trust_html = """
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-lock" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">100% Local</strong></span>
            <span style="color:var(--line)">·</span>
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-code" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">Open Source</strong></span>
            <span style="color:var(--line)">·</span>
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-shield-check" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">Zero Telemetry</strong></span>
            """
            div.append(BeautifulSoup(trust_html, 'html.parser'))
            break

    # Now replace the broken hero in public/index.html
    broken_hero = soup.find('section', id='hero')
    if broken_hero:
        broken_hero.replace_with(old_hero_section)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
