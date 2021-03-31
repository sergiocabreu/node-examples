let fs = require('fs'), PDFParser = require("pdf2json");

    let pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        // fs.writeFile("teste.json", JSON.stringify(pdfData.getRawTextContent()));
        // console.log(pdfData);
        // pdfData.formImage.Pages.Texts.map(r => r.R).forEach(campo => console.log(campo));
        //pdfData.formImage.Pages.forEach(campo => console.log(campo));
        // console.log( JSON.stringify(pdfData.formImage.Pages) );
        console.log( JSON.stringify(pdfData.formImage.Pages) );
    });

//    pdfParser.loadPDF("./pdf-to-json/Agendamento-dia-30-03-2021_compressed.pdf");
pdfParser.loadPDF("./pdf-to-json/teste.pdf");