
import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { ArrowLeft } from 'https://esm.sh/lucide-preact';

const html = htm.bind(h);

export function AuthView({ isRegister = false, onLogin }) {
  const [form, setForm] = useState({ username: '', password: '', nome: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { fsQueryCollection, fsSetDocument } = await import('../firebase.js');
      
      if (isRegister) {
        // Simple mock register
        const existing = await fsQueryCollection('usuarios', 'username', '==', form.username);
        if (existing.length > 0) throw new Error('Usuário já existe');
        
        const newUser = {
          ...form,
          id: 'u_' + Date.now(),
          status: 'ativo',
          saldo: 0,
          createdAt: new Date().toISOString()
        };
        await fsSetDocument('usuarios', newUser.id, newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        onLogin(newUser);
        window.location.hash = '/dashboard';
      } else {
        // Special case for admin/admin
        if (form.username === 'admin' && form.password === 'admin') {
           const adminUser = {
             id: 'admin',
             username: 'admin',
             nome: 'Administrador',
             role: 'super_admin',
             status: 'ativo'
           };
           localStorage.setItem('user', JSON.stringify(adminUser));
           onLogin(adminUser);
           window.location.hash = '/admin';
           return;
        }

        // Simple mock login
        const users = await fsQueryCollection('usuarios', 'username', '==', form.username);
        const user = users.find(u => u.password === form.password);
        
        if (!user) throw new Error('Credenciais inválidas');
        
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
        window.location.hash = user.role === 'super_admin' ? '/admin' : '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <button 
        onClick=${() => window.location.hash = '/'}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all group"
      >
        <${ArrowLeft} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </button>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
            <span className="text-white font-black text-3xl">R</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">${isRegister ? 'Criar Conta' : 'Boas-vindas!'}</h1>
          <p className="text-slate-500 text-sm font-medium">Acesse a plataforma de sorteios número 1.</p>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-4">
          ${isRegister && html`
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
                value=${form.nome}
                onInput=${e => setForm({ ...form, nome: e.target.value })}
              />
            </div>
          `}
          
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Usuário</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${form.username}
              onInput=${e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-slate-900"
              value=${form.password}
              onInput=${e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          ${error && html`<p className="text-red-500 text-xs font-bold text-center">${error}</p>`}

          <button 
            disabled=${loading}
            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            ${loading ? 'Processando...' : isRegister ? 'Criar Minha Conta' : 'Entrar na Plataforma'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick=${() => window.location.hash = isRegister ? '/login' : '/cadastro'}
            className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors"
          >
            ${isRegister ? 'Já tenho uma conta? Entrar' : 'Não tem conta? Cadastrar-se'}
          </button>
        </div>
      </div>
    </div>
  `;
}
