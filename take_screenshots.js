const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  
  const shots = [
    { url: 'http://127.0.0.1:8088/', file: 'public/assets/generated/real_hero.jpg' },
    { url: 'http://127.0.0.1:8088/studio/', file: 'public/assets/generated/real_studio.jpg' },
    { url: 'http://127.0.0.1:8088/studio/site-generator.html', file: 'public/assets/generated/real_pipeline.jpg' },
    { url: 'http://127.0.0.1:8088/pets/', file: 'public/assets/generated/real_pets.jpg' },
    { url: 'http://127.0.0.1:8088/agents/athena.html', file: 'public/assets/generated/real_athena.jpg' },
    { url: 'http://127.0.0.1:8088/vault/', file: 'public/assets/generated/real_vault.jpg' }
  ];

  for (const shot of shots) {
    console.log(`Navigating to ${shot.url}...`);
    try {
      await page.goto(shot.url, { timeout: 10000, waitUntil: 'load' });
    } catch(e) {
      console.log('Goto timeout, continuing...');
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        const style = document.createElement('style');
        style.innerHTML = '::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);
      });
    } catch(e) {}

    await new Promise(r => setTimeout(r, 500));
    
    console.log(`Capturing ${shot.file}...`);
    await page.screenshot({ path: shot.file, type: 'jpeg', quality: 90 });
  }

  await browser.close();
  console.log('Screenshots complete.');
})();
