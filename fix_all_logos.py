import os
import glob
from bs4 import BeautifulSoup

count = 0
for filepath in glob.glob('public/**/*.html', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the image src for the brand logo inside <header> or <nav>
    # or inside <a class="brand ...">
    if 'class="brand' in content or "class='brand" in content:
        soup = BeautifulSoup(content, 'html.parser')
        changed = False
        
        brand_links = soup.find_all('a', class_=lambda c: c and 'brand' in c.split())
        for brand in brand_links:
            img = brand.find('img')
            if img:
                old_src = img.get('src', '')
                if old_src != '/assets/brand/zoth-golden-z-192.png':
                    img['src'] = '/assets/brand/zoth-golden-z-192.png'
                    
                    style = img.get('style', '')
                    if 'border-radius' not in style:
                        img['style'] = (style + " border-radius: 8px; box-shadow: 0 0 12px rgba(251,191,36,0.35);").strip()
                    changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            count += 1

print(f"Fixed logos in {count} files")
