# ✝️ Devocional Diario — Mini App

git
Stack: **React 18 + TypeScript + Vite** (frontend) · **Vercel Serverless Functions** (backend) · **Upstash Redis** (KV) · **Twilio** (WhatsApp).

---

## ⚡ Inicio rápido (desarrollo local)

> **Si tienes varios proyectos con distintas versiones de Node**, usa `nvm` o `fnm` para aislar:
>
> ```bash
> # Con nvm (recomendado):
> nvm install 20
> nvm use 20
> node -v  # debe mostrar v20.x.x
>
> # Con fnm:
> fnm use 20
> ```

### 1. Clonar / abrir la carpeta del proyecto

```bash
cd "mini-app devocional"
```

### 2. Copiar y completar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus claves (ver sección de servicios abajo)
```

### 3. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 4. Correr el frontend en dev

```bash
npm run dev
# → http://localhost:5173
```

La app funciona **sin backend** para el flujo principal: el botón "Generar devocional" llama a `/api/generate`.
En dev, Vite hace proxy de `/api/*` → `http://localhost:3001`.

### 5. (Opcional) Correr el servidor de API local

```bash
cd ../dev-server
npm install
npm start
# → http://localhost:3001
```

---

## 🌐 Deploy en Vercel

```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Desde la raíz del proyecto:
vercel

# Agrega las variables de entorno en el dashboard de Vercel:
# Settings → Environment Variables
```

Variables requeridas en Vercel:

| Variable                 | Valor                                                  |
| ------------------------ | ------------------------------------------------------ |
| `GROQ_API_KEY`           | Tu key de [console.groq.com](https://console.groq.com) |
| `TWILIO_ACCOUNT_SID`     | De [console.twilio.com](https://console.twilio.com)    |
| `TWILIO_AUTH_TOKEN`      | De [console.twilio.com](https://console.twilio.com)    |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` (sandbox)                      |
| `KV_REST_API_URL`        | De [console.upstash.com](https://console.upstash.com)  |
| `KV_REST_API_TOKEN`      | De [console.upstash.com](https://console.upstash.com)  |
| `CRON_SECRET`            | `openssl rand -hex 32`                                 |

---

## 🆓 Servicios gratuitos usados

| Servicio          | Para qué                         | Tier gratuito                                    |
| ----------------- | -------------------------------- | ------------------------------------------------ |
| **Groq**          | Generar devocionales con LLaMA 3 | 14,400 req/día · 30 req/min                      |
| **Vercel**        | Hosting frontend + serverless    | Hobby plan (ilimitado para proyectos personales) |
| **Upstash Redis** | Guardar suscripciones WhatsApp   | 10,000 comandos/día                              |
| **Twilio**        | Enviar WhatsApp                  | Sandbox gratuito para pruebas                    |

> **Nota sobre Twilio sandbox**: En el sandbox gratuito, los destinatarios deben enviar primero el mensaje `join <sandbox-code>` al número de Twilio. Para producción necesitas un número aprobado por Meta (tiene costo).
>
> **Alternativa gratuita**: Si no quieres Twilio, el botón "Enviar ahora (wa.me)" genera un link directo a WhatsApp con el texto pre-armado — funciona sin costo ni configuración.

---

## 📁 Estructura de archivos

```
/
├── frontend/                    React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── features/devocional/
│   │   │   ├── DevocionalApp.tsx   Componente principal (UI completa)
│   │   │   ├── hooks/
│   │   │   │   ├── useDevocional.ts  Generación + estado
│   │   │   │   └── useHistorial.ts   Historial + racha (streak)
│   │   │   ├── lib/
│   │   │   │   ├── pasajes.ts        66 versículos en 6 categorías
│   │   │   │   ├── selector.ts       Selección determinista por fecha
│   │   │   │   └── prompt.ts         Construcción de prompt + formatos
│   │   │   └── types.ts              Tipos TypeScript
│   │   ├── App.tsx                   Dark mode wrapper
│   │   ├── main.tsx
│   │   └── index.css                 CSS custom (sin librerías UI)
│   ├── package.json
│   └── vite.config.ts
├── api/                         Vercel Serverless Functions
│   ├── generate.ts              POST → llama a Groq
│   ├── schedule.ts              POST → guarda en Upstash Redis
│   └── cron.ts                  GET → cron horario (Twilio WhatsApp)
├── dev-server/                  Servidor local para desarrollo
│   └── server.ts
├── vercel.json                  Config de deploy + cron schedule
├── .env.example                 Variables necesarias
└── README.md
```

---

## 🔧 Solución de problemas comunes

### Error: `Could not find module` / versión de Node incompatible

```bash
# Asegúrate de usar Node 18+ (recomendado 20):
node -v

# Si tienes nvm:
nvm use 20

# Si no tienes nvm, instálalo:
# Windows: https://github.com/coreybutler/nvm-windows/releases
# Mac/Linux: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Error en Vite: `Cannot find package 'path'`

Asegúrate de tener `"type": "module"` en el `package.json` del frontend (ya viene incluido).

### El devocional no se genera (error de API)

1. Verifica que `.env` existe y tiene `GROQ_API_KEY` válida
2. Asegúrate de que el dev-server está corriendo en el puerto 3001
3. Revisa la consola del navegador para ver el error exacto

### WhatsApp automático no funciona

El envío automático requiere Twilio configurado en el servidor. Para pruebas usa el botón **"Enviar ahora (wa.me)"** que no requiere backend.
