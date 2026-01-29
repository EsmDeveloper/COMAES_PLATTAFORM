import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ===== IMPORTAR TODOS OS MODELS =====
import Usuario from "./models/User.js";
import aiEvaluator from './utils/aiEvaluator.js';
import Funcao from "./models/Funcao.js";
import Sessao from "./models/Sessao.js";
import RedefinicaoSenha from "./models/RedefinicaoSenha.js";
import ConfiguracaoUsuario from "./models/ConfiguracaoUsuario.js";
import Torneio from "./models/Torneio.js";
import ParticipanteTorneio from "./models/ParticipanteTorneio.js";
import Noticia from "./models/Noticia.js";
import Comentario from "./models/Comentario.js";
import Midia from "./models/Midia.js";
import Teste from "./models/Teste.js";
import Pergunta from "./models/Pergunta.js";
import TentativaTeste from "./models/TentativaTeste.js";
import TicketSuporte from "./models/TicketSuporte.js";
import Notificacao from "./models/Notificacao.js";
import Conquista from "./models/Conquista.js";
import ConquistaUsuario from "./models/ConquistaUsuario.js";
import LogAtividade from "./models/LogAtividade.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(cors());

// ===== UPLOAD & STORAGE =====
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ===== ASSOCIAÇÕES DO SEQUELIZE =====
const setupAssociations = () => {
  // Usuario <-> Funcao
  Funcao.hasMany(Usuario, { foreignKey: 'funcao_id', as: 'usuarios' });
  Usuario.belongsTo(Funcao, { foreignKey: 'funcao_id', as: 'funcao' });

  // Usuario <-> Sessao
  Usuario.hasMany(Sessao, { foreignKey: 'usuario_id', as: 'sessoes' });
  Sessao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // Usuario <-> RedefinicaoSenha
  Usuario.hasMany(RedefinicaoSenha, { foreignKey: 'usuario_id', as: 'redefinicoes' });
  RedefinicaoSenha.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // Usuario <-> ConfiguracaoUsuario (1:1)
  Usuario.hasOne(ConfiguracaoUsuario, { foreignKey: 'usuario_id', as: 'configuracao' });
  ConfiguracaoUsuario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // Torneio <-> Usuario (criador)
  Usuario.hasMany(Torneio, { foreignKey: 'criado_por', as: 'torneiosCriados' });
  Torneio.belongsTo(Usuario, { foreignKey: 'criado_por', as: 'criador' });

  // Torneio <-> ParticipanteTorneio
  Torneio.hasMany(ParticipanteTorneio, { foreignKey: 'torneio_id', as: 'participantes' });
  ParticipanteTorneio.belongsTo(Torneio, { foreignKey: 'torneio_id', as: 'torneio' });

  // ParticipanteTorneio <-> Usuario
  Usuario.hasMany(ParticipanteTorneio, { foreignKey: 'usuario_id', as: 'torneios' });
  ParticipanteTorneio.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // Noticia <-> Usuario (autor)
  Usuario.hasMany(Noticia, { foreignKey: 'autor_id', as: 'noticias' });
  Noticia.belongsTo(Usuario, { foreignKey: 'autor_id', as: 'autor' });

  // Comentario <-> Usuario
  Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
  Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // Comentario hierárquico (self-join)
  Comentario.hasMany(Comentario, { foreignKey: 'comentario_pai_id', as: 'respostas' });
  Comentario.belongsTo(Comentario, { foreignKey: 'comentario_pai_id', as: 'pai' });

  // Teste <-> Usuario (criador)
  Usuario.hasMany(Teste, { foreignKey: 'criado_por', as: 'testesCriados' });
  Teste.belongsTo(Usuario, { foreignKey: 'criado_por', as: 'criador' });

  // Teste <-> Pergunta
  Teste.hasMany(Pergunta, { foreignKey: 'teste_id', as: 'perguntas' });
  Pergunta.belongsTo(Teste, { foreignKey: 'teste_id', as: 'teste' });

  // TentativaTeste <-> Usuario
  Usuario.hasMany(TentativaTeste, { foreignKey: 'usuario_id', as: 'tentativas' });
  TentativaTeste.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // TentativaTeste <-> Teste
  Teste.hasMany(TentativaTeste, { foreignKey: 'teste_id', as: 'tentativas' });
  TentativaTeste.belongsTo(Teste, { foreignKey: 'teste_id', as: 'teste' });

  // TicketSuporte <-> Usuario (autor)
  Usuario.hasMany(TicketSuporte, { foreignKey: 'usuario_id', as: 'ticketsEnviados' });
  TicketSuporte.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario', onDelete: 'SET NULL' });

  // TicketSuporte <-> Usuario (atribuído_para)
  Usuario.hasMany(TicketSuporte, { foreignKey: 'atribuido_para', as: 'ticketsAtribuidos' });
  TicketSuporte.belongsTo(Usuario, { foreignKey: 'atribuido_para', as: 'atribuido', onDelete: 'SET NULL' });

  // Notificacao <-> Usuario
  Usuario.hasMany(Notificacao, { foreignKey: 'usuario_id', as: 'notificacoes' });
  Notificacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // ConquistaUsuario <-> Usuario
  Usuario.hasMany(ConquistaUsuario, { foreignKey: 'usuario_id', as: 'conquistas' });
  ConquistaUsuario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  // ConquistaUsuario <-> Conquista
  Conquista.hasMany(ConquistaUsuario, { foreignKey: 'conquista_id', as: 'usuarios' });
  ConquistaUsuario.belongsTo(Conquista, { foreignKey: 'conquista_id', as: 'conquista' });

  // ConquistaUsuario <-> Usuario (concedido_por)
  Usuario.hasMany(ConquistaUsuario, { foreignKey: 'concedido_por', as: 'conquistasConcedidas' });
  ConquistaUsuario.belongsTo(Usuario, { foreignKey: 'concedido_por', as: 'concedidoPor', onDelete: 'SET NULL' });

  // LogAtividade <-> Usuario
  Usuario.hasMany(LogAtividade, { foreignKey: 'usuario_id', as: 'logs' });
  LogAtividade.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario', onDelete: 'SET NULL' });
};

