const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const axios = require("axios").default;
const PDFExtract = require('pdf.js-extract').PDFExtract;
const { stringify } = require('querystring');
const pdfExtract = new PDFExtract();

const nomes = [
  'FRANCISCO MENDES',
  'RAIMUNDO NONATO RODRIGUES',
  'BENEDITA AURINDO DE SOUZA',
  'LUCIA DE FATIMA FRANÇA DOS SANTOS'
];

const pdf = 'c:/Users/dev/GitHub/node-examples/vacinacao/lista-vacinacao-pdf/Agendados-05.04.2021-PDF.pdf';
buscarListaVacinacao().then(listaVacinacao => {
    console.log('Arquivo encontrado:', listaVacinacao[0].titulo);
    return baixarArquivo('https://saude.fortaleza.ce.gov.br/images/coronavirus/listas/Agendados-05.04.2021-PDF.pdf');
})
.then( caminhoArquivo => {
    console.log('Arquivo salvo em: ', caminhoArquivo);
    const path = caminhoArquivo.replace(/\\/g, '/');
    return getArquivo(path);
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
      const pdfDirectory = path.resolve(__dirname, "../vacinacao/lista-vacinacao-pdf/");
      const caminhoArquivo = path.join(pdfDirectory, fileName)
      response.data.pipe(fs.createWriteStream(caminhoArquivo));
      resolve(caminhoArquivo);
    });
  });
}

function getArquivo(caminhoArquivo) {
    console.log('Recuperando arquivo: ', caminhoArquivo);
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

function consultarInformacoesPdf(buffer, nomes) {
  console.log(buffer.byteLength);
  return new Promise( (resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, data) => {
      if (err) {
        reject(err);
      }
      console.log(data);
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
