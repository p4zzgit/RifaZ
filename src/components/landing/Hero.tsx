import React, { useState } from 'react';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { GlobalConfig } from '../../types';
import { ModelGallery } from './ModelGallery';

interface HeroProps {
  config: GlobalConfig;
  onCreateClick: () => void;
  onCreateBolaoClick?: () => void;
  onSelectModel?: (model: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onCreateClick, onCreateBolaoClick, onSelectModel }) => {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-white">
        {/* Decorative Background */}
        <div className="absolute top-1/4 -left-36 w-80 h-80 rounded-full bg-primary-custom/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-primary-custom/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {config.heroBadge && (
            <div className="inline-flex items-center gap-2 bg-primary-custom/5 text-primary-custom border border-primary-custom/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>{config.heroBadge}</span>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight px-2">
              {config.heroTitle}
            </h1>
            <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
              {config.heroSub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onCreateClick}
              className="w-full sm:w-auto bg-primary-custom hover-bg-primary-custom text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide group"
            >
              <span>{config.heroButtonText || 'Criar Rifa Agora'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowGallery(true)}
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{config.secondaryButtonText || 'Ver Modelos'}</span>
              <Trophy className="w-4 h-4 text-primary-custom group-hover:scale-110 transition-transform" />
            </button>
            {onCreateBolaoClick && (
              <button 
                onClick={onCreateBolaoClick}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide group"
              >
                <span>Criar um Bolão</span>
                <Trophy className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      <ModelGallery 
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        config={config}
        onSelectModel={(model) => {
          setShowGallery(false);
          onSelectModel?.(model);
        }}
      />
    </>
  );
};
