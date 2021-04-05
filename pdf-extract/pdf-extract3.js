// https://github.com/ffalt/pdf.js-extract

const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

const nomes = [
	'FRANCISCO MENDES',
	'RAIMUNDO NONATO RODRIGUES',
	'BENEDITA AURINDO DE SOUZA',
	'LUCIA DE FATIMA FRANÇA DOS SANTOS'
  ];
let pdf = 'c:/Users/dev/GitHub/node-examples/vacinacao/Agendados-05.04.2021-PDF.pdf';

consultarInformacoesPdf(pdf, nomes).then( result => console.log(result));
consultarInformacoesPd2(pdf, nomes);

function consultarInformacoesPd2(pdf, nomes) {

	pdfExtract.extract(pdf, {}, function (err, data) {
		if (err) {
			return console.error(err);
		}

		let paginas = [];
		data.pages.forEach(page => {
			const paginaArray = PDFExtract.utils.extractTextRows(PDFExtract.utils.pageToLines(page, 2));
			paginaArray.forEach( p => paginas.push(p));
		});

		let achou = paginas.filter( linha => isTemNome(linha) );

		console.log('Achou, ', achou);
	});
}

async function consultarInformacoesPdf(urlPdf, nomes) {
	return new Promise( (resolve, reject) => {
		const buffer = fs.readFileSync(urlPdf);
	  	pdfExtract.extractBuffer(buffer, {}, (err, data) => {
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

function isTemNome(linha) {
	let r = linha.filter( info => isNomeNaLista(info));
	return r && r.length > 0;
}

function isNomeNaLista(nome) {
	const r = nomes.filter(n => n === nome);
	return r && r.length > 0;
  }

