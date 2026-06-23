export type UserRole = 'super_admin' | 'tenant_admin' | 'client';

export interface Usuario {
  id: string;
  tenantId?: string | null;
  nome: string;
  email: string;
  usuario: string; // username
  documento?: string; // CPF or CNPJ
  whatsapp?: string; // Phone number
  password?: string;
  senhaHash?: string;
  fotoPerfil?: string;
  role: UserRole;
  createdAt: string;
  status: 'ativo' | 'suspenso' | 'banido' | 'pendente_pagamento';
  
  // Soft Delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
  
  // Finance
  saldoBruto?: number; // Total processed
  saldoDisponivel?: number; // Total net available
  customFee?: number; // Custom platform fee percentage for this user
  
  // PIX Configuration
  pixKeys?: PixKey[];
  pixHistory?: PixHistoryEntry[];
}

export interface PixKey {
  id: string;
  tipo: 'CPF' | 'CNPJ' | 'E-mail' | 'Telefone' | 'Chave Aleatória';
  chave: string;
  updatedAt: string;
}

export interface PixHistoryEntry {
  date: string;
  ip: string;
  responsibleUser: string;
  action: string;
  details: string;
}

export type RaffleTheme = 'default' | 'baby' | 'diaper' | 'reveal' | 'moto' | 'car' | 'charity';

export type RaffleType = 'tradicional' | 'diaper' | 'reveal' | 'moto' | 'car' | 'custom';

export interface PricingTier {
  start: number;
  end: number;
  price: number;
  color?: string;
}

export interface Rifa {
  id: string;
  ownerId: string; // ID of the client user who created it
  nome: string;
  slug: string;
  tipo: RaffleType;
  tema: RaffleTheme;
  faixas?: PricingTier[];
  corPrimaria: string; // default: #ffffff
  corSecundaria: string; // user selection
  
  // Public Display
  fotoPrincipal: string[]; // Suporte para até 3 fotos
  bannerUrl?: string;
  descricao: string;
  mensagemBoasVindas: string;
  mensagemAgradecimento: string;
  mensagemSucesso: string;
  
  // Rules (Immutable by client after creation, can be changed by super admin)
  quantidadeCotas: number;
  valorCota: number;
  dataLimite: string;
  
  // Finance Tracking
  totalVendido: number; // gross
  cotasVendidas: number;
  saldoDisponivel: number; // totalVendido - platformTax - paidWithdrawals
  
  status: 'ativa' | 'encerrada' | 'pausada';
  createdAt: string;

  // Soft Delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
  
  // Winner info
  ganhadorNumero?: number;
  ganhadorNome?: string;
  ganhadorData?: string;
}

export interface Participante {
  id: string;
  rifaId: string;
  nome: string;
  whatsapp: string;
  email?: string;
  documento?: string; // CPF or CNPJ
  numeros: number[]; // the slots purchased
  valorTotal: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'expirado';
  pixKey?: string; // payment link or reference
  pixCopiaECola?: string;
  pixQrCode?: string;
  externalReference?: string; // MP preference or payment ID
  createdAt: string;
  updatedAt?: string;
}

export interface Saque {
  id: string;
  rifaId?: string;
  bolaoId?: string;
  userId: string;
  valorSolicitado: number;
  taxaPlataforma: number; // % at the time of request
  valorLiquido: number; // after tax
  chavePix: string;
  status: 'pendente' | 'aprovado' | 'pago' | 'recusado';
  createdAt: string;
  updatedAt: string;
  motivoRejeicao?: string;
  dataRejeicao?: string;
  adminResponsavel?: string;

  // Soft Delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
}

export interface AdminLog {
  id: string;
  action: string;
  details: string;
  admin: string;
  date: string;
  ip?: string;
  type?: 'USER' | 'RAFFLE' | 'BOLAO' | 'WITHDRAWAL' | 'SYSTEM';
  idRegistro?: string;
  motivo?: string;
}

