import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rifa, Participante } from '../types';
import { Award, ShoppingCart, CheckCircle2, Loader2, ArrowLeft, Baby, Bike, Car, Heart } from 'lucide-react';

export default function PublicRaffleView() {
  const getThemeIcon = () => {
    switch (rifa?.tema) {
      case 'baby': return <Baby className="w-6 h-6" />;
      case 'moto': return <Bike className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      case 'charity': return <Heart className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };
  const { slug } = useParams<{ slug: string }>();
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [bookedNumbers, setBookedNumbers] = useState<number[]>([]);
  const [purchaseStep, setPurchaseStep] = useState<'selection' | 'form' | 'payment' | 'success'>('selection');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [pendingPurchase, setPendingPurchase] = useState<Participante | null>(null);
  
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    documento: ''
  });

  const fetchRaffle = () => {
    fetch(`/api/raffles/view/${slug}`)
      .then(async res => {
        if (!res.ok) throw new Error('Rifa não encontrada');
        return res.json();
      })
      .then(data => {
        setRifa(data);
        // Fetch booked numbers
        return fetch(`/api/admin/raffles`); // We need a public endpoint for participants though
      })
      .catch(err => {
        console.error('Rifa view error:', err);
      });
  };

  useEffect(() => {
    const load = async () => {
        try {
            const res = await fetch(`api/raffles/view/${slug}`);
            if (!res.ok) throw new Error('API unavailable');
            const data = await res.json();
            setRifa(data);
            if (data.bookedNumbers) {
              setBookedNumbers(data.bookedNumbers);
            }
            setLoading(false);
        } catch (e) {
            console.log('API raffle view unavailable, falling back to Firebase');
            const { fsQueryCollection, isFirebaseEnabled } = await import('../firebase');
            if (isFirebaseEnabled()) {
              const raffles = await fsQueryCollection('rifas', 'slug', '==', slug);
              if (raffles.length > 0) {
                const data = raffles[0];
                setRifa(data);
                if (data.bookedNumbers) {
                  setBookedNumbers(data.bookedNumbers);
                }
                setLoading(false);
                return;
              }
            }
            setLoading(false);
        }
    };
    load();
  }, [slug]);

  // Temporary Fix: Removed legacy call to admin endpoint
  useEffect(() => {
    if (!rifa) return;
    // Numbers are already loaded in the initial fetch
  }, [rifa]);

  // Polling for payment status
  useEffect(() => {
    if (purchaseStep !== 'payment' || !pendingPurchase) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/purchases/${pendingPurchase.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'pago') {
            setPurchaseStep('success');
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [purchaseStep, pendingPurchase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-[#FF8C00]" /></div>;
  if (!rifa) return <div className="min-h-screen flex items-center justify-center">Rifa não encontrada.</div>;

  const getPriceForNumber = (num: number) => {
    if (rifa.faixas && rifa.faixas.length > 0) {
      const tier = rifa.faixas.find(f => num >= f.start && num <= f.end);
      return tier ? tier.price : rifa.valorCota;
    }
    return rifa.valorCota;
  };

  const calculateTotal = () => {
    return selectedNumbers.reduce((total, num) => total + getPriceForNumber(num), 0);
  };

  const getColorForNumber = (num: number) => {
    if (rifa?.faixas && rifa.faixas.length > 0) {
      const tier = rifa.faixas.find(f => num >= f.start && num <= f.end);
      if (tier && tier.color) return tier.color;
    }
    return rifa?.corSecundaria;
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/raffles/${slug}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          numbers: selectedNumbers,
          total: calculateTotal()
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setPendingPurchase(data);
        setPurchaseStep('payment');
        return;
      }

      // Fallback for GH Pages
      console.log('API purchase unavailable, falling back to Firebase');
      const { fsSetDocument, isFirebaseEnabled } = await import('../firebase');
      if (isFirebaseEnabled()) {
        const purchaseId = 'p_' + Math.random().toString(36).substr(2, 9);
        const purchaseData = {
          id: purchaseId,
          ...form,
          rifaSlug: slug,
          numbers: selectedNumbers,
          total: calculateTotal(),
          status: 'pendente',
          createdAt: new Date().toISOString(),
          pixCopiaECola: '00020126330014BR.GOV.BCB.PIX0111' + (form.whatsapp || 'suporte') + '520400005303986540' + calculateTotal().toFixed(2) + '5802BR5908FAZENDA6009SAO PAULO62070503***6304',
          pixQrCode: '' // In static mode we might not have a QR generator easily
        };
        
        const success = await fsSetDocument('compras', purchaseId, purchaseData);
        if (success) {
          setPendingPurchase(purchaseData as any);
          setPurchaseStep('payment');
          return;
        }
      }
      
      throw new Error('Serviço de pagamento indisponível no momento.');
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(error.message || 'Ocorreu um erro ao gerar o pagamento.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Dynamic Header based on Cor Secundaria */}
      <header className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
           <div style={{ color: rifa.corSecundaria }}>
              {getThemeIcon()}
           </div>
           <span className="font-black text-gray-900 truncate max-w-[150px]">{rifa.nome}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedNumbers.length > 0 && (
            <span className="text-[10px] font-black bg-orange-100 text-[#FF8C00] px-2 py-1 rounded-md">
              {selectedNumbers.length} selecionado(s)
            </span>
          )}
        </div>
      </header>

      {/* Hero / Banner / Photo Carousel */}
      <div className="relative h-64 sm:h-80 bg-gray-900 overflow-hidden group">
        {rifa.fotoPrincipal && rifa.fotoPrincipal.length > 0 ? (
          <>
            <img 
              src={rifa.fotoPrincipal[currentPhotoIndex]} 
              className="w-full h-full object-cover transition-all duration-700" 
              alt="Rifa" 
            />
            {rifa.fotoPrincipal.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentPhotoIndex(prev => (prev - 1 + rifa.fotoPrincipal.length) % rifa.fotoPrincipal.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentPhotoIndex(prev => (prev + 1) % rifa.fotoPrincipal.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity rotate-180"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
                  {rifa.fotoPrincipal.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#E67E22] opacity-80" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center pt-20">
          <div className="space-y-1">
             <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">{rifa.nome}</h1>
             <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">{rifa.tema} Edition</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10 space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400">
                {rifa.faixas && rifa.faixas.length > 0 ? 'Tabela de Valores' : 'Valor da Cota'}
              </span>
              {rifa.faixas && rifa.faixas.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {rifa.faixas.map((f, i) => (
                    <div key={i} className="text-[11px] font-bold text-gray-700 flex gap-2 items-center">
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: f.color || rifa.corSecundaria }} 
                      />
                      {String(f.start).padStart(2, '0')} ao {String(f.end).padStart(2, '0')} → R$ {f.price.toFixed(2).replace('.', ',')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-2xl font-black text-gray-900">R$ {rifa.valorCota.toFixed(2).replace('.', ',')}</p>
              )}
            </div>
            <div className="text-right self-start pt-1">
              <span className="text-[10px] font-black uppercase text-gray-400">Sorteio em</span>
              <p className="text-sm font-bold text-gray-700">{new Date(rifa.dataLimite).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">Sobre esta Rifa</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">{rifa.descricao}</p>
          </div>
        </div>

        {/* Number Selection Grid */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Escolha seus Números</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded" />
                   <span className="text-[10px] font-bold text-gray-400">Livre</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 bg-gray-200 rounded" />
                   <span className="text-[10px] font-bold text-gray-400">Reservado</span>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: rifa.quantidadeCotas }).map((_, i) => {
                const num = i + 1;
                const isSelected = selectedNumbers.includes(num);
                const isBooked = bookedNumbers.includes(num);

                return (
                  <button
                    key={i}
                    disabled={isBooked}
                    onClick={() => toggleNumber(num)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all border ${
                      isBooked 
                      ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : isSelected 
                      ? 'text-white border-transparent scale-110 shadow-lg' 
                      : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? getColorForNumber(num) : isBooked ? '#E5E7EB' : '#F9FAFB',
                      borderColor: !isSelected && !isBooked ? getColorForNumber(num) + '20' : 'transparent',
                      color: !isSelected && !isBooked ? getColorForNumber(num) : isBooked ? '#9CA3AF' : '#FFFFFF'
                    }}
                  >
                    {String(num).padStart(2, '0')}
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      {/* Sticky Bottom Purchase Bar */}
      {selectedNumbers.length > 0 && purchaseStep === 'selection' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-2xl z-40 animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase text-gray-400">Total a Pagar</span>
              <p className="text-xl font-black text-gray-900">
                R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </p>
            </div>
            <button
              onClick={() => setPurchaseStep('form')}
              className="flex-1 bg-[#FF8C00] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#E67E22] transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
              style={{ backgroundColor: rifa.corSecundaria }}
            >
              <span>Finalizar Reservas</span>
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      {purchaseStep === 'form' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
            <button onClick={() => setPurchaseStep('selection')} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900">Finalizar Reserva</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Preencha seus dados para pagar</p>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Completo</label>
                 <input
                  required
                  type="text"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                  placeholder="Seu nome"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">WhatsApp</label>
                   <input
                    required
                    type="tel"
                    value={form.whatsapp}
                    onChange={e => setForm({...form, whatsapp: e.target.value})}
                    className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                    placeholder="(00) 00000-0000"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">E-mail (Opcional)</label>
                   <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all font-bold text-sm"
                    placeholder="email@exemplo.com"
                   />
                 </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400">Total</span>
                  <span className="text-lg font-black text-gray-900">R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
               </div>

               <button 
                 type="submit"
                 className="w-full bg-[#FF8C00] text-white font-black py-5 rounded-2xl shadow-xl uppercase text-sm tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                 style={{ backgroundColor: rifa.corSecundaria }}
               >
                  Gerar Pagamento PIX
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {purchaseStep === 'payment' && pendingPurchase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: rifa.corSecundaria }} />
            
            <button onClick={() => setPurchaseStep('selection')} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900">✕</button>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Pague com PIX</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Aponte a câmera ou cole o código</p>
            </div>

            <div className="w-56 h-56 mx-auto rounded-[2rem] bg-white border-8 border-gray-50 p-4 shadow-inner flex items-center justify-center">
              {pendingPurchase.pixQrCode ? (
                <img src={`data:image/png;base64,${pendingPurchase.pixQrCode}`} alt="QR Code" className="w-full h-full" />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 group">
                <span className="text-[10px] font-mono text-gray-500 truncate text-left flex-1 font-bold">
                  {pendingPurchase.pixCopiaECola}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(pendingPurchase.pixCopiaECola || '');
                    alert('Código PIX copiado!');
                  }}
                  className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-[#FF8C00] uppercase shrink-0 shadow-sm hover:bg-gray-50 transition-all"
                  style={{ color: rifa.corSecundaria }}
                >
                  Copiar Código
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-orange-50 rounded-[1.5rem] border border-orange-100/50">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF8C00]" />
                <span className="text-[11px] font-black text-[#FF8C00] uppercase tracking-widest">Verificando pagamento...</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 font-bold">O seu lugar será reservado por 15 minutos até a confirmação.</p>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {purchaseStep === 'success' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-12 text-center space-y-6 shadow-2xl relative">
            <div className="w-24 h-24 bg-green-100 mx-auto rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900">Pagamento Confirmado!</h3>
              <p className="text-sm text-gray-500 font-bold">{rifa.mensagemSucesso || 'Seus números foram reservados com sucesso.'}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
               <span className="text-[10px] font-black uppercase text-gray-400 block">Seus Números</span>
               <div className="flex flex-wrap justify-center gap-2">
                  {selectedNumbers.map(n => (
                    <span key={n} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-gray-900 shadow-sm">
                      {String(n).padStart(2, '0')}
                    </span>
                  ))}
               </div>
            </div>
            <button 
              onClick={() => {
                setSelectedNumbers([]);
                setPurchaseStep('selection');
                window.location.reload();
              }}
              className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-sm tracking-widest"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
