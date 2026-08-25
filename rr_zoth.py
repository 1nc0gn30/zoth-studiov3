from bs4 import BeautifulSoup

with open('public/zoth/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Remove complex hero
hero = soup.find('section', class_='hero')
if hero:
    hero.decompose()

# Add a simple clean hero at the top of main
main = soup.find('main')
if main:
    new_hero = soup.new_tag('section')
    new_hero['style'] = "text-align:center; max-width:880px; margin:120px auto 60px;"
    new_hero.append(BeautifulSoup("""
        <div class="agent-tag-pill" style="margin:0 auto 13px;">METHODOLOGY</div>
        <h1 style="font-family:var(--font-display); font-size:clamp(2.4rem, 5vw, 4.2rem); font-weight:900; letter-spacing:-0.03em; line-height:1.05; margin-bottom:21px; color:#ffffff;">
            How Zoth Works
        </h1>
        <p style="color:#e2e8f0; font-size:16.5px; line-height:1.65;">
            Azoth transforms software development from confusing complexity into an alchemical purification process: dissolving errors, cross-checking truth with multiple AI models, and synthesizing hardened deterministic output directly on your machine.
        </p>
    """, 'html.parser'))
    main.insert(0, new_hero)

# Remove archetypes
arch = soup.find('section', id='archetypes')
if arch:
    arch.decompose()

# Remove forms
forms = soup.find('section', id='forms')
if forms:
    forms.decompose()

# Remove tk-ticker
ticker = soup.find('section', id='tk-ticker')
if ticker:
    ticker.decompose()

# The remaining section is alchemical-doctrine. Let's clean it up slightly if needed.
# We will remove its internal header since we put a new hero
doc = soup.find('section', id='alchemical-doctrine')
if doc:
    header = doc.find('div', class_='section-header')
    if header:
        header.decompose()
    
    # Let's remove the "LIVE SOVEREIGN COGNITIVE DECK" interactive thing at the bottom of it to keep it purely informational
    deck = doc.find('div', class_='alchemical-deck')
    if deck:
        deck.decompose()

# Change the title
title = soup.find('title')
if title:
    title.string = "Methodology & Architecture | Zoth Studio"

with open('public/zoth/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
