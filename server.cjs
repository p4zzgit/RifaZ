var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_vite = require("vite");
var import_mercadopago = require("mercadopago");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
var DATA_DIR = import_path.default.join(process.cwd(), "data");
if (!import_fs.default.existsSync(DATA_DIR)) import_fs.default.mkdirSync(DATA_DIR);
var getFilePath = (collection) => import_path.default.join(DATA_DIR, `${collection}.json`);
var readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!import_fs.default.existsSync(filePath)) return [];
  try {
    return JSON.parse(import_fs.default.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};
var writeData = (collection, data) => {
  import_fs.default.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
};
app.get("/api/db/:collection", (req, res) => {
  res.json(readData(req.params.collection));
});
app.post("/api/db/:collection", (req, res) => {
  const { id, data } = req.body;
  const items = readData(req.params.collection);
  const index = items.findIndex((i) => i.id === id);
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
  const filtered = items.filter((i) => i.id !== req.params.id);
  writeData(req.params.collection, filtered);
  res.json({ success: true });
});
var mpConfig = {
  accessToken: process.env.MP_ACCESS_TOKEN || "",
  publicKey: process.env.MP_PUBLIC_KEY || "",
  isProduction: false
};
try {
  const configs = readData("config");
  const mainConfig = configs.find((c) => c.id === "main") || configs[0];
  if (mainConfig?.mercadopago) {
    mpConfig = { ...mpConfig, ...mainConfig.mercadopago };
  }
} catch (e) {
}
app.post("/api/payments/create", async (req, res) => {
  const { title, unit_price, quantity, metadata } = req.body;
  if (!mpConfig.accessToken) {
    return res.status(400).json({ error: "Mercado Pago n\xE3o configurado" });
  }
  const client = new import_mercadopago.MercadoPagoConfig({ accessToken: mpConfig.accessToken });
  const preference = new import_mercadopago.Preference(client);
  try {
    const result = await preference.create({
      body: {
        items: [{
          id: metadata.id || "item",
          title,
          unit_price: Number(unit_price),
          quantity: Number(quantity),
          currency_id: "BRL"
        }],
        metadata,
        notification_url: `${req.protocol}://${req.get("host")}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${req.protocol}://${req.get("host")}/#/success`,
          failure: `${req.protocol}://${req.get("host")}/#/failure`,
          pending: `${req.protocol}://${req.get("host")}/#/pending`
        },
        auto_return: "approved"
      }
    });
    res.json({ init_point: result.init_point, id: result.id });
  } catch (error) {
    console.error("MP Error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/webhooks/mercadopago", async (req, res) => {
  const { type, data } = req.body;
  console.log("Webhook received:", type, data);
  if (type === "payment") {
    const paymentId = data.id;
    const client = new import_mercadopago.MercadoPagoConfig({ accessToken: mpConfig.accessToken });
    const payment = new import_mercadopago.Payment(client);
    try {
      const p = await payment.get({ id: paymentId });
      if (p.status === "approved") {
        const metadata = p.metadata;
        console.log("Payment approved for:", metadata);
        if (metadata.type === "rifa") {
          const participacoes = readData("participacoes");
          const partIndex = participacoes.findIndex((part) => part.id === metadata.participation_id);
          if (partIndex >= 0 && participacoes[partIndex].status !== "pago") {
            participacoes[partIndex].status = "pago";
            participacoes[partIndex].paymentId = paymentId;
            writeData("participacoes", participacoes);
            const rifas = readData("rifas");
            const rifaIndex = rifas.findIndex((r) => r.id === metadata.rifa_id);
            if (rifaIndex >= 0) {
              const selectedNumbers = Array.isArray(metadata.numbers) ? metadata.numbers : JSON.parse(metadata.numbers);
              rifas[rifaIndex].bookedNumbers = [...rifas[rifaIndex].bookedNumbers || [], ...selectedNumbers];
              writeData("rifas", rifas);
              const organizerId = rifas[rifaIndex].userId;
              const users = readData("usuarios");
              const userIndex = users.findIndex((u) => u.id === organizerId);
              if (userIndex >= 0) {
                users[userIndex].saldo = (users[userIndex].saldo || 0) + Number(p.transaction_amount);
                writeData("usuarios", users);
              }
            }
          }
        } else if (metadata.type === "bolao") {
          const participacoes = readData("participacoes_bolao");
          const partIndex = participacoes.findIndex((part) => part.id === metadata.participation_id);
          if (partIndex >= 0 && participacoes[partIndex].status !== "pago") {
            participacoes[partIndex].status = "pago";
            participacoes[partIndex].paymentId = paymentId;
            writeData("participacoes_bolao", participacoes);
            const boloes = readData("boloes");
            const bolaoIndex = boloes.findIndex((b) => b.id === metadata.bolao_id);
            if (bolaoIndex >= 0) {
              const organizerId = boloes[bolaoIndex].userId;
              const users = readData("usuarios");
              const userIndex = users.findIndex((u) => u.id === organizerId);
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
app.post("/api/admin/test-mp", async (req, res) => {
  const { accessToken } = req.body;
  try {
    const client = new import_mercadopago.MercadoPagoConfig({ accessToken });
    const payment = new import_mercadopago.Payment(client);
    await payment.search({ options: { limit: 1 } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
