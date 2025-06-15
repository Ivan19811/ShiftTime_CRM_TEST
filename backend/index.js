import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import novaPoshtaRoutes from "./nova_poshta.js"; // 🔗 // НОВА ПОШТА — підключаємо новий маршрут

const app = express();

// ✅ CORS-конфігурація для твого сайту на Netlify + Live Server
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

// 🔗 URL до Google Apps Script (GAS)
const GAS_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// 📤 НАДСИЛАННЯ ДАНИХ ФОРМИ ДО GOOGLE APPS SCRIPT ЧЕРЕЗ ПРОКСІ
// 📌 ЦЕЙ МАРШРУТ /send ВИКОРИСТОВУЄТЬСЯ НА ФРОНТЕНДІ ЗАМІСТЬ ПРЯМОГО ЗВЕРНЕННЯ ДО GAS
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
    console.error("❌ ПОМИЛКА ПРОКСІ /send:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔢 СПРОЩЕНИЙ МАРШРУТ ДЛЯ ЗАПИСУ ЛИШЕ ОДНОГО ЧИСЛА
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
    console.error("❌ ПОМИЛКА ПРОКСІ /writeNumber:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ▶️ ЗАПУСК СЕРВЕРА ЛОКАЛЬНО ЧИ НА RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy-сервер запущено на порту ${PORT}`);
});
