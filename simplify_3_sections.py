from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# 1. Simplify how-it-works
how = soup.find('section', id='how-it-works')
if how:
    vid = how.find('div', class_='showcase-media-card')
    if vid:
        vid.decompose() # Remove the huge embedded video from the interactive demo
        
# 2. Simplify interface (Phone Interface)
interface = soup.find('section', id='interface')
if interface:
    # Let's remove the massive phone handset and just keep the text
    # Actually, the user says "keep them simple like the trust section ect."
    phone_card = interface.find('div', class_='phone-handset-card')
    if phone_card:
        # Simplify phone card to just a basic representation
        phone_card.clear()
        phone_card.append(BeautifulSoup("""
        <div style="border: 1px solid var(--border-card); background: var(--surface-card); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📱</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">Familiar Chat Interface</h3>
            <p style="color: var(--text-subhead); font-size: 0.9rem;">Chat with agents just like messaging a colleague. Supports 1:1, group swarms, and voice transcripts.</p>
        </div>
        """, 'html.parser'))
        
    features = interface.find('div', class_='features-list')
    if features:
        features.decompose() # Remove the complex features list

# 3. Simplify trust section
trust = soup.find('section', id='trust')
if trust:
    cards = trust.find_all('div', class_='trust-matrix-card')
    for card in cards:
        # Remove complex lists in trust section
        ul = card.find('ul')
        if ul:
            ul.decompose()

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
