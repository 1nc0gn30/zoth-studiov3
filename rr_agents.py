from bs4 import BeautifulSoup
import re

with open('public/agents/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Simplify Hero
pill = soup.find('div', class_='agent-tag-pill')
if pill:
    pill.string = "21 AGENT SPECIALISTS"

h1 = soup.find('h1')
if h1:
    h1.clear()
    h1.append("Your Local AI Team")

# Remove lore paragraph
if h1:
    p = h1.find_next_sibling('p')
    if p and 'Master Azoth' in p.get_text():
        p.decompose()

# Remove stats grid
stats = soup.find('div', class_='agent-stats-grid')
if stats:
    stats.decompose()

# Simplify all agent cards
cards = soup.find_all('a', class_='pantheon-card')
for card in cards:
    tag = card.find('span', class_='pantheon-card-tag')
    if tag:
        tag.decompose()
        
    desc = card.find('p', class_='pantheon-card-desc')
    if desc:
        desc.decompose()
        
    footer = card.find('div', class_='pantheon-card-footer')
    if footer:
        footer.decompose()

# The grid has some esoteric tabs maybe?
filters = soup.find('div', class_='agent-filter-strip')
if filters:
    # Just remove the lore tooltips
    pass

# We also have an "Alchemical Detail Matrix" section at the bottom? Let's check.
detail_sec = soup.find('section', class_='detail-card')
if detail_sec:
    detail_sec.decompose()

with open('public/agents/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
