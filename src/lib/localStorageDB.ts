
// LocalStorage Persistence Layer (Mocking Firestore/Backend)
export const STORAGE_KEYS = {
  CONFIG: 'rifa_config',
  USERS: 'rifa_users',
  RIFAS: 'rifa_raffles',
  BOLOES: 'rifa_boloes',
  WITHDRAWALS: 'rifa_withdrawals',
  LOGS: 'rifa_logs',
  TRASH_USERS: 'rifa_trash_users',
  TRASH_RIFAS: 'rifa_trash_raffles',
  TRASH_BOLOES: 'rifa_trash_boloes',
  PARTICIPANTS: 'rifa_participants',
  PARTICIPANTS_BOLAO: 'rifa_participants_bolao',
  BOLAO_MATCHES: 'rifa_bolao_matches',
  PALPITES: 'rifa_palpites'
};

const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// Initial Seed
export function seedInitialData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      password: '123',
      nome: 'Administrador',
      whatsapp: '11999999999',
      documento: '000.000.000-00',
      email: 'admin@admin.com',
      role: 'super_admin',
      status: 'ativo',
      saldo: 0,
      createdAt: new Date().toISOString()
    };
    
    const demoUser = {
      id: 'user-1',
      username: 'demo',
      password: '123',
      nome: 'Organizador Demo',
      whatsapp: '11988888888',
      documento: '111.111.111-11',
      email: 'demo@demo.com',
      role: 'user',
      status: 'ativo',
      saldo: 1250.50,
      createdAt: new Date().toISOString()
    };
    
    setLocal(STORAGE_KEYS.USERS, [adminUser, demoUser]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    const defaultConfig = {
      platformName: 'Rifa Digital',
      platformLogo: '',
      primaryColor: '#FFFFFF',
      secondaryColor: '#FF8C00',
      contactEmail: 'suporte@rifadigital.com',
      contactWhatsApp: '11977777777',
      suporteWhatsapp: '11977777777',
      heroTitle: 'Crie sua Rifa Digital em minutos',
      heroSub: 'A plataforma mais completa para gerenciar seus sorteios online.',
      featuresTitle: 'Por que escolher nossa plataforma?',
      featuresLabel: 'Benefícios',
      features: [
        { title: 'Rápido e Fácil', desc: 'Crie sua rifa em menos de 2 minutos.', icon: 'Bike' },
        { title: 'Pagamento Seguro', desc: 'Integração direta com Mercado Pago.', icon: 'ShieldCheck' },
        { title: 'Gestão Completa', desc: 'Painel administrativo para controle total.', icon: 'Settings' }
      ],
      faqs: [
        { q: "Como crio uma rifa?", a: "Basta se cadastrar e clicar no botão Criar Rifa." },
        { q: "Quais as taxas?", a: "Cobramos apenas 5% sobre o valor total arrecadado." }
      ],
      testimonials: [
        { name: "João Silva", role: "Organizador", content: "Plataforma incrível, vendi todas as cotas em 3 dias!" },
        { name: "Maria Santos", role: "Participante", content: "Muito fácil de usar e o suporte é nota 10." }
      ],
      footerText: '© 2026 Rifa Digital. Todos os direitos reservados.'
    };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(defaultConfig));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RIFAS)) {
    const demoRifa = {
      id: 'demo-rifa-1',
      userId: 'user-1',
      nome: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Participe e concorra a um iPhone 15 Pro Max novinho!',
      pricePerParticipant: 10,
      maxParticipants: 1000,
      bookedNumbers: [1, 5, 10, 55],
      logoUrl: '',
      bannerUrl: '',
      theme: 'default',
      status: 'ativo',
      createdAt: new Date().toISOString()
    };
    setLocal(STORAGE_KEYS.RIFAS, [demoRifa]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOLOES)) {
    const demoBolao = {
      id: 'demo-bolao-1',
      userId: 'user-1',
      nome: 'Brasileirão 2026 - Rodada 1',
      slug: 'brasileirao-2026-r1',
      description: 'Faça seus palpites e ganhe prêmios em dinheiro!',
      pricePerParticipant: 20,
      maxParticipants: 100,
      logoUrl: '',
      bannerUrl: '',
      status: 'ativo',
      createdAt: new Date().toISOString()
    };
    setLocal(STORAGE_KEYS.BOLOES, [demoBolao]);
  }
}

// Mimic Firebase API
export const db = {
  getCollection: async (collection: string) => {
    const key = STORAGE_KEYS[collection.toUpperCase() as keyof typeof STORAGE_KEYS] || collection;
    return getLocal(key);
  },
  
  getDocument: async (collection: string, id: string) => {
    if (collection === 'config') return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}');
    const items = await db.getCollection(collection);
    return items.find((i: any) => i.id === id);
  },
  
  setDocument: async (collection: string, id: string, data: any) => {
    if (collection === 'config') {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}');
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({ ...current, ...data }));
      return;
    }
    const key = STORAGE_KEYS[collection.toUpperCase() as keyof typeof STORAGE_KEYS] || collection;
    const items = getLocal(key);
    const index = items.findIndex((i: any) => i.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...data };
    } else {
      items.push({ id, ...data });
    }
    setLocal(key, items);
  },
  
  deleteDocument: async (collection: string, id: string) => {
    const key = STORAGE_KEYS[collection.toUpperCase() as keyof typeof STORAGE_KEYS] || collection;
    const items = getLocal(key);
    setLocal(key, items.filter((i: any) => i.id !== id));
  },
  
  queryCollection: async (collection: string, field: string, op: string, value: any) => {
    const items = await db.getCollection(collection);
    return items.filter((item: any) => {
      if (op === '==') return item[field] === value;
      if (op === '!=') return item[field] !== value;
      return false;
    });
  }
};
