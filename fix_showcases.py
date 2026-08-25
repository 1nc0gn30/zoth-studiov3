import re

with open("public/index.html", "r") as f:
    content = f.read()

# 1. Move any showcase-media-card that's after </html> to right before <footer>
html_end_idx = content.find("</html>")
if html_end_idx != -1:
    after_html = content[html_end_idx + 7:]
    # Check if there's a showcase card in after_html
    if 'showcase-media-card' in after_html:
        print("Found stray showcase card after </html>. Moving it.")
        
        # Extract everything after </html>
        stray_content = after_html.strip()
        
        # Remove it from the end of content
        content = content[:html_end_idx + 7] + "\n"
        
        # Insert stray_content right before <footer class="site">
        footer_idx = content.find('<footer class="site">')
        if footer_idx != -1:
            # We want to put it in a container maybe? Or just right before footer.
            # The footer is usually after </main>. Let's put it right before footer.
            content = content[:footer_idx] + "\n" + stray_content + "\n" + content[footer_idx:]
        else:
            print("Warning: could not find footer")

# 2. Update the overlays in all showcase-media-cards
# Currently it looks like:
# <div style="position:absolute; bottom:16px; left:16px; right:16px; display:flex; align-items:center; gap:12px; background:rgba(0,0,0,0.65); ...">
#   <button ...>▶️</button>
#   <div ...>Text</div>
#   <div ...>LIVE SHOWCASE</div>
# </div>

# We will replace that whole inner div with just a pulsing play button.

# Regex to find the showcase card and its inner div.
# A showcase media card is `<div class="showcase-media-card ...">`
# Followed by `<video ...></video>`
# Followed by `<div style="position:absolute; bottom:16px; ..."> ... </div>` (can be multi-line)
# Followed by `</div>`

def replace_overlay(match):
    prefix = match.group(1) # '<div class="showcase-media-card ...">\n      <video ...></video>\n'
    overlay = match.group(2)
    
    # We want a pulsing play button.
    # Let's put it bottom-right, floating.
    # Or center? "just play button that pulses"
    # Let's use a simple pulsing CSS animation inline or via class, but inline is easier here.
    # Wait, we can reuse the button logic but style it nicely.
    
    new_button = """      <div style="position:absolute; bottom:20px; right:20px; z-index:10;">
        <button onclick="var v=this.parentElement.previousElementSibling; if(v.muted){v.muted=false;v.currentTime=0;this.innerHTML='⏸️';this.style.animation='none';}else{v.muted=true;this.innerHTML='▶️';this.style.animation='pulse-glow 2s infinite';}" style="background:var(--gold, #fbbf24); border:none; width:48px; height:48px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 15px rgba(0,0,0,0.4); color:#000; animation: pulse-glow 2s infinite;" title="Toggle Audio">▶️</button>
      </div>"""
    
    return prefix + new_button + "\n    </div>"

# First, we need to add the keyframes for pulse-glow to the document if not present
if "pulse-glow" not in content:
    style_idx = content.find("</style>")
    if style_idx != -1:
        pulse_keyframes = "\n      @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(251, 191, 36, 0); } 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); } }\n"
        content = content[:style_idx] + pulse_keyframes + content[style_idx:]

pattern = re.compile(r'(<div class="showcase-media-card zoth-showcase-element"[^>]*>\s*<video[^>]*></video>\s*)<div style="position:absolute; bottom:16px;[^>]*>.*?(?=</div>\s*</div>)</div>\s*</div>', re.DOTALL)

# Let's do a more robust replacement using beautifulsoup if regex is brittle, 
# but regex is fine if it matches exactly. Let's see how it looks.

with open("public/index.html", "w") as f:
    f.write(content)

print("Moved stray video. Now replacing overlays...")
