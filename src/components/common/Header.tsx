import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import { GlobalConfig } from '../../types';

interface HeaderProps {
  config: GlobalConfig;
  user?: any;
  onLoginClick: () => void;
  onCreateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, user, onLoginClick, onCreateClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-auto h-12 flex items-center justify-center transition-all">
            {config.platformLogo ? (
              <img src={config.platformLogo} alt="Logo" className="h-full max-w-[180px] object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-custom flex items-center justify-center text-white shadow-md">
                <Award className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <span className="text-xl font-black text-gray-900 tracking-tight block">
              {(config.platformName || '').split(' ')[0]}{' '}
              <span className="text-primary-custom">{(config.platformName || '').split(' ').slice(1).join(' ')}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'super_admin' ? (
             <button
               id="header-admin-panel"
               onClick={() => window.location.hash = '#/admin'}
               className="text-xs font-black bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-xl transition-all hover-bg-primary-custom flex items-center gap-2 shrink-0"
             >
               <Lock className="w-3.5 h-3.5" />
               <span className="hidden xs:inline">Painel Master</span>
               <span className="xs:hidden">Master</span>
             </button>
          ) : user ? (
            <button
               id="header-user-panel"
               onClick={() => window.location.hash = '#/panel'}
               className="text-xs font-black bg-gray-50 text-gray-900 px-3 sm:px-4 py-2 rounded-xl border border-gray-100 hover:border-primary-custom transition-all shrink-0"
             >
               Meu Painel
             </button>
          ) : (
            <button
               id="header-login-btn"
               onClick={onLoginClick}
               className="flex text-sm font-bold text-gray-600 hover:text-primary-custom px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer items-center gap-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
          <button
            id="header-create-btn"
            onClick={onCreateClick}
            className="hidden sm:flex bg-primary-custom hover-bg-primary-custom text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 items-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Crie sua Rifa</span>
          </button>
        </div>
      </div>
    </header>
  );
};
