import re

# Fix README.md (the main one tracked in git, which is core-app/README.md)
with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace `../docs-and-architecture/` with `docs-and-architecture/`
content = content.replace('../docs-and-architecture/', 'docs-and-architecture/')

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
