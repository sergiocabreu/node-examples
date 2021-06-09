// https://github.com/elastic/elasticsearch-js

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

// promise API
async function run() {
    const result = await client.search({
        index: 'tweets',
        body: {
        query: {
            match: { "user": "tyrion" }
        }
        }
    });
    
    console.log(result.body.hits.hits);
}

run();