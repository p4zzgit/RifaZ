import React from 'react';
import { Award } from 'lucide-react';
import { GlobalConfig } from '../../types';

export const Footer: React.FC<{ config: GlobalConfig; onSupportClick: () => void }> = ({ config, onSupportClick }) => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-auto h-10 flex items-center justify-center transition-all">
              {config.platformLogo ? (
                <img src={config.platformLogo} alt="Logo" className="h-full max-w-[150px] object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#FF8C00] flex items-center justify-center text-white shadow-md">
                  <Award className="w-5 h-5" />
                </div>
              )}
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              {config.platformName}
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            A plataforma líder para criação de rifas personalizadas. Do chá de fraldas a grandes sorteios beneficentes.
          </p>
        </div>

        <div className="flex flex-col md:items-end justify-center gap-2">
          <button 
            onClick={onSupportClick}
            className="text-xs font-black text-[#FF8C00] hover:underline cursor-pointer uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20"
          >
            Suporte Técnico / Ticket
          </button>
          <p className="text-xs text-gray-500">
            {config.footerText || `© ${new Date().getFullYear()} ${config.platformName}. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  );
};
