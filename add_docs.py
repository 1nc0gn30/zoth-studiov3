from bs4 import BeautifulSoup

with open('public/docs/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# We want to add "Methodology & The 4 Transmutation Rites"
# Let's insert it right after the header, as the first real section, or after Topology.
new_section_html = """
<section class="doc-section" id="methodology">
    <h2><span>⚡</span> Methodology: The 4 Transmutation Rites</h2>
    <p>
        Zoth transforms software development from confusing complexity into an alchemical purification process: dissolving errors, cross-checking truth with multiple AI models, and synthesizing hardened deterministic output directly on your machine.
    </p>
    
    <div style="margin-top:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:var(--docs-gold); margin-top:0; margin-bottom:8px;">1. Solve (Calcinatio)</h3>
            <p style="margin:0;">Break down ambiguity. The engine dissolves messy plain-English requests into exact, step-by-step AST blueprints with zero guesswork.</p>
        </div>
        
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:var(--cyan); margin-top:0; margin-bottom:8px;">2. Separate (Sublimatio)</h3>
            <p style="margin:0;">Multi-Model Consensus. Three top AI models cross-check each other simultaneously to catch hallucinations before any code runs.</p>
        </div>
        
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:#c084fc; margin-top:0; margin-bottom:8px;">3. Purify (Purificatio)</h3>
            <p style="margin:0;">Total Private Lockbox. Your files, passwords, and API keys stay 100% on your PC inside the Argon2id vault.</p>
        </div>
        
        <div style="background:var(--surface-highlight); padding:20px; border-radius:12px; border:1px solid var(--border-card);">
            <h3 style="color:#34d399; margin-top:0; margin-bottom:8px;">4. Coagulate (Coagulatio)</h3>
            <p style="margin:0;">Instant Synthesis. Output cleanly synthesized, ready-to-run apps verified with automated tests.</p>
        </div>
    </div>
</section>
"""
new_section = BeautifulSoup(new_section_html, 'html.parser')

topology = soup.find('section', id='topology')
if topology:
    topology.insert_before(new_section)

# Now, we need to update the navigation menu to include the new section.
nav = soup.find('nav', class_='docs-sidebar')
if nav:
    # Find the link to #topology
    topology_link = nav.find('a', href='#topology')
    if topology_link:
        new_link = soup.new_tag('a', href='#methodology')
        new_span = soup.new_tag('span')
        new_span.string = '⚡'
        new_link.append(new_span)
        new_link.append(' Methodology')
        topology_link.insert_before(new_link)

with open('public/docs/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
