const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS — дозвіл доступу з будь-якого сайту
app.use(cors());
app.options("*", cors());
app.use(express.json());

// 🔗 Посилання на Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// 🔽 Запис числа у Google Таблицю
app.post("/write", async (req, res) => {
  console.log("📩 POST /write отримано", req.body);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("✅ Дані записані:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка запису:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔼 Отримання останнього значення з Google Таблиці
app.get("/last", async (req, res) => {
  console.log("📥 GET /last запит");

  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    console.log("📤 Отримано з таблиці:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка отримання:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔄 Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер проксі запущено: http://localhost:${PORT}`);
});
