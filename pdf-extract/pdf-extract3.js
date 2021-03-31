const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

let pdf = "./pdf-extract/pdf/Agendamento 31-03-2021(1)_compressed.pdf";
// let pdf2 = "./pdf-extract/pdf/teste.pdf";
// let pdf3 = 'https://saude.fortaleza.ce.gov.br/images/coronavirus/listas/Agendamento-dia-30-03-2021_compressed.pdf';

pdfExtract.extract(pdf, {} /* options*/, function (err, data) {
	if (err) {
		return console.error(err);
	}

	const lines = PDFExtract.utils.pageToLines(data.pages[0], 2)
	const result = lines.map(linha => {
		let coluna = linha.map( coluna => coluna.str);
		return {
			"nome": coluna[0],
			"bairro": coluna[2],
			"local": coluna[3],
			"hora": coluna[4],
			"nascimento": coluna[5]
		}
	});


	/*
	result.forEach(element => {
		console.log(element);
	});
	*/
	var achou = result.filter(pessoa => pessoa.nome === 'ZULMIRA FERREIRA GOMES');
	console.log(achou);
	 //result.forEach(data => console.log(data));
});

function map1(coluna) {
	return {
		"nome": coluna[1],
		"bairro": coluna[2],
		"local": coluna[3],
		"hora": coluna[4],
		"nascimento": coluna[5]
	}
}

function map2(coluna) {
	return {
		"nome": coluna[1],
		"bairro": coluna[2],
		"local": coluna[3],
		"hora": coluna[4],
		"nascimento": coluna[5]
	}
}