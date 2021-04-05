const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

const nomes = [
	'FRANCISCO MENDES',
	'RAIMUNDO NONATO RODRIGUES',
	'BENEDITA AURINDO DE SOUZA',
	'LUCIA DE FATIMA FRANÇA DOS SANTOS',
	'SERGIO CARVALHO DE ABREU'
  ];

let pdf = 'c:/Users/dev/GitHub/node-examples/vacinacao/lista-vacinacao-pdf/Agendados-05.04.2021-PDF.pdf';

getArquivo(pdf).then(arquivo => {
	return consultarInformacoesPdf(arquivo, nomes);
})
.then((achados) => console.log(achados))
.catch(error => console.log(error));

// consultarInformacoesPdf(pdf, nomes);

function getArquivo(caminhoArquivo) {
    console.log('Recuperando arquivo: ', caminhoArquivo);
    return new Promise((resolve, reject) => {
        fs.readFile(caminhoArquivo, (err, data)=> {
        if(err){
			reject(err);
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
