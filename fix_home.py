from bs4 import BeautifulSoup
import re

with open('public/index.html.bak', 'r', encoding='utf-8') as f:
    soup_bak = BeautifulSoup(f, 'html.parser')

# Find the 3 sections
how_it_works = soup_bak.find('section', id='how-it-works')
interface = soup_bak.find('section', id='interface')
trust = soup_bak.find('section', id='trust')

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

hero = soup.find('section', id='hero')
if hero:
    if trust:
        hero.insert_after(trust)
    if interface:
        hero.insert_after(interface)
    if how_it_works:
        hero.insert_after(how_it_works)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

