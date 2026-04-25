// ═══════════════════════════════════════════════════════════════
//  TIPOS PRINCIPALES — Devocional Diario
// ═══════════════════════════════════════════════════════════════

export type Categoria =
  | 'identidad'
  | 'fe'
  | 'gracia'
  | 'sufrimiento'
  | 'oracion'
  | 'servicio'

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  identidad: 'Identidad en Cristo',
  fe: 'Fe y Confianza',
  gracia: 'Gracia y Misericordia',
  sufrimiento: 'Sufrimiento y Esperanza',
  oracion: 'Oración',
  servicio: 'Servicio y Misión',
}

export const CATEGORIA_EMOJIS: Record<Categoria, string> = {
  identidad: '✝️',
  fe: '🌿',
  gracia: '💛',
  sufrimiento: '🕊️',
  oracion: '🙏',
  servicio: '🤝',
}

export interface Pasaje {
  id: string
  referencia: string      // "Juan 3:16"
  texto: string           // Texto completo del versículo
  categoria: Categoria
}

export type Tono = 'esperanzador' | 'reflexivo' | 'confrontador' | 'consolador'
export type Extension = 'corto' | 'normal' | 'largo'

export interface DevocionalInput {
  pasaje: Pasaje
  tono: Tono
  extension: Extension
  temas?: string[]
}

export interface Devocional {
  id: string
  fecha: string           // ISO date: "2024-01-15"
  pasaje: Pasaje
  titulo: string
  versiculo: string       // Versículo central (puede ser ligeramente adaptado)
  referencia: string
  reflexion: string
  aplicacion: string
  oracion: string
  pregunta: string
  generadoEn: number      // timestamp
}

export interface EntradaHistorial {
  fecha: string           // ISO date
  devocionalId: string
  devocional: Devocional
  leido: boolean
}

export interface Historial {
  entradas: EntradaHistorial[]
  racha: number           // días consecutivos actuales
  rachaMaxima: number
  ultimaFecha: string | null
}

export interface ConfigWhatsApp {
  numero: string          // "+573001234567"
  hora: string            // "07:00"
  zonaHoraria: string     // "America/Bogota"
  activo: boolean
}

export interface EstadoApp {
  tema: 'claro' | 'oscuro'
  tono: Tono
  extension: Extension
}

export type FaseGeneracion = 'idle' | 'generando' | 'completado' | 'error'

export interface ErrorGeneracion {
  mensaje: string
  codigo?: string
}
