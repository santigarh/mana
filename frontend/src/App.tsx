import { useState, useEffect } from 'react'
import DevocionalApp from './features/devocional/DevocionalApp'

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('devocional_dark')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('devocional_dark', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <>
      <button
        className="dark-toggle"
        onClick={() => setDarkMode((d) => !d)}
        aria-label="Alternar modo oscuro"
        title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <DevocionalApp darkMode={darkMode} />
    </>
  )
}
