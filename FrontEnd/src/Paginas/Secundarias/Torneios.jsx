import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ChevronDown, Users, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Torneios = () => {
  const { user, token } = useAuth();
  const [activeDiscipline, setActiveDiscipline] = useState('matemática');
  const [torneios, setTorneios] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTorneio, setSelectedTorneio] = useState(null);

  const disciplinas = [
    { id: 'matemática', label: 'Matemática', color: 'bg-blue-500' },
    { id: 'inglês', label: 'Inglês', color: 'bg-green-500' },
    { id: 'programação', label: 'Programação', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const fetchTorneos = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const torneiosRes = await fetch('http://localhost:3000/torneios');
        const torneiosData = await torneiosRes.json();
        
        const torneiosAtivos = torneiosData.data.filter(t => 
          t.status === 'ativo' && t.titulo.toLowerCase().includes(activeDiscipline)
        );
        
        setTorneios(torneiosAtivos);
        
        if (torneiosAtivos.length > 0) {
          const torneio = torneiosAtivos[0];
          setSelectedTorneio(torneio);

          // Fetch ranking
          const rankingRes = await fetch(`http://localhost:3000/torneios/${torneio.id}/ranking`);
          const rankingData = await rankingRes.json();
          setRanking(rankingData.data || []);

          // Fetch user stats
          const statsRes = await fetch(`http://localhost:3000/torneios/${torneio.id}/usuario/${user.id}`);
          const statsData = await statsRes.json();
          setUserStats(statsData.data);
        }
      } catch (error) {
        console.error('Erro ao buscar torneios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTorneos();
  }, [activeDiscipline, user?.id, token]);

  const handleJoinTorneio = async () => {
    if (!selectedTorneio) return;
    
    try {
      const response = await fetch(`http://localhost:3000/torneios/${selectedTorneio.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: user.id,
          disciplina_competida: activeDiscipline.charAt(0).toUpperCase() + activeDiscipline.slice(1)
        })
      });

      if (response.ok) {
        // Refresh ranking and stats
        const rankingRes = await fetch(`http://localhost:3000/torneios/${selectedTorneio.id}/ranking`);
        const rankingData = await rankingRes.json();
        setRanking(rankingData.data || []);

        const statsRes = await fetch(`http://localhost:3000/torneios/${selectedTorneio.id}/usuario/${user.id}`);
        const statsData = await statsRes.json();
        setUserStats(statsData.data);
      }
    } catch (error) {
      console.error('Erro ao entrar no torneio:', error);
    }
  };

  const calculateProgress = () => {
    if (!userStats) return 0;
    const maxCasos = 100;
    return (userStats.casos_resolvidos / maxCasos) * 100;
  };

  const getDisciplinaColor = (disciplina) => {
    switch(disciplina) {
      case 'Matemática': return '#3b82f6';
      case 'Inglês': return '#10b981';
      case 'Programação': return '#a855f7';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Torneios</h1>
        <p className="text-gray-300">Participe de torneios e compete com outros usuários</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Disciplinas */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Disciplinas</h2>
            <div className="space-y-3">
              {disciplinas.map(disciplina => (
                <button
                  key={disciplina.id}
                  onClick={() => setActiveDiscipline(disciplina.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeDiscipline === disciplina.id
                      ? `${disciplina.color} text-white font-semibold`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {disciplina.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Torneio Info */}
          {selectedTorneio && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedTorneio.titulo}</h3>
                  <p className="text-gray-300 text-sm mt-1">{selectedTorneio.descricao}</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-400" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded p-4">
                  <Clock className="w-5 h-5 mb-2 text-blue-400" />
                  <p className="text-sm text-gray-400">Data Início</p>
                  <p className="font-semibold">{new Date(selectedTorneio.data_inicio).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-gray-900 rounded p-4">
                  <Clock className="w-5 h-5 mb-2 text-green-400" />
                  <p className="text-sm text-gray-400">Data Fim</p>
                  <p className="font-semibold">{new Date(selectedTorneio.data_fim).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-gray-900 rounded p-4">
                  <Users className="w-5 h-5 mb-2 text-purple-400" />
                  <p className="text-sm text-gray-400">Participantes</p>
                  <p className="font-semibold">{ranking.length}</p>
                </div>
              </div>

              {!userStats && (
                <button
                  onClick={handleJoinTorneio}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Entrar no Torneio
                </button>
              )}
            </div>
          )}

          {/* User Progress */}
          {userStats && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">Seu Progresso</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24">
                    <CircularProgressbar
                      value={calculateProgress()}
                      text={`${Math.round(calculateProgress())}%`}
                      styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: `#3b82f6`,
                        textColor: '#fff',
                        trailColor: '#4b5563',
                        backgroundColor: '#3b82f6',
                      })}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Progresso</p>
                </div>

                <div className="flex flex-col justify-center items-center bg-gray-700 rounded p-4">
                  <p className="text-3xl font-bold text-green-400">{userStats.casos_resolvidos}</p>
                  <p className="text-gray-400 text-sm mt-1">Casos Resolvidos</p>
                </div>

                <div className="flex flex-col justify-center items-center bg-gray-700 rounded p-4">
                  <p className="text-3xl font-bold text-yellow-400">#{userStats.posicao}</p>
                  <p className="text-gray-400 text-sm mt-1">Posição</p>
                </div>
              </div>
            </div>
          )}

          {/* Ranking Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h4 className="text-xl font-semibold">Ranking</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Posição</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Casos Resolvidos</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Pontuação</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {ranking.length > 0 ? (
                    ranking.map((participante) => (
                      <tr key={participante.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                              {participante.posicao}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {participante.usuario?.imagem && (
                              <img
                                src={`http://localhost:3000${participante.usuario.imagem}`}
                                alt={participante.usuario.nome}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="font-medium">{participante.usuario?.nome || 'Usuário'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{participante.casos_resolvidos}</td>
                        <td className="px-6 py-4 font-semibold text-yellow-400">{participante.pontuacao}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            participante.status === 'ativo' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {participante.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        Nenhum participante ainda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Torneios Disponíveis */}
          {torneios.length > 1 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">Outros Torneios</h4>
              <div className="space-y-3">
                {torneios.map((torneio) => (
                  <div
                    key={torneio.id}
                    className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedTorneio(torneio)}
                  >
                    <h5 className="font-semibold">{torneio.titulo}</h5>
                    <p className="text-sm text-gray-300 mt-1">{torneio.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Torneios;
