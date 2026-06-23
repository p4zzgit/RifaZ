import React, { useState, useEffect } from 'react';
import { GlobalConfig, Saque, Rifa, Usuario } from '../types';
import { 
  BarChart3, Settings, Users, CreditCard, LayoutGrid, Award, 
  Settings2, LogOut, CheckCircle2, XCircle, Clock, Search, ExternalLink, RefreshCw, UserPlus,
  Edit3, Trash2, Ban, Check, Trophy, ChevronLeft, ChevronRight, Filter, Phone, Mail,
  Shield, Palette, Activity, X, Menu, Undo2, ShieldAlert, History, Copy, Share2
} from 'lucide-react';
import { CreateRaffleModal } from './landing/CreateRaffleModal';
import { SecurityConfirm } from './common/SecurityConfirm';
function formatDocumento(doc: string | undefined | null): string {
  if (!doc) return '---';
  const clean = doc.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'rifas' | 'boloes' | 'saques' | 'config' | 'users' | 'security' | 'trash'>('stats');
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [saques, setSaques] = useState<Saque[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [boloes, setBoloes] = useState<any[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saqueSubTab, setSaqueSubTab] = useState<'pendente' | 'aprovado' | 'recusado'>('pendente');
  const [rejectionModal, setRejectionModal] = useState<{
    withdrawalId: string;
    motivo: string;
    outroMotivo: string;
    isOpen: boolean;
  } | null>(null);
  
  // Trash bin state
  const [trashActiveTab, setTrashActiveTab] = useState<'users' | 'raffles' | 'boloes'>('users');
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [deletedRifas, setDeletedRifas] = useState<any[]>([]);
  const [deletedBoloes, setDeletedBoloes] = useState<any[]>([]);
  const [trashSearchQuery, setTrashSearchQuery] = useState('');

  // Advanced Delete Flow
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    type: 'USER' | 'RAFFLE' | 'BOLAO' | 'WITHDRAWAL' | 'FINANCE' | 'TICKET';
    id: string;
    itemName: string;
  } | null>(null);

  // Users Filters & Search State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'todos' | 'rifas' | 'boloes'>('todos');
  const [userSortField, setUserSortField] = useState<'nome' | 'usuario' | 'email' | 'saldo' | 'status'>('nome');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
  const [userPage, setUserPage] = useState(1);

  // Rifas Filters & Search State
  const [rifaSearchQuery, setRifaSearchQuery] = useState('');
  const [rifaSelectedUserFilter, setRifaSelectedUserFilter] = useState<string>('todos');
  const [rifaShowUserFilter, setRifaShowUserFilter] = useState(false);
  const [rifaSortField, setRifaSortField] = useState<'nome' | 'cotas' | 'valor' | 'vendidas' | 'arrecadado' | 'status'>('nome');
  const [rifaSortDirection, setRifaSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rifaPage, setRifaPage] = useState(1);

  // Boloes Filters & Search State
  const [bolaoSearchQuery, setBolaoSearchQuery] = useState('');
  const [bolaoSelectedUserFilter, setBolaoSelectedUserFilter] = useState<string>('todos');
  const [bolaoShowUserFilter, setBolaoShowUserFilter] = useState(false);
  const [bolaoSortField, setBolaoSortField] = useState<'nome' | 'participantes' | 'valor' | 'arrecadado' | 'status'>('nome');
  const [bolaoSortDirection, setBolaoSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bolaoPage, setBolaoPage] = useState(1);

  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [profileForm, setProfileForm] = useState({
    nome: '',
    usuario: '',
    password: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [cRes, sRes, rRes, uRes, fRes, bRes, lRes, tuRes, trRes, tbRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/admin/withdrawals', { headers }),
        fetch('/api/admin/raffles', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/finance', { headers }),
        fetch('/api/admin/boloes', { headers }),
        fetch('/api/admin/logs', { headers }),
        fetch('/api/admin/trash/users', { headers }),
        fetch('/api/admin/trash/raffles', { headers }),
        fetch('/api/admin/trash/boloes', { headers })
      ]);

      const parseJson = async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      };

      setConfig(await parseJson(cRes));
      setSaques(await parseJson(sRes));
      setRifas(await parseJson(rRes));
      const userData = await parseJson(uRes);
      setUsers(userData);
      setFinance(await parseJson(fRes));
      setBoloes(await parseJson(bRes));
      setAdminLogs(await parseJson(lRes));
      setDeletedUsers(await parseJson(tuRes));
      setDeletedRifas(await parseJson(trRes));
      setDeletedBoloes(await parseJson(tbRes));

      const me = userData.find((u: any) => u.id === 'super-admin-id');
      if (me) {
        setProfileForm({
          nome: me.nome,
          usuario: me.usuario,
          password: ''
        });
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateUserFee = async (userId: string, fee: number) => {
    await fetch(`/api/admin/users/${userId}/fee`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ fee })
    });
    loadDashboard();
  };

  const handleUpdateConfig = async () => {
    setSaving(true);
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(config)
    });
    setSaving(false);
  };

  const handleUpdateWithdrawal = async (id: string, status: string) => {
    await fetch(`/api/admin/withdrawals/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ status })
    });
    loadDashboard();
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'ativo' | 'suspenso' | 'banido') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadDashboard();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar status');
      }
    } catch (e) {
      alert('Erro de conexão');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    setDeleteConfirmModal({
      type: 'USER',
      id: userId,
      itemName: `${u.nome} (@${u.usuario})`
    });
  };

  const handleUpdateRaffleStatus = async (id: string, status: 'ativa' | 'suspensa') => {
    try {
      const res = await fetch(`/api/admin/raffles/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadDashboard();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      alert('Erro de conexão');
    }
  };

  const handleDeleteRaffle = (id: string) => {
    const r = rifas.find(x => x.id === id);
    if (!r) return;
    setDeleteConfirmModal({
      type: 'RAFFLE',
      id,
      itemName: r.nome
    });
  };

  const handleUpdateBolaoStatus = async (id: string, status: 'ativo' | 'suspenso') => {
    try {
      const res = await fetch(`/api/admin/boloes/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadDashboard();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      alert('Erro de conexão');
    }
  };

  const handleDeleteBolao = (id: string) => {
    const b = boloes.find(x => x.id === id);
    if (!b) return;
    setDeleteConfirmModal({
      type: 'BOLAO',
      id,
      itemName: b.nome
    });
  };

  const handleDeleteWithdrawal = (id: string) => {
    const s = saques.find(x => x.id === id);
    if (!s) return;
    setDeleteConfirmModal({
      type: 'WITHDRAWAL',
      id,
      itemName: `Solicitação #${id} - R$ ${s.valorSolicitado.toFixed(2)}`
    });
  };

  const executeDelete = async (password: string, reason: string) => {
    if (!deleteConfirmModal) return;
    const { type, id } = deleteConfirmModal;
    
    try {
      let url = '';
      if (type === 'USER') url = `/api/admin/users/${id}`;
      else if (type === 'RAFFLE') url = `/api/admin/raffles/${id}`;
      else if (type === 'BOLAO') url = `/api/admin/boloes/${id}`;
      else if (type === 'WITHDRAWAL') url = `/api/admin/withdrawals/${id}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ password, motivo: reason })
      });

      if (res.ok) {
        setDeleteConfirmModal(null);
        loadDashboard();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao deletar registro');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleRestore = async (type: 'usuarios' | 'rifas' | 'boloes', id: string) => {
    if (!confirm('Deseja realmente restaurar este registro?')) return;
    try {
      const res = await fetch(`/api/admin/restore/${type}/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        loadDashboard();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao restaurar registro');
      }
    } catch (e) {
      alert('Erro de conexão');
    }
  };

  const handleConfirmRejectionBase = async () => {
    if (!rejectionModal) return;
    const finalReason = rejectionModal.motivo === 'Outro' ? rejectionModal.outroMotivo : rejectionModal.motivo;
    if (!finalReason || !finalReason.trim()) {
      alert('Por favor, informe a justificativa da rejeição.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/withdrawals/${rejectionModal.withdrawalId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: 'recusado', motivoRejeicao: finalReason })
      });
      if (res.ok) {
        setRejectionModal(null);
        loadDashboard();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao rejeitar saque.');
      }
    } catch (e) {
      alert('Erro de conexão ao rejeitar saque.');
    }
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          nome: editingUser.nome,
          usuario: editingUser.usuario,
          email: editingUser.email,
          documento: editingUser.documento,
          whatsapp: editingUser.whatsapp,
          customFee: editingUser.customFee,
          status: editingUser.status,
          password: editingUser.password || undefined
        })
      });
      if (res.ok) {
        alert('Usuário atualizado com sucesso!');
        setShowEditUserModal(false);
        setEditingUser(null);
        loadDashboard();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar dados do usuário');
      }
    } catch (e) {
      alert('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        alert('Perfil atualizado com sucesso!');
        loadDashboard();
      }
    } catch (e) {
      alert('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof GlobalConfig) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande (máx 5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      
      if (!res.ok) throw new Error('Falha no upload');
      
      const data = await res.json();
      if (config) setConfig({ ...config, [field]: data.url });
      alert('Arquivo enviado! Lembre-se de salvar as alterações da plataforma no botão abaixo.');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar arquivo. Verifique sua conexão.');
    }
  };

  // Base client users
  const clientUsers = users.filter(u => u.role !== 'super_admin' && u.usuario !== 'admin');

  // Filter users by rapid filters
  let filteredUsers = clientUsers;
  if (userFilter === 'rifas') {
    filteredUsers = filteredUsers.filter(u => rifas.some(r => r.ownerId === u.id));
  } else if (userFilter === 'boloes') {
    filteredUsers = filteredUsers.filter(u => boloes.some(b => b.ownerId === u.id));
  }

  // Filter users by search query
  if (userSearchQuery.trim()) {
    const q = userSearchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/\D/g, '');
    filteredUsers = filteredUsers.filter(u => {
      const nome = (u.nome || '').toLowerCase();
      const usuario = (u.usuario || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const documentoRaw = (u.documento || '').toLowerCase();
      const documentoClean = (u.documento || '').replace(/\D/g, '');
      const whatsappRaw = (u.whatsapp || '').toLowerCase();
      const whatsappClean = (u.whatsapp || '').replace(/\D/g, '');

      return nome.includes(q) ||
             usuario.includes(q) ||
             email.includes(q) ||
             documentoRaw.includes(q) ||
             whatsappRaw.includes(q) ||
             (cleanQ && documentoClean.includes(cleanQ)) ||
             (cleanQ && whatsappClean.includes(cleanQ));
    });
  }

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA: any = '';
    let valB: any = '';
    if (userSortField === 'nome') {
      valA = a.nome || '';
      valB = b.nome || '';
    } else if (userSortField === 'usuario') {
      valA = a.usuario || '';
      valB = b.usuario || '';
    } else if (userSortField === 'email') {
      valA = a.email || '';
      valB = b.email || '';
    } else if (userSortField === 'saldo') {
      valA = a.saldoBruto || 0;
      valB = b.saldoBruto || 0;
    } else if (userSortField === 'status') {
      valA = a.status || 'ativo';
      valB = b.status || 'ativo';
    }

    if (typeof valA === 'string') {
      return userSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return userSortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Paginate users
  const usersPerPage = 10;
  const totalUserPages = Math.ceil(sortedUsers.length / usersPerPage) || 1;
  const paginatedUsers = sortedUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);


  // --- RIFAS COMPUTATION ---
  let filteredRifas = rifas;
  if (rifaSelectedUserFilter !== 'todos') {
    filteredRifas = filteredRifas.filter(r => r.ownerId === rifaSelectedUserFilter);
  }

  if (rifaSearchQuery.trim()) {
    const q = rifaSearchQuery.toLowerCase().trim();
    filteredRifas = filteredRifas.filter(r => {
      const owner = users.find(u => u.id === r.ownerId);
      const rifaName = (r.nome || '').toLowerCase();
      const ownerName = (owner?.nome || 'Admin').toLowerCase();
      const ownerEmail = (owner?.email || '').toLowerCase();
      const ownerDocRaw = (owner?.documento || '').toLowerCase();
      const ownerDocClean = (owner?.documento || '').replace(/\D/g, '');

      return rifaName.includes(q) ||
             ownerName.includes(q) ||
             ownerEmail.includes(q) ||
             ownerDocRaw.includes(q) ||
             (q.replace(/\D/g, '') && ownerDocClean.includes(q.replace(/\D/g, '')));
    });
  }

  // Sort rifas
  const sortedRifas = [...filteredRifas].sort((a, b) => {
    let valA: any = '';
    let valB: any = '';
    if (rifaSortField === 'nome') {
      valA = a.nome || '';
      valB = b.nome || '';
    } else if (rifaSortField === 'cotas') {
      valA = a.quantidadeCotas || 0;
      valB = b.quantidadeCotas || 0;
    } else if (rifaSortField === 'valor') {
      valA = a.valorCota || 0;
      valB = b.valorCota || 0;
    } else if (rifaSortField === 'vendidas') {
      valA = a.cotasVendivas || a.cotasVendidas || 0;
      valB = b.cotasVendivas || b.cotasVendidas || 0;
    } else if (rifaSortField === 'arrecadado') {
      valA = a.totalVendido || 0;
      valB = b.totalVendido || 0;
    } else if (rifaSortField === 'status') {
      valA = a.status || '';
      valB = b.status || '';
    }

    if (typeof valA === 'string') {
      return rifaSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return rifaSortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Paginate rifas
  const rifasPerPage = 10;
  const totalRifaPages = Math.ceil(sortedRifas.length / rifasPerPage) || 1;
  const paginatedRifas = sortedRifas.slice((rifaPage - 1) * rifasPerPage, rifaPage * rifasPerPage);


  // --- BOLÕES COMPUTATION ---
  let filteredBoloes = boloes;
  if (bolaoSelectedUserFilter !== 'todos') {
    filteredBoloes = filteredBoloes.filter(b => b.ownerId === bolaoSelectedUserFilter);
  }

  if (bolaoSearchQuery.trim()) {
    const q = bolaoSearchQuery.toLowerCase().trim();
    filteredBoloes = filteredBoloes.filter(b => {
      const owner = users.find(u => u.id === b.ownerId);
      const bolaoName = (b.nome || '').toLowerCase();
      const ownerName = (owner?.nome || b.organizadorNome || 'Admin').toLowerCase();
      const ownerEmail = (owner?.email || b.email || '').toLowerCase();
      const ownerDocRaw = (owner?.documento || b.organizerCpf || '').toLowerCase();
      const ownerDocClean = (owner?.documento || b.organizerCpf || '').replace(/\D/g, '');

      return bolaoName.includes(q) ||
             ownerName.includes(q) ||
             ownerEmail.includes(q) ||
             ownerDocRaw.includes(q) ||
             (q.replace(/\D/g, '') && ownerDocClean.includes(q.replace(/\D/g, '')));
    });
  }

  // Sort boloes
  const sortedBoloes = [...filteredBoloes].sort((a, b) => {
    let valA: any = '';
    let valB: any = '';
    if (bolaoSortField === 'nome') {
      valA = a.nome || '';
      valB = b.nome || '';
    } else if (bolaoSortField === 'participantes') {
      valA = a.participantesConfirmados || 0;
      valB = b.participantesConfirmados || 0;
    } else if (bolaoSortField === 'valor') {
      valA = a.pricePerParticipant || 0;
      valB = b.pricePerParticipant || 0;
    } else if (bolaoSortField === 'arrecadado') {
      valA = a.totalVendido || 0;
      valB = b.totalVendido || 0;
    } else if (bolaoSortField === 'status') {
      valA = a.status || '';
      valB = b.status || '';
    }

    if (typeof valA === 'string') {
      return bolaoSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return bolaoSortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Paginate boloes
  const boloesPerPage = 10;
  const totalBolaoPages = Math.ceil(sortedBoloes.length / boloesPerPage) || 1;
  const paginatedBoloes = sortedBoloes.slice((bolaoPage - 1) * boloesPerPage, bolaoPage * boloesPerPage);

  if (loading || !config) return <div className="p-20 text-center font-black animate-pulse">Carregando painel master...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-800 flex items-center justify-center min-h-[44px] min-w-[44px]"
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

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-gray-900 text-gray-400 p-6 space-y-8 h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between lg:block mb-10">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
               {config?.platformLogo ? (
                 <img src={config.platformLogo} className="w-full h-full object-contain" alt="Logo" />
               ) : (
                 <div className="w-full h-full bg-[#FF8C00] flex items-center justify-center">
                   <Award className="w-6 h-6" />
                 </div>
               )}
            </div>
            <div>
              <span className="font-black text-lg block">Painel Master</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Controle SaaS</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'stats', label: 'Dashboard', icon: BarChart3 },
            { id: 'rifas', label: 'Gestão de Rifas', icon: LayoutGrid },
            { id: 'boloes', label: 'Gestão de Bolões', icon: Trophy },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'saques', label: 'Solicitações Saque', icon: CreditCard },
            { id: 'config', label: 'Landing Page', icon: Settings },
            { id: 'security', label: 'Configs', icon: Settings2 },
            { id: 'logs', label: 'Admin Logs', icon: Activity },
            { id: 'trash', label: 'Excluídos', icon: Trash2 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? 'bg-[#FF8C00] text-white shadow-lg' : 'hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-10">
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair do Sistema
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-10 space-y-8 overflow-y-auto max-w-full">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-8 mt-12 sm:mt-0">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {activeTab === 'stats' && 'Visão Geral do Sistema'}
                {activeTab === 'rifas' && 'Gerenciamento de Campanhas'}
                {activeTab === 'boloes' && 'Controle Master de Bolões'}
                {activeTab === 'saques' && 'Processamento de Saques'}
                {activeTab === 'config' && 'Editor da Plataforma'}
                {activeTab === 'security' && 'Configurações Globais (Configs)'}
                {activeTab === 'trash' && 'Lixeira Administrativa'}
              </h1>
              <p className="text-gray-500 text-sm font-bold">
                {activeTab === 'trash' ? 'Recupere ou visualize registros excluídos permanentemente' : 'Gerencie usuários, finanças e personalização da LP.'}
              </p>
           </div>
           <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="text-right">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Taxa da Plataforma</span>
                 <span className="text-lg font-black text-[#FF8C00]">{config.taxaPlataforma}%</span>
              </div>
              <Settings2 className="w-6 h-6 text-gray-200" />
           </div>
        </header>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
               <span className="text-[10px] font-black uppercase text-gray-400">Total Transacionado</span>
               <p className="text-3xl font-black text-gray-900">R$ {finance?.totalArrecadado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
               <span className="text-[10px] font-black uppercase text-gray-400">Rifas Ativas</span>
               <p className="text-3xl font-black text-gray-900">{rifas.filter(r => r.status === 'ativa').length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
               <span className="text-[10px] font-black uppercase text-gray-400">Taxas Acumuladas</span>
               <p className="text-3xl font-black text-emerald-600">R$ {finance?.totalTaxas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[#FF8C00] p-6 rounded-3xl shadow-lg space-y-2 text-white">
               <span className="text-[10px] font-black uppercase opacity-60">Saques Pendentes</span>
               <p className="text-3xl font-black">{finance?.saquesPendentes || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'rifas' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Filters + Advanced User Selector for Rifas */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Filtrar por Criador:</span>
                <select
                  value={rifaSelectedUserFilter}
                  onChange={e => { setRifaSelectedUserFilter(e.target.value); setRifaPage(1); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 outline-none focus:border-[#FF8C00] bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <option value="todos">Todos os Criadores ({rifas.length})</option>
                  {clientUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.nome} (@{u.usuario})</option>
                  ))}
                </select>
              </div>

              {/* Advanced Search Input for Rifas */}
              <div className="relative w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-405">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={rifaSearchQuery}
                  onChange={e => { setRifaSearchQuery(e.target.value); setRifaPage(1); }}
                  placeholder="Buscar por Rifa, Criador, E-mail, CPF/CNPJ..."
                  className="w-full pl-10 pr-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 focus:border-[#FF8C00] outline-none transition-all placeholder:text-gray-450 text-gray-700 bg-gray-50"
                />
                {rifaSearchQuery && (
                  <button 
                    type="button"
                    onClick={() => { setRifaSearchQuery(''); setRifaPage(1); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-450 font-extrabold hover:text-gray-605"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
               <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                 <div>
                   <h3 className="font-extrabold text-gray-950 text-base">Rifas Registradas na Plataforma</h3>
                   <p className="text-xs text-gray-400 font-medium">Controle de visualização, ativação ou suspensão de canais de rifas.</p>
                 </div>
               </div>

               {/* Mobile View: Cards */}
               <div className="lg:hidden divide-y divide-gray-100 uppercase font-bold text-gray-600">
                  {paginatedRifas.length === 0 ? (
                    <div className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhuma Rifa cadastrada na base.</div>
                  ) : (
                    paginatedRifas.map(r => {
                      const owner = users.find(u => u.id === r.ownerId);
                      return (
                        <div key={r.id} className="p-6 space-y-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-black text-gray-950 block text-sm">{r.nome}</span>
                              <div className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                <span>Por @{owner?.usuario || 'Admin Master'}</span>
                              </div>
                              <a href={`${window.location.origin}/${r.slug}`} target="_blank" rel="noreferrer" className="text-orange-500 font-mono text-[9px] hover:underline block truncate max-w-[200px]">
                                /{r.slug}
                              </a>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${r.status === 'ativa' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {r.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                            <div>
                              <span className="text-[8px] text-gray-400 block tracking-widest">COTAS</span>
                              <span className="text-[11px] text-slate-600 font-black">{r.quantidadeCotas} UNIDADES</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-gray-400 block tracking-widest">VALOR COTA</span>
                              <span className="text-[11px] text-gray-950 font-black">R$ {parseFloat(r.valorCota || 0).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                             {r.status === 'ativa' ? (
                               <button
                                 onClick={() => handleUpdateRaffleStatus(r.id, 'suspensa')}
                                 className="flex-1 py-3 text-[10px] font-black uppercase text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl cursor-pointer transition-colors text-center shadow-sm"
                               >
                                 Suspender Rifa
                               </button>
                             ) : (
                               <button
                                 onClick={() => handleUpdateRaffleStatus(r.id, 'ativa')}
                                 className="flex-1 py-3 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer transition-colors text-center shadow-sm"
                               >
                                 Ativar Rifa
                               </button>
                             )}
                             <button
                               onClick={() => handleDeleteRaffle(r.id)}
                               className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-colors flex items-center justify-center shrink-0 shadow-sm"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      );
                    })
                  )}
               </div>

               {/* Desktop View: Table */}
               <div className="hidden lg:block overflow-x-auto">
                 <table className="w-full text-left">
                <thead className="bg-[#FF8C00]/5 border-b border-gray-100">
                   <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                      <th 
                        onClick={() => {
                          if (rifaSortField === 'nome') {
                            setRifaSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setRifaSortField('nome');
                            setRifaSortDirection('asc');
                          }
                          setRifaPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center gap-1.5">
                          Rifa / Criador
                          <span className="text-[9px] text-gray-400">
                            {rifaSortField === 'nome' ? (rifaSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (rifaSortField === 'cotas') {
                            setRifaSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setRifaSortField('cotas');
                            setRifaSortDirection('asc');
                          }
                          setRifaPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center gap-1.5">
                          Qtd Cotas
                          <span className="text-[9px] text-gray-400">
                            {rifaSortField === 'cotas' ? (rifaSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (rifaSortField === 'valor') {
                            setRifaSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setRifaSortField('valor');
                            setRifaSortDirection('asc');
                          }
                          setRifaPage(1);
                        }}
                        className="px-6 py-4 text-right cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          Valor Cota
                          <span className="text-[9px] text-gray-400">
                            {rifaSortField === 'valor' ? (rifaSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (rifaSortField === 'status') {
                            setRifaSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setRifaSortField('status');
                            setRifaSortDirection('asc');
                          }
                          setRifaPage(1);
                        }}
                        className="px-6 py-4 text-center cursor-pointer hover:bg-gray-250/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          Status
                          <span className="text-[9px] text-gray-400">
                            {rifaSortField === 'status' ? (rifaSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right bg-gray-50/70">Ações</th>
                   </tr>
                </thead>
                <tbody>
                   {paginatedRifas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-xs font-bold text-gray-400">Nenhuma Rifa cadastrada na base.</td>
                      </tr>
                   ) : (
                      paginatedRifas.map(r => {
                        const owner = users.find(u => u.id === r.ownerId);
                        return (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-xs transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-black text-gray-950 block text-sm">{r.nome}</span>
                              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                                <span className="text-gray-500">De:</span>
                                {owner ? (
                                  <span className="text-gray-700 font-extrabold">{owner.nome} (@{owner.usuario})</span>
                                ) : (
                                  <span className="text-[#FF8C00] font-extrabold">Admin Master</span>
                                )}
                              </div>
                              <a href={`${window.location.origin}/${r.slug}`} target="_blank" rel="noreferrer" className="text-orange-500 select-all font-mono font-semibold text-[10px] hover:underline">
                                /{r.slug}
                              </a>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600">{r.quantidadeCotas} cotas</td>
                            <td className="px-6 py-4 text-right font-black text-gray-950">R$ {parseFloat(r.valorCota || 0).toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${r.status === 'ativa' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const url = `${window.location.origin}/${r.slug}`;
                                    navigator.clipboard.writeText(url);
                                    alert('Link da Rifa copiado!');
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                  title="Copiar Link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`${window.location.origin}/${r.slug}`, '_blank');
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Ver Página Pública"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(r.nome, 'Confira esta rifa!', `${window.location.origin}/${r.slug}`);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Compartilhar"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                                {r.status === 'ativa' ? (
                                  <button
                                    onClick={() => handleUpdateRaffleStatus(r.id, 'suspensa')}
                                    className="p-1 px-2 text-[9px] font-black uppercase text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Suspender
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateRaffleStatus(r.id, 'ativa')}
                                    className="p-1 px-2 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Ativar
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteRaffle(r.id)}
                                  className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Remover Rifa da Base"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                        </tr>
                      );})
                   )}
                </tbody>
             </table>
           </div>

             {/* Rifas Pagination Footer */}
             {totalRifaPages > 1 && (
               <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                 <div className="text-xs text-gray-400 font-bold uppercase tracking-widest select-none">
                   Exibindo Página <span className="text-gray-900 font-black">{rifaPage}</span> de <span className="text-gray-900 font-black">{totalRifaPages}</span> ({sortedRifas.length} registros)
                 </div>
                 <div className="flex items-center gap-2">
                   <button
                     disabled={rifaPage === 1}
                     onClick={() => setRifaPage(prev => Math.max(prev - 1, 1))}
                     className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                   >
                     <ChevronLeft className="w-4 h-4" />
                   </button>
                   <button
                     disabled={rifaPage === totalRifaPages}
                     onClick={() => setRifaPage(prev => Math.min(prev + 1, totalRifaPages))}
                     className="p-2 bg-white rounded-xl border border-gray-200 text-[#FF8C00] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                   >
                     <ChevronRight className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             )}
          </div>
          </div>
        )}

        {activeTab === 'boloes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Filters + Advanced User Selector for Boloes */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Filtrar por Criador:</span>
                <select
                  value={bolaoSelectedUserFilter}
                  onChange={e => { setBolaoSelectedUserFilter(e.target.value); setBolaoPage(1); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 outline-none focus:border-[#FF8C00] bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <option value="todos">Todos os Criadores ({boloes.length})</option>
                  {clientUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.nome} (@{u.usuario})</option>
                  ))}
                </select>
              </div>

              {/* Advanced Search Input for Boloes */}
              <div className="relative w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar bolão por nome, criador, CPF, CNPJ, e-mail..."
                  value={bolaoSearchQuery}
                  onChange={e => { setBolaoSearchQuery(e.target.value); setBolaoPage(1); }}
                  className="w-full pl-10 pr-4 py-2 font-medium text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF8C00] transition-colors"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 flex justify-between items-center">
               <div>
                <h3 className="font-extrabold text-gray-950 text-base">Bolões Esportivos Ativos</h3>
                <p className="text-xs text-gray-400 font-medium">Controle master de ligas, campeonatos, arrecadações e encerramentos de bolões.</p>
               </div>
             </div>

             {/* Mobile View: Cards */}
             <div className="lg:hidden divide-y divide-gray-100 uppercase font-bold text-gray-600">
                {paginatedBoloes.length === 0 ? (
                  <div className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhum Bolão registrado no banco.</div>
                ) : (
                  paginatedBoloes.map(b => {
                    const owner = users.find(u => u.id === b.ownerId);
                    return (
                      <div key={b.id} className="p-6 space-y-4 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="font-black text-gray-950 block text-sm">{b.nome}</span>
                            <div className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                              <span>Por @{owner?.usuario || 'Admin Master'}</span>
                            </div>
                            <div className="text-[9px] text-emerald-600 font-bold uppercase">
                              Enc.: {new Date(b.dataEncerramento).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${b.status === 'ativo' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {b.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                          <div>
                            <span className="text-[8px] text-gray-400 block tracking-widest">INSCRITOS</span>
                            <span className="text-[11px] text-slate-600 font-black">{b.participantesCount || 0} MEMBROS</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-gray-400 block tracking-widest">VALOR VAGA</span>
                            <span className="text-[11px] text-gray-950 font-black">R$ {parseFloat(b.valorCota || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                           {b.status === 'ativo' ? (
                             <button
                               onClick={() => handleUpdateBolaoStatus(b.id, 'suspenso')}
                               className="flex-1 py-3 text-[10px] font-black uppercase text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl cursor-pointer transition-colors text-center shadow-sm"
                             >
                               Suspender
                             </button>
                           ) : (
                             <button
                               onClick={() => handleUpdateBolaoStatus(b.id, 'ativo')}
                               className="flex-1 py-3 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer transition-colors text-center shadow-sm"
                             >
                               Ativar
                             </button>
                           )}
                           <button
                             onClick={() => handleDeleteBolao(b.id)}
                             className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-colors flex items-center justify-center shrink-0 shadow-sm"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    );
                  })
                )}
             </div>

             {/* Desktop View: Table */}
             <div className="hidden lg:block overflow-x-auto">
               <table className="w-full text-left">
                <thead className="bg-[#FF8C00]/5 border-b border-gray-100">
                   <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                      <th 
                        onClick={() => {
                          if (bolaoSortField === 'nome') {
                            setBolaoSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setBolaoSortField('nome');
                            setBolaoSortDirection('asc');
                          }
                          setBolaoPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center gap-1.5">
                          Bolão / Liga / Link
                          <span className="text-[9px] text-gray-400">
                            {bolaoSortField === 'nome' ? (bolaoSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (bolaoSortField === 'participantes') {
                            setBolaoSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setBolaoSortField('participantes');
                            setBolaoSortDirection('asc');
                          }
                          setBolaoPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center gap-1.5">
                          Inscritos
                          <span className="text-[9px] text-gray-400">
                            {bolaoSortField === 'participantes' ? (bolaoSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (bolaoSortField === 'valor') {
                            setBolaoSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setBolaoSortField('valor');
                            setBolaoSortDirection('asc');
                          }
                          setBolaoPage(1);
                        }}
                        className="px-6 py-4 text-right cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          Valor Vaga
                          <span className="text-[9px] text-gray-400">
                            {bolaoSortField === 'valor' ? (bolaoSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center bg-gray-50/70">Encerramento</th>
                      <th 
                        onClick={() => {
                          if (bolaoSortField === 'status') {
                            setBolaoSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setBolaoSortField('status');
                            setBolaoSortDirection('asc');
                          }
                          setBolaoPage(1);
                        }}
                        className="px-6 py-4 text-center cursor-pointer hover:bg-gray-250/50 hover:text-gray-700 transition-colors bg-gray-50/70"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          Status
                          <span className="text-[9px] text-gray-400">
                            {bolaoSortField === 'status' ? (bolaoSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right bg-gray-50/70">Ações</th>
                   </tr>
                </thead>
                <tbody>
                   {paginatedBoloes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-xs font-bold text-gray-400">Nenhum Bolão registrado no banco.</td>
                      </tr>
                   ) : (
                      paginatedBoloes.map(b => {
                        const owner = users.find(u => u.id === b.ownerId);
                        return (
                        <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 text-xs transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-black text-gray-950 block text-sm">{b.nome}</span>
                              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                                <span className="text-gray-500">De:</span>
                                {owner ? (
                                  <span className="text-gray-700 font-extrabold">{owner.nome} (@{owner.usuario})</span>
                                ) : (
                                  <span className="text-[#FF8C00] font-extrabold">Admin Master</span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 font-semibold block">{b.championshipName} - {b.competitionName}</span>
                              <a href={`${window.location.origin}/bolao/${b.slug}`} target="_blank" rel="noreferrer" className="text-emerald-600 select-all font-mono font-semibold text-[10px] hover:underline">
                                /bolao/{b.slug}
                              </a>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600">
                              {b.participantesConfirmados || 0} / {b.maxParticipants || 100}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-gray-950">R$ {parseFloat(b.pricePerParticipant || 0).toFixed(2)}</td>
                            <td className="px-6 py-4 text-center font-mono text-gray-400 text-[11px]">
                              {new Date(b.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${b.status === 'ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const url = `${window.location.origin}/bolao/${b.slug}`;
                                    navigator.clipboard.writeText(url);
                                    alert('Link do Bolão copiado!');
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Copiar Link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`${window.location.origin}/bolao/${b.slug}`, '_blank');
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Ver Página Pública"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(b.nome, 'Participe deste bolão!', `${window.location.origin}/bolao/${b.slug}`);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                  title="Compartilhar"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                                {b.status === 'ativo' ? (
                                  <button
                                    onClick={() => handleUpdateBolaoStatus(b.id, 'suspenso')}
                                    className="p-1 px-2 text-[9px] font-black uppercase text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Suspender
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateBolaoStatus(b.id, 'ativo')}
                                    className="p-1 px-2 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Ativar
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteBolao(b.id)}
                                  className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Remover Bolão da Base"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                        </tr>
                      );})
                   )}
                </tbody>
              </table>
           </div>

           {/* Boloes Pagination Footer */}
           {totalBolaoPages > 1 && (
             <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
               <div className="text-xs text-gray-400 font-bold uppercase tracking-widest select-none">
                 Exibindo Página <span className="text-gray-900 font-black">{bolaoPage}</span> de <span className="text-gray-900 font-black">{totalBolaoPages}</span> ({sortedBoloes.length} registros)
               </div>
               <div className="flex items-center gap-2">
                 <button
                   disabled={bolaoPage === 1}
                   onClick={() => setBolaoPage(prev => Math.max(prev - 1, 1))}
                   className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <button
                   disabled={bolaoPage === totalBolaoPages}
                   onClick={() => setBolaoPage(prev => Math.min(prev + 1, totalBolaoPages))}
                   className="p-2 bg-white rounded-xl border border-gray-200 text-[#FF8C00] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                 >
                   <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
             </div>
           )}
          </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF8C00]" />
                  Controle de Clientes
                </h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Configure taxas, saldos e gerencie parceiros de rifas e bolões</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF8C00] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-[#E67E22] transition-all active:scale-95 self-start md:self-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Novo Usuário
              </button>
            </div>

            {/* Quick Filters + Filters Indicator */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setUserFilter('todos'); setUserPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    userFilter === 'todos' 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({clientUsers.length})
                </button>
                <button
                  type="button"
                  onClick={() => { setUserFilter('rifas'); setUserPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    userFilter === 'rifas' 
                      ? 'bg-[#FF8C00] text-white shadow-md font-extrabold' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Usuários de Rifas ({clientUsers.filter(u => rifas.some(r => r.ownerId === u.id)).length})
                </button>
                <button
                  type="button"
                  onClick={() => { setUserFilter('boloes'); setUserPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    userFilter === 'boloes' 
                      ? 'bg-sky-600 text-white shadow-md font-extrabold' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Usuários de Bolões ({clientUsers.filter(u => boloes.some(b => b.ownerId === u.id)).length})
                </button>
              </div>

              {/* Advanced Search Input */}
              <div className="relative w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => { setUserSearchQuery(e.target.value); setUserPage(1); }}
                  placeholder="Pesquisar por Nome, CPF, CNPJ, E-mail ou WhatsApp..."
                  className="w-full pl-10 pr-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 focus:border-[#FF8C00] outline-none transition-all placeholder:text-gray-400 placeholder:font-bold text-gray-700 bg-gray-50"
                />
                {userSearchQuery && (
                  <button 
                    type="button"
                    onClick={() => { setUserSearchQuery(''); setUserPage(1); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 font-extrabold hover:text-gray-600"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Users Table / Cards Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden font-bold">
              
              {/* Mobile View: Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginatedUsers.length === 0 ? (
                  <div className="p-10 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Nenhum cliente localizado</div>
                ) : (
                  paginatedUsers.map(u => (
                    <div key={u.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-gray-900">{u.nome}</h4>
                          <p className="text-[10px] text-gray-400 font-mono tracking-tighter">@{u.usuario}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          u.status === 'ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-[10px] uppercase font-black">
                        <div>
                          <span className="text-gray-400 block mb-0.5">Documento</span>
                          <span className="text-gray-700">{formatDocumento(u.documento)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block mb-0.5">Saldo Disponível</span>
                          <span className="text-emerald-600">R$ {(u.saldo || 0).toFixed(2)}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-gray-50 mt-1">
                          <span className="text-gray-400 block mb-0.5">Contato</span>
                          <div className="flex flex-col gap-1 lowercase text-gray-700 font-mono">
                            <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {u.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {u.whatsapp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button 
                          onClick={() => { setEditingUser(u); setShowEditUserModal(true); }}
                          className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Editar
                        </button>
                        <button 
                          onClick={() => handleUpdateUserStatus(u.id, u.status === 'ativo' ? 'suspenso' : 'ativo')}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            u.status === 'ativo' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {u.status === 'ativo' ? <><Ban className="w-3 h-3" /> Suspender</> : <><Check className="w-3 h-3" /> Ativar</>}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-red-50 text-red-400 p-2.5 rounded-xl hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest select-none bg-gray-100/55">
                      <th 
                        onClick={() => {
                          if (userSortField === 'nome') {
                            setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('nome');
                            setUserSortDirection('asc');
                          }
                          setUserPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          Usuário
                          <span className="text-[9px] text-gray-400">
                            {userSortField === 'nome' ? (userSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4">Documento</th>
                      <th 
                        onClick={() => {
                          if (userSortField === 'email') {
                            setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('email');
                            setUserSortDirection('asc');
                          }
                          setUserPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          E-mail / WhatsApp
                          <span className="text-[9px] text-gray-400">
                            {userSortField === 'email' ? (userSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (userSortField === 'saldo') {
                            setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('saldo');
                            setUserSortDirection('asc');
                          }
                          setUserPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          Saldo Bruto
                          <span className="text-[9px] text-gray-400">
                            {userSortField === 'saldo' ? (userSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4">Taxa Personalizada</th>
                      <th 
                        onClick={() => {
                          if (userSortField === 'status') {
                            setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('status');
                            setUserSortDirection('asc');
                          }
                          setUserPage(1);
                        }}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          Status
                          <span className="text-[9px] text-gray-400">
                            {userSortField === 'status' ? (userSortDirection === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                          Nenhum cliente correspondente encontrado.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map(u => (
                        <tr key={u.id} className="text-sm font-bold text-gray-700 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-black text-gray-900">{u.nome}</div>
                            <div className="text-[10px] uppercase font-black tracking-wider text-gray-400">@{u.usuario}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px] text-gray-600">{formatDocumento(u.documento)}</td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {u.email}
                            </div>
                            {u.whatsapp && (
                              <div className="text-[11px] font-bold text-[#FF8C00] font-mono flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3 text-[#FF8C00]" />
                                {u.whatsapp}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-black text-emerald-600">R$ {(u.saldoBruto || 0).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                defaultValue={u.customFee}
                                onBlur={e => handleUpdateUserFee(u.id, Number(e.target.value))}
                                className="w-16 border border-gray-200 p-1 rounded-md text-center bg-gray-50 rounded-lg focus:bg-white focus:border-[#FF8C00]"
                              />
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.status === 'ativo' ? 'bg-emerald-50 text-emerald-600' :
                              u.status === 'suspenso' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                            }`}>
                              {u.status || 'ativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <button 
                                title="Editar Usuário"
                                onClick={() => {
                                  setEditingUser({ ...u, password: '' });
                                  setShowEditUserModal(true);
                                }}
                                className="p-1 px-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Editar
                              </button>

                              {u.status === 'ativo' ? (
                                <button 
                                  title="Suspender Conta"
                                  onClick={() => handleUpdateUserStatus(u.id, 'suspenso')}
                                  className="p-1 px-2.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Ban className="w-3.5 h-3.5 text-amber-500" />
                                  Suspender
                                </button>
                              ) : (
                                <button 
                                  title="Ativar Conta"
                                  onClick={() => handleUpdateUserStatus(u.id, 'ativo')}
                                  className="p-1 px-2.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 transition-all text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  Ativar
                                </button>
                              )}

                              {u.status !== 'banido' && (
                                <button 
                                  title="Banir Conta"
                                  onClick={() => handleUpdateUserStatus(u.id, 'banido')}
                                  className="p-1 px-2.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 transition-all text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                  Banir
                                </button>
                              )}

                              <button 
                                title="Excluir Usuário"
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1 px-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                Deletar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Users Pagination Footer */}
              {totalUserPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest select-none">
                    Exibindo Página <span className="text-gray-900 font-black">{userPage}</span> de <span className="text-gray-900 font-black">{totalUserPages}</span> ({sortedUsers.length} registros)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={userPage === 1}
                      onClick={() => setUserPage(prev => Math.max(prev - 1, 1))}
                      className="p-2 bg-white rounded-xl border border-gray-250 text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={userPage === totalUserPages}
                      onClick={() => setUserPage(prev => Math.min(prev + 1, totalUserPages))}
                      className="p-2 bg-white rounded-xl border border-gray-250 text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {activeTab === 'saques' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Saques Sub-Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setSaqueSubTab('pendente')}
              className={`pb-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                saqueSubTab === 'pendente' 
                  ? 'border-[#FF8C00] text-[#FF8C00]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Pendentes ({saques.filter(s => s.status === 'pendente').length})
            </button>
            <button
              onClick={() => setSaqueSubTab('aprovado')}
              className={`pb-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                saqueSubTab === 'aprovado' 
                  ? 'border-[#FF8C00] text-[#FF8C00]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Aprovadas ({saques.filter(s => s.status === 'aprovado' || s.status === 'pago').length})
            </button>
            <button
              onClick={() => setSaqueSubTab('recusado')}
              className={`pb-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                saqueSubTab === 'recusado' 
                  ? 'border-[#FF8C00] text-[#FF8C00]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Rejeitadas ({saques.filter(s => s.status === 'recusado').length})
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Campanha / Usuário</th>
                      <th className="px-6 py-4">Chave PIX</th>
                      <th className="px-6 py-4">Valor Bruto</th>
                      <th className="px-6 py-4">Líquido</th>
                      <th className="px-6 py-4">Status</th>
                      {saqueSubTab === 'recusado' && <th className="px-6 py-4">Motivo da Rejeição</th>}
                      {saqueSubTab !== 'recusado' && <th className="px-6 py-4 text-center">Ações</th>}
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {saques.filter(s => {
                     if (saqueSubTab === 'pendente') return s.status === 'pendente';
                     if (saqueSubTab === 'aprovado') return s.status === 'aprovado' || s.status === 'pago';
                     if (saqueSubTab === 'recusado') return s.status === 'recusado';
                     return true;
                   }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-gray-400 font-bold">
                          Nenhum registro nesta categoria.
                        </td>
                      </tr>
                   ) : saques.filter(s => {
                     if (saqueSubTab === 'pendente') return s.status === 'pendente';
                     if (saqueSubTab === 'aprovado') return s.status === 'aprovado' || s.status === 'pago';
                     if (saqueSubTab === 'recusado') return s.status === 'recusado';
                     return true;
                   }).map(s => {
                     const isRifa = !!s.rifaId;
                     const campaignName = isRifa 
                       ? (rifas.find(r => r.id === s.rifaId)?.nome || 'Campanha Deletada') 
                       : (boloes.find(b => b.id === s.bolaoId)?.nome || 'Campanha Deletada');
                     const campaignType = isRifa ? 'Rifa' : 'Bolão';

                     return (
                      <tr key={s.id} className="text-sm font-bold text-gray-700">
                         <td className="px-6 py-4 font-mono text-[11px]">{new Date(s.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4">
                            <span className="block text-gray-900">{campaignName} <span className="text-[9px] text-gray-400 font-normal">({campaignType})</span></span>
                            <span className="text-[10px] text-gray-400">@{users.find(u => u.id === s.userId)?.usuario || 'Removido'} ({users.find(u => u.id === s.userId)?.nome || 'Usuário'})</span>
                         </td>
                         <td className="px-6 py-4 font-mono text-[11px] bg-gray-50/50">{s.chavePix}</td>
                         <td className="px-6 py-4">R$ {s.valorSolicitado.toFixed(2)}</td>
                         <td className="px-6 py-4 text-[#FF8C00]">R$ {s.valorLiquido.toFixed(2)}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              s.status === 'pendente' ? 'bg-orange-100 text-orange-600' : 
                              s.status === 'pago' ? 'bg-emerald-100 text-emerald-600' : 
                              s.status === 'recusado' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {s.status === 'recusado' ? 'Rejeitado' : s.status}
                            </span>
                         </td>
                         {saqueSubTab === 'recusado' && (
                           <td className="px-6 py-4 text-xs font-black text-red-600">
                             <div>{s.motivoRejeicao || 'Não especificado'}</div>
                             <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Resp: {s.adminResponsavel || 'Admin'}</div>
                           </td>
                         )}
                         {saqueSubTab !== 'recusado' && (
                           <td className="px-6 py-4 text-center space-x-2">
                              {s.status === 'pendente' && (
                                <>
                                 <button onClick={() => handleUpdateWithdrawal(s.id, 'pago')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer" title="Marcar como Pago"><CheckCircle2 className="w-4 h-4" /></button>
                                 <button onClick={() => setRejectionModal({ withdrawalId: s.id, motivo: 'Dados incorretos', outroMotivo: '', isOpen: true })} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" title="Recusar"><XCircle className="w-4 h-4" /></button>
                                 <button onClick={() => handleDeleteWithdrawal(s.id)} className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer" title="Mover para Lixeira"><Trash2 className="w-4 h-4" /></button>
                                </>
                              )}
                              {s.status === 'aprovado' && (
                                 <button onClick={() => handleUpdateWithdrawal(s.id, 'pago')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer" title="Marcar como Pago"><CheckCircle2 className="w-4 h-4" /></button>
                              )}
                           </td>
                         )}
                      </tr>
                     );
                   })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {saques.filter(s => {
                if (saqueSubTab === 'pendente') return s.status === 'pendente';
                if (saqueSubTab === 'aprovado') return s.status === 'aprovado' || s.status === 'pago';
                if (saqueSubTab === 'recusado') return s.status === 'recusado';
                return true;
              }).length === 0 ? (
                <div className="p-10 text-center text-gray-400 font-bold">Nenhum registro nesta categoria.</div>
              ) : saques.filter(s => {
                if (saqueSubTab === 'pendente') return s.status === 'pendente';
                if (saqueSubTab === 'aprovado') return s.status === 'aprovado' || s.status === 'pago';
                if (saqueSubTab === 'recusado') return s.status === 'recusado';
                return true;
              }).map(s => {
                const isRifa = !!s.rifaId;
                const campaignName = isRifa 
                  ? (rifas.find(r => r.id === s.rifaId)?.nome || 'Campanha Deletada') 
                  : (boloes.find(b => b.id === s.bolaoId)?.nome || 'Campanha Deletada');
                const campaignType = isRifa ? 'Rifa' : 'Bolão';

                return (
                  <div key={s.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-sm font-black text-gray-900 leading-tight">{campaignName}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{campaignType}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        s.status === 'pendente' ? 'bg-orange-100 text-orange-600' : 
                        s.status === 'pago' ? 'bg-emerald-100 text-emerald-600' : 
                        s.status === 'recusado' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {s.status === 'recusado' ? 'Rejeitado' : s.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-gray-400 uppercase font-black block mb-0.5">Usuário</span>
                        <span className="text-gray-900 font-bold truncate block tracking-tighter">@{users.find(u => u.id === s.userId)?.usuario || 'Removido'}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-gray-400 uppercase font-black block mb-0.5">Data</span>
                        <span className="text-gray-900 font-bold">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-[#FF8C00]/5 p-2 rounded-xl border border-[#FF8C00]/10 col-span-2">
                        <span className="text-[#FF8C00] uppercase font-black block mb-0.5 text-[9px]">Chave PIX de Destino</span>
                        <span className="text-gray-900 font-mono font-bold break-all">{s.chavePix}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-gray-400 uppercase font-black block mb-0.5">Bruto</span>
                        <span className="text-gray-900 font-bold small">R$ {s.valorSolicitado.toFixed(2)}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-emerald-600 uppercase font-black block mb-0.5">Líquido</span>
                        <span className="text-emerald-700 font-black">R$ {s.valorLiquido.toFixed(2)}</span>
                      </div>
                    </div>

                    {saqueSubTab === 'recusado' && (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100 space-y-1">
                        <span className="text-[9px] font-black text-red-400 uppercase block">Motivo da Rejeição</span>
                        <p className="text-xs font-black text-red-700">{s.motivoRejeicao || 'Não especificado'}</p>
                        <p className="text-[9px] text-red-400 font-bold uppercase italic">Analisado por: {s.adminResponsavel || 'Admin'}</p>
                      </div>
                    )}

                    {saqueSubTab !== 'recusado' && s.status !== 'pago' && (
                      <div className="flex gap-2 pt-1">
                        {s.status === 'pendente' && (
                          <>
                            <button 
                              onClick={() => handleUpdateWithdrawal(s.id, 'pago')} 
                              className="flex-1 bg-emerald-500 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Aprovar e Pagar
                            </button>
                            <button 
                              onClick={() => setRejectionModal({ withdrawalId: s.id, motivo: 'Dados incorretos', outroMotivo: '', isOpen: true })} 
                              className="flex-1 bg-red-50 text-red-600 font-black py-2.5 rounded-xl border border-red-100 text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Recusar
                            </button>
                          </>
                        )}
                        {s.status === 'aprovado' && (
                          <button 
                            onClick={() => handleUpdateWithdrawal(s.id, 'pago')} 
                            className="w-full bg-emerald-500 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Confirmar Pagamento
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

        {activeTab === 'logs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Data/Hora</th>
                    <th className="px-6 py-4">Administrador</th>
                    <th className="px-6 py-4">Ação</th>
                    <th className="px-6 py-4">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 uppercase font-bold text-gray-600">
                  {(config as any).adminLogs && (config as any).adminLogs.length > 0 ? (
                    [...(config as any).adminLogs].reverse().map((log: any) => (
                      <tr key={log.id} className="text-[11px] hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono">{new Date(log.timestamp || log.date).toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#FF8C00]">@{log.admin}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            log.action?.includes('DELETE') || log.action?.includes('exclusao') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-gray-400 font-bold uppercase text-[10px]">Nenhum log registrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-gray-100">
              {(config as any).adminLogs && (config as any).adminLogs.length > 0 ? (
                [...(config as any).adminLogs].reverse().map((log: any) => (
                  <div key={log.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-gray-400">{new Date(log.timestamp || log.date).toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        log.action?.includes('DELETE') || log.action?.includes('exclusao') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#FF8C00] block">@{log.admin}</span>
                      <p className="text-[11px] font-bold text-gray-800 leading-tight uppercase">{log.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px]">Nenhum log registrado.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                   <h3 className="text-xl font-black text-gray-900">Editor da Landing Page</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Nome da Plataforma</label>
                         <input 
                           type="text" 
                           value={config.platformName} 
                           onChange={e => setConfig({...config, platformName: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Taxa da Plataforma (%)</label>
                         <input 
                           type="number" 
                           value={config.taxaPlataforma} 
                           onChange={e => setConfig({...config, taxaPlataforma: Number(e.target.value)})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">WhatsApp de Suporte</label>
                         <input 
                           type="text" 
                           placeholder="+55 87 99999-9999"
                           value={config.suporteWhatsapp || ''} 
                           onChange={e => setConfig({...config, suporteWhatsapp: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold font-mono"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Webhook Secret (Mercado Pago)</label>
                         <input 
                           type="password" 
                           placeholder="Chave para validar Webhook"
                           value={config.mpWebhookSecret || ''} 
                           onChange={e => setConfig({...config, mpWebhookSecret: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold font-mono"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Mercado Pago Access Token</label>
                         <input 
                           type="password" 
                           placeholder="APP_USR-..."
                           value={config.mpAccessToken || ''} 
                           onChange={e => setConfig({...config, mpAccessToken: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold font-mono"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Cobrar Ativação de Conta?</label>
                         <select 
                           value={config.requireActivationFee ? 'sim' : 'nao'} 
                           onChange={e => setConfig({...config, requireActivationFee: e.target.value === 'sim'})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         >
                            <option value="nao">Não (Grátis)</option>
                            <option value="sim">Sim (Pago)</option>
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Valor da Ativação (R$)</label>
                         <input 
                           type="number" 
                           step="0.01"
                           value={config.activationFeeAmount || 1.0} 
                           onChange={e => setConfig({...config, activationFeeAmount: Number(e.target.value)})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Logo (Upload)</label>
                        <div className="h-24 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                          {config.platformLogo ? (
                            <img src={config.platformLogo} className="w-full h-full object-contain p-2" alt="Logo" />
                          ) : (
                            <input type="file" onChange={e => handleFileUpload(e, 'platformLogo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                          )}
                          {!config.platformLogo && <span className="text-[10px] font-bold text-gray-400 uppercase">Clique para Upload</span>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Banner Principal</label>
                        <div className="h-24 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50">
                          {config.platformBanner ? (
                            <img src={config.platformBanner} className="w-full h-full object-cover" alt="Banner" />
                          ) : (
                            <input type="file" onChange={e => handleFileUpload(e, 'platformBanner')} className="absolute inset-0 opacity-0 cursor-pointer" />
                          )}
                          {!config.platformBanner && <span className="text-[10px] font-bold text-gray-400 uppercase">Clique para Upload</span>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Paleta de Cores</label>
                        <div className="flex gap-2 h-24">
                          <div className="flex-1 border border-gray-100 p-2 rounded-2xl flex flex-col items-center justify-center gap-1">
                            <input type="color" value={config.primaryColor || '#FFFFFF'} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="w-8 h-8 rounded-full border-0 p-0 overflow-hidden cursor-pointer" />
                            <span className="text-[8px] font-black uppercase text-gray-400">Primária</span>
                            <span className="text-[9px] font-mono font-bold leading-none">{config.primaryColor || '#FFFFFF'}</span>
                          </div>
                          <div className="flex-1 border border-gray-100 p-2 rounded-2xl flex flex-col items-center justify-center gap-1">
                            <input type="color" value={config.secondaryColor || '#FF8C00'} onChange={e => setConfig({...config, secondaryColor: e.target.value})} className="w-8 h-8 rounded-full border-0 p-0 overflow-hidden cursor-pointer" />
                            <span className="text-[8px] font-black uppercase text-gray-400">Secundária</span>
                            <span className="text-[9px] font-mono font-bold leading-none">{config.secondaryColor || '#FF8C00'}</span>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400">Badge Hero</label>
                          <input 
                            type="text" 
                            value={config.heroBadge} 
                            onChange={e => setConfig({...config, heroBadge: e.target.value})}
                            className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400">Texto Botão Primário</label>
                          <input 
                            type="text" 
                            value={config.heroButtonText || ''} 
                            onChange={e => setConfig({...config, heroButtonText: e.target.value})}
                            className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400">Texto Botão Secundário</label>
                          <input 
                            type="text" 
                            value={config.secondaryButtonText || ''} 
                            onChange={e => setConfig({...config, secondaryButtonText: e.target.value})}
                            className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Título Hero</label>
                         <input 
                           type="text" 
                           value={config.heroTitle} 
                           onChange={e => setConfig({...config, heroTitle: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-gray-400">Subtítulo Hero</label>
                         <textarea 
                           rows={3}
                           value={config.heroSub} 
                           onChange={e => setConfig({...config, heroSub: e.target.value})}
                           className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                         />
                      </div>
                   </div>

                   <div className="space-y-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase text-gray-400">Dúvidas Frequentes (FAQ)</label>
                        <button 
                          onClick={() => setConfig({...config, faqs: [...(config.faqs || []), { q: 'Nova Pergunta', a: 'Resposta aqui' }]})}
                          className="text-[10px] font-black text-[#FF8C00] uppercase hover:underline"
                        >
                          + Adicionar FAQ
                        </button>
                      </div>
                      <div className="space-y-4">
                        {config.faqs?.map((faq, i) => (
                          <div key={i} className="p-4 border border-gray-100 rounded-2xl space-y-3 relative group">
                            <button 
                              onClick={() => setConfig({...config, faqs: config.faqs.filter((_, idx) => idx !== i)})}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <input 
                              type="text" 
                              value={faq.q} 
                              onChange={e => {
                                const newFaqs = [...config.faqs];
                                newFaqs[i].q = e.target.value;
                                setConfig({...config, faqs: newFaqs});
                              }}
                              placeholder="Pergunta"
                              className="w-full text-sm font-bold border-b border-gray-50 pb-2 outline-none focus:border-[#FF8C00]"
                            />
                            <textarea 
                              rows={2}
                              value={faq.a} 
                              onChange={e => {
                                const newFaqs = [...config.faqs];
                                newFaqs[i].a = e.target.value;
                                setConfig({...config, faqs: newFaqs});
                              }}
                              placeholder="Resposta"
                              className="w-full text-xs text-gray-500 outline-none focus:border-[#FF8C00]"
                            />
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400">Título Seção Benefícios</label>
                            <input 
                              type="text" 
                              value={config.featuresTitle} 
                              onChange={e => setConfig({...config, featuresTitle: e.target.value})}
                              className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400">Label Benefícios (Pequeno)</label>
                            <input 
                              type="text" 
                              value={config.featuresLabel || 'Benefícios'} 
                              onChange={e => setConfig({...config, featuresLabel: e.target.value})}
                              className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                            />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                         <label className="text-[10px] font-black uppercase text-gray-400">Gerenciar Lista de Benefícios</label>
                         <button 
                           onClick={() => setConfig({...config, features: [...(config.features || []), { title: 'Novo Benefício', desc: 'Descrição do benefício', icon: 'Gift' }]})}
                           type="button"
                           className="text-[10px] font-black text-[#FF8C00] uppercase hover:underline cursor-pointer"
                         >
                           + Adicionar Benefício
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(config.features || []).map((feat, i) => (
                          <div key={i} className="p-4 border border-gray-100 rounded-2xl space-y-3 relative group bg-gray-50/30">
                            <button 
                              onClick={() => setConfig({...config, features: config.features.filter((_, idx) => idx !== i)})}
                              type="button"
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[8px] font-black uppercase text-gray-400">Título</label>
                                <input 
                                  type="text" 
                                  value={feat.title} 
                                  onChange={e => {
                                    const newFeats = [...config.features];
                                    newFeats[i] = { ...newFeats[i], title: e.target.value };
                                    setConfig({...config, features: newFeats});
                                  }}
                                  placeholder="Nome do Benefício"
                                  className="w-full text-xs font-bold border-b border-gray-100 pb-1 outline-none focus:border-[#FF8C00] bg-transparent"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-gray-400">Ícone</label>
                                <select
                                  value={feat.icon || 'Gift'}
                                  onChange={e => {
                                    const newFeats = [...config.features];
                                    newFeats[i] = { ...newFeats[i], icon: e.target.value };
                                    setConfig({...config, features: newFeats});
                                  }}
                                  className="w-full text-xs font-bold border-b border-gray-100 pb-1 outline-none focus:border-[#FF8C00] bg-transparent cursor-pointer"
                                >
                                  <option value="Gift">Presente (Gift)</option>
                                  <option value="Bike">Moto (Bike)</option>
                                  <option value="ShieldCheck">Escudo (ShieldCheck)</option>
                                  <option value="CreditCard">Cartão (CreditCard)</option>
                                  <option value="Users">Usuários (Users)</option>
                                  <option value="Settings">Engrenagem (Settings)</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-gray-400">Descrição</label>
                              <textarea 
                                rows={2}
                                value={feat.desc} 
                                onChange={e => {
                                  const newFeats = [...config.features];
                                  newFeats[i] = { ...newFeats[i], desc: e.target.value };
                                  setConfig({...config, features: newFeats});
                                }}
                                placeholder="Descreva o benefício"
                                className="w-full text-xs text-gray-500 outline-none focus:border-[#FF8C00] bg-transparent"
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
                         <LayoutGrid className="w-5 h-5 text-[#FF8C00]" />
                         <span className="text-sm font-black uppercase tracking-widest">Fotos da Galeria de Modelos</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-gray-400">Rifa Tradicional</span>
                            <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden relative group border-2 border-gray-100">
                               <img src={config.modeloTradicionalImage || 'https://images.unsplash.com/photo-1518131394553-c510306126be?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-2">
                                  <input type="file" onChange={e => handleFileUpload(e, 'modeloTradicionalImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  <span className="text-[10px] text-white uppercase font-black">Mudar Foto</span>
                                  {config.modeloTradicionalImage && (
                                    <button onClick={(e) => { e.stopPropagation(); setConfig({...config, modeloTradicionalImage: ''}); }} className="relative z-10 text-[8px] bg-red-500 text-white px-2 py-1 rounded font-black">RESTATURAR PADRÃO</button>
                                  )}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-gray-400">Chá de Bebê</span>
                            <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden relative group border-2 border-gray-100">
                               <img src={config.modeloChadeBebeImage || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-2">
                                  <input type="file" onChange={e => handleFileUpload(e, 'modeloChadeBebeImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  <span className="text-[10px] text-white uppercase font-black">Mudar Foto</span>
                                  {config.modeloChadeBebeImage && (
                                    <button onClick={(e) => { e.stopPropagation(); setConfig({...config, modeloChadeBebeImage: ''}); }} className="relative z-10 text-[8px] bg-red-500 text-white px-2 py-1 rounded font-black">RESTATURAR PADRÃO</button>
                                  )}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-gray-400">Modelo Personalizado</span>
                            <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden relative group border-2 border-gray-100">
                               <img src={config.modeloPersonalizadoImage || 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-2">
                                  <input type="file" onChange={e => handleFileUpload(e, 'modeloPersonalizadoImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  <span className="text-[10px] text-white uppercase font-black">Mudar Foto</span>
                                  {config.modeloPersonalizadoImage && (
                                    <button onClick={(e) => { e.stopPropagation(); setConfig({...config, modeloPersonalizadoImage: ''}); }} className="relative z-10 text-[8px] bg-red-500 text-white px-2 py-1 rounded font-black">RESTATURAR PADRÃO</button>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase text-gray-400">Depoimentos (Testimonials)</label>
                        <button 
                          onClick={() => setConfig({...config, testimonials: [...(config.testimonials || []), { name: 'Cliente', role: 'Rifeiro', content: 'Incrível!' }]})}
                          className="text-[10px] font-black text-[#FF8C00] uppercase hover:underline"
                        >
                          + Adicionar Depoimento
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {config.testimonials?.map((t, i) => (
                          <div key={i} className="p-4 border border-gray-100 rounded-2xl space-y-3 relative group">
                            <button 
                              onClick={() => setConfig({...config, testimonials: config.testimonials.filter((_, idx) => idx !== i)})}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <input 
                              type="text" 
                              value={t.name} 
                              onChange={e => {
                                const newTest = [...config.testimonials];
                                newTest[i].name = e.target.value;
                                setConfig({...config, testimonials: newTest});
                              }}
                              placeholder="Nome"
                              className="w-full text-sm font-bold border-b border-gray-50 pb-2 outline-none focus:border-[#FF8C00]"
                            />
                            <input 
                              type="text" 
                              value={t.role} 
                              onChange={e => {
                                const newTest = [...config.testimonials];
                                newTest[i].role = e.target.value;
                                setConfig({...config, testimonials: newTest});
                              }}
                              placeholder="Cargo/Role"
                              className="w-full text-[10px] font-black uppercase text-gray-400 outline-none focus:border-[#FF8C00]"
                            />
                            <textarea 
                              rows={2}
                              value={t.content} 
                              onChange={e => {
                                const newTest = [...config.testimonials];
                                newTest[i].content = e.target.value;
                                setConfig({...config, testimonials: newTest});
                              }}
                              placeholder="Conteúdo"
                              className="w-full text-xs text-gray-500 outline-none focus:border-[#FF8C00]"
                            />
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="pt-4">
                      <button 
                        onClick={handleUpdateConfig}
                        disabled={saving}
                        className="w-full bg-[#FF8C00] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#E67E22] transition-all flex items-center justify-center gap-2"
                      >
                         {saving && <RefreshCw className="w-5 h-5 animate-spin" />}
                         SALVAR TODAS AS ALTERAÇÕES
                      </button>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                      <LayoutGrid className="w-5 h-5 text-[#FF8C00]" />
                      <h3 className="text-xl font-black text-gray-950">Configurações do Carrossel</h3>
                    </div>

                    {/* Toggle Ativar/Desativar Carrossel */}
                    <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                       <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-gray-700 font-sans">Ativar Carrossel</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase block font-sans">Girar slides automaticamente</span>
                       </div>
                       <input 
                         type="checkbox" 
                         checked={config.carouselActive !== false} 
                         onChange={e => setConfig({...config, carouselActive: e.target.checked})}
                         className="w-5 h-5 rounded accent-[#FF8C00] cursor-pointer"
                       />
                    </div>

                    {/* Toggles slides */}
                    <div className="space-y-2 text-left">
                       <label className="text-[10px] font-black uppercase text-gray-400 block text-left font-sans">Exibição de Slides</label>
                       <div className="grid grid-cols-2 gap-2">
                         <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                           <span className="text-xs font-bold text-gray-700">Rifas</span>
                           <input 
                             type="checkbox" 
                             checked={config.carouselShowRifas !== false} 
                             onChange={e => setConfig({...config, carouselShowRifas: e.target.checked})}
                             className="w-4 h-4 rounded accent-[#FF8C00] cursor-pointer"
                           />
                         </div>
                         <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                           <span className="text-xs font-bold text-gray-700">Bolão</span>
                           <input 
                             type="checkbox" 
                             checked={config.carouselShowBolao !== false} 
                             onChange={e => setConfig({...config, carouselShowBolao: e.target.checked})}
                             className="w-4 h-4 rounded accent-[#FF8C00] cursor-pointer"
                           />
                         </div>
                       </div>
                    </div>

                    {/* Ordem dos Slides */}
                    <div className="space-y-1 text-left">
                       <label className="text-[10px] font-black uppercase text-gray-400 font-sans">Ordem dos Slides</label>
                       <select 
                         value={JSON.stringify(config.carouselOrder || ['rifas', 'bolao'])} 
                         onChange={e => setConfig({...config, carouselOrder: JSON.parse(e.target.value)})}
                         className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold text-xs cursor-pointer bg-white"
                       >
                         <option value={JSON.stringify(['rifas', 'bolao'])}>1. Rifas — 2. Bolão</option>
                         <option value={JSON.stringify(['bolao', 'rifas'])}>1. Bolão — 2. Rifas</option>
                       </select>
                    </div>

                    {/* Tempo de transição */}
                    <div className="space-y-3 text-left">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 font-sans">Tempo de Transição</label>
                          <select 
                            value={[3, 5, 8, 10, 15].includes(Number(config.carouselTransitionTime || 5)) ? String(config.carouselTransitionTime || 5) : 'custom'} 
                            onChange={e => {
                              const val = e.target.value;
                              if (val !== 'custom') {
                                setConfig({...config, carouselTransitionTime: Number(val)});
                              } else {
                                setConfig({...config, carouselTransitionTime: 12});
                              }
                            }}
                            className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold text-xs cursor-pointer bg-white"
                          >
                            <option value="3">3 Segundos</option>
                            <option value="5">5 Segundos</option>
                            <option value="8">8 Segundos</option>
                            <option value="10">10 Segundos</option>
                            <option value="15">15 Segundos</option>
                            <option value="custom">Valor Personalizado</option>
                          </select>
                       </div>

                       {/* Custom Time Field */}
                       {(![3, 5, 8, 10, 15].includes(Number(config.carouselTransitionTime || 5))) && (
                         <div className="space-y-1 animate-in fade-in slide-in-from-top-1 text-left">
                            <label className="text-[9px] font-black uppercase text-gray-400 font-sans">Segundos Personalizado</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min={1}
                                max={300}
                                value={config.carouselTransitionTime || 5} 
                                onChange={e => setConfig({...config, carouselTransitionTime: Math.max(1, Number(e.target.value))})}
                                className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-mono font-bold text-xs"
                              />
                              <span className="text-xs text-gray-400 font-bold uppercase font-sans">s</span>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-gray-900">Créditos Rodapé</h3>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Texto do Rodapé</label>
                      <input 
                        type="text" 
                        value={config.footerText} 
                        onChange={e => setConfig({...config, footerText: e.target.value})}
                        className="w-full border border-gray-100 p-3 rounded-2xl outline-none focus:border-[#FF8C00] font-bold"
                      />
                   </div>
                </div>
             </div>
          </div>
        )}
        {activeTab === 'trash' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                  <button
                    onClick={() => setTrashActiveTab('users')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${trashActiveTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Usuários
                  </button>
                  <button
                    onClick={() => setTrashActiveTab('raffles')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${trashActiveTab === 'raffles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Rifas
                  </button>
                  <button
                    onClick={() => setTrashActiveTab('boloes')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${trashActiveTab === 'boloes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Bolões
                  </button>
                </div>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={trashSearchQuery}
                    onChange={(e) => setTrashSearchQuery(e.target.value)}
                    placeholder="Pesquisar na lixeira (Nome, CPF, E-mail...)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-[#FF8C00] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {trashActiveTab === 'users' ? (
                        <>
                          <th className="px-6 py-5">Usuário</th>
                          <th className="px-6 py-5">Documento</th>
                          <th className="px-6 py-5">Data Exclusão</th>
                          <th className="px-6 py-5">Responsável</th>
                          <th className="px-6 py-5 text-center">Ação</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-5">Nome</th>
                          <th className="px-6 py-5">Proprietário</th>
                          <th className="px-6 py-5">Documento</th>
                          <th className="px-6 py-5">Data Exclusão</th>
                          <th className="px-6 py-5">Responsável</th>
                          <th className="px-6 py-5 text-center">Ação</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(trashActiveTab === 'users' ? deletedUsers : trashActiveTab === 'raffles' ? deletedRifas : deletedBoloes)
                      .filter(item => {
                        const q = trashSearchQuery.toLowerCase();
                        if (!q) return true;
                        const nome = (item.nome || item.usuario || '').toLowerCase();
                        const doc = (item.documento || item.organizerCpf || '').toLowerCase();
                        const email = (item.email || '').toLowerCase();
                        const whatsapp = (item.whatsapp || '').toLowerCase();
                        const owner = users.find(u => u.id === item.ownerId);
                        const ownerName = (owner?.nome || '').toLowerCase();

                        return nome.includes(q) || doc.includes(q) || email.includes(q) || whatsapp.includes(q) || ownerName.includes(q);
                      })
                      .map(item => (
                        <tr key={item.id} className="text-xs font-bold text-gray-600 hover:bg-gray-50/50 transition-colors">
                          {trashActiveTab === 'users' ? (
                            <>
                              <td className="px-6 py-4">
                                <span className="text-gray-900 block">{item.nome}</span>
                                <span className="text-[10px] text-gray-400">@{item.usuario}</span>
                              </td>
                              <td className="px-6 py-4 font-mono text-[10px]">{formatDocumento(item.documento)}</td>
                              <td className="px-6 py-4">
                                <span className="block">{new Date(item.deletedAt).toLocaleDateString()}</span>
                                <span className="text-[10px] text-gray-400">{new Date(item.deletedAt).toLocaleTimeString()}</span>
                              </td>
                              <td className="px-6 py-4 text-[#FF8C00]">@{item.deletedBy}</td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 text-gray-900">{item.nome}</td>
                              <td className="px-6 py-4">
                                {users.find(u => u.id === item.ownerId)?.nome || 'Admin'}
                              </td>
                              <td className="px-6 py-4 font-mono text-[10px]">
                                {formatDocumento(users.find(u => u.id === item.ownerId)?.documento || item.organizerCpf)}
                              </td>
                              <td className="px-6 py-4">
                                <span className="block">{new Date(item.deletedAt).toLocaleDateString()}</span>
                                <span className="text-[10px] text-gray-400">{new Date(item.deletedAt).toLocaleTimeString()}</span>
                              </td>
                              <td className="px-6 py-4 text-[#FF8C00]">@{item.deletedBy}</td>
                            </>
                          )}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRestore(trashActiveTab === 'users' ? 'usuarios' : trashActiveTab === 'raffles' ? 'rifas' : 'boloes', item.id)}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 mx-auto cursor-pointer font-black uppercase text-[10px]"
                            >
                              <Undo2 className="w-3.5 h-3.5" /> Restaurar
                            </button>
                          </td>
                        </tr>
                      ))}

                    {(trashActiveTab === 'users' ? deletedUsers : trashActiveTab === 'raffles' ? deletedRifas : deletedBoloes).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                          Sua lixeira está vazia para esta categoria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8">
                <div className="space-y-1">
                   <h2 className="text-xl font-bold">Perfil do Administrador</h2>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mude seus dados de acesso ao Painel Master</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Nome</label>
                      <input 
                        type="text" 
                        value={profileForm.nome}
                        onChange={e => setProfileForm({...profileForm, nome: e.target.value})}
                        className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Usuário / Login</label>
                      <input 
                        type="text" 
                        value={profileForm.usuario}
                        onChange={e => setProfileForm({...profileForm, usuario: e.target.value})}
                        className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Nova Senha (deixe em branco para não alterar)</label>
                      <input 
                        type="password" 
                        value={profileForm.password}
                        onChange={e => setProfileForm({...profileForm, password: e.target.value})}
                        className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                       />
                    </div>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-sm tracking-widest hover:bg-[#FF8C00] transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                 </form>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8">
                 <div className="space-y-1">
                    <h2 className="text-xl font-bold">Mensagens de Segurança</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Configure o aviso individual para contas suspensas ou banidas</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Mensagem de Suspensão (Login Bloqueado)</label>
                       <textarea 
                         rows={4}
                         required
                         value={config?.mensagemSuspenso || ''}
                         onChange={e => config && setConfig({...config, mensagemSuspenso: e.target.value})}
                         className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                         placeholder="Ex: Sua conta foi suspensa temporariamente por auditoria de segurança..."
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Mensagem de Banimento (Login Bloqueado)</label>
                       <textarea 
                         rows={4}
                         required
                         value={config?.mensagemBanido || ''}
                         onChange={e => config && setConfig({...config, mensagemBanido: e.target.value})}
                         className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                         placeholder="Ex: Sua conta foi suspensa temporariamente por descumprimento das regras..."
                       />
                    </div>
                    <button 
                      onClick={handleUpdateConfig}
                      disabled={saving}
                      className="w-full bg-[#FF8C00] text-white font-black py-5 rounded-2xl shadow-xl uppercase text-xs tracking-widest hover:bg-[#E67E22] transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Gravando...' : 'Salvar Mensagens de Segurança'}
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8 lg:col-span-2">
                 <div className="space-y-1">
                    <h2 className="text-xl font-bold">Logomarca Global do Site</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Envie a marca global que aparecerá no topo do site e na tela de login</p>
                 </div>
                 
                 {config && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2 space-y-4">
                         <p className="text-xs text-gray-500 font-bold leading-relaxed">
                           A logomarca enviada substitui o ícone padrão no cabeçalho público e na tela de suporte/login, garantindo uma identidade visual unificada e profissional em toda a plataforma.
                         </p>
                         <div className="flex gap-4">
                            {config.platformLogo && (
                              <button
                                onClick={() => setConfig({ ...config, platformLogo: '' })}
                                type="button"
                                className="bg-red-50 text-red-500 font-black px-6 py-3 rounded-xl text-xs uppercase hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Remover Logo
                              </button>
                            )}
                            <button
                              onClick={handleUpdateConfig}
                              disabled={saving}
                              type="button"
                              className="bg-gray-900 hover:bg-[#FF8C00] hover:text-white text-white font-black px-6 py-3 rounded-xl text-xs uppercase transition-colors cursor-pointer"
                            >
                              {saving ? 'Gravando...' : 'Salvar Configurações de Logo'}
                            </button>
                         </div>
                      </div>
                      
                      <div className="h-40 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50/50">
                        {config.platformLogo ? (
                          <div className="p-4 flex flex-col items-center">
                            <img src={config.platformLogo} className="max-h-24 object-contain mb-2" alt="Logo" />
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Logomarca Ativa</span>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <input 
                              type="file" 
                              onChange={e => handleFileUpload(e, 'platformLogo')} 
                              className="absolute inset-0 opacity-0 cursor-pointer animate-fade-in" 
                            />
                            <span className="text-[10px] font-black text-[#FF8C00] uppercase block mb-1">Upload Nova Logo</span>
                            <span className="text-[8px] text-gray-400 font-bold block">Formatos: PNG, JPG (Max 5MB)</span>
                          </div>
                        )}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        )}
        {activeTab === 'trash' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-2">
                {(['users', 'raffles', 'boloes'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setTrashActiveTab(tab); setTrashSearchQuery(''); }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      trashActiveTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {tab === 'users' && 'Usuários'}
                    {tab === 'raffles' && 'Rifas'}
                    {tab === 'boloes' && 'Bolões'}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar na lixeira..."
                  value={trashSearchQuery}
                  onChange={e => setTrashSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border-none p-3 pl-10 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-[#FF8C00]/20"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 italic">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {trashActiveTab === 'users' && (
                        <>
                          <th className="px-6 py-4">Usuário</th>
                          <th className="px-6 py-4">Documento</th>
                          <th className="px-6 py-4">Data Exclusão</th>
                          <th className="px-6 py-4">Responsável</th>
                        </>
                      )}
                      {trashActiveTab === 'raffles' && (
                        <>
                          <th className="px-6 py-4">Rifa</th>
                          <th className="px-6 py-4">Proprietário</th>
                          <th className="px-6 py-4">Data Exclusão</th>
                          <th className="px-6 py-4">Responsável</th>
                        </>
                      )}
                      {trashActiveTab === 'boloes' && (
                        <>
                          <th className="px-6 py-4">Bolão</th>
                          <th className="px-6 py-4">Proprietário</th>
                          <th className="px-6 py-4">Data Exclusão</th>
                          <th className="px-6 py-4">Responsável</th>
                        </>
                      )}
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(() => {
                      const list = trashActiveTab === 'users' ? deletedUsers : trashActiveTab === 'raffles' ? deletedRifas : deletedBoloes;
                      const filtered = list.filter((item: any) => {
                        const q = trashSearchQuery.toLowerCase();
                        if (trashActiveTab === 'users') {
                          return (item.nome || '').toLowerCase().includes(q) || (item.documento || '').includes(q) || (item.email || '').toLowerCase().includes(q);
                        } else {
                          return (item.nome || '').toLowerCase().includes(q) || (item.ownerId || '').includes(q);
                        }
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-xs font-black text-gray-300 uppercase italic">
                              Nenhum registro encontrado na lixeira.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((item: any) => (
                        <tr key={item.id} className="text-xs font-bold text-gray-600 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-black text-gray-900">{item.nome}</div>
                            {item.usuario && <div className="text-[10px] text-gray-400">@{item.usuario}</div>}
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px]">
                            {trashActiveTab === 'users' ? formatDocumento(item.documento) : (
                               users.find(u => u.id === item.ownerId)?.documento ? formatDocumento(users.find(u => u.id === item.ownerId)?.documento) : '---'
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-400 font-mono">
                            {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '---'}
                          </td>
                          <td className="px-6 py-4 text-gray-500 italic">
                            {item.deletedBy || 'Sistema'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRestore(trashActiveTab === 'users' ? 'usuarios' : trashActiveTab === 'raffles' ? 'rifas' : 'boloes', item.id)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer"
                            >
                              Restaurar
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateRaffleModal isAdminAction={true} onClose={() => { setShowCreateModal(false); loadDashboard(); }} />
      )}

      {/* Security Confirmation Modal */}
      {deleteConfirmModal && (
        <SecurityConfirm
          itemName={deleteConfirmModal.itemName}
          onConfirm={executeDelete}
          onCancel={() => setDeleteConfirmModal(null)}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-wide">Editar Cliente</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Atualize as credenciais e parâmetros deste cliente de rifas</p>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    value={editingUser.nome}
                    onChange={e => setEditingUser({ ...editingUser, nome: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Usuário / Login</label>
                  <input
                    required
                    type="text"
                    value={editingUser.usuario}
                    onChange={e => setEditingUser({ ...editingUser, usuario: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">E-mail</label>
                  <input
                    required
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={editingUser.documento || ''}
                    onChange={e => setEditingUser({ ...editingUser, documento: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={editingUser.whatsapp || ''}
                    onChange={e => setEditingUser({ ...editingUser, whatsapp: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                    placeholder="Ex: (87) 99999-9999"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Taxa de Serviço (%)</label>
                  <input
                    type="number"
                    value={editingUser.customFee || 0}
                    onChange={e => setEditingUser({ ...editingUser, customFee: Number(e.target.value) })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status da Conta</label>
                  <select
                    value={editingUser.status || 'ativo'}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-black bg-white"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="suspenso">Suspenso</option>
                    <option value="banido">Banido</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Redefinir Senha do Cliente</label>
                <input
                  type="password"
                  value={editingUser.password || ''}
                  onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="Deixe em branco para manter a senha atual"
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-colors text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gray-900 hover:bg-[#FF8C00] hover:text-white text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-xs uppercase disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmModal && (
        <SecurityConfirm
          itemType={deleteConfirmModal.type}
          itemName={deleteConfirmModal.itemName}
          onConfirm={executeDelete}
          onCancel={() => setDeleteConfirmModal(null)}
        />
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal && rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-red-100/70 rounded-full flex items-center justify-center text-red-500 mb-2">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">
                Rejeitar Solicitação de Saque
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                Ação Irreversível - ID: <span className="font-mono text-gray-600">{rejectionModal.withdrawalId}</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Selecione o Motivo de Rejeição</label>
                <select
                  value={rejectionModal.motivo}
                  onChange={e => setRejectionModal({ ...rejectionModal, motivo: e.target.value })}
                  className="w-full border border-gray-150 p-3 rounded-xl outline-none focus:border-red-500 font-bold text-sm text-gray-800"
                >
                  <option value="Dados incorretos">Dados incorretos</option>
                  <option value="Chave PIX inválida">Chave PIX inválida</option>
                  <option value="Documentação pendente">Documentação pendente</option>
                  <option value="Outro">Outro motivo...</option>
                </select>
              </div>

              {rejectionModal.motivo === 'Outro' && (
                <div className="space-y-1-new animate-in slide-in-from-top-1 duration-100">
                  <label className="text-[10px] font-black uppercase text-red-500">Justificativa Detalhada *</label>
                  <input
                    type="text"
                    placeholder="Especifique o motivo da rejeição..."
                    value={rejectionModal.outroMotivo}
                    onChange={e => setRejectionModal({ ...rejectionModal, outroMotivo: e.target.value })}
                    className="w-full border border-red-200 p-3 rounded-xl outline-none focus:border-red-500 font-medium text-sm text-gray-800"
                    maxLength={150}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRejectionModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors text-xs uppercase cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectionBase}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs uppercase cursor-pointer text-center"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
