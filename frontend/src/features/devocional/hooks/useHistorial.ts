import { useState, useCallback, useMemo } from 'react'
import type { EntradaHistorial, Historial, Devocional } from '../types'

// ═══════════════════════════════════════════════════════════════
//  HOOK: useHistorial
//  Gestiona el historial de devocionales y la racha de días
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'devocional_historial'
const MAX_ENTRADAS = 90 // ~3 meses

function calcularRacha(entradas: EntradaHistorial[]): { racha: number; rachaMaxima: number } {
  if (entradas.length === 0) return { racha: 0, rachaMaxima: 0 }

  const fechasLeidas = entradas
    .filter((e) => e.leido)
    .map((e) => e.fecha)
    .sort((a, b) => b.localeCompare(a)) // más reciente primero

  if (fechasLeidas.length === 0) return { racha: 0, rachaMaxima: 0 }

  const hoy = new Date().toISOString().split('T')[0]
  const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // La racha sólo cuenta si el último día leído es hoy o ayer
  const rachaActiva = fechasLeidas[0] === hoy || fechasLeidas[0] === ayer

  // Calcular racha consecutiva desde el primer elemento
  let rachaActual = 1
  let rachaMaxima = 1

  for (let i = 1; i < fechasLeidas.length; i++) {
    const prev = new Date(fechasLeidas[i - 1] + 'T12:00:00')
    const curr = new Date(fechasLeidas[i] + 'T12:00:00')
    const diffDias = Math.round((prev.getTime() - curr.getTime()) / 86400000)

    if (diffDias === 1) {
      rachaActual++
      rachaMaxima = Math.max(rachaMaxima, rachaActual)
    } else {
      // Si la racha principal ya se cortó, seguimos buscando la máxima
      if (i === 1 || rachaActual > 1) rachaMaxima = Math.max(rachaMaxima, rachaActual)
      rachaActual = 1
    }
  }
  rachaMaxima = Math.max(rachaMaxima, rachaActual)

  if (!rachaActiva) {
    return { racha: 0, rachaMaxima }
  }

  return { racha: rachaActual, rachaMaxima }
}

function cargarHistorial(): Historial {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { entradas: [], racha: 0, rachaMaxima: 0, ultimaFecha: null }
    }
    const entradas = JSON.parse(raw) as EntradaHistorial[]
    const { racha, rachaMaxima } = calcularRacha(entradas)
    const ultimaFecha = entradas.length > 0 ? entradas[0].fecha : null
    return { entradas, racha, rachaMaxima, ultimaFecha }
  } catch {
    return { entradas: [], racha: 0, rachaMaxima: 0, ultimaFecha: null }
  }
}

function guardarEntradas(entradas: EntradaHistorial[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entradas))
}

interface UseHistorialReturn {
  historial: Historial
  agregarDevocional: (devocional: Devocional) => void
  marcarLeido: (fecha: string) => void
  limpiarHistorial: () => void
  devocionalDeHoy: EntradaHistorial | undefined
}

export function useHistorial(): UseHistorialReturn {
  const [historial, setHistorial] = useState<Historial>(cargarHistorial)

  const agregarDevocional = useCallback((devocional: Devocional) => {
    setHistorial((prev) => {
      // Evitar duplicados por fecha
      const yaExiste = prev.entradas.some((e) => e.fecha === devocional.fecha)
      if (yaExiste) {
        // Actualizar la entrada existente
        const entradas = prev.entradas.map((e) =>
          e.fecha === devocional.fecha
            ? { ...e, devocionalId: devocional.id, devocional, leido: true }
            : e,
        )
        guardarEntradas(entradas)
        const { racha, rachaMaxima } = calcularRacha(entradas)
        return { entradas, racha, rachaMaxima, ultimaFecha: entradas[0]?.fecha ?? null }
      }

      const nuevaEntrada: EntradaHistorial = {
        fecha: devocional.fecha,
        devocionalId: devocional.id,
        devocional,
        leido: true,
      }

      // Ordenar por fecha desc y limitar
      const entradas = [nuevaEntrada, ...prev.entradas]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, MAX_ENTRADAS)

      guardarEntradas(entradas)
      const { racha, rachaMaxima } = calcularRacha(entradas)
      return {
        entradas,
        racha,
        rachaMaxima: Math.max(rachaMaxima, prev.rachaMaxima),
        ultimaFecha: entradas[0]?.fecha ?? null,
      }
    })
  }, [])

  const marcarLeido = useCallback((fecha: string) => {
    setHistorial((prev) => {
      const entradas = prev.entradas.map((e) =>
        e.fecha === fecha ? { ...e, leido: true } : e,
      )
      guardarEntradas(entradas)
      const { racha, rachaMaxima } = calcularRacha(entradas)
      return { ...prev, entradas, racha, rachaMaxima }
    })
  }, [])

  const limpiarHistorial = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistorial({ entradas: [], racha: 0, rachaMaxima: 0, ultimaFecha: null })
  }, [])

  const devocionalDeHoy = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return historial.entradas.find((e) => e.fecha === hoy)
  }, [historial.entradas])

  return { historial, agregarDevocional, marcarLeido, limpiarHistorial, devocionalDeHoy }
}
