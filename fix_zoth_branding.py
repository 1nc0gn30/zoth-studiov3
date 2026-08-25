from bs4 import BeautifulSoup
import re

with open('public/zoth/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

main = soup.find('main')
if main:
    hero = main.find('section')
    if hero:
        # We will inject the image and rebrand the text
        h1 = hero.find('h1')
        if h1:
            h1.string = "Master Azoth"
        
        pill = hero.find('div', class_='agent-tag-pill')
        if pill:
            pill.string = "THE PRIME ARCHITECT"
            
        p = hero.find('p')
        if p:
            p.string = "Azoth transforms software development from confusing complexity into an alchemical purification process, directing the swarm to synthesize hardened deterministic output directly on your machine."

        # Insert image before the pill
        img_html = """
        <div style="margin-bottom: 24px;">
            <img src="/assets/agents/azoth.jpg" alt="Master Azoth" style="width: 120px; height: 120px; border-radius: 50%; border: 2px solid var(--gold); box-shadow: 0 0 40px rgba(232,200,114,0.3);">
        </div>
        """
        img_tag = BeautifulSoup(img_html, 'html.parser')
        pill.insert_before(img_tag)

        # Update page title
        title = soup.find('title')
        if title:
            title.string = "Master Azoth | Sovereign Alchemist | Zoth Studio"

with open('public/zoth/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

