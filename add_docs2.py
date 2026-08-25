from bs4 import BeautifulSoup

with open('public/docs/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

new_section_html = """
<section class="doc-section" id="companion-spirits">
    <h2><span>🐾</span> Companion Spirits & Hardware Telemetry</h2>
    <p>
        The 24 specialized autonomous AI companions are engineered for local-first pairing and multi-agent arbitration.
    </p>
    
    <div style="margin-top:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:var(--docs-gold); margin-top:0; margin-bottom:8px;">Frontier & Sovereign Harnesses</h3>
            <p style="margin:0;">Each mascot binds to specialized CLI tools — Google Antigravity (agy), Nous Hermes, xAI Grok, and local Ollama :11434 weights.</p>
        </div>
        
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:var(--cyan); margin-top:0; margin-bottom:8px;">3D Volumetric Figurines</h3>
            <p style="margin:0;">Interactive volumetric relief figurines with kinetic task vibes, obsidian crystal chassis, celestial lighting, and touch-safe gestures.</p>
        </div>
        
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:#c084fc; margin-top:0; margin-bottom:8px;">Neural Voice & Hardware</h3>
            <p style="margin:0;">Integrated Edge-TTS neural voice personas, synthesized Web Audio DSP chirps, and live serial telemetry.</p>
        </div>
    </div>
</section>
"""
new_section = BeautifulSoup(new_section_html, 'html.parser')

methodology = soup.find('section', id='methodology')
if methodology:
    methodology.insert_after(new_section)
else:
    topology = soup.find('section', id='topology')
    if topology:
        topology.insert_before(new_section)

nav = soup.find('nav', class_='docs-sidebar')
if nav:
    methodology_link = nav.find('a', href='#methodology')
    if methodology_link:
        new_link = soup.new_tag('a', href='#companion-spirits')
        new_span = soup.new_tag('span')
        new_span.string = '🐾'
        new_link.append(new_span)
        new_link.append(' Companion Spirits')
        methodology_link.insert_after(new_link)

with open('public/docs/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
