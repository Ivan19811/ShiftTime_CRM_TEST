import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import novaPoshtaRoutes from "./nova_poshta.js"; // 🔗 // НОВА ПОШТА — підключаємо новий маршрут

const app = express();

// ✅ CORS-конфігурація для твого сайту на Netlify
const corsOptions = {
  origin: [
    "https://shifttime-crm-test.netlify.app", // Netlify
    "http://127.0.0.1:5500"                   // Live Server
  ],
  methods: "GET,POST",
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔗 Підключення всіх маршрутів Нової Пошти
app.use("/api/nova-poshta", novaPoshtaRoutes); // ➕ GET /api/nova-poshta/areas

// 🔗 URL до Google Apps Script
const GAS_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// 📤 Надсилання повної форми з CRM
app.post("/send", async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔢 Спрощений маршрут для запису одного числа
app.post("/writeNumber", async (req, res) => {
  try {
    const payload = {
      surname: "",
      name: "",
      patronymic: "",
      number: req.body.value || 0
    };

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ▶️ Запуск локального/серверного сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy-сервер запущено на порту ${PORT}`);
});
