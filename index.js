const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());

// Conexão com o banco
const db = new sqlite3.Database('./database.db');

// Cria a tabela e inseri 20 registros (se o banco estiver vazio)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        preco REAL,
        categoria TEXT
    )`);

    db.get("SELECT COUNT(*) as total FROM produtos", (err, row) => {
        if (row.total === 0) {
            const iniciais = [
                ["Red Dead Redemption 2", 199.90, "Games"], 
                ["God of War Ragnarok", 249.90, "Games"],
                ["Zelda: TotK", 299.00, "Games"], 
                ["Elden Ring", 229.50, "Games"],
                ["Cyberpunk 2077", 149.00, "Games"], 
                ["Minecraft", 99.00, "Games"],
                ["Hollow Knight", 27.99, "Games"], 
                ["Stardew Valley", 24.99, "Games"],
                ["Resident Evil 4", 199.00, "Games"], 
                ["Baldur's Gate 3", 199.99, "Games"],
                ["Spider-Man 2", 250.00, "Games"], 
                ["Starfield", 170.00, "Games"],
                ["Street Fighter 6", 180.00, "Games"], 
                ["Hades", 45.00, "Games"],
                ["FIFA 24", 290.00, "Games"], 
                ["The Last of Us", 150.00, "Games"],
                ["Ghost of Tsushima", 120.00, "Games"], 
                ["Dark Souls 3", 80.00, "Games"],
                ["Sekiro", 140.00, "Games"], 
                ["Cuphead", 36.00, "Games"]
            ];
            const stmt = db.prepare("INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)");
            iniciais.forEach(p => stmt.run(p));
            stmt.finalize();
        }
    });
});

// Helper para erros
const responderErro = (res, status, msg) => {
    return res.status(status).json({ 
        sucesso: false,
        erro: msg, 
        timestamp: new Date().toISOString() 
    });
};

// GET: Listar com filtros, ordenação e paginação
app.get('/produtos', (req, res) => {
    const { busca = '', ordem = 'asc', pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    const sql = `SELECT * FROM produtos 
                 WHERE nome LIKE ? 
                 ORDER BY id ${ordem.toLowerCase() === 'desc' ? 'DESC' : 'ASC'} 
                 LIMIT ? OFFSET ?`;

    db.all(sql, [`%${busca}%`, parseInt(limite), offset], (err, rows) => {
        if (err) return responderErro(res, 500, "Erro no banco de dados.");
        res.status(200).json(rows);
    });
});

// GET: Busca por id
app.get('/produtos/:id', (req, res) => {
    db.get("SELECT * FROM produtos WHERE id = ?", [req.params.id], (err, row) => {
        if (!row) return responderErro(res, 404, "Produto não encontrado.");
        res.status(200).json(row);
    });
});

// POST: Cria produto
app.post('/produtos', (req, res) => {
    const { nome, preco, categoria = "Games" } = req.body;

    if (!nome || nome.trim().length < 3) return responderErro(res, 400, "Nome muito curto.");
    if (!preco || preco <= 0) return responderErro(res, 400, "Preço inválido.");

    db.run("INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)", 
        [nome, preco, categoria], function(err) {
        if (err) return responderErro(res, 500, "Erro ao salvar.");
        res.status(201).json({ id: this.lastID, nome, preco, categoria });
    });
});

// PUT: Atualiza produto
app.put('/produtos/:id', (req, res) => {
    const { nome, preco } = req.body;
    
    db.run(`UPDATE produtos SET 
            nome = COALESCE(?, nome), 
            preco = COALESCE(?, preco) 
            WHERE id = ?`, 
        [nome, preco, req.params.id], function(err) {
        if (this.changes === 0) return responderErro(res, 404, "Produto não encontrado.");
        res.status(200).json({ mensagem: "Atualizado com sucesso" });
    });
});

// DELETE: Remove produto
app.delete('/produtos/:id', (req, res) => {
    db.run("DELETE FROM produtos WHERE id = ?", [req.params.id], function(err) {
        if (this.changes === 0) return responderErro(res, 404, "Produto não encontrado.");
        res.status(200).json({ mensagem: "Produto removido com sucesso" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${3000}/produtos`);
});