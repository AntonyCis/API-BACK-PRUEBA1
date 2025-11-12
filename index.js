// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DetectLanguage from "detectlanguage";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ================== CONFIGURACIÓN ==================
const PORT = process.env.PORT || 4000;
const PRIVATE_TOKEN = "mi_token_super_privado";
const detectlanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);

// ================== MIDDLEWARE ==================
function verificarToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (token !== PRIVATE_TOKEN) {
    return res.status(403).json({ mensaje: "Acceso denegado: token inválido o ausente" });
  }
  next();
}

// ================== RUTA 1: DETECCIÓN DE IDIOMA ==================
app.post("/api/detect", async (req, res) => {
  const { text } = req.body;
  try {
    const result = await detectlanguage.detect(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error interno", details: err.message });
  }
});

// ================== RUTA 2: ANÁLISIS PRIVADO ==================
function analizarRespuesta(respuesta) {
  const texto = respuesta.toLowerCase();
  const tecnicas = ["java", "python", "javascript", "sql", "react"];
  const comunicacion = ["equipo", "liderazgo", "comunicación"];
  const actitud = ["responsable", "proactivo", "puntual"];

  const scoreTec = tecnicas.filter(p => texto.includes(p)).length * 15;
  const scoreCom = comunicacion.filter(p => texto.includes(p)).length * 10;
  const scoreAct = actitud.filter(p => texto.includes(p)).length * 8;

  const total = Math.min(100, (scoreTec * 0.5 + scoreCom * 0.3 + scoreAct * 0.2) + Math.random() * 15);
  const nivel = total < 40 ? "Bajo" : total < 70 ? "Intermedio" : "Avanzado";

  return {
    puntaje: total.toFixed(1),
    nivel,
    retroalimentacion: "Análisis completado correctamente"
  };
}

app.post("/api/analizar", verificarToken, (req, res) => {
  const { respuesta } = req.body;
  if (!respuesta) return res.status(400).json({ mensaje: "Falta 'respuesta'" });
  const resultado = analizarRespuesta(respuesta);
  res.json({ resultado });
});

// ================== RUTA DE PRUEBA ==================
app.get("/", (req, res) => {
  res.send("✅ API combinada corriendo correctamente");
});

app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
