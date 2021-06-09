const fs = require("fs");
const path = require('path');
const https = require('https');

module.exports = {
  download: (url, caminho) => {
    console.log('Baixando arquivo:', url);
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const nomeArquivo = path.basename(url);
        const caminhoArquivo = path.join(caminho, nomeArquivo)
        const filePath = fs.createWriteStream(caminhoArquivo);
        res.pipe(filePath);
        filePath.on('finish',() => {
          filePath.close();
          resolve(caminhoArquivo);
        })
      })
    });
  },
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
  getArquivoSync: (caminhoArquivo) => {
    return fs.readFileSync(caminhoArquivo);
	},
  listaArquivos: (diretorio) => {
    return new Promise( (resolve, reject) => {
      // const directoryPath = path.join(__dirname, diretorio);
      fs.readdir(diretorio, function (err, files) {
        if (err) {
          reject('Unable to scan directory: ' + err);
          //return console.log('Unable to scan directory: ' + err);
        } 
        resolve(files);
        /*
        files.forEach(function (file) {
          console.log(file); 
        });
        */
      });
    });
  }

}




