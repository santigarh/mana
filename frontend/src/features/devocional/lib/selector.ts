import { PASAJES } from './pasajes'
import type { Pasaje } from '../types'

// ═══════════════════════════════════════════════════════════════
//  SELECTOR DETERMINISTA DE PASAJE DEL DÍA
//  - Mismo pasaje para todos los usuarios en la misma fecha
//  - Evita repetir los últimos 7 días
//  - Cicla ordenadamente por los pasajes disponibles
// ═══════════════════════════════════════════════════════════════

/**
 * Convierte una fecha ISO ("2024-01-15") a un número entero
 * contando los días desde el epoch (2000-01-01).
 */
function fechaADias(fechaISO: string): number {
  const [y, m, d] = fechaISO.split('-').map(Number)
  const epoch = new Date(2000, 0, 1)
  const fecha = new Date(y, m - 1, d)
  const diff = fecha.getTime() - epoch.getTime()
  return Math.floor(diff / 86_400_000)
}

/**
 * Devuelve la fecha de hoy en formato ISO local ("YYYY-MM-DD")
 */
export function hoyISO(): string {
  const hoy = new Date()
  const y = hoy.getFullYear()
  const m = String(hoy.getMonth() + 1).padStart(2, '0')
  const d = String(hoy.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Selecciona el pasaje del día basándose en la fecha.
 * @param fechaISO  Fecha en formato "YYYY-MM-DD"
 * @param excluidos IDs de pasajes usados en los últimos 7 días
 */
export function seleccionarPasajeDelDia(
  fechaISO: string,
  excluidos: string[] = [],
): Pasaje {
  const disponibles = PASAJES.filter((p) => !excluidos.includes(p.id))
  const pool = disponibles.length > 0 ? disponibles : PASAJES // fallback

  const indice = fechaADias(fechaISO) % pool.length
  return pool[indice]
}

/**
 * Obtiene los IDs de los últimos N días de historial desde localStorage.
 * Guard de entorno: retorna [] si se ejecuta fuera del browser (Node.js / SSR).
 */
export function obtenerIdsRecientes(diasAtras = 7): string[] {
  // Seguro para Node.js — las API serverless nunca llaman esta función
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem('devocional_historial')
    if (!raw) return []
    const historial = JSON.parse(raw) as Array<{ fecha: string; pasaje: { id: string } }>
    const hoy = new Date()
    const cutoff = new Date(hoy)
    cutoff.setDate(cutoff.getDate() - diasAtras)

    return historial
      .filter((e) => new Date(e.fecha) >= cutoff)
      .map((e) => e.pasaje?.id)
      .filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Pasaje del día (función de conveniencia)
 */
export function getPasajeDelDia(): Pasaje {
  const fecha = hoyISO()
  const recientes = obtenerIdsRecientes(7)
  return seleccionarPasajeDelDia(fecha, recientes)
}
