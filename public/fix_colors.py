with open('showcase.html', 'r') as f:
    text = f.read()

text = text.replace('color: #fff;">60 FPS Procedural Shorts Engine', 'color: var(--text-primary, #fff);">60 FPS Procedural Shorts Engine')
text = text.replace('style="color: #fff; font-family:', 'style="color: var(--text-primary, #fff); font-family:')

with open('showcase.html', 'w') as f:
    f.write(text)
