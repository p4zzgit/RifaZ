
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
    slug: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Novo Bolão</h2>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${X} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-4">
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
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço da Cota</label>
            <input 
              type="number"
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
              value=${form.pricePerParticipant}
              onInput=${e => setForm({ ...form, pricePerParticipant: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium min-h-[100px]"
              value=${form.description}
              onInput=${e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button 
            disabled=${loading}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${loading ? 'Criando...' : 'Criar Bolão Agora'}
          </button>
        </form>
      </div>
    </div>
  `;
}
