
import { h } from 'https://esm.sh/preact';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { CheckoutModal } from './modals/CheckoutModal.js';
import { ArrowLeft } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function PublicRaffleView() {
  const [rifa, setRifa] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const slug = window.location.hash.split('/').pop();

  const loadRifa = useCallback(async () => {
    try {
      const { fsQueryCollection } = await import('../firebase.js');
      const results = await fsQueryCollection('rifas', 'slug', '==', slug);
      if (results.length > 0) setRifa(results[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadRifa();
  }, [loadRifa]);

  const toggleNumber = (num) => {
    if (rifa.bookedNumbers?.includes(num)) return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const onFinishPurchase = () => {
    setSelectedNumbers([]);
    loadRifa();
  };

  if (loading) return html`
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  `;
  
  if (!rifa) return html`<div className="p-20 text-center font-bold text-slate-500">Rifa não encontrada.</div>`;

  return html`
    <div className="min-h-screen bg-white pb-20">
      <button 
        onClick=${() => window.location.hash = '/'}
        className="fixed top-8 left-8 z-50 p-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full shadow-lg hover:bg-white transition-all group"
      >
        <${ArrowLeft} className="w-6 h-6 text-slate-900 group-hover:-translate-x-1 transition-transform" />
      </button>

      <!-- Rifa Hero -->
      <div className="relative h-[50vh] bg-slate-900 overflow-hidden">
        <img src=${rifa.bannerUrl || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000'} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Sorteio Ativo</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">${rifa.nome}</h1>
            <p className="text-slate-500 font-medium">${rifa.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Selection Grid -->
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Escolha seus números</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Toque nos números para selecionar</p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
                <span className="flex items-center gap-2 text-slate-400"><span className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></span> Livre</span>
                <span className="flex items-center gap-2 text-orange-600"><span className="w-3 h-3 bg-orange-600 rounded-sm"></span> Selecionado</span>
                <span className="flex items-center gap-2 text-slate-900"><span className="w-3 h-3 bg-slate-900 rounded-sm"></span> Reservado</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
              ${Array.from({ length: rifa.maxParticipants }).map((_, i) => {
                const num = i + 1;
                const isBooked = rifa.bookedNumbers?.includes(num);
                const isSelected = selectedNumbers.includes(num);
                
                return html`
                  <button 
                    key=${num}
                    disabled=${isBooked}
                    onClick=${() => toggleNumber(num)}
                    className=${`aspect-square flex items-center justify-center rounded-2xl font-black text-sm transition-all ${isBooked ? 'bg-slate-950 text-white cursor-not-allowed opacity-20' : isSelected ? 'bg-orange-600 text-white shadow-xl shadow-orange-200 scale-105 z-10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent hover:border-slate-200'}`}
                  >
                    ${num}
                  </button>
                `;
              })}
            </div>
          </div>

          <!-- Summary / Checkout -->
          <div className="space-y-6">
            <div className="bg-slate-950 rounded-[3rem] p-10 sticky top-10 text-white shadow-2xl shadow-slate-900/20">
              <h4 className="text-xl font-black mb-8">Resumo da Reserva</h4>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Números selecionados</span>
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">${selectedNumbers.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Preço por número</span>
                  <span className="text-white">R$ ${rifa.pricePerParticipant.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-black text-white pt-6 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-orange-500">R$ ${(selectedNumbers.length * rifa.pricePerParticipant).toFixed(2)}</span>
                </div>
              </div>

              <button 
                disabled=${selectedNumbers.length === 0}
                onClick=${() => setShowCheckout(true)}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 hover:bg-orange-700 transition-all disabled:opacity-30 disabled:grayscale active:scale-95"
              >
                Reservar Números Agora
              </button>

              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                     <span className="text-lg">🛡️</span>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Transação Segura</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Criptografia de 256 bits</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${showCheckout && html`<${CheckoutModal} rifa=${rifa} selectedNumbers=${selectedNumbers} onClose=${() => setShowCheckout(false)} onFinish=${onFinishPurchase} />`}
    </div>
  `;
}
