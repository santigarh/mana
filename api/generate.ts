// ═══════════════════════════════════════════════════════════════
//  API /api/generate — Genera el devocional vía Groq
//  Vercel Serverless Function (Node 20)
// ═══════════════════════════════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { construirPrompt } from '../frontend/src/features/devocional/lib/prompt'
import type { DevocionalInput } from '../frontend/src/features/devocional/types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Modelo gratuito más rápido de Groq: llama-3.1-8b-instant
// Alternativa más potente: llama-3.3-70b-versatile (también gratis)
const GROQ_MODEL = 'llama-3.1-8b-instant'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY no configurada' })

  try {
    const body = req.body as DevocionalInput
    if (!body?.pasaje?.referencia) {
      return res.status(400).json({ error: 'Falta el campo pasaje en el cuerpo' })
    }

    const prompt = construirPrompt(body)

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.75,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('Error Groq:', err)
      return res.status(502).json({ error: 'Error al llamar a Groq', detalle: err })
    }

    const data = await groqRes.json()
    const raw = data.choices?.[0]?.message?.content ?? '{}'

    let devocional: Record<string, string>
    try {
      devocional = JSON.parse(raw)
    } catch {
      // Intentar extraer JSON si hay texto extra
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('Respuesta de Groq no es JSON válido')
      devocional = JSON.parse(match[0])
    }

    // Validar campos requeridos
    const campos = ['titulo', 'versiculo', 'referencia', 'reflexion', 'aplicacion', 'oracion', 'pregunta']
    for (const campo of campos) {
      if (!devocional[campo]) devocional[campo] = `[${campo} no generado]`
    }

    return res.status(200).json(devocional)
  } catch (err) {
    console.error('Error en /api/generate:', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Error interno' })
  }
}
