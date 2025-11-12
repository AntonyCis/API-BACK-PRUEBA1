import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DetectLanguage from "detectlanguage";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar cliente con tu API Key
const detectlanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);

app.post("/api/detect", async (req, res) => {
  const { text } = req.body;
  console.log("Texto recibido:", text);

  try {
    const result = await detectlanguage.detect(text);
    console.log("Resultado:", result);
    res.json(result);
  } catch (err) {
    console.error("Error en la API:", err);
    res.status(500).json({ error: "Error interno", details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
