from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

interface = soup.find('section', id='interface')
if interface:
    vids = interface.find_all('div', class_='showcase-media-card')
    for v in vids:
        v.decompose()

trust = soup.find('section', id='trust')
if trust:
    vids = trust.find_all('div', class_='showcase-media-card')
    for v in vids:
        v.decompose()

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
