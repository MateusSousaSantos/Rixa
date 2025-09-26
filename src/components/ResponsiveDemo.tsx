import React from "react";
import { FiMenu, FiSearch, FiBell, FiSettings } from "react-icons/fi";

export const ResponsiveDemo: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Demonstração de Componentes Responsivos
      </h2>
      
      {/* Exemplo 1: Navegação Desktop vs Mobile */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Navegação Adaptativa:</h3>
        
        {/* Navegação Desktop - visível em telas grandes */}
        <nav className="hidden lg:flex items-center gap-6 mb-2">
          <a href="#" className="text-blue-600 hover:text-blue-800">Home</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Perfil</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Configurações</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Notificações</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Sobre</a>
        </nav>
        
        {/* Navegação Mobile - visível em telas pequenas/médias */}
        <div className="lg:hidden flex items-center justify-between">
          <button className="p-2 text-gray-600">
            <FiMenu size={20} />
          </button>
          <span className="font-medium">Menu</span>
          <div className="flex gap-2">
            <FiBell size={20} />
            <FiSettings size={20} />
          </div>
        </div>
      </div>

      {/* Exemplo 2: Cards com layouts diferentes */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Layout de Cards:</h3>
        
        {/* Desktop: 3 colunas */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-2">
          <div className="bg-blue-100 p-4 rounded">Card 1 (Desktop)</div>
          <div className="bg-green-100 p-4 rounded">Card 2 (Desktop)</div>
          <div className="bg-yellow-100 p-4 rounded">Card 3 (Desktop)</div>
        </div>
        
        {/* Tablet: 2 colunas */}
        <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4 mb-2">
          <div className="bg-blue-200 p-4 rounded">Card 1 (Tablet)</div>
          <div className="bg-green-200 p-4 rounded">Card 2 (Tablet)</div>
        </div>
        
        {/* Mobile: 1 coluna */}
        <div className="md:hidden space-y-2">
          <div className="bg-blue-300 p-4 rounded">Card 1 (Mobile)</div>
          <div className="bg-green-300 p-4 rounded">Card 2 (Mobile)</div>
        </div>
      </div>

      {/* Exemplo 3: Barra de pesquisa adaptativa */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Barra de Pesquisa:</h3>
        
        {/* Versão completa para desktop */}
        <div className="hidden sm:flex items-center gap-2 mb-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar no Rixa..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Pesquisar
          </button>
        </div>
        
        {/* Versão compacta para mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiSearch size={16} />
          </button>
        </div>
      </div>

      {/* Exemplo 4: Texto responsivo */}
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Texto Adaptativo:</h3>
        
        {/* Texto completo em telas grandes */}
        <p className="hidden lg:block text-gray-700 mb-2">
          Este é um texto completo que aparece apenas em telas grandes (lg e acima). 
          Ele contém informações detalhadas que podem ser úteis quando há espaço suficiente 
          para exibir todo o conteúdo sem comprometer a experiência do usuário.
        </p>
        
        {/* Texto médio em telas médias */}
        <p className="hidden md:block lg:hidden text-gray-700 mb-2">
          Texto médio para tablets. Informações resumidas mas ainda informativas.
        </p>
        
        {/* Texto curto em telas pequenas */}
        <p className="md:hidden text-gray-700">
          Texto curto para mobile.
        </p>
        
        {/* Indicador de tamanho atual */}
        <div className="mt-4 p-2 bg-white rounded border">
          <span className="block sm:hidden text-red-600 font-medium">📱 Mobile (xs)</span>
          <span className="hidden sm:block md:hidden text-orange-600 font-medium">📱 Mobile Large (sm)</span>
          <span className="hidden md:block lg:hidden text-blue-600 font-medium">💻 Tablet (md)</span>
          <span className="hidden lg:block xl:hidden text-green-600 font-medium">🖥️ Desktop (lg)</span>
          <span className="hidden xl:block text-purple-600 font-medium">🖥️ Desktop Large (xl)</span>
        </div>
      </div>
    </div>
  );
};