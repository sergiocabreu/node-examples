const listaVacinacao = require('./util/lista-vacinacao')
const extrairInfoPdf = require('./util/extrair-info-pdf')

const nomes = [
  'MARIA DE LOURDES ARAUJO RODRIGUES',
  'FRANCISCO MENDES',
  'RAIMUNDO NONATO RODRIGUES',
  'BENEDITA AURINDO DE SOUZA',
  'LUCIA DE FATIMA FRANÇA DOS SANTOS',
  'LUCIA DE FATIMA FRANCA DOS SANTOS',
  'MARIA LIDUINA BARBOSA MACIEL',
  'ANTONIO MACIEL FERREIRA',
  'ALANNY GABRIELLY DIOGENES CAMPELO'
];

async function run () {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' +new Date() + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  
  let arquivos = await listaVacinacao.buscarListaVacinacao();
  let arquivo = arquivos[0];
  console.log(arquivo);

  const local = 'D:/lista-vacinacao-pdf'
  let caminho = await listaVacinacao.download(arquivo.link, local);
  console.log('Arquivo salvo em', caminho);

  let arquivoBytes = await extrairInfoPdf.getArquivo(caminho.replace(/\\/g, '/'));

  let achou = await extrairInfoPdf.consultarInformacoesPdfBuffer(arquivoBytes, nomes);
  console.log(achou);
}

run();

// setInterval(run, 60000);
