import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Eye, Layout, Baby, Bike, Car, Settings2, Trophy } from 'lucide-react';
import { RaffleType, RaffleTheme } from '../../types';

interface RaffleModel {
  id: RaffleType;
  name: string;
  theme: RaffleTheme;
  description: string;
  features: string[];
  icon: React.ReactNode;
  image: string;
  defaultSlots: string;
  defaultPrice: string;
}

interface ModelGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (model: RaffleModel) => void;
  config?: any;
}

export const ModelGallery: React.FC<ModelGalleryProps> = ({ isOpen, onClose, onSelectModel, config }) => {
  if (!isOpen) return null;

  const MODELS: RaffleModel[] = [
    {
      id: 'tradicional',
      name: 'Rifa Tradicional',
      theme: 'default',
      description: 'O modelo clássico onde todos os números têm o mesmo valor.',
      features: ['Valor único por cota', 'Fácil de gerenciar', 'Interface limpa'],
      icon: <Trophy className="w-6 h-6" />,
      image: config?.modeloTradicionalImage || 'https://images.unsplash.com/photo-1518131394553-c510306126be?auto=format&fit=crop&q=80&w=600',
      defaultSlots: '100',
      defaultPrice: '20'
    },
    {
      id: 'diaper',
      name: 'Chá de Fraldas',
      theme: 'baby',
      description: 'Ideal para eventos de bebê com possibilidade de valores diferentes por faixa.',
      features: ['Valores por faixas', 'Tema infantil incluso', 'Mensagens personalizadas'],
      icon: <Baby className="w-6 h-6" />,
      image: config?.modeloChadeBebeImage || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600',
      defaultSlots: '100',
      defaultPrice: '20'
    },
    {
      id: 'custom',
      name: 'Modelo Personalizado',
      theme: 'default',
      description: 'Total liberdade para configurar números, valores e temas.',
      features: ['Qualquer quantidade de cotas', 'Cores personalizadas', 'Regras flexíveis'],
      icon: <Settings2 className="w-6 h-6" />,
      image: config?.modeloPersonalizadoImage || 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
      defaultSlots: '100',
      defaultPrice: '10'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 shadow-2xl backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        </button>

        <div className="p-6 sm:p-10 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden shrink-0">
             {config?.platformLogo ? (
               <img src={config.platformLogo} className="w-full h-full object-contain" alt="Logo" />
             ) : (
               <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <Layout className="w-7 h-7 sm:w-8 sm:h-8" />
               </div>
             )}
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Galeria de Modelos</h2>
            <p className="text-xs sm:text-base text-gray-500">Escolha o ponto de partida ideal para o seu sorteio.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MODELS.map((model) => (
              <motion.div 
                key={model.id}
                whileHover={{ y: -5 }}
                className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/30 truncate">
                      <Eye className="w-4 h-4" /> Pré-visualizar
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur shadow-lg rounded-2xl">
                    {model.icon}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{model.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{model.description}</p>
                  </div>

                  <div className="space-y-2 mb-8">
                    {model.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-[#FF8C00]" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onSelectModel(model)}
                    className="mt-auto w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-[#FF8C00] transition-colors flex items-center justify-center gap-2"
                  >
                    Usar Este Modelo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
