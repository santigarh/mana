// ═══════════════════════════════════════════════════════════════
//  API /api/schedule — Guarda suscripción de WhatsApp
//  Usa Upstash Redis (HTTP REST API — sin dependencias extra)
// ═══════════════════════════════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SuscripcionWA {
  numero: string
  hora: string        // "07:00"
  zonaHoraria: string // "America/Bogota"
  activo: boolean
  creadoEn: number
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('KV store no configurado')

  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`KV set error: ${err}`)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { numero, hora, zonaHoraria, activo } = req.body ?? {}

  if (!numero || typeof numero !== 'string') {
    return res.status(400).json({ error: 'Falta el número de WhatsApp' })
  }

  // Normalizar número
  const numeroLimpio = numero.replace(/\s+/g, '').replace(/[^+\d]/g, '')
  if (!/^\+\d{7,15}$/.test(numeroLimpio)) {
    return res.status(400).json({ error: 'Número inválido. Usa formato +573001234567' })
  }

  const suscripcion: SuscripcionWA = {
    numero: numeroLimpio,
    hora: hora ?? '07:00',
    zonaHoraria: zonaHoraria ?? 'America/Bogota',
    activo: activo !== false,
    creadoEn: Date.now(),
  }

  try {
    // Key: "suscripcion:<numero>" — cada número tiene una sola suscripción
    await kvSet(`suscripcion:${numeroLimpio}`, suscripcion)
    return res.status(200).json({ ok: true, suscripcion })
  } catch (err) {
    console.error('Error guardando suscripción:', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Error al guardar' })
  }
}
