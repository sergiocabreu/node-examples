const listaVacinacaoUtil = require('./util/lista-vacinacao-util')
const arquivoUtil = require('./util/arquivo-util')
const extrairInfoPdfUtil = require('./util/extrair-info-pdf-util')

const nomes = [
  'MARIA DE LOURDES ARAUJO RODRIGUES',
  'FRANCISCO MENDES',
  'RAIMUNDO NONATO RODRIGUES',
  'BENEDITA AURINDO DE SOUZA',
  'LUCIA DE FATIMA FRANÇA DOS SANTOS',
  'LUCIA DE FATIMA FRANCA DOS SANTOS',
  'MARIA LIDUINA BARBOSA MACIEL',
  'ANTONIO MACIEL FERREIRA',
  // 'MANOEL COELHO DOS SANTOS',
  'JOSE EPITACIO DUARTE RODRIGUES',
  'MARIA DE FATIMA MACHADO DOS SANTOS'
];

async function run () {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' +new Date() + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  
  let arquivos = await listaVacinacaoUtil.buscarListaVacinacao();
  let arquivo = arquivos[0];
  console.log(arquivo);

  const local = 'D:/lista-vacinacao-pdf'
  let caminho = await arquivoUtil.download(arquivo.link, local);
  console.log('Arquivo salvo em', caminho);

  let arquivoBytes = await arquivoUtil.getArquivo(caminho.replace(/\\/g, '/'));

  let achou = await extrairInfoPdfUtil.consultarInformacoesPdfBuffer(arquivoBytes, nomes);
  console.log(achou);
}

run();

// setInterval(run, 60000);
