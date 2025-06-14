// backend/nova_poshta.js — ES-модуль (Node.js 23+)

import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// 🔐 Встав свій справжній API-ключ сюди
const NP_API_KEY = "a0102a00f2f88e7c84d935843d290edd";
const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";

// 🔗 GET /api/nova-poshta/areas — Отримати всі області
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
    console.error("❌ Помилка при запиті до НП:", error);
    res.status(500).json({ error: "Серверна помилка при отриманні областей" });
  }
});

export default router; // ✅ ES-модуль експортується як default
