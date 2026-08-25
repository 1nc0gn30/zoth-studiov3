import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove specific big comments
html = re.sub(r'<!-- ═══════════════════════════════════════════════════════════════\s*STAGE 1: HOW IT WORKS.*?═══════════════════════════════════════════════════════════════ -->', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- ═══════════════════════════════════════════════════════════════\s*STAGE 2: CLEAN PHONE & WORKSTATION INTERFACE.*?═══════════════════════════════════════════════════════════════ -->', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- ═══════════════════════════════════════════════════════════════\s*STAGE 4: AUDITABLE SOVEREIGNTY.*?═══════════════════════════════════════════════════════════════ -->', '', html, flags=re.DOTALL)

# Let's just fix up multiple newlines that might be left
html = re.sub(r'\n\s*\n\s*\n', '\n\n', html)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
