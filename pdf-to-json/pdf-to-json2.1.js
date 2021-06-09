// https://www.npmjs.com/package/pdf2json

let fs = require('fs'), PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    const text = pdfParser.getRawTextContent().split('\r\n');
    text.forEach( t => console.log(text));
});

pdfParser.loadPDF("D:/lista-vacinacao-pdf/19.04-IDOSOS-Dose1-Dia1904_2021.pdf");