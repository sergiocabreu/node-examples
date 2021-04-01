// https://github.com/ffalt/pdf.js-extract

const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

// let pdf = "c:/Users/dev/GitHub/node-examples/vacinacao/31.03Agendamentos_31_03_2021_compressed.pdf";

let pdf = 'c:/Users/dev/GitHub/node-examples/vacinacao/Agendamento%2001-04-2021.pdf';

pdfExtract.extract(pdf, {} /* options*/, function (err, data) {

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

function isTemNome(linha) {
	let r = linha.filter( info => isNomeNaLista(info));
	return r && r.length > 0;
}

function isNomeNaLista(nome ) {
	return nome === 'RAIMUNDO NONATO RODRIGUES' ||
		   nome === 'MARIA DE FATIMA MACHADO DOS SANTOS' ||
		   nome === 'MARIA DE FÁTIMA MACHADO DOS SANTOS'
}