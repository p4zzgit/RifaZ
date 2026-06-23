import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { X, Landmark } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function RequestSaqueModal({ user, config, onClose, onCreated }) {
  const [form, setForm] = useState({
    valorBruto: 0,
    pixKey: '',
    pixKeyType: 'CPF'
  });
  const [loading, setLoading] = useState(false);

  const taxa = config.taxaPercentual || 5;
  const valorTaxa = (form.valorBruto * taxa) / 100;
  const valorLiquido = form.valorBruto - valorTaxa;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.valorBruto > user.saldo) return alert('Saldo insuficiente!');
    if (form.valorBruto <= 0) return alert('Valor inválido!');

    setLoading(true);
    try {
      const { fsSetDocument } = await import('../../firebase.js');
      const id = 'saque_' + Date.now();
      
      const newSaque = {
        id,
        userId: user.id,
        userNome: user.nome,
        valorBruto: form.valorBruto,
        valorTaxa,
        valorLiquido,
        taxaAplicada: taxa,
        pixKey: form.pixKey,
        pixKeyType: form.pixKeyType,
        status: 'pendente',
        createdAt: new Date().toISOString()
      };
      
      await fsSetDocument('saques', id, newSaque);
      
      // Deduct from user balance immediately (or mark as reserved)
      await fsSetDocument('usuarios', user.id, {
        ...user,
        saldo: user.saldo - form.valorBruto
      });

      onCreated();
      onClose();
    } catch (err) {
      alert('Erro ao solicitar saque: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Solicitar Saque</h2>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${X} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl mb-8 border border-orange-100">
           <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Saldo Disponível</p>
           <p className="text-3xl font-black text-orange-700">R$ ${user.saldo.toFixed(2)}</p>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Valor do Saque (R$)</label>
            <input 
              type="number"
              required
              step="0.01"
              max=${user.saldo}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-black text-xl"
              value=${form.valorBruto}
              onInput=${e => setForm({ ...form, valorBruto: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Chave</label>
               <select 
                 className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                 value=${form.pixKeyType}
                 onChange=${e => setForm({ ...form, pixKeyType: e.target.value })}
               >
                 <option>CPF</option>
                 <option>CNPJ</option>
                 <option>E-mail</option>
                 <option>Celular</option>
                 <option>Chave Aleatória</option>
               </select>
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chave PIX</label>
               <input 
                 required
                 className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                 value=${form.pixKey}
                 onInput=${e => setForm({ ...form, pixKey: e.target.value })}
               />
             </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl space-y-2">
             <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Taxa da Plataforma (${taxa}%)</span>
                <span>- R$ ${valorTaxa.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Você Receberá</span>
                <span className="text-emerald-600">R$ ${valorLiquido.toFixed(2)}</span>
             </div>
          </div>

          <button 
            disabled=${loading || form.valorBruto <= 0}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            ${loading ? 'Processando...' : 'Confirmar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  `;
}
