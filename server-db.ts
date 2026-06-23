import fs from 'fs/promises';
import path from 'path';
import { Usuario, Rifa, Participante, Saque, GlobalConfig, Bolao, BolaoParticipant, BolaoMatch, BolaoPalpite } from './src/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface Database {
  landingConfig: GlobalConfig;
  usuarios: Usuario[];
  rifas: Rifa[];
  saques: Saque[];
  participantes: Participante[];
  boloes: Bolao[];
  bolaoParticipantes: BolaoParticipant[];
  bolaoPartidas: BolaoMatch[];
  bolaoPalpites: BolaoPalpite[];
  adminLogs: any[];
}

const DEFAULT_DB: Database = {
  landingConfig: {
    id: 'main',
    platformName: 'Chá Rifa Online',
    taxaPlataforma: 10,
    heroTitle: 'Crie sua Rifa Online de forma Profissional',
    heroSub: 'Plataforma completa para Chá de Fraldas, Rifas de Motos, Carros e muito mais.',
    heroBadge: 'Lançamento 2024',
    heroButtonText: 'Criar Rifa Agora',
    secondaryButtonText: 'Ver Modelos',
    featuresTitle: 'Por que escolher nossa plataforma?',
    featuresLabel: 'Benefícios',
    features: [
      { title: 'Pagamento via PIX', desc: 'Receba na hora direto na conta do administrador.' },
      { title: 'Temas Personalizados', desc: 'Bebê, Motos, Carros e mais.' },
      { title: 'Gestão Completa', desc: 'Controle de participantes e saques.' }
    ],
    howItWorksTitle: 'Como funciona?',
    howItWorks: [
      { step: 1, title: 'Crie sua Rifa', desc: 'Preencha o formulário e defina os valores.' },
      { step: 2, title: 'Divulgue o Link', desc: 'Compartilhe com amigos e redes sociais.' },
      { step: 3, title: 'Receba seus Ganhos', desc: 'Solicite o saque após as vendas.' }
    ],
    faqs: [
      { q: 'Como recebo o dinheiro?', a: 'O dinheiro vai para o administrador e você solicita o saque via PIX.' }
    ],
    testimonials: [
      { name: 'Ana Silva', role: 'Mãe do Pedro', content: 'Foi incrível para o meu chá de fraldas!', avatar: '' }
    ],
    footerText: '© 2024 Chá Rifa Online - Todos os direitos reservados.',
    modeloTradicionalImage: 'https://images.unsplash.com/photo-1518131394553-c510306126be?auto=format&fit=crop&q=80&w=600',
    modeloChadeBebeImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600',
    modeloPersonalizadoImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
    mensagemSuspenso: 'Sua conta foi suspensa temporariamente por auditoria de segurança ou termos de uso. Entre em contato com o suporte para reativar seu acesso.',
    mensagemBanido: 'Sua conta foi banida permanentemente do sistema por descumprimento das regras ou fraudes detectadas.',
    carouselActive: true,
    carouselTransitionTime: 5,
    carouselOrder: ['rifas', 'bolao'],
    carouselShowRifas: true,
    carouselShowBolao: true
  },
  usuarios: [],
  rifas: [],
  saques: [],
  participantes: [],
  boloes: [],
  bolaoParticipantes: [],
  bolaoPartidas: [],
  bolaoPalpites: [],
  adminLogs: []
};

export async function getDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    
    // Migration/Fix: map legacy or alternative keys to our expected Database interface
    const landingConfig = db.landingConfig || db.config || DEFAULT_DB.landingConfig;
    
    // Convert JSON strings to arrays if necessary (handling legacy db format)
    const cleanConfig: GlobalConfig = {
      ...DEFAULT_DB.landingConfig,
      ...landingConfig,
      platformName: landingConfig.platformName || DEFAULT_DB.landingConfig.platformName,
      features: Array.isArray(landingConfig.features) ? landingConfig.features : 
                (typeof landingConfig.featuresJson === 'string' ? JSON.parse(landingConfig.featuresJson) : DEFAULT_DB.landingConfig.features),
      howItWorks: Array.isArray(landingConfig.howItWorks) ? landingConfig.howItWorks : 
                  (typeof landingConfig.howItWorksJson === 'string' ? JSON.parse(landingConfig.howItWorksJson) : DEFAULT_DB.landingConfig.howItWorks),
      faqs: Array.isArray(landingConfig.faqs) ? landingConfig.faqs : 
            (typeof landingConfig.faqsJson === 'string' ? JSON.parse(landingConfig.faqsJson) : DEFAULT_DB.landingConfig.faqs),
      testimonials: Array.isArray(landingConfig.testimonials) ? landingConfig.testimonials : 
                    (typeof landingConfig.testimonialsJson === 'string' ? JSON.parse(landingConfig.testimonialsJson) : DEFAULT_DB.landingConfig.testimonials)
    };

    return {
      landingConfig: cleanConfig,
      usuarios: db.usuarios || db.users || [],
      rifas: db.rifas || db.eventos || [],
      saques: db.saques || db.withdrawals || [],
      participantes: db.participantes || [],
      boloes: db.boloes || [],
      bolaoParticipantes: db.bolaoParticipantes || [],
      bolaoPartidas: db.bolaoPartidas || [],
      bolaoPalpites: db.bolaoPalpites || [],
      adminLogs: db.adminLogs || db.logs || []
    };
  } catch (error) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
}

export async function saveDb(db: Database): Promise<void> {
  // Be careful not to overwrite other keys if they exist in the file but not in our interface
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const existing = JSON.parse(data);
    const updated = { ...existing, ...db };
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  }
}

// User Actions
export async function findUserByUsername(username: string) {
  const db = await getDb();
  return db.usuarios.find(u => u.usuario === username);
}

// Config Actions
export async function getConfig() {
  const db = await getDb();
  return db.landingConfig;
}

export async function updateConfig(newConfig: Partial<GlobalConfig>) {
  const db = await getDb();
  db.landingConfig = { ...db.landingConfig, ...newConfig };
  await saveDb(db);
  return db.landingConfig;
}
