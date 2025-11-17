import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

import { db } from './database.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FORTNITE_API = 'https://fortnite-api.com/v2';

app.get('/', (req, res) => {
  res.send('✅ Fortnite Backend ativo!');
});

app.get('/api/cosmetics', async (req, res) => {
  try {
    const response = await axios.get(`${FORTNITE_API}/cosmetics`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cosméticos' });
  }
});

app.get('/api/cosmetics/new', async (req, res) => {
  try {
    const response = await axios.get(`${FORTNITE_API}/cosmetics/new`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar novos cosméticos' });
  }
});

app.get('/api/shop', async (req, res) => {
  try {
    const response = await axios.get(`${FORTNITE_API}/shop`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar loja' });
  }
});

app.get('/api/usuarios/todos', async (req, res) => {
  try {
    
    let { pagina = 1, limite = 10, nome = '' } = req.query;
    pagina = Number(pagina);
    limite = Number(limite);
    const offset = (pagina - 1) * limite;
    
    const [totalRows] = await db.query(
      "SELECT COUNT(*) AS total FROM usuario WHERE nome LIKE ?",
      [`%${nome}%`]
    );
    const total = totalRows[0].total;

    const [usuarios] = await db.query(
      `SELECT * FROM usuario
       WHERE nome LIKE ?
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [`%${nome}%`, limite, offset]
    );

    res.json({
      dados: usuarios,
      total,
      pagina,
      paginas: Math.ceil(total / limite)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.get('/api/usuarios/dinheiroUsuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const [rows] = await db.query(
      "SELECT vbucks FROM usuario WHERE id = ?",
      [usuarioId]
    );

    res.json({
      dinheiro: rows
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar itens do usuário" });
  }
});


app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, vbucks } = req.body;

    const connection = await db.getConnection();
    let resultado;
    try {
      await connection.beginTransaction();
      
      [resultado] = await connection.query(
        "INSERT INTO usuario (nome, email, senha, vbucks) VALUES (?, ?, ?, ?)",
        [nome, email, senha, vbucks]
      );

      await connection.commit();
            
      connection.release();
      
      // Verificar se foi realmente salvo (usando nova conexão)
      const [verificacao] = await db.query(
        "SELECT * FROM usuario WHERE id = ?",
        [resultado.insertId]
      );

      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        id: resultado.insertId
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('❌ Erro ao cadastrar usuário:', error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

app.get('/api/usuarios/itensUsuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const [rows] = await db.query(
      "SELECT * FROM itensusuario WHERE usuarioId = ?",
      [usuarioId]
    );

    res.json({
      itens: rows
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ erro: "Erro ao buscar itens do usuário" });
  }
});

app.get('/api/usuarios/minhaConta/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const [rows] = await db.query(
      `SELECT u.*
       FROM usuario u       
       WHERE u.id = ?`,
      [usuarioId]
    );

    const [itens] = await db.query(
      `SELECT ui.*
       FROM itensusuario ui       
       WHERE ui.usuarioId = ? and excluido = 0`,
      [usuarioId]
    );

    res.json({
      dados: rows,
      meusItens:itens
    });
  } catch (error) {

    res.status(500).json({ erro: "Erro ao buscar itens do usuário" });
  }
});

app.post('/api/comprarItem', async (req, res) => {
  try {
    const { idItem, name, regularPrice, usuarioId,imagem } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const userId = Number(usuarioId);
    
    if (isNaN(usuarioId)) {
      return res.status(400).json({ erro: "ID do usuário inválido." });
    }
        
    const [rows] = await db.query(
      "SELECT vbucks FROM usuario WHERE id = ?",
      [userId]
    );

    const [verificaItem] = await db.query(
      "SELECT idItem as verificaIdItem from itensusuario where idItem =? AND excluido=0 AND usuarioId = ?",
      [idItem,usuarioId]
    )

    if (verificaItem.length > 0) {
      return res.status(400).json({ erro: "Você já possui este item e não pode ser comprado." });
    }

    if (rows.length == 0) {

      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const saldoAtual = rows[0].vbucks;

    if (saldoAtual < regularPrice) {      
      return res.status(400).json({ erro: "Saldo insuficiente para comprar este item." });
    }

    const connection = await db.getConnection();
    let resultado;
    try {
      const data = new Date();
      await connection.beginTransaction();

      [resultado] = await connection.query(
        "INSERT INTO itensusuario (idItem, usuarioId, name, regularPrice,dataRegistro,imagem) VALUES (?, ?, ?, ?, ?, ?)",
        [idItem, usuarioId, name, regularPrice,data, imagem]
      );

      await connection.commit();
            
      connection.release();      

      const novoSaldo = saldoAtual - regularPrice;
      await db.query(
        "UPDATE usuario SET vbucks = ? WHERE id = ?",
        [novoSaldo, usuarioId]
      );

      res.status(201).json({
        mensagem: "Item cadastrado com sucesso!",
        id: resultado.insertId
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar item do usuário" });
  }
});

app.post('/api/devolverItem', async (req, res) => {
  try {
    
    const { idItem, regularPrice, usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const userId = Number(usuarioId);
    if (isNaN(userId)) {
      return res.status(400).json({ erro: "ID do usuário inválido." });
    }

    const [rows] = await db.query(
      "SELECT vbucks FROM usuario WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const saldoAtual = rows[0].vbucks;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const data = new Date();
      const [deleteResult] = await connection.query(
        "UPDATE itensusuario SET excluido = 1, dataExclusao = ? WHERE idItem = ? AND usuarioId = ?",
        [data, idItem, userId]
      );

      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ erro: "Item não encontrado para este usuário." });
      }

      const novoSaldo = saldoAtual + Number(regularPrice);

      await connection.query(
        "UPDATE usuario SET vbucks = ? WHERE id = ?",
        [novoSaldo, userId]
      );

      await connection.commit();
      connection.release();

      return res.status(200).json({
        mensagem: "Item devolvido com sucesso!",
        novoSaldo: novoSaldo
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao devolver item do usuário" });
  }
});

app.get('/api/usuarios/historicoDevolucao/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    let { pagina = 1, limite = 10, nome = '' } = req.query;
    pagina = Number(pagina);
    limite = Number(limite);

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const offset = (pagina - 1) * limite;

    const [totalRows] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM itensusuario 
       WHERE usuarioId = ? 
       AND excluido = 1
       AND name LIKE ?`,
      [usuarioId, `%${nome}%`]
    );

    const total = totalRows[0].total;

    const [rows] = await db.query(
      `SELECT * FROM itensusuario 
       WHERE usuarioId = ?
       AND excluido = 1
       AND name LIKE ?
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [usuarioId, `%${nome}%`, limite, offset]
    );

    res.json({
      itens: rows,
      total,
      pagina,
      paginas: Math.ceil(total / limite)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar itens do usuário" });
  }
});


app.get('/api/usuarios/historicoCompra/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    let { pagina = 1, limite = 10, nome = '' } = req.query;
    pagina = Number(pagina);
    limite = Number(limite);
    const offset = (pagina - 1) * limite;

    const [totalRows] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM itensusuario 
       WHERE usuarioId = ? 
       AND excluido = 0
       AND name LIKE ?`,
      [usuarioId, `%${nome}%`]
    );
    const total = totalRows[0].total;

    if (!usuarioId) {
      return res.status(400).json({ erro: "ID do usuário é obrigatório." });
    }

    const [rows] = await db.query(
      `SELECT * FROM itensusuario 
      WHERE usuarioId = ? 
      and excluido=0
      ORDER BY id desc
      LIMIT ? OFFSET ?`,
      [usuarioId,limite, offset]
    );
    
    res.json({  
      itens: rows,
      total,
      pagina,
      paginas: Math.ceil(total / limite)
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar itens do usuário" });
  }
});

app.get('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.query;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    return res.json({
      mensagem: "✅ Login realizado com sucesso!",
      usuario: rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
});

app.get('/api/teste-banco', async (req, res) => {
  try {
    
    const [usuarios] = await db.query("SELECT * FROM usuario");
    
    const [itens] = await db.query("SELECT * FROM itensusuario");
        
    res.json({
      usuarios: usuarios,
      totalUsuarios: usuarios.length,
      itens: itens,
      totalItens: itens.length
    });
  } catch (error) {
    console.error('❌ Erro ao testar banco:', error);
    res.status(500).json({ erro: "Erro ao testar banco de dados", detalhes: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
