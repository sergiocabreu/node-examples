// https://www.kindacode.com/article/reading-content-from-pdf-and-csv-files-using-node-js/
// https://www.npmjs.com/package/pdf-parse

const fs = require('fs');
const pdfParse = require('pdf-parse');

const readPdf = async (uri) => {
    const buffer = fs.readFileSync(uri);
    try {
        const data = await pdfParse(buffer);

        // The content
        console.log('Content: ', data.text); 

        // Total page
        console.log('Total pages: ', data.numpages);

        // File information
        console.log('Info: ', data.info);
    }catch(err){
        throw new Error(err);
    }
}

// Testing
const myURL = new URL('https://saude.fortaleza.ce.gov.br/images/coronavirus/listas/31.03Agendamentos_31_03_2021_compressed.pdf');
const DUMMY_PDF = './pdf-extract/pdf/Agendamento 31-03-2021(1)_compressed.pdf';
readPdf(DUMMY_PDF);