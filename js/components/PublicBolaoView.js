
import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { ArrowLeft, Trophy, Calendar, Users, ShieldCheck } from 'https://esm.sh/lucide-preact';

import { ParticipateBolaoModal } from './modals/ParticipateBolaoModal.js';

const html = htm.bind(h);

export function PublicBolaoView() {
  const [bolao, setBolao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const slug = window.location.hash.split('/').pop();

  useEffect(() => {
    async function load() {
      try {
        const { fsQueryCollection } = await import('../firebase.js');
        const results = await fsQueryCollection('boloes', 'slug', '==', slug);
        if (results.length > 0) setBolao(results[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return html`
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `;
  if (!bolao) return html`<div className="p-20 text-center text-white bg-slate-950 min-h-screen">Bolão não encontrado.</div>`;

  return html`
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <button 
        onClick=${() => window.location.hash = '/'}
        className="fixed top-8 left-8 z-50 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:bg-white/10 transition-all group"
      >
        <${ArrowLeft} className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Bolão Header -->
      <div className="relative h-[60vh] bg-blue-900/20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
           <${Trophy} className="w-96 h-96" />
        </div>
        
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Inscrições Abertas</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">${bolao.nome}</h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">${bolao.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black flex items-center gap-3">
                     <${Calendar} className="text-blue-500" /> Próximas Partidas
                   </h3>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                  <span className="text-5xl mb-4">⚽</span>
                  <p className="text-sm font-bold">Aguardando definição dos confrontos...</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                  <${Users} className="text-blue-500" /> Ranking Global
                </h3>
                <p className="text-slate-500 text-sm font-medium">O ranking será atualizado automaticamente assim que as partidas começarem.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-600 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <${Trophy} className="w-24 h-24" />
                </div>
                
                <h4 className="text-2xl font-black mb-2">Entre no Jogo</h4>
                <p className="text-blue-100 text-sm mb-10 font-medium leading-relaxed">Faça seus palpites agora e concorra ao prêmio acumulado deste bolão.</p>
                
                <div className="space-y-4 mb-10 pt-8 border-t border-blue-500/30">
                   <div className="flex justify-between items-center text-blue-200 text-sm font-bold">
                      <span>Cota Individual</span>
                      <span className="text-white">R$ ${bolao.pricePerParticipant.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-200">Prêmio Estimado</span>
                      <span className="text-3xl font-black">R$ 1.250,00</span>
                   </div>
                </div>

                <button onClick=${() => setShowModal(true)} className="w-full py-5 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 text-lg">
                  Quero Participar
                </button>

                <div className="mt-8 flex items-center gap-3 text-blue-200/60">
                   <${ShieldCheck} className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Participação Garantida</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                <h4 className="text-lg font-black mb-4">Regulamento</h4>
                <ul className="space-y-3 text-slate-500 text-xs font-medium list-disc pl-4">
                  <li>Acerte o placar exato: 25 pontos</li>
                  <li>Acerte o vencedor e diferença: 15 pontos</li>
                  <li>Acerte apenas o vencedor: 10 pontos</li>
                  <li>O prêmio será dividido entre os 3 primeiros.</li>
                </ul>
              </div>
           </div>
        </div>
      </div>
      ${showModal && html`<${ParticipateBolaoModal} bolao=${bolao} onClose=${() => setShowModal(false)} />`}
    </div>
  `;
}
