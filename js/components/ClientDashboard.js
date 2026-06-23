
import { h } from 'https://esm.sh/preact';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { Plus, Trash2, ExternalLink, Copy, Check } from 'https://esm.sh/lucide-preact';
import { CreateRaffleModal } from './modals/CreateRaffleModal.js';
import { CreateBolaoModal } from './modals/CreateBolaoModal.js';

const html = htm.bind(h);

export function ClientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ raffles: 0, boloes: 0, balance: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRaffleModal, setShowRaffleModal] = useState(false);
  const [showBolaoModal, setShowBolaoModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { fsQueryCollection } = await import('../firebase.js');
      const myRifas = await fsQueryCollection('rifas', 'userId', '==', user.id);
      const myBoloes = await fsQueryCollection('boloes', 'userId', '==', user.id);
      
      setStats({
        raffles: myRifas.length,
        boloes: myBoloes.length,
        balance: user.saldo || 0
      });

      if (activeTab === 'rifas') setItems(myRifas);
      else if (activeTab === 'boloes') setItems(myBoloes);
      else setItems([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id, activeTab, user.saldo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (collection, id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const { fsDeleteDocument } = await import('../firebase.js');
      await fsDeleteDocument(collection, id);
      loadData();
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const copyLink = (slug, type, id) => {
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/${type}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return html`
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside className="w-72 bg-slate-900 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">Organizador</span>
          </div>

          <nav className="space-y-2">
            ${['overview', 'rifas', 'boloes', 'financeiro', 'config'].map(tab => html`
              <button 
                key=${tab}
                onClick=${() => setActiveTab(tab)}
                className=${`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <span className="capitalize">${tab}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick=${onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">Olá, ${user.nome}!</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Disponível</p>
              <p className="text-lg font-black text-orange-600">R$ ${stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          ${activeTab === 'overview' && html`
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Suas Rifas</p>
                <p className="text-4xl font-black text-slate-900">${stats.raffles}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seus Bolões</p>
                <p className="text-4xl font-black text-slate-900">${stats.boloes}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Participantes</p>
                <p className="text-4xl font-black text-slate-900">0</p>
              </div>
            </div>
          `}
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 capitalize">${activeTab}</h3>
              
              ${activeTab === 'rifas' && html`
                <button onClick=${() => setShowRaffleModal(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                  <${Plus} className="w-4 h-4" /> Nova Rifa
                </button>
              `}
              ${activeTab === 'boloes' && html`
                <button onClick=${() => setShowBolaoModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95">
                  <${Plus} className="w-4 h-4" /> Novo Bolão
                </button>
              `}
            </div>

            ${loading ? html`
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ` : items.length === 0 ? html`
              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                <span className="text-6xl mb-4">📂</span>
                <p className="font-bold">Nenhum registro encontrado.</p>
                <p className="text-xs">Comece criando seu primeiro conteúdo agora mesmo.</p>
              </div>
            ` : html`
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${items.map(item => html`
                  <div key=${item.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">${item.nome}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">${item.status}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick=${() => copyLink(item.slug, activeTab === 'rifas' ? 'rifa' : 'bolao', item.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Copiar Link"
                        >
                          ${copiedId === item.id ? html`<${Check} className="w-4 h-4 text-emerald-500" />` : html`<${Copy} className="w-4 h-4" />`}
                        </button>
                        <button 
                          onClick=${() => handleDelete(activeTab, item.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Excluir"
                        >
                          <${Trash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor:</span>
                        <span className="text-sm font-black text-slate-900">R$ ${item.pricePerParticipant.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick=${() => window.open(`#/${activeTab === 'rifas' ? 'rifa' : 'bolao'}/${item.slug}`, '_blank')}
                        className="flex items-center gap-2 text-xs font-black text-orange-600 hover:underline uppercase tracking-widest"
                      >
                        Ver Página <${ExternalLink} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        </div>
      </main>

      ${showRaffleModal && html`<${CreateRaffleModal} user=${user} onClose=${() => setShowRaffleModal(false)} onCreated=${loadData} />`}
      ${showBolaoModal && html`<${CreateBolaoModal} user=${user} onClose=${() => setShowBolaoModal(false)} onCreated=${loadData} />`}
    </div>
  `;
}
