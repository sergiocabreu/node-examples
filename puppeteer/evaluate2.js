const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    let result = document.body;
    console.log('teste', result);
    return {
      "teste": result
    };
  });

  console.log('Dimensions:', dimensions);

  // await browser.close();
})();