// ═══════════════════════════════════════════════════════════════
//  SERVIDOR DE DESARROLLO LOCAL
//  Emula las serverless functions de Vercel localmente
//  Uso: cd dev-server && npx ts-node server.ts
//  (o npx tsx server.ts si usas tsx)
// ═══════════════════════════════════════════════════════════════

import http from 'http'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// Cargar .env manualmente
function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  No se encontró .env en la raíz. Copia .env.example a .env y completa los valores.')
    return
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    process.env[key.trim()] = rest.join('=').trim()
  }
  console.log('✅ Variables de entorno cargadas desde .env')
}

loadEnv()

const PORT = 3001

// Importar handlers dinámicamente
async function getHandler(name: string) {
  const modPath = path.join(ROOT, 'api', `${name}.ts`)
  if (!fs.existsSync(modPath)) return null
  // Requiere ts-node / tsx corriendo
  const mod = await import(modPath)
  return mod.default
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
  const pathname = url.pathname

  // Solo manejar /api/*
  if (!pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found (usa el dev server de Vite para el frontend)' }))
    return
  }

  const handlerName = pathname.replace('/api/', '').replace(/\/$/, '')

  // Parsear body JSON
  let body: unknown = {}
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    const chunks: Buffer[] = []
    await new Promise<void>((resolve) => {
      req.on('data', (chunk: Buffer) => chunks.push(chunk))
      req.on('end', resolve)
    })
    const raw = Buffer.concat(chunks).toString('utf-8')
    try { body = JSON.parse(raw) } catch { body = {} }
  }

  // Crear objetos req/res mock compatibles con Vercel
  const mockReq = { method: req.method, headers: req.headers, body, query: {} } as any
  const mockRes = {
    _status: 200,
    _headers: {} as Record<string, string>,
    _body: '',
    status(code: number) { this._status = code; return this },
    setHeader(k: string, v: string) { this._headers[k] = v },
    json(data: unknown) {
      this._body = JSON.stringify(data)
      this._headers['Content-Type'] = 'application/json'
      this._flush()
    },
    end(data = '') {
      this._body = data
      this._flush()
    },
    _flush() {
      res.writeHead(this._status, this._headers)
      res.end(this._body)
    },
  } as any

  try {
    const handler = await getHandler(handlerName)
    if (!handler) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: `Handler '${handlerName}' no encontrado` }))
      return
    }
    await handler(mockReq, mockRes)
  } catch (err) {
    console.error(`Error en handler ${handlerName}:`, err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Error interno del servidor' }))
    }
  }
})

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server escuchando en http://localhost:${PORT}`)
  console.log(`   Endpoints disponibles:`)
  console.log(`   POST http://localhost:${PORT}/api/generate`)
  console.log(`   POST http://localhost:${PORT}/api/schedule`)
  console.log(`   GET  http://localhost:${PORT}/api/cron\n`)
})
