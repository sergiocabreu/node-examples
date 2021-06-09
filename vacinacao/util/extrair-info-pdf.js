const fs = require("fs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

module.exports = {
	getArquivo: async (caminhoArquivo) => {
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
