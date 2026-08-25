import re

with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-demos.js', 'r') as f:
    content = f.read()

# We want to replace the `function renderDemo(key) { ... }` up to `window.selectUserGoal`
# Find the start of function renderDemo(key)
start_idx = content.find("function renderDemo(key) {")
end_idx = content.find("window.selectUserGoal = function(goalKey, btnElement) {")

if start_idx != -1 and end_idx != -1:
    new_func = """function renderDemo(key) {
  var data = DEMO_DATA[key] || DEMO_DATA.website;
  var container = document.getElementById("demoViewerContainer");
  if (!container) return;

  var agentsHtml = data.recommendedAgents.map(function(ag) {
    return \`
      <div class="md3-chip" style="display:inline-flex;align-items:center;gap:6px;background:var(--surface-elevated);border:1px solid var(--line);padding:6px 12px;border-radius:99px;font-size:0.85rem;">
        <span>\${ag.icon}</span>
        <strong style="color:var(--text-primary);">\${ag.name}</strong>
      </div>
    \`;
  }).join('');

  var html = \`
    <div class="magic-border-beam-card" style="background:var(--surface-card);border:1px solid var(--border-card);border-radius:16px;padding:40px 32px;text-align:center;box-shadow:0 12px 40px var(--shadow-color);">
      <div style="font-size:2.5rem;margin-bottom:16px;">\${data.icon}</div>
      <h3 style="color:var(--text-primary);font-size:1.5rem;margin-bottom:24px;margin-top:0;">\${data.title}</h3>
      
      <div style="margin-bottom:32px;">
        <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--muted);text-transform:uppercase;margin-bottom:16px;font-weight:700;">Recommended Team</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          \${agentsHtml}
        </div>
      </div>
      
      <a href="http://127.0.0.1:8484/" class="magic-shimmer-btn md3-btn-filled" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:99px;font-weight:600;text-decoration:none;color:var(--bg);background:var(--text-primary);">
        Try in Operator Deck
        <span style="font-size:1.1em;">➔</span>
      </a>
    </div>
  \`;

  container.innerHTML = html;
}

"""
    new_content = content[:start_idx] + new_func + content[end_idx:]
    with open('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-demos.js', 'w') as f:
        f.write(new_content)
    print("zoth-demos.js patched successfully.")
else:
    print("Could not find function indices.")
