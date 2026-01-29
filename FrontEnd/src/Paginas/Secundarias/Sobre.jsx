import React from 'react';
import Layout from './Layout';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre a <span className="text-blue-600">Comaes</span>
          </h1>
          <p className="text-xl text-gray-600">
            Transformando a educação através da tecnologia
          </p>
        </div>

        {/* Missão */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nossa Missão</h2>
          </div>
          <p className="text-gray-700 text-lg">
            Democratizar o acesso à educação de qualidade, proporcionando uma plataforma onde estudantes podem testar seus conhecimentos, acompanhar seu progresso e competir de forma saudável com outros aprendizes.
          </p>
        </div>

        {/* Visão */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nossa Visão</h2>
          </div>
          <p className="text-gray-700 text-lg">
            Ser a principal plataforma de testes de conhecimento do mundo, ajudando milhões de estudantes a alcançarem seu potencial máximo através da aprendizagem gamificada e colaborativa.
          </p>
        </div>

        {/* O Que Fazemos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">O Que Oferecemos</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-4">📚</div>
              <h3 className="font-bold text-gray-900 mb-3">Testes Diversificados</h3>
              <p className="text-gray-600">
                Questões em múltiplas áreas do conhecimento, desde programação até história, com diferentes níveis de dificuldade.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="font-bold text-gray-900 mb-3">Acompanhamento de Progresso</h3>
              <p className="text-gray-600">
                Dashboard completo com gráficos e estatísticas para monitorar seu desenvolvimento ao longo do tempo.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-4">🏆</div>
              <h3 className="font-bold text-gray-900 mb-3">Sistema de Ranking</h3>
              <p className="text-gray-600">
                Competição saudável com rankings globais e por áreas, incentivando a superação pessoal.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-4">👥</div>
              <h3 className="font-bold text-gray-900 mb-3">Comunidade Ativa</h3>
              <p className="text-gray-600">
                Conecte-se com outros estudantes, compartilhe conhecimentos e aprenda em conjunto.
              </p>
            </div>
          </div>
        </div>

        {/* Fundadores do Comaes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Os Fundadores do Comaes</h2>
          <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
            A plataforma KnowTest foi idealizada e desenvolvida por três estudantes apaixonados por educação e tecnologia, unidos pela visão de criar uma ferramenta acessível e motivadora para todos os aprendizes.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Fundador 1: Esménio Manuel */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://nappy.co/photo/N_Ayxnji-zQ9w0r_QKQj5" 
                  alt="Esménio Manuel"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Esménio Manuel</h3>
              <div className="text-blue-600 font-medium mb-3">Arquiteto de Sistemas</div>
              <p className="text-gray-600 mb-4">
                Especialista em backend e arquitetura de dados, Esménio foi responsável por construir a base robusta e escalável que sustenta toda a plataforma.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Conhecer mais →
              </a>
            </div>

            {/* Fundador 2: Cornélio Mbongo */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://nappy.co/photo/wd7DvPDbBGNmhFy-qQ_qY" 
                  alt="Cornélio Mbongo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Cornélio Mbongo</h3>
              <div className="text-blue-600 font-medium mb-3">Designer de Experiência</div>
              <p className="text-gray-600 mb-4">
                Com foco na experiência do usuário e no design de interfaces, Cornélio moldou a jornada visual e interativa que torna o aprendizado no KnowTest envolvente e intuitivo.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Conhecer mais →
              </a>
            </div>

            {/* Fundador 3: José Mariche */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://nappy.co/photo/etcnq-2iS4xaqRQ3SQWvj" 
                  alt="José Mariche"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">José Mariche</h3>
              <div className="text-blue-600 font-medium mb-3">Especialista em Conteúdo</div>
              <p className="text-gray-600 mb-4">
                Pedagogo e pesquisador, José desenvolveu a metodologia dos testes e curadoria do conhecimento, garantindo a qualidade e relevância acadêmica de todo o conteúdo.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Conhecer mais →
              </a>
            </div>
          </div>
        </div>

        {/* Nossa História */}
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nossa História</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">O Início</h3>
                <p className="text-gray-700">
                  Fundado em 2023 por estudantes universitários que identificaram a necessidade de uma plataforma prática para testar conhecimentos acadêmicos.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Crescimento</h3>
                <p className="text-gray-700">
                  Em menos de um ano, alcançamos milhares de usuários em diversas universidades, expandindo para múltiplas áreas do conhecimento.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Hoje</h3>
                <p className="text-gray-700">
                  Continuamos inovando, adicionando novos recursos e mantendo nosso compromisso com a educação acessível e de qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nossos Valores</h2>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-blue-600 mr-4">✓</div>
              <div>
                <h3 className="font-medium text-gray-900">Acessibilidade</h3>
                <p className="text-gray-600 text-sm">Educação gratuita e de qualidade para todos</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-blue-600 mr-4">✓</div>
              <div>
                <h3 className="font-medium text-gray-900">Inovação</h3>
                <p className="text-gray-600 text-sm">Sempre buscando novas formas de melhorar a aprendizagem</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-blue-600 mr-4">✓</div>
              <div>
                <h3 className="font-medium text-gray-900">Comunidade</h3>
                <p className="text-gray-600 text-sm">Juntos aprendemos mais e melhor</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-blue-600 mr-4">✓</div>
              <div>
                <h3 className="font-medium text-gray-900">Qualidade</h3>
                <p className="text-gray-600 text-sm">Conteúdo rigoroso e atualizado constantemente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Junte-se à Nossa Comunidade</h2>
          <p className="mb-6 text-blue-100">
            Comece sua jornada de aprendizado hoje mesmo
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Começar Agora
          </button>
        </div>

        {/* Informações de Contato */}

      </div>
    </Layout>
  );
}