import re

with open("public/index.html", "r") as f:
    content = f.read()

def replace_overlay(match):
    prefix = match.group(1) 
    
    new_button = """      <div style="position:absolute; bottom:24px; right:24px; z-index:10; display:flex; align-items:center; justify-content:center;">
        <button onclick="var v=this.parentElement.previousElementSibling; if(v.muted){v.muted=false;v.currentTime=0;this.innerHTML='⏸️';this.style.animation='none';}else{v.muted=true;this.innerHTML='▶️';this.style.animation='pulse-glow 2s infinite';}" style="background:var(--gold, #fbbf24); border:none; width:54px; height:54px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 6px 20px rgba(0,0,0,0.5); color:#000; transition: transform 0.2s; animation: pulse-glow 2s infinite;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Toggle Audio">▶️</button>
      </div>"""
    
    return prefix + new_button + "\n    </div>"

# The div to replace looks like this:
# <div style="position:absolute; bottom:16px; left:16px; right:16px; ..."> ... </div>
# And ends before the closing </div> of the showcase-media-card

pattern = re.compile(r'(<div class="showcase-media-card zoth-showcase-element"[^>]*>\s*<video[^>]*></video>\s*)<div style="position:absolute; bottom:16px; left:16px; right:16px;.*?</button>.*?</div>\s*</div>\s*</div>', re.DOTALL)

new_content = pattern.sub(replace_overlay, content)

print(f"Replaced {len(pattern.findall(content))} overlays.")

with open("public/index.html", "w") as f:
    f.write(new_content)

