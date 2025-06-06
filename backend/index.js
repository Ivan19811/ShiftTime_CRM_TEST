const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Дозволити CORS лише з Netlify
const allowedOrigins = ["https://shifttime-crm-test.netlify.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  }
}));

app.use(express.json());

// 🔗 Посилання на Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// ✍️ Запис числа
app.post("/write", async (req, res) => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка запису:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📥 Отримання останнього числа
app.get("/last", async (req, res) => {
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка отримання:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
