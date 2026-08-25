from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# 1. Update the Phone Mockup with the Image->Video transition
phone_content = soup.find('div', class_='figma-phone-content')
if phone_content:
    # Look for the first row (the top bar)
    top_bar = phone_content.find('div', style=re.compile(r'display: flex; justify-content: space-between;'))
    if top_bar:
        # Create media container
        media_html = """
        <div class="phone-media-container" style="width:100%; height:180px; position:relative; overflow:hidden; border-radius:16px; margin-bottom:16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
           <img src="/assets/agents/azoth.jpg" alt="Master Azoth" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:2; animation: fade-to-video 10s infinite;" />
           <video src="/assets/generated/videos/video_studio.mp4" autoplay loop muted playsinline style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1;"></video>
           <div style="position:absolute; bottom:8px; left:8px; z-index:3; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; color: #fff; font-family: var(--font-theme-mono);">ZOTH SIGNAL LIVE</div>
        </div>
        """
        media_tag = BeautifulSoup(media_html, 'html.parser')
        top_bar.insert_after(media_tag)

# 2. Enhance Install Section
install = soup.find('section', id='install')
if install:
    tablist = install.find('div', role='tablist')
    if tablist:
        tablist['style'] = "display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px; justify-content: center;"
        
        buttons = tablist.find_all('button', class_='os')
        for btn in buttons:
            btn['style'] = "display:inline-flex; align-items:center; gap:8px; padding: 12px 20px; font-weight: 600; font-size: 0.9rem;"
            text = btn.text.strip()
            btn.clear()
            
            if "Linux" in text:
                btn.append(BeautifulSoup("""<i class="ph-fill ph-linux-logo" style="font-size: 1.3rem;"></i> <i class="ph-fill ph-apple-logo" style="font-size: 1.3rem;"></i> Linux / macOS""", 'html.parser'))
            elif "Windows" in text:
                btn.append(BeautifulSoup("""<i class="ph-fill ph-windows-logo" style="font-size: 1.3rem;"></i> Windows""", 'html.parser'))
            elif "Docker" in text:
                btn.append(BeautifulSoup("""<img src="/assets/logos/docker.svg" width="20" height="20" alt="Docker" /> Docker""", 'html.parser'))

    # Enhance terminal box
    terminal = install.find('div', class_='terminal')
    if terminal:
        terminal['style'] = "background:#05060a; border:1px solid var(--border-card); border-radius:16px; padding:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; box-shadow:0 12px 40px rgba(0,0,0,0.3); margin-bottom:24px; max-width: 800px; margin-left: auto; margin-right: auto;"
        
    # Center section header
    split = install.find('div', class_='section-header-split')
    if split:
        split['style'] = "display:flex; flex-direction:column; align-items:center; text-align:center; gap: 16px; margin-bottom: 32px;"
        split['class'] = "" # Remove split class to force center

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
