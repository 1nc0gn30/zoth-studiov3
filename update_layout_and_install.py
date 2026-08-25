from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find sections
agents = soup.find('section', id='agents')
trust = soup.find('section', id='trust')
install = soup.find('section', id='install')

# 1. Move #trust to be AFTER #agents
if trust and agents:
    # Remove trust from its current location
    trust.extract()
    # Insert it after agents
    agents.insert_after(trust)

# 2. Redesign #trust (Bento layout, extra CTA/info)
if trust:
    trust.clear()
    trust_html = """
    <div class="stage-scroll-panel" style="max-width: 1200px; margin: 0 auto; padding: 120px 20px;">
        <div class="section-header-centered" style="margin-bottom: 60px; text-align: center;">
            <div class="hero-status-pill" style="margin-bottom:16px;">
                <span style="color:#34d399;font-weight:700;letter-spacing:0.05em;"><i class="ph-fill ph-shield-check"></i> AUDITABLE DATA BOUNDARIES</span>
            </div>
            <h2 style="font-family:var(--font-display);font-size:clamp(32px, 5vw, 48px);font-weight:800;letter-spacing:-0.03em;margin-bottom:20px;color:var(--text-primary);">
                Engineered to keep sensitive work on your device.
            </h2>
            <p style="font-size:1.15rem;color:var(--text-subhead);max-width:600px;margin:0 auto;line-height:1.6;">
                Complete data sovereignty means your source code, private documents, and API keys <mark class="z-highlight cyan">never leave your machine</mark> unless explicitly requested.
            </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px;">
            <!-- Card 1 -->
            <div style="background:var(--surface-card); border:1px solid rgba(52,211,153,0.3); border-radius:24px; padding:40px; position:relative; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1); transition:transform 0.3s ease;">
                <div style="position:absolute; top:-20px; right:-20px; width:150px; height:150px; background:radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>
                <div style="font-size:3rem; color:#34d399; margin-bottom:24px;"><i class="ph-duotone ph-hard-drives"></i></div>
                <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--text-primary);margin:0 0 16px 0;font-weight:700;">Always Local Workspace</h3>
                <p style="color:var(--text-subhead);font-size:1rem;line-height:1.6;margin:0 0 24px 0;">All agent planning, reasoning, vector memory, and document parsing happens entirely on your local CPU or GPU. Zero cloud dependencies for core engine tasks.</p>
                <div style="font-family:var(--font-theme-mono);font-size:0.8rem;color:#34d399;font-weight:600;">STATUS: 127.0.0.1 ISOLATED</div>
            </div>
            
            <!-- Card 2 -->
            <div style="background:var(--surface-card); border:1px solid rgba(0,240,255,0.3); border-radius:24px; padding:40px; position:relative; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1); transition:transform 0.3s ease;">
                <div style="position:absolute; top:-20px; right:-20px; width:150px; height:150px; background:radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>
                <div style="font-size:3rem; color:var(--cyan); margin-bottom:24px;"><i class="ph-duotone ph-plugs-connected"></i></div>
                <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--text-primary);margin:0 0 16px 0;font-weight:700;">Optional External LLMs</h3>
                <p style="color:var(--text-subhead);font-size:1rem;line-height:1.6;margin:0 0 24px 0;">Want to use Claude 3.5, GPT-4, or Grok? You can bring your own API keys. Traffic is sent securely directly from your machine to their APIs—no middleman.</p>
                <div style="font-family:var(--font-theme-mono);font-size:0.8rem;color:var(--cyan);font-weight:600;">STATUS: BRING YOUR OWN KEYS</div>
            </div>
            
            <!-- Card 3 -->
            <div style="background:var(--surface-card); border:1px solid rgba(251,191,36,0.3); border-radius:24px; padding:40px; position:relative; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1); transition:transform 0.3s ease;">
                <div style="position:absolute; top:-20px; right:-20px; width:150px; height:150px; background:radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>
                <div style="font-size:3rem; color:var(--gold); margin-bottom:24px;"><i class="ph-duotone ph-magnifying-glass"></i></div>
                <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--text-primary);margin:0 0 16px 0;font-weight:700;">Verify It Yourself</h3>
                <p style="color:var(--text-subhead);font-size:1rem;line-height:1.6;margin:0 0 24px 0;">Zoth Studio is built as an open, auditable ecosystem. We have <mark class="z-highlight gold">zero telemetry</mark>. You can literally inspect the network tab and see exactly where data goes.</p>
                <div style="font-family:var(--font-theme-mono);font-size:0.8rem;color:var(--gold);font-weight:600;">STATUS: ZERO TELEMETRY</div>
            </div>
        </div>
    </div>
    """
    trust.append(BeautifulSoup(trust_html, 'html.parser'))

