import re

# 1. Add hero padding responsive class and Phone Frame CSS to zoth-ui-overhaul.css
css_addition = """
/* Responsive Hero Padding */
.hero-content-pad {
    padding: 120px 20px;
}
@media (max-width: 768px) {
    .hero-content-pad {
        padding: 50px 20px 20px !important;
    }
}

/* Figma Phone Frame */
.figma-phone-frame {
    border: 14px solid #1e1e1e;
    border-radius: 44px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 9 / 19;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6), inset 0 0 0 2px #333, 0 0 0 2px rgba(255,255,255,0.05);
    position: relative;
    background: var(--bg);
}
[data-theme="light"] .figma-phone-frame {
    border: 14px solid #e2e8f0;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), inset 0 0 0 2px #cbd5e1, 0 0 0 2px rgba(0,0,0,0.05);
}
.figma-phone-notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 30px;
    background: #1e1e1e;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 10;
}
[data-theme="light"] .figma-phone-notch {
    background: #e2e8f0;
}

/* Phosphor Icons Fixes */
i.ph, i.ph-fill, i.ph-bold, i.ph-duotone {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
"""

with open('public/assets/zoth-ui-overhaul.css', 'a', encoding='utf-8') as f:
    f.write(css_addition)

# 2. Change font variables in zoth-theme.css
with open('public/assets/zoth-theme.css', 'r', encoding='utf-8') as f:
    theme_css = f.read()

# Replace fonts
theme_css = re.sub(r'--font-display:.*?;', "--font-display: 'Space Grotesk', system-ui, sans-serif;", theme_css)
theme_css = re.sub(r'--font-theme-body:.*?;', "--font-theme-body: 'Plus Jakarta Sans', system-ui, sans-serif;", theme_css)
theme_css = re.sub(r'--font-theme-mono:.*?;', "--font-theme-mono: 'JetBrains Mono', ui-monospace, monospace;", theme_css)

with open('public/assets/zoth-theme.css', 'w', encoding='utf-8') as f:
    f.write(theme_css)

