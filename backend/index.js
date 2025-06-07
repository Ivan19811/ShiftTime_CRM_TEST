const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRdjsoZ6uT6S2nioFn_7s6A1SCLt7GQsj5ib5enKwkzd5tDEp_AroxmXLLec5BDuW1/exec";

// Статус кореневого роуту (для перевірки)
app.get("/", (req, res) => {
  res.send("✅ ShiftTime Backend працює");
});

// POST: запис у Google Таблицю
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
    res.status(500).json({ error: "❌ Помилка запису: " + err.message });
  }
});

// GET: отримання останнього значення
app.get("/last", async (req, res) => {
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Помилка отримання: " + err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`);
});

