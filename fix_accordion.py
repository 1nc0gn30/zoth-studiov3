from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find the #interface section
interface = soup.find('section', id='interface')
if interface:
    # Find the div containing the 3 items
    # We can look for the div that has "1:1 & group agent chats"
    target_div = None
    for div in interface.find_all('div'):
        if "1:1 & group agent chats" in div.text and "Voice call transcripts" in div.text:
            target_div = div
            break

    if target_div:
        # We want the container of these 3 divs. The target_div might be the container itself.
        # Let's check its style.
        if 'display:flex;flex-direction:column;gap:16px;margin-top:8px;' in target_div.get('style', '').replace(' ', ''):
            # This is the container!
            target_div.clear()
            
            accordion_html = """
            <div class="feature-accordion-group" style="display:flex;flex-direction:column;gap:16px;margin-top:24px;width:100%;">
                
                <!-- Item 1 -->
                <details class="premium-accordion" open>
                    <summary>
                        <div class="acc-title"><i class="ph-fill ph-chats-circle" style="color:var(--cyan); font-size:1.4rem;"></i> 1:1 & Group Agent Chats</div>
                        <i class="ph-bold ph-caret-down acc-icon"></i>
                    </summary>
                    <div class="acc-content">
                        <p style="margin:0 0 16px 0;">Collaborate with the entire swarm in a unified thread. Mention specific agents to delegate sub-tasks, or let the Prime Architect automatically arbitrate the conversation and pass context between agents.</p>
                        <a href="/studio/swarm.html" class="acc-cta">Explore Swarm Protocol ➔</a>
                    </div>
                </details>
                
                <!-- Item 2 -->
                <details class="premium-accordion">
                    <summary>
                        <div class="acc-title"><i class="ph-fill ph-microphone-stage" style="color:var(--gold); font-size:1.4rem;"></i> Voice Call Transcripts</div>
                        <i class="ph-bold ph-caret-down acc-icon"></i>
                    </summary>
                    <div class="acc-content">
                        <p style="margin:0 0 16px 0;">Record complex voice commands on the go. Zoth Studio automatically transcribes the audio locally, extracts action items, and assigns them directly to the correct specialized agents.</p>
                        <a href="/docs/#companion-spirits" class="acc-cta">View Audio DSP Specs ➔</a>
                    </div>
                </details>
                
                <!-- Item 3 -->
                <details class="premium-accordion">
                    <summary>
                        <div class="acc-title"><i class="ph-fill ph-target" style="color:#f43f5e; font-size:1.4rem;"></i> Live Task Progress</div>
                        <i class="ph-bold ph-caret-down acc-icon"></i>
                    </summary>
                    <div class="acc-content">
                        <p style="margin:0 0 16px 0;">Watch the agents work in real-time. See sub-agent terminal outputs, exact file system edits, and internal reasoning processes exactly as they happen directly on your machine.</p>
                        <a href="/studio/" class="acc-cta">See the Operator Deck ➔</a>
                    </div>
                </details>
                
            </div>
            """
            target_div.replace_with(BeautifulSoup(accordion_html, 'html.parser'))
            print("Successfully replaced bullet points with accordion.")

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
