import React, { useState, useEffect } from 'react';
import { Award, Loader2, ArrowLeft } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const { fsGetGlobalConfig, isFirebaseEnabled, initializeFirebaseClient } = await import('../firebase');
        await initializeFirebaseClient();
        if (isFirebaseEnabled()) {
          const config = await fsGetGlobalConfig();
          if (config && config.platformLogo) {
            setLogoUrl(config.platformLogo);
          }
        }
      } catch (e) {
        console.error('Auth config load failed:', e);
      }
    }
    init();
  }, []);

  // Ticket Modal States
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subject: 'Acesso à conta',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { fsQueryCollection, isFirebaseEnabled, initializeFirebaseClient } = await import('../firebase');
      await initializeFirebaseClient();
      
      if (isFirebaseEnabled()) {
        const users = await fsQueryCollection('usuarios', 'username', '==', form.username);
        const user = users[0];
        
        if (user && user.password === form.password) { // ⚠️ Note: For static PoC only
          localStorage.setItem('token', 'static-session-token');
          onLoginSuccess('static-session-token', user);
          return;
        }
      }
      
      throw new Error('Credenciais inválidas ou serviço indisponível');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitting(true);
    try {
      console.log('Ticket request (Static/Firebase mode):', ticketForm);
      // In a real static app, we would use a service like Formspree or EmailJS
      // For now, we simulate success
      await new Promise(r => setTimeout(r, 1000));
      setTicketSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Houve um problema. Tente novamente.');
    } finally {
      setTicketSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 sm:p-10 space-y-8">
           <div className="text-center space-y-3">
              {logoUrl ? (
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-4 overflow-hidden border border-gray-100 p-2">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-4">
                  <Award className="w-8 h-8" />
                </div>
              )}
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Acesso à Plataforma</h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Painel de Controle</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Usuário / E-mail</label>
                 <input 
                  required
                  type="text" 
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})}
                  className="w-full border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#FF8C00] text-sm transition-all font-bold"
                  placeholder="Seu usuário ou e-mail"
                 />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Sua Senha</label>
                 <input 
                  required
                  type="password" 
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#FF8C00] text-sm transition-all font-bold"
                  placeholder="••••••••"
                 />
              </div>

              {error && <p className="text-red-500 text-[10px] font-black bg-red-50 p-3 rounded-xl uppercase tracking-wider">{error}</p>}

              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setTicketForm({ name: '', email: '', whatsapp: '', subject: 'Acesso à conta', message: '' });
                      setTicketSuccess(false);
                      setShowTicketModal(true);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-gray-200 cursor-pointer"
                  >
                    Ticket (Suporte)
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => window.location.hash = '#/?create=true'}
                  className="w-full bg-[#FFF5EB] hover:bg-[#FFEADA] text-[#FF8C00] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-orange-100 cursor-pointer"
                >
                  Crie sua Rifa
                </button>
              </div>
           </form>

           <div className="text-center pt-2">
              <button 
                onClick={() => window.location.hash = '#/'}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#FF8C00] transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                Voltar à Página Inicial
              </button>
           </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
             <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden">
                   {logoUrl ? (
                     <img src={logoUrl} className="w-full h-full object-contain" alt="Logo" />
                   ) : (
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white shadow-lg">
                       <Award className="w-6 h-6" />
                     </div>
                   )}
                </div>
                <div>
                   <h2 className="text-xl sm:text-2xl font-black text-gray-900">Suporte Ticket</h2>
                   <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assistência Administrativa</p>
                </div>
             </div>
            
            {ticketSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-xl font-black text-gray-900">Solicitação Enviada!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto font-bold leading-relaxed">
                  Seu ticket foi recebido com sucesso. 
                  Resolveremos sua solicitação em breve. Retornaremos através do seu e-mail ou número de contato informado.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="mt-6 bg-gray-900 text-white font-black px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors text-xs uppercase cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Seu Nome Completo</label>
                  <input
                    required
                    type="text"
                    value={ticketForm.name}
                    onChange={e => setTicketForm({...ticketForm, name: e.target.value})}
                    placeholder="Ex: Geovanne Paz"
                    className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm transition-all font-bold"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">E-mail de Contato</label>
                    <input
                      required
                      type="email"
                      value={ticketForm.email}
                      onChange={e => setTicketForm({...ticketForm, email: e.target.value})}
                      placeholder="seuemail@exemplo.com"
                      className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">WhatsApp de Contato</label>
                    <input
                      required
                      type="text"
                      value={ticketForm.whatsapp}
                      onChange={e => setTicketForm({...ticketForm, whatsapp: e.target.value})}
                      placeholder="DDD + Número"
                      className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Assunto da Mensagem</label>
                  <select
                    value={ticketForm.subject}
                    onChange={e => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-black bg-white"
                  >
                    <option value="Acesso à conta">Dificuldade em acessar a minha conta</option>
                    <option value="Financeiro">Dúvida / Problema no Financeiro ou Pix</option>
                    <option value="Criação de Rifa">Ajuda com a criação da minha Rifa</option>
                    <option value="Outro">Outros assuntos gerais</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mensagem explicativa</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketForm.message}
                    onChange={e => setTicketForm({...ticketForm, message: e.target.value})}
                    placeholder="Descreva detalhadamente sua dúvida ou problema..."
                    className="w-full border border-gray-100 p-3 rounded-xl outline-none focus:border-[#FF8C00] text-sm font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-colors text-xs uppercase cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="bg-gray-900 hover:bg-[#FF8C00] hover:text-white text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-xs uppercase disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {ticketSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Ticket'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
