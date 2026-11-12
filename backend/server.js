const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar os heróis (GET)
app.get('/herois', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM herois');
        res.json(rows);
    } catch (error) {
        console.error("ERRO NO BANCO (HEROIS):", error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para CADASTRAR um novo herói (POST)
app.post('/herois', async (req, res) => {
    const { nome, funcao } = req.body;
    
    if (!nome || !funcao) {
        return res.status(400).json({ error: 'Nome e função são obrigatórios.' });
    }

    try {
        const [resultado] = await db.query(
            'INSERT INTO herois (nome, funcao) VALUES (?, ?)', 
            [nome, funcao]
        );
        res.status(201).json({ 
            mensagem: 'Herói cadastrado com sucesso!', 
            id: resultado.insertId 
        });
    } catch (error) {
        console.error("ERRO AO CADASTRAR:", error);
        res.status(500).json({ error: 'Erro ao cadastrar herói.' });
    }
});

// Rota para buscar os counters de um herói
app.get('/herois/:id/counters', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.dica_tatica, h.nome AS counter_nome, h.funcao AS counter_funcao
            FROM counters c
            JOIN herois h ON c.counter_hero_id = h.id
            WHERE c.hero_id = ?
        `, [id]);
        res.json(rows);
    } catch (error) {
        console.error("ERRO NO BANCO (COUNTERS):", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('API rodando na porta 3000'));