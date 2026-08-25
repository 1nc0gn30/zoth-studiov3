const { firefox } = require('playwright');
(async () => {
  try {
    console.log('Launching firefox...');
    const browser = await firefox.launch();
    console.log('Browser launched');
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    console.log('Navigating...');
    await page.goto('http://127.0.0.1:8088/');
    console.log('Waiting...');
    await page.waitForTimeout(2000);
    console.log('Capturing...');
    await page.screenshot({ path: 'test_ff.jpg' });
    console.log('Done');
    await browser.close();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
