import re

with open("showcase.html", "r") as f:
    content = f.read()

# Extract <style>
style_match = re.search(r'<style>(.*?)</style>', content, flags=re.DOTALL)
if style_match:
    styles = style_match.group(1)
    
    # Let's remove the :root variables since zoth-theme.css provides them
    styles = re.sub(r':root\s*\{[^}]*\}', '', styles, flags=re.DOTALL)
    
    # Remove skip link duplicate since it's in zoth-showcase-poster.css
    styles = re.sub(r'\.skip-to-content.*?\}[^}]*\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'\.skip-link.*?\}[^}]*\}', '', styles, flags=re.DOTALL)
    
    # Remove old hero stuff if any
    styles = re.sub(r'\.showcase-hero-wrap.*?\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'\.showcase-hero-grid.*?\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'@media\s*\([^{]+\)\s*\{\s*\.showcase-hero-grid.*?\}\s*\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'\.showcase-hero\s+h1.*?\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'\.showcase-hero\s+p\.lede.*?\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'body\s*\{[^}]*\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'html\s*\{[^}]*\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'\*,\s*\*\:\:before,\s*\*\:\:after\s*\{[^}]*\}', '', styles, flags=re.DOTALL)
    styles = re.sub(r'button,\s*a,\s*input,\s*select,\s*textarea,\s*\[role="button"\],\s*\[role="tab"\]\s*\{[^}]*\}', '', styles, flags=re.DOTALL)

    with open("assets/zoth-showcase-poster.css", "a") as css_f:
        css_f.write("\n/* Transferred from showcase.html */\n" + styles)

# Now apply HTML cleanup
content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)

# Fix head links
content = re.sub(r'<link href="/assets/zoth-nav\.css" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/assets/zoth-showcase-poster\.css[^"]*" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/assets/zoth-mobile\.css" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/assets/zoth-theme-light\.css[^"]*" id="zoth-theme-light-css" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/styles\.css[^"]*" rel="stylesheet"/>\n?', '', content)

replacement = """<script src="/assets/zoth-theme.js"></script>
<link href="/assets/zoth-nav.css" rel="stylesheet"/>
<link href="/assets/zoth-showcase-poster.css" rel="stylesheet"/>
<link href="/assets/zoth-mobile.css" rel="stylesheet"/>"""
content = content.replace('<script src="/assets/zoth-theme.js"></script>', replacement)

content = content.replace('<main id="main" role="main">', '<main id="main-content" role="main">')
content = content.replace('<a class="skip-link" href="#main">', '<a class="skip-link" href="#main-content">')

footer_html = """<footer class="site">
<span>Master Azoth · Sovereign AI Operator · Zoth Studio</span>
<span>
<a class="js-hub" href="/">Hub</a> · 
<a href="/agents/">Pantheon</a> · 
<a href="/studio/">Studio</a> · 
<a href="/vault/">Vault</a> · 
<a href="/pets/">Pets</a> · 
<a href="/docs/">Docs</a> · 
<a href="/zoth/">Azoth</a> · 
<a class="js-deck" href="http://127.0.0.1:8484/">Deck :8484</a>
</span>
</footer>
"""
content = content.replace('</body>', footer_html + '</body>')

# Colors
content = content.replace('color: #fff;">60 FPS Procedural Shorts Engine', 'color: var(--text-primary, #fff);">60 FPS Procedural Shorts Engine')
content = content.replace('style="color: #fff; font-family:', 'style="color: var(--text-primary, #fff); font-family:')

with open("showcase.html", "w") as f:
    f.write(content)