// ===== ROTAS PÚBLICAS =====
app.get("/", (req, res) => {
  res.json({
    message: "API Comaes funcionando!",
    status: "online",
    version: "2.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message
    });
  }
});

// ===== AUTENTICAÇÃO =====
app.post('/auth/registro', async (req, res) => {
  try {
    const { nome, telefone, email, nascimento, sexo, escola, password } = req.body;

    if (!nome || !telefone || !email || !nascimento || !sexo || !password) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios em falta.' });
    }

    const exists = await Usuario.findOne({ where: { [Op.or]: [{ email }, { telefone }] } });
    if (exists) {
      return res.status(409).json({ success: false, error: 'Email ou telefone já registado.' });
    }

    const hash_senha = await bcrypt.hash(password, 10);
    const novoUsuario = await Usuario.create({
      nome,
      telefone,
      email,
      nascimento,
      sexo,
      escola: escola || null,
      password: hash_senha
    });

    res.status(201).json({ success: true, message: 'Usuário criado com sucesso', data: novoUsuario });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ success: false, error: 'Dados incompletos.' });

    const user = await Usuario.unscoped().findOne({
      where: { [Op.or]: [{ email: usuario }, { telefone: usuario }] }
    });
    if (!user) return res.status(401).json({ success: false, error: 'Usuário não encontrado.' });

    const match = await bcrypt.compare(senha, user.password);
    if (!match) return res.status(401).json({ success: false, error: 'Senha inválida.' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    const { password, ...userSafe } = user.get({ plain: true });

    res.json({ success: true, data: userSafe, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/auth/recover', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email é obrigatório.' });

    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, error: 'Conta não encontrada.' });

    res.json({ success: true, message: 'Verifique seu email para instruções de recuperação.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== UPLOAD AVATAR =====
app.post('/usuarios/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = String(req.params.id);
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, error: 'Token ausente.' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Token inválido.' });
    }

    if (String(payload.id) !== userId) return res.status(403).json({ success: false, error: 'Permissão negada.' });
    if (!req.file) return res.status(400).json({ success: false, error: 'Arquivo não enviado.' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await Usuario.update({ imagem: fileUrl }, { where: { id: userId } });

    const updated = await Usuario.findByPk(userId);
    const { password, ...safe } = updated.get({ plain: true });

    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CRUD USUARIOS =====
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({ success: true, count: usuarios.length, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CRUD TORNEIOS =====
app.get('/torneios', async (req, res) => {
  try {
    const torneios = await Torneio.findAll({ include: ['criador', 'participantes'] });
    res.json({ success: true, data: torneios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/torneios/:id', async (req, res) => {
  try {
    const torneio = await Torneio.findByPk(req.params.id, { include: ['criador', 'participantes'] });
    if (!torneio) return res.status(404).json({ success: false, error: 'Torneio não encontrado.' });
    res.json({ success: true, data: torneio });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/torneios', async (req, res) => {
  try {
    const { titulo, slug, descricao, inicia_em, termina_em, maximo_participantes, criado_por } = req.body;

    if (!titulo || !slug || !criado_por) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios em falta.' });
    }

    const novo = await Torneio.create({
      titulo,
      slug,
      descricao,
      inicia_em,
      termina_em,
      maximo_participantes,
      criado_por,
      status: 'rascunho'
    });

    res.status(201).json({ success: true, data: novo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== TORNEIOS: JOIN, PARTICIPANTES, RANKING, SUBMIT respostas =====
app.post('/torneios/:id/join', async (req, res) => {
  try {
    const torneioId = req.params.id;
    const { usuario_id, disciplina_competida } = req.body;
    if (!usuario_id) return res.status(400).json({ success: false, error: 'usuario_id é obrigatório.' });

    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) return res.status(404).json({ success: false, error: 'Torneio não encontrado.' });

    const count = await ParticipanteTorneio.count({ where: { torneio_id: torneioId, status: 'confirmado' } });
    if (torneio.maximo_participantes && count >= torneio.maximo_participantes) {
      return res.status(400).json({ success: false, error: 'Torneio atingiu o limite de participantes.' });
    }

    const exists = await ParticipanteTorneio.findOne({ where: { torneio_id: torneioId, usuario_id } });
    if (exists) return res.json({ success: true, data: exists, message: 'Já inscrito.' });

    const participante = await ParticipanteTorneio.create({ 
      torneio_id: torneioId, 
      usuario_id, 
      status: 'confirmado',
      disciplina_competida: disciplina_competida || null
    });
    res.status(201).json({ success: true, data: participante });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/torneios/:id/participantes', async (req, res) => {
  try {
    const torneioId = req.params.id;
    const participantes = await ParticipanteTorneio.findAll({ where: { torneio_id: torneioId }, include: ['usuario'] });
    res.json({ success: true, data: participantes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/torneios/:id/usuario/:userId', async (req, res) => {
  try {
    const { id: torneioId, userId } = req.params;
    const participante = await ParticipanteTorneio.findOne({
      where: { torneio_id: torneioId, usuario_id: userId },
      include: ['usuario']
    });
    if (!participante) return res.status(404).json({ success: false, error: 'Usuário não participando deste torneio.' });
    res.json({ success: true, data: participante });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
  }
});

app.get('/torneios/:id/ranking', async (req, res) => {
  try {
    const torneioId = req.params.id;
    const participantes = await ParticipanteTorneio.findAll({ 
      where: { torneio_id: torneioId, status: 'confirmado' }, 
      include: ['usuario'], 
      order: [['pontuacao', 'DESC']] 
    });
    // atribuir posições
    let pos = 1;
    const ranked = participantes.map(p => ({ 
      id: p.id,
      posicao: pos++, 
      usuario: p.usuario, 
      pontuacao: Number(p.pontuacao),
      casos_resolvidos: p.casos_resolvidos,
      disciplina_competida: p.disciplina_competida
    }));
    res.json({ success: true, data: ranked });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/torneios/:id/usuario/:usuario_id', async (req, res) => {
  try {
    const { id: torneioId, usuario_id: usuarioId } = req.params;
    const participante = await ParticipanteTorneio.findOne({ 
      where: { torneio_id: torneioId, usuario_id: usuarioId },
      include: ['usuario']
    });
    if (!participante) {
      return res.status(404).json({ success: false, error: 'Participante não encontrado.' });
    }
    
    // Get user's position in ranking
    const allParticipantes = await ParticipanteTorneio.findAll({ 
      where: { torneio_id: torneioId, status: 'confirmado' },
      order: [['pontuacao', 'DESC']]
    });
    let posicao = allParticipantes.findIndex(p => p.usuario_id === Number(usuarioId)) + 1;
    
    res.json({ success: true, data: { ...participante.get({ plain: true }), posicao } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submeter respostas do participante - avalia e atualiza pontuação
app.post('/torneios/:id/submit', async (req, res) => {
  try {
    const torneioId = req.params.id;
    const { usuario_id, respostas } = req.body;
    if (!usuario_id || !Array.isArray(respostas)) return res.status(400).json({ success: false, error: 'usuario_id e respostas são obrigatórios.' });

    // respostas: [{ pergunta_id, resposta }]
    const itemsForAI = [];
    let totalScore = 0;
    for (const r of respostas) {
      const pergunta = await Pergunta.findByPk(r.pergunta_id);
      if (!pergunta) continue;
      // se existe resposta correta no banco, compare
      if (pergunta.resposta_correta) {
        const correct = JSON.stringify(pergunta.resposta_correta);
        const given = JSON.stringify(r.resposta);
        if (correct === given) {
          totalScore += (pergunta.pontos || 1);
        }
      } else {
        itemsForAI.push({ pergunta_id: r.pergunta_id, texto: pergunta.texto_pergunta, resposta: r.resposta, pontos: pergunta.pontos || 1 });
      }
    }

    // Se houver perguntas sem gabarito, pedir IA (se disponível)
    if (itemsForAI.length > 0) {
      const aiResults = await aiEvaluator.evaluate(itemsForAI);
      for (const ai of aiResults) {
        // ai.score between 0..1
        totalScore += (ai.score || 0) * (ai.pontos || 1);
      }
    }

    // Atualizar participante
    const participante = await ParticipanteTorneio.findOne({ where: { torneio_id: torneioId, usuario_id } });
    if (!participante) {
      // criar participante caso não exista
      await ParticipanteTorneio.create({ torneio_id: torneioId, usuario_id, status: 'confirmado', pontuacao: totalScore });
    } else {
      participante.pontuacao = (Number(participante.pontuacao) || 0) + totalScore;
      await participante.save();
    }

    // armazenar tentativa (registro simples)
    await TentativaTeste.create({ usuario_id, teste_id: null, respostas, pontuacao: totalScore, status: 'concluida', concluido_em: new Date() });

    res.json({ success: true, message: 'Respostas avaliadas', pontuacao: totalScore });
  } catch (error) {
    console.error('Erro submit torneio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CRUD TESTES =====
app.get('/testes', async (req, res) => {
  try {
    const testes = await Teste.findAll({ include: ['criador', 'perguntas'] });
    res.json({ success: true, data: testes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/testes/:id', async (req, res) => {
  try {
    const teste = await Teste.findByPk(req.params.id, { include: ['criador', 'perguntas'] });
    if (!teste) return res.status(404).json({ success: false, error: 'Teste não encontrado.' });
    res.json({ success: true, data: teste });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/testes', async (req, res) => {
  try {
    const { titulo, assunto, nivel, criado_por } = req.body;

    if (!titulo || !assunto || !criado_por) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios em falta.' });
    }

    const novo = await Teste.create({ titulo, assunto, nivel, criado_por });
    res.status(201).json({ success: true, data: novo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== INICIALIZAÇÃO =====
async function startServer() {
  try {
    console.log("🔄 Inicializando servidor...");

    await sequelize.authenticate();
    console.log("✅ Banco de dados conectado!");

    // Setup associações
    setupAssociations();

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados!");

    const [tables] = await sequelize.query("SHOW TABLES");
    console.log("📊 Tabelas no banco:");
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando: http://localhost:${port}`);
      console.log(`📡 Health: http://localhost:${port}/health`);
      console.log(`📋 Usuários: http://localhost:${port}/usuarios`);
      console.log(`🏆 Torneios: http://localhost:${port}/torneios`);
      console.log(`📚 Testes: http://localhost:${port}/testes`);
    });
  } catch (error) {
    console.error("❌ Erro na inicialização:", error.message);
    process.exit(1);
  }
}

startServer();
