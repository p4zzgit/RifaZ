import React, { useState, useEffect } from 'react';
import { Rifa, Participante, Saque, Bolao, BolaoParticipant, BolaoMatch, PixKey, PixHistoryEntry } from '../types';
import { CreateRaffleModal } from './landing/CreateRaffleModal';
import { CreateBolaoModal } from './landing/CreateBolaoModal';
import { 
  Award, CreditCard, Users, LayoutGrid, Settings, LogOut, 
  ChevronRight, RefreshCw, Plus, Download, Search, AlertCircle,
  Trophy, Calendar, Shield, Save, Trash, UserCheck, Play, CheckCircle2, Sliders, DollarSign, MessageSquare, X, Menu, Share2, Copy, ExternalLink
} from 'lucide-react';

export default function ClientDashboard() {
  // Global Mode: 'rifas' or 'boloes'
  const [productMode, setProductMode] = useState<'rifas' | 'boloes'>('rifas');
  
  // Tabs for Rifas
  const [activeRifaTab, setActiveRifaTab] = useState<'dashboard' | 'rifa' | 'participantes' | 'financeiro'>('dashboard');
  // Tabs for Bolões
  const [activeBolaoTab, setActiveBolaoTab] = useState<'dashboard' | 'config' | 'matches' | 'participants' | 'financeiro'>('dashboard');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- RIFA STATE ---
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [activeRifa, setActiveRifa] = useState<Rifa | null>(null);
  const [raffleParticipants, setRaffleParticipants] = useState<Participante[]>([]);
  const [searchRafflePart, setSearchRafflePart] = useState('');

  // --- BOLÃO STATE ---
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [activeBolao, setActiveBolao] = useState<Bolao | null>(null);
  const [bolaoMatches, setBolaoMatches] = useState<BolaoMatch[]>([]);
  const [bolaoParticipants, setBolaoParticipants] = useState<BolaoParticipant[]>([]);
  const [searchBolaoPart, setSearchBolaoPart] = useState('');

  // Match Form
  const [matchForm, setMatchForm] = useState({ teamA: '', teamB: '', date: '' });
  const [showMatchForm, setShowMatchForm] = useState(false);

  // --- GENERAL STATE ---
  const [suporteWhatsapp, setSuporteWhatsapp] = useState<string>('');
  const [withdrawals, setWithdrawals] = useState<Saque[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [requestValue, setRequestValue] = useState('');
  const [requestPix, setRequestPix] = useState('');
  const [showCreateRaffle, setShowCreateRaffle] = useState(false);
  const [showCreateBolao, setShowCreateBolao] = useState(false);
  const [showConfigPix, setShowConfigPix] = useState(false);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [pixHistory, setPixHistory] = useState<PixHistoryEntry[]>([]);
  const [editingPixKeys, setEditingPixKeys] = useState<{ id?: string; tipo: string; chave: string }[]>([]);
  const [showPixConfirm, setShowPixConfirm] = useState(false);
  const [pixSaving, setPixSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [productMode]);

  async function loadAllData() {
    setLoading(true);
    try {
      const { 
        fsGetGlobalConfig, 
        fsGetCollection, 
        fsQueryCollection,
        initializeFirebaseClient,
        isFirebaseEnabled 
      } = await import('../firebase');
      
      await initializeFirebaseClient();
      if (!isFirebaseEnabled()) {
        console.warn('Firebase not enabled for client dashboard');
        setLoading(false);
        return;
      }

      // In a real app with Auth, we would filter by current user ID
      // For this PoC, we load all data or assume filtered view if we had a userId
      const [cData, wData, rData, bData, uData] = await Promise.all([
        fsGetGlobalConfig(),
        fsGetCollection('withdrawals'),
        fsGetCollection('rifas'),
        fsGetCollection('boloes'),
        fsGetCollection('usuarios') // To find our own profile
      ]);

      if (cData) {
        setSuporteWhatsapp(cData.suporteWhatsapp || '');
        setConfig(cData);
      }
      setWithdrawals(wData);
      
      // Mock finance for static
      setFinance({
        balance: 1250.50,
        pending: 350.00,
        totalWithdrawn: wData.filter((w: any) => w.status === 'aprovado').reduce((acc: number, w: any) => acc + (w.valor || 0), 0)
      });

      // Find "my" user (in static PoC we might not have a real auth context yet)
      const myUser = uData[0]; 
      if (myUser) {
        setPixKeys(myUser.pixKeys || []);
        setPixHistory(myUser.pixHistory || []);
      }

      if (productMode === 'rifas') {
        setRifas(rData);
        if (activeRifa) {
          const found = rData.find((r: any) => r.id === activeRifa.id);
          if (found) {
            setActiveRifa(found);
            const pData = await fsGetCollection(`rifas/${found.id}/participants`);
            setRaffleParticipants(pData);
          }
        }
      } else {
        setBoloes(bData);
        if (bData.length > 0) {
          handleSelectBolao(bData[0].id);
        }
      }
    } catch (e) {
      console.error('Data loading error from Firebase:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para o clipboard!');
    }
  };

  const openPixConfig = () => {
    setEditingPixKeys(pixKeys.map(k => ({ id: k.id, tipo: k.tipo, chave: k.chave })));
    setShowConfigPix(true);
  };

  const handleAddPixKeyRow = () => {
    if (editingPixKeys.length >= 3) {
      alert('Você pode cadastrar no máximo 3 chaves PIX.');
      return;
    }
    setEditingPixKeys([...editingPixKeys, { tipo: 'CPF', chave: '' }]);
  };

  const handleRemovePixKeyRow = (index: number) => {
    setEditingPixKeys(editingPixKeys.filter((_, i) => i !== index));
  };

  const handlePixKeyFieldChange = (index: number, field: 'tipo' | 'chave', value: string) => {
    const updated = [...editingPixKeys];
    if (field === 'tipo') updated[index].tipo = value;
    if (field === 'chave') updated[index].chave = value;
    setEditingPixKeys(updated);
  };

  const handleSavePixKeys = () => {
    // Validate keys are filled
    for (const key of editingPixKeys) {
      if (!key.chave.trim()) {
        alert('Por favor, preencha todas as chaves PIX inseridas ou remova os campos vazios.');
        return;
      }
    }
    setShowPixConfirm(true);
  };

  const executeSavePixKeys = async () => {
    setShowPixConfirm(false);
    setPixSaving(true);
    try {
      const { fsSetDocument, fsGetCollection } = await import('../firebase');
      const allUsers = await fsGetCollection('usuarios');
      const me = allUsers[0]; // Assuming first user for demo
      if (me) {
        await fsSetDocument('usuarios', me.id, { 
          pixKeys: editingPixKeys,
          pixHistory: [...(me.pixHistory || []), { date: new Date().toISOString(), type: 'CONFIG', detail: 'Chaves atualizadas' }]
        });
        const updatedUser = (await fsGetCollection('usuarios')).find(u => u.id === me.id);
        setPixKeys(updatedUser.pixKeys);
        setPixHistory(updatedUser.pixHistory);
        setShowConfigPix(false);
      }
    } catch (err: any) {
      alert('Erro ao salvar chaves PIX localmente.');
    } finally {
      setPixSaving(false);
    }
  };

  const handleSelectBolao = async (id: string) => {
    try {
      const { fsGetDocument, fsQueryCollection } = await import('../firebase');
      const bolao = await fsGetDocument('boloes', id);
      if (bolao) {
        setActiveBolao(bolao);
        const matches = await fsQueryCollection('bolao_matches', 'bolaoId', '==', id);
        setBolaoMatches(matches || []);
        const participants = await fsQueryCollection('participantes', 'bolaoId', '==', id);
        setBolaoParticipants(participants || []);
      }
    } catch (err) {
      console.error('Bolao select error:', err);
    }
  };

  const handleSelectRifa = async (rifa: Rifa) => {
    setActiveRifa(rifa);
    try {
      const { fsQueryCollection } = await import('../firebase');
      const pData = await fsQueryCollection('participantes', 'rifaSlug', '==', rifa.slug);
      setRaffleParticipants(pData);
    } catch (err) {
      console.error(err);
    }
  };

  async function parseResponse(res: Response) {
    if (res.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Conta suspensa ou inativa.');
    }
    if (!res.ok) throw new Error('API server boundary returned error');
    const txt = await res.text();
    return txt ? JSON.parse(txt) : [];
  }

  // Requests Withdrawal (unifies both models)
  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const pid = productMode === 'rifas' ? activeRifa?.id : activeBolao?.id;
    if (!pid) return alert('Selecione uma Rifa ou um Bolão ativo para retirar saldo.');
    
    setSaving(true);
    try {
      const { fsSetDocument } = await import('../firebase');
      const withdrawalId = 'w_' + Date.now();
      await fsSetDocument('withdrawals', withdrawalId, {
        id: withdrawalId,
        valorSolicitado: parseFloat(requestValue),
        pixKey: requestPix,
        status: 'pendente',
        productType: productMode,
        productId: pid,
        createdAt: new Date().toISOString()
      });
      alert('Solicitação de saque enviada com sucesso!');
      setRequestValue('');
      setRequestPix('');
      loadAllData();
    } catch (e) {
      alert('Erro ao processar saque localmente.');
    } finally {
      setSaving(false);
    }
  };

  // Update Rifa Settings
  const handleUpdateRifa = async () => {
    if (!activeRifa) return;
    setSaving(true);
    try {
      const { fsSetDocument } = await import('../firebase');
      await fsSetDocument('rifas', activeRifa.id, activeRifa);
      alert('Rifa atualizada com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar rifa localmente.');
    } finally {
      setSaving(false);
    }
  };

  // Update Bolão Settings
  const handleUpdateBolao = async () => {
    if (!activeBolao) return;
    setSaving(true);
    try {
      const { fsSetDocument } = await import('../firebase');
      await fsSetDocument('boloes', activeBolao.id, activeBolao);
      alert('Configurações do Bolão salvas com sucesso!');
      handleSelectBolao(activeBolao.id);
    } catch (err) {
      alert('Erro ao atualizar bolão localmente.');
    } finally {
      setSaving(false);
    }
  };

  // Support Image uploading for either
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, type: 'rifa' | 'bolao') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'rifa' && activeRifa) {
        setActiveRifa({ ...activeRifa, [field]: base64String });
      } else if (type === 'bolao' && activeBolao) {
        setActiveBolao({ ...activeBolao, [field]: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  // --- BOLÃO MATCHES MANAGEMENT ---
  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBolao || !matchForm.teamA || !matchForm.teamB) return;
    setSaving(true);
    try {
      const { fsSetDocument } = await import('../firebase');
      const matchId = 'm_' + Date.now();
      await fsSetDocument('bolao_matches', matchId, {
        id: matchId,
        bolaoId: activeBolao.id,
        ...matchForm,
        status: 'pendente'
      });
      setMatchForm({ teamA: '', teamB: '', date: new Date().toISOString() });
      setShowMatchForm(false);
      handleSelectBolao(activeBolao.id);
    } catch (err) {
      alert('Erro ao adicionar partida localmente.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMatchScore = async (matchId: string, payload: any) => {
    if (!activeBolao) return;
    try {
      const { fsSetDocument } = await import('../firebase');
      await fsSetDocument('bolao_matches', matchId, payload);
      handleSelectBolao(activeBolao.id);
    } catch (err) {
      alert('Erro ao atualizar partida localmente.');
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!activeBolao || !confirm('Tem certeza de que deseja excluir esta partida do bolão?')) return;
    try {
      const { fsDeleteDocument } = await import('../firebase');
      await fsDeleteDocument('bolao_matches', matchId);
      handleSelectBolao(activeBolao.id);
    } catch (err) {
      alert('Erro ao excluir partida localmente.');
    }
  };

  const filteredRaffleParticipants = raffleParticipants.filter(p => 
    (p.nome.toLowerCase().includes(searchRafflePart.toLowerCase()) ||
    p.whatsapp.includes(searchRafflePart)) &&
    p.status === 'pago'
  );

  const filteredBolaoParticipants = bolaoParticipants.filter(p => 
    (p.nome.toLowerCase().includes(searchBolaoPart.toLowerCase()) ||
    p.whatsapp.includes(searchBolaoPart)) &&
    p.status === 'pago'
  );

  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#FF8C00] animate-spin mx-auto" />
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest animate-pulse">Obtendo Configurações do Painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white text-gray-950 rounded-xl shadow-lg border border-gray-100 flex items-center justify-center min-h-[44px] min-w-[44px]"
      >
        <span className="text-xl font-bold leading-none">☰</span>
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-gray-100 p-6 space-y-6 h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shrink-0 flex flex-col justify-between
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {productMode === 'rifas' ? '🎟️' : '⚽'}
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-tight text-gray-950">Espaço Organizador</span>
                <span className="text-[9px] font-black text-[#FF8C00] uppercase tracking-widest">Painel de Produtos</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ACTIVE PRODUCT MODE CONTROLLER */}
          <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setProductMode('rifas');
                setActiveRifaTab('dashboard');
                // Don't auto-close if user might want to click tabs
              }}
              className={`py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${productMode === 'rifas' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              🎟️ Rifas
            </button>
            <button
              onClick={() => {
                setProductMode('boloes');
                setActiveBolaoTab('dashboard');
                // Don't auto-close
              }}
              className={`py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${productMode === 'boloes' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ⚽ Bolões
            </button>
          </div>

          {/* SUB-MENU TABS IF RIFAS */}
          {productMode === 'rifas' ? (
            <nav className="space-y-1 pt-2">
              {[
                { id: 'dashboard', label: 'Início', icon: LayoutGrid },
                { id: 'rifa', label: 'Minha Rifa', icon: Award },
                { id: 'participantes', label: 'Participantes', icon: Users },
                { id: 'financeiro', label: 'Financeiro / Saques', icon: CreditCard },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveRifaTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeRifaTab === item.id ? 'bg-orange-50 text-[#FF8C00]' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          ) : (
            // SUB-MENU TABS IF BOLÕES
            <nav className="space-y-1 pt-2">
              {[
                { id: 'dashboard', label: 'Início Bolões', icon: LayoutGrid },
                { id: 'config', label: 'Configurações', icon: Sliders },
                { id: 'matches', label: 'Gerenciar Jogos', icon: Trophy },
                { id: 'participants', label: 'Membros & Palpites', icon: Users },
                { id: 'financeiro', label: 'Financeiro / Saques', icon: CreditCard },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveBolaoTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeBolaoTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* BOTTOM SIDEBAR FOOTER */}
        <div className="space-y-2">
          {suporteWhatsapp && suporteWhatsapp.trim() !== '' ? (
            <button 
              onClick={() => {
                const cleanPhone = suporteWhatsapp.replace(/\D/g, '');
                window.open(`https://wa.me/${cleanPhone}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer border border-emerald-100"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Suporte WhatsApp
            </button>
          ) : (
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
              title="Suporte indisponível (não configurado pelo administrador)"
            >
              <MessageSquare className="w-4 h-4 shrink-0 px-0 pb-0.5" />
              Suporte Indisponível
            </button>
          )}
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1 p-4 sm:p-10 overflow-y-auto h-screen space-y-8 max-w-full">
        
        {/* HEADER BLOCK */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mt-12 lg:mt-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#FF8C00] bg-orange-50 px-3 py-1 rounded-full">{productMode === 'rifas' ? 'Módulo Rifas' : 'Módulo Bolões'}</span>
              <span className="text-gray-300">|</span>
              <span className="text-[10px] font-bold text-gray-400">Ambiente do Vendedor</span>
            </div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight capitalize">
              {productMode === 'rifas' ? activeRifaTab : activeBolaoTab}
            </h1>
          </div>

          <div className="flex gap-2.5 items-center">
            {productMode === 'rifas' ? (
              <button 
                onClick={() => setShowCreateRaffle(true)}
                className="bg-[#FF8C00] text-white text-xs font-extrabold uppercase px-5 py-3 rounded-xl hover:bg-[#E67E22] tracking-wider shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Nova Rifa
              </button>
            ) : (
              <button 
                onClick={() => {
                  // Redirect to landing page section for bolao or show a specific modal if it existed
                  // For now, let's assume we want a "Novo Bolão" modal or redirect
                  window.location.href = '/#create-section'; 
                }}
                className="bg-emerald-600 text-white text-xs font-extrabold uppercase px-5 py-3 rounded-xl hover:bg-emerald-700 tracking-wider shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Novo Bolão
              </button>
            )}
            <button 
              onClick={loadAllData}
              className="bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              title="Recarregar dados"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* -------------------- PRODUCT: RIFAS -------------------- */}
        {productMode === 'rifas' && (
          <>
            {/* RIFA TAB: INDEX */}
            {activeRifaTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Selector */}
                {rifas.length > 1 && (
                  <div className="flex gap-2">
                    {rifas.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRifa(r)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${activeRifa?.id === r.id ? 'border-[#FF8C00] bg-orange-50/10 text-[#FF8C00]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {r.nome}
                      </button>
                    ))}
                  </div>
                )}

                {rifas.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 space-y-4">
                      {/* COMPACT campaign table wrapper */}
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Mobile View: Cards */}
                        <div className="lg:hidden divide-y divide-gray-50">
                          {rifas.map(r => {
                            const vendidas = r.cotasVendivas || r.cotasVendidas || 0;
                            const disponiveis = Math.max(0, r.quantidadeCotas - vendidas);
                            const isSelected = activeRifa?.id === r.id;
                            return (
                              <div 
                                key={r.id} 
                                onClick={() => handleSelectRifa(r).then(() => setActiveRifaTab('rifa'))}
                                className="p-5 space-y-4 hover:bg-orange-50/10 cursor-pointer transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${isSelected ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-50 text-[#FF8C00]'}`}>
                                      🎫
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-extrabold text-gray-900 leading-tight truncate max-w-[160px]">{r.nome}</div>
                                      <div className="text-[10px] text-gray-400 font-mono">/{r.slug}</div>
                                    </div>
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    r.status === 'ativa' ? 'bg-emerald-50 text-emerald-600' :
                                    r.status === 'encerrada' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                  }`}>
                                    {r.status === 'ativa' ? 'Ativa' : r.status === 'encerrada' ? 'Encerrada' : r.status}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const url = `${window.location.origin}/raffle/${r.slug}`;
                                      navigator.clipboard.writeText(url);
                                      alert('Link da Rifa copiado!');
                                    }}
                                    className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase"
                                    title="Copiar Link"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    Link
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShare(r.nome, 'Confira esta rifa!', `${window.location.origin}/raffle/${r.slug}`);
                                    }}
                                    className="p-2.5 bg-gray-50 text-[#FF8C00] rounded-xl hover:bg-orange-50 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase"
                                    title="Compartilhar"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                    Share
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`/raffle/${r.slug}`, '_blank')
                                    }}
                                    className="p-2.5 bg-gray-50 text-blue-500 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase"
                                    title="Página Pública"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Abrir
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden lg:block overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                <th className="py-4 px-6">Nome / Campanha</th>
                                <th className="py-4 px-4 text-center">Data Limite</th>
                                <th className="py-4 px-4 text-center">Cotas Totais</th>
                                <th className="py-4 px-4 text-center">Vendidas</th>
                                <th className="py-4 px-4 text-center">Disponíveis</th>
                                <th className="py-4 px-4 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Ação</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs">
                              {rifas.map(r => {
                                const vendidas = r.cotasVendivas || r.cotasVendidas || 0;
                                const disponiveis = Math.max(0, r.quantidadeCotas - vendidas);
                                const isSelected = activeRifa?.id === r.id;
                                return (
                                  <tr 
                                    key={r.id}
                                    onClick={() => handleSelectRifa(r).then(() => setActiveRifaTab('rifa'))}
                                    className={`group hover:bg-orange-50/20 transition-colors cursor-pointer ${isSelected ? 'bg-orange-50/10' : ''}`}
                                  >
                                    <td className="py-4 px-6 font-medium">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                          isSelected ? 'bg-orange-500 text-white' : 'bg-orange-50 text-[#FF8C00] group-hover:bg-[#FF8C00] group-hover:text-white transition-colors'
                                        }`}>
                                          🎫
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-gray-900 group-hover:text-[#FF8C00] transition-colors truncate max-w-[200px]">{r.nome}</div>
                                          <div className="text-[10px] text-gray-400 font-mono">/{r.slug}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-gray-500 font-mono">
                                      {r.dataLimite ? new Date(r.dataLimite).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="py-4 px-4 text-center font-black text-gray-700 font-mono">
                                      {r.quantidadeCotas}
                                    </td>
                                    <td className="py-4 px-4 text-center font-black text-gray-700 font-mono">
                                      {vendidas}
                                    </td>
                                    <td className="py-4 px-4 text-center font-black text-orange-600 font-mono">
                                      {disponiveis}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        r.status === 'ativa' ? 'bg-emerald-50 text-emerald-600' :
                                        r.status === 'encerrada' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                      }`}>
                                        {r.status === 'ativa' ? 'Ativa' : r.status === 'encerrada' ? 'Encerrada' : r.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const url = `${window.location.origin}/raffle/${r.slug}`;
                                            navigator.clipboard.writeText(url);
                                            alert('Link copiado!');
                                          }}
                                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                                          title="Copiar Link"
                                        >
                                          <Plus className="w-4 h-4 rotate-45" />
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`/raffle/${r.slug}`, '_blank');
                                          }}
                                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                                          title="Página Pública"
                                        >
                                          <Play className="w-4 h-4" />
                                        </button>
                                        <button 
                                          className="inline-flex items-center justify-center p-2 rounded-xl bg-orange-50 text-[#FF8C00] transition-all cursor-pointer shadow-sm hover:shadow"
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
 
                    {/* Sales Summary widget */}
                    <div className="bg-gradient-to-br from-[#FF8C00] to-orange-600 text-white p-6 rounded-3xl space-y-4 shadow-lg relative overflow-hidden h-fit">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl font-mono" />
                      <h3 className="text-sm font-black uppercase tracking-wider">Resumo Consolidado</h3>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs opacity-80">Rifas Criadas</span>
                          <span className="font-mono font-bold">{rifas.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs opacity-80">Cotas Vendidas</span>
                          <span className="font-mono font-bold">{finance?.totalArrecadadoRifas ? Math.round(finance.totalArrecadadoRifas / (activeRifa?.valorCota || 10)) : 0}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-xs font-black uppercase">Volume Bruto</span>
                          <span className="font-mono font-black text-white text-base">R$ {parseFloat(finance?.totalArrecadadoRifas || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-105 shadow-sm space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-orange-50 text-[#FF8C00] rounded-full flex items-center justify-center mx-auto text-3xl">🎫</div>
                    <h2 className="text-base font-black text-gray-900">Você não possui nenhuma rifa ativa.</h2>
                    <p className="text-xs text-gray-400">Comece agora criando sua primeira rifa profissional em poucos passos.</p>
                    <button
                      onClick={() => setShowCreateRaffle(true)}
                      className="bg-[#FF8C00] hover:bg-[#E67E22] text-white text-xs font-black uppercase px-6 py-3.5 rounded-2xl transition-colors cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      Visualizar Nova Rifa
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* RIFA TAB: CONFIG SETTINGS */}
            {activeRifaTab === 'rifa' && activeRifa && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-gray-950">Editar Configurações de Aparência</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Banner Principal</label>
                      <div className="h-32 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                        {activeRifa.fotoPrincipal ? (
                          <img src={Array.isArray(activeRifa.fotoPrincipal) ? activeRifa.fotoPrincipal[0] : activeRifa.fotoPrincipal} className="w-full h-full object-cover" />
                        ) : (
                          <input type="file" onChange={e => handleFileUpload(e, 'fotoPrincipal', 'rifa')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        )}
                        <span className="absolute bottom-2 bg-black/60 text-[9px] font-bold text-white px-2 py-0.5 rounded">Enviar foto</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Banner de Capa (Opcional)</label>
                      <div className="h-32 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                        {activeRifa.bannerUrl ? (
                          <img src={activeRifa.bannerUrl} className="w-full h-full object-cover" />
                        ) : (
                          <input type="file" onChange={e => handleFileUpload(e, 'bannerUrl', 'rifa')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        )}
                        <span className="absolute bottom-2 bg-black/60 text-[9px] font-bold text-white px-2 py-0.5 rounded">Enviar capa</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-black uppercase text-gray-400">Resumo da Descrição *</label>
                        <span className="text-[10px] font-bold text-gray-400 font-mono">{(activeRifa.descricao || '').length}/1200</span>
                      </div>
                      <textarea
                        required
                        maxLength={1200}
                        rows={3}
                        value={activeRifa.descricao || ''}
                        onChange={e => setActiveRifa({...activeRifa, descricao: e.target.value.slice(0, 1200)})}
                        className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:border-[#FF8C00] text-sm text-gray-700 font-semibold"
                        placeholder="Descreva os prêmios, regras e detalhes da sua Rifa..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 font-mono">Cor de destaque</label>
                        <input
                          type="color"
                          value={activeRifa.corSecundaria || '#FF8C00'}
                          onChange={e => setActiveRifa({...activeRifa, corSecundaria: e.target.value})}
                          className="w-full h-11 border border-gray-200 p-1 rounded-xl cursor-pointer bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Tema do Preset</label>
                        <select
                          value={activeRifa.tema || 'default'}
                          onChange={e => setActiveRifa({...activeRifa, tema: e.target.value as any})}
                          className="w-full border border-gray-200 p-3 rounded-xl text-xs bg-white focus:border-[#FF8C00]"
                        >
                          <option value="default">Padrão</option>
                          <option value="baby">Bebê / Infantil</option>
                          <option value="moto">Motos / Esportivo</option>
                          <option value="car">Carros / Automotivo</option>
                          <option value="charity">Beneficente</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    onClick={handleUpdateRifa}
                    className="w-full bg-[#FF8C00] text-white font-extrabold py-3.5 rounded-2xl block text-center uppercase tracking-wider text-xs shadow-md cursor-pointer"
                  >
                    {saving ? 'Gravando dados...' : 'Salvar dados gráficos'}
                  </button>
                </div>

                {/* Locked info panel */}
                <div className="bg-gray-900 text-white p-6 rounded-3xl space-y-4 shadow-sm border border-gray-800">
                  <h3 className="text-sm font-black uppercase tracking-wider text-orange-500">Apenas para Administradores</h3>
                  <p className="text-xs text-gray-400 font-medium">Parâmetros financeiros ou dimensões de números não podem ser manipuladas diretamente pelo organizador por motivos de segurança.</p>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-gray-400">Nome Oficial</span>
                      <span className="font-extrabold">{activeRifa.nome}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-gray-400">Total Reservado</span>
                      <span className="font-extrabold">{activeRifa.quantidadeCotas} números</span>
                    </div>
                    <div className="flex justify-between pb-2 text-xs">
                      <span className="text-gray-400">Taxa do Organizador</span>
                      <span className="font-extrabold">{finance?.taxaAplicada || 10}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRifaTab !== 'dashboard' && !activeRifa && (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">🎫</div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-gray-900">Nenhuma rifa selecionada.</h2>
                  <p className="text-sm text-gray-400 font-medium font-sans">Selecione uma rifa na aba Início para visualizar seus detalhes.</p>
                </div>
                <button
                  onClick={() => setActiveRifaTab('dashboard')}
                  className="bg-[#FF8C00] hover:bg-[#E67E22] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Voltar para Início
                </button>
              </div>
            )}

            {/* RIFA TAB: PARTICIPANTES */}
            {activeRifaTab === 'participantes' && activeRifa && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-950">Membros Compradores</h3>
                    <p className="text-xs text-gray-400 font-medium">Pessoas físicas que adquiriram pacotes numéricos.</p>
                  </div>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchRafflePart}
                      onChange={e => setSearchRafflePart(e.target.value)}
                      placeholder="Pesquisar por nome ou fone..."
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#FF8C00] outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Mobile View: Cards */}
                <div className="lg:hidden divide-y divide-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  {filteredRaffleParticipants.length === 0 ? (
                    <div className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhum participante confirmado encontrado.</div>
                  ) : (
                    filteredRaffleParticipants.map((p, idx) => (
                      <div key={idx} className="p-5 space-y-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="font-extrabold text-gray-950 block text-sm">{p.nome}</span>
                            <div className="flex flex-col space-y-0.5">
                              <span className="text-[10px] text-gray-400 font-bold font-mono">Doc: {p.documento || '-'}</span>
                              <span className="text-[10px] text-gray-400 font-bold font-mono">Zap: {p.whatsapp}</span>
                              <span className="text-[10px] text-gray-400 font-bold font-mono">Email: {p.email || '-'}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-green-50 text-green-600">
                              {p.status}
                            </span>
                            <span className="text-[8px] text-gray-400 font-bold font-mono">{new Date(p.createdAt || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Cotas:</span>
                            <p className="text-[10px] font-black text-gray-700 truncate">[{p.numeros?.join(', ')}]</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Total:</span>
                            <p className="text-xs font-black text-emerald-600">R$ {parseFloat(p.valorTotal?.toString() || '0').toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] font-black uppercase text-gray-400">
                        <th className="py-3 px-4">Nome Completo</th>
                        <th className="py-3 px-4">CPF/CNPJ</th>
                        <th className="py-3 px-4">WhatsApp</th>
                        <th className="py-3 px-4">E-mail</th>
                        <th className="py-3 px-4 text-center">Data</th>
                        <th className="py-3 px-4 text-right">Valor</th>
                        <th className="py-3 px-4">Números</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRaffleParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-xs font-bold text-gray-400">Nenhum comprador atende aos seus critérios de busca.</td>
                        </tr>
                      ) : (
                        filteredRaffleParticipants.map(rt => (
                          <tr key={rt.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-xs text-gray-700">
                            <td className="py-4 px-4 font-black text-gray-950">{rt.nome}</td>
                            <td className="py-4 px-4 font-mono">{rt.documento || '-'}</td>
                            <td className="py-4 px-4 font-mono">{rt.whatsapp}</td>
                            <td className="py-4 px-4 text-[10px] truncate max-w-[120px]">{rt.email || '-'}</td>
                            <td className="py-4 px-4 text-center font-mono opacity-60 text-[10px]">{new Date(rt.createdAt || '').toLocaleDateString()}</td>
                            <td className="py-4 px-4 text-right font-black text-emerald-600">R$ {parseFloat(rt.valorTotal?.toString() || '0').toFixed(2)}</td>
                            <td className="py-4 px-4 font-bold text-[#FF8C00] max-w-[150px] truncate">[{rt.numeros?.join(', ')}]</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-green-50 text-green-600">
                                {rt.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* -------------------- PRODUCT: BOLÕES -------------------- */}
        {productMode === 'boloes' && (
          <>
            {/* BOLÃO TAB: INDEX */}
            {activeBolaoTab === 'dashboard' && (
              <div className="space-y-6">
                
                {boloes.length > 1 && (
                  <div className="flex gap-2">
                    {boloes.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBolao(b.id)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${activeBolao?.id === b.id ? 'border-emerald-600 bg-emerald-50/10 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {b.nome}
                      </button>
                    ))}
                  </div>
                )}

                {boloes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-black text-gray-900 uppercase">Seus Bolões</h3>
                        <button
                          onClick={() => setShowCreateBolao(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Novo Bolão
                        </button>
                      </div>
                      {boloes.map(b => (
                        <div key={b.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                              ⚽
                            </div>
                            <div>
                              <h3 className="text-base font-black text-gray-900">{b.nome}</h3>
                              <p className="text-xs text-emerald-700 font-mono">/bolao/{b.slug}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right mr-2 hidden sm:block">
                              <span className="text-[10px] text-gray-400 block font-bold uppercase">Membros</span>
                              <span className="text-xs font-black text-slate-800">{b.participantesConfirmados} / {b.maxParticipants}</span>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const url = `${window.location.origin}/bolao/${b.slug}`;
                                  navigator.clipboard.writeText(url);
                                  alert('Link do Bolão copiado!');
                                }}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                                title="Copiar Link"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(b.nome, 'Participe deste bolão!', `${window.location.origin}/bolao/${b.slug}`);
                                }}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-emerald-600 transition-all"
                                title="Compartilhar"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/bolao/${b.slug}`, '_blank');
                                }}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                                title="Página Pública"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleSelectBolao(b.id).then(() => setActiveBolaoTab('config'))}
                                className="bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-700 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer"
                              >
                                Configurar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl space-y-4 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <h3 className="text-sm font-black uppercase tracking-wider">Consolidado Bolões</h3>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs opacity-80">Bolões Criados</span>
                          <span className="font-mono font-bold">{boloes.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs opacity-80 font-black">Ligas Ativas</span>
                          <span className="font-mono font-bold">{boloes.filter(b => b.status === 'ativo').length}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-xs font-black uppercase">Volume Bruto</span>
                          <span className="font-mono font-black text-white text-base">R$ {parseFloat(finance?.totalArrecadadoBoloes || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-105 shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-3xl">⚽</div>
                    <h2 className="text-base font-black text-gray-400">Você não possui nenhum bolão cadastrado.</h2>
                    <p className="text-xs text-gray-400">Crie seu primeiro bolão esportivo profissional agora.</p>
                    <button
                      onClick={() => setShowCreateBolao(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3.5 rounded-2xl transition-colors cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 uppercase"
                    >
                      <Plus className="w-4 h-4" />
                      Criar Novo Bolão
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* BOLÃO TAB: CONFIG SETTINGS */}
            {activeBolaoTab === 'config' && activeBolao && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-gray-950">Editar Atributos de Liga</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400">Logo do Bolão</label>
                      <div className="h-32 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                        {activeBolao.logoUrl ? (
                          <img src={activeBolao.logoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <input type="file" onChange={e => handleFileUpload(e, 'logoUrl', 'bolao')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        )}
                        <span className="absolute bottom-2 bg-black/60 text-[9px] font-bold text-white px-2 py-0.5 rounded">Enviar logo</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400">Banner de Capa</label>
                      <div className="h-32 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                        {activeBolao.bannerUrl ? (
                          <img src={activeBolao.bannerUrl} className="w-full h-full object-cover" />
                        ) : (
                          <input type="file" onChange={e => handleFileUpload(e, 'bannerUrl', 'bolao')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        )}
                        <span className="absolute bottom-2 bg-black/60 text-[9px] font-bold text-white px-2 py-0.5 rounded">Enviar capa</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Nome do Campeonato</label>
                      <input 
                        type="text"
                        value={activeBolao.championshipName || ''}
                        onChange={e => setActiveBolao({...activeBolao, championshipName: e.target.value})}
                        className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Esporte / Competição</label>
                      <input 
                        type="text"
                        value={activeBolao.competitionName || ''}
                        onChange={e => setActiveBolao({...activeBolao, competitionName: e.target.value})}
                        className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Regulamento dos Resultados</label>
                    <textarea
                      rows={3}
                      value={activeBolao.rules || ''}
                      onChange={e => setActiveBolao({...activeBolao, rules: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-xl outline-none text-xs text-gray-700"
                    />
                  </div>

                  <div className="border border-yellow-100 bg-yellow-50/20 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-yellow-700 uppercase">Configuração de Premiação</p>
                      <select 
                        value={activeBolao.prizes?.type || 'multiple'}
                        onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, type: e.target.value as any }})}
                        className="text-[9px] font-black uppercase bg-white border border-yellow-200 px-2 py-1 rounded-md outline-none"
                      >
                        <option value="single">Ganhador Único</option>
                        <option value="multiple">Ranking (Até Top 5)</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">1º Lugar</label>
                        <input 
                          type="text"
                          placeholder="Ex: 70%"
                          value={activeBolao.prizes?.firstPlace || ''}
                          onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, firstPlace: e.target.value }})}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">2º Lugar</label>
                        <input 
                          type="text"
                          placeholder="Ex: 20%"
                          value={activeBolao.prizes?.secondPlace || ''}
                          onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, secondPlace: e.target.value }})}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">3º Lugar</label>
                        <input 
                          type="text"
                          placeholder="Ex: 10%"
                          value={activeBolao.prizes?.thirdPlace || ''}
                          onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, thirdPlace: e.target.value }})}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">4º Lugar</label>
                        <input 
                          type="text"
                          value={activeBolao.prizes?.fourthPlace || ''}
                          onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, fourthPlace: e.target.value }})}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">5º Lugar</label>
                        <input 
                          type="text"
                          value={activeBolao.prizes?.fifthPlace || ''}
                          onChange={e => setActiveBolao({...activeBolao, prizes: { ...activeBolao.prizes, fifthPlace: e.target.value }})}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    onClick={handleUpdateBolao}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl block text-center uppercase tracking-wider text-xs shadow-md cursor-pointer"
                  >
                    {saving ? 'Gravando dados...' : 'Salvar dados do Bolão'}
                  </button>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded-3xl space-y-4 shadow-sm border border-gray-800">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-500">Visualização de Liga</h3>
                  <div className="bg-white/5 p-4 rounded-xl space-y-1">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Link para divulgar</span>
                    <a 
                      href={`${window.location.origin}/bolao/${activeBolao.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-emerald-400 font-bold hover:underline"
                    >
                      {window.location.origin}/bolao/{activeBolao.slug}
                    </a>
                  </div>

                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-gray-400">Inscritos Máximos</span>
                      <span className="font-extrabold">{activeBolao.maxParticipants} membros</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-gray-400">Valor de Entrada</span>
                      <span className="font-extrabold">R$ {parseFloat(activeBolao.pricePerParticipant).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pb-2 text-xs">
                      <span className="text-gray-400">Inscritos Atuais</span>
                      <span className="font-extrabold text-emerald-400">{activeBolao.participantesConfirmados} membros</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOLÃO TAB: MATCH CONTROL */}
            {activeBolaoTab === 'matches' && activeBolao && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-gray-950">Mesa de Partidas</h3>
                    <p className="text-xs text-gray-400 font-medium font-mono">Tabela de eventos para palpites</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMatchForm({ teamA: '', teamB: '', date: new Date().toISOString() });
                      setShowMatchForm(!showMatchForm);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Jogo
                  </button>
                </div>

                {/* Create Match Form */}
                {showMatchForm && (
                  <form onSubmit={handleAddMatch} className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Time / Mandante</label>
                      <input 
                        required
                        type="text"
                        value={matchForm.teamA}
                        onChange={e => setMatchForm({...matchForm, teamA: e.target.value})}
                        placeholder="Time A"
                        className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Time / Visitante</label>
                      <input 
                        required
                        type="text"
                        value={matchForm.teamB}
                        onChange={e => setMatchForm({...matchForm, teamB: e.target.value})}
                        placeholder="Time B"
                        className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1 flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Horário</label>
                        <input 
                          required
                          type="datetime-local"
                          value={matchForm.date}
                          onChange={e => setMatchForm({...matchForm, date: e.target.value})}
                          className="w-full border border-gray-200 p-2 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl cursor-pointer shrink-0"
                      >
                        Gravar
                      </button>
                    </div>
                  </form>
                )}

                {/* Match Lists */}
                <div className="space-y-4">
                  {bolaoMatches.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400 text-xs font-extrabold uppercase">
                      Nenhuma partida registrada neste bolão. Adicione partidas para liberar os palpites públicos!
                    </div>
                  ) : (
                    bolaoMatches.map(match => (
                      <div key={match.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${match.finished ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500 border border-orange-100'}`}>
                            {match.finished ? 'Concluído' : 'Aberto'}
                          </span>
                          <p className="text-[10px] text-gray-400 font-mono font-bold">
                            {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Scores Entry */}
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-gray-900 w-24 text-right truncate">{match.teamA}</span>
                          
                          <input 
                            type="text"
                            placeholder="-"
                            defaultValue={match.scoreA !== null ? match.scoreA.toString() : ''}
                            onBlur={e => handleUpdateMatchScore(match.id, { scoreA: e.target.value })}
                            className="w-10 h-10 border border-gray-200 rounded-xl text-center font-black text-sm bg-gray-50 outline-none focus:border-emerald-600 focus:bg-white"
                          />
                          <span className="text-gray-300 font-bold uppercase">x</span>
                          <input 
                            type="text"
                            placeholder="-"
                            defaultValue={match.scoreB !== null ? match.scoreB.toString() : ''}
                            onBlur={e => handleUpdateMatchScore(match.id, { scoreB: e.target.value })}
                            className="w-10 h-10 border border-gray-200 rounded-xl text-center font-black text-sm bg-gray-50 outline-none focus:border-emerald-600 focus:bg-white"
                          />

                          <span className="text-xs font-black text-gray-900 w-24 text-left truncate">{match.teamB}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-xs font-bold text-gray-600 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={match.finished}
                              onChange={e => handleUpdateMatchScore(match.id, { finished: e.target.checked })}
                              className="rounded accent-emerald-600 cursor-pointer"
                            />
                            <span>Encerrar</span>
                          </label>

                          <button
                            onClick={() => handleDeleteMatch(match.id)}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* BOLÃO TAB: PARTICIPANTES & PALPITES */}
            {activeBolaoTab === 'participants' && activeBolao && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-950">Membros da Liga</h3>
                    <p className="text-xs text-gray-400 font-medium">Tabela de apostadores com status de aprovação.</p>
                  </div>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchBolaoPart}
                      onChange={e => setSearchBolaoPart(e.target.value)}
                      placeholder="Pesquisar por nome ou fone..."
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-emerald-700 outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {filteredBolaoParticipants.length === 0 ? (
                    <div className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Nenhum apostador confirmado localizado.</div>
                  ) : (
                    filteredBolaoParticipants.map(bt => (
                      <div key={bt.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-sm font-black text-gray-950">{bt.nome}</span>
                            <div className="flex flex-col space-y-0.5">
                              <span className="text-[10px] text-gray-400 font-bold font-mono italic">Doc: {bt.documento || '-'}</span>
                              <span className="text-[10px] text-gray-400 font-bold font-mono">Zap: {bt.whatsapp}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600">
                            {bt.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                           <div className="space-y-0.5">
                             <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block">Data Inscrição</span>
                             <span className="text-[10px] font-bold text-gray-700">{new Date(bt.createdAt || '').toLocaleDateString()}</span>
                           </div>
                           <div className="text-right space-y-0.5">
                             <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block">Ranking</span>
                             <span className="text-[11px] font-black text-emerald-600">{bt.points || 0} pts</span>
                           </div>
                        </div>

                        {bt.guesses && bt.guesses.length > 0 && (
                          <div className="pt-3 border-t border-gray-50">
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-1">Últimos Palpites</span>
                            <div className="flex flex-wrap gap-2">
                              {bt.guesses.slice(0, 3).map((g: any, i: number) => (
                                <div key={i} className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold border border-gray-100">
                                   {g.guessA} x {g.guessB}
                                </div>
                              ))}
                              {bt.guesses.length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{bt.guesses.length - 3}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] font-black uppercase text-gray-400">
                        <th className="py-3 px-4">Participante</th>
                        <th className="py-3 px-4">Documento</th>
                        <th className="py-3 px-4">WhatsApp / E-mail</th>
                        <th className="py-3 px-4 text-center">Data Inscrição</th>
                        <th className="py-3 px-4 text-center">Pontuação</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBolaoParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhum apostador confirmado no momento.</td>
                        </tr>
                      ) : (
                        filteredBolaoParticipants.map(bt => (
                          <tr key={bt.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-xs text-gray-700">
                            <td className="py-4 px-4 font-black text-gray-950">{bt.nome}</td>
                            <td className="py-4 px-4 font-mono">{bt.documento || '-'}</td>
                            <td className="py-4 px-4 font-mono">
                               <div className="font-bold">{bt.whatsapp}</div>
                               <div className="text-[10px] opacity-50 truncate max-w-[150px]">{bt.email || '-'}</div>
                            </td>
                            <td className="py-4 px-4 text-center font-mono opacity-60 text-[11px]">{new Date(bt.createdAt || '').toLocaleDateString()}</td>
                            <td className="py-4 px-4 text-center font-black text-[#FF8C00]">{bt.points || 0} pts</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600">
                                {bt.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* -------------------- FINANCE / WITHDRAWAL SHARABLES -------------------- */}
        {((productMode === 'rifas' && activeRifaTab === 'financeiro') || 
          (productMode === 'boloes' && activeBolaoTab === 'financeiro')) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">Total Arrecadado ({productMode === 'rifas' ? 'Rifas' : 'Bolões'})</span>
                  <p className="text-2xl font-black text-gray-950">
                    R$ {parseFloat(productMode === 'rifas' ? (finance?.totalArrecadadoRifas || 0) : (finance?.totalArrecadadoBoloes || 0)).toFixed(2)}
                  </p>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Volume de Caixa bruto</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 border-l-4 border-l-emerald-500">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">Disponível para Saque</span>
                  <p className="text-2xl font-black text-emerald-600">
                    R$ {parseFloat(productMode === 'rifas' ? (finance?.saldoDisponivelRifas || 0) : (finance?.saldoDisponivelBoloes || 0)).toFixed(2)}
                  </p>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase">Líquido pronto para PIX</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 flex items-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-500 fill-none stroke-current stroke-2 mr-1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 12l10 10 10-10L12 2z" />
                        <path d="M12 7l-5 5 5 5 5-5-5-5z" />
                      </svg>
                      Configurações PIX
                    </span>
                    <p className="text-[11px] font-bold text-gray-400 leading-tight">
                      {pixKeys.length === 0 ? 'Nenhuma chave cadastrada.' : `${pixKeys.length} chave(s) ativa(s).`}
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={openPixConfig}
                    className="w-full bg-[#FF8C00] hover:bg-[#E67E22] text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    Configurar PIX
                  </button>
                </div>

              </div>

              {/* Shared stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black uppercase text-gray-400 block">Dedução Taxa</span>
                  <span className="text-sm font-black text-red-500">R$ {parseFloat(finance?.valorDescontado || 0).toFixed(2)}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black uppercase text-gray-400 block">Taxa Plataforma</span>
                  <span className="text-sm font-black text-gray-800">{finance?.taxaAplicada || 10}%</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black uppercase text-gray-400 block">Total Sacado</span>
                  <span className="text-sm font-black text-gray-800">R$ {parseFloat(finance?.totalSacado || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Saques history */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-950">Histórico de Resgates</h3>
                
                {withdrawals.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Nenhuma transação financeira registrada.</div>
                ) : (
                  <>
                    {/* Mobile View: Cards */}
                    <div className="lg:hidden divide-y divide-gray-50 border-t border-gray-50">
                      {withdrawals.map(w => (
                        <div key={w.id} className="py-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[9px] text-gray-400 font-black uppercase block tracking-wider">{new Date(w.createdAt).toLocaleDateString()}</span>
                              <span className="font-extrabold text-gray-950 block text-sm">R$ {w.valorSolicitado.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${w.status === 'pago' ? 'bg-green-50 text-green-600' : (w.status === 'recusado' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-500')}`}>
                                 {w.status === 'recusado' ? 'rejeitado' : w.status}
                               </span>
                               {w.status === 'recusado' && w.motivoRejeicao && (
                                  <span className="text-[8px] text-red-600 font-bold max-w-[120px] truncate text-right leading-none">{w.motivoRejeicao}</span>
                               )}
                            </div>
                          </div>
                          <div className="text-[9px] text-slate-400 font-black font-mono">#{w.id}</div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-50 text-[10px] font-black uppercase text-gray-400">
                            <th className="py-2.5 px-4 animate-pulse">Código</th>
                            <th className="py-2.5 px-4">Data</th>
                            <th className="py-2.5 px-4 text-right">Valor</th>
                            <th className="py-2.5 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.map(w => (
                            <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-xs text-gray-700">
                              <td className="py-3 px-4 font-mono text-[10px] font-black text-slate-400">#{w.id}</td>
                              <td className="py-3 px-4 font-medium">{new Date(w.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-right font-black text-slate-800">R$ {w.valorSolicitado.toFixed(2)}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex flex-col items-center gap-1 py-1">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${w.status === 'pago' ? 'bg-green-50 text-green-600' : (w.status === 'recusado' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-500')}`}>
                                    {w.status === 'recusado' ? 'rejeitado' : w.status}
                                  </span>
                                  {w.status === 'recusado' && (
                                    <div className="flex flex-col items-center mt-1 space-y-0.5">
                                      {w.motivoRejeicao && (
                                        <span className="text-[9px] text-red-600 font-bold max-w-[140px] truncate" title={w.motivoRejeicao}>
                                          {w.motivoRejeicao}
                                        </span>
                                      )}
                                      {w.dataRejeicao && (
                                        <span className="text-[8px] text-gray-400">
                                          Rejeitado em {new Date(w.dataRejeicao).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

            </div>

            <div className="space-y-6">
              <form onSubmit={handleWithdrawalRequest} className="bg-gray-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden space-y-4 border border-gray-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 mb-2 relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                    {config?.platformLogo ? (
                      <img src={config.platformLogo} className="w-full h-full object-contain" alt="Logo" />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                         <Award className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white">Solicitar Retirada</h3>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">As transferências pendem de validação e ocorrem via chave PIX.</p>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Valor do Saque (R$)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      min="1"
                      value={requestValue}
                      onChange={e => setRequestValue(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-emerald-500 outline-none font-bold text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Chave PIX de Destino</label>
                    <input 
                      required
                      type="text"
                      value={requestPix}
                      onChange={e => setRequestPix(e.target.value)}
                      placeholder="CPF, E-mail ou Aleatória"
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-emerald-500 outline-none font-bold text-white text-sm"
                    />
                  </div>

                  <button
                    disabled={saving || !requestValue}
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    {saving ? 'Validando transação...' : 'Solicitar PIX'}
                  </button>
                </div>
              </form>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 italic text-[10px] text-gray-400 leading-relaxed">
                As transferências ocorrem em lotes duas vezes por dia. Verifique com precisão todos os dígitos da chave inserida antes de enviar.
              </div>
            </div>
          </div>
        )}

        {/* CREATE RAFFLE MODAL IN CLIENT DASHBOARD */}
        {showCreateRaffle && (
          <CreateRaffleModal 
            onClose={() => {
              setShowCreateRaffle(false);
              loadAllData();
            }} 
          />
        )}

        {/* PIX KEY CONFIGURATION MODAL */}
        {showConfigPix && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 animate-pulse" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 12l10 10 10-10L12 2z" />
                      <path d="M12 7l-5 5 5 5 5-5-5-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-tight">Suas Chaves PIX ({editingPixKeys.length}/3)</h3>
                    <p className="text-[10px] text-gray-400 font-medium">Configure os destinos seguros onde seus saques aprovados serão pagos.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConfigPix(false)}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer transition-colors text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body (Scrollable) */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {editingPixKeys.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-2">
                      <p className="text-xs text-gray-400 font-bold uppercase">Nenhuma chave cadastrada.</p>
                      <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-normal">Cadastre até 3 chaves válidas. Seus saques precisarão obrigatoriamente coincidir com elas.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingPixKeys.map((key, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-2xl animate-in slide-in-from-bottom-2 duration-150"
                        >
                          <div className="w-40">
                            <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Tipo de Chave</label>
                            <select
                              value={key.tipo}
                              onChange={e => handlePixKeyFieldChange(index, 'tipo', e.target.value)}
                              className="w-full bg-white border border-gray-200 text-xs rounded-xl p-2.5 font-bold outline-none focus:border-[#FF8C00] cursor-pointer"
                            >
                              <option value="CPF">CPF</option>
                              <option value="CNPJ">CNPJ</option>
                              <option value="E-mail">E-mail</option>
                              <option value="Telefone">Telefone</option>
                              <option value="Chave Aleatória">Chave Aleatória</option>
                            </select>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Identificador da Chave</label>
                            <input 
                              type="text"
                              required
                              value={key.chave}
                              onChange={e => handlePixKeyFieldChange(index, 'chave', e.target.value)}
                              placeholder={key.tipo === 'CPF' ? '000.000.000-00' : key.tipo === 'CNPJ' ? '00.000.000/0000-00' : key.tipo === 'Telefone' ? '+55 (87) 99999-9999' : 'Chave PIX de destino'}
                              className="w-full bg-white border border-gray-200 text-xs rounded-xl p-2.5 font-bold outline-none focus:border-[#FF8C00] text-gray-800"
                            />
                          </div>

                          <div className="pt-5 shrink-0">
                            <button 
                              type="button"
                              onClick={() => handleRemovePixKeyRow(index)}
                              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer transition-colors"
                              title="Remover chave"
                            >
                              <Trash className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingPixKeys.length < 3 && (
                    <button 
                      type="button"
                      onClick={handleAddPixKeyRow}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-wider py-3.5 px-4 rounded-2xl border-2 border-dashed border-gray-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-gray-400" />
                      Adicionar Chave PIX
                    </button>
                  )}
                </div>

                {/* Audit & Alteration History Log */}
                <div className="border-t border-gray-150 pt-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-gray-900">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <h4 className="text-xs font-black uppercase tracking-wider">Histórico de Alterações (LGPD & Auditoria)</h4>
                  </div>
                  
                  {pixHistory.length === 0 ? (
                    <p className="text-[10px] text-gray-400 font-medium italic">Nenhum registro de alteração de chave PIX cadastrado ainda.</p>
                  ) : (
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-h-40 overflow-y-auto">
                      <table className="w-full text-left border-collapse bg-white">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[8px] font-black uppercase text-gray-400 tracking-wider">
                            <th className="py-2.5 px-3">Data</th>
                            <th className="py-2.5 px-3">IP Address</th>
                            <th className="py-2.5 px-3">Usuário</th>
                            <th className="py-2.5 px-3">Auditoria de Operação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-[10px]">
                          {pixHistory.map((h, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 text-gray-500 font-mono text-[9px]">
                                {new Date(h.date).toLocaleString('pt-BR')}
                              </td>
                              <td className="py-2.5 px-3 text-gray-500 font-mono text-[9px]">{h.ip}</td>
                              <td className="py-2.5 px-3 font-semibold text-gray-700">{h.responsibleUser}</td>
                              <td className="py-2.5 px-3 text-gray-400 font-mono text-[9px] truncate max-w-xs" title={h.details}>
                                {h.details}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowConfigPix(false)}
                  className="px-5 py-3 border border-gray-200 text-gray-600 font-black uppercase tracking-wider text-xs rounded-2xl bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleSavePixKeys}
                  disabled={pixSaving}
                  className="px-6 py-3 bg-[#FF8C00] hover:bg-[#E67E22] text-white font-black uppercase tracking-wider text-xs rounded-2xl cursor-pointer shadow-md"
                >
                  {pixSaving ? 'Salvando...' : 'Salvar Chaves'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PIX SAVE DOUBLE CONFIRMATION DIALOG */}
        {showPixConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-150 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl animate-pulse">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-gray-900 leading-tight">Confirmação de Segurança</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-medium">
                  Confirma que esta chave PIX está correta? Os saques aprovados serão enviados para esta chave.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowPixConfirm(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-extrabold uppercase tracking-wider text-[10px] rounded-2xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={executeSavePixKeys}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-2xl cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
