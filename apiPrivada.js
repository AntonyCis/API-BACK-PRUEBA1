// apiPrivada.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4001;
const PRIVATE_TOKEN = "mi_token_super_privado"; // Token fijo para acceso privado

// Middleware para verificar el token del header
function verificarToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (token !== PRIVATE_TOKEN) {
    return res.status(403).json({ mensaje: "Acceso denegado: token inválido o ausente" });
  }
  next();
}

// 🧠 Simulación avanzada de retroalimentación tipo IA
function analizarRespuesta(respuesta) {
  const texto = respuesta.toLowerCase();

  // Palabras clave por categoría
  const tecnicas = ["java", "python", "javascript", "sql", "react", "backend", "frontend"];
  const comunicacion = ["equipo", "liderazgo", "comunicación", "aprendizaje", "colaboración"];
  const actitud = ["responsable", "proactivo", "puntual", "honesto", "creativo"];

  // Conteo de coincidencias
  const scoreTec = tecnicas.filter(p => texto.includes(p)).length * 15;
  const scoreCom = comunicacion.filter(p => texto.includes(p)).length * 10;
  const scoreAct = actitud.filter(p => texto.includes(p)).length * 8;

  // Puntaje final ponderado + variación aleatoria
  const total = Math.min(100, (scoreTec * 0.5 + scoreCom * 0.3 + scoreAct * 0.2) + Math.random() * 15);
  const nivel = total < 40 ? "Bajo" : total < 70 ? "Intermedio" : "Avanzado";

  // Feedback detallado
  const feedback = {
    tecnico:
      scoreTec > 30
        ? "Demuestras buen dominio técnico y conocimiento de herramientas clave."
        : "Podrías incluir más detalles sobre tecnologías o proyectos en los que hayas trabajado.",
    comunicacion:
      scoreCom > 20
        ? "Buena capacidad para trabajar en equipo y expresar ideas con claridad."
        : "Sería útil que menciones ejemplos concretos de cómo colaboras o lideras equipos.",
    actitud:
      scoreAct > 15
        ? "Tu actitud profesional es destacable, reflejas responsabilidad y proactividad."
        : "Podrías reforzar aspectos como la iniciativa o la creatividad en tus respuestas."
  };

  const recomendacion =
    nivel === "Bajo"
      ? "Practica estructurar tus respuestas: inicia con tu experiencia, añade un logro y finaliza con una reflexión personal."
      : nivel === "Intermedio"
      ? "Buen desempeño. Refuerza tus ejemplos técnicos y resultados medibles para mejorar aún más."
      : "Excelente nivel. Mantén ese enfoque y procura usar métricas concretas para reforzar tus logros.";

  return {
    puntaje: total.toFixed(1),
    nivel,
    feedback,
    recomendacion
  };
}

// 🔐 Endpoint protegido
app.post("/api/analizar", verificarToken, (req, res) => {
  const { respuesta } = req.body;
  if (!respuesta) return res.status(400).json({ mensaje: "Falta el campo 'respuesta'" });

  const resultado = analizarRespuesta(respuesta);
  res.json({
    resultado,
    mensaje: "Análisis completado con éxito"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API privada corriendo en http://localhost:${PORT}`);
});