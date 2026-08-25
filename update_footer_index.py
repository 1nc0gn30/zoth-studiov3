from bs4 import BeautifulSoup

with open('public/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

footer = soup.find('footer', class_='site')
if footer:
    studio_col = footer.find('div', class_='foot-col')
    if studio_col:
        # Check if FAQ is already there
        if not studio_col.find('a', string='FAQ'):
            faq_link = soup.new_tag('a', href='/faq.html')
            faq_link.string = 'FAQ'
            studio_col.append(faq_link)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
print("Updated index.html footer")
