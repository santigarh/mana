import { useState, useEffect, useRef } from 'react'
import { useDevocional } from './hooks/useDevocional'
import { useHistorial } from './hooks/useHistorial'
import { formatearComoMarkdown, formatearParaWhatsApp } from './lib/prompt'
import { CATEGORIA_LABELS, CATEGORIA_EMOJIS } from './types'
import type { ConfigWhatsApp, Tono, Extension } from './types'

// ═══════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const TIMEZONES = [
  'America/Bogota',
  'America/Lima',
  'America/Santiago',
  'America/Buenos_Aires',
  'America/Mexico_City',
  'America/Caracas',
  'America/La_Paz',
  'America/Guayaquil',
  'Europe/Madrid',
  'America/New_York',
]

function hoyLabel(): string {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DevocionalApp({ darkMode }: { darkMode: boolean }) {
  const { devocional, fase, error, pasajeDelDia, tono, extension, setTono, setExtension, generar, regenerar } =
    useDevocional()
  const { historial, agregarDevocional } = useHistorial()

  const [vista, setVista] = useState<'devocional' | 'historial'>('devocional')
  const [whatsappPanel, setWhatsappPanel] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [configWA, setConfigWA] = useState<ConfigWhatsApp>(() => {
    try {
      const raw = localStorage.getItem('devocional_wa_config')
      return raw ? JSON.parse(raw) : { numero: '', hora: '07:00', zonaHoraria: 'America/Bogota', activo: false }
    } catch {
      return { numero: '', hora: '07:00', zonaHoraria: 'America/Bogota', activo: false }
    }
  })
  const [guardandoWA, setGuardandoWA] = useState(false)
  const [waGuardado, setWaGuardado] = useState(false)
  const [waError, setWaError] = useState('')

  const tarjetaRef = useRef<HTMLDivElement>(null)

  // Al completar generación, agregar al historial
  useEffect(() => {
    if (devocional && fase === 'completado') {
      agregarDevocional(devocional)
    }
  }, [devocional, fase, agregarDevocional])

  // ── Copiar al portapapeles ──────────────────────────────────
  async function copiarPortapapeles() {
    if (!devocional) return
    const texto = formatearComoMarkdown(devocional)
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  // ── Exportar Markdown ───────────────────────────────────────
  function exportarMarkdown() {
    if (!devocional) return
    const texto = formatearComoMarkdown(devocional)
    const blob = new Blob([texto], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devocional-${devocional.fecha}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Exportar texto plano ────────────────────────────────────
  function exportarTexto() {
    if (!devocional) return
    const texto = [
      devocional.titulo,
      '',
      `"${devocional.versiculo}"`,
      `— ${devocional.referencia}`,
      '',
      'REFLEXIÓN',
      devocional.reflexion,
      '',
      'PARA HOY',
      devocional.aplicacion,
      '',
      'ORACIÓN',
      devocional.oracion,
      '',
      `Pregunta del día: ${devocional.pregunta}`,
    ].join('\n')
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devocional-${devocional.fecha}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Abrir WhatsApp con wa.me ────────────────────────────────
  function abrirWhatsApp() {
    if (!devocional) return
    const texto = formatearParaWhatsApp(devocional, devocional.fecha)
    const encoded = encodeURIComponent(texto)
    const numero = configWA.numero.replace(/\D/g, '')
    window.open(
      numero ? `https://wa.me/${numero}?text=${encoded}` : `https://wa.me/?text=${encoded}`,
      '_blank',
    )
  }

  // ── Guardar config WhatsApp (backend schedule) ──────────────
  async function guardarConfigWA() {
    if (!configWA.numero) {
      setWaError('Ingresa tu número de WhatsApp')
      return
    }
    setGuardandoWA(true)
    setWaError('')
    try {
      const res = await fetch(`${BASE_URL}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configWA),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      localStorage.setItem('devocional_wa_config', JSON.stringify(configWA))
      setWaGuardado(true)
      setTimeout(() => setWaGuardado(false), 3000)
    } catch {
      setWaError('No se pudo guardar. Verifica la conexión.')
    } finally {
      setGuardandoWA(false)
    }
  }

  // ── Streak badge ────────────────────────────────────────────
  const rachaEmoji = historial.racha >= 30 ? '🔥🔥🔥' : historial.racha >= 7 ? '🔥🔥' : '🔥'

  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">✝️</span>
          <div>
            <h1 className="app-title">Devocional Diario</h1>
            <p className="app-fecha">{hoyLabel()}</p>
          </div>
        </div>
        {historial.racha > 0 && (
          <div className="streak-badge" title={`Racha actual: ${historial.racha} días`}>
            {rachaEmoji} <strong>{historial.racha}</strong>
            <span className="streak-label">días</span>
          </div>
        )}
      </header>

      {/* ── TABS ───────────────────────────────────────────── */}
      <nav className="tabs">
        <button
          className={`tab${vista === 'devocional' ? ' tab--active' : ''}`}
          onClick={() => setVista('devocional')}
        >
          📖 Devocional
        </button>
        <button
          className={`tab${vista === 'historial' ? ' tab--active' : ''}`}
          onClick={() => setVista('historial')}
        >
          📅 Historial ({historial.entradas.length})
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════
          VISTA: DEVOCIONAL
      ══════════════════════════════════════════════════════ */}
      {vista === 'devocional' && (
        <main className="main-content">
          {/* Pasaje del día */}
          <section className="pasaje-del-dia">
            <div className="pasaje-header">
              <span className="categoria-emoji">
                {CATEGORIA_EMOJIS[pasajeDelDia.categoria]}
              </span>
              <div>
                <p className="categoria-label">{CATEGORIA_LABELS[pasajeDelDia.categoria]}</p>
                <p className="pasaje-referencia">{pasajeDelDia.referencia}</p>
              </div>
            </div>
            <blockquote className="pasaje-texto">{pasajeDelDia.texto}</blockquote>
          </section>

          {/* Controles de configuración */}
          {fase !== 'completado' && (
            <section className="controles">
              <div className="control-group">
                <label className="control-label">Tono</label>
                <div className="control-pills">
                  {(['esperanzador', 'reflexivo', 'confrontador', 'consolador'] as Tono[]).map((t) => (
                    <button
                      key={t}
                      className={`pill${tono === t ? ' pill--active' : ''}`}
                      onClick={() => setTono(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="control-group">
                <label className="control-label">Extensión</label>
                <div className="control-pills">
                  {(['corto', 'normal', 'largo'] as Extension[]).map((e) => (
                    <button
                      key={e}
                      className={`pill${extension === e ? ' pill--active' : ''}`}
                      onClick={() => setExtension(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Botón generar */}
          {fase !== 'completado' && (
            <button
              className={`btn-generar${fase === 'generando' ? ' btn-generar--loading' : ''}`}
              onClick={generar}
              disabled={fase === 'generando'}
            >
              {fase === 'generando' ? (
                <>
                  <span className="spinner" />
                  Generando devocional...
                </>
              ) : (
                <>✨ Generar devocional</>
              )}
            </button>
          )}

          {/* Error */}
          {fase === 'error' && error && (
            <div className="error-banner">
              <span>⚠️ {error.mensaje}</span>
              <button className="btn-retry" onClick={generar}>
                Reintentar
              </button>
            </div>
          )}

          {/* ── TARJETA DEVOCIONAL ───────────────────────── */}
          {fase === 'completado' && devocional && (
            <article className="devocional-card" ref={tarjetaRef}>
              <h2 className="devocional-titulo">{devocional.titulo}</h2>

              <div className="devocional-versiculo-wrap">
                <blockquote className="devocional-versiculo">
                  "{devocional.versiculo}"
                </blockquote>
                <cite className="devocional-referencia">— {devocional.referencia}</cite>
              </div>

              <section className="devocional-seccion">
                <h3 className="seccion-titulo">🔍 Reflexión</h3>
                <p className="seccion-texto">{devocional.reflexion}</p>
              </section>

              <section className="devocional-seccion">
                <h3 className="seccion-titulo">✋ Para hoy</h3>
                <p className="seccion-texto">{devocional.aplicacion}</p>
              </section>

              <section className="devocional-seccion devocional-oracion">
                <h3 className="seccion-titulo">🙏 Oración</h3>
                <p className="seccion-texto oracion-texto">{devocional.oracion}</p>
              </section>

              <div className="devocional-pregunta">
                <span className="pregunta-icon">💭</span>
                <p className="pregunta-texto">{devocional.pregunta}</p>
              </div>

              {/* Acciones */}
              <div className="acciones">
                <button className="btn-accion" onClick={copiarPortapapeles} title="Copiar al portapapeles">
                  {copiado ? '✅ Copiado' : '📋 Copiar'}
                </button>
                <button className="btn-accion" onClick={exportarMarkdown} title="Exportar como Markdown">
                  📝 .md
                </button>
                <button className="btn-accion" onClick={exportarTexto} title="Exportar como texto">
                  📄 .txt
                </button>
                <button className="btn-accion btn-wa" onClick={abrirWhatsApp} title="Enviar por WhatsApp">
                  💬 WhatsApp
                </button>
                <button className="btn-accion btn-regenerar" onClick={regenerar} title="Regenerar devocional">
                  🔄
                </button>
              </div>
            </article>
          )}

          {/* ── PANEL WHATSAPP AUTOMÁTICO ────────────────── */}
          <div className="wa-panel-wrap">
            <button
              className="wa-panel-toggle"
              onClick={() => setWhatsappPanel((p) => !p)}
              aria-expanded={whatsappPanel}
            >
              <span>📲 Envío automático por WhatsApp</span>
              <span className={`chevron${whatsappPanel ? ' chevron--up' : ''}`}>▾</span>
            </button>

            {whatsappPanel && (
              <div className="wa-panel">
                <p className="wa-desc">
                  Recibe tu devocional diario directo en WhatsApp a la hora que elijas.
                  Requiere configuración de Twilio en el servidor.
                </p>

                <div className="wa-form">
                  <label className="wa-label">
                    Número de WhatsApp
                    <input
                      className="wa-input"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      value={configWA.numero}
                      onChange={(e) => setConfigWA((c) => ({ ...c, numero: e.target.value }))}
                    />
                  </label>

                  <label className="wa-label">
                    Hora de envío
                    <input
                      className="wa-input"
                      type="time"
                      value={configWA.hora}
                      onChange={(e) => setConfigWA((c) => ({ ...c, hora: e.target.value }))}
                    />
                  </label>

                  <label className="wa-label">
                    Zona horaria
                    <select
                      className="wa-input"
                      value={configWA.zonaHoraria}
                      onChange={(e) => setConfigWA((c) => ({ ...c, zonaHoraria: e.target.value }))}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="wa-label wa-label--checkbox">
                    <input
                      type="checkbox"
                      checked={configWA.activo}
                      onChange={(e) => setConfigWA((c) => ({ ...c, activo: e.target.checked }))}
                    />
                    Activar envío automático
                  </label>

                  {waError && <p className="wa-error">{waError}</p>}

                  <div className="wa-actions">
                    <button
                      className="btn-wa-save"
                      onClick={guardarConfigWA}
                      disabled={guardandoWA}
                    >
                      {guardandoWA ? 'Guardando...' : waGuardado ? '✅ Guardado' : '💾 Guardar configuración'}
                    </button>
                    {devocional && (
                      <button className="btn-wa-send" onClick={abrirWhatsApp}>
                        📤 Enviar ahora (wa.me)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════
          VISTA: HISTORIAL
      ══════════════════════════════════════════════════════ */}
      {vista === 'historial' && (
        <main className="main-content">
          {/* Estadísticas de racha */}
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-num">{historial.racha}</p>
              <p className="stat-label">Racha actual</p>
            </div>
            <div className="stat-card">
              <p className="stat-num">{historial.rachaMaxima}</p>
              <p className="stat-label">Racha máxima</p>
            </div>
            <div className="stat-card">
              <p className="stat-num">{historial.entradas.length}</p>
              <p className="stat-label">Devocionales</p>
            </div>
          </div>

          {/* Lista de devocionales */}
          {historial.entradas.length === 0 ? (
            <div className="historial-empty">
              <p>📖 Aún no tienes devocionales en tu historial.</p>
              <button className="btn-link" onClick={() => setVista('devocional')}>
                ¡Genera tu primero ahora!
              </button>
            </div>
          ) : (
            <ul className="historial-list">
              {historial.entradas.slice(0, 30).map((entrada) => (
                <li key={entrada.fecha} className="historial-item">
                  <div className="historial-item-header">
                    <span className="historial-fecha">
                      {new Date(entrada.fecha + 'T12:00:00').toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="historial-categoria">
                      {CATEGORIA_EMOJIS[entrada.devocional.pasaje.categoria]}{' '}
                      {CATEGORIA_LABELS[entrada.devocional.pasaje.categoria]}
                    </span>
                  </div>
                  <p className="historial-titulo">{entrada.devocional.titulo}</p>
                  <p className="historial-ref">{entrada.devocional.referencia}</p>
                </li>
              ))}
            </ul>
          )}
        </main>
      )}
    </div>
  )
}
