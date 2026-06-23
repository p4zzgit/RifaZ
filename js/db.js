
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

const API_BASE = '/api/db';

const getLocal = async (collection) => {
  try {
    const res = await fetch(`${API_BASE}/${collection}`);
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
};

const setLocal = async (collection, data, id) => {
  try {
    await fetch(`${API_BASE}/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data })
    });
  } catch (e) {
    console.error(e);
  }
};

// Initial Seed
export async function seedInitialData() {
  const users = await getLocal('usuarios');
  if (!users || users.length === 0) {
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      password: 'admin',
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
    
    await db.setDocument('usuarios', adminUser.id, adminUser);
    await db.setDocument('usuarios', demoUser.id, demoUser);
  }

  const config = await db.getDocument('config', 'main');
  if (!config || !config.platformName) {
    const defaultConfig = {
      id: 'main',
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
      footerText: '© 2026 Rifa Digital. Todos os direitos reservados.',
      taxaPercentual: 5,
      mercadopago: {
        accessToken: '',
        publicKey: '',
        isProduction: false
      }
    };
    await db.setDocument('config', 'main', defaultConfig);
  }
}

// Mimic Firebase API
export const db = {
  getCollection: async (collection) => {
    return getLocal(collection);
  },
  
  getDocument: async (collection, id) => {
    const items = await db.getCollection(collection);
    if (collection === 'config' && id === 'main') return items.find(i => i.id === 'main') || items[0];
    return items.find((i) => i.id === id);
  },
  
  setDocument: async (collection, id, data) => {
    await setLocal(collection, data, id);
  },
  
  deleteDocument: async (collection, id) => {
    try {
      await fetch(`${API_BASE}/${collection}/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  },
  
  queryCollection: async (collection, field, op, value) => {
    const items = await db.getCollection(collection);
    return items.filter((item) => {
      if (op === '==') return item[field] === value;
      if (op === '!=') return item[field] !== value;
      return false;
    });
  }
};

