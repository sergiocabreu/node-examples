const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
PDFParser = require("pdf2json");

module.exports = {
	extrairConteudo: (caminho) => {
		return new Promise( (resolve, reject) => {
			let pdfParser = new PDFParser(this, 1);
			
			pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
			pdfParser.on("pdfParser_dataReady", pdfData => {
				const text = pdfParser.getRawTextContent();
				resolve(text)
			});
			
			pdfParser.loadPDF(caminho);
		});
	},
	extrairConteudoEmLinhas: (caminho) => {
		return new Promise( (resolve, reject) => {
			const pdfExtract = new PDFExtract();
			pdfExtract.extract(caminho, {}, function (err, data) {

				if (err) {
					reject(err);
				}
				
				let linhas = [];
				data.pages.forEach(page => {
					const lines = PDFExtract.utils.pageToLines(page, 2);
					const rows = PDFExtract.utils.extractTextRows(lines);
					rows.forEach( linha => {
						linhas.push(linha);
					});
				});

				resolve(linhas);
			});
		});
	},
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
	extrairLinhas: (caminho) => {
		pdfExtract.extract(caminho, {}, function (err, data) {
			data.pages.forEach(page => {
				let paginas = [];
				const paginaArray = PDFExtract.utils.extractTextRows(PDFExtract.utils.pageToLines(page, 2));
				 paginaArray.forEach( p => paginas.push(p));

				// const paginas = PDFExtract.utils.extractTextRows(PDFExtract.utils.pageToLines(page, 2));
				console.log(paginas);
			});
		});
	},
	extrairTextoInArray: async (caminho) => {
		return new Promise( (resolve, reject) => {
			let pdfParser = new PDFParser(this, 1);
			
			pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
			pdfParser.on("pdfParser_dataReady", pdfData => {
				const text = pdfParser.getRawTextContent().split('\r\n');
				resolve(text)
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
