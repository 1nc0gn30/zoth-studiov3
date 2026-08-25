from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Task 1: Fix mobile hero spacing
hero = soup.find('section', id='hero')
if hero:
    content_div = hero.find('div', style=re.compile(r'padding:\s*120px\s*20px;'))
    if content_div:
        # Replace the hardcoded inline style with a responsive class
        current_style = content_div['style']
        content_div['style'] = current_style.replace('padding: 120px 20px;', '')
        content_div['class'] = content_div.get('class', []) + ['hero-content-pad']

# Task 2: Text emphasis in Hero and other places
if hero:
    h1 = hero.find('h1')
    if h1 and "team of AI agents" in h1.text:
        # Wrap "team of AI agents" in emphasis
        h1.clear()
        h1.append("Your private workspace for a ")
        mark = soup.new_tag('mark', **{'class': 'z-highlight gold'})
        mark.string = "team of AI agents"
        h1.append(mark)
        h1.append(".")

# Let's add text emphasis to the 'Familiar Chat Interface' section
interface = soup.find('section', id='interface')
if interface:
    h2 = interface.find('h2')
    if h2 and "Powerful like a workstation" in h2.text:
        h2.clear()
        h2.append("Familiar like a phone. ")
        mark = soup.new_tag('mark', **{'class': 'z-highlight cyan'})
        mark.string = "Powerful like a workstation."
        h2.append(mark)

# Task 3: Fonts & Icons injection
# Inject Google Fonts and Phosphor Icons into the head
head = soup.find('head')
if head:
    # Add Space Grotesk and Plus Jakarta Sans
    fonts_link = soup.new_tag('link', href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap", rel="stylesheet")
    head.append(fonts_link)
    
    # Add Phosphor icons
    phosphor = soup.new_tag('script', src="https://unpkg.com/@phosphor-icons/web")
    head.append(phosphor)

# Task 4: Phone Frame for the interface section
if interface:
    phone_card = interface.find('div', class_='phone-handset-card')
    if phone_card:
        phone_card['class'] = ['figma-phone-frame']
        phone_card.clear()
        
        # Build the Figma Phone UI
        notch = soup.new_tag('div', **{'class': 'figma-phone-notch'})
        phone_card.append(notch)
        
        content = BeautifulSoup("""
        <div class="figma-phone-content" style="padding: 40px 20px 20px; height: 100%; display: flex; flex-direction: column; background: var(--bg); color: var(--text-primary);">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 20px; font-family: var(--font-theme-mono);">
                <span>9:41</span>
                <div style="display: flex; gap: 4px;">
                    <i class="ph-fill ph-cell-signal-full"></i>
                    <i class="ph-fill ph-wifi-high"></i>
                    <i class="ph-fill ph-battery-full"></i>
                </div>
            </div>
            
            <div style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <i class="ph-fill ph-robot" style="font-size: 3rem; color: var(--cyan); margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 8px; font-size: 1.2rem;">Swarm Chat</h3>
                <p style="color: var(--text-subhead); font-size: 0.85rem; margin: 0;">1:1 and group agents.</p>
            </div>
            
            <div style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <i class="ph-fill ph-waveform" style="font-size: 3rem; color: var(--gold); margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 8px; font-size: 1.2rem;">Voice Tasks</h3>
                <p style="color: var(--text-subhead); font-size: 0.85rem; margin: 0;">Local transcripts.</p>
            </div>
        </div>
        """, 'html.parser')
        phone_card.append(content)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
