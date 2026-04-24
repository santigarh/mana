import type { DevocionalInput, Tono, Extension } from '../types'

// ═══════════════════════════════════════════════════════════════
//  CONSTRUCTOR DE PROMPT PARA GROQ
// ═══════════════════════════════════════════════════════════════

const TONO_DESC: Record<Tono, string> = {
  esperanzador: 'esperanzador y alentador, lleno de fe en el futuro',
  reflexivo: 'reflexivo y contemplativo, invitando a la meditación profunda',
  confrontador: 'confrontador y desafiante, llamando al arrepentimiento y cambio',
  consolador: 'consolador y compasivo, para momentos de dolor o dificultad',
}

const EXTENSION_DESC: Record<Extension, { reflexion: string; aplicacion: string }> = {
  corto:  { reflexion: '80-120 palabras',  aplicacion: '40-60 palabras' },
  normal: { reflexion: '150-200 palabras', aplicacion: '80-120 palabras' },
  largo:  { reflexion: '250-350 palabras', aplicacion: '120-180 palabras' },
}

export function construirPrompt(input: DevocionalInput): string {
  const { pasaje, tono, extension, temas } = input
  const tonoDesc = TONO_DESC[tono]
  const ext = EXTENSION_DESC[extension]
  const temasStr = temas && temas.length > 0 ? `\nTemas específicos a enfatizar: ${temas.join(', ')}.` : ''

  return `Eres un pastor y teólogo cristiano experto. Genera un devocional diario bíblico completo en español basado en el siguiente versículo.

VERSÍCULO BASE:
"${pasaje.texto}"
— ${pasaje.referencia}

TONO: ${tonoDesc}
EXTENSIÓN: reflexión de ${ext.reflexion}, aplicación de ${ext.aplicacion}${temasStr}

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin explicaciones fuera del JSON) con exactamente esta estructura:

{
  "titulo": "Título inspirador del devocional (máximo 8 palabras)",
  "versiculo": "El versículo central textual o una porción clave de él",
  "referencia": "${pasaje.referencia}",
  "reflexion": "Reflexión teológica profunda y accesible sobre el versículo. Conecta el contexto bíblico original con la vida contemporánea. Usa lenguaje cálido y pastoral.",
  "aplicacion": "Aplicación práctica concreta para el día de hoy. Máximo 1-2 acciones específicas que el lector puede hacer hoy.",
  "oracion": "Oración sugerida de 2-3 oraciones en primera persona, basada en el versículo. Que sea íntima y sincera.",
  "pregunta": "Una pregunta reflexiva para que el lector medite durante el día. Que sea personal y específica."
}

IMPORTANTE:
- El JSON debe ser válido y parseable
- Usa comillas dobles para strings
- No uses caracteres especiales que rompan el JSON
- El lenguaje debe ser accesible, cálido y no condescendiente
- Evita el lenguaje religioso vacío o clichés`
}

export function formatearParaWhatsApp(
  devocional: {
    titulo: string
    versiculo: string
    referencia: string
    reflexion: string
    aplicacion: string
    oracion: string
    pregunta: string
  },
  fecha: string,
): string {
  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `✝️ *Devocional de hoy*
📅 ${fechaFormateada}

📖 "${devocional.versiculo}"
— ${devocional.referencia}

🔍 *Reflexión*
${devocional.reflexion}

✋ *Para hoy*
${devocional.aplicacion}

🙏 *Oración*
${devocional.oracion}

💭 ${devocional.pregunta}`
}

export function formatearComoMarkdown(devocional: {
  titulo: string
  versiculo: string
  referencia: string
  reflexion: string
  aplicacion: string
  oracion: string
  pregunta: string
  fecha?: string
}): string {
  return `# ${devocional.titulo}

> "${devocional.versiculo}"
> — *${devocional.referencia}*

## Reflexión

${devocional.reflexion}

## Aplicación práctica

${devocional.aplicacion}

## Oración

*${devocional.oracion}*

---

**Pregunta del día:** ${devocional.pregunta}
`
}
