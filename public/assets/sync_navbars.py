import re
from pathlib import Path

public_dir = Path("/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public")

MASTER_HEADER = """    <header class="bar" id="topbar" role="banner">
      <a class="brand js-hub" href="/" aria-label="Zoth Studio Home">
        <img src="/assets/brand/zoth-golden-z-192.png" alt="Zoth Golden Z Emblem" width="36" height="36" style="border-radius:8px;box-shadow:0 0 12px rgba(251,191,36,0.35);" />
        <span><strong>Zoth</strong><small>by NullAI</small></span>
      </a>
      <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Toggle navigation menu">Menu</button>
      <nav class="menu" aria-label="Primary navigation" role="navigation">
        <a href="/#for-everyone" data-tip="Zero-Code Showcases — How non-tech founders, creators & teams depend on Zoth.">✦ For You</a>
        <a href="/zoth/" data-tip="Master Azoth — Sovereign Alchemical AI Core & Synthesis Engine.">Azoth</a>
        <a href="/agents/" data-tip="Sovereign Agent Pantheon — 21 AI nodes with live cognitive test sandboxes.">Agents</a>
        <a class="js-deck" href="http://127.0.0.1:8484/" data-tip="Local Sovereign Operator Deck (:8484) — Chat & tool execution running directly on this box.">Deck</a>
        <a href="/signal/" data-tip="Signal Swarm Bridge — Mobile phone command deck with live SSE streaming & voice memos.">Signal</a>
        <a href="/studio/" data-tip="Studio Directory — 14+ visual workstations, 3D arenas, and DAG composers.">Studio</a>
        <a href="/studio/swarm.html" data-tip="3D Swarm Command Arena — Real-time WebGL kinetic battle arena and orbital stations.">Swarm</a>
        <a href="/studio/consensus.html" data-tip="Consensus Battle Arena v2 — 3-Agent triangulation and Python AST synthesis.">Consensus</a>
        <a href="/social/" data-tip="Social Wall — Sovereign builder dispatches, community transmissions & viral showcase.">Social Wall</a>
        <a href="/comic/" data-tip="AZOTH Anime Comic Series — Season 1 Episode 1: Genesis in the Silicon Rain with full cinematic audio narration.">🎨 Comic</a>
        <a href="/pets/" data-tip="Companion Hangar — 16 autonomous spirits, task vibes, and CLI harnesses.">Pets</a>
        <a href="/pets/pet-studio.html" data-tip="3D Figurine Studio — GPU-accelerated volumetric figurines and task vibes.">💎 3D Studio</a>
        <a href="/vault/" data-tip="BYOK Vault — Argon2id encrypted local hardware key container with zero cloud KMS.">Vault</a>
        <a href="/adytum/" data-tip="Adytum Sanctum — Keys 0–21 architectural planning rite before building.">Adytum</a>
        <a class="js-docs" href="/docs/" data-tip="Master Operator Manual — Port topology, 1-click install scripts, and API guide.">Docs</a>
        <a class="git" href="https://github.com/NullAITech/zoth-studio" target="_blank" rel="noopener noreferrer" data-tip="GitHub Repository — Open source code, Debian packages, and release binaries.">GitHub</a>
      </nav>
    </header>

    <nav class="drawer" id="drawer" aria-label="Mobile navigation" role="navigation">
      <a href="/#for-everyone">✦ For You (No-Code)</a>
      <a href="/zoth/">Azoth</a>
      <a href="/comic/">🎨 Anime Comic (S01E01)</a>
      <a href="/agents/">Agents Pantheon</a>
      <a class="js-deck" href="http://127.0.0.1:8484/">Deck</a>
      <a href="/signal/">Signal Bridge</a>
      <a href="/studio/">Studio</a>
      <a href="/studio/swarm.html">Swarm</a>
      <a href="/studio/consensus.html">Consensus</a>
      <a href="/social/">Social Wall</a>
      <a href="/pets/">Pets</a>
      <a href="/pets/pet-studio.html">💎 3D Studio</a>
      <a href="/vault/">Vault</a>
      <a href="/adytum/">Adytum</a>
      <a class="js-docs" href="/docs/">Docs</a>
      <a class="sub" href="https://github.com/NullAITech/zoth-studio">GitHub</a>
      <a class="sub" href="/#install">Download</a>
    </nav>"""

print("Synchronizing unified master navbar across all public website pages...")
count = 0

for html_file in sorted(public_dir.rglob("*.html")):
    rel_path = str(html_file.relative_to(public_dir))
    if rel_path.startswith("previews/"):
        continue

    content = html_file.read_text(encoding="utf-8", errors="ignore")
    
    # 1. Ensure CSS & JS are in head / body
    if "/assets/zoth-nav.css" not in content:
        content = content.replace("</head>", '  <link rel="stylesheet" href="/assets/zoth-nav.css" />\n</head>')
    if "/assets/zoth-nav.js" not in content:
        content = content.replace("</body>", '  <script src="/assets/zoth-nav.js" defer></script>\n</body>')

    # 2. Check if page already has header or if we should replace/insert it
    if "<header" in content:
        content = re.sub(r"<header[\s\S]*?</header>", "<!-- HEADER_PLACEHOLDER -->", content, count=1)
        # Clean out any old separate drawer
        content = re.sub(r"<nav[^>]*id=[\"']drawer[\"'][\s\S]*?</nav>", "", content, count=1)
        content = re.sub(r"<nav[^>]*class=[\"']drawer[\"'][\s\S]*?</nav>", "", content, count=1)
        content = content.replace("<!-- HEADER_PLACEHOLDER -->", MASTER_HEADER)
    else:
        # Insert right after skip link or body start
        if 'class="skip' in content or 'skip-to-content' in content:
            content = re.sub(r'(<a[^>]*class=[\"\'](?:skip|skip-to-content)[\"\'][^>]*>[\s\S]*?</a>)', r'\1\n' + MASTER_HEADER, content, count=1)
        elif '<body' in content:
            content = re.sub(r'(<body[^>]*>)', r'\1\n' + MASTER_HEADER, content, count=1)

    html_file.write_text(content, encoding="utf-8")
    count += 1

print(f"Successfully synchronized master navbar across {count} pages!")
