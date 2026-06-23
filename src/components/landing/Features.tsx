import React from 'react';
import { GlobalConfig } from '../../types';
import { Gift, Bike, ShieldCheck, CreditCard, Users, Settings } from 'lucide-react';

export const Features: React.FC<{ config: GlobalConfig }> = ({ config }) => {
  const icons: Record<string, any> = {
    'Gift': Gift,
    'Bike': Bike,
    'ShieldCheck': ShieldCheck,
    'CreditCard': CreditCard,
    'Users': Users,
    'Settings': Settings
  };

  return (
    <section className="bg-white py-20 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs text-primary-custom font-black uppercase tracking-widest block">{config.featuresLabel || 'Benefícios'}</span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {config.featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.features.map((f, i) => {
            const Icon = icons[f.icon || 'Gift'] || Gift;
            return (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="w-12 h-12 bg-primary-custom/5 text-primary-custom rounded-2xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
