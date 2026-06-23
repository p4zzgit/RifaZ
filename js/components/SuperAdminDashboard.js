
import { h } from 'https://esm.sh/preact';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { Users, Layout, Settings, LogOut, Trash2, Edit3, Save, Check, X, Search } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, raffles: 0, boloes: 0, totalSaldo: 0 });
  const [lixeiraTab, setLixeiraTab] = useState('usuarios'); // usuarios, rifas, boloes
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
      const allSaques = await fsGetCollection('saques');
      const trashUsers = await fsGetCollection('usuarios_lixeira');
      const trashRifas = await fsGetCollection('rifas_lixeira');
      const trashBoloes = await fsGetCollection('boloes_lixeira');
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
      else if (activeTab === 'saques') setItems(allSaques);
      else if (activeTab === 'lixeira') {
        if (lixeiraTab === 'usuarios') setItems(trashUsers);
        else if (lixeiraTab === 'rifas') setItems(trashRifas);
        else if (lixeiraTab === 'boloes') setItems(trashBoloes);
      }
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
      // Update server state if needed or just tell user to refresh
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleTestMP = async () => {
    try {
      const res = await fetch('/api/admin/test-mp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: config.mercadopago.accessToken })
      });
      const data = await res.json();
      if (data.success) alert('Conexão com Mercado Pago bem sucedida!');
      else alert('Erro: ' + data.error);
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleUpdateSaqueStatus = async (saque, newStatus) => {
    try {
      const { fsSetDocument } = await import('../firebase.js');
      await fsSetDocument('saques', saque.id, { ...saque, status: newStatus });
      loadData();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleMoveToTrash = async (collection, item) => {
    if (!confirm(`Mover ${item.nome || item.username} para a lixeira?`)) return;
    try {
      const { fsSetDocument, fsDeleteDocument } = await import('../firebase.js');
      await fsSetDocument(`${collection}_lixeira`, item.id, item);
      await fsDeleteDocument(collection, item.id);
      loadData();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleRestoreFromTrash = async (collection, item) => {
    try {
      const { fsSetDocument, fsDeleteDocument } = await import('../firebase.js');
      await fsSetDocument(collection, item.id, item);
      await fsDeleteDocument(`${collection}_lixeira`, item.id);
      loadData();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handlePermanentDelete = async (collection, id) => {
    if (!confirm('Excluir permanentemente? Esta ação não pode ser desfeita.')) return;
    try {
      const { fsDeleteDocument } = await import('../firebase.js');
      await fsDeleteDocument(collection, id);
      loadData();
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
    { id: 'rifas', label: 'Rifas', icon: Layout },
    { id: 'boloes', label: 'Bolões', icon: Layout },
    { id: 'saques', label: 'Saques', icon: Settings },
    { id: 'lixeira', label: 'Lixeira', icon: Trash2 },
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
                               <button onClick=${() => handleMoveToTrash('usuarios', u)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
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
              ` : activeTab === 'rifas' ? html`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Campanha</th>
                       <th className="pb-4 px-4">Organizador</th>
                       <th className="pb-4 px-4">Cotas</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${items.map(r => html`
                       <tr key=${r.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                               <${Layout} className="w-5 h-5 text-orange-500" />
                             </div>
                             <div>
                               <p className="font-bold text-sm">${r.nome}</p>
                               <div className="flex items-center gap-2">
                                 <span className="text-[8px] text-slate-500 uppercase font-black px-1.5 py-0.5 bg-white/5 rounded">${r.tipo || 'normal'}</span>
                                 <span className="text-[8px] text-emerald-500 uppercase font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">R$ ${(r.bookedNumbers?.length || 0) * (r.pricePerParticipant || 0)}</span>
                               </div>
                             </div>
                           </div>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm opacity-60">ID: ${r.userId}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm font-bold text-slate-300">${r.bookedNumbers?.length || 0}</span>
                            <span className="text-[10px] text-slate-600 ml-1">/ ${r.maxParticipants}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className=${`px-2 py-1 rounded text-[10px] font-bold uppercase ${r.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-slate-400'}`}>${r.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <button onClick=${() => handleMoveToTrash('rifas', r)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                             <${Trash2} className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             ` : activeTab === 'boloes' ? html`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Bolão</th>
                       <th className="pb-4 px-4">Organizador</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${items.map(b => html`
                       <tr key=${b.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${b.nome}</p>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm opacity-60">ID: ${b.userId}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${b.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                            <button onClick=${() => handleMoveToTrash('boloes', b)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                             <${Trash2} className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             ` : activeTab === 'saques' ? html`
                <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4 px-4">Usuário / Chave PIX</th>
                       <th className="pb-4 px-4">Valor Bruto</th>
                       <th className="pb-4 px-4">Taxa (${config?.taxaPercentual}%)</th>
                       <th className="pb-4 px-4">Valor Líquido</th>
                       <th className="pb-4 px-4">Status</th>
                       <th className="pb-4 px-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     ${items.map(s => html`
                       <tr key=${s.id} className="group hover:bg-white/5 transition-colors">
                         <td className="py-4 px-4">
                           <p className="font-bold text-sm">${s.userNome}</p>
                           <p className="text-xs text-slate-500">${s.pixKey} (${s.pixKeyType})</p>
                         </td>
                         <td className="py-4 px-4">
                           <span className="font-bold text-sm">R$ ${s.valorBruto.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="text-sm text-red-400">- R$ ${s.valorTaxa.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="font-bold text-sm text-emerald-400">R$ ${s.valorLiquido.toFixed(2)}</span>
                         </td>
                         <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">${s.status}</span>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="flex justify-end gap-2">
                             ${s.status === 'pendente' && html`
                               <button onClick=${() => handleUpdateSaqueStatus(s, 'pago')} className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 uppercase">
                                 Pagar
                               </button>
                               <button onClick=${() => handleUpdateSaqueStatus(s, 'recusado')} className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 uppercase">
                                 Recusar
                               </button>
                             `}
                           </div>
                         </td>
                       </tr>
                     `)}
                   </tbody>
                 </table>
               </div>
             ` : activeTab === 'lixeira' ? html`
                <div className="space-y-6">
                  <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
                    ${['usuarios', 'rifas', 'boloes'].map(t => html`
                      <button 
                        onClick=${() => { setLixeiraTab(t); loadData(); }}
                        className=${`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${lixeiraTab === t ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        ${t}
                      </button>
                    `)}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                          <th className="pb-4 px-4">Item</th>
                          <th className="pb-4 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        ${items.map(i => html`
                          <tr key=${i.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4">
                              <p className="font-bold text-sm">${i.nome || i.username || i.id}</p>
                              <p className="text-[10px] text-slate-500">ID: ${i.id}</p>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button onClick=${() => handleRestoreFromTrash(lixeiraTab, i)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg hover:bg-emerald-500 hover:text-white uppercase">
                                Restaurar
                              </button>
                              <button onClick=${() => handlePermanentDelete(`${lixeiraTab}_lixeira`, i.id)} className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white uppercase">
                                Excluir Permanentemente
                              </button>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                </div>
             ` : activeTab === 'config' ? html`
                <form onSubmit=${handleUpdateConfig} className="max-w-4xl space-y-12">
                  <!-- General Config -->
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 pb-2 border-b border-white/5">Configurações Gerais</h4>
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
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Taxa da Plataforma (%)</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                        value=${config?.taxaPercentual}
                        onInput=${e => setConfig({ ...config, taxaPercentual: parseFloat(e.target.value) })}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Este percentual será retido no momento do saque do organizador.</p>
                    </div>
                  </div>

                  <!-- Mercado Pago Config -->
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 pb-2 border-b border-white/5">Integração Mercado Pago</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Access Token</label>
                        <input 
                          type="password"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${config?.mercadopago?.accessToken}
                          onInput=${e => setConfig({ ...config, mercadopago: { ...config.mercadopago, accessToken: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Public Key</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/20"
                          value=${config?.mercadopago?.publicKey}
                          onInput=${e => setConfig({ ...config, mercadopago: { ...config.mercadopago, publicKey: e.target.value } })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-0" 
                            checked=${config?.mercadopago?.isProduction}
                            onChange=${e => setConfig({ ...config, mercadopago: { ...config.mercadopago, isProduction: e.target.checked } })}
                          />
                          <span className="text-sm font-bold">Modo Produção</span>
                       </label>
                       <button type="button" onClick=${handleTestMP} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                          Testar Conexão
                       </button>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">URL de Webhook</p>
                       <code className="text-xs text-emerald-400 break-all">${window.location.origin}/api/webhooks/mercadopago</code>
                       <p className="text-[10px] text-slate-500 mt-2">Configure esta URL nas configurações de notificações da sua aplicação no Mercado Pago.</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl shadow-white/10 hover:bg-slate-200 transition-all active:scale-95">
                    <${Save} className="w-5 h-5" /> Salvar Todas as Configurações
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
