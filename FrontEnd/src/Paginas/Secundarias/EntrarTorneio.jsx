import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaCrown, FaMedal, FaStar, FaUsers, FaClock, FaChartLine } from "react-icons/fa";
import { IoClose, IoTrophy, IoSparkles } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "./Layout";
import imageTorneio from "../../assets/img.jpg"

export default function EntrarTorneio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const disciplinas = [
    {
      id: "matematica",
      nome: "Matemática",
      imagem: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cor: "from-blue-600 to-purple-600",
      participantes: 1240,
      nivel: "Intermediário",
      descricao: "Desafie suas habilidades matemáticas com problemas de álgebra, cálculo e lógica"
    },
    {
      id: "programacao",
      nome: "Programação",
      imagem: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cor: "from-emerald-600 to-cyan-600",
      participantes: 892,
      nivel: "Avançado",
      descricao: "Teste suas habilidades de codificação em algoritmos e estrutura de dados"
    },
    {
      id: "ingles",
      nome: "Língua Inglesa",
      imagem: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cor: "from-rose-600 to-orange-500",
      participantes: 1567,
      nivel: "Todos os níveis",
      descricao: "Aprimore seu vocabulário e compreensão da língua inglesa"
    }
  ];

  // Função para formatar nome para URL (remover acentos, espaços, etc)
  const formatarNomeParaURL = (nome) => {
    if (!nome) return "usuario";
    
    return nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^a-z0-9\-]/g, '') // Remove caracteres especiais
      .substring(0, 30); // Limita o tamanho
  };

  const abrirModal = (disciplina) => {
    setDisciplinaSelecionada(disciplina);
  };

  const escolherModelo = (tipo) => {
    setSelectedModel(tipo);
    
    // Verificar se o usuário está logado
    if (!user) {
      setShowLoginModal(true);
    } else {
      // Se estiver logado, redirecionar para o torneio específico
      redirecionarParaTorneio(tipo);
    }
  };

  const redirecionarParaTorneio = (tipo) => {
    if (!disciplinaSelecionada || !user) return;
    
    const disciplinaId = disciplinaSelecionada.id;
    const nomeUsuario = formatarNomeParaURL(
      user.nome || user.displayName || user.email?.split('@')[0] || "usuario"
    );
    
    let rota = "";
    
    // Definir a rota baseado na disciplina, modelo e nome do usuário
    if (tipo === "original") {
      rota = `/${disciplinaId}-original/${nomeUsuario}`;
    } else if (tipo === "premio") {
      rota = `/${disciplinaId}-premio/${nomeUsuario}`;
    }
    
    // Preparar dados adicionais para enviar na navegação
    const userData = {
      nome: user.nome || user.displayName || user.email?.split('@')[0] || "Usuário",
      nomeURL: nomeUsuario,
      email: user.email,
      id: user.uid || user.id,
      autenticado: true,
      disciplina: disciplinaSelecionada.nome,
      modelo: tipo === "original" ? "Original" : "Prêmio",
      disciplinaId: disciplinaId
    };
    
    // Navegar para a rota com os dados do usuário no estado
    navigate(rota, { 
      state: { 
        user: userData,
        disciplina: disciplinaSelecionada,
        modelo: tipo
      } 
    });
    
    // Fechar o modal
    setDisciplinaSelecionada(null);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    setDisciplinaSelecionada(null);
    navigate('/login');
  };

  const handleCadastroRedirect = () => {
    setShowLoginModal(false);
    setDisciplinaSelecionada(null);
    navigate('/cadastro');
  };

  useEffect(() => {
    document.body.style.overflow = disciplinaSelecionada ? "hidden" : "auto";
  }, [disciplinaSelecionada]);

  // Função para lidar com o redirecionamento após login
  useEffect(() => {
    // Se o usuário acabou de fazer login e há um modelo selecionado
    if (user && selectedModel && disciplinaSelecionada) {
      redirecionarParaTorneio(selectedModel);
      setSelectedModel(null);
    }
  }, [user, selectedModel, disciplinaSelecionada]);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-white">
        
        {/* Header Hero */}
    <div className="relative overflow-hidden -mx-8 -mt-8 h-[95vh] md:h-[90vh] lg:h-[90vh] text-white">
          {/* Background com imagem/vídeo */}
          <div className="absolute inset-0">
            <img 
              src={imageTorneio} 
              alt="Torcidas e competição esportiva"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradiente para contraste */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full translate-y-48 -translate-x-48" />
          
          {/* Conteúdo principal */}
          <div className="relative px-4 py-16 md:py-24 max-w-7xl mx-auto h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <IoTrophy className="text-6xl md:text-8xl text-yellow-400 drop-shadow-lg" />
                  <IoSparkles className="absolute -top-2 -right-2 text-2xl md:text-4xl text-yellow-300 animate-pulse" />
                </motion.div>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-lg"
              >
                Torneio <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent animate-gradient">Comaes</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto mb-8 drop-shadow-lg"
              >
                Desafie seus limites, mostre seu conhecimento e conquiste seu lugar no pódio
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 mb-10"
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/30 shadow-lg">
                  <FaUsers className="text-blue-300" />
                  <span className="font-semibold">+3.000 Competidores</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/30 shadow-lg">
                  <FaMedal className="text-yellow-300" />
                  <span className="font-semibold">Prêmios em Dinheiro</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/30 shadow-lg">
                  <FaChartLine className="text-green-300" />
                  <span className="font-semibold">Ranking Atualizado</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Seta para baixo */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white/80 drop-shadow-lg cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight * 0.85,
                    behavior: 'smooth'
                  });
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Grid de Disciplinas */}
          <div className="mb-12 px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Escolha Sua Disciplina
            </h2>
            <p className="text-gray-600 text-center mb-10 text-lg">
              Clique em uma disciplina para ver os modelos de torneio disponíveis
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-stretch gap-6 max-w-6xl mx-auto">
              {disciplinas.map((disc, index) => (
                <motion.div
                  key={disc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 w-full sm:w-64 md:w-72 lg:w-80"
                  onClick={() => abrirModal(disc)}
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={disc.imagem}
                      alt={disc.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${disc.cor} opacity-70`} />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-semibold">{disc.nivel}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">{disc.nome}</h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base text-center h-12 md:h-14 line-clamp-2">{disc.descricao}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                          {disc.participantes.toLocaleString()} participantes
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-shadow text-sm md:text-base w-full sm:w-auto">
                        Ver Torneios
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MODAL de Seleção de Torneio */}
          <AnimatePresence>
            {disciplinaSelecionada && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
                onClick={() => setDisciplinaSelecionada(null)}
              >
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  className="relative bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl z-[10000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setDisciplinaSelecionada(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <IoClose size={30} />
                  </button>

                  <div className="relative mb-6">
                    <img
                      src={disciplinaSelecionada.imagem}
                      alt={disciplinaSelecionada.nome}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                        {disciplinaSelecionada.nome}
                      </h2>
                    </div>
                  </div>

                  <p className="text-gray-600 text-center mb-6">
                    Escolha qual modelo de torneio pretende usar.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MODELO ORIGINAL */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-5 border rounded-2xl bg-gray-50 shadow-md"
                    >
                      <p className="text-center font-semibold text-blue-700 mb-2">
                        Modelo Original - Gratuito
                      </p>

                      <ul className="text-gray-600 text-sm space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-blue-600" />
                          Perguntas fixas
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-blue-600" />
                          Tempo padrão
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-blue-600" />
                          Pontuação base
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-blue-600" />
                          Ranking simples
                        </li>
                      </ul>

                      <button
                        onClick={() => escolherModelo("original")}
                        className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Entrar no Original
                      </button>
                    </motion.div>

                    {/* MODELO PRÊMIO */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-5 border rounded-2xl bg-gray-50 shadow-md"
                    >
                      <p className="text-center font-semibold text-green-700 mb-2">
                        Modelo Prêmio - AOA 500
                      </p>

                      <ul className="text-gray-600 text-sm space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          Perguntas dinâmicas
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          Bônus de velocidade
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          Ranking premium
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          Estatísticas avançadas
                        </li>
                      </ul>

                      <button
                        onClick={() => escolherModelo("premio")}
                        className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Entrar no Prêmio
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MODAL de Login Obrigatório */}
          <AnimatePresence>
            {showLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
                onClick={() => setShowLoginModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-xl z-[10000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <IoClose size={24} />
                  </button>

                  <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                      <IoTrophy className="text-3xl text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Acesso Restrito ao Torneio
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      Para participar do {selectedModel === 'original' ? 'Modelo Original' : 'Modelo Prêmio'} do torneio de{" "}
                      {disciplinaSelecionada?.nome}, você precisa estar autenticado na plataforma COMAES.
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Benefícios do COMAES:</h3>
                      <ul className="text-sm text-gray-700 space-y-1 text-left">
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          Acesso a todos os torneios
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          Acompanhamento de ranking
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          Histórico de participações
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          Conquistas e certificados
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Fazer Login
                    </button>
                    
                    <button
                      onClick={handleCadastroRedirect}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Cadastrar-se
                    </button>
                    
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}