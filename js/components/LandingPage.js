
import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { Header } from './common/Header.js';
import { Footer } from './common/Footer.js';
import { Hero } from './landing/Hero.js';
import { Ticket, Trophy, ArrowRight } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function LandingPage() {
  const [config, setConfig] = useState(null);
  const [rifas, setRifas] = useState([]);
  const [boloes, setBoloes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { fsGetGlobalConfig, fsGetCollection } = await import('../firebase.js');
        const cfg = await fsGetGlobalConfig();
        setConfig(cfg);
        
        const allRifas = await fsGetCollection('rifas');
        const allBoloes = await fsGetCollection('boloes');
        
        setRifas(allRifas.filter(r => r.status === 'ativo').slice(0, 4));
        setBoloes(allBoloes.filter(b => b.status === 'ativo').slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return html`
    <div className="min-h-screen">
      <${Header} config=${config} />
      
      <main>
        <${Hero} config=${config} />

        <!-- Dynamic Items Section -->
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">Participe Agora</span>
                  <h2 className="text-4xl font-black text-slate-900 mt-2">Sorteios em Destaque</h2>
               </div>
            </div>

            ${loading ? html`
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ` : html`
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${rifas.map(r => html`
                  <div key=${r.id} onClick=${() => window.location.hash = `/rifa/${r.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-4">
                      <img src=${r.bannerUrl || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase">Rifa</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${r.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${r.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-orange-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Ver agora <${ArrowRight} className="w-3 h-3" /></span>
                    </div>
                  </div>
                `)}

                ${boloes.map(b => html`
                  <div key=${b.id} onClick=${() => window.location.hash = `/bolao/${b.slug}`} className="cursor-pointer group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-blue-900 mb-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                         <${Trophy} className="w-32 h-32 text-white" />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase">Bolão</span>
                        </div>
                        <h3 className="text-white font-black text-xl leading-tight">${b.nome}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-slate-500 text-sm font-bold">Cota: <span className="text-slate-900">R$ ${b.pricePerParticipant.toFixed(2)}</span></span>
                       <span className="text-blue-600 font-black text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">Palpitar <${ArrowRight} className="w-3 h-3" /></span>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        </section>
        
        <!-- Features Section -->
        <section id="funciona" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">${config?.featuresLabel || 'Benefícios'}</span>
              <h2 className="text-4xl font-black text-slate-900 mt-2">${config?.featuresTitle || 'Por que escolher nossa plataforma?'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${config?.features?.map(f => html`
                <div key=${f.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">${f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">${f.desc}</p>
                </div>
              `)}
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section id="precos" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Planos Simples e Transparentes</h2>
            <p className="text-slate-600 mb-12">Escolha o plano que melhor se adapta ao seu sorteio.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
                <h3 className="text-xl font-bold mb-2">Básico</h3>
                <div className="text-3xl font-black mb-6">Grátis <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Até 100 números</li>
                  <li>✅ Taxa de 10%</li>
                  <li>✅ Suporte por Email</li>
                </ul>
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Selecionar</button>
              </div>

              <div className="p-8 bg-white rounded-3xl border-2 border-orange-500 shadow-xl shadow-orange-100 text-left relative overflow-hidden scale-105">
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase">Mais Popular</div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-black mb-6">R$ 49 <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Até 10.000 números</li>
                  <li>✅ Taxa de 5%</li>
                  <li>✅ Suporte WhatsApp VIP</li>
                </ul>
                <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">Selecionar</button>
              </div>

              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
                <h3 className="text-xl font-bold mb-2">Elite</h3>
                <div className="text-3xl font-black mb-6">R$ 199 <span className="text-sm text-slate-400 font-normal">/setup</span></div>
                <ul className="space-y-4 text-slate-600 mb-8">
                  <li>✅ Números Ilimitados</li>
                  <li>✅ Taxa de 2.5%</li>
                  <li>✅ Gerente de Contas</li>
                </ul>
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Selecionar</button>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-4">
              ${config?.faqs?.map(faq => html`
                <div key=${faq.q} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">${faq.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">${faq.a}</p>
                </div>
              `)}
            </div>
          </div>
        </section>
      </main>

      <${Footer} config=${config} />
    </div>
  `;
}
