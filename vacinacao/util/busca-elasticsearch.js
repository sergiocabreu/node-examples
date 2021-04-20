'use strict'
// require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')

module.exports = {
  carregarDados: (dataset) => {
    const client = new Client({
      node: 'http://localhost:9200'
    });

    console.log('xxxxxxxxxxxxxxxxxx');
    run(client, dataset.texto);
  }
}




async function run (client, dataset) {
  await client.indices.create({
    index: 'vacinacao',
    body: {
      mappings: {
        properties: {
          texto: { type: 'text' },
          nomeArquivo: { type: 'keyword' }
        }
      }
    }
  }, { ignore: [400] })

  /*
  const dataset = [{
    text: 'BENVINDA MARIA DO NASCIMENTO MAIA        GRANJA PORTUGAL        SHOPPING RIOMAR KENNEDY     2021-04-19  09:00:00     1 1949-05-14',
    user: 'Idosos Agendados D2 - 20/04/2021',
    url: 'https://saude.fortaleza.ce.gov.br/images/20.04-IDOSOS-60-A-74-ANOS-D2-20.04_compressed.pdf'
  }];
*/
  const body = dataset.flatMap(doc => [{ index: { _index: 'vacinacao' } }, doc])

  const { body: bulkResponse } = await client.bulk({ refresh: true, body })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })
    console.log(erroredDocuments)
  }

  const { body: count } = await client.count({ index: 'tweets' })
  console.log(count)
}

run().catch(console.log)