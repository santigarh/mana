import { useState, useCallback, useEffect } from 'react'
import { getPasajeDelDia, hoyISO } from '../lib/selector'
import type {
  Devocional,
  Pasaje,
  Tono,
  Extension,
  FaseGeneracion,
  ErrorGeneracion,
} from '../types'

// ═══════════════════════════════════════════════════════════════
//  HOOK: useDevocional
//  Gestiona la generación del devocional vía API /api/generate
// ═══════════════════════════════════════════════════════════════

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

interface UseDevocionalReturn {
  devocional: Devocional | null
  fase: FaseGeneracion
  error: ErrorGeneracion | null
  pasajeDelDia: Pasaje
  tono: Tono
  extension: Extension
  setTono: (t: Tono) => void
  setExtension: (e: Extension) => void
  generar: () => Promise<void>
  regenerar: () => Promise<void>
  limpiar: () => void
}

const STORAGE_KEY_HOY = 'devocional_hoy'

export function useDevocional(): UseDevocionalReturn {
  const hoy = hoyISO()
  const pasajeDelDia = getPasajeDelDia()

  const [devocional, setDevocional] = useState<Devocional | null>(() => {
    // Restaurar devocional del día si ya fue generado hoy
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HOY)
      if (!raw) return null
      const guardado = JSON.parse(raw) as Devocional
      if (guardado.fecha === hoy) return guardado
      return null
    } catch {
      return null
    }
  })

  const [fase, setFase] = useState<FaseGeneracion>(() =>
    devocional ? 'completado' : 'idle',
  )
  const [error, setError] = useState<ErrorGeneracion | null>(null)
  const [tono, setTono] = useState<Tono>('esperanzador')
  const [extension, setExtension] = useState<Extension>('normal')

  const generar = useCallback(
    async (forzar = false) => {
      // Si ya hay devocional de hoy y no es forzado, no regenerar
      if (devocional && devocional.fecha === hoy && !forzar) return

      setFase('generando')
      setError(null)

      try {
        const res = await fetch(`${BASE_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pasaje: pasajeDelDia,
            tono,
            extension,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? `Error HTTP ${res.status}`)
        }

        const data = await res.json()

        const nuevo: Devocional = {
          id: `${hoy}-${Date.now()}`,
          fecha: hoy,
          pasaje: pasajeDelDia,
          titulo: data.titulo,
          versiculo: data.versiculo,
          referencia: data.referencia,
          reflexion: data.reflexion,
          aplicacion: data.aplicacion,
          oracion: data.oracion,
          pregunta: data.pregunta,
          generadoEn: Date.now(),
        }

        setDevocional(nuevo)
        setFase('completado')

        // Persistir en localStorage
        localStorage.setItem(STORAGE_KEY_HOY, JSON.stringify(nuevo))
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido'
        setError({ mensaje })
        setFase('error')
      }
    },
    [devocional, hoy, pasajeDelDia, tono, extension],
  )

  // Auto-limpiar devocional de ayer al cambiar de día
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_HOY)
    if (raw) {
      try {
        const guardado = JSON.parse(raw) as Devocional
        if (guardado.fecha !== hoy) {
          localStorage.removeItem(STORAGE_KEY_HOY)
          setDevocional(null)
          setFase('idle')
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY_HOY)
      }
    }
  }, [hoy])

  return {
    devocional,
    fase,
    error,
    pasajeDelDia,
    tono,
    extension,
    setTono,
    setExtension,
    generar: () => generar(false),
    regenerar: () => generar(true),
    limpiar: () => {
      setDevocional(null)
      setFase('idle')
      setError(null)
    },
  }
}
