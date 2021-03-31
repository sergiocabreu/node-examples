const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
	let url = 'https://coronavirus.fortaleza.ce.gov.br/listaVacinacao.html';
	await page.goto(url);

  await page.waitForTimeout(5000);
  const result = await page.evaluate(() => {
    //let resultado =  Array.from(document.querySelectorAll('ul#boletinsAnteriores > li > a'))[0];
    //return {'titulo': resultado?.textContent, "link": resultado?.href};
    return Array.from( document.querySelectorAll('ul#boletinsAnteriores > li > a') )
                .map(tag => {
                    return {'titulo': tag?.textContent, "link": tag?.href};
                });
  })

  browser.close()
  return result
}
scrape().then((value) => {
  console.log(value);
  console.log('FIM');
})