import React, { useState, useEffect } from 'react';
import { Trophy, Loader2, ShieldCheck, X, Upload, Calendar, DollarSign, Users, Award, AlertCircle } from 'lucide-react';
import { validateCPF, validateCNPJ, maskCPF, maskCNPJ, cleanDocumento } from '../../utils/documentValidation';

import { GlobalConfig } from '../../types';

interface CreateBolaoModalProps {
  config: GlobalConfig;
  onClose: () => void;
  isAdminAction?: boolean;
}

export const CreateBolaoModal: React.FC<CreateBolaoModalProps> = ({ config, onClose, isAdminAction }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    organizerName: '',
    whatsapp: '',
    email: '',
    documentoTipo: 'cpf' as 'cpf' | 'cnpj',
    organizerCpf: '',
    bolaoName: '',
    description: '',
    endDate: '',
    pricePerParticipant: '10',
    maxParticipants: '100',
    logoUrl: '',
    bannerUrl: '',
    username: '',
    password: '',
    championshipName: '',
    competitionName: ''
  });

  // Pre-fill some defaults
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30); // 30 days default
    const formattedDate = defaultDate.toISOString().split('T')[0];
    
    setForm(prev => ({
      ...prev,
      endDate: formattedDate,
      championshipName: 'Campeonato Brasileiro',
      competitionName: 'Futebol'
    }));
  }, []);

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleDocumentoChange = (value: string) => {
    const cleaned = cleanDocumento(value);
    const masked = form.documentoTipo === 'cpf' ? maskCPF(cleaned) : maskCNPJ(cleaned);
    setForm(prev => ({ ...prev, organizerCpf: masked }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'bannerUrl') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/upload', {
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
          [field]: data.url 
        }));
      }
    } catch (err: any) {
      console.error('Upload error', err);
      alert('Erro ao enviar imagem: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isBasicInfoValid = 
      form.organizerName && 
      form.whatsapp && 
      form.email && 
      form.organizerCpf && 
      form.bolaoName && 
      form.endDate && 
      form.pricePerParticipant && 
      form.maxParticipants && 
      form.username && 
      form.password && 
      form.championshipName && 
      form.competitionName;

    if (!isBasicInfoValid) {
      setError('Por favor, preencha todos os campos obrigatórios marcados com estrela (*).');
      return;
    }

    const cleanedDoc = cleanDocumento(form.organizerCpf);
    if (form.documentoTipo === 'cpf' && !validateCPF(cleanedDoc)) {
      setError('O CPF informado é inválido. Verifique os números.');
      return;
    }
    if (form.documentoTipo === 'cnpj' && !validateCNPJ(cleanedDoc)) {
      setError('O CNPJ informado é inválido. Verifique os números.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/boloes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar bolão');
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
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Bolão Configurado com Sucesso!</h2>
          
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-bold border border-emerald-100">
            ⚠️ IMPORTANTE: Como organizador, você também deve pagar sua cota para o bolão ser ativado publicamente!
          </div>

          {success.organizerPix && (
            <div className="space-y-4 border-y border-gray-100 py-6">
               <p className="text-[10px] font-black uppercase text-gray-400">Pague sua participação (R$ {parseFloat(form.pricePerParticipant).toFixed(2)})</p>
               {success.organizerPix.qrCode && (
                 <img src={`data:image/png;base64,${success.organizerPix.qrCode}`} className="w-40 h-40 object-contain mx-auto border border-gray-100 rounded-xl p-2 bg-white" />
               )}
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left font-mono text-[10px] break-all select-all flex items-center gap-2 justify-between">
                <span className="flex-1 overflow-hidden truncate">{success.organizerPix.copiaECola}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(success.organizerPix.copiaECola);
                    alert('PIX Copiado!');
                  }}
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700 font-bold uppercase shrink-0"
                >
                  Copiar
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm space-y-2 text-left">
            <p><span className="text-gray-400 font-bold uppercase text-[10px]">Página Pública (Acesso após pagamento):</span> <br/> 
               <span className="font-mono text-[#FF8C00] font-bold text-xs">{window.location.origin}/bolao/{success.bolao.slug}</span></p>
            <p><span className="text-gray-400 font-bold uppercase text-[10px]">Seu Usuário Master:</span> <br/> 
               <span className="font-mono text-xs">{success.user.usuario}</span></p>
          </div>

          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all cursor-pointer uppercase text-xs tracking-widest"
          >
            Acessar Painel / Login
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
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Trophy className="w-6 h-6" />
                 </div>
               )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Criar um Bolão</h2>
              <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest leading-none sm:leading-normal">Organize seu palpite esportivo profissional</p>
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
          <form id="create-bolao-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Media Uploads */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Logo do Bolão (Opcional)</label>
                <div className="flex items-center gap-4">
                  {form.logoUrl ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative group">
                      <img src={form.logoUrl} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm(p => ({ ...p, logoUrl: '' }))}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative hover:bg-gray-50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'logoUrl')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="text-[11px] text-gray-400 font-bold uppercase">PNG, JPG de Avatar</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Banner de Capa (Opcional)</label>
                <div className="flex items-center gap-4">
                  {form.bannerUrl ? (
                    <div className="w-32 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative group">
                      <img src={form.bannerUrl} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm(p => ({ ...p, bannerUrl: '' }))}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative hover:bg-gray-50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'bannerUrl')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Banner de Competição</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Dados do Organizador</p>
              </div>

              {/* Organizer fields */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Nome do Organizador *</label>
                <input
                  required
                  type="text"
                  value={form.organizerName}
                  onChange={e => setForm({...form, organizerName: e.target.value})}
                  className={inputClasses(form.organizerName)}
                  placeholder="Nome de quem gerencia"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">WhatsApp *</label>
                <input
                  required
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => setForm({...form, whatsapp: formatWhatsApp(e.target.value)})}
                  className={`${inputClasses(form.whatsapp)} font-mono`}
                  placeholder="(00) 90000-0000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">E-mail *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className={inputClasses(form.email)}
                  placeholder="Seu e-mail oficial"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Tipo de Documento *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, documentoTipo: 'cpf', organizerCpf: '' }))}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all border ${form.documentoTipo === 'cpf' ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  >
                    CPF
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, documentoTipo: 'cnpj', organizerCpf: '' }))}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all border ${form.documentoTipo === 'cnpj' ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  >
                    CNPJ
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">{form.documentoTipo === 'cpf' ? 'CPF' : 'CNPJ'} do Organizador *</label>
                <input
                  required
                  type="text"
                  value={form.organizerCpf}
                  onChange={e => handleDocumentoChange(e.target.value)}
                  className={`${inputClasses(form.organizerCpf)} font-mono`}
                  placeholder={form.documentoTipo === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>

              {/* Login block */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Login (Username) Desejado *</label>
                <input
                  required
                  type="text"
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/\s+/g, '')})}
                  className={inputClasses(form.username)}
                  placeholder="usuario_login"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Senha Desejada *</label>
                <input
                  required
                  type="text"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className={`${inputClasses(form.password)} font-mono`}
                  placeholder="Senha de acesso ao painel"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Dados do Bolão & Esportes</p>
              </div>

              {/* Sweepstake config fields */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Nome do Bolão *</label>
                <input
                  required
                  type="text"
                  value={form.bolaoName}
                  onChange={e => setForm({...form, bolaoName: e.target.value})}
                  className={inputClasses(form.bolaoName)}
                  placeholder="Ex: Bolão dos Amigos - Copa 2026"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Nome do Campeonato / Competição *</label>
                <input
                  required
                  type="text"
                  value={form.championshipName}
                  onChange={e => setForm({...form, championshipName: e.target.value})}
                  className={inputClasses(form.championshipName)}
                  placeholder="Ex: Camp. Brasileiro Série A"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Esporte / Categoria *</label>
                <input
                  required
                  type="text"
                  value={form.competitionName}
                  onChange={e => setForm({...form, competitionName: e.target.value})}
                  className={inputClasses(form.competitionName)}
                  placeholder="Ex: Futebol, Basquete..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Valor de Entrada por Participante *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-400">R$</span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.pricePerParticipant}
                    onChange={e => setForm({...form, pricePerParticipant: e.target.value})}
                    className={`${inputClasses(form.pricePerParticipant)} pl-10`}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Quantidade Máxima de Participantes *</label>
                <input
                  required
                  type="number"
                  min="2"
                  max="10000"
                  value={form.maxParticipants}
                  onChange={e => setForm({...form, maxParticipants: e.target.value})}
                  className={inputClasses(form.maxParticipants)}
                  placeholder="100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Data de Encerramento *</label>
                <input
                  required
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm({...form, endDate: e.target.value})}
                  className={inputClasses(form.endDate)}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Descrição / Regulamento Inicial</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-200 p-3.5 rounded-2xl outline-none text-sm focus:border-[#FF8C00] resize-none"
                  placeholder="Descreva as principais regras do seu bolão (acertos cheios, placares)..."
                />
              </div>

            </div>

            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Meu Bolão'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
