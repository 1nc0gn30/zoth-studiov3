import os
from bs4 import BeautifulSoup

count = 0
for root, _, files in os.walk('public'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Quick check to speed up processing
            if 'class="brand js-hub"' in content or 'class="brand"' in content:
                try:
                    soup = BeautifulSoup(content, 'html.parser')
                    changed = False
                    
                    # 1. Look for navbar/header
                    headers = soup.find_all(['header', 'nav'])
                    for header in headers:
                        brand_links = header.find_all('a', class_=lambda c: c and 'brand' in c)
                        for brand in brand_links:
                            img = brand.find('img')
                            if img:
                                old_src = img.get('src', '')
                                if old_src != '/assets/brand/zoth-golden-z-192.png':
                                    img['src'] = '/assets/brand/zoth-golden-z-192.png'
                                    
                                    # Ensure it has a nice border radius if it's square
                                    style = img.get('style', '')
                                    if 'border-radius' not in style:
                                        img['style'] = (style + " border-radius: 8px; box-shadow: 0 0 10px rgba(251,191,36,0.2);").strip()
                                    changed = True
                    
                    if changed:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(str(soup))
                        count += 1
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
print(f"Updated {count} files.")
