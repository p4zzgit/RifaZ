import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Trash2, X, Lock, Loader2 } from 'lucide-react';

interface SecurityConfirmProps {
  itemType: 'USER' | 'RAFFLE' | 'BOLAO' | 'WITHDRAWAL' | 'FINANCE' | 'TICKET';
  itemName: string;
  onConfirm: (password: string, reason: string) => Promise<void>;
  onCancel: () => void;
}

export const SecurityConfirm: React.FC<SecurityConfirmProps> = ({ itemType, itemName, onConfirm, onCancel }) => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmWord, setConfirmWord] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    USER: 'Usuário',
    RAFFLE: 'Rifa',
    BOLAO: 'Bolão',
    WITHDRAWAL: 'Solicitação de Saque',
    FINANCE: 'Registro Financeiro',
    TICKET: 'Ticket de Suporte'
  };

  const handleFinalConfirm = async () => {
    if (!password) {
      setError('A senha é obrigatória para esta operação.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(password, reason);
    } catch (err: any) {
      setError(err.message || 'Falha na validação de segurança.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-gray-900">Tem certeza que deseja excluir este item?</h3>
              <p className="text-sm text-gray-500 font-medium px-4">
                <span className="font-black text-gray-900 mt-2 block">{itemName}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={onCancel}
                className="py-3.5 rounded-2xl border border-gray-200 font-black text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="py-3.5 rounded-2xl bg-[#FF8C00] text-white font-black shadow-lg hover:bg-[#E67E22] transition-all cursor-pointer"
              >
                Sim, continuar
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-gray-900 leading-tight">Remoção de Registro</h3>
              <p className="text-sm text-gray-500 font-medium px-4 leading-relaxed">
                Esta ação removerá o item da visualização dos usuários e participantes. Deseja prosseguir?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3.5 rounded-2xl border border-gray-200 font-black text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-black shadow-xl hover:bg-red-700 transition-all cursor-pointer"
              >
                Sim, prosseguir
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mx-auto border border-gray-200">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-gray-900">Última Confirmação</h3>
              <p className="text-sm text-gray-500 font-medium px-4">
                Para confirmar, digite abaixo a palavra: <span className="font-black text-gray-950 uppercase">CONFIRMAR</span>
              </p>
            </div>
            <div className="space-y-1 text-left px-4">
                <input
                  type="text"
                  value={confirmWord}
                  onChange={e => setConfirmWord(e.target.value)}
                  className="w-full border border-gray-200 p-4 rounded-xl text-center font-black focus:border-[#FF8C00] outline-none uppercase"
                  placeholder="..."
                />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onCancel}
                className="py-3.5 rounded-2xl border border-gray-200 font-black text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                disabled={confirmWord.toUpperCase() !== 'CONFIRMAR'}
                onClick={() => setStep(4)}
                className="py-3.5 rounded-2xl bg-black text-white font-black shadow-2xl hover:bg-gray-900 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
              <Lock className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-gray-900">Autenticação de Segurança</h3>
              <p className="text-sm text-gray-500 font-medium px-4">
                Para finalizar, digite sua senha de administrador.
              </p>
            </div>
            
            <div className="px-4 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Motivo (Opcional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-sm font-medium focus:border-[#FF8C00] outline-none"
                  placeholder="Ex: irregularidade..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Senha de Administrador</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleFinalConfirm()}
                  className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:border-red-500 transition-all text-center font-bold tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[11px] font-black bg-red-50 p-3 rounded-xl mx-4 border border-red-100">{error}</p>}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="py-3.5 rounded-2xl border border-gray-200 font-black text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={loading}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-black shadow-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 relative shadow-2xl border border-white/20">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {renderStep()}
        
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Protocolo de Segurança Ativo</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-[#FF8C00]' : 'w-2 bg-gray-100'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
