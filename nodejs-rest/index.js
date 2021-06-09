const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

conexao.connect( error => {
    if (error) {
        console.log('Erro ao conectar na base de dados', error);
    } else {
        console.log('Banco conectado com sucesso.')
        Tabelas.init(conexao);
        const app = customExpress();
        app.listen( 3000, () => {console.log('servidor rodando na porta http://localhost:3000')});        
    }
});
