from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find the single showcase video
video = soup.find('div', class_='showcase-media-card')

# Find the footer
footer = soup.find('footer', class_='site')

if video and footer:
    # Update its style to have 96px bottom margin
    style = video.get('style', '')
    style = style.replace('margin: 48px auto 0;', 'margin: 48px auto 96px;')
    video['style'] = style
    
    # Extract from current location
    video = video.extract()
    
    # Insert right before the footer
    footer.insert_before(video)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

