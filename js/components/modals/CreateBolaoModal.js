
import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { X } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function CreateBolaoModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({
    nome: '',
    description: '',
    pricePerParticipant: 20,
    slug: '',
    matches: [] // { id, home, away, date }
  });
  const [loading, setLoading] = useState(false);

  const addMatch = () => {
    setForm({ 
      ...form, 
      matches: [...form.matches, { id: 'm_' + Date.now(), home: '', away: '', date: '' }] 
    });
  };

  const removeMatch = (index) => {
    const newMatches = [...form.matches];
    newMatches.splice(index, 1);
    setForm({ ...form, matches: newMatches });
  };

  const updateMatch = (index, field, value) => {
    const newMatches = [...form.matches];
    newMatches[index][field] = value;
    setForm({ ...form, matches: newMatches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.matches.length === 0) {
      alert('Adicione pelo menos uma partida ao bolão.');
      return;
    }
    setLoading(true);
    try {
      const { fsSetDocument } = await import('../../firebase.js');
      const id = 'bolao_' + Date.now();
      const slug = form.slug || form.nome.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      
      const newBolao = {
        ...form,
        id,
        userId: user.id,
        slug,
        status: 'ativo',
        createdAt: new Date().toISOString()
      };
      
      await fsSetDocument('boloes', id, newBolao);
      onCreated();
      onClose();
    } catch (err) {
      alert('Erro ao criar bolão: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configurar Bolão</h2>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${X} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título do Bolão</label>
              <input 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                value=${form.nome}
                onInput=${e => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço da Cota (R$)</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                value=${form.pricePerParticipant}
                onInput=${e => setForm({ ...form, pricePerParticipant: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partidas do Bolão</h3>
              <button type="button" onClick=${addMatch} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest">
                + Adicionar Jogo
              </button>
            </div>

            <div className="space-y-4">
              ${form.matches.map((m, i) => html`
                <div key=${m.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Mandante</label>
                     <input required className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${m.home} onInput=${e => updateMatch(i, 'home', e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Visitante</label>
                     <input required className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${m.away} onInput=${e => updateMatch(i, 'away', e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Data/Hora</label>
                     <input required type="datetime-local" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold" value=${m.date} onInput=${e => updateMatch(i, 'date', e.target.value)} />
                   </div>
                   <div className="flex justify-end">
                     <button type="button" onClick=${() => removeMatch(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                       <${X} className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              `)}

              ${form.matches.length === 0 && html`
                <div className="text-center py-10 opacity-30">
                  <p className="text-xs font-bold">Nenhuma partida adicionada ainda.</p>
                </div>
              `}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição / Premiação</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium min-h-[100px]"
              value=${form.description}
              onInput=${e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button 
            disabled=${loading}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            ${loading ? 'Configurando...' : 'Publicar Bolão Agora'}
          </button>
        </form>
      </div>
    </div>
  `;
}
