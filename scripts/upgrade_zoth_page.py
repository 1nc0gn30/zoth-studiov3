import os

zoth_html_path = 'public/zoth/index.html'
with open(zoth_html_path, 'r', encoding='utf-8') as f:
    zoth_html = f.read()

SVG_BRAIN = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="5.5" r="2.2" fill="var(--cyan,#00f0ff)"/><circle cx="5.5" cy="13.5" r="2" fill="var(--magenta,#c084fc)"/><circle cx="18.5" cy="13.5" r="2" fill="var(--magenta,#c084fc)"/><path d="M12 7.7V11.5M12 11.5L7.5 12.5M12 11.5L16.5 12.5" stroke="currentColor" stroke-width="1.4"/></svg>'
SVG_LOCK = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 10V6.5A4 4 0 0 1 16 6.5V10" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/></svg>'
SVG_BOLT = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><path d="M13 2L4 13H11L9 22L20 10H13L16 2H13Z" fill="var(--gold,#fbbf24)" stroke="var(--gold,#fbbf24)" stroke-width="1.2"/></svg>'
SVG_TREE = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="5" r="2.5" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/><circle cx="6" cy="18" r="2.5" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/><circle cx="18" cy="18" r="2.5" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/><path d="M12 7.5V13M12 13L6 15.5M12 13L18 15.5" stroke="currentColor" stroke-width="1.4"/></svg>'
SVG_SCROLL = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5"/><polyline points="14 2 14 8 20 8" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/></svg>'
SVG_KEY = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="8" cy="12" r="4" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/><path d="M12 12H21M17 12V15M20 12V14" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/></svg>'
SVG_COPY = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/></svg>'
SVG_CRUCIBLE = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"><path d="M6 3h12M10 3v5l-4 9a2 2 0 0 0 1.8 2.8h8.4a2 2 0 0 0 1.8-2.8l-4-9V3" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/></svg>'
SVG_ORB = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="8" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="var(--gold,#fbbf24)"/></svg>'
SVG_CODE = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><polyline points="16 18 22 12 16 6" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/><polyline points="8 6 2 12 8 18" stroke="var(--gold,#fbbf24)" stroke-width="1.5"/></svg>'
SVG_SHIELD = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/></svg>'
SVG_ATOM = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="2" fill="var(--gold,#fbbf24)"/><ellipse cx="12" cy="12" rx="9" ry="3" stroke="var(--cyan,#00f0ff)" stroke-width="1.4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3" stroke="var(--cyan,#00f0ff)" stroke-width="1.4" transform="rotate(-30 12 12)"/></svg>'
SVG_RADIO = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="var(--cyan,#00f0ff)" stroke-width="1.8"/></svg>'
SVG_TERMINAL = '<svg class="btn-svg-icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 9l3 3-3 3M12 15h5" stroke="var(--cyan,#00f0ff)" stroke-width="1.5"/></svg>'

repls = [
    ('<span>🧠</span> Memory Safety vs JIT Velocity', SVG_BRAIN + ' Memory Safety vs JIT Velocity'),
    ('<span>🔒</span> Loopback Socket vs P2P Mesh', SVG_LOCK + ' Loopback Socket vs P2P Mesh'),
    ('<span>⚡</span> ACID Merkle-DAG vs Lockfree MVCC', SVG_BOLT + ' ACID Merkle-DAG vs Lockfree MVCC'),
    ('<span aria-hidden="true">⚡</span>\n        <span>Arbitrate AST Consensus &amp; Synthesize</span>', SVG_BOLT + ' <span>Arbitrate AST Consensus &amp; Synthesize</span>'),
    ('<span>🌳</span> AST Node Tree Inspector', SVG_TREE + ' AST Node Tree Inspector'),
    ('<span>📜</span> Sovereign Ratified Code', SVG_SCROLL + ' Sovereign Ratified Code'),
    ('<span>🔐</span> Cryptographic Merkle Verdict (JSON)', SVG_KEY + ' Cryptographic Merkle Verdict (JSON)'),
    ('<span>📋</span> Copy Code', SVG_COPY + ' Copy Code'),
    ('<span>📋</span> 1-Click Copy Merkle JSON', SVG_COPY + ' 1-Click Copy Merkle JSON'),
    ('<span aria-hidden="true">⚗️</span>', SVG_CRUCIBLE),
    ('<span>🔮</span> Ambiguous Prompt', SVG_ORB + ' Ambiguous Prompt'),
    ('<span>🐍</span> Un-typed Async Python', SVG_CODE + ' Un-typed Async Python'),
    ('<span>🛡️</span> Raw SQL Injection Risk', SVG_SHIELD + ' Raw SQL Injection Risk'),
    ('<span>⚛️</span> Broken State Hook', SVG_ATOM + ' Broken State Hook'),
    ('<span>📋</span> Copy', SVG_COPY + ' Copy'),
    ('<span aria-hidden="true">📻</span> Sovereign Phosphor Oscilloscope', SVG_RADIO + ' Sovereign Phosphor Oscilloscope'),
    ('<span>⚡</span> Simulate Stage Ingestion', SVG_BOLT + ' Simulate Stage Ingestion'),
    ('<span>📋</span> Copy LaTeX Spec', SVG_COPY + ' Copy LaTeX Spec'),
    ('<span>💻</span> Inspect AST Kernel', SVG_TERMINAL + ' Inspect AST Kernel'),
    ("simBtn.innerHTML = '<span>⚡</span> Simulate Stage Ingestion';", "simBtn.innerHTML = '" + SVG_BOLT + " Simulate Stage Ingestion';"),
    ("btn.innerHTML = `<span aria-hidden=\"true\">🔮</span><span>Synthesizing Dialectic Consensus...</span>`;", "btn.innerHTML = `" + SVG_ORB + " <span>Synthesizing Dialectic Consensus...</span>`;"),
    ("btn.innerHTML = `<span aria-hidden=\"true\">⚡</span><span>Arbitrate AST Consensus &amp; Synthesize</span>`;", "btn.innerHTML = `" + SVG_BOLT + " <span>Arbitrate AST Consensus &amp; Synthesize</span>`;"),
    ("btn.innerHTML = `<span aria-hidden=\"true\">⚗️</span><span>Dissolving &amp; Purifying AST...</span>`;", "btn.innerHTML = `" + SVG_CRUCIBLE + " <span>Dissolving &amp; Purifying AST...</span>`;"),
    ("[REACTOR] 432Hz HARMONIC FIELD ENGAGED 🔊", "[REACTOR] 432Hz HARMONIC FIELD ENGAGED [ACTIVE]"),
    ("[REACTOR] AUDIO FIELD DAMPENED 🔇", "[REACTOR] AUDIO FIELD DAMPENED [MUTED]"),
    ("<span>⚖️ Tiebreaker Engine</span>", "<span>Tiebreaker Engine</span>"),
    ("<span>⚒️ Transmutation Forge</span>", "<span>Transmutation Forge</span>"),
    ("<span>📐 7 Sacred Pillars</span>", "<span>7 Sacred Pillars</span>"),
    ('<span class="synth-title">🎵 432Hz Solfeggio Drone</span>', '<span class="synth-title">432Hz Solfeggio Drone</span>')
]

count = 0
for src, dst in repls:
    if src in zoth_html:
        zoth_html = zoth_html.replace(src, dst)
        count += 1
    else:
        print('NOT FOUND in zoth:', src[:50])

print(f'Applied {count}/{len(repls)} replacements to zoth/index.html')
with open(zoth_html_path, 'w', encoding='utf-8') as f:
    f.write(zoth_html)
