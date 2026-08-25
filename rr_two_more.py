from bs4 import BeautifulSoup
import re

# 1. Simplify public/social/index.html
with open('public/social/index.html', 'r', encoding='utf-8') as f:
    soup_social = BeautifulSoup(f, 'html.parser')

ticker = soup_social.find('div', class_='ticker-bar')
if ticker:
    ticker.decompose()

telemetry = soup_social.find('div', class_='telemetry-strip')
if telemetry:
    telemetry.decompose()

social_hero = soup_social.find('section', class_='social-hero')
if social_hero:
    # Just remove the sub-text, keep the H1
    p = social_hero.find('p', class_='hero-sub')
    if p:
        p.clear()
        p.append("Live dispatches and community feed.")

with open('public/social/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup_social))

# 2. Simplify public/pets/index.html
with open('public/pets/index.html', 'r', encoding='utf-8') as f:
    soup_pets = BeautifulSoup(f, 'html.parser')

why_grid = soup_pets.find('div', class_='why-grid')
if why_grid:
    why_grid.decompose()

pet_hero = soup_pets.find('section', class_='pet-hero')
if pet_hero:
    lead = pet_hero.find('p', class_='pet-hero-lead')
    if lead:
        lead.clear()
        lead.append("Twenty-four specialized autonomous AI companions.")

with open('public/pets/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup_pets))

