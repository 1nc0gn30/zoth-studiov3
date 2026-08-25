from bs4 import BeautifulSoup
import re

with open('public/blueprints/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Simplify Hero
h1 = soup.find('h1')
if h1:
    h1.clear()
    h1.append("Architectural Blueprints")
    p = h1.find_next_sibling('p')
    if p:
        p.clear()
        p.append("Battle-tested, production-ready blocks that AI agents use to assemble custom websites in seconds.")

# Remove metrics grid
metrics = soup.find('div', class_='metrics-grid')
if metrics:
    metrics.decompose()

# Simplify the explorer cards
explorer = soup.find('section', class_='explorer-section')
if explorer:
    header = explorer.find('div', class_='section-header')
    if header:
        p = header.find('p')
        if p:
            p.decompose()

    cards = explorer.find_all('div', class_='blueprint-card')
    for card in cards:
        # Remove the dense tech stack UL
        tech_list = card.find('ul', class_='tech-stack-list')
        if tech_list:
            tech_list.decompose()

with open('public/blueprints/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