# 3. Redesign #install (Breathe more, separate Mac/Linux, 2026 aesthetics)
if install:
    install.clear()
    install_html = """
    <div style="padding: 160px 20px; position:relative; overflow:hidden;">
        <!-- Background Ambient Glow -->
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:80vw; height:80vh; background:radial-gradient(circle, rgba(0,240,255,0.05) 0%, rgba(52,211,153,0.03) 40%, transparent 70%); z-index:0; filter:blur(60px); pointer-events:none;"></div>
        
        <div style="position:relative; z-index:1; max-width:900px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center;">
            <div class="hero-status-pill" style="margin-bottom:24px;">
                <span style="color:var(--text-primary);font-weight:700;letter-spacing:0.05em;"><i class="ph-fill ph-download-simple" style="color:var(--cyan)"></i> 1-CLICK LOCAL DEPLOYMENT</span>
            </div>
            <h2 style="font-family:var(--font-display);font-size:clamp(40px, 6vw, 64px);font-weight:900;letter-spacing:-0.04em;margin:0 0 24px 0;color:var(--text-primary);">
                Get Zoth Studio
            </h2>
            <p style="font-size:1.25rem;color:var(--text-subhead);max-width:500px;margin:0 0 48px 0;line-height:1.6;">
                One command. Runs entirely on your machine in under a minute. No cloud sign-ups.
            </p>
            
            <!-- OS Selection Tabs -->
            <div aria-label="Installation operating system packages" role="tablist" style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:40px; justify-content:center;">
                <button aria-controls="cmd" aria-selected="true" class="btn btn-off os on" data-cmd="curl -fsSL https://zoth.nullai.tech/install.sh | bash" role="tab" style="display:inline-flex; align-items:center; gap:8px; padding: 14px 24px; font-weight: 700; font-size: 1rem; border-radius:100px; transition:all 0.3s;" type="button">
                    <i class="ph-fill ph-apple-logo" style="font-size: 1.4rem;"></i> macOS
                </button>
                <button aria-controls="cmd" aria-selected="false" class="btn btn-off os" data-cmd="curl -fsSL https://zoth.nullai.tech/install.sh | bash" role="tab" style="display:inline-flex; align-items:center; gap:8px; padding: 14px 24px; font-weight: 700; font-size: 1rem; border-radius:100px; transition:all 0.3s;" type="button">
                    <i class="ph-fill ph-linux-logo" style="font-size: 1.4rem;"></i> Linux
                </button>
                <button aria-controls="cmd" aria-selected="false" class="btn btn-off os" data-cmd="irm https://zoth.nullai.tech/install.ps1 | iex" role="tab" style="display:inline-flex; align-items:center; gap:8px; padding: 14px 24px; font-weight: 700; font-size: 1rem; border-radius:100px; transition:all 0.3s;" type="button">
                    <i class="ph-fill ph-windows-logo" style="font-size: 1.4rem;"></i> Windows
                </button>
                <button aria-controls="cmd" aria-selected="false" class="btn btn-off os" data-cmd="docker run -d -p 8484:8484 -p 8088:8088 nullai/zoth-studio" role="tab" style="display:inline-flex; align-items:center; gap:8px; padding: 14px 24px; font-weight: 700; font-size: 1rem; border-radius:100px; transition:all 0.3s;" type="button">
                    <img alt="Docker" height="22" src="/assets/logos/docker.svg" width="22"/> Docker
                </button>
            </div>
            
            <!-- Glassmorphism Terminal -->
            <div class="terminal" style="background:rgba(5, 6, 10, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border:1px solid rgba(255,255,255,0.1); border-top:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:32px 40px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px; box-shadow:0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); width:100%; margin-bottom:48px;">
                <code id="cmd" style="font-family:var(--font-theme-mono); font-size:1.1rem; color:#34d399; word-break:break-all; text-align:left; flex:1; min-width:280px; letter-spacing: -0.02em;">curl -fsSL https://zoth.nullai.tech/install.sh | bash</code>
                <button aria-label="Copy installation command to clipboard" class="btn btn-on" id="copy" style="font-size:0.95rem; font-weight:700; padding:14px 24px; border-radius:100px; box-shadow:0 8px 20px rgba(0,240,255,0.2);" type="button">Copy Command <i class="ph-bold ph-copy" style="margin-left:6px;"></i></button>
            </div>
            
            <div style="display:flex; align-items:center; gap:24px; font-size:0.95rem; color:var(--text-subhead); font-weight:600; flex-wrap:wrap; justify-content:center;">
                <span style="display:flex; align-items:center; gap:6px;"><i class="ph-bold ph-check-circle" style="color:#34d399;"></i> Free & Open Source</span>
                <span style="display:flex; align-items:center; gap:6px;"><i class="ph-bold ph-wifi-slash" style="color:#34d399;"></i> Works offline</span>
                <a href="https://github.com/NullAITech/zoth-studio" target="_blank" rel="noopener" style="color:var(--text-primary); text-decoration:none; display:flex; align-items:center; gap:6px;"><i class="ph-bold ph-github-logo"></i> GitHub Repository ↗</a>
            </div>
        </div>
    </div>
    """
    install.append(BeautifulSoup(install_html, 'html.parser'))

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
