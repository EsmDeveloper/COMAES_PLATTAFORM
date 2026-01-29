import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TOTAL_TORNEIO = 7 * 24 * 60 * 60;
const TEMPO_QUESTAO = 90;
const DISCIPLINA_TORNEIO = 'matemática';

// Questões de matemática
const questoes = [
  { 
    id: 1, 
    enunciado: "Calcule o valor de 12 + 7 × 3",
    respostaCorreta: "33"  // 12 + (7×3) = 12 + 21 = 33
  },
  { 
    id: 2, 
    enunciado: "Qual é o resultado de √81 + 15 ÷ 3?",
    respostaCorreta: "18"  // √81 = 9, 15÷3 = 5, 9 + 5 = 14
  },
  { 
    id: 3, 
    enunciado: "Resolva: (8 × 2) - (10 ÷ 2)",
    respostaCorreta: "11"  // 16 - 5 = 11
  }
];

export default function MatematicaOriginal() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Estados para dados do torneio
  const [torneio, setTorneio] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [torneioTime, setTorneioTime] = useState(TOTAL_TORNEIO);
  const [questaoIndex, setQuestaoIndex] = useState(0);
  const [questaoTime, setQuestaoTime] = useState(TEMPO_QUESTAO);
  const [resposta, setResposta] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("Fácil");
  const [resultado, setResultado] = useState("");
  const [pontuacao, setPontuacao] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [mostrarDados, setMostrarDados] = useState(false);

  // Fetch torneios
  useEffect(() => {
    const fetchTorneos = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/torneios');
        const data = await res.json();
        
        const torneiosAtivos = Array.isArray(data.data) 
          ? data.data.filter(t => 
              t.status === 'ativo' && 
              t.titulo.toLowerCase().includes(DISCIPLINA_TORNEIO)
            )
          : [];
        
        if (torneiosAtivos.length > 0) {
          const t = torneiosAtivos[0];
          setTorneio(t);
          
          const rankRes = await fetch(`http://localhost:3000/api/torneios/${t.id}/ranking`);
          const rankData = await rankRes.json();
          setRanking(Array.isArray(rankData.data) ? rankData.data : []);
          
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
        // Dados simulados
        setRanking([
          { id: 1, usuario: { nome: 'Cornélio Mbongo', avatar: null }, pontuacao: 7158, posicao: 1 },
          { id: 2, usuario: { nome: 'José Mariche', avatar: null }, pontuacao: 6914, posicao: 2 },
        ]);
        setUserStats({ pontuacao: 5000, posicao: 5, casos_resolvidos: 15 });
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

  const handleResposta = (value) => setResposta((prev) => prev + value);

  const handleNextQuestao = () => {
    setResposta("");
    setResultado("");
    setPontuacao(null);
    setQuestaoIndex((prev) => (prev + 1 < questoes.length ? prev + 1 : 0));
    setQuestaoTime(TEMPO_QUESTAO);
  };

  // SIMULAÇÃO DE IA PARA CORREÇÃO DE MATEMÁTICA
  const executarResposta = () => {
    if (!resposta.trim()) {
      setResultado("Por favor, digite uma resposta!");
      setPontuacao(0);
      return;
    }

    const respostaUsuario = resposta.trim();
    const questaoAtual = questoes[questaoIndex];
    const respostaEsperada = questaoAtual.respostaCorreta;

    // Simulação de análise de IA
    let pontuacaoCalculada = 0;
    let resultadoTexto = "";

    // Limpar espaços e padronizar
    const respostaLimpa = respostaUsuario.replace(/\s+/g, '');
    const esperadaLimpa = respostaEsperada.replace(/\s+/g, '');

    // 1. Verificação exata
    if (respostaLimpa === esperadaLimpa) {
      resultadoTexto = "✅ Correto! Resposta exata.";
      pontuacaoCalculada = 10;
    }
    // 2. Verificação numérica aproximada
    else {
      // Tentar extrair números da resposta
      const extrairNumeros = (texto) => {
        const matches = texto.match(/-?\d+(\.\d+)?/g);
        return matches ? matches.map(Number) : [];
      };

      const numerosUsuario = extrairNumeros(respostaLimpa);
      const numerosEsperados = extrairNumeros(esperadaLimpa);

      if (numerosUsuario.length > 0 && numerosEsperados.length > 0) {
        // Verificar se algum número está próximo
        const temNumeroProximo = numerosUsuario.some(numUser => 
          numerosEsperados.some(numEsperado => 
            Math.abs(numUser - numEsperado) < 0.01
          )
        );

        if (temNumeroProximo) {
          const distancias = numerosUsuario.map((numUser, idx) => {
            if (idx < numerosEsperados.length) {
              return Math.abs(numUser - numerosEsperados[idx]);
            }
            return Infinity;
          });

          const distanciaMedia = distancias.reduce((a, b) => a + b, 0) / distancias.length;

          if (distanciaMedia < 0.1) {
            resultadoTexto = "⚠️ Quase lá! Pequena diferença numérica.";
            pontuacaoCalculada = 8;
          } else if (distanciaMedia < 1) {
            resultadoTexto = "⚠️ Resposta próxima, mas precisa ajustar.";
            pontuacaoCalculada = 6;
          } else {
            resultadoTexto = "❌ Resposta incorreta. Distância significativa.";
            pontuacaoCalculada = 3;
          }
        } else {
          resultadoTexto = "❌ Resposta incorreta.";
          pontuacaoCalculada = 2;
        }
      }
      // 3. Verificação de erros comuns
      else {
        const erroComum = detectarErroComum(questaoIndex, respostaLimpa);
        if (erroComum) {
          resultadoTexto = `❌ ${erroComum.mensagem}`;
          pontuacaoCalculada = erroComum.pontuacao;
        } else {
          if (respostaLimpa.length < 2) {
            resultadoTexto = "❌ Resposta muito curta ou incompleta.";
            pontuacaoCalculada = 1;
          } else {
            const similaridade = calcularSimilaridade(respostaLimpa, esperadaLimpa);
            if (similaridade > 0.6) {
              resultadoTexto = "⚠️ Resposta parcialmente correta.";
              pontuacaoCalculada = 4;
            } else {
              resultadoTexto = "❌ Resposta incorreta.";
              pontuacaoCalculada = 2;
            }
          }
        }
      }
    }

    const confiancaIA = Math.floor(Math.random() * 20) + 80;
    resultadoTexto += ` (IA: ${confiancaIA}% confiante)`;

    setResultado(resultadoTexto);
    setPontuacao(pontuacaoCalculada);
  };

  // Funções auxiliares para simulação de IA
  const detectarErroComum = (questaoIdx, respostaUsuario) => {
    const errosComuns = [
      {
        questao: 0,
        respostaErrada: "39",
        mensagem: "Erro na ordem das operações (PEMDAS): multiplicação primeiro!",
        pontuacao: 4
      },
      {
        questao: 0,
        respostaErrada: "57",
        mensagem: "Erro: soma antes da multiplicação.",
        pontuacao: 3
      }
    ];

    return errosComuns.find(e => 
      e.questao === questaoIdx && respostaUsuario === e.respostaErrada
    );
  };

  const calcularSimilaridade = (str1, str2) => {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  };

  const rankingData = [
    { id: 1, usuario: { nome: 'Cornélio Mbongo', avatar: null }, pontuacao: 7158, posicao: 1 },
    { id: 2, usuario: { nome: 'José Mariche', avatar: null }, pontuacao: 6914, posicao: 2 },
    { id: 3, usuario: { nome: 'Esménio Manuel', avatar: null }, pontuacao: 6822, posicao: 3 },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 border border-white px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded hover:bg-white hover:text-blue-600 transition">
            <FaSignOutAlt className="text-xs sm:text-sm md:text-base" />
            Sair do Torneio
          </button>

          <div className="flex flex-col items-center" translate="no">
            <p className="text-xs md:text-xs lg:text-sm">Tempo restante do torneio</p>
            <h2 className="text-lg md:text-base lg:text-xl font-bold">{formatTime(torneioTime)}</h2>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="bg-white text-blue-600 font-bold px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded-full flex items-center gap-1 shadow-md">
              Modelo Original
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="w-full h-3 bg-white/30">
          <div className={`h-3 transition-all duration-1000 ${torneioTime <= UM_DIA ? "bg-red-500" : "bg-green-400"}`}
            style={{ width: `${(torneioTime / TOTAL_TORNEIO) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR ESQUERDA - RANKING */}
        <div className="hidden lg:block w-80 bg-black text-white shadow-lg p-3">
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

        {/* ÁREA DE EXERCÍCIO */}
        <div className="flex-1 flex flex-col items-center p-4 overflow-auto space-y-4">
          {/* HEADER DA ÁREA */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-lg md:text-xl lg:text-2xl font-normal text-gray-800 text-center">Torneio de Matemática</h1>
            
            <div className="flex gap-2 flex-wrap align-items-center justify-center">
              {[
                { nivel: "Fácil", pts: 5 },
                { nivel: "Médio", pts: 10 },
                { nivel: "Difícil", pts: 20 }
              ].map((item) => (
                <button key={item.nivel} onClick={() => setNivelSelecionado(item.nivel)}
                  className={`px-3 py-1.5 text-xs md:text-sm rounded-full font-semibold transition-all ${
                    nivelSelecionado === item.nivel
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {item.nivel} • {item.pts} pts
                </button>
              ))}
            </div>
          </div>

          {/* ENUNCIADO */}
          <div className="w-full max-w-4xl bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-xl shadow p-4">
            <p className="text-sm md:text-base font-medium text-gray-800">{questoes[questaoIndex].enunciado}</p>
          </div>

          {/* ÁREA DE RESOLUÇÃO */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 space-y-3">
            {/* TOOLBAR MATEMÁTICA */}
            <div className="flex justify-center gap-1 md:gap-2 flex-wrap border-b pb-3" translate="no">
              {["+", "-", "×", "÷", "√", "(", ")", "²", "³", "=", "π", "°"].map((op) => (
                <button key={op} onClick={() => handleResposta(op)}
                  className="px-2 py-1 text-xs md:text-sm bg-gray-100 hover:bg-blue-100 text-gray-800 rounded-md transition">
                  {op}
                </button>
              ))}
            </div>

            <textarea value={resposta} onChange={(e) => setResposta(e.target.value)}
              className="w-full h-36 resize-none p-3 font-mono text-sm md:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite aqui sua resolução passo a passo..." />
          </div>

          {/* TEMPORIZADOR */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-2 text-sm md:text-base font-semibold text-gray-700">
              <span>Tempo restante</span>
              <span className="px-2 py-0.5 rounded bg-gray-100">{formatSeconds(questaoTime)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div className={`h-full transition-all duration-300 ${questaoTime < 10 ? "bg-red-500" : "bg-blue-600"}`}
                style={{ width: `${(questaoTime / TEMPO_QUESTAO) * 100}%` }} />
            </div>
          </div>

          {/* Botão Executar */}
          <button onClick={executarResposta}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto sm:min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm md:text-base">Executar</span>
          </button>

          {/* RESULTADO */}
          {resultado && (
            <div className="w-full max-w-4xl bg-white border rounded-xl shadow-md p-3 text-center text-sm md:text-base font-semibold">
              Resultado: {resultado}{" "}
              {pontuacao !== null && <span className="text-blue-600">| {pontuacao} pts</span>}
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

        {/* SIDEBAR DIREITA - INFO USUÁRIO */}
        <div className="hidden lg:flex w-64 bg-white text-gray-800 shadow-lg p-4 overflow-y-auto flex-col items-center space-y-3">
          <div className="flex flex-col items-center mb-3">
            <div className="w-20 h-20 rounded-full mb-2 border-2 border-blue-400 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {user?.nome ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
            </div>
            <h3 className="text-lg font-bold mt-2">{user?.nome || "Usuário"}</h3>
          </div>
          
          <div className="w-full flex flex-col gap-4 items-center">
            {[
              { valor: userStats?.pontuacao || 0, label: "Pontuação", cor: "#3b82f6", max: 10000 },
              { valor: userStats?.posicao || 0, label: "Posição", cor: "#3b82f6", max: 100 },
              { valor: userStats?.casos_resolvidos || 0, label: "Casos Resolvidos", cor: "#3b82f6", max: 100 }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-blue-200 p-2 flex flex-col items-center gap-1 w-40">
                <div className="w-14 h-14">
                  <CircularProgressbar value={item.valor} maxValue={item.max} text={`${item.valor}`} 
                    styles={buildStyles({ textSize: '18px', textColor: '#333', pathColor: item.cor, trailColor: '#e5e5e5' })} />
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
                  <CircularProgressbar value={item.valor} maxValue={item.max} text={`${item.valor}`} 
                    styles={buildStyles({ textSize: '18px', textColor: '#333', pathColor: item.cor, trailColor: '#e5e5e5' })} />
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