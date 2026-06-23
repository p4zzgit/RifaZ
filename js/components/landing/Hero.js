
import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

export function Hero({ config }) {
  return html`
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-100/30 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm mb-8 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-orange-600"></span>
          <span className="text-xs font-bold text-orange-900 uppercase tracking-widest">Novo: Bolões Esportivos Disponíveis</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
          ${config?.heroTitle || 'Crie sua Rifa Digital em minutos'}
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 font-medium leading-relaxed">
          ${config?.heroSub || 'A plataforma mais completa para gerenciar seus sorteios online com segurança e transparência.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-10 py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-700 hover:scale-105 transition-all active:scale-95 text-lg">
            Começar Agora Grátis
          </button>
          <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-black rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-lg">
            Ver Demonstração
          </button>
        </div>

        <div className="mt-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-[2rem] blur opacity-20"></div>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
            className="relative rounded-[2rem] border border-white shadow-2xl w-full max-w-5xl mx-auto"
            alt="Dashboard Preview"
          />
        </div>
      </div>
    </section>
  `;
}