export interface GlobalConfig {
  id: 'main';
  platformName: string;
  platformLogo?: string;
  platformBanner?: string;
  taxaPlataforma: number; // percentage, e.g., 10
  suporteWhatsapp?: string; // WhatsApp de Suporte do Administrador
  
  // Custom Styles
  primaryColor?: string;
  secondaryColor?: string;

  // Landing Page Editor
  heroTitle: string;
  heroSub: string;
  heroBadge?: string;
  featuresTitle: string;
  featuresLabel?: string; // "Benefícios" text
  heroButtonText?: string;
  secondaryButtonText?: string;
  features: { title: string; desc: string; icon?: string }[];
  howItWorksTitle: string;
  howItWorks: { step: number; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { name: string; role: string; content: string; avatar?: string }[];
  footerText: string;
  
  // Payment Integration (Super Admin's keys)
  mpAccessToken?: string;
  mpPublicKey?: string;
  mpWebhookSecret?: string;

  // Model Gallery Custom Images
  modeloTradicionalImage?: string;
  modeloChadeBebeImage?: string;
  modeloPersonalizadoImage?: string;

  // Security Custom Messages
  mensagemSuspenso?: string;
  mensagemBanido?: string;

  // Carousel Configs
  carouselActive?: boolean;
  carouselTransitionTime?: number; // duration in seconds
  carouselOrder?: string[]; // e.g. ['rifas', 'bolao']
  carouselShowRifas?: boolean;
  carouselShowBolao?: boolean;

  // Activation Fee
  requireActivationFee?: boolean;
  activationFeeAmount?: number;
}

export interface Bolao {
  id: string;
  ownerId: string;
  nome: string;
  slug: string;
  descricao: string;
  organizadorNome: string;
  whatsapp: string;
  email: string;
  organizerCpf?: string;
  championshipName: string;
  competitionName: string;
  maxParticipants: number;
  pricePerParticipant: number;
  endDate: string;
  logoUrl?: string;
  bannerUrl?: string;
  rules?: string;
  prizes?: {
    type: 'single' | 'multiple';
    firstPlace: string;
    secondPlace: string;
    thirdPlace: string;
    fourthPlace?: string;
    fifthPlace?: string;
  };
  totalVendido: number;
  participantesConfirmados: number;
  saldoDisponivel: number;
  status: 'ativo' | 'suspenso' | 'encerrado';
  createdAt: string;

  // Soft Delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
}

export interface BolaoParticipant {
  id: string;
  bolaoId: string;
  nome: string;
  whatsapp: string;
  email: string;
  documento?: string; // CPF or CNPJ
  login?: string;
  password?: string;
  status: 'pendente' | 'pago' | 'cancelado' | 'expirado';
  valorTotal: number;
  pixCopiaECola?: string;
  pixQrCode?: string;
  externalReference?: string;
  createdAt: string;
  updatedAt?: string;
  points?: number;
  pendingGuesses?: {
    matchId: string;
    guessA: number;
    guessB: number;
  }[];
  auditLogs?: BolaoAuditLog[];
}

export interface BolaoAuditLog {
  id: string;
  date: string;
  ip: string;
  action: string;
  previousGuess?: { guessA: number; guessB: number };
  newGuess: { guessA: number; guessB: number };
  matchId: string;
}

export interface BolaoMatch {
  id: string;
  bolaoId: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  finished: boolean;
  date?: string;
}

export interface BolaoPalpite {
  id: string;
  bolaoId: string;
  participantId: string;
  matchId: string;
  guessA: number;
  guessB: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  documento: string; // CPF/CNPJ
  documentoTipo: 'CPF' | 'CNPJ';
  subject: string;
  message: string;
  status: 'aberto' | 'em_analise' | 'resolvido' | 'arquivado';
  createdAt: string;
  updatedAt?: string;

  // Soft Delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
}

