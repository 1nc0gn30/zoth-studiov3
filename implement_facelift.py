from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# 1. Hero
hero = soup.find('section', id='hero')
if hero:
    h1 = hero.find('h1', class_='hero-h1')
    if h1:
        # text gradient on H1
        h1['style'] = "font-family:var(--font-display);font-size:clamp(48px, 8vw, 88px);font-weight:900;letter-spacing:-0.04em;line-height:1.05;margin:0 0 24px 0; background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
    
    # Trust strip inside hero
    # Find the div with "100% Local"
    for div in hero.find_all('div'):
        if "100% Local" in div.text and "Zero Telemetry" in div.text:
            div.clear()
            trust_html = """
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-lock" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">100% Local</strong></span>
            <span style="color:var(--line)">·</span>
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-code" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">Open Source</strong></span>
            <span style="color:var(--line)">·</span>
            <span class="inline-flex items-center gap-2"><i class="ph-fill ph-shield-check" style="color:var(--cyan); font-size:1.2rem;"></i> <strong style="color:var(--text-primary);">Zero Telemetry</strong></span>
            """
            div.append(BeautifulSoup(trust_html, 'html.parser'))

# 2. How it works (Bento)
hiw = soup.find('section', id='how-it-works')
if hiw:
    cards = hiw.find_all('div', class_='showcase-step-card')
    icons = ['ph-target', 'ph-users-three', 'ph-lightning']
    colors = ['rgba(0,240,255', 'rgba(251,191,36', 'rgba(52,211,153'] # cyan, gold, green
    hex_colors = ['var(--cyan)', 'var(--gold)', '#34d399']
    
    for i, card in enumerate(cards):
        if i < 3:
            card['style'] = "position:relative; overflow:hidden; padding:40px; background:var(--surface-card); border:1px solid var(--border-card); border-radius:24px; box-shadow:0 10px 30px rgba(0,0,0,0.1); transition:transform 0.3s ease, box-shadow 0.3s ease; display:flex; flex-direction:column; gap:16px;"
            card['class'] = card.get('class', []) + ['premium-bento-card']
            
            # Extract title and description to rewrite
            title = card.find('strong').text if card.find('strong') else "Step"
            p = card.find('p').text if card.find('p') else ""
            
            card.clear()
            
            bento_html = f"""
            <div style="position:absolute; top:-30px; right:-30px; width:180px; height:180px; background:radial-gradient(circle, {colors[i]},0.15) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>
            <div style="position:absolute; top:-10px; right:10px; font-size:10rem; font-weight:900; color:var(--text-primary); opacity:0.03; font-family:var(--font-mono); pointer-events:none; letter-spacing:-0.05em;">0{i+1}</div>
            
            <div style="position:relative; z-index:1;">
                <div style="font-size:3.5rem; color:{hex_colors[i]}; margin-bottom:24px;"><i class="ph-duotone {icons[i]}"></i></div>
                <h3 style="font-family:var(--font-display);font-size:1.6rem;color:var(--text-primary);margin:0 0 12px 0;font-weight:800;">{title}</h3>
                <p style="color:var(--text-subhead);font-size:1.05rem;line-height:1.6;margin:0;">{p}</p>
            </div>
            """
            card.append(BeautifulSoup(bento_html, 'html.parser'))

# 3. Footer Mega Redesign
footer = soup.find('footer', class_='site')
if footer:
    # Clear the old footer
    footer.clear()
    
    mega_footer_html = """
    <div style="position:relative; overflow:hidden; padding: 120px 40px 60px; background: linear-gradient(180deg, transparent 0%, rgba(5,6,10,1) 100%); border-top: 1px solid var(--border-card);">
        
        <!-- Giant Typographical Watermark -->
        <div style="position:absolute; bottom:-10%; left:50%; transform:translateX(-50%); font-family:var(--font-display); font-size:28vw; font-weight:900; color:rgba(255,255,255,0.015); pointer-events:none; white-space:nowrap; user-select:none; z-index:0; letter-spacing:-0.05em;">ZOTH</div>
        
        <div style="position:relative; z-index:1; max-width:1200px; margin:0 auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:60px;">
            
            <div style="grid-column: 1 / -1; margin-bottom:40px; display:flex; flex-direction:column; align-items:center; text-align:center;">
                <img alt="Zoth Golden Z Emblem" decoding="async" height="64" loading="lazy" src="/assets/brand/zoth-golden-z-192.png" style="border-radius:12px;box-shadow:0 0 24px rgba(251,191,36,0.3);margin-bottom:24px;" width="64"/>
                <strong style="font-family:var(--font-display); font-size:2rem; font-weight:900; letter-spacing:-0.02em;">Zoth Studio</strong>
                <small style="color:var(--text-subhead); font-size:1.1rem; margin-top:8px;">Local-first autonomous agent environment.</small>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h3 style="font-family:var(--font-theme-mono); font-size:0.9rem; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Studio</h3>
                <a class="mega-footer-link" href="http://127.0.0.1:8484/">Operator Deck</a>
                <a class="mega-footer-link" href="/studio/">Environment</a>
                <a class="mega-footer-link" href="/studio/swarm.html">Swarm Monitor</a>
                <a class="mega-footer-link" href="/adytum/">Adytum</a>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h3 style="font-family:var(--font-theme-mono); font-size:0.9rem; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Ecosystem</h3>
                <a class="mega-footer-link" href="/agents/">Agent Pantheon</a>
                <a class="mega-footer-link" href="/vault/">Vector Vault</a>
                <a class="mega-footer-link" href="/pets/">Companion Pets</a>
                <a class="mega-footer-link" href="/docs/">Documentation</a>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h3 style="font-family:var(--font-theme-mono); font-size:0.9rem; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Open Source</h3>
                <a class="mega-footer-link" href="https://github.com/NullAITech/zoth-studio">GitHub Repository</a>
                <a class="mega-footer-link" href="/faq.html">FAQ</a>
                <a class="mega-footer-link" href="/social/index.html">Social Wall</a>
            </div>
        </div>
        
        <div style="position:relative; z-index:1; max-width:1200px; margin:80px auto 0; padding-top:40px; border-top:1px solid rgba(255,255,255,0.05); text-align:center; color:var(--muted); font-size:0.95rem; display:flex; flex-direction:column; gap:12px;">
            <p>100% Local Execution. Engineered for strict privacy.</p>
            <p>&copy; 2026 NullAI Tech. Released under MIT / Open Source.</p>
        </div>
    </div>
    """
    footer.append(BeautifulSoup(mega_footer_html, 'html.parser'))

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
