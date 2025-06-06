const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors()); // ✅ ДОЗВОЛЯЄ ВСІ ОРИГІНИ
app.use(express.json());

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// ✅ Запис числа
app.post("/write", async (req, res) => {
  try {
    console.log("📨 POST /write", req.body);
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    console.log("✅ Response from GAS:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка /write:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Отримати останнє значення
app.get("/last", async (req, res) => {
  try {
    console.log("📥 GET /last");
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    console.log("✅ Останнє значення:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка /last:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
