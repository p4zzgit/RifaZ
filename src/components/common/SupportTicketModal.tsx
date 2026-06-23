import React, { useState } from 'react';
import { MessageSquare, X, ShieldCheck, Loader2 } from 'lucide-react';
import { validateCPF, validateCNPJ, maskCPF, maskCNPJ, cleanDocumento } from '../../utils/documentValidation';

interface SupportTicketModalProps {
  onClose: () => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    documento: '',
    documentoTipo: 'CPF' as 'CPF' | 'CNPJ',
    subject: 'Suporte Geral',
    message: ''
  });

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleDocumentoChange = (val: string) => {
    const cleaned = cleanDocumento(val);
    const masked = form.documentoTipo === 'CPF' ? maskCPF(cleaned) : maskCNPJ(cleaned);
    setForm({ ...form, documento: masked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.name || !form.email || !form.message || !form.documento) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const cleanedDoc = cleanDocumento(form.documento);
    if (form.documentoTipo === 'CPF' && !validateCPF(cleanedDoc)) {
      setError('O CPF informado é inválido. Verifique os números.');
      return;
    }
    if (form.documentoTipo === 'CNPJ' && !validateCNPJ(cleanedDoc)) {
      setError('O CNPJ informado é inválido. Verifique os números.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { fsSetDocument, initializeFirebaseClient, isFirebaseEnabled } = await import('../../firebase');
      await initializeFirebaseClient();
      
      if (isFirebaseEnabled()) {
        const ticketId = `ticket_${Date.now()}`;
        await fsSetDocument('suporte', ticketId, {
          ...form,
          status: 'novo',
          createdAt: new Date().toISOString()
        });
        setSuccess(true);
      } else {
        throw new Error('Serviço de suporte indisponível momentaneamente.');
      }
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
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Ticket Enviado!</h2>
          <p className="text-sm text-gray-500 font-bold leading-relaxed">
            Recebemos sua solicitação de suporte. Nossa equipe analisará os dados e entrará em contato via WhatsApp ou E-mail o mais breve possível.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all cursor-pointer"
          >
            Entendi, Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl relative my-8 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">Suporte Técnico</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Abertura de Ticket de Atendimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Completo *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={inputClasses(form.name)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">E-mail de Contato *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className={inputClasses(form.email)}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">WhatsApp *</label>
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
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Assunto</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full border border-gray-200 p-3.5 rounded-2xl outline-none text-sm focus:border-[#FF8C00] bg-white cursor-pointer font-bold"
                >
                  <option value="Suporte Geral">Suporte Geral</option>
                  <option value="Dúvida sobre Rifas">Dúvida sobre Rifas</option>
                  <option value="Problemas com Pagamento">Problemas com Pagamento</option>
                  <option value="Liberação de Saque">Liberação de Saque</option>
                  <option value="Denúncia / Segurança">Denúncia / Segurança</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-4 pt-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 pb-2">Validação de Identidade (Obrigatório)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tipo de Doc</label>
                      <select
                        value={form.documentoTipo}
                        onChange={e => {
                          const tipo = e.target.value as 'CPF' | 'CNPJ';
                          setForm({...form, documentoTipo: tipo, documento: ''});
                        }}
                        className="w-full border border-gray-200 p-3.5 rounded-2xl outline-none text-sm focus:border-[#FF8C00] bg-white cursor-pointer font-bold"
                      >
                        <option value="CPF">Pessoa Física (CPF)</option>
                        <option value="CNPJ">Pessoa Jurídica (CNPJ)</option>
                      </select>
                   </div>
                   <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nº do Documento ({form.documentoTipo}) *</label>
                      <input
                        required
                        type="text"
                        value={form.documento}
                        onChange={e => handleDocumentoChange(e.target.value)}
                        className={`${inputClasses(form.documento)} font-mono`}
                        placeholder={form.documentoTipo === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                      />
                   </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mensagem Detalhada *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full border border-gray-200 p-4 rounded-2xl outline-none text-sm focus:border-[#FF8C00] resize-none font-medium h-32"
                  placeholder="Descreva seu problema ou dúvida com o máximo de detalhes possível..."
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-[#FF8C00] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#E67E22] transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Solicitação de Suporte'}
            </button>
            <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-tighter">Sua privacidade é importante. Seus dados estão protegidos sob nossa política de segurança.</p>
          </form>
        </div>
      </div>
    </div>
  );
};
