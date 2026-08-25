from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

agents_section = soup.find('section', id='agents')
if agents_section:
    grid = agents_section.find('div', style=lambda value: value and 'display: grid' in value and '220px' in value)
    if grid:
        grid.clear()
        
        agents = [
            {
                "name": "Master Azoth",
                "role": "The Sovereign Alchemist",
                "url": "/zoth/",
                "img": "/assets/agents/azoth.jpg",
                "color": "#e8c872"
            },
            {
                "name": "Athena",
                "role": "AEO Knowledge Architect",
                "url": "/agents/athena.html",
                "img": "/assets/agents/athena.jpg",
                "color": "#c084fc"
            },
            {
                "name": "Draco",
                "role": "Multi-Model Consensus",
                "url": "/agents/draco.html",
                "img": "/assets/agents/draco.jpg",
                "color": "#e8c872"
            },
            {
                "name": "Hermes",
                "role": "Winged Tool Executor",
                "url": "/agents/hermes.html",
                "img": "/assets/agents/hermes.jpg",
                "color": "#f59e0b"
            }
        ]
        
        for agent in agents:
            card_html = f"""
            <a class="agent-card-interactive" href="{agent['url']}" style="background:var(--surface-card);border:1px solid var(--border-card);border-radius:24px;padding:24px;text-decoration:none;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <img alt="{agent['name']}" decoding="async" height="80" loading="lazy" src="{agent['img']}" style="width:80px;height:80px;border-radius:20px;border:2px solid {agent['color']};object-fit:cover;background:#000;box-shadow:0 8px 24px {agent['color']}40;" width="80"/>
                <div>
                    <h4 style="font-family:var(--font-display);font-size:1.15rem;color:var(--text-primary);margin:0 0 6px 0;font-weight:700;">{agent['name']}</h4>
                    <div style="font-family:var(--font-theme-mono);font-size:0.8rem;color:{agent['color']};font-weight:600;">{agent['role']}</div>
                </div>
            </a>
            """
            grid.append(BeautifulSoup(card_html, 'html.parser'))

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
