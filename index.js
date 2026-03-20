const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// GET raiz
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// GET info
app.get('/info', (req, res) => {
    res.json({
        nome: 'Minha API REST',
        versao: '1.0.0',
        autor: 'Eduardo Magon'
    });
});

// Dados em memória
let produtos = [
    { id: 1, nome: "Red Dead Redemption 2", preco: 70, categoria: "Games" },
    { id: 2, nome: "God Of War", preco: 80, categoria: "Games" }
];

let proximoId = 3;

// GET listar todos os produtos
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

// GET buscar produto por ID
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
});

// POST com validações
app.post('/produtos', (req, res) => {
    const { nome, preco, categoria } = req.body;

    // Validações
    if (!nome || nome.trim().length < 3) {
        return res.status(400).json({ erro: "Nome deve ter pelo menos 3 caracteres" });
    }

    if (preco === undefined || preco <= 0) {
        return res.status(400).json({ erro: "Preço deve ser maior que 0" });
    }

    if (!categoria || categoria.trim() === "") {
        return res.status(400).json({ erro: "Categoria é obrigatória" });
    }

    // Verificar duplicado
    const existe = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (existe) {
        return res.status(400).json({ erro: "Produto já existe" });
    }

    const novoProduto = {
        id: proximoId++,
        nome,
        preco,
        categoria
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});