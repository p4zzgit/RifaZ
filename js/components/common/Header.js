
import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import { Layout, LogIn, UserPlus } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function Header({ config }) {
  const primaryColor = config?.primaryColor || '#FFFFFF';
  const secondaryColor = config?.secondaryColor || '#FF8C00';

  return html`
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 cursor-pointer group" onClick=${() => window.location.hash = '/'}>
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <${Layout} className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              ${config?.platformName || 'Rifa Digital'}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#funciona" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Como Funciona</a>
            <a href="#modelos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Modelos</a>
            <a href="#precos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Preços</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick=${() => window.location.hash = '/login'}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
            >
              <${LogIn} className="w-4 h-4" />
              Entrar
            </button>
            <button 
              onClick=${() => window.location.hash = '/cadastro'}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200 active:scale-95"
            >
              <${UserPlus} className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
