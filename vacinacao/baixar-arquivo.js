const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const axios = require("axios").default;
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

console.log('Bucando lista de vacinação...');

buscarListaVacinacao().then((value) => {
  let arquivo = value[0];
  console.log(`Arquivo encontrado: ${arquivo.titulo} (${arquivo.link})`);
  return baixarArquivo(arquivo.link);
})
.then(caminho => {
  console.log('Arquivo salvo em: ', caminho);
  const path = caminho.replace(/\\/g, '/');
  console.log('path ', path);
})
.catch(error => console.log(error));

async function buscarListaVacinacao() {
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

function baixarArquivo(fileUrl) {
  console.log('Baixando arquivo:', fileUrl);
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    })
    .then(function (response) {
      const fileName = path.basename(fileUrl);
      const pdfDirectory = path.resolve(__dirname, "../vacinacao/lista-vacinacao-pdf/");
      const caminhoArquivo = path.join(pdfDirectory, fileName)
      response.data.pipe(fs.createWriteStream(caminhoArquivo));
      resolve(caminhoArquivo)
    });
  });
}