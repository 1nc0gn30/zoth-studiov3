import re

with open("showcase.html", "r") as f:
    content = f.read()

# 1. Remove <style>...</style> block
content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)

# 2. Fix the head part.
# Remove existing /assets/zoth-nav.css and /assets/zoth-showcase-poster.css
content = re.sub(r'<link href="/assets/zoth-nav\.css" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/assets/zoth-showcase-poster\.css[^"]*" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/assets/zoth-mobile\.css" rel="stylesheet"/>\n?', '', content)

# Remove hardcoded zoth-theme-light.css (it's injected by zoth-theme.js)
content = re.sub(r'<link href="/assets/zoth-theme-light\.css[^"]*" id="zoth-theme-light-css" rel="stylesheet"/>\n?', '', content)
content = re.sub(r'<link href="/styles\.css[^"]*" rel="stylesheet"/>\n?', '', content)

# Inject the right CSS after zoth-theme.js
replacement = """<script src="/assets/zoth-theme.js"></script>
<link href="/assets/zoth-nav.css" rel="stylesheet"/>
<link href="/assets/zoth-showcase-poster.css" rel="stylesheet"/>
<link href="/assets/zoth-mobile.css" rel="stylesheet"/>"""

content = content.replace('<script src="/assets/zoth-theme.js"></script>', replacement)

# 3. Add <main id="main-content"> right after the <nav> drawer or <header> ends.
# The drawer ends at </nav>\n<main id="main" role="main">
content = content.replace('<main id="main" role="main">', '<main id="main-content" role="main">')
# Update the skip link to point to main-content
content = content.replace('<a class="skip-link" href="#main">', '<a class="skip-link" href="#main-content">')

# 4. Add the footer before the script tags at the bottom.
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

# Let's find the closing </main> or where the scripts start.
content = content.replace('</body>', footer_html + '</body>')

with open("showcase.html", "w") as f:
    f.write(content)
