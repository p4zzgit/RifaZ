import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Calendar, DollarSign, Users, ShieldCheck, HelpCircle, Loader2, Search, Check, Save, UserCheck, MessageCircle, RefreshCw, Smartphone, X, Award } from 'lucide-react';

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  finished: boolean;
  date: string;
}

interface RankingUser {
  pos: number;
  id: string;
  nome: string;
  points: number;
  whatsapp: string;
}

export default function PublicBolaoView() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // Core Data
  const [bolao, setBolao] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);

  // States
  const [activeTab, setActiveTab] = useState<'matches' | 'ranking' | 'rules'>('matches');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({ 
    name: '', 
    whatsapp: '', 
    email: '', 
    documento: '',
    login: '',
    password: ''
  });
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinResult, setJoinResult] = useState<any>(null);

  // Participant login/verification
  const [authForm, setAuthForm] = useState({ login: '', password: '' });
  const [activeParticipant, setActiveParticipant] = useState<any>(null);
  const [activeGuesses, setActiveGuesses] = useState<Record<string, { guessA: string; guessB: string }>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [saveGuessesLoading, setSaveGuessesLoading] = useState(false);
  const [saveGuessesSuccess, setSaveGuessesSuccess] = useState(false);

  // Mask helpers
  const maskCPF = (val: string) => {
    const v = val.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
    }
    return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').substring(0, 18);
  };

  const fetchBolaoDetails = () => {
    setLoading(true);
    fetch(`api/boloes/view/${slug}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403 && data.isBlocked) {
            setIsBlocked(true);
            throw new Error(data.error);
          }
          throw new Error(data.error || 'API unavailable');
        }
        setBolao(data.bolao);
        setMatches(data.matches || []);
        setRankings(data.rankings || []);
        setParticipantsCount(data.participantsCount || 0);
      })
      .catch(async err => {
        console.log('API bolao view unavailable, falling back to Firebase');
        const { fsQueryCollection, isFirebaseEnabled } = await import('../firebase');
        if (isFirebaseEnabled()) {
          const boloes = await fsQueryCollection('boloes', 'slug', '==', slug);
          if (boloes.length > 0) {
            const data = boloes[0];
            setBolao(data);
            // In a real static scenario, matches and rankings would also be in separate collections.
            // For now, we assume they might be subcollections or we just fetch what we can.
            setMatches(data.matches || []);
            setRankings(data.rankings || []);
            setParticipantsCount(data.participantsCount || 0);
            return;
          }
        }
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBolaoDetails();
  }, [slug]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.name || !joinForm.whatsapp) {
      alert('Por favor, preencha nome e WhatsApp.');
      return;
    }
    setJoinLoading(true);

    // Format guesses if any
    const guessList = (Object.entries(activeGuesses) as [string, { guessA: string; guessB: string }][])
      .filter(([_, value]) => value.guessA !== '' && value.guessB !== '')
      .map(([matchId, value]) => ({
        matchId,
        guessA: parseInt(value.guessA),
        guessB: parseInt(value.guessB)
      }));

    try {
      const res = await fetch(`/api/boloes/${slug}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...joinForm, guesses: guessList })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao participar');
      setJoinResult(data);
      // Refresh count
      setParticipantsCount(prev => prev + 1);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleVerifyParticipant = async () => {
    if (!authForm.login || !authForm.password) return;
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch(`/api/boloes/${slug}/participant-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login ou senha incorretos.');
      
      setActiveParticipant(data.participant);
      
      // Initialize guesses map
      const gMap: Record<string, { guessA: string; guessB: string }> = {};
      data.guesses.forEach((g: any) => {
        gMap[g.matchId] = {
          guessA: g.guessA.toString(),
          guessB: g.guessB.toString()
        };
      });
      setActiveGuesses(gMap);
    } catch (err: any) {
      setAuthError(err.message);
      setActiveParticipant(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuessChange = (matchId: string, team: 'A' | 'B', val: string) => {
    // Only numeric chars
    const numeric = val.replace(/\D/g, '');
    setActiveGuesses(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId] || { guessA: '', guessB: '' },
        [team === 'A' ? 'guessA' : 'guessB']: numeric
      }
    }));
  };

  const handleSaveGuesses = async () => {
    if (!activeParticipant) return;
    setSaveGuessesLoading(true);
    setSaveGuessesSuccess(false);

    // Format list
    const guessList = (Object.entries(activeGuesses) as [string, { guessA: string; guessB: string }][])
      .filter(([_, value]) => value.guessA !== '' && value.guessB !== '')
      .map(([matchId, value]) => ({
        matchId,
        guessA: parseInt(value.guessA),
        guessB: parseInt(value.guessB)
      }));

    try {
      const res = await fetch(`/api/boloes/participant/${activeParticipant.id}/guesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesses: guessList })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar palpites');
      }
      setSaveGuessesSuccess(true);
      setTimeout(() => setSaveGuessesSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveGuessesLoading(false);
    }
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Bolão Suspenso</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {error || 'Este bolão foi suspenso temporariamente pela administração.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#FF8C00] text-white py-3 rounded-2xl font-bold hover:bg-[#E67E22] transition-all cursor-pointer"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#FF8C00] animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Obtendo Chaves de Partida...</p>
        </div>
      </div>
    );
  }

  if (error || !bolao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Bolão Não Encontrado</h2>
          <p className="text-sm text-gray-500">
            {error || 'Link inválido ou bolão inexistente na base.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all cursor-pointer"
          >
            Página de Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Banner Area */}
      <div className="w-full bg-cover bg-center h-48 sm:h-64 relative bg-gray-900 flex items-end pb-6 px-4" style={{ backgroundImage: bolao.bannerUrl ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${bolao.bannerUrl})` : undefined }}>
        {!bolao.bannerUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 opacity-90" />
        )}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {bolao.logoUrl ? (
              <img src={bolao.logoUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-white/20 shadow-xl bg-white" />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-600 border-2 border-white/20 shadow-xl flex items-center justify-center text-white text-3xl font-black">
                ⚽
              </div>
            )}
            <div className="space-y-1 text-white">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                🏷️ {bolao.championshipName} - {bolao.competitionName}
              </span>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">{bolao.nome}</h1>
              <p className="text-xs text-gray-300 font-medium">Por: <span className="font-bold text-white">{bolao.organizerName}</span></p>
            </div>
          </div>
          
          <div className="flex gap-2 text-white text-xs">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Entrada</span>
              <span className="text-base font-black text-emerald-400">R$ {parseFloat(bolao.pricePerParticipant).toFixed(2)}</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Confirmados</span>
              <span className="text-base font-black text-white">{participantsCount} / {bolao.maxParticipants}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns containing Games, Rankings, or Rules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center ${activeTab === 'matches' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              ⚽ Jogos & Palpitar
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center ${activeTab === 'ranking' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              📊 Classificação
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center ${activeTab === 'rules' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              📜 Prêmios & Regras
            </button>
          </div>

          {/* TAB: MATCHES */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-950">Quadro de Partidas</h2>
                    <p className="text-xs text-gray-400 font-medium">As previsões salvam instantaneamente após sua validação.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Status: Inscrições Abertas</span>
                  </div>
                </div>

                {/* Participant Session Status */}
                {activeParticipant ? (
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Conta Participante - {activeParticipant.login || 'Usuário'}</p>
                        <h4 className="text-sm font-black text-emerald-950">{activeParticipant.nome}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Pontos: {activeParticipant.points || 0}</span>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Status: {activeParticipant.status === 'pago' ? 'Confirmado' : 'Pendente'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleSaveGuesses}
                        disabled={saveGuessesLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-md transition-all active:scale-95"
                      >
                        {saveGuessesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            Salvar Palpites
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveParticipant(null);
                          setActiveGuesses({});
                          setAuthForm({ login: '', password: '' });
                        }}
                        className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-100 px-3 py-2.5 rounded-xl"
                      >
                        Sair do Painel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                          Acesso do Participante
                        </div>
                        <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={authForm.login}
                            onChange={e => setAuthForm({...authForm, login: e.target.value})}
                            placeholder="Seu Login..."
                            className="w-full bg-white pl-9 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-xs focus:border-emerald-500 font-bold"
                          />
                        </div>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            value={authForm.password}
                            onChange={e => setAuthForm({...authForm, password: e.target.value})}
                            placeholder="Sua Senha..."
                            onKeyDown={e => e.key === 'Enter' && handleVerifyParticipant()}
                            className="w-full bg-white pl-9 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-xs focus:border-emerald-500 font-bold"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleVerifyParticipant}
                        disabled={authLoading}
                        className="w-full bg-gray-900 text-white font-black text-xs px-4 py-3.5 rounded-xl hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Acessar Meus Palpites
                          </>
                        )}
                      </button>
                      {authError && <p className="text-red-500 text-[10px] font-black text-center bg-red-50 p-2 rounded-lg border border-red-100">{authError}</p>}
                      <p className="text-[10px] text-gray-400 text-center font-medium">Ainda não participa? Clique no botão "Participar Agora!" no menu lateral.</p>
                    </div>
                  </div>
                )}

                {saveGuessesSuccess && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-xl text-xs font-bold text-center animate-in zoom-in duration-200">
                    🎉 Palpites salvos com sucesso! Acompanhe a liderança no painel de Classificação.
                  </div>
                )}

                {/* Match Cards */}
                <div className="space-y-3 pt-2">
                  {matches.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Nenhum evento registrado pelo organizador neste momento.</div>
                  ) : (
                    matches.map(match => {
                      const userGuess = activeGuesses[match.id] || { guessA: '', guessB: '' };
                      
                      // Deadline logic: 1 hour before match date
                      const matchTime = new Date(match.date);
                      const now = new Date();
                      const deadline = new Date(matchTime.getTime() - 60 * 60 * 1000);
                      const isPastDeadline = now > deadline;
                      const isLocked = isPastDeadline || match.finished;

                      return (
                        <div key={match.id} className={`border border-gray-100 rounded-2xl p-4 sm:p-6 bg-white transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${isLocked ? 'opacity-80' : 'hover:border-emerald-200 hover:shadow-md'}`}>
                          
                          {/* Match Date / Meta */}
                          <div className="text-center md:text-left space-y-1">
                            <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${match.finished ? 'bg-gray-100 text-gray-500' : isPastDeadline ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-orange-50 text-orange-500 border border-orange-100'}`}>
                              {match.finished ? 'Encerrou' : isPastDeadline ? 'Encerrado (Deadline)' : 'Aberto para Palpite'}
                            </span>
                            <p className="text-[10px] text-gray-400 font-mono">
                              {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isPastDeadline && !match.finished && (
                              <p className="text-[9px] text-red-400 font-bold uppercase">Locked: 1h b4 kickoff</p>
                            )}
                          </div>

                          {/* Scores & Names */}
                          <div className="flex-1 flex items-center justify-center gap-6 w-full">
                            
                            {/* Team A */}
                            <div className="flex-1 text-right text-xs sm:text-sm font-black text-gray-950 truncate">
                              {match.teamA}
                            </div>

                            {/* Center Scoreboards */}
                            <div className="flex items-center gap-2">
                              {!isLocked ? (
                                <>
                                  <input 
                                    type="text"
                                    maxLength={2}
                                    value={userGuess.guessA}
                                    onChange={e => handleGuessChange(match.id, 'A', e.target.value)}
                                    placeholder="-"
                                    disabled={!activeParticipant}
                                    title={!activeParticipant ? "Acesse sua conta para palpitar" : ""}
                                    className="w-11 h-11 border border-gray-200 rounded-xl text-center font-black text-base outline-none focus:border-emerald-500 bg-emerald-50/10"
                                  />
                                  <span className="text-gray-300 font-bold text-lg">x</span>
                                  <input 
                                    type="text"
                                    maxLength={2}
                                    value={userGuess.guessB}
                                    onChange={e => handleGuessChange(match.id, 'B', e.target.value)}
                                    placeholder="-"
                                    disabled={!activeParticipant}
                                    title={!activeParticipant ? "Acesse sua conta para palpitar" : ""}
                                    className="w-11 h-11 border border-gray-200 rounded-xl text-center font-black text-base outline-none focus:border-emerald-500 bg-emerald-50/10"
                                  />
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="group relative">
                                    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
                                      <span className="text-[8px] font-bold text-gray-400 uppercase">Seu</span>
                                      <span className="font-black text-sm text-gray-800">{userGuess.guessA || '-'}</span>
                                    </div>
                                    {isPastDeadline && (
                                       <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all z-10">Encerrado</div>
                                    )}
                                  </div>
                                  <span className="text-gray-300 font-bold text-base">x</span>
                                  <div className="group relative">
                                    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
                                      <span className="text-[8px] font-bold text-gray-400 uppercase">Seu</span>
                                      <span className="font-black text-sm text-gray-800">{userGuess.guessB || '-'}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Team B */}
                            <div className="flex-1 text-left text-xs sm:text-sm font-black text-gray-950 truncate">
                              {match.teamB}
                            </div>

                          </div>

                          {/* Finished Outcome Display */}
                          {match.finished ? (
                            <div className="text-center md:text-right bg-emerald-600 border border-emerald-600 px-4 py-2 rounded-xl flex flex-col items-center">
                              <span className="text-[8px] font-bold text-white/80 uppercase">Resultado</span>
                              <span className="text-sm font-black text-white">{match.scoreA} x {match.scoreB}</span>
                            </div>
                          ) : isPastDeadline ? (
                             <div className="text-center opacity-50 flex flex-col items-center">
                               <ShieldCheck className="w-4 h-4 text-red-400" />
                               <span className="text-[8px] font-black text-red-400 uppercase mt-1">Blocked</span>
                             </div>
                          ) : null}

                        </div>
                      );
                    })
                  )}
                </div>

                {activeParticipant && matches.length > 0 && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveGuesses}
                      disabled={saveGuessesLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                    >
                      {saveGuessesLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                      Salvar Todos Meus Palpites
                    </button>
                  </div>
                )}

              </div>
              
            </div>
          )}

          {/* TAB: RANKING */}
          {activeTab === 'ranking' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-gray-950">Tabela de Liderança</h2>
                <p className="text-xs text-gray-400 font-medium">Classificação atualizada instantaneamente. 3 pontos por placar cheio, 1 ponto por acertar o vencedor.</p>
              </div>

              {/* Mobile View: Cards */}
              <div className="md:hidden divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                {rankings.length === 0 ? (
                  <div className="p-10 text-center text-xs font-bold text-gray-400">Nenhum participante pontuou.</div>
                ) : (
                  rankings.map((p, idx) => (
                    <div key={p.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0 ? 'bg-amber-100 text-amber-600' : 
                          idx === 1 ? 'bg-gray-100 text-gray-500' :
                          idx === 2 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {idx + 1}º
                        </span>
                        <div>
                          <span className="text-sm font-black text-gray-950 block leading-tight">{p.nome}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">whatsapp oculto p/ segurança</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600 block">{p.points} <span className="text-[9px] uppercase">pts</span></span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      <th className="py-3 px-4">Posição</th>
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4 text-right">Acertos</th>
                      <th className="py-3 px-4 text-right">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-xs font-bold text-gray-400">
                          Nenhum participante pontuou ou confirmou vaga ainda.
                        </td>
                      </tr>
                    ) : (
                      rankings.map((p, idx) => (
                        <tr key={p.id} className={`border-b border-gray-50 ${idx === 0 ? 'bg-yellow-50/10' : ''}`}>
                          <td className="py-4 px-4 font-black">
                            {idx === 0 && '🥇'}
                            {idx === 1 && '🥈'}
                            {idx === 2 && '🥉'}
                            {idx > 2 && `${idx + 1}º`}
                          </td>
                          <td className="py-4 px-4 font-black text-gray-900 text-xs sm:text-sm">
                            {p.nome}
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-400 text-right font-bold text-xs">
                            {p.points >= 3 ? Math.floor(p.points / 3) : 0} cheios
                          </td>
                          <td className="py-4 px-4 font-black text-right text-[#FF8C00]">
                            {p.points} <span className="text-[10px] text-gray-400 font-bold uppercase">pts</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: RULES & PRIZES */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Rules Box */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                  <HelpCircle className="w-5 h-5 text-[#FF8C00]" />
                  <h3 className="text-sm font-black text-gray-950 uppercase tracking-tight">Como Funcionam os Pontos</h3>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed font-semibold whitespace-pre-line">
                  {bolao.rules}
                </div>
              </div>

              {/* Prizes Box */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-sm font-black text-gray-950 uppercase tracking-tight">Arrecadação & Prêmios</h3>
                </div>
                
                <div className="space-y-4">
                  {bolao.prizes?.type === 'single' ? (
                    <div className="bg-yellow-50/30 border border-yellow-105 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-yellow-600 uppercase">Campeão Único</span>
                        <h4 className="text-sm font-black text-gray-950">1º Lugar Recebe:</h4>
                      </div>
                      <span className="text-xs font-black text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-xl uppercase">
                        {bolao.prizes.firstPlace || 'Acumulado'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bolao.prizes?.firstPlace && (
                        <div className="border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-950">🥇 1º Lugar</span>
                          <span className="font-black text-[#FF8C00]">{bolao.prizes.firstPlace}</span>
                        </div>
                      )}
                      {bolao.prizes?.secondPlace && (
                        <div className="border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-950">🥈 2º Lugar</span>
                          <span className="font-black text-[#FF8C00]">{bolao.prizes.secondPlace}</span>
                        </div>
                      )}
                      {bolao.prizes?.thirdPlace && (
                        <div className="border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-950">🥉 3º Lugar</span>
                          <span className="font-black text-[#FF8C00]">{bolao.prizes.thirdPlace}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-emerald-600 uppercase">Valor do Bolão</span>
                      <p className="text-xs font-bold text-gray-500">Acumulado bruto estimado</p>
                    </div>
                    <span className="text-sm font-black text-emerald-800">
                      R$ {(parseFloat(bolao.pricePerParticipant) * participantsCount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Sidebar - Call to action container */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="bg-yellow-50 text-yellow-600 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider">
                ⏰ Fim: {new Date(bolao.endDate).toLocaleDateString()}
              </span>
              <h3 className="text-lg font-black text-gray-950">Participe Agora!</h3>
              <p className="text-xs text-gray-400">Preencha sua inscrição e pague no PIX de forma rápida para liberar seus palpites esportivos.</p>
            </div>

            <button
              onClick={() => {
                setJoinResult(null);
                setShowJoinModal(true);
              }}
              className="w-full bg-[#FF8C00] hover:bg-[#E67E22] text-white font-black py-4 rounded-2xl text-center cursor-pointer transition-all uppercase tracking-wider text-xs shadow-lg"
            >
              🚀 Garantir Minha Vaga (R$ {parseFloat(bolao.pricePerParticipant).toFixed(2)})
            </button>

            <div className="border-t border-gray-50 pt-4 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 text-center">Fale com o organizador</p>
              <a
                href={`https://wa.me/${bolao.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full border border-gray-100 hover:bg-gray-50 text-gray-700 font-extrabold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                Dúvidas via WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* JOIN FOOTER MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!joinResult ? (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF8C00] text-white rounded-xl flex items-center justify-center font-bold">
                    📝
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-950">Preencha seus Dados</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inscrição no Bolão</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Nome Oficial *</label>
                  <input
                    required
                    type="text"
                    value={joinForm.name}
                    onChange={e => setJoinForm({...joinForm, name: e.target.value})}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Login Desejado *</label>
                    <input
                      required
                      type="text"
                      value={joinForm.login}
                      onChange={e => setJoinForm({...joinForm, login: e.target.value})}
                      placeholder="Ex: carlos.sports"
                      className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Senha de Acesso *</label>
                    <input
                      required
                      type="password"
                      value={joinForm.password}
                      onChange={e => setJoinForm({...joinForm, password: e.target.value})}
                      placeholder="Ex: 1234..."
                      className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    value={joinForm.whatsapp}
                    onChange={e => setJoinForm({...joinForm, whatsapp: e.target.value})}
                    placeholder="Ex: 11988887777"
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">CPF ou CNPJ *</label>
                  <input
                    required
                    type="text"
                    value={joinForm.documento}
                    onChange={e => setJoinForm({...joinForm, documento: maskCPF(e.target.value)})}
                    placeholder="000.000.000-00"
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">E-mail (Para Notificar) *</label>
                  <input
                    required
                    type="email"
                    value={joinForm.email}
                    onChange={e => setJoinForm({...joinForm, email: e.target.value})}
                    placeholder="carlos@exemplo.com"
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none text-xs focus:border-[#FF8C00]"
                  />
                </div>

                <button
                  disabled={joinLoading}
                  type="submit"
                  className="w-full bg-[#FF8C00] hover:bg-[#E67E22] text-white font-black py-3 rounded-xl text-xs transition-all uppercase tracking-wider cursor-pointer"
                >
                  {joinLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Gerar PIX e Confirmar'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-base font-black text-gray-950">PIX Copia e Cola Gerado</h3>
                <p className="text-xs text-gray-500">Efetue o pagamento do PIX. Seu status será modificado de pendente para aprovado automaticamente assim que for detectado!</p>

                {joinResult.pixQrCode && (
                  <img src={`data:image/png;base64,${joinResult.pixQrCode}`} className="w-40 h-40 object-contain mx-auto border border-gray-105 rounded-xl p-2" />
                )}

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left font-mono text-[10px] break-all select-all flex items-center gap-2 justify-between">
                  <span className="flex-1 overflow-hidden truncate">{joinResult.pixCopiaECola || 'Copia e cola não disponível'}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(joinResult.pixCopiaECola);
                      alert('Copiado com sucesso!');
                    }}
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700 font-bold uppercase shrink-0"
                  >
                    Copiar
                  </button>
                </div>

                <div className="font-mono bg-emerald-50 text-[10px] p-2.5 rounded-lg text-emerald-800 font-bold border border-emerald-100 text-left space-y-1">
                  <p>✅ Sua conta de participante foi pré-registrada.</p>
                  <p>👤 Login: <span className="font-black text-emerald-950 underline">{joinForm.login}</span></p>
                  <p>🔑 Senha: <span className="font-black text-emerald-950">Informada na inscrição</span></p>
                  <p className="mt-2 text-xs text-gray-500 font-medium">Após o pagamento, sua conta será ativada e você poderá acessar o painel para ver ratings e alterar palpites até o prazo limite (1h antes do jogo).</p>
                </div>

                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    // Autofill login check
                    setAuthForm({ login: joinForm.login, password: joinForm.password });
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Entendi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
