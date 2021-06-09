const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const axios = require("axios").default;
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

const nomes = [
  'FRANCISCO MENDES',
  'RAIMUNDO NONATO RODRIGUES',
  'BENEDITA AURINDO DE SOUZA',
  'LUCIA DE FATIMA FRANÇA DOS SANTOS'
];

const pdf = 'c:/Users/dev/GitHub/node-examples/vacinacao/lista-vacinacao-pdf/Agendados-05.04.2021-PDF.pdf';
buscarListaVacinacao().then(lista =>{
  return baixarArquivo(lista[0].link);
})
.then( r => {
  return getArquivo(pdf);
})
.then( arquivo => {
  return consultarInformacoesPdf(arquivo, nomes)
}).then( r => console.log(r) );

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
      const pdfDirectory = path.resolve(__dirname, "./lista-vacinacao-pdf/");
      const caminhoArquivo = path.join(pdfDirectory, fileName)
      response.data.pipe(fs.createWriteStream(caminhoArquivo));

      // console.log('******DIRETORIO VACINACAO', path.resolve(__dirname));
        // console.log('******FILE NAME', fileName);
        // console.log('******PDF DIRECTORY', pdfDirectory);
        // console.log('******CAMINHO ARQUIVO', caminhoArquivo);
        resolve(caminhoArquivo)
    });
  });
}

function getArquivo(caminhoArquivo) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminhoArquivo, (err, data)=> {
      if(err){
          console.log(err)
          throw err
      }else{
        resolve(data);
      }
    });
  });
}

function consultarInformacoesPdf(arquivo, nomes) {
  
  return new Promise( (resolve, reject) => {
    pdfExtract.extractBuffer(arquivo, {}, (err, data) => {
      if (err) {
        reject(err);
      }
  
      let paginas = [];
      data.pages.forEach(page => {
        const paginaArray = PDFExtract.utils.extractTextRows(PDFExtract.utils.pageToLines(page, 2));
        paginaArray.forEach( p => paginas.push(p));
      });
  
      let achou = paginas.filter( linha => isTemNome(linha, nomes) );
      resolve(achou);
		});
  });
}

function isTemNome(linha, nomes) {
	let r = linha.filter( info => isNomeNaLista(info, nomes));
	return r && r.length > 0;
}

function isNomeNaLista(nome, nomes ) {
  const r = nomes.filter(n => n === nome);
  return r && r.length > 0;
}
