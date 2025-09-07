// backend/index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// --- CORS allowlist: додай/зміни свої домени тут
const ALLOWLIST = [
  'https://shifttime.com.ua',                 // прод (якщо треба)
  'https://crm.shifttime.com.ua',             // прод CRM (якщо є)
  'https://shifttime-crm-test.netlify.app',   // ваш тестовий Netlify
  'http://localhost:5173',                    // локалка (vite)
  'http://localhost:3000'                     // локалка (інше)
];

// Гнучка перевірка origin + підтримка OPTIONS
app.use(cors({
  origin(origin, cb) {
    // дозволяємо запити без Origin (наприклад, curl/healthchecks)
    if (!origin) return cb(null, true);
    cb(null, ALLOWLIST.includes(origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // щоб браузер кешував preflight
}));
app.options('*', cors());

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
