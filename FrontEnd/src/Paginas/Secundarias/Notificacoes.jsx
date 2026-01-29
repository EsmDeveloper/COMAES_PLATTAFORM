import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoClose, 
  IoNotifications, 
  IoCheckmarkDone,
  IoTime,
  IoAlertCircle,
  IoSparkles,
  IoMedal
} from "react-icons/io5";
import { FaTrophy, FaUsers, FaCalendarAlt, FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function NotificacoesModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Dados de exemplo para notificações
  const exemploNotificacoes = [
    {
      id: 1,
      title: "Novo Torneio Disponível",
      message: "Torneio de Matemática Avançada está disponível para participação!",
      icon: <FaTrophy className="text-yellow-500" />,
      time: "Há 5 minutos",
      read: false,
      type: "torneio"
    },
    {
      id: 2,
      title: "Ranking Atualizado",
      message: "Você subiu 3 posições no ranking de Programação",
      icon: <IoMedal className="text-blue-500" />,
      time: "Há 1 hora",
      read: false,
      type: "ranking"
    },
    {
      id: 3,
      title: "Lembrete de Torneio",
      message: "Seu torneio de Inglês começa em 30 minutos",
      icon: <IoTime className="text-purple-500" />,
      time: "Há 2 horas",
      read: true,
      type: "lembrete"
    },
    {
      id: 4,
      title: "Conquista Desbloqueada",
      message: "Parabéns! Você desbloqueou a conquista 'Mestre da Matemática'",
      icon: <IoSparkles className="text-green-500" />,
      time: "Ontem",
      read: true,
      type: "conquista"
    },
    {
      id: 5,
      title: "Novo Competidor",
      message: "Maria Silva entrou no torneio de Programação",
      icon: <FaUsers className="text-pink-500" />,
      time: "2 dias atrás",
      read: true,
      type: "social"
    }
  ];

  useEffect(() => {
    if (user && isOpen) {
      // Carregar notificações do usuário
      setNotifications(exemploNotificacoes);
      const unread = exemploNotificacoes.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  }, [user, isOpen]);

  const marcarComoLida = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const marcarTodasComoLidas = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'torneio': return 'bg-yellow-100 text-yellow-800';
      case 'ranking': return 'bg-blue-100 text-blue-800';
      case 'lembrete': return 'bg-purple-100 text-purple-800';
      case 'conquista': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'torneio': return 'Torneio';
      case 'ranking': return 'Ranking';
      case 'lembrete': return 'Lembrete';
      case 'conquista': return 'Conquista';
      case 'social': return 'Social';
      default: return 'Geral';
    }
  };

  if (!user) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <FaBell className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Acesso Restrito
                </h3>
                <p className="text-gray-600 mb-6">
                  Faça login para visualizar suas notificações
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <IoNotifications className="text-2xl text-blue-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Notificações</h2>
                    <p className="text-sm text-gray-500">
                      {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <IoCheckmarkDone />
                      <span>Marcar todas</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <IoNotifications className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => marcarComoLida(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`font-semibold ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                              {getTypeText(notification.type)}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>COMAES Notificações</span>
                <span>{notifications.length} itens</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}