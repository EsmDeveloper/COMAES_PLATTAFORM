import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaSignOutAlt, FaPlay, FaRedo, FaExpand, FaCompress } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TOTAL_TORNEIO = 7 * 24 * 60 * 60; // 7 dias em segundos
const TEMPO_QUESTAO = 90; // 1.5 minutos por questão
const DISCIPLINA_TORNEIO = 'programação';

// Questões de programação de exemplo
const questoesProgramacao = [
  { 
    id: 1, 
    titulo: "Soma de Dois Números",
    enunciado: "Escreva uma função que receba dois números inteiros e retorne a soma deles.",
    linguagem: "javascript",
    codigoInicial: `function soma(a, b) {
  // Complete a função aqui
  return 0;
}`,
    testes: [
      { entrada: "soma(5, 3)", saidaEsperada: "8" },
      { entrada: "soma(-2, 7)", saidaEsperada: "5" },
      { entrada: "soma(0, 0)", saidaEsperada: "0" }
    ]
  },
  { 
    id: 2, 
    titulo: "Verificar Número Par",
    enunciado: "Crie uma função que verifique se um número é par. Retorne true se for par, false caso contrário.",
    linguagem: "javascript",
    codigoInicial: `function ehPar(numero) {
  // Complete a função aqui
  return false;
}`,
    testes: [
      { entrada: "ehPar(4)", saidaEsperada: "true" },
      { entrada: "ehPar(7)", saidaEsperada: "false" },
      { entrada: "ehPar(0)", saidaEsperada: "true" }
    ]
  },
  { 
    id: 3, 
    titulo: "Fatorial de um Número",
    enunciado: "Implemente uma função recursiva que calcule o fatorial de um número inteiro não negativo.",
    linguagem: "javascript",
    codigoInicial: `function fatorial(n) {
  // Complete a função aqui
  return 1;
}`,
    testes: [
      { entrada: "fatorial(5)", saidaEsperada: "120" },
      { entrada: "fatorial(0)", saidaEsperada: "1" },
      { entrada: "fatorial(1)", saidaEsperada: "1" }
    ]
  }
];

