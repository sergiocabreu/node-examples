// https://www.npmjs.com/package/pdf2json

const fs = require("fs");
const PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    const nomeArquivo = pdfData.formImage.Agency;

    const texts = pdfData.formImage.Pages.map( page => page.Texts);
    const rGrande = texts.map( text => text);

    rGrande.forEach( resultado => console.log(resultado));

    // const rs = texts.map( text => text.R);

    

    // const ts = texts.map( text => text.T);

    // ts.forEach( t => console.log(t));

    // const paginas = pdfData.formImage.Pages.forEach( linha => console.log(linha.Texts));

    // const r = JSON.stringify(paginas);
    // console.log(r);


    // console.log(pdfData.formImage.Pages);
    // fs.writeFileSync("D:/F1040EZ.json", JSON.stringify(pdfData));
});

pdfParser.loadPDF("D:/lista-vacinacao-pdf/19.04-IDOSOS-Dose1-Dia1904_2021.pdf");