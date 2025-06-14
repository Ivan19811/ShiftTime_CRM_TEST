// backend/nova_poshta.js — повністю з двома маршрутами (області + міста)

import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// 🔐 API-ключ Нової Пошти
const NP_API_KEY = "a0102a00f2f88e7c84d935843d290edd"; // <-- заміни на свій ключ
const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";

// ✅ 1. Отримання списку областей
router.get("/areas", async (req, res) => {
  try {
    const response = await fetch(NP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "getAreas",
        methodProperties: {}
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ /areas: помилка при запиті до НП:", error);
    res.status(500).json({ error: "Помилка при отриманні областей" });
  }
});

// ✅ 2. Отримання міст по області (areaRef)
router.get("/cities", async (req, res) => {
  const areaRef = req.query.areaRef; // 🧠 отримуємо Ref області з параметра URL

  if (!areaRef) {
    return res.status(400).json({ error: "areaRef обовʼязковий" });
  }

  try {
    const response = await fetch(NP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: {
          AreaRef: areaRef
        }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ /cities: помилка при запиті до НП:", error);
    res.status(500).json({ error: "Помилка при отриманні міст" });
  }
});

export default router;
