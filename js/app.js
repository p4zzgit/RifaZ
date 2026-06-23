
import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { HashRouter, Routes, Route, Navigate } from 'https://esm.sh/react-router-dom@6?alias=react:preact/compat,react-dom:preact/compat';

const html = htm.bind(h);

import { LandingPage } from './components/LandingPage.js';
import { AuthView } from './components/AuthView.js';
import { ClientDashboard } from './components/ClientDashboard.js';

import { SuperAdminDashboard } from './components/SuperAdminDashboard.js';

import { PublicRaffleView } from './components/PublicRaffleView.js';
import { PublicBolaoView } from './components/PublicBolaoView.js';

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.hash = '/login';
  };

  return html`
    <${HashRouter}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
        <${Routes}>
          <${Route} path="/" element=${html`<${LandingPage} />`} />
          <${Route} path="/rifa/:slug" element=${html`<${PublicRaffleView} />`} />
          <${Route} path="/bolao/:slug" element=${html`<${PublicBolaoView} />`} />
          
          <${Route} path="/login" element=${html`<${AuthView} onLogin=${(u) => setUser(u)} />`} />
          <${Route} path="/cadastro" element=${html`<${AuthView} isRegister onLogin=${(u) => setUser(u)} />`} />

          <${Route} 
            path="/admin" 
            element=${user?.role === 'super_admin' ? html`<${SuperAdminDashboard} user=${user} onLogout=${handleLogout} />` : html`<${Navigate} to="/login" />`} 
          />
          <${Route} 
            path="/dashboard" 
            element=${user ? html`<${ClientDashboard} user=${user} onLogout=${handleLogout} />` : html`<${Navigate} to="/login" />`} 
          />
          
          <${Route} path="*" element=${html`<${Navigate} to="/" />`} />
        <//>
      </div>
    <//>
  `;
}
