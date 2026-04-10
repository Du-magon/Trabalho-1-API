const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Dados em memória: 10 registros com categoria "Games"
let produtos = [
    { id: 1, nome: "Red Dead Redemption 2", preco: 199.90, categoria: "Games" },
    { id: 2, nome: "God of War Ragnarok", preco: 249.90, categoria: "Games" },
    { id: 3, nome: "The Legend of Zelda: TotK", preco: 299.00, categoria: "Games" },
    { id: 4, nome: "Elden Ring", preco: 229.50, categoria: "Games" },
    { id: 5, nome: "Cyberpunk 2077", preco: 149.00, categoria: "Games" },
    { id: 6, nome: "Minecraft", preco: 99.00, categoria: "Games" },
    { id: 7, nome: "Hollow Knight", preco: 27.99, categoria: "Games" },
    { id: 8, nome: "Stardew Valley", preco: 24.99, categoria: "Games" },
    { id: 9, nome: "Resident Evil 4 Remake", preco: 199.00, categoria: "Games" },
    { id: 10, nome: "Baldur's Gate 3", preco: 199.99, categoria: "Games" }
];

let proximoId = 11;

// Helper para respostas de erro padronizadas
const responderErro = (res, status, msg) => {
    return res.status(status).json({ 
        sucesso: false,
        erro: msg, 
        timestamp: new Date().toISOString() 
    });
};

// GET: Listar todos
app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
});

// GET: Buscar por ID
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return responderErro(res, 404, "Produto não encontrado.");
    res.status(200).json(produto);
});

// POST: Criar Produto (com categoria Games por padrão)
app.post('/produtos', (req, res) => {
    const { nome, preco } = req.body;

    if (!nome || nome.trim().length < 3) return responderErro(res, 400, "Nome deve ter no mínimo 3 caracteres.");
    if (preco === undefined || preco <= 0) return responderErro(res, 400, "Preço deve ser maior que zero.");

    const existe = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (existe) return responderErro(res, 400, "Este produto já está cadastrado.");

    const novoProduto = { 
        id: proximoId++, 
        nome, 
        preco, 
        categoria: "Games" 
    };
    
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// PUT: Atualizar Produto
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) return responderErro(res, 404, "Produto não encontrado para atualização.");

    const { nome, preco } = req.body;

    produtos[index] = {
        ...produtos[index],
        nome: nome || produtos[index].nome,
        preco: preco !== undefined ? preco : produtos[index].preco
    };

    res.status(200).json(produtos[index]);
});

// DELETE: Remover Produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) return responderErro(res, 404, "Produto não encontrado para exclusão.");

    const removido = produtos.splice(index, 1);
    res.status(200).json({ 
        mensagem: "Produto removido com sucesso", 
        item: removido[0] 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${3000}/produtos`);
});