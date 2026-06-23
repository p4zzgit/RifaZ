import React, { useState, useEffect } from 'react';
import { GlobalConfig, RaffleTheme } from '../types';
import { Header } from './common/Header';
import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { Footer } from './common/Footer';
import { CreateRaffleModal } from './landing/CreateRaffleModal';
import { CreateBolaoModal } from './landing/CreateBolaoModal';
import { SupportTicketModal } from './common/SupportTicketModal';
import { SmartCarousel } from './landing/SmartCarousel';
import { Star, ChevronDown, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  user?: any;
}

const adjustColor = (col: string, amt: number) => {
  const usePound = col[0] === "#";
  const num = parseInt(col.slice(1), 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

export default function LandingPage({ onLoginClick, user }: LandingPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateBolaoModal, setShowCreateBolaoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [previewTheme, setPreviewTheme] = useState<RaffleTheme>('baby');
  const [previewColor, setPreviewColor] = useState('#FF8C00');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    // Open create modal if URL search parameter has create=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setShowCreateModal(true);
    }

    fetch('/api/config')
      .then(async res => {
        if (!res.ok) throw new Error('API unavailable');
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(data => {
        if (data) setConfig(data);
      })
      .catch(async () => {
        console.log('API config unavailable, falling back to Firebase/Local');
        const { fsGetGlobalConfig, isFirebaseEnabled } = await import('../firebase');
        if (isFirebaseEnabled()) {
          const fbConfig = await fsGetGlobalConfig();
          if (fbConfig) {
            setConfig(fbConfig);
            return;
          }
        }
        
        // Final fallback to some hardcoded values if everything fails
        setConfig({
          platformName: 'Rifa Digital',
          platformLogo: '',
          primaryColor: '#FFFFFF',
          secondaryColor: '#FF8C00',
          contactEmail: 'suporte@rifadigital.com',
          contactWhatsApp: '',
          faqs: [],
          testimonials: [],
          footerText: '© 2026 Rifa Digital. Todos os direitos reservados.'
        } as any);
      });
  }, []);

  if (!config) return <div className="h-screen flex items-center justify-center font-black text-[#FF8C00] animate-pulse">Carregando Plataforma...</div>;

  const themes: { id: RaffleTheme; name: string }[] = [
    { id: 'baby', name: 'Bebê' },
    { id: 'moto', name: 'Moto' },
    { id: 'car', name: 'Carro' },
    { id: 'charity', name: 'Beneficente' },
    { id: 'default', name: 'Padrão' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${config.primaryColor || '#FFFFFF'};
          --secondary-color: ${config.secondaryColor || '#FF8C00'};
          --secondary-dark: ${adjustColor(config.secondaryColor || '#FF8C00', -20)};
        }
        .text-primary-custom { color: var(--secondary-color); }
        .bg-primary-custom { background-color: var(--secondary-color); }
        .hover-bg-primary-custom:hover { background-color: var(--secondary-dark); }
        .border-primary-custom { border-color: var(--secondary-color); }
      `}} />
      <Header 
        config={config} 
        user={user}
        onLoginClick={onLoginClick} 
        onCreateClick={() => setShowCreateModal(true)} 
      />

      <Hero 
        config={config} 
        onCreateClick={() => {
          setSelectedModel(null);
          setShowCreateModal(true);
        }} 
        onCreateBolaoClick={() => setShowCreateBolaoModal(true)}
        onSelectModel={(model) => {
          setSelectedModel(model);
          setShowCreateModal(true);
        }}
      />

      {/* Smart Showcase Carousel */}
      <SmartCarousel 
        config={config} 
        onCreateClick={() => {
          setSelectedModel(null);
          setShowCreateModal(true);
        }} 
        onCreateBolaoClick={() => setShowCreateBolaoModal(true)}
      />

      <Features config={config} />

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-4">
             <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Dúvidas Frequentes</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {config.faqs?.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4 bg-gray-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Quem já usou recomenda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.testimonials?.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 relative">
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <h4 className="text-sm font-black text-gray-950">{t.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer config={config} onSupportClick={() => setShowSupportModal(true)} />

      {showSupportModal && (
        <SupportTicketModal onClose={() => setShowSupportModal(false)} />
      )}
      {showCreateModal && (
        <CreateRaffleModal config={config!} onClose={() => setShowCreateModal(false)} />
      )}
      {showCreateBolaoModal && (
        <CreateBolaoModal config={config!} onClose={() => setShowCreateBolaoModal(false)} />
      )}
    </div>
  );
}
