import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { 
  Newspaper, TrendingUp, Calendar, User, Clock, 
  ExternalLink, BookOpen, Trophy, Zap, Share2,
  Bookmark, BookmarkCheck, Filter, Search, Eye
} from 'lucide-react';

// Componente Card de Notícia
const NewsCard = ({ 
  id,
  category, 
  title, 
  excerpt, 
  author, 
  date, 
  readTime, 
  views,
  isBookmarked,
  onBookmark,
  imageUrl,
  tags = []
}) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200">
    {/* Imagem da Notícia */}
    {imageUrl && (
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
    )}
    
    <div className="p-6">
      {/* Categoria e Ações */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            category === 'novidade' ? 'bg-blue-100 text-blue-800' :
            category === 'atualização' ? 'bg-green-100 text-green-800' :
            category === 'evento' ? 'bg-purple-100 text-purple-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {category === 'novidade' ? '🎉 Novidade' :
             category === 'atualização' ? '🔄 Atualização' :
             category === 'evento' ? '📅 Evento' : '💡 Dica'}
          </span>
          
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <button 
          onClick={() => onBookmark(id)}
          className="text-gray-400 hover:text-yellow-500 transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-yellow-500" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Título e Resumo */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta informações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Eye className="h-4 w-4" />
            <span>{views} visualizações</span>
          </div>
          
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <span>Ler mais</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Componente Card de Destaque
const FeaturedCard = ({ 
  title, 
  description, 
  imageUrl, 
  type = 'featured',
  ctaText = 'Saiba mais' 
}) => {
  const getTypeStyle = () => {
    switch(type) {
      case 'announcement':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'event':
        return 'bg-gradient-to-r from-green-500 to-teal-600';
      case 'update':
        return 'bg-gradient-to-r from-orange-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden text-white ${getTypeStyle()}`}>
      <div className="p-8">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-6 w-6" />
          <span className="font-medium">DESTAQUE</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6 opacity-90">{description}</p>
        
        <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          {ctaText}
        </button>
      </div>
    </div>
  );
};

// Componente Card de Anúncio Rápido
const QuickUpdateCard = ({ icon: Icon, title, description, date, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default function News() {
  const [news, setNews] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories] = useState([
    { id: 'all', label: 'Todas', count: 24 },
    { id: 'novidade', label: 'Novidades', count: 8 },
    { id: 'atualização', label: 'Atualizações', count: 6 },
    { id: 'evento', label: 'Eventos', count: 5 },
    { id: 'dica', label: 'Dicas', count: 5 }
  ]);

  // Carregar notícias
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      
      // Dados mockados das notícias
      const mockNews = [
        {
          id: 1,
          category: 'novidade',
          title: 'Nova Área: Inteligência Artificial',
          excerpt: 'Introduzimos uma nova área de conhecimento focada em IA e Machine Learning com testes desde iniciante até avançado.',
          author: 'Equipe KnowTest',
          date: '15 Jan 2024',
          readTime: '5 min',
          views: '1.2k',
          isBookmarked: false,
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800',
          tags: ['IA', 'Machine Learning', 'Nova Área', 'Tecnologia']
        },
        {
          id: 2,
          category: 'atualização',
          title: 'Sistema de Ranking Aprimorado',
          excerpt: 'Melhoramos nosso algoritmo de ranking com mais fatores e maior justiça nas competições.',
          author: 'Carlos Lima',
          date: '12 Jan 2024',
          readTime: '3 min',
          views: '845',
          isBookmarked: true,
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800',
          tags: ['Ranking', 'Atualização', 'Algoritmo', 'Competição']
        },
        {
          id: 3,
          category: 'evento',
          title: 'Maratona de Programação 2024',
          excerpt: 'Participe da nossa primeira maratona de programação com prêmios incríveis!',
          author: 'Maria Santos',
          date: '10 Jan 2024',
          readTime: '4 min',
          views: '2.1k',
          isBookmarked: false,
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800',
          tags: ['Evento', 'Programação', 'Competição', 'Prêmios']
        },
        {
          id: 4,
          category: 'dica',
          title: 'Como Melhorar Sua Pontuação',
          excerpt: 'Dicas práticas para aumentar sua performance nos testes e subir no ranking.',
          author: 'João Silva',
          date: '08 Jan 2024',
          readTime: '6 min',
          views: '3.4k',
          isBookmarked: false,
          imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800',
          tags: ['Dicas', 'Performance', 'Estudo', 'Progresso']
        },
        {
          id: 5,
          category: 'novidade',
          title: 'App Mobile Lançado!',
          excerpt: 'Agora você pode estudar em qualquer lugar com nosso aplicativo móvel.',
          author: 'Equipe KnowTest',
          date: '05 Jan 2024',
          readTime: '2 min',
          views: '4.2k',
          isBookmarked: true,
          imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800',
          tags: ['Mobile', 'App', 'Lançamento', 'Novidade']
        },
        {
          id: 6,
          category: 'evento',
          title: 'Webinar: Dicas para Estudantes',
          excerpt: 'Participe do nosso webinar gratuito com especialistas em aprendizagem.',
          author: 'Ana Costa',
          date: '03 Jan 2024',
          readTime: '3 min',
          views: '1.8k',
          isBookmarked: false,
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800',
          tags: ['Webinar', 'Estudo', 'Gratuito', 'Especialistas']
        }
      ];

      // Simular carregamento
      setTimeout(() => {
        setNews(mockNews);
        setBookmarked([2, 5]); // IDs das notícias bookmarkadas
        setLoading(false);
      }, 1000);
    };

    loadNews();
  }, []);

  // Filtrar notícias
  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Alternar bookmark
  const toggleBookmark = (id) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(item => item !== id));
      setNews(news.map(item => 
        item.id === id ? { ...item, isBookmarked: false } : item
      ));
    } else {
      setBookmarked([...bookmarked, id]);
      setNews(news.map(item => 
        item.id === id ? { ...item, isBookmarked: true } : item
      ));
    }
  };

  // Notícias em destaque
  const featuredNews = [
    {
      id: 7,
      type: 'announcement',
      title: 'KnowTest atinge 100k usuários!',
      description: 'Celebramos esta conquista incrível com novos recursos e melhorias para todos.',
      ctaText: 'Ver celebração'
    },
    {
      id: 8,
      type: 'event',
      title: 'Competição de Matemática',
      description: 'Teste suas habilidades matemáticas e ganhe prêmios exclusivos.',
      ctaText: 'Inscrever-se'
    }
  ];

  // Atualizações rápidas
  const quickUpdates = [
    {
      icon: Zap,
      title: 'Sistema mais rápido',
      description: 'Otimizamos o carregamento dos testes em 40%',
      date: 'Hoje',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Novas estatísticas',
      description: 'Agora você pode ver gráficos mais detalhados',
      date: 'Ontem',
      color: 'blue'
    },
    {
      icon: BookOpen,
      title: '+50 novos testes',
      description: 'Adicionamos testes nas áreas de tecnologia',
      date: '2 dias atrás',
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando notícias...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Newspaper className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Notícias da Plataforma</h2>
              <p className="text-gray-600 mt-1">Fique por dentro das novidades, atualizações e eventos</p>
            </div>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Pesquisar notícias..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Filtrar:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Destaques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredNews.map((featured) => (
            <FeaturedCard key={featured.id} {...featured} />
          ))}
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Notícias */}
          <div className="lg:col-span-2">
            {/* Cabeçalho das Notícias */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {filter === 'all' ? 'Todas as Notícias' : 
                 filter === 'novidade' ? 'Novidades' :
                 filter === 'atualização' ? 'Atualizações' :
                 filter === 'evento' ? 'Eventos' : 'Dicas'}
                <span className="text-gray-400 ml-2">({filteredNews.length})</span>
              </h3>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Compartilhar</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">{bookmarked.length} salvos</span>
                </div>
              </div>
            </div>

            {/* Lista de Notícias */}
            <div className="space-y-6">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    {...item}
                    isBookmarked={bookmarked.includes(item.id)}
                    onBookmark={toggleBookmark}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia encontrada</h4>
                  <p className="text-gray-600">Tente alterar os filtros ou termos de busca</p>
                </div>
              )}
            </div>

            {/* Paginação */}
            {filteredNews.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Atualizações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Atualizações Recentes</h3>
              </div>
              
              <div className="space-y-4">
                {quickUpdates.map((update, index) => (
                  <QuickUpdateCard key={index} {...update} />
                ))}
              </div>
            </div>

            {/* Categorias */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
              
              <div className="space-y-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      filter === cat.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${
                        cat.id === 'novidade' ? 'bg-blue-100' :
                        cat.id === 'atualização' ? 'bg-green-100' :
                        cat.id === 'evento' ? 'bg-purple-100' :
                        'bg-yellow-100'
                      }`}>
                        {cat.id === 'novidade' ? '🎉' :
                         cat.id === 'atualização' ? '🔄' :
                         cat.id === 'evento' ? '📅' : '💡'}
                      </div>
                      <span className="font-medium">{cat.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notícias Mais Vistas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mais Populares</h3>
              
              <div className="space-y-4">
                {news
                  .sort((a, b) => parseInt(b.views) - parseInt(a.views))
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                          <Clock className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Receba Novidades</h3>
              <p className="text-blue-100 mb-4">Inscreva-se para receber as principais notícias por email</p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900"
                />
                <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100">
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}