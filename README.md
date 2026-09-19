# VedAI — AI-Native Vedic Astrology Platform

Open-source Vedic astrology with a **Hybrid AI Brain** (8+ providers, never crashes).

Works on **any** platform that runs Next.js: Vercel · Cloudflare Pages · Netlify · Railway · Render · self-hosted.

## Quick Start

```bash
cp .env.local.example .env.local   # Add your API keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (universal)

### Vercel (recommended for fastest deploy)
1. Import `Nimbussky/vedai-app` at [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (auto)
3. Build command: `npm run build` (default)
4. Add env vars from `.env.local.example`
5. Deploy

### Cloudflare Pages
```bash
npm run pages:build
npx wrangler pages deploy .vercel/output/static
```
Or connect the GitHub repo in the Cloudflare dashboard and set build command to:
```
npm run pages:build
```
Output directory: `.vercel/output/static`

### Netlify
1. Import repo
2. Build command: `npm run build`
3. Publish directory: `.next` (or leave blank — Next.js plugin handles it)
4. Add env vars → Deploy

### Any other host (Docker / VPS / Railway / Render)
```bash
npm install
npm run build
npm start
```
Set `PORT` if required. Node 18+ recommended.

## Environment variables

Copy `.env.local.example`. Only providers with keys are used; the app never crashes if keys are missing.

| Variable | Required | Notes |
|----------|----------|-------|
| `GLM_API_KEY` | No | Primary free-tier backbone |
| `GROQ_API_KEY` | No | Fast Llama |
| `GEMINI_API_KEY` | No | Google |
| `CEREBRAS_API_KEY` | No | Fast free tier |
| `OPENROUTER_API_KEY` | No | Multi-model gateway |
| `VEDASTRO_API_URL` | No | Defaults to public API |

## Architecture

- **Next.js 15 + React 19** — standard App Router
- **Edge-compatible API routes** — work on Vercel Edge and Cloudflare
- **D1 optional** — database features degrade gracefully when no DB binding exists
- **Hybrid AI** — 8 providers with automatic fallback

## License

MIT
