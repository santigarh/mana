# 🚀 Guía de Deploy en Vercel

Pasos completos para tener la app en producción (frontend + serverless functions).

---

## Requisitos previos

- Cuenta en [vercel.com](https://vercel.com) (plan Hobby es gratuito)
- Cuenta en [console.groq.com](https://console.groq.com) (gratis)
- Repositorio en GitHub / GitLab / Bitbucket **o** usar Vercel CLI

---

## Opción A — Deploy desde GitHub (recomendado)

### 1. Subir el proyecto a GitHub

```bash
# Desde la raíz del proyecto
git init
git add .
git commit -m "feat: devocional diario inicial"

# Crear repo en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/devocional-diario.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Clic en **"Import Git Repository"**
3. Seleccionar el repo `devocional-diario`
4. En la pantalla de configuración, Vercel detecta automáticamente los settings del `vercel.json` — **no cambiar nada**
5. **Antes de hacer Deploy**, ir a **"Environment Variables"** y agregar las variables (ver sección abajo)
6. Clic en **"Deploy"**

---

## Opción B — Deploy con Vercel CLI

```bash
# Instalar CLI (una sola vez)
npm install -g vercel

# Desde la raíz del proyecto
vercel login   # abre el browser para autenticarse

vercel         # primer deploy (modo preview)
# → Responder las preguntas:
#   Set up and deploy? Y
#   Which scope? (tu usuario)
#   Link to existing project? N
#   Project name? devocional-diario
#   In which directory is your code? ./  (raíz)

# Una vez configuradas las env vars (ver abajo), hacer deploy a producción:
vercel --prod
```

---

## Variables de entorno

Configurarlas en **Vercel Dashboard → Settings → Environment Variables** (o con CLI):

```bash
# Con CLI (una a la vez):
vercel env add GROQ_API_KEY production
vercel env add CRON_SECRET production
# etc.
```

| Variable | Dónde obtenerla | Obligatoria |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys | ✅ Sí |
| `CRON_SECRET` | `openssl rand -hex 32` (cualquier string aleatorio) | ✅ Sí |
| `KV_REST_API_URL` | [console.upstash.com](https://console.upstash.com) → Redis → REST API | Solo para WhatsApp automático |
| `KV_REST_API_TOKEN` | Mismo panel de Upstash | Solo para WhatsApp automático |
| `TWILIO_ACCOUNT_SID` | [console.twilio.com](https://console.twilio.com) | Solo para WhatsApp automático |
| `TWILIO_AUTH_TOKEN` | Mismo panel de Twilio | Solo para WhatsApp automático |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` (sandbox) | Solo para WhatsApp automático |

> **Nota:** `VITE_API_URL` NO hace falta configurarla en Vercel porque el frontend y el backend comparten el mismo dominio. Solo se usa para desarrollo local con servidor separado.

---

## Obtener GROQ_API_KEY (5 minutos, gratis)

1. Ir a [console.groq.com](https://console.groq.com)
2. Registrarse (o entrar con Google)
3. En el menú izquierdo: **API Keys**
4. Clic en **"Create API Key"**
5. Copiar la key que empieza con `gsk_...`

El tier gratuito incluye: **14,400 requests/día · 30 req/min · 6,000 tokens/min**. Más que suficiente para uso personal.

---

## Obtener credenciales de Upstash (para WhatsApp automático)

Solo necesario si vas a usar el envío automático por cron. Si solo usas el botón **"Enviar ahora (wa.me)"** puedes saltarte esto.

1. Ir a [console.upstash.com](https://console.upstash.com)
2. Crear cuenta gratuita
3. Clic en **"Create Database"** → Redis
4. Nombre: `devocional-db` · Region: la más cercana · Plan: **Free**
5. En el panel del database: **REST API** tab
6. Copiar `UPSTASH_REDIS_REST_URL` → es tu `KV_REST_API_URL`
7. Copiar `UPSTASH_REDIS_REST_TOKEN` → es tu `KV_REST_API_TOKEN`

---

## Configurar Twilio WhatsApp (sandbox gratuito)

1. Crear cuenta en [twilio.com](https://www.twilio.com) (free trial incluye créditos)
2. En el dashboard: **Messaging → Try it out → Send a WhatsApp message**
3. Anotar tu `Account SID` y `Auth Token` del dashboard principal
4. El sandbox usa el número `whatsapp:+14155238886`
5. **Importante:** para recibir mensajes en el sandbox, el destinatario debe enviar primero `join <código>` al número de Twilio (Twilio te da el código)

---

## Estructura del deploy en Vercel

```
vercel.com/TU_USUARIO/devocional-diario
│
├── / (frontend estático — frontend/dist)
│   └── https://devocional-diario.vercel.app/
│
├── /api/generate    → Serverless Function (Node 20)
├── /api/schedule    → Serverless Function (Node 20)
└── /api/cron        → Serverless Function ejecutada cada hora por Vercel Cron
```

---

## Verificar que funciona

### Probar la API de generación

```bash
curl -X POST https://TU-APP.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "pasaje": {
      "id": "fe-01",
      "referencia": "Proverbios 3:5-6",
      "texto": "Fíate de Jehová de todo tu corazón...",
      "categoria": "fe"
    },
    "tono": "esperanzador",
    "extension": "normal"
  }'
```

Debería devolver el JSON del devocional.

### Probar el endpoint de schedule

```bash
curl -X POST https://TU-APP.vercel.app/api/schedule \
  -H "Content-Type: application/json" \
  -d '{"numero": "+573001234567", "hora": "07:00", "zonaHoraria": "America/Bogota", "activo": true}'
```

### Ejecutar el cron manualmente

```bash
curl https://TU-APP.vercel.app/api/cron \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

---

## Comandos útiles post-deploy

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de una función específica
vercel logs --filter api/generate

# Re-deploy sin cambios (útil tras actualizar env vars)
vercel --prod

# Ver variables de entorno configuradas
vercel env ls

# Abrir el proyecto en el browser
vercel open
```

---

## Troubleshooting

### Error: "Cannot find module '@vercel/node'"
Asegúrate de que el `package.json` raíz tiene `@vercel/node` en `dependencies` (no `devDependencies`). Vercel en producción solo instala `dependencies`.

### Error 500 en /api/generate
1. Verifica en Vercel Dashboard → Functions → Logs que `GROQ_API_KEY` esté configurada
2. Comprueba que la key no tenga espacios al inicio/final

### El frontend carga pero "Generar devocional" da error de red
El frontend en Vercel llama a `/api/generate` en el mismo dominio — no necesita `VITE_API_URL`. Si ves error CORS, asegúrate de que no estás usando un `VITE_API_URL` que apunte a localhost.

### El cron no se ejecuta
- Los crons de Vercel requieren que el header `Authorization: Bearer <CRON_SECRET>` coincida con la variable `CRON_SECRET`
- En el plan Hobby, los crons están disponibles pero limitados a 2 por proyecto
- Puedes verificar ejecuciones en Vercel Dashboard → Logs → Cron Jobs
