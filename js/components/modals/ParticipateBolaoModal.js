import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { X, ShieldCheck } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function ParticipateBolaoModal({ bolao, onClose }) {
  const [step, setStep] = useState(1); // 1: Info, 2: Palpites
  const [loading, setLoading] = useState(false);
  const [buyer, setBuyer] = useState({
    nome: '',
    whatsapp: '',
    email: ''
  });
  const [palpites, setPalpites] = useState(
    bolao.matches?.reduce((acc, m) => ({ ...acc, [m.id]: { home: 0, away: 0 } }), {}) || {}
  );

  const updatePalpite = (matchId, field, value) => {
    setPalpites({
      ...palpites,
      [matchId]: { ...palpites[matchId], [field]: parseInt(value) }
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fsSetDocument } = await import('../../firebase.js');
      const participationId = 'part_bolao_' + Date.now();
      
      // Create pending participation with palpites
      await fsSetDocument('participacoes_bolao', participationId, {
        id: participationId,
        bolaoId: bolao.id,
        buyer,
        palpites,
        total: bolao.pricePerParticipant,
        status: 'pendente',
        createdAt: new Date().toISOString()
      });

      // Create MP Payment
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Bolão: ${bolao.nome}`,
          unit_price: bolao.pricePerParticipant,
          quantity: 1,
          metadata: {
            type: 'bolao',
            participation_id: participationId,
            bolao_id: bolao.id,
            palpites: JSON.stringify(palpites)
          }
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      window.location.href = data.init_point;
    } catch (err) {
      alert('Erro ao processar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Participar do Bolão</h2>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${X} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        ${step === 1 ? html`
          <form onSubmit=${handleNext} className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100 flex justify-between items-center">
               <div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Valor da Inscrição</p>
                 <p className="text-3xl font-black text-blue-700">R$ ${bolao.pricePerParticipant.toFixed(2)}</p>
               </div>
               <${ShieldCheck} className="w-10 h-10 text-blue-400 opacity-30" />
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Completo</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${buyer.nome} onInput=${e => setBuyer({ ...buyer, nome: e.target.value })} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                    <input required className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${buyer.whatsapp} onInput=${e => setBuyer({ ...buyer, whatsapp: e.target.value })} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                    <input required type="email" className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" value=${buyer.email} onInput=${e => setBuyer({ ...buyer, email: e.target.value })} />
                 </div>
               </div>
            </div>

            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 text-lg uppercase tracking-tight">
              Próximo: Registrar Palpites
            </button>
          </form>
        ` : html`
          <form onSubmit=${handleProcess} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Seus Palpites</h3>
              <button type="button" onClick=${() => setStep(1)} className="text-xs font-bold text-blue-600 hover:underline">Alterar Dados</button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              ${bolao.matches?.map(m => html`
                <div key=${m.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right">
                      <p className="text-xs font-black uppercase tracking-tight mb-2">${m.home}</p>
                      <input 
                        type="number" 
                        min="0"
                        required
                        className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-blue-500"
                        value=${palpites[m.id]?.home}
                        onInput=${e => updatePalpite(m.id, 'home', e.target.value)}
                      />
                    </div>
                    <div className="text-slate-300 font-black italic">VS</div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-black uppercase tracking-tight mb-2">${m.away}</p>
                      <input 
                        type="number" 
                        min="0"
                        required
                        className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-blue-500"
                        value=${palpites[m.id]?.away}
                        onInput=${e => updatePalpite(m.id, 'away', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[8px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
                    ${new Date(m.date).toLocaleString()}
                  </p>
                </div>
              `)}
            </div>

            <button 
              disabled=${loading}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 text-lg uppercase tracking-tight"
            >
              ${loading ? 'Processando...' : 'Confirmar e Pagar Inscrição'}
            </button>
          </form>
        `}
        
        <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest mt-8">Pagamento 100% Seguro via Mercado Pago</p>
      </div>
    </div>
  `;
}
