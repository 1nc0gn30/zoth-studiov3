from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# 1. Remove the noisy Marquee
marquee = soup.find('div', class_='magic-marquee-track')
if marquee:
    marquee.decompose()

# 2. Clean up Hero section buttons (remove 'See How It Works')
how_btn = soup.find('a', href='#how-it-works')
if how_btn:
    how_btn.decompose()

# 3. Remove cluttered sections: how-it-works, interface, trust
for sec_id in ['how-it-works', 'interface', 'trust']:
    sec = soup.find(id=sec_id)
    if sec:
        sec.decompose()

# 4. Handle the videos. The user said "reduc the home page... to ensure simplicity".
# The page currently has 6 videos. We'll keep ONLY the first one (video_hero) and the last one (video_athena) 
# Or just ONE video. Let's keep just the first video, and put it right after the Hero.
# Wait, let's just delete all showcase videos except the first one, which is the most impactful.
videos = soup.find_all('div', class_='showcase-media-card')
for i, v in enumerate(videos):
    if i > 0:
        v.decompose()
    else:
        # Move the first video out of the flex container to below it, so it spans nicely
        # But wait, it's already in the hero flex container. Let's append it to the hero section directly.
        hero = soup.find(id='hero')
        if hero:
            hero.append(v.extract())

# 5. The Agents section. It's a bit cluttered. Let's simplify the text.
agents = soup.find(id='agents')
if agents:
    # Remove the subhead paragraph if it exists
    p = agents.find('p', class_='lede')
    if p:
        p.decompose()

# 6. Install section. Keep the terminal, remove the extra fluff text.
install = soup.find(id='install')
if install:
    p = install.find('p', class_='lede')
    if p:
        p.decompose()
    # The OS tabs might be too complex for a Rick Rubin page. But it's functional.
    # Let's just remove the 4 endpoint status cards at the bottom of install
    endpoints = install.find('div', class_='endpoint-status-cards')
    if endpoints:
        endpoints.decompose()
    
    # In index.html, the install cards are just divs.
    grid = install.find('div', style=lambda s: s and 'grid-template-columns' in s)
    # The install OS tabs are buttons. Let's keep them as they are functional.

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
