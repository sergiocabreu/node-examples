const listaVacinacaoUtil = require('./util/lista-vacinacao-util')
const extrairInfoPdfUtil = require('./util/extrair-info-pdf-util')
const arquivoUtil = require('./util/arquivo-util')
const elasticSearchUtil = require('./util/elasticsearch-util')

const nomes = [
  'MARIA DE LOURDES ARAUJO RODRIGUES',
  'FRANCISCO MENDES',
  'RAIMUNDO NONATO RODRIGUES',
  'BENEDITA AURINDO DE SOUZA',
  'LUCIA DE FATIMA FRANÇA DOS SANTOS',
  'LUCIA DE FATIMA FRANCA DOS SANTOS',
  'MARIA LIDUINA BARBOSA MACIEL',
  'ANTONIO MACIEL FERREIRA',
  'MANOEL COELHO DOS SANTOS',
  'JOSE EPITACIO DUARTE RODRIGUES'
];

async function baixarArquivos () {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' +new Date() + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  
  let listas = await listaVacinacaoUtil.buscarListaVacinacao();

  const local = 'D:/lista-vacinacao-pdf'
  // const local = 'D:/teste';
  listas.forEach(lista => {
    arquivoUtil.download(lista.link, local)
               .then( caminho => console.log(`Arquivo ${lista.titulo} salvo em caminho ${caminho}`))
  });
}

async function carregarArquivosNoElasticSearch() {

  const local = 'D:/lista-vacinacao-pdf'
  // const local = 'D:/teste';
  const arquivosLocal = await arquivoUtil.listaArquivos(local);

  console.log(arquivosLocal);

  arquivosLocal.forEach(nomeArquivo => {

    const caminho = local + '/' + nomeArquivo;

    extrairInfoPdfUtil.extrairConteudoEmLinhas(caminho)
                      .then(linhas => {
                          const dados = linhas.map(linha => {
                            return {
                              nome: linha[0],
                              conteudo: linha.join(" "),
                              nomeArquivo: nomeArquivo,
                            };
                          });
                        elasticSearchUtil.carregarDados(dados);
                      });  
  });
}

// baixarArquivos();
carregarArquivosNoElasticSearch();
// setInterval(run, 60000);
