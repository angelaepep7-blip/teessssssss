import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { APIS } from "./api1.js"; // Mengambil konfigurasi dari api1.js kamu

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Melayani file statis (index.html, video, mp3, js)
app.use(express.static(__dirname));

const API_KEY = process.env.RANGGA_API_KEY;
const BASE_URL = process.env.RANGGA_BASE_URL || "https://api.ranggacode.my.id";

// Endpoint untuk daftar API
app.get("/api/list", (req, res) => {
  try {
    const apiList = Object.values(APIS).map(({ endpoint, map, method, ...rest }) => rest);
    res.json({ apis: apiList });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil daftar API" });
  }
});

// Endpoint untuk eksekusi API
app.post("/api/run", async (req, res) => {
  const { api, inputs } = req.body;
  const config = APIS[api];

  if (!config) {
    return res.status(400).json({ error: "API tidak ditemukan" });
  }

  try {
    const payload = config.map ? config.map(inputs) : inputs;
    const url = `${BASE_URL}${config.endpoint}?apikey=${API_KEY}`;
    
    const response = await fetch(url, {
      method: config.method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.json({ kind: config.kind || "data", data });
  } catch (err) {
    res.status(500).json({ error: err.message || "Gagal memproses request" });
  }
});

// Fallback ke index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
