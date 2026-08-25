import re

with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/index.html', 'r') as f:
    html = f.read()

def generate_showcase(image_path, audio_path, title):
    return f"""
    <div class="showcase-media-card zoth-showcase-element" style="position:relative; border-radius:16px; overflow:hidden; border:1px solid var(--border-card); box-shadow:0 12px 40px var(--shadow-color); margin: 48px auto 0; max-width: 900px;">
      <img src="{image_path}" alt="{title}" style="width:100%; display:block; object-fit:cover; aspect-ratio:16/9; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      <div style="position:absolute; bottom:16px; left:16px; right:16px; display:flex; align-items:center; gap:12px; background:rgba(0,0,0,0.65); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,0.15);">
        <button onclick="var a=this.nextElementSibling; if(a.paused){{a.play();this.innerHTML='⏸️';}}else{{a.pause();this.innerHTML='▶️';}}" style="background:var(--gold, #fbbf24); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.3); transition: transform 0.1s; color:#000;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">▶️</button>
        <audio loop src="{audio_path}" ontimeupdate="var m=Math.floor(this.currentTime/60); var s=Math.floor(this.currentTime%60); this.nextElementSibling.nextElementSibling.innerText = m+':'+(s<10?'0':'')+s;"></audio>
        <div style="color:#ffffff !important; font-family:var(--font-sans); font-size:0.9rem; font-weight:600; letter-spacing:0.02em;">{title}</div>
        <div style="margin-left:auto; color:var(--gold, #fbbf24) !important; font-size:0.8rem; font-family:var(--font-mono); font-weight:700;">0:00</div>
      </div>
    </div>
    """

# Insert Stage 0 (Hero)
hero_img = '/assets/mockups/01-hero.jpg'
hero_aud = '/assets/audio/music/willow-kayne-white-city.mp3'
# Place it right before the closing </div> of the hero's stage-scroll-panel
pattern_hero = r'(<div class="flex flex-col items-center justify-center gap-8 w-full"[^>]*>.*?(?=</div>\s*</div>\s*</section>))'
# It's better to find by exact strings
hero_marker = 'Launch Operator Deck'
hero_end = html.find('</a>', html.find(hero_marker)) + 4
html = html[:hero_end] + generate_showcase(hero_img, hero_aud, 'Zoth Operator Deck') + html[hero_end:]


# Insert Stage 1 (How it Works)
s1_img = '/assets/mockups/04-pipeline.jpg'
s1_aud = '/assets/audio/music/ivoxygen-skate.mp3'
s1_marker = '<div id="demoViewerContainer"'
s1_end = html.find('</div>', html.find(s1_marker)) + 6
html = html[:s1_end] + generate_showcase(s1_img, s1_aud, 'Pipeline Execution Lifecycle') + html[s1_end:]

# Insert Stage 2 (Phone/Workstation)
s2_img = '/assets/mockups/06-gallery.jpg'
s2_aud = '/assets/audio/music/willow-kayne-two-seater.mp3'
s2_marker = 'Live task progress</div>'
s2_end = html.find('</div>', html.find(s2_marker)) + 6
html = html[:s2_end] + generate_showcase(s2_img, s2_aud, 'Mobile Operations Terminal') + html[s2_end:]

# Insert Stage 3 (Agents)
s3_img = '/assets/mockups/05-pets.jpg'
s3_aud = '/assets/audio/music/lucidbeatz-drift.mp3'
s3_marker = 'View All 21 Agents ➔'
s3_end = html.find('</a>', html.find(s3_marker)) + 4
html = html[:s3_end] + generate_showcase(s3_img, s3_aud, 'Agent Asset Gallery') + html[s3_end:]

# Insert Stage 4 (Trust)
s4_img = '/assets/mockups/03-systems.jpg'
s4_aud = '/assets/audio/music/ivoxygen-ghost.mp3'
s4_marker = '<div class="trust-matrix-card"'
# Find the end of the flex container holding the trust cards
s4_start = html.find('<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-top:32px; text-align:left;">')
s4_end = html.find('</section>', s4_start)
# We can just put it right before the closing div of the panel
s4_panel_close = html.rfind('</div>', s4_start, s4_end)
html = html[:s4_panel_close] + generate_showcase(s4_img, s4_aud, 'Local System Architecture') + html[s4_panel_close:]

# Insert Stage 5 (Install)
s5_img = '/assets/mockups/08-runbook.jpg'
s5_aud = '/assets/audio/music/lucidbeatz-shadows.mp3'
s5_marker = 'curl -fsSL'
s5_end = html.find('</div>', html.find(s5_marker)) + 6
html = html[:s5_end] + generate_showcase(s5_img, s5_aud, 'Automated Provisioning Sequence') + html[s5_end:]


with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/index.html', 'w') as f:
    f.write(html)

print("Showcases added dynamically to all sections!")
