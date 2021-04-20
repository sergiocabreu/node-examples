// https://www.npmjs.com/package/pdf2json

const fs = require("fs");
const PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("D:/F1040EZ.json", JSON.stringify(pdfData));
});

pdfParser.loadPDF("D:/lista-vacinacao-pdf/19.04-IDOSOS-Dose1-Dia1904_2021.pdf");