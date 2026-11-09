require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'rivals_counter_chave_super_secreta_2026';

// --- MIDDLEWARES DE SEGURANÇA ---

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
        req.usuario = usuario;
        next();
    });
}

function somenteAdmin(req, res, next) {
    if (req.usuario.nivel !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    next();
}

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/auth/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });

    try {
        const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) return res.status(400).json({ error: 'E-mail já cadastrado.' });

        const hash = await bcrypt.hash(senha, 10);
        await db.query('INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, "usuario")', [nome, email, hash]);
        
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error("ERRO NO CADASTRO:", error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

        const usuario = usuarios[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, nivel: usuario.nivel }, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, nivel: usuario.nivel } });
    } catch (error) {
        console.error("ERRO NO LOGIN:", error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// --- ROTAS DE HERÓIS ---

app.get('/herois', autenticarToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM herois');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/herois/:id/counters', autenticarToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.id, c.counter_hero_id, c.dica_tatica, h.nome AS counter_nome, h.funcao AS counter_funcao
            FROM counters c
            JOIN herois h ON c.counter_hero_id = h.id
            WHERE c.hero_id = ?
        `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/herois', autenticarToken, somenteAdmin, async (req, res) => {
    const { nome, funcao } = req.body;
    if (!nome || !funcao) return res.status(400).json({ error: 'Nome e função são obrigatórios.' });

    try {
        const [resultado] = await db.query('INSERT INTO herois (nome, funcao) VALUES (?, ?)', [nome, funcao]);
        res.status(201).json({ mensagem: 'Herói cadastrado!', id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar herói.' });
    }
});

// Rota para DELETAR herói (com tratamento de erro de Foreign Key)
app.delete('/herois/:id', autenticarToken, somenteAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM herois WHERE id = ?', [req.params.id]);
        res.json({ mensagem: 'Herói excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'Não é possível excluir: este herói é counter de outro.' });
        }
        res.status(500).json({ error: 'Erro ao excluir herói.' });
    }
});

// Rota NOVA para EDITAR herói
app.put('/herois/:id', autenticarToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, funcao } = req.body;
    if (!nome || !funcao) return res.status(400).json({ error: 'Nome e função são obrigatórios.' });

    try {
        await db.query('UPDATE herois SET nome = ?, funcao = ? WHERE id = ?', [nome, funcao, id]);
        res.json({ mensagem: 'Herói atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar herói.' });
    }
});

// --- ROTAS DE COUNTERS ---

app.post('/counters', autenticarToken, somenteAdmin, async (req, res) => {
    const { hero_id, counter_hero_id, dica_tatica } = req.body;
    if (!hero_id || !counter_hero_id || !dica_tatica) return res.status(400).json({ error: 'Preencha todos os campos.' });

    try {
        const [resultado] = await db.query('INSERT INTO counters (hero_id, counter_hero_id, dica_tatica) VALUES (?, ?, ?)', [hero_id, counter_hero_id, dica_tatica]);
        res.status(201).json({ mensagem: 'Counter cadastrado!', id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar counter.' });
    }
});

app.put('/counters/:id', autenticarToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;
    const { counter_hero_id, dica_tatica } = req.body;

    try {
        await db.query('UPDATE counters SET counter_hero_id = ?, dica_tatica = ? WHERE id = ?', [counter_hero_id, dica_tatica, id]);
        res.json({ mensagem: 'Counter atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar counter.' });
    }
});

app.delete('/counters/:id', autenticarToken, somenteAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM counters WHERE id = ?', [req.params.id]);
        res.json({ mensagem: 'Counter excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir counter.' });
    }
});

app.listen(3000, () => console.log('API rodando na porta 3000'));