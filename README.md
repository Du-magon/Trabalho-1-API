API REST de Games!

Esta é uma API REST para gerenciamento de um catálogo de jogos.

Requisitos do Projeto
- CRUD 100% com SQLite
- Filtros de busca, ordenação e paginação.
- Validações de dados.
- Status Codes corretos.
- Mínimo de 20 registros iniciais.

Tecnologias Utilizadas
- Node.js
- Express (Framework)
- SQLite3 (Banco de Dados)

Como Instalar e Rodar

1. Clone o repositório ou baixe os arquivos.
2. Abra o terminal na pasta do projeto e instale o que for preciso:
npm install express sqlite3
3. Rode o código:
node index.js
4. Pronto! Sua API está rodando.

Rotas

| Método | Rota | Descrição | Parâmetros (Query) |
| :--- | :--- | :--- | :--- |
| GET | /produtos | Lista todos os jogos | Busca, ordem, pagina, limite |
| GET | /produtos:id | Busca um jogo pelo ID | - |
| POST | /produtos | Cadastra um novo jogo | - |
| PUT | /produtos:id | Atualiza dados de um jogo | - |
| DELETE | /produtos:id | Remove um jogo do catálogo | - |
