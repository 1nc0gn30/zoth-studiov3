from bs4 import BeautifulSoup
import re

with open('public/studio/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Simplify Hero
h1 = soup.find('h1')
if h1:
    h1.clear()
    h1.append("Zoth Studio Workstations")
    
if h1:
    p = h1.find_next_sibling('p')
    if p:
        p.clear()
        p.append("15 local interfaces designed for specific workflows.")

# Clean up cards
cards = soup.find_all('a', class_='ws-card')
for card in cards:
    # We keep thumb, title, but cut the description paragraph to save space and reduce reading
    desc = card.find('p', class_='ws-desc')
    if desc:
        desc.decompose()
        
    # Simplify the badge
    badge_cat = card.find('span', class_='ws-badge-cat')
    if badge_cat and '⚡' in badge_cat.text:
        badge_cat.string = badge_cat.text.replace('⚡ ', '')

    badge_port = card.find('span', class_='ws-badge-port')
    if badge_port:
        badge_port.decompose() # Remove the "STUDIO V2" or "SELF-HEAL V3" noise

with open('public/studio/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
