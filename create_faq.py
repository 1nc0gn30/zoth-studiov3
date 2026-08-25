from bs4 import BeautifulSoup
import copy

# Read index.html to use as a template
with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Update title
title = soup.find('title')
if title:
    title.string = "Zoth Studio — Frequently Asked Questions"

# Find main content area
main = soup.find('main')
if main:
    # Clear out the children of main
    main.clear()
    
    # Create the FAQ section HTML
    faq_html = """
    <div class="content" style="max-width: 800px; margin: 0 auto; padding: 120px 24px 60px;">
        <div class="hero-status-pill" style="margin: 0 auto 24px; padding: 6px 16px;">
            <span class="inline-flex items-center gap-2 font-bold" style="color:#34d399;">
                <span style="width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 10px #34d399"></span>
                <span class="magic-shiny-text">KNOWLEDGE BASE</span>
            </span>
        </div>
        
        <h1 class="hero-h1 m-0 font-extrabold tracking-tight text-4xl md:text-5xl" style="color:var(--text-primary, #ffffff); line-height:1.1; text-align:center; margin-bottom: 24px;">
            Frequently Asked Questions
        </h1>
        
        <p class="m-0 text-lg leading-relaxed" style="color:var(--text-subhead, #cbd5e1); text-align:center; margin-bottom: 64px;">
            Everything you need to know about Zoth Studio's local-first architecture, agent teams, and data privacy.
        </p>

        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">Does Zoth Studio run locally?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">Yes. The entire interface, swarm orchestrator, and agent telemetry run 100% locally on your machine via Docker or Python. You host the workspace, not us.</p>
            </div>

            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">What AI models does it use?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">Zoth uses a "Bring Your Own Key" (BYOK) model. You can connect local offline models (like Llama 3) via Ollama, or securely use API keys for Anthropic Claude, Google Gemini, xAI Grok, or DeepSeek.</p>
            </div>

            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">Is my data sent to the cloud?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">Your data never leaves your machine unless you explicitly configure an external API provider to process your prompts. There is zero telemetry, zero usage tracking, and zero "phone home" mechanisms built into Zoth.</p>
            </div>

            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">What are the 21 Agents?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">Zoth ships with a pre-configured swarm of 21 specialized agents. Instead of one generic AI, you get specialized experts—each with specific tools, system prompts, and roles (e.g., Website Builder, Security Reviewer, Project Planner). They can even talk to each other to solve complex tasks.</p>
            </div>

            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">Is it open source?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">Yes, Zoth Studio is free and open source. You can audit the entire codebase, modify the agents, add your own tools, and contribute on GitHub.</p>
            </div>

            <div class="faq-card" style="background: var(--surface-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="color: var(--text-primary); font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 12px;">How do I install it?</h3>
                <p style="color: var(--text-subhead); font-size: 1.05rem; line-height: 1.6;">You can launch Zoth in under a minute using our installation script, or by running the official Docker container. See the installation terminal on the home page for the exact one-line command.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 64px;">
            <a href="/" class="md3-btn-tonal" style="padding: 14px 28px; font-size: 1.1rem; display: inline-block; text-decoration: none;">
                <span>← Back to Home</span>
            </a>
        </div>
    </div>
    """
    
    faq_soup = BeautifulSoup(faq_html, 'html.parser')
    main.append(faq_soup)

# Remove the showcase video that was left before the footer
showcase = soup.find('div', class_='showcase-media-card')
if showcase:
    showcase.decompose()

# Add FAQ to footer
footer = soup.find('footer', class_='site')
if footer:
    studio_col = footer.find('div', class_='foot-col')
    if studio_col:
        # Check if FAQ is already there
        if not studio_col.find('a', string='FAQ'):
            faq_link = soup.new_tag('a', href='/faq.html')
            faq_link.string = 'FAQ'
            studio_col.append(faq_link)

# Save as public/faq.html
with open('public/faq.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("Created public/faq.html")

