const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
PDFParser = require("pdf2json");

module.exports = {
	consultarInformacoesPdfBuffer: async(arquivo, nomes) => {
	  
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
	},
	extrairTextoInArray: async (caminho) => {
		return new Promise( (resolve, reject) => {
			let pdfParser = new PDFParser(this, 1);

			pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
			pdfParser.on("pdfParser_dataReady", pdfData => {
				const text = pdfParser.getRawTextContent();
				resolve(text);
			});
	
			pdfParser.loadPDF(caminho);
		});
	}
}




function isTemNome(linha, nomes) {
	let r = linha.filter( info => isNomeNaLista(info, nomes));
	return r && r.length > 0;
}

function isNomeNaLista(nome, nomes ) {
  const r = nomes.filter(n => n === nome);
  return r && r.length > 0;
}
