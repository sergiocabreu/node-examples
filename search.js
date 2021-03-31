const puppeteer = require('puppeteer');

async function search() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let url = 'https://coronavirus.fortaleza.ce.gov.br/listaVacinacao.html';
  await page.goto(url);

  // await page.click('[href="/login"]');

  let links = await page.evaluate(() => {
    let resultado = document.querySelectorAll(".pl-3");
    console.log('resultado', resultado);
   return resultado;
   // return Array.from(document.getElementById('boletinsAnteriores')).map(anchor => [anchor]);
    // console.log(document.getElementById('boletinsAnteriores'));
  });

  console.log(links);

 await browser.close();

};

// search();
async function teste() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let url = 'https://coronavirus.fortaleza.ce.gov.br/listaVacinacao.html';
  await page.goto(url);

  const result = await page.evaluate(x => {
    return Promise.resolve(x);
  }, 'a');
  console.log(result); // prints "56"

  await browser.close();
};

//teste();