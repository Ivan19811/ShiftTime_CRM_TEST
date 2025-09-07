// backend/index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// --- CORS allowlist: додай/зміни свої домени тут
// --- CORS: дозволяємо лише відомі origin'и і віддзеркалюємо їх у ACAO
const ALLOWLIST = new Set([
  'https://shifttime-crm-test.netlify.app',
  'https://shifttime.com.ua',
  'https://crm.shifttime.com.ua',
  'http://localhost:5173',
  'http://localhost:3000'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWLIST.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
  }
  next();
});

// JSON body
app.use(express.json({ limit: '1mb' }));

// --- URL до GAS: бери з env або лишай дефолт
const SHEETS_WEBAPP_URL = process.env.SHEETS_WEBAPP_URL
  || 'https://script.google.com/macros/s/AKfycbyfGKwSIEhASTWJaayjslWD6wOWDFYyznlmUFih9iofphjPBM4KZwaDdNluxeopkVtrfA/exec';

// Healthcheck
app.get('/ping', (_, res) => res.type('text/plain').send('ok'));

// Повна форма
app.post('/send', async (req, res) => {
  try {
    const r = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await r.text();
    // Якщо GAS повернув JSON — віддаємо як є; якщо ні — 502 з урізаним тілом
    try {
      JSON.parse(text);
      return res.status(r.status).type('application/json').send(text);
    } catch {
      return res.status(502).json({ success: false, error: 'GAS returned non-JSON', body: text.slice(0, 500) });
    }
  } catch (err) {
    console.error('❌ /send error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Альтернативний маршрут — лише число
app.post('/writeNumber', async (req, res) => {
  try {
    const payload = {
      surname: '',
      name: '',
      patronymic: '',
      number: req.body?.value || 0,
    };

    const r = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    try {
      JSON.parse(text);
      return res.status(r.status).type('application/json').send(text);
    } catch {
      return res.status(502).json({ success: false, error: 'GAS returned non-JSON', body: text.slice(0, 500) });
    }
  } catch (err) {
    console.error('❌ /writeNumber error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy-сервер запущено на порту ${PORT}`));
