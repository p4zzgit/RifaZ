
import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { X } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function CreateRaffleModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({
    nome: '',
    description: '',
    tipo: 'normal', // normal, cha-rifa, cha-fraldas, cha-revelacao
    tema: 'neutro', // bebe, moto, carro, futebol, evento, neutro
    corSecundaria: '#ea580c',
    pricePerParticipant: 10,
    maxParticipants: 100,
    bannerUrl: '',
    slug: '',
    faixas: [] // { de: 1, ate: 20, valor: 15 }
  });
  const [showFaixas, setShowFaixas] = useState(false);
  const [loading, setLoading] = useState(false);

  const addFaixa = () => {
    setForm({ ...form, faixas: [...form.faixas, { de: 1, ate: 10, valor: 10 }] });
  };

  const removeFaixa = (index) => {
    const newFaixas = [...form.faixas];
    newFaixas.splice(index, 1);
    setForm({ ...form, faixas: newFaixas });
  };

  const updateFaixa = (index, field, value) => {
    const newFaixas = [...form.faixas];
    newFaixas[index][field] = value;
    setForm({ ...form, faixas: newFaixas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fsSetDocument } = await import('../../firebase.js');
      const id = 'rifa_' + Date.now();
      const slug = form.slug || form.nome.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      
      const newRifa = {
        ...form,
        id,
        userId: user.id,
        slug,
        status: 'ativo',
        bookedNumbers: [],
        createdAt: new Date().toISOString()
      };
      
      await fsSetDocument('rifas', id, newRifa);
      onCreated();
      onClose();
    } catch (err) {
      alert('Erro ao criar rifa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const campaignTypes = [
    { id: 'normal', label: 'Rifa Tradicional' },
    { id: 'cha-rifa', label: 'Chá Rifa' },
    { id: 'cha-fraldas', label: 'Chá de Fraldas' },
    { id: 'cha-revelacao', label: 'Chá Revelação' }
  ];

  const themes = [
    { id: 'neutro', label: 'Neutro' },
    { id: 'bebe', label: 'Bebê' },
    { id: 'moto', label: 'Moto' },
    { id: 'carro', label: 'Carro' },
    { id: 'futebol', label: 'Futebol' },
    { id: 'evento', label: 'Evento' }
  ];

  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configurar Campanha</h2>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <${X} className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Campanha</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${form.tipo}
                onChange=${e => setForm({ ...form, tipo: e.target.value })}
              >
                ${campaignTypes.map(t => html`<option value=${t.id}>${t.label}</option>`)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tema Visual</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${form.tema}
                onChange=${e => setForm({ ...form, tema: e.target.value })}
              >
                ${themes.map(t => html`<option value=${t.id}>${t.label}</option>`)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título da Rifa</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              value=${form.nome}
              onInput=${e => setForm({ ...form, nome: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cor Secundária</label>
              <input 
                type="color"
                className="w-full h-12 p-1 bg-slate-50 border-0 rounded-2xl cursor-pointer"
                value=${form.corSecundaria}
                onInput=${e => setForm({ ...form, corSecundaria: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Qtd Números</label>
              <input 
                type="number"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                value=${form.maxParticipants}
                onInput=${e => setForm({ ...form, maxParticipants: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuração de Preços</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400">Preços por Faixa?</span>
                <button 
                  type="button"
                  onClick=${() => setShowFaixas(!showFaixas)}
                  className=${`w-10 h-5 rounded-full transition-all relative ${showFaixas ? 'bg-orange-600' : 'bg-slate-300'}`}
                >
                  <span className=${`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showFaixas ? 'left-6' : 'left-1'}`}></span>
                </button>
              </div>
            </div>

            ${!showFaixas ? html`
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preço Fixo por Cota</label>
                <input 
                  type="number"
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
                  value=${form.pricePerParticipant}
                  onInput=${e => setForm({ ...form, pricePerParticipant: parseFloat(e.target.value) })}
                />
              </div>
            ` : html`
              <div className="space-y-3">
                ${form.faixas.map((f, i) => html`
                  <div key=${i} className="flex gap-2 items-center">
                    <input type="number" placeholder="De" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" value=${f.de} onInput=${e => updateFaixa(i, 'de', parseInt(e.target.value))} />
                    <input type="number" placeholder="Até" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" value=${f.ate} onInput=${e => updateFaixa(i, 'ate', parseInt(e.target.value))} />
                    <input type="number" placeholder="Valor R$" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold" value=${f.valor} onInput=${e => updateFaixa(i, 'valor', parseFloat(e.target.value))} />
                    <button type="button" onClick=${() => removeFaixa(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><${X} className="w-4 h-4" /></button>
                  </div>
                `)}
                <button type="button" onClick=${addFaixa} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-100 uppercase tracking-widest">+ Adicionar Faixa</button>
              </div>
            `}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Banner URL (Opcional)</label>
            <input 
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium"
              placeholder="https://..."
              value=${form.bannerUrl}
              onInput=${e => setForm({ ...form, bannerUrl: e.target.value })}
            />
          </div>

          <button 
            disabled=${loading}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${loading ? 'Configurando...' : 'Criar Campanha Agora'}
          </button>
        </form>
      </div>
    </div>
  `;
}
