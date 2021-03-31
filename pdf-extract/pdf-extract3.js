// https://github.com/ffalt/pdf.js-extract

const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

let pdf = "./pdf-extract/pdf/Agendamento 31-03-2021(1)_compressed.pdf";

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
	return nome === 'ABEL DOS SANTOS SILVA' ||
		   nome === 'AGENOR BARBOSA'
}