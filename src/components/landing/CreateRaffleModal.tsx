import React, { useState, useEffect } from 'react';
import { Award, Loader2, ShieldCheck, X, Plus } from 'lucide-react';
import { RaffleTheme, RaffleType, PricingTier, GlobalConfig } from '../../types';

interface CreateRaffleModalProps {
  config: GlobalConfig;
  onClose: () => void;
  isOpen?: boolean; // For backward compatibility if needed, though we use conditional in LandingPage
  initialData?: {
    id: any;
    theme: RaffleTheme;
    defaultSlots: string;
    defaultPrice: string;
    name: string;
  };
  isAdminAction?: boolean;
}

export const CreateRaffleModal: React.FC<CreateRaffleModalProps> = ({ config, onClose, initialData, isAdminAction }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    usuario: '',
    documento: '',
    raffleName: '',
    descricao: '',
    tipo: (initialData?.id || 'tradicional') as RaffleType,
    slots: initialData?.defaultSlots || '100',
    customSlots: '',
    price: initialData?.defaultPrice || '10',
    slug: '',
    password: '',
    tema: (initialData?.theme || 'default') as RaffleTheme,
    corSecundaria: '#FF8C00',
    fotoPrincipal: [] as string[],
    faixas: [] as PricingTier[]
  });

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        tipo: initialData.id as RaffleType,
        tema: initialData.theme as RaffleTheme,
        slots: initialData.defaultSlots,
        price: initialData.defaultPrice,
        raffleName: initialData.name === 'Modelo Personalizado' ? '' : initialData.name
      }));
    }
  }, [initialData]);

  const addFaixa = () => {
    const lastFaixa = form.faixas[form.faixas.length - 1];
    if (lastFaixa && (!lastFaixa.end || lastFaixa.end <= lastFaixa.start || !lastFaixa.price)) {
      setError('Por favor, preencha todos os campos da faixa anterior antes de adicionar uma nova.');
      return;
    }
    
    const nextStart = lastFaixa ? lastFaixa.end + 1 : 1;
    setError(null);

    setForm(prev => ({
      ...prev,
      faixas: [...prev.faixas, { start: nextStart, end: 0, price: 0, color: prev.corSecundaria }]
    }));
  };

  const removeFaixa = (index: number) => {
    setForm(prev => ({
      ...prev,
      faixas: prev.faixas.filter((_, i) => i !== index)
    }));
  };

  const updateFaixa = (index: number, field: keyof PricingTier, value: number) => {
    setForm(prev => ({
      ...prev,
      faixas: prev.faixas.map((f, i) => i === index ? { ...f, [field]: value } : f)
    }));
  };

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatDocumento = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      // CPF
      let masked = digits;
      if (digits.length > 3) masked = digits.slice(0, 3) + '.' + digits.slice(3);
      if (digits.length > 6) masked = masked.slice(0, 7) + '.' + masked.slice(7);
      if (digits.length > 9) masked = masked.slice(0, 11) + '-' + masked.slice(11);
      return masked.slice(0, 14);
    } else {
      // CNPJ
      let masked = digits;
      if (digits.length > 2) masked = digits.slice(0, 2) + '.' + digits.slice(2);
      if (digits.length > 5) masked = masked.slice(0, 6) + '.' + masked.slice(6);
      if (digits.length > 8) masked = masked.slice(0, 10) + '/' + masked.slice(10);
      if (digits.length > 12) masked = masked.slice(0, 15) + '-' + masked.slice(15);
      return masked.slice(0, 18);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'fotoPrincipal') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 3 files
    const filesToUpload = Array.from(files).slice(0, 3 - form.fotoPrincipal.length);
    if (filesToUpload.length === 0) {
       alert("Você já atingiu o limite de 3 fotos.");
       return;
    }

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append('image', file as any);

      try {
        const headers: Record<string, string> = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('api/upload', {
          method: 'POST',
          headers,
          body: formData
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha no upload do servidor');
        }
        const data = await res.json();
        if (data.url) {
          setForm(prev => ({ 
            ...prev, 
            fotoPrincipal: [...prev.fotoPrincipal, data.url] 
          }));
        }
      } catch (err: any) {
        console.error('Upload error', err);
        alert('Erro ao enviar imagem: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Basic validity check
    const isSlotsValid = form.slots === 'custom' ? !!form.customSlots : !!form.slots;
    const isFaixasValid = form.tipo === 'tradicional' ? true : form.faixas.length > 0 && form.faixas.every(f => f.start > 0 && f.end > f.start && f.price > 0);
    const isPriceValid = form.tipo === 'diaper' ? true : !!form.price;
    const isBasicInfoValid = form.name && form.whatsapp && form.documento && form.usuario && form.raffleName && form.descricao && isPriceValid && form.slug && form.password && (isAdminAction ? true : (form.fotoPrincipal && form.fotoPrincipal.length > 0));

    if (!isBasicInfoValid || !isSlotsValid || !isFaixasValid) {
      setError(isAdminAction 
        ? 'Por favor, preencha todos os campos obrigatórios (foto não é obrigatória para o administrador).' 
        : 'Por favor, preencha todos os campos obrigatórios e envie pelo menos 1 foto.'
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        slots: form.slots === 'custom' ? form.customSlots : form.slots,
        email: `${form.usuario}@placeholder.com` // Ensure backend compatibility
      };
      const res = await fetch('api/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar rifa');
      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (value: string) => `
    w-full border p-3.5 rounded-2xl outline-none text-sm transition-all
    ${submitted && !value ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-[#FF8C00]'}
  `;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Rifa Criada com Sucesso!</h2>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm space-y-2 text-left">
            <p><span className="text-gray-400 font-bold uppercase text-[10px]">Link da Rifa:</span> <br/> 
               <span className="font-mono text-[#FF8C00]">{window.location.origin}/{success.rifa.slug}</span></p>
            <p><span className="text-gray-400 font-bold uppercase text-[10px]">Usuário:</span> <br/> 
               <span className="font-mono">{success.user.usuario}</span></p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all"
          >
            Acessar Painel Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] shadow-2xl relative my-2 sm:my-8 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col">
        {/* Header Section (Fixed) */}
        <div className="p-4 sm:p-8 pb-4 flex items-start justify-between border-b border-gray-50 bg-white z-10 sticky top-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden">
               {config?.platformLogo ? (
                 <img src={config.platformLogo} className="w-full h-full object-contain" alt="Logo" />
               ) : (
                 <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Award className="w-6 h-6" />
                 </div>
               )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Crie sua Rifa</h2>
              <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest leading-none sm:leading-normal">Sorteio Independente e Profissional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 pt-6">
          <form id="create-raffle-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Fotos da Rifa (Até 3){isAdminAction ? ' - Opcional' : ' - Mínimo 1'}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {form.fotoPrincipal.map((url, i) => (
                      <div key={i} className="h-32 border-2 border-gray-100 rounded-2xl relative overflow-hidden bg-gray-50 group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, fotoPrincipal: prev.fotoPrincipal.filter((_, idx) => idx !== i) }))}
                          className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    {form.fotoPrincipal.length < 3 && (
                      <div className={`
                        h-32 border-2 border-dashed rounded-2xl flex items-center justify-center relative overflow-hidden transition-all
                        ${submitted && !isAdminAction && form.fotoPrincipal.length === 0 ? 'border-red-500 bg-red-50/20' : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50'}
                      `}>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'fotoPrincipal')} 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <div className="text-center text-gray-400">
                          <Plus className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] font-black uppercase block">Add Foto</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Seu Nome Completo</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={inputClasses(form.name)}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">WhatsApp para Contato</label>
                <input
                  required
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => setForm({...form, whatsapp: formatWhatsApp(e.target.value)})}
                  className={`${inputClasses(form.whatsapp)} font-mono`}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">CPF ou CNPJ</label>
                <input
                  required
                  type="text"
                  value={form.documento}
                  onChange={e => setForm({...form, documento: formatDocumento(e.target.value)})}
                  className={`${inputClasses(form.documento)} font-mono`}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Usuário / Login</label>
                <input
                  required
                  type="text"
                  value={form.usuario}
                  onChange={e => setForm({...form, usuario: e.target.value.toLowerCase().replace(/\s+/g, '')})}
                  className={inputClasses(form.usuario)}
                  placeholder="ex: joaosilva"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Senha de Acesso</label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className={`${inputClasses(form.password)} font-mono pr-12`}
                    placeholder="Sua senha de acesso"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FF8C00] uppercase tracking-tighter opacity-50">
                    Visível
                  </div>
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="h-px bg-gray-100 my-2" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Nome da sua Rifa</label>
                <input
                  required
                  type="text"
                  value={form.raffleName}
                  onChange={e => setForm({...form, raffleName: e.target.value})}
                  className={inputClasses(form.raffleName)}
                  placeholder="Ex: Meu Chá de Fraldas"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Link da Rifa (Slug)</label>
                <input
                  required
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className={inputClasses(form.slug)}
                  placeholder="meu-cha-rifa"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black uppercase text-gray-400">Descrição da Rifa *</label>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">{form.descricao.length}/1200</span>
                </div>
                <textarea
                  required
                  maxLength={1200}
                  rows={3}
                  value={form.descricao}
                  onChange={e => setForm({...form, descricao: e.target.value.slice(0, 1200)})}
                  className={inputClasses(form.descricao)}
                  placeholder="Descreva os prêmios, regras, data do sorteio e informações adicionais da sua Rifa..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Qtd. de Cotas</label>
                <select
                  value={form.slots}
                  onChange={e => setForm({...form, slots: e.target.value})}
                  className="w-full border border-gray-200 p-3.5 rounded-2xl focus:border-[#FF8C00] outline-none text-sm bg-white"
                >
                  <option value="100">1 a 100</option>
                  <option value="500">1 a 500</option>
                  <option value="1000">1 a 1000</option>
                  <option value="custom">Personalizado...</option>
                </select>
              </div>

              {form.slots === 'custom' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black uppercase text-orange-500">Valor Personalizado (Máx 50.000)</label>
                  <input
                    required
                    type="number"
                    max="50000"
                    min="1"
                    value={form.customSlots}
                    onChange={e => setForm({...form, customSlots: e.target.value})}
                    className={`
                      w-full border-2 p-3.5 rounded-2xl outline-none text-sm bg-orange-50/30
                      ${submitted && !form.customSlots ? 'border-red-500' : 'border-orange-100 focus:border-[#FF8C00]'}
                    `}
                    placeholder="Qtd de cotas"
                  />
                </div>
              )}

              {form.tipo !== 'diaper' && (
                <div className="space-y-1 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black uppercase text-gray-400">Valor por Cota (R$)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    className={inputClasses(form.price)}
                    placeholder="0,00"
                    min="1"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Tipo de Rifa</label>
                <select 
                  value={form.tipo}
                  onChange={e => setForm({...form, tipo: e.target.value as RaffleType})}
                  className="w-full border border-gray-200 p-3.5 rounded-2xl focus:border-[#FF8C00] outline-none text-sm bg-white"
                >
                  <option value="tradicional">Rifa Tradicional</option>
                  <option value="diaper">Chá de Fraldas</option>
                  <option value="custom">Personalizada</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Escolha o Tema</label>
                <select 
                  value={form.tema}
                  onChange={e => setForm({...form, tema: e.target.value as RaffleTheme})}
                  className="w-full border border-gray-200 p-3.5 rounded-2xl focus:border-[#FF8C00] outline-none text-sm bg-white"
                >
                  <option value="default">Padrão</option>
                  <option value="baby">Bebê / Infantil</option>
                  <option value="moto">Motos / Esportivo</option>
                  <option value="car">Carros / Automotivo</option>
                  <option value="charity">Beneficente</option>
                </select>
              </div>

              {(form.tipo === 'diaper' || form.tipo === 'custom') && (
                <div className="md:col-span-2 space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-gray-400">Gerenciar Faixas de Valores</label>
                    <button 
                      type="button"
                      onClick={addFaixa}
                      className="text-[10px] font-black uppercase text-[#FF8C00] hover:underline"
                    >
                      + Adicionar Faixa
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {form.faixas.length === 0 && (
                      <div className="p-8 border-2 border-dashed border-gray-50 rounded-3xl text-center">
                        <p className="text-xs text-gray-400 font-medium">
                          {form.tipo === 'diaper' 
                            ? 'Configure as faixas de valores para o seu Chá de Fraldas.' 
                            : 'Nenhuma faixa configurada. A rifa usará o valor único por cota.'}
                        </p>
                      </div>
                    )}
                    {form.faixas.map((faixa, idx) => (
                      <div key={idx} className="flex gap-3 items-end animate-in fade-in slide-in-from-top-1">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Início</label>
                          <input 
                            type="number"
                            value={faixa.start}
                            onChange={e => updateFaixa(idx, 'start', parseInt(e.target.value))}
                            className="w-full border border-gray-100 p-2.5 rounded-xl text-xs outline-none focus:border-[#FF8C00]"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Fim</label>
                          <input 
                            type="number"
                            value={faixa.end || ''}
                            onChange={e => updateFaixa(idx, 'end', parseInt(e.target.value))}
                            className={`w-full border p-2.5 rounded-xl text-xs outline-none transition-all ${
                              (submitted || (idx < form.faixas.length - 1)) && (!faixa.end || faixa.end <= faixa.start)
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-100 focus:border-[#FF8C00]'
                            }`}
                          />
                        </div>
                        <div className="flex-[1.5] space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Valor (R$)</label>
                          <input 
                            type="number"
                            value={faixa.price || ''}
                            onChange={e => updateFaixa(idx, 'price', parseFloat(e.target.value))}
                            placeholder="0,00"
                            className={`w-full border p-2.5 rounded-xl text-xs outline-none transition-all ${
                              (submitted && !faixa.price) || (idx < form.faixas.length - 1 && !faixa.price)
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-100 focus:border-[#FF8C00]'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Cor</label>
                          <input 
                            type="color"
                            value={faixa.color || form.corSecundaria}
                            onChange={e => updateFaixa(idx, 'color' as any, e.target.value as any)}
                            className="w-10 h-[38px] border border-gray-100 p-1 rounded-xl cursor-pointer bg-white"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFaixa(idx)}
                          className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Cor de Destaque</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color"
                    value={form.corSecundaria}
                    onChange={e => setForm({...form, corSecundaria: e.target.value})}
                    className="w-16 h-[50px] border border-gray-200 p-1 rounded-2xl cursor-pointer bg-white"
                  />
                  <div className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Arraste para selecionar qualquer cor
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Minha Rifa'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
