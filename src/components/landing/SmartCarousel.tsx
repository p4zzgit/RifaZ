import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Sparkles, 
  Calendar, 
  Users, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Target,
  Dribbble,
  Coins
} from 'lucide-react';
import { GlobalConfig } from '../../types';

interface SmartCarouselProps {
  config: GlobalConfig;
  onCreateClick: () => void;
  onCreateBolaoClick: () => void;
}

export const SmartCarousel: React.FC<SmartCarouselProps> = ({ config, onCreateClick, onCreateBolaoClick }) => {
  // Parse configurations with fallback defaults
  const isCarouselActive = config.carouselActive !== false;
  const transitionTimeInSeconds = config.carouselTransitionTime || 5;
  const slideOrder = config.carouselOrder || ['rifas', 'bolao'];
  const showRifas = config.carouselShowRifas !== false;
  const showBolao = config.carouselShowBolao !== false;

  // Build active slide keys based on configuration order
  const activeSlideKeys = slideOrder.filter(key => {
    if (key === 'rifas') return showRifas;
    if (key === 'bolao') return showBolao;
    return false;
  });

  // If no slides are active, fallback to showing 'rifas'
  const slides = activeSlideKeys.length > 0 ? activeSlideKeys : ['rifas'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart autoplay timer whenever the current slide index, interval, or state changes
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isCarouselActive && slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % slides.length);
      }, transitionTimeInSeconds * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isCarouselActive, slides.length, transitionTimeInSeconds]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
  };

  const currentSlideKey = slides[currentIndex];

  // Helper colors
  const secColor = config.secondaryColor || '#FF8C00';

  return (
    <section className="py-12 sm:py-24 bg-gray-50 border-y border-gray-100 relative overflow-hidden" id="smart-showcase-carousel">
      {/* Subtle patterns */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-custom/3 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative">
          <AnimatePresence mode="wait">
            {currentSlideKey === 'rifas' ? (
              <motion.div
                key="rifas-slide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Description and Benefits Box */}
                <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 bg-primary-custom/10 text-primary-custom border border-primary-custom/20 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sua Rifa Premium</span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                      Campanhas de Rifa de Alta Conversão
                    </h2>
                    <p className="text-xs sm:text-base text-gray-500 font-bold leading-relaxed">
                      Gerencie suas rifas de forma 100% profissional e customizável. Nossa interface permite que seus compradores escolham cotas em segundos.
                    </p>
                  </div>

                  {/* List of custom benefits for Rifas */}
                  <div className="space-y-2 sm:space-y-3 pt-2">
                    {[
                      { icon: <Coins className="w-5 h-5 text-primary-custom" />, label: "Pagamentos via PIX automático" },
                      { icon: <ShieldCheck className="w-5 h-5 text-green-500" />, label: "Bilhetes por WhatsApp" },
                      { icon: <Target className="w-5 h-5 text-blue-500" />, label: "Cotas Premiadas Ativas" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="p-1 rounded-lg bg-gray-50 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="text-[10px] sm:text-sm font-black text-gray-700 uppercase">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onCreateClick}
                      className="w-full sm:w-auto bg-primary-custom hover-bg-primary-custom text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-primary-custom/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide group min-h-[48px]"
                    >
                      <span>Criar sua Rifa Agora</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Mockup Showcase Card - Dynamic Interactive Table of Numbers */}
                <div className="lg:col-span-7 flex items-center justify-center w-full">
                  <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,0.12)] mx-2 flex flex-col h-fit max-h-[500px] lg:max-h-[550px]">
                    {/* Browser Control Mock-Bar */}
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 max-w-xs mx-auto bg-white border border-gray-200 rounded py-0.5 px-3 text-[8px] text-gray-400 text-center font-mono truncate">
                        {config.platformName.toLowerCase().replace(/\s/g, '')}.com.br/sorteio-da-fe
                      </div>
                    </div>

                    <div className="p-0">
                      {/* Banner display */}
                      <div 
                        className="relative h-24 sm:h-32 flex items-end p-4 sm:p-6 border-b border-gray-100 overflow-hidden" 
                        style={{ background: `linear-gradient(135deg, ${secColor}ee, ${secColor}bb)` }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                        <div className="relative z-10 text-white space-y-0.5 sm:space-y-1">
                          <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase text-white tracking-widest leading-none">Ativa</span>
                          <h3 className="text-sm sm:text-2xl font-black text-white">Meu Grande Sorteio</h3>
                          <p className="text-[9px] sm:text-xs text-white opacity-90 font-bold">Participe e leve o prêmio!</p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-hidden">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="flex justify-between items-center bg-gray-50/50 p-4 sm:p-4 rounded-2xl border border-gray-100 gap-2 shadow-sm"
                        >
                          <div>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 block tracking-widest">Cota</span>
                            <p className="text-xl sm:text-2xl font-black text-gray-900">R$ 10,00</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-tight">Restam <span className="text-primary-custom">87%</span></span>
                              <motion.div 
                                animate={{ opacity: [1, 0.5, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1.5 h-1.5 rounded-full bg-primary-custom" 
                              />
                            </div>
                            <div className="w-24 sm:w-32 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '13%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-primary-custom h-full" 
                              />
                            </div>
                          </div>
                        </motion.div>
 
                        {/* Beautiful grid of simulation tickets */}
                        <div className="space-y-3 pb-4">
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 block tracking-widest px-1"
                          >
                            Escolha seus números
                          </motion.span>
                          <div className="grid grid-cols-8 xs:grid-cols-10 gap-1 sm:gap-1.5">
                            {Array.from({ length: 40 }).map((_, i) => {
                              const isReserved = i === 4 || i === 12 || i === 19 || i === 31 || i === 38;
                              const isSelected = hoveredIdx === i || i === 7 || i === 23;
                              
                              return (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    delay: 0.3 + (i % 10) * 0.05 + Math.floor(i / 10) * 0.05,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                  }}
                                  whileHover={{ scale: isReserved ? 1 : 1.1, zIndex: 10 }}
                                  whileTap={{ scale: isReserved ? 1 : 0.9 }}
                                  onMouseEnter={() => setHoveredIdx(i)}
                                  onMouseLeave={() => setHoveredIdx(null)}
                                  className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-[8px] sm:text-xs font-black border transition-all cursor-pointer ${
                                    isReserved 
                                    ? 'bg-gray-50 text-gray-200 border-transparent cursor-not-allowed opacity-50' 
                                    : isSelected
                                    ? 'bg-primary-custom text-white border-primary-custom shadow-lg shadow-primary-custom/20'
                                    : 'bg-white border-gray-100 text-gray-600 hover:border-primary-custom/50 hover:text-primary-custom shadow-sm'
                                  }`}
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bolao-slide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Description and Benefits Box - Sport/Bolão Theme */}
                <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <Dribbble className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                    <span>Bolão 100% Online</span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                      Fature com Bolões Esportivos
                    </h2>
                    <p className="text-xs sm:text-base text-gray-500 font-bold leading-relaxed">
                      Crie bolões profissionais para futebol. Reúna sua galera e gerencie a pontuação com facilidade.
                    </p>
                  </div>

                  {/* List of custom benefits for Bolão */}
                  <div className="space-y-2 sm:space-y-3 pt-2">
                    {[
                      { icon: <Trophy className="w-5 h-5 text-amber-500" />, title: "Crie seu Bolão", desc: "Configure ligas e regras" },
                      { icon: <Users className="w-5 h-5 text-indigo-500" />, title: "Convide Galera", desc: "Compartilhe via WhatsApp" },
                      { icon: <Coins className="w-5 h-5 text-emerald-500" />, title: "PIX Automático", desc: "Adesões sem burocracia" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm align-start">
                        <div className="p-1 rounded-lg bg-gray-50 flex items-center justify-center h-8 my-auto min-w-[32px]">
                          {item.icon}
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-[10px] sm:text-sm font-black text-gray-900 uppercase leading-none">{item.title}</h4>
                          <p className="text-[8px] sm:text-[11px] text-gray-400 font-bold uppercase">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onCreateBolaoClick}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide group min-h-[48px]"
                    >
                      <span>Criar um Bolão</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Column - Beautiful Sports Sweeps/Bolão Vector UI Mockup */}
                <div className="lg:col-span-7 flex items-center justify-center w-full">
                  <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,0.12)] mx-2 flex flex-col h-fit max-h-[500px] lg:max-h-[550px]">
                    {/* Browser Control Mock-Bar */}
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 max-w-xs mx-auto bg-white border border-gray-200 rounded py-0.5 px-3 text-[8px] text-gray-400 text-center font-mono truncate">
                        {config.platformName.toLowerCase().replace(/\s/g, '')}.com.br/bolao-campeao
                      </div>
                    </div>

                    {/* Sports Dark Green/Stadium Themed Graphic Card (No photos used, purely CSS vectors) */}
                    <div className="bg-gray-950 text-white p-4 sm:p-8 space-y-5 sm:space-y-6 flex-1 relative border-b border-gray-900 group overflow-hidden">
                      {/* Grid lines styling back layer */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-3">
                        <div className="space-y-1">
                          <span className="text-[8px] sm:text-[9px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/30">Ao Vivo</span>
                          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-emerald-400" />
                            <span>Bolão Brasileirão</span>
                          </h3>
                        </div>
                        <div className="bg-white/10 p-3 sm:p-4 rounded-xl border border-white/10 text-left sm:text-right backdrop-blur-md">
                          <span className="text-[8px] sm:text-[9px] block font-black text-gray-400 uppercase tracking-widest">Prêmio Estudo</span>
                          <span className="text-lg sm:text-xl font-black text-emerald-400">R$ 5.000,00</span>
                        </div>
                      </div>

                      <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider relative z-10 flex items-center gap-2 px-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Rodada 38 • Final Temporada</span>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-emerald-400">128 participantes</span>
                      </p>

                      {/* Interactive Section containing Placar & Palpites + Classification */}
                      <div className="space-y-3 sm:space-y-4 relative z-10 pb-4">
                        {/* Soccer Match Row */}
                        {[
                          { teamA: 'FLAMENGO', flagA: '🇧🇷', scoreA: '2', scoreB: '1', teamB: 'PALMEIRAS', flagB: '🌴', guess: '2 x 1', hit: true },
                          { teamA: 'VASCO', flagA: '⚓', scoreA: '1', scoreB: '0', teamB: 'BOTAFOGO', flagB: '⭐', guess: '1 x 0', hit: true }
                        ].map((match, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: 0.4 + (i * 0.15),
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 transition-all shadow-lg backdrop-blur-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <motion.span 
                                  animate={{ scale: [1, 1.1, 1] }} 
                                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                  className="text-xl sm:text-2xl"
                                >
                                  {match.flagA}
                                </motion.span>
                                <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-wider text-center">{match.teamA}</span>
                              </div>
                              
                              <div className="flex flex-col items-center gap-1.5 px-3">
                                <div className="flex gap-2 sm:gap-4 items-center">
                                  <span className="bg-emerald-500 text-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-lg sm:text-xl font-black rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">{match.scoreA}</span>
                                  <span className="text-gray-600 font-black text-[10px]">X</span>
                                  <span className="bg-white/10 text-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-lg sm:text-xl font-black rounded-lg border border-white/10">{match.scoreB}</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <motion.span 
                                  animate={{ scale: [1, 1.1, 1] }} 
                                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 + 1.5 }}
                                  className="text-xl sm:text-2xl"
                                >
                                  {match.flagB}
                                </motion.span>
                                <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-wider text-center">{match.teamB}</span>
                              </div>
                            </div>

                            <div className="bg-white/5 p-2.5 px-3 rounded-lg flex items-center justify-between border border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block leading-none">Palpite</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-[#FF8C00]">{match.guess}</span>
                                  {match.hit && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 1 + i * 0.2 }}
                                    >
                                      <Check className="w-3 h-3 text-emerald-500 bg-emerald-500/20 p-0.5 rounded-full" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                              <motion.span 
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-[8px] font-black uppercase tracking-widest text-emerald-400"
                              >
                                {match.hit ? '+3 PONTOS' : 'PENDENTE'}
                              </motion.span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {slides.length > 1 && (
            <>
              {/* Prev Arrow */}
              <button
                onClick={handlePrev}
                type="button"
                className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-gray-100 shadow-md hover:bg-gray-50 hover:scale-105 transition-all text-gray-500 hover:text-gray-900 z-20 cursor-pointer hidden sm:flex"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Arrow */}
              <button
                onClick={handleNext}
                type="button"
                className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-gray-100 shadow-md hover:bg-gray-50 hover:scale-105 transition-all text-gray-500 hover:text-gray-900 z-20 cursor-pointer hidden sm:flex"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Carousel Indicators / Navigation Dots */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2.5 mt-10">
            {slides.map((slideKey, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slideKey}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    isActive ? 'w-8 bg-primary-custom' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