export default function ProgramacaoOriginal() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const editorRef = useRef(null);

  // Estados para dados do torneio
  const [torneio, setTorneio] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [torneioTime, setTorneioTime] = useState(TOTAL_TORNEIO);
  const [questaoIndex, setQuestaoIndex] = useState(0);
  const [questaoTime, setQuestaoTime] = useState(TEMPO_QUESTAO);
  const [nivelSelecionado, setNivelSelecionado] = useState("Fácil");
  const [resultado, setResultado] = useState("");
  const [pontuacao, setPontuacao] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [mostrarDados, setMostrarDados] = useState(false);
  const [expandido, setExpandido] = useState(false);
  
  const [codigo, setCodigo] = useState(questoesProgramacao[0]?.codigoInicial || "");
  const [saida, setSaida] = useState("");
  const [executando, setExecutando] = useState(false);
  const [testesPassados, setTestesPassados] = useState(0);
  const [totalTestes, setTotalTestes] = useState(questoesProgramacao[0]?.testes.length || 0);

  // Fetch torneios por disciplina
  useEffect(() => {
    const fetchTorneos = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/torneios');
        const data = await res.json();
        
        // Filtrar torneios ativos da disciplina de programação
        const torneiosAtivos = Array.isArray(data.data) 
          ? data.data.filter(t => 
              t.status === 'ativo' && 
              t.titulo.toLowerCase().includes(DISCIPLINA_TORNEIO)
            )
          : [];
        
        if (torneiosAtivos.length > 0) {
          const t = torneiosAtivos[0];
          setTorneio(t);
          
          // Fetch ranking do torneio
          const rankRes = await fetch(`http://localhost:3000/api/torneios/${t.id}/ranking`);
          const rankData = await rankRes.json();
          setRanking(Array.isArray(rankData.data) ? rankData.data : []);
          
          // Fetch stats do usuário neste torneio
          const userRes = await fetch(`http://localhost:3000/api/torneios/${t.id}/usuario/${user.id}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserStats(userData.data || null);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar torneios:', err);
        setLoading(false);
        // Dados simulados para desenvolvimento
        setTorneio({
          id: 'simulado-1',
          titulo: 'Torneio de Programação',
          status: 'ativo',
          dataInicio: new Date().toISOString(),
          dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        setRanking([
          { id: 1, usuario: { nome: 'Cornélio Mbongo', avatar: null }, pontuacao: 7158, posicao: 1 },
          { id: 2, usuario: { nome: 'José Mariche', avatar: null }, pontuacao: 6914, posicao: 2 },
          { id: 3, usuario: { nome: 'Esménio Manuel', avatar: null }, pontuacao: 6822, posicao: 3 },
        ]);
        
        setUserStats({
          pontuacao: 5000,
          posicao: 5,
          casos_resolvidos: 15
        });
      }
    };
    
    fetchTorneos();
  }, [user?.id, token]);

  // Temporizador do torneio
  useEffect(() => {
    const interval = setInterval(() => {
      setTorneioTime((prev) => {
        if (prev <= 0) {
          setModalAberto(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Temporizador da questão
  useEffect(() => {
    const interval = setInterval(() => {
      setQuestaoTime((prev) => {
        if (prev <= 0) {
          handleNextQuestao();
          return TEMPO_QUESTAO;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [questaoIndex]);

  // Atualiza o código quando muda a questão
  useEffect(() => {
    if (questoesProgramacao[questaoIndex]) {
      setCodigo(questoesProgramacao[questaoIndex].codigoInicial);
      setSaida("");
      setResultado("");
      setPontuacao(null);
      setTestesPassados(0);
      setTotalTestes(questoesProgramacao[questaoIndex].testes.length);
    }
  }, [questaoIndex]);

  const UM_DIA = 24 * 60 * 60;

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatSeconds = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNextQuestao = () => {
    setQuestaoIndex((prev) => (prev + 1 < questoesProgramacao.length ? prev + 1 : 0));
    setQuestaoTime(TEMPO_QUESTAO);
    setExecutando(false);
  };

  const executarCodigo = () => {
    setExecutando(true);
    setSaida("Executando código...\n");
    
    // Simulação da execução do código
    setTimeout(() => {
      const questaoAtual = questoesProgramacao[questaoIndex];
      let passou = 0;
      let output = "";
      
      // Simulação de testes
      questaoAtual.testes.forEach((teste, index) => {
        output += `Teste ${index + 1}: ${teste.entrada}\n`;
        
        // Simulação de resultados - em produção seria executado em sandbox
        const chanceAcerto = 0.7; // 70% de chance de acerto
        const acertou = Math.random() < chanceAcerto;
        
        if (acertou) {
          output += `  ✅ Resultado esperado: ${teste.saidaEsperada}\n`;
          output += `  ✅ Teste passou!\n\n`;
          passou++;
        } else {
          output += `  ❌ Resultado esperado: ${teste.saidaEsperada}\n`;
          output += `  ❌ Teste falhou!\n\n`;
        }
      });
      
      output += `\n${passou} de ${questaoAtual.testes.length} testes passaram.`;
      
      setSaida(output);
      setTestesPassados(passou);
      
      // Calcula pontuação baseada nos testes passados
      const percentual = (passou / questaoAtual.testes.length) * 100;
      let pontuacaoCalculada = 0;
      let resultadoTexto = "";
      
      if (percentual === 100) {
        pontuacaoCalculada = 10;
        resultadoTexto = "Perfeito! Todos os testes passaram!";
      } else if (percentual >= 70) {
        pontuacaoCalculada = 7;
        resultadoTexto = "Bom! A maioria dos testes passou.";
      } else if (percentual >= 40) {
        pontuacaoCalculada = 4;
        resultadoTexto = "Razoável. Alguns testes passaram.";
      } else {
        pontuacaoCalculada = 1;
        resultadoTexto = "Precisa melhorar. Poucos testes passaram.";
      }
      
      setPontuacao(pontuacaoCalculada);
      setResultado(resultadoTexto);
      setExecutando(false);
    }, 1500);
  };

  const resetarCodigo = () => {
    setCodigo(questoesProgramacao[questaoIndex].codigoInicial);
    setSaida("");
    setResultado("");
    setPontuacao(null);
    setTestesPassados(0);
  };

  const rankingData = [
    { id: 1, usuario: { nome: 'Cornélio Mbongo', avatar: null }, pontuacao: 7158, posicao: 1 },
    { id: 2, usuario: { nome: 'José Mariche', avatar: null }, pontuacao: 6914, posicao: 2 },
    { id: 3, usuario: { nome: 'Esménio Manuel', avatar: null }, pontuacao: 6822, posicao: 3 },
    { id: 4, usuario: { nome: 'Celso Huma', avatar: null }, pontuacao: 6473, posicao: 4 },
    { id: 5, usuario: { nome: 'Maria Fonseca', avatar: null }, pontuacao: 6128, posicao: 5 },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white shadow-md">
        <div className="flex items-center justify-between p-4">
          {/* Botão Sair */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 border border-white px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded hover:bg-white hover:text-blue-600 transition"
          >
            <FaSignOutAlt className="text-xs sm:text-sm md:text-base" />
            Sair do Torneio
          </button>

          {/* Temporizador do torneio centralizado */}
          <div className="flex flex-col items-center" translate="no">
            <p className="text-xs md:text-xs lg:text-sm">Tempo restante do torneio</p>
            <h2 className="text-lg md:text-base lg:text-xl font-bold">{formatTime(torneioTime)}</h2>
          </div>

          {/* Modelo Original à direita */}
          <div className="flex items-center gap-2 relative">
            <div className="bg-white text-blue-600 font-bold px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded-full flex items-center gap-1 shadow-md">
              Modelo Original
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Barra de progresso do torneio */}
        <div className="w-full h-3 bg-white/30">
          <div
            className={`h-3 transition-all duration-1000 ${torneioTime <= UM_DIA ? "bg-red-500" : "bg-green-400"}`}
            style={{ width: `${(torneioTime / TOTAL_TORNEIO) * 100}%` }}
          />
        </div>
      </div>

      {/* Modal de Sem Torneio */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Sem torneio no momento</h2>
            <p className="mb-4">Não há torneios ativos no momento. Volte mais tarde!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Voltar ao Home
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR ESQUERDA - RANKING */}
        <div className="hidden lg:block w-80 bg-black text-white shadow-lg p-3 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-700 pb-1">Ranking dos Alunos</h2>
          <table className="w-full table-auto rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 px-2 py-2 text-left">Pos</th>
                <th className="px-2 py-2 text-left">Nome</th>
                <th className="w-1/6 px-2 py-2 text-left">Pts</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {rankingData.map((participante) => (
                <tr key={participante.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-200">
                  <td className="px-2 py-2 font-semibold">{participante.posicao}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {participante.usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="truncate">{participante.usuario.nome}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-blue-500 font-semibold">{participante.pontuacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ÁREA DE EXERCÍCIO - COMPILADOR DE PROGRAMAÇÃO */}
        <div className="flex-1 flex flex-col items-center p-4 overflow-auto space-y-4">
          {/* HEADER */}
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-normal text-gray-800 text-center">Torneio de Programação</h1>
            
            {/* CHIPS DE NÍVEL */}
            <div className="flex gap-2 flex-wrap align-items-center justify-center">
              {[
                { nivel: "Fácil", pts: 10 },
                { nivel: "Médio", pts: 20 },
                { nivel: "Difícil", pts: 30 }
              ].map((item) => (
                <button
                  key={item.nivel}
                  onClick={() => setNivelSelecionado(item.nivel)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                    nivelSelecionado === item.nivel
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.nivel} • {item.pts} pts
                </button>
              ))}
            </div>
          </div>

          {/* QUESTÃO / ENUNCIADO */}
          {questoesProgramacao[questaoIndex] && (
            <div className="w-full max-w-6xl bg-gradient-to-r from-indigo-50 to-blue-100 border-l-4 border-blue-600 rounded-xl shadow p-4 space-y-2">
              <h3 className="text-lg font-bold text-blue-700">{questoesProgramacao[questaoIndex].titulo}</h3>
              <p className="text-sm md:text-base text-gray-800">{questoesProgramacao[questaoIndex].enunciado}</p>
              <div className="flex flex-wrap gap-3 text-xs mt-2">
                <span className="bg-white px-3 py-1 rounded-full shadow-sm"><strong>Linguagem:</strong> JavaScript</span>
                <span className="bg-white px-3 py-1 rounded-full shadow-sm"><strong>Testes:</strong> {testesPassados}/{totalTestes}</span>
              </div>
            </div>
          )}

          {/* EDITOR + SAÍDA */}
          <div className={`w-full max-w-6xl grid ${expandido ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
            {/* EDITOR */}
            <div className={`bg-white rounded-xl shadow-md p-3 flex flex-col ${expandido ? "col-span-1 min-h-[80vh]" : "min-h-[350px]"}`}>
              <div className="flex items-center justify-between mb-2 border-b pb-2">
                <h3 className="font-semibold text-gray-700">Editor de Código</h3>
                <div className="flex items-center gap-2">
                  <button onClick={resetarCodigo} className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-red-100 text-gray-700 transition">
                    <FaRedo /> Resetar
                  </button>
                  <button onClick={() => setExpandido(!expandido)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-blue-100 text-gray-700 transition">
                    {expandido ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
              <textarea
                ref={editorRef}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="flex-1 w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck="false"
              />
            </div>

            {/* SAÍDA */}
            {!expandido && (
              <div className="bg-white rounded-xl shadow-md p-3 flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between mb-2 border-b pb-2">
                  <h3 className="font-semibold text-gray-700" translate="no">Saída do Programa</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                    {executando ? "Executando..." : "Pronto"}
                  </span>
                </div>
                <pre className="flex-1 bg-black rounded-lg p-3 overflow-auto text-green-400 font-mono text-sm">
                  <code className="whitespace-pre-wrap break-words">
                    {saida || "A saída do seu código aparecerá aqui..."}
                  </code>
                </pre>
              </div>
            )}
          </div>

          {/* TEMPORIZADOR */}
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Tempo restante</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${questaoTime < 10 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                {formatSeconds(questaoTime)}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${questaoTime < 10 ? "bg-red-500" : "bg-blue-600"}`}
                style={{ width: `${(questaoTime / TEMPO_QUESTAO) * 100}%` }} />
            </div>
          </div>

          {/* BOTÃO EXECUTAR */}
          <div className="w-full max-w-6xl">
            <button
              onClick={executarCodigo}
              disabled={executando}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                executando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FaPlay />
              {executando ? "Executando..." : "Executar Código"}
            </button>
          </div>

          {/* RESULTADO */}
          {resultado && (
            <div className="w-full max-w-6xl bg-white border rounded-xl shadow-md p-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <span className="font-semibold text-blue-700">{resultado}</span>
                {pontuacao !== null && (
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-700">{pontuacao} pts</span>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {testesPassados}/{totalTestes} testes
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOTÕES MOBILE */}
          <div className="flex flex-col sm:flex-row w-full max-w-5xl justify-between gap-3 mt-4 lg:hidden">
            <button onClick={() => setMostrarRanking(true)} className="flex-1 bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg shadow-md text-sm transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Ranking
            </button>
            <button onClick={() => setMostrarDados(true)} className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ver seus Dados
            </button>
          </div>
        </div>

        {/* SIDEBAR DIREITA - INFO USUÁRIO DINÂMICA */}
        <div className="hidden lg:flex w-64 bg-white text-gray-800 shadow-lg p-4 overflow-y-auto flex-col items-center space-y-3">
          {/* Foto e Identidade */}
          <div className="flex flex-col items-center mb-3">
            <div className="w-20 h-20 rounded-full mb-2 border-2 border-blue-400 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {user?.nome ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
            </div>
            <h3 className="text-lg font-bold mt-2">{user?.nome || "Usuário"}</h3>
          </div>

          {/* Estatísticas */}
          <div className="w-full flex flex-col gap-4 items-center">
            {[
              { valor: userStats?.pontuacao || 0, label: "Pontuação", cor: "#3b82f6", max: 10000 },
              { valor: userStats?.posicao || 0, label: "Posição", cor: "#3b82f6", max: 100 },
              { valor: userStats?.casos_resolvidos || 0, label: "Casos Resolvidos", cor: "#3b82f6", max: 100 }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-blue-200 p-2 flex flex-col items-center gap-1 w-40">
                <div className="w-14 h-14">
                  <CircularProgressbar 
                    value={item.valor} 
                    maxValue={item.max}
                    text={`${item.valor}`} 
                    styles={buildStyles({
                      textSize: '18px',
                      textColor: '#333',
                      pathColor: item.cor,
                      trailColor: '#e5e5e5',
                    })}
                  />
                </div>
                <span className="text-xs font-semibold text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OVERLAY SIDEBAR ESQUERDA (RANKING MOBILE) */}
      <div className={`fixed inset-0 z-50 flex transition-all duration-300 ${mostrarRanking ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mostrarRanking ? "opacity-100" : "opacity-0"}`} onClick={() => setMostrarRanking(false)} />
        <div className={`relative w-80 bg-black text-white p-4 overflow-y-auto transform transition-transform duration-300 ${mostrarRanking ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setMostrarRanking(false)} className="absolute top-2 right-2 text-white text-xl">✕</button>
          <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-700 pb-1">Ranking dos Alunos</h2>
          <table className="w-full table-auto rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 px-2 py-2 text-left">Pos</th>
                <th className="px-2 py-2 text-left">Nome</th>
                <th className="w-1/6 px-2 py-2 text-left">Pts</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {rankingData.map((participante) => (
                <tr key={participante.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-200">
                  <td className="px-2 py-2 font-semibold">{participante.posicao}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {participante.usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="truncate">{participante.usuario.nome}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-blue-500 font-semibold">{participante.pontuacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OVERLAY SIDEBAR DIREITA (DADOS USUÁRIO MOBILE) */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${mostrarDados ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mostrarDados ? "opacity-100" : "opacity-0"}`} onClick={() => setMostrarDados(false)} />
        <div className={`relative w-72 bg-white text-gray-800 p-4 overflow-y-auto transform transition-transform duration-300 ${mostrarDados ? "translate-x-0" : "translate-x-full"}`}>
          <button onClick={() => setMostrarDados(false)} className="absolute top-2 right-2 text-xl">✕</button>
          <div className="flex flex-col items-center mb-3">
            <div className="w-20 h-20 rounded-full mb-2 border-2 border-blue-400 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {user?.nome ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
            </div>
            <h3 className="text-lg font-bold mt-2">{user?.nome || "Usuário"}</h3>
          </div>
          <div className="w-full flex flex-col mt-10 gap-4 items-center">
            {[
              { valor: userStats?.pontuacao || 0, label: "Pontuação", cor: "#3b82f6", max: 10000 },
              { valor: userStats?.posicao || 0, label: "Posição", cor: "#3b82f6", max: 100 },
              { valor: userStats?.casos_resolvidos || 0, label: "Casos Resolvidos", cor: "#3b82f6", max: 100 }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-blue-200 p-2 flex flex-col items-center gap-1 w-40">
                <div className="w-14 h-14">
                  <CircularProgressbar 
                    value={item.valor} 
                    maxValue={item.max}
                    text={`${item.valor}`} 
                    styles={buildStyles({
                      textSize: '18px',
                      textColor: '#333',
                      pathColor: item.cor,
                      trailColor: '#e5e5e5',
                    })}
                  />
                </div>
                <span className="text-xs font-semibold text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}