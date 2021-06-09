// https://www.npmjs.com/package/axios
const fs = require("fs");
const path = require('path');
const axios = require("axios").default;

let fileUrl = 'https://saude.fortaleza.ce.gov.br/images/coronavirus/listas/31.03Agendamentos_31_03_2021_compressed.pdf'
axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  })
    .then(function (response) {
        const fileName = path.basename(fileUrl);
        const localFilePath = path.resolve(__dirname, fileName);
        response.data.pipe(fs.createWriteStream(localFilePath));
});