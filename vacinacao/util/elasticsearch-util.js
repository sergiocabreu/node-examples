'use strict'
// require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')

module.exports = {
  carregarDados: (dataset) => {

    const client = new Client({
      node: 'http://localhost:9200'
    });

    const vacinacao_index = 'vacinacao';
    run(client, dataset, vacinacao_index);
  }
}

async function run (client, dataset, index) {
  await client.indices.create({
    index: index,
    body: {
      mappings: {
        properties: {
          conteudo: { type: 'text' },
          nomeArquivo: { type: 'keyword' }
        }
      }
    }
  }, { ignore: [400] });

  const { body: bulkResponse } = await client.index({
    index: index,
    body: {
      ...dataset
    }
  })

  const { body: count } = await client.count({ index: index })
  console.log(count)
}
