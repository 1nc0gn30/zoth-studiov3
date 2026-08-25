import re

with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/index.html', 'r') as f:
    html = f.read()

def get_video_card(video_path, title):
    return f"""
    <div class="showcase-media-card zoth-showcase-element" style="position:relative; border-radius:16px; overflow:hidden; border:1px solid var(--border-card); box-shadow:0 12px 40px var(--shadow-color); margin: 48px auto 0; max-width: 900px;">
      <video src="{video_path}" autoplay loop muted playsinline style="width:100%; display:block; object-fit:cover; aspect-ratio:16/9; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"></video>
      <div style="position:absolute; bottom:16px; left:16px; right:16px; display:flex; align-items:center; gap:12px; background:rgba(0,0,0,0.65); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,0.15);">
        <button onclick="var v=this.parentElement.previousElementSibling; if(v.muted){{v.muted=false;v.currentTime=0;this.innerHTML='⏸️';}}else{{v.muted=true;this.innerHTML='▶️';}}" style="background:var(--gold, #fbbf24); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.3); transition: transform 0.1s; color:#000;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'" title="Unmute Audio">▶️</button>
        <div style="color:#ffffff !important; font-family:var(--font-sans); font-size:0.9rem; font-weight:600; letter-spacing:0.02em;">{title}</div>
        <div style="margin-left:auto; color:var(--gold, #fbbf24) !important; font-size:0.8rem; font-family:var(--font-mono); font-weight:700;">LIVE SHOWCASE</div>
      </div>
    </div>
    """

# We need to replace the old .showcase-media-card sections with the new ones.
# Because the old ones take up multiple lines, regex is best.
pattern = re.compile(r'<div class="showcase-media-card zoth-showcase-element".*?</div>\s*</div>\s*</div>', re.DOTALL)

# Find all matches
matches = list(pattern.finditer(html))
print(f"Found {len(matches)} showcase cards to replace.")

if len(matches) == 6:
    new_html = html
    
    videos = [
        ('/assets/generated/videos/video_hero.mp4', 'Zoth Operator Deck'),
        ('/assets/generated/videos/video_pipeline.mp4', 'Pipeline Execution Lifecycle'),
        ('/assets/generated/videos/video_studio.mp4', 'Mobile Operations Terminal'),
        ('/assets/generated/videos/video_pets.mp4', 'Agent Asset Gallery'),
        ('/assets/generated/videos/video_vault.mp4', 'Local System Architecture'),
        ('/assets/generated/videos/video_athena.mp4', 'Automated Provisioning Sequence')
    ]
    
    for i in reversed(range(6)):
        match = matches[i]
        new_html = new_html[:match.start()] + get_video_card(videos[i][0], videos[i][1]) + new_html[match.end():]

    with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/index.html', 'w') as f:
        f.write(new_html)
    print("Replaced successfully!")
else:
    print("Did not find exactly 6 matches. Manual replace needed.")

