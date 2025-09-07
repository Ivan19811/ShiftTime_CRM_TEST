// backend/index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// --- CORS allowlist: ╨┤╨╛╨┤╨░╨╣/╨╖╨╝╤Ц╨╜╨╕ ╤Б╨▓╨╛╤Ч ╨┤╨╛╨╝╨╡╨╜╨╕ ╤В╤Г╤В
const ALLOWLIST = [
  'https://shifttime.com.ua',                 // ╨┐╤А╨╛╨┤ (╤П╨║╤Й╨╛ ╤В╤А╨╡╨▒╨░)
  'https://crm.shifttime.com.ua',             // ╨┐╤А╨╛╨┤ CRM (╤П╨║╤Й╨╛ ╤Ф)
  'https://shifttime-crm-test.netlify.app',   // ╨▓╨░╤И ╤В╨╡╤Б╤В╨╛╨▓╨╕╨╣ Netlify
  'http://localhost:5173',                    // ╨╗╨╛╨║╨░╨╗╨║╨░ (vite)
  'http://localhost:3000'                     // ╨╗╨╛╨║╨░╨╗╨║╨░ (╤Ц╨╜╤И╨╡)
];

// ╨У╨╜╤Г╤З╨║╨░ ╨┐╨╡╤А╨╡╨▓╤Ц╤А╨║╨░ origin + ╨┐╤Ц╨┤╤В╤А╨╕╨╝╨║╨░ OPTIONS
app.use(cors({
  origin(origin, cb) {
    // ╨┤╨╛╨╖╨▓╨╛╨╗╤П╤Ф╨╝╨╛ ╨╖╨░╨┐╨╕╤В╨╕ ╨▒╨╡╨╖ Origin (╨╜╨░╨┐╤А╨╕╨║╨╗╨░╨┤, curl/healthchecks)
    if (!origin) return cb(null, true);
    cb(null, ALLOWLIST.includes(origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // ╤Й╨╛╨▒ ╨▒╤А╨░╤Г╨╖╨╡╤А ╨║╨╡╤И╤Г╨▓╨░╨▓ preflight
}));
app.options('*', cors());

<<<<<<< HEAD
// ЁЯФЧ URL ╨┤╨╛ Google Apps Script
const GAS_URL = "https://script.google.com/macros/s/AKfycbyfGKwSIEhASTWJaayjslWD6wOWDFYyznlmUFih9iofphjPBM4KZwaDdNluxeopkVtrfA/exec";
=======
// JSON body
app.use(express.json({ limit: '1mb' }));
>>>>>>> 71aa0ed (backend: update index.js (CORS allowlist & GAS_URL from env))

// --- URL ╨┤╨╛ GAS: ╨▒╨╡╤А╨╕ ╨╖ env ╨░╨▒╨╛ ╨╗╨╕╤И╨░╨╣ ╨┤╨╡╤Д╨╛╨╗╤В
const GAS_URL = process.env.SHEETS_WEBAPP_URL
  || 'https://script.google.com/macros/s/AKfycbyfGKwSIEhASTWJaayjslWD6wOWDFYyznlmUFih9iofphjPBM4KZwaDdNluxeopkVtrfA/exec';

// Healthcheck
app.get('/ping', (_, res) => res.type('text/plain').send('ok'));

// ╨Я╨╛╨▓╨╜╨░ ╤Д╨╛╤А╨╝╨░
app.post('/send', async (req, res) => {
  try {
    const r = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await r.text();
    // ╨п╨║╤Й╨╛ GAS ╨┐╨╛╨▓╨╡╤А╨╜╤Г╨▓ JSON тАФ ╨▓╤Ц╨┤╨┤╨░╤Ф╨╝╨╛ ╤П╨║ ╤Ф; ╤П╨║╤Й╨╛ ╨╜╤Ц тАФ 502 ╨╖ ╤Г╤А╤Ц╨╖╨░╨╜╨╕╨╝ ╤В╤Ц╨╗╨╛╨╝
    try {
      JSON.parse(text);
      return res.status(r.status).type('application/json').send(text);
    } catch {
      return res.status(502).json({ success: false, error: 'GAS returned non-JSON', body: text.slice(0, 500) });
    }
  } catch (err) {
    console.error('тЭМ /send error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// ╨Р╨╗╤М╤В╨╡╤А╨╜╨░╤В╨╕╨▓╨╜╨╕╨╣ ╨╝╨░╤А╤И╤А╤Г╤В тАФ ╨╗╨╕╤И╨╡ ╤З╨╕╤Б╨╗╨╛
app.post('/writeNumber', async (req, res) => {
  try {
    const payload = {
      surname: '',
      name: '',
      patronymic: '',
      number: req.body?.value || 0,
    };

    const r = await fetch(GAS_URL, {
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
    console.error('тЭМ /writeNumber error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`тЬЕ Proxy-╤Б╨╡╤А╨▓╨╡╤А ╨╖╨░╨┐╤Г╤Й╨╡╨╜╨╛ ╨╜╨░ ╨┐╨╛╤А╤В╤Г ${PORT}`));
