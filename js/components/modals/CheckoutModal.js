
import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { X, Copy, Check, ShieldCheck } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function CheckoutModal({ rifa, selectedNumbers, onClose, onFinish }) {
  const [step, setStep] = useState('form'); // form, payment, success
  const [buyer, setBuyer] = useState({ nome: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const total = selectedNumbers.length * rifa.pricePerParticipant;

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fsSetDocument } = await import('../../firebase.js');
      
      const participationId = 'part_' + Date.now();
      
      // Create pending participation
      await fsSetDocument('participacoes', participationId, {
        id: participationId,
        rifaId: rifa.id,
        buyer,
        numbers: selectedNumbers,
        total,
        status: 'pendente',
        createdAt: new Date().toISOString()
      });

      // Create MP Payment Preference
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Rifa: ${rifa.nome}`,
          unit_price: rifa.pricePerParticipant,
          quantity: selectedNumbers.length,
          metadata: {
            type: 'rifa',
            participation_id: participationId,
            rifa_id: rifa.id,
            numbers: selectedNumbers
          }
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Redirect to MP
      window.location.href = data.init_point;
    } catch (err) {
      alert('Erro ao processar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    // This is just a manual check button in the UI, 
    // but the real logic is in the webhook.
    // We can just poll or tell the user to wait.
    setStep('success');
  };

  const copyPix = () => {
    navigator.clipboard.writeText('00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913RIFA DIGITAL6009SAO PAULO62070503***6304E228');
    setPixCopied(true);
    setTimeout(() => setPixCopied(null), 2000);
  };

  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Finalizar Compra</h2>
            <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <${X} className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          ${step === 'form' && html`
            <form onSubmit=${handleProcess} className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resumo</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">${selectedNumbers.length} Números</span>
                    <span className="text-xl font-black text-orange-600">R$ ${total.toFixed(2)}</span>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome Completo</label>
                 <input 
                   required
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${buyer.nome}
                   onInput=${e => setBuyer({ ...buyer, nome: e.target.value })}
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu WhatsApp</label>
                 <input 
                   required
                   placeholder="(00) 00000-0000"
                   className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                   value=${buyer.whatsapp}
                   onInput=${e => setBuyer({ ...buyer, whatsapp: e.target.value })}
                 />
               </div>

               <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                 Ir para Pagamento
               </button>
            </form>
          `}

          ${step === 'payment' && html`
            <div className="text-center">
              <div className="w-48 h-48 bg-slate-100 rounded-3xl mx-auto mb-8 flex items-center justify-center p-4">
                <!-- Mock QR Code -->
                <div className="w-full h-full bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                   <div className="grid grid-cols-4 gap-2 opacity-20">
                      ${Array.from({ length: 16 }).map((_, i) => html`<div key=${i} className="w-4 h-4 bg-slate-900 rounded"></div>`)}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">QR Code PIX</span>
                   </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">Escaneie o QR Code</h3>
              <p className="text-slate-500 text-sm mb-8">Ou copie o código abaixo para pagar via Pix Copia e Cola.</p>

              <button 
                onClick=${copyPix}
                className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-100 transition-all mb-10"
              >
                <span className="text-slate-400 text-xs font-bold truncate pr-4">00020126360014BR.GOV.BCB.PIX...</span>
                ${pixCopied ? html`<span className="text-emerald-500 font-bold text-xs flex items-center gap-1"><${Check} className="w-4 h-4" /> Copiado!</span>` : html`<${Copy} className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />`}
              </button>

              <button 
                disabled=${loading}
                onClick=${handleFinish}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
              >
                ${loading ? 'Confirmando...' : 'Já fiz o pagamento'}
              </button>
            </div>
          `}

          ${step === 'success' && html`
             <div className="text-center py-10">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <${ShieldCheck} className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-2">Sucesso!</h2>
               <p className="text-slate-500 font-medium mb-8">Sua reserva foi confirmada. Boa sorte!</p>
               
               <button 
                onClick=${() => { onFinish(); onClose(); }}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl"
               >
                 Voltar para Rifa
               </button>
             </div>
          `}
        </div>
      </div>
    </div>
  `;
}
