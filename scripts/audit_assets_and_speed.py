import os
import re

public_dir = '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public'
html_files = []
for root, dirs, files in os.walk(public_dir):
    if any(ignore in root for ignore in ['templates-source', 'node_modules', 'dist', '.git', 'open-source-library', 'workspaces']):
        continue
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

missing_assets = []
total_checked = 0

for html_path in html_files:
    rel_html = os.path.relpath(html_path, public_dir)
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    urls = re.findall(r'(?:src|href|poster)=["\']([^"\']+)["\']', content)
    for url in urls:
        if url.startswith(('http://', 'https://', '//', 'data:', 'javascript:', 'mailto:', '#', 'tel:')):
            continue
        clean_url = url.split('?')[0].split('#')[0]
        if not clean_url or '${' in clean_url or '{{' in clean_url:
            continue
        total_checked += 1
        
        if clean_url.startswith('/'):
            target = os.path.join(public_dir, clean_url.lstrip('/'))
        else:
            target = os.path.join(os.path.dirname(html_path), clean_url)
        
        target = os.path.normpath(target)
        if not os.path.exists(target):
            if os.path.exists(target + '.html') or os.path.exists(os.path.join(target, 'index.html')):
                continue
            missing_assets.append((rel_html, url, target))

print(f"Production Scope: Checked {len(html_files)} HTML files and {total_checked} references.")
print(f"Missing asset references: {len(missing_assets)}")
for html_rel, url, target in missing_assets:
    print(f"  [{html_rel}] -> {url} (expected: {target})")
