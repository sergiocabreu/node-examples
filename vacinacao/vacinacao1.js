const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const axios = require("axios").default;
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();


console.log('Bucando lista de arquivos...');

buscarListaPdf().then((value) => {
  let arquivo = value[0];
  console.log('Arquivo encontrado: ', arquivo);

  baixarArquivo(arquivo.link).then((caminho)=> {
    console.log('Arquivo baixado no diretório: ', caminho);
    // consultarInformacoesPdf(caminho).then( resultado => console.log(resultado));
  });

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

async function baixarArquivo(fileUrl) {
  console.log('Baixando arquivo de:', fileUrl);
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    })
    .then(function (response) {
          const fileName = path.basename(fileUrl);
          const localFilePath = path.resolve(__dirname, fileName);
          response.data.pipe(fs.createWriteStream(localFilePath));
          resolve(localFilePath)
    });
  });
}
  
function consultarInformacoesPdf(urlPdf) {
  console.log('consultando dados do pdf', urlPdf);

  return new Promise((resolve, reject) => {
    pdfExtract.extract(urlPdf, {}, function (err, data) {
        if (err) {
          return console.error(err);
        }
    
        let paginas = [];
        data.pages.forEach(page => {
          const paginaArray = PDFExtract.utils.extractTextRows(PDFExtract.utils.pageToLines(page, 2));
          paginaArray.forEach( p => paginas.push(p));
        });
    
        let achou = paginas.filter( linha => isTemNome(linha) );
    
        resolve(achou);
    });
  
  });
}

function isTemNome(linha) {
	let r = linha.filter( info => isNomeNaLista(info));
	return r && r.length > 0;
}

function isNomeNaLista(nome ) {
	return nome === 'FRANCISCO MENDES' ||
       nome === 'RAIMUNDO NONATO RODRIGUES' ||
       nome === 'BENEDITA AURINDO DE SOUZA' ||
       nome === 'LUCIA DE FATIMA FRANÇA DOS SANTOS'
}
