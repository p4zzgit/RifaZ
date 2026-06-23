import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Persistent Data Helper
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const getFilePath = (collection: string) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection: string) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

const writeData = (collection: string, data: any) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
};

// --- API ROUTES ---

// Generic DB Routes
app.get("/api/db/:collection", (req, res) => {
  res.json(readData(req.params.collection));
});

app.post("/api/db/:collection", (req, res) => {
  const { id, data } = req.body;
  const items = readData(req.params.collection);
  const index = items.findIndex((i: any) => i.id === id);
  if (index >= 0) {
    items[index] = { ...items[index], ...data };
  } else {
    items.push({ id, ...data });
  }
  writeData(req.params.collection, items);
  res.json({ success: true });
});

app.delete("/api/db/:collection/:id", (req, res) => {
  const items = readData(req.params.collection);
  const filtered = items.filter((i: any) => i.id !== req.params.id);
  writeData(req.params.collection, filtered);
  res.json({ success: true });
});

// Mercado Pago Config Store
let mpConfig = {
  accessToken: process.env.MP_ACCESS_TOKEN || "",
  publicKey: process.env.MP_PUBLIC_KEY || "",
  isProduction: false
};

// Load MP config from main config file if exists
try {
  const configs = readData("config");
  const mainConfig = configs.find((c: any) => c.id === 'main') || configs[0];
  if (mainConfig?.mercadopago) {
    mpConfig = { ...mpConfig, ...mainConfig.mercadopago };
  }
} catch (e) {}

// Create Mercado Pago Preference
app.post("/api/payments/create", async (req, res) => {
  const { title, unit_price, quantity, metadata } = req.body;
  
  if (!mpConfig.accessToken) {
    return res.status(400).json({ error: "Mercado Pago não configurado" });
  }

  const client = new MercadoPagoConfig({ accessToken: mpConfig.accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [{
          id: metadata.id || 'item',
          title,
          unit_price: Number(unit_price),
          quantity: Number(quantity),
          currency_id: 'BRL'
        }],
        metadata,
        notification_url: `${req.protocol}://${req.get('host')}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${req.protocol}://${req.get('host')}/#/success`,
          failure: `${req.protocol}://${req.get('host')}/#/failure`,
          pending: `${req.protocol}://${req.get('host')}/#/pending`
        },
        auto_return: 'approved'
      }
    });

    res.json({ init_point: result.init_point, id: result.id });
  } catch (error: any) {
    console.error("MP Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook Mercado Pago
app.post("/api/webhooks/mercadopago", async (req, res) => {
  const { type, data } = req.body;
  console.log("Webhook received:", type, data);

  if (type === 'payment') {
    const paymentId = data.id;
    const client = new MercadoPagoConfig({ accessToken: mpConfig.accessToken });
    const payment = new Payment(client);

    try {
      const p = await payment.get({ id: paymentId });
      
      if (p.status === 'approved') {
        const metadata = p.metadata;
        console.log("Payment approved for:", metadata);

        if (metadata.type === 'rifa') {
          // 1. Confirm participation
          const participacoes = readData("participacoes");
          const partIndex = participacoes.findIndex((part: any) => part.id === metadata.participation_id);
          if (partIndex >= 0 && participacoes[partIndex].status !== 'pago') {
            participacoes[partIndex].status = 'pago';
            participacoes[partIndex].paymentId = paymentId;
            writeData("participacoes", participacoes);

            // 2. Update Rifa numbers
            const rifas = readData("rifas");
            const rifaIndex = rifas.findIndex((r: any) => r.id === metadata.rifa_id);
            if (rifaIndex >= 0) {
              const selectedNumbers = Array.isArray(metadata.numbers) ? metadata.numbers : JSON.parse(metadata.numbers);
              rifas[rifaIndex].bookedNumbers = [...(rifas[rifaIndex].bookedNumbers || []), ...selectedNumbers];
              writeData("rifas", rifas);

              // 3. Update Organizer Balance
              const organizerId = rifas[rifaIndex].userId;
              const users = readData("usuarios");
              const userIndex = users.findIndex((u: any) => u.id === organizerId);
              if (userIndex >= 0) {
                users[userIndex].saldo = (users[userIndex].saldo || 0) + Number(p.transaction_amount);
                writeData("usuarios", users);
              }
            }
          }
        } else if (metadata.type === 'bolao') {
          // Implement Bolão logic similar to Rifa
          const participacoes = readData("participacoes_bolao");
          const partIndex = participacoes.findIndex((part: any) => part.id === metadata.participation_id);
          if (partIndex >= 0 && participacoes[partIndex].status !== 'pago') {
            participacoes[partIndex].status = 'pago';
            participacoes[partIndex].paymentId = paymentId;
            writeData("participacoes_bolao", participacoes);

            const boloes = readData("boloes");
            const bolaoIndex = boloes.findIndex((b: any) => b.id === metadata.bolao_id);
            if (bolaoIndex >= 0) {
               const organizerId = boloes[bolaoIndex].userId;
               const users = readData("usuarios");
               const userIndex = users.findIndex((u: any) => u.id === organizerId);
               if (userIndex >= 0) {
                 users[userIndex].saldo = (users[userIndex].saldo || 0) + Number(p.transaction_amount);
                 writeData("usuarios", users);
               }
            }
          }
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  res.sendStatus(200);
});

// Test MP Connection
app.post("/api/admin/test-mp", async (req, res) => {
  const { accessToken } = req.body;
  try {
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    await payment.search({ options: { limit: 1 } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
