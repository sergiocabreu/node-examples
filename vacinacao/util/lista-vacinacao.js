const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const https = require('https');

module.exports = {
  buscarListaVacinacao: async () => {
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
  }, 
  download: (url, caminho) => {
    console.log('Baixando arquivo:', url);
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const nomeArquivo = path.basename(url);
        const caminhoArquivo = path.join(caminho, nomeArquivo)
        const filePath = fs.createWriteStream(caminhoArquivo);
        res.pipe(filePath);
        filePath.on('finish',() => {
          filePath.close();
          resolve(caminhoArquivo);
        })
      })
    });
  }
}




