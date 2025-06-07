const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

console.log("✅ index.js запущено");

app.post("/write", async (req, res) => {
  console.log("📨 Отримано POST-запит на /write");
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    console.log("✅ Дані записані:", data);
    res.json(data);

  } catch (err) {
    console.error("❌ Помилка запису:", err.message);
    res.status(500).json({ error: "❌ Помилка запису: " + err.message });
  }
});

app.get("/last", async (req, res) => {
  console.log("📥 Отримано GET-запит на /last");
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    console.log("✅ Отримано дані:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Помилка отримання:", err.message);
    res.status(500).json({ error: "❌ Помилка отримання: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено. Слухає порт ${PORT}`);
});
