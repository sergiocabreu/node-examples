const puppeteer = require('puppeteer');
const fs = require("fs");

console.log('Bucando lista de arquivos...');

buscarListaPdf().then((value) => {
  console.log(value);

}, error => console.log(error));


async function buscarListaPdf() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
	let url = 'https://coronavirus.fortaleza.ce.gov.br/listaVacinacao.html';
	await page.goto(url);

  await page.waitForTimeout(5000);
  const result = await page.evaluate(() => {
    return Array.from( document.querySelectorAll('ul#boletinsAnteriores > li > a') )
                .map(tag => {
                    return {'titulo': tag?.textContent, "link": tag?.href};
                });
  })

  browser.close()
  return result
}
