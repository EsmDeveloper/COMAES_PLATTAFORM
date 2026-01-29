import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from './Layout';
import { 
  User, Mail, Calendar, Book, Edit,
  Shield, CheckCircle
} from 'lucide-react';

// Componente Configuração
const SettingItem = ({ icon: Icon, title, description, action, actionType = 'toggle' }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-lg bg-gray-100">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
    <div>
      {actionType === 'toggle' ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      ) : (
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {action}
        </button>
      )}
    </div>
  </div>
);

export default function Profile() {
  const { user, logout, token, login } = useAuth();
  const navigate = useNavigate();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    name: user?.fullName || "Usuário COMAES",
    email: user?.email || "usuario@comaes.com",
    joinDate: "15 de Março, 2024",
    bio: "Estudante apaixonado por aprendizado e desafios educativos!",
    institution: "Plataforma COMAES",
    course: "Estudante Avançado",
    location: "Online"
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null

  // Verificar se usuário está autenticado
  React.useEffect(() => {
    if (!user) {
      setIsRedirecting(true);
      // Redirecionar para login após 2 segundos
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleSave = async () => {
    // Se há arquivo selecionado, faça upload
    if (selectedFile) {
      await handleUpload();
      return;
    }
    // Aqui você poderia enviar outras alterações ao backend (nome, bio, etc.)
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFile(f);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      const fd = new FormData();
      fd.append('avatar', selectedFile);
      const res = await fetch(`http://localhost:3000/usuarios/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: fd
      });
      const body = await res.json();
      if (!res.ok) {
        setUploadStatus('error');
        alert('❌ ' + (body.error || 'Falha ao enviar imagem'));
      } else {
        setUploadStatus('success');
        // Atualizar usuário no contexto com novos dados
        login(body.data, token);
        setSelectedFile(null);
        // Auto-dismiss edit mode após 2s
        setTimeout(() => {
          setIsEditing(false);
          setUploadStatus(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Erro upload:', err);
      setUploadStatus('error');
      alert('❌ Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Se usuário não está autenticado, mostrar tela de login
  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-red-100 to-orange-100">
                <User className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito ao Perfil
            </h2>
            
            <p className="text-gray-700 mb-6">
              Seu perfil COMAES está disponível apenas para usuários autenticados.
              <br />
              Faça login ou cadastre-se para acessar e personalizar seu perfil.
            </p>
            
            {isRedirecting ? (
              <div className="mb-6">
                <div className="inline-flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">Redirecionando para login...</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">Você será redirecionado automaticamente em instantes</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Fazer Login
                </button>
                <button
                  onClick={() => navigate('/cadastro')}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
                >
                  Cadastrar-se
                </button>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Benefícios do seu Perfil COMAES:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Acompanhamento de progresso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Estatísticas detalhadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Conquistas personalizadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Configurações de privacidade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Usuário autenticado - mostrar perfil normal
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho do Perfil */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Meu Perfil COMAES</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
            </button>
          </div>
          <p className="text-gray-600">Gerencie suas informações pessoais na plataforma</p>
        </div>

        {/* Informações do Usuário */}
        <div className="space-y-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.fullName || 'avatar'} 
                      className="h-32 w-32 rounded-full object-cover border-4 border-blue-200" 
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-200">
                      {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Edit className="h-5 w-5 text-gray-700" />
                    </label>
                  )}
                </div>

              {/* Informações */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>
                    {selectedFile && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                          📸 Arquivo selecionado: {selectedFile.name}
                        </p>
                      </div>
                    )}
                    {uploadStatus === 'success' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900">✅ Imagem enviada com sucesso!</p>
                      </div>
                    )}
                    {uploadStatus === 'error' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-900">❌ Erro ao enviar imagem</p>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <button 
                        onClick={handleSave}
                        disabled={uploading || !selectedFile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <span>Salvar Foto</span>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedFile(null);
                          setUploadStatus(null);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900">{editData.name}</h3>
                    <p className="text-gray-600 mt-2">{editData.bio}</p>
                    
                    <div className="grid grid-cols-1 gap-4 mt-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{user.email || editData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Book className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">Nível {user.level || 1}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">Membro desde {editData.joinDate}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Dados da Conta COMAES */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dados da Conta COMAES</h3>
                <p className="text-gray-600 text-sm mt-1">Informações do seu perfil na plataforma</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">ID do Usuário</p>
                <p className="font-medium text-gray-900">{user.id || 'COMAES-' + Date.now().toString().slice(-8)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tipo de Conta</p>
                <p className="font-medium text-gray-900">{user.role === 'admin' ? 'Administrador' : 'Estudante'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Data de Cadastro</p>
                <p className="font-medium text-gray-900">
                  {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('pt-PT') : editData.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Logout */}
        <div className="text-center">
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Terminar Sessão
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Ao terminar sessão, você será redirecionado para a página de login
          </p>
        </div>
      </div>
    </Layout>
  );
}