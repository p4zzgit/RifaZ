
import { h } from 'https://esm.sh/preact';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { Users, Layout, Settings, LogOut, Trash2, Edit3, Save, Check, X, Search } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, raffles: 0, boloes: 0, totalSaldo: 0 });
  const [items, setItems] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { fsGetCollection, fsGetDocument } = await import('../firebase.js');
      const allUsers = await fsGetCollection('usuarios');
      const allRifas = await fsGetCollection('rifas');
      const allBoloes = await fsGetCollection('boloes');
      const platformConfig = await fsGetDocument('config', 'main');
      
      setStats({
        users: allUsers.length,
        raffles: allRifas.length,
        boloes: allBoloes.length,
        totalSaldo: allUsers.reduce((acc, u) => acc + (u.saldo || 0), 0)
      });

      setConfig(platformConfig);

      if (activeTab === 'usuarios') setItems(allUsers);
      else if (activeTab === 'rifas') setItems(allRifas);
      else if (activeTab === 'boloes') setItems(allBoloes);
      else setItems([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      const { fsSetDocument } = await import('../firebase.js');
      await fsSetDocument('config', 'main', config);
      alert('Configurações atualizadas!');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Excluir este usuário permanentemente?')) return;
    try {
      const { fsDeleteDocument } = await import('../firebase.js');
      await fsDeleteDocument('usuarios', id);
      loadData();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleSaveUser = async () => {
    try {
      const { fsSetDocument } = await import('../firebase.js');
      await fsSetDocument('usuarios', editingUser.id, editingUser);
      setEditingUser(null);
      loadData();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Layout },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'rifas', label: 'Rifas', icon: Users },
    { id: 'boloes', label: 'Bolões', icon: Users },
    { id: 'config', label: 'Configurações', icon: Settings }
  ];

  const filteredItems = items.filter(item => 
    item.nome?.toLowerCase().includes(search.toLowerCase()) || 
    item.username?.toLowerCase().includes(search.toLowerCase())
  );

  return html`
    <div className="flex h-screen bg-slate-950 overflow-hidden text-white">
      <!-- Sidebar -->
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex-shrink-0 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-slate-900 font-black text-xl">A</span>
            </div>
            <span className="font-black text-xl tracking-tight">Admin Master</span>
          </div>

          <nav className="space-y-1">
            ${tabs.map(tab => html`
              <button 
                key=${tab.id}
                onClick=${() => setActiveTab(tab.id)}
                className=${`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-950 shadow-lg shadow-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <${tab.icon} className="w-4 h-4" />
                <span>${tab.label}</span>
              </button>
            `)}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick=${onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <${LogOut} className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Painel Administrativo</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gestão Global da Plataforma</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo em Custódia</p>
              <p className="text-xl font-black text-emerald-400">R$ ${stats.totalSaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          ${activeTab === 'overview' && html`
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Usuários</p>
                <p className="text-4xl font-black">${stats.users}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rifas Ativas</p>
                <p className="text-4xl font-black text-orange-500">${stats.raffles}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bolões Ativos</p>
                <p className="text-4xl font-black text-blue-500">${stats.boloes}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Novos Hoje</p>
                <p className="text-4xl font-black text-emerald-500">2</p>
              </div>
            </div>
          `}

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 min-h-[400px]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black capitalize">${activeTab}</h3>
                ${['usuarios', 'rifas', 'boloes'].includes(activeTab) && html`
                  <div className="relative">
                    <${Search} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="bg-white/5 border border-white/10 rounded-full pl-11 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-white/20 transition-all"
                      onInput=${e => setSearch(e.target.value)}
                    />
                  </div>
                `}
             </div>

             ${loading ? html`
               <div className="flex items-center justify-center py-20">
                 <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
               </div>
             ` : activeTab === 'usuarios' ? html`
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Nome / Usuário</th>
                       <th className="pb-4 px-4">Saldo</th>
                       <th className="pb-4 px-4">Role</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${filteredItems.map(u => html`
                       <tr key=${u.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${u.nome}</p>
                           <p className="text-xs text-slate-500">@${u.username}</p>
                         </td>
                         <td className="py-4 px-4">
                           ${editingUser?.id === u.id ? html`
                             <input 
                               type="number" 
                               className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-sm"
                               value=${editingUser.saldo}
                               onInput=${e => setEditingUser({ ...editingUser, saldo: parseFloat(e.target.value) })}
                             />
                           ` : html`<span className="font-bold text-sm text-emerald-400">R$ ${u.saldo?.toFixed(2)}</span>`}
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${u.role}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                              <span className=${`w-1.5 h-1.5 rounded-full ${u.status === 'ativo' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              ${u.status}
                            </span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="flex justify-end gap-2">
                             ${editingUser?.id === u.id ? html`
                               <button onClick=${handleSaveUser} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                 <${Check} className="w-4 h-4" />
                               </button>
                               <button onClick=${() => setEditingUser(null)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                 <${X} className="w-4 h-4" />
                               </button>
                             ` : html`
                               <button onClick=${() => setEditingUser(u)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                                 <${Edit3} className="w-4 h-4" />
                               </button>
                               <button onClick=${() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                                 <${Trash2} className="w-4 h-4" />
                               </button>
                             `}
                           </div>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             ` : activeTab === 'config' ? html`
                <form onSubmit=${handleUpdateConfig} className="max-w-2xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome da Plataforma</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${config?.platformName}
                        onInput=${e => setConfig({ ...config, platformName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">E-mail de Contato</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${config?.contactEmail}
                        onInput=${e => setConfig({ ...config, contactEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp de Suporte</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                      value=${config?.suporteWhatsapp}
                      onInput=${e => setConfig({ ...config, suporteWhatsapp: e.target.value })}
                    />
                  </div>

                  <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl shadow-white/10 hover:bg-slate-200 transition-all active:scale-95">
                    <${Save} className="w-5 h-5" /> Salvar Configurações
                  </button>
                </form>
             ` : html`
               <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                 <span className="text-6xl mb-4">⚙️</span>
                 <p className="font-bold">Módulo em migração...</p>
                 <p className="text-xs">As listagens de Rifas e Bolões serão restauradas com filtros globais.</p>
               </div>
             `}
          </div>
        </div>
      </main>
    </div>
  `;
}
