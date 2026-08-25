from bs4 import BeautifulSoup
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

interface = soup.find('section', id='interface')
if interface:
    # Find the specific parent div by looking for the 💬 text
    for div in interface.find_all('div'):
        if div.text.strip() == "💬 1:1 & group agent chats":
            parent = div.parent
            # Just clear the parent and replace with accordion
            parent.clear()
            
            accordion_html = """
            <div class="feature-accordion-group" style="display:flex;flex-direction:column;gap:16px;margin-top:24px;width:100%;">
                
                <!-- Item 1 -->
                <details class="premium-accordion" open>
                    <summary>
                        <div class="acc-title"><i class="ph-fill ph-chats-circle" style="color:var(--cyan); font-size:1.4rem;"></i> 1:1 & Group Agent Chats</div>
                        <i class="ph-bold ph-caret-down acc-icon"></i>
                    </summary>
                    <div class="acc-content">
                        <p style="margin:0 0 16px 0; font-size: 1.05rem; line-height: 1.6;">Collaborate with the entire swarm in a unified thread. Mention specific agents to delegate sub-tasks, or let the Prime Architect automatically arbitrate the conversation and pass context between agents.</p>
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
                        <p style="margin:0 0 16px 0; font-size: 1.05rem; line-height: 1.6;">Record complex voice commands on the go. Zoth Studio automatically transcribes the audio locally, extracts action items, and assigns them directly to the correct specialized agents.</p>
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
                        <p style="margin:0 0 16px 0; font-size: 1.05rem; line-height: 1.6;">Watch the agents work in real-time. See sub-agent terminal outputs, exact file system edits, and internal reasoning processes exactly as they happen directly on your machine.</p>
                        <a href="/studio/" class="acc-cta">See the Operator Deck ➔</a>
                    </div>
                </details>
                
            </div>
            """
            parent.append(BeautifulSoup(accordion_html, 'html.parser'))
            print("Successfully replaced bullet points with accordion.")
            break

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
