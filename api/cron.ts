// ═══════════════════════════════════════════════════════════════
//  API /api/cron — Cron job horario que envía devocionales
//  Protegida con CRON_SECRET en el header Authorization
//  Vercel la ejecuta cada hora según vercel.json
// ═══════════════════════════════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { construirPrompt, formatearParaWhatsApp } from '../shared/devocional/prompt'
import { seleccionarPasajeDelDia } from '../shared/devocional/selector'
import { PASAJES } from '../shared/devocional/pasajes'
import type { DevocionalInput } from '../shared/devocional/types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

// ── KV helpers ───────────────────────────────────────────────────
async function kvKeys(pattern: string): Promise<string[]> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return []

  const res = await fetch(`${url}/keys/${encodeURIComponent(pattern)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.result ?? []
}

async function kvGet<T>(key: string): Promise<T | null> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null

  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.result ?? null
}

// ── Groq generation ──────────────────────────────────────────────
async function generarDevocional(pasajeId: string, fecha: string): Promise<Record<string, string> | null> {
  const pasaje = PASAJES.find((p) => p.id === pasajeId) ?? seleccionarPasajeDelDia(fecha)
  const input: DevocionalInput = { pasaje, tono: 'esperanzador', extension: 'normal' }
  const prompt = construirPrompt(input)

  const groqRes = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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

  if (!groqRes.ok) return null
  const data = await groqRes.json()
  const raw = data.choices?.[0]?.message?.content ?? '{}'
  try { return JSON.parse(raw) } catch { return null }
}

// ── Twilio WhatsApp send ─────────────────────────────────────────
async function enviarWhatsApp(numero: string, mensaje: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_NUMBER ?? 'whatsapp:+14155238886'

  if (!sid || !token) return false

  const body = new URLSearchParams({
    From: from,
    To: `whatsapp:${numero}`,
    Body: mensaje,
  })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  return res.ok
}

// ── Handler ──────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verificar CRON_SECRET (Vercel lo pasa en Authorization header)
  const authHeader = req.headers.authorization ?? ''
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (process.env.CRON_SECRET && authHeader !== expected) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const fechaHoy = new Date().toISOString().split('T')[0]
  const horaUTC = new Date().getUTCHours()
  console.log(`[CRON] Ejecutando a las ${horaUTC}:00 UTC para fecha ${fechaHoy}`)

  // Obtener todas las suscripciones
  const keys = await kvKeys('suscripcion:*')
  if (keys.length === 0) {
    return res.status(200).json({ ok: true, procesados: 0, mensaje: 'Sin suscripciones' })
  }

  const pasajeHoy = seleccionarPasajeDelDia(fechaHoy)
  let devocionalCache: Record<string, string> | null = null
  let enviados = 0
  let errores = 0

  for (const key of keys) {
    try {
      const sub = await kvGet<{
        numero: string
        hora: string
        zonaHoraria: string
        activo: boolean
      }>(key)

      if (!sub || !sub.activo) continue

      // Convertir la hora local del usuario a UTC para comparar
      const [hH] = sub.hora.split(':').map(Number)
      const ahoraEnZona = new Date().toLocaleString('en-US', { timeZone: sub.zonaHoraria })
      const horaLocal = new Date(ahoraEnZona).getHours()

      if (horaLocal !== hH) continue // No es la hora de envío de este usuario

      // Generar devocional (reutiliza cache si mismo pasaje)
      if (!devocionalCache) {
        devocionalCache = await generarDevocional(pasajeHoy.id, fechaHoy)
      }
      if (!devocionalCache) continue

      const mensaje = formatearParaWhatsApp(
        {
          titulo: devocionalCache.titulo ?? '',
          versiculo: devocionalCache.versiculo ?? pasajeHoy.texto,
          referencia: devocionalCache.referencia ?? pasajeHoy.referencia,
          reflexion: devocionalCache.reflexion ?? '',
          aplicacion: devocionalCache.aplicacion ?? '',
          oracion: devocionalCache.oracion ?? '',
          pregunta: devocionalCache.pregunta ?? '',
        },
        fechaHoy,
      )

      const ok = await enviarWhatsApp(sub.numero, mensaje)
      if (ok) enviados++
      else errores++
    } catch (err) {
      console.error(`Error procesando ${key}:`, err)
      errores++
    }
  }

  console.log(`[CRON] Enviados: ${enviados}, Errores: ${errores}`)
  return res.status(200).json({ ok: true, enviados, errores, fecha: fechaHoy })
}
