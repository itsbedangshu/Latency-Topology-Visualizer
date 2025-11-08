# Latency Topology Visualizer

Interactive 3D globe showing network latency between global regions with a simple simulator and a clean, themeable UI.

## Overview

- Next.js 14 App Router + React 18.
- 3D globe via React Three Fiber and Drei.
- Themeable (light/dark) using CSS variables and next-themes.
- Real-time-like updates via a latency simulator (WebSocket-ready).
- Responsive UI with split panels and async-loaded controls.

## Tech Stack

- Framework: Next.js 14 (App Router), React 18
- Styling: TailwindCSS, PostCSS, Autoprefixer
- Theming: next-themes (class strategy), CSS variables (RGB triplets)
- 3D/Graphics: three, @react-three/fiber, @react-three/drei
- Data viz: recharts (for basic line charts)
- State: zustand
- Utils/Data: world-atlas, topojson-client
- UI feedback: sonner (toasts)
- Analytics (optional): @vercel/analytics/react, @vercel/speed-insights/next
- Build config: next.config.mjs with transpilePackages for three ecosystem

## Assumptions

- Node.js 18+ (or 20) and npm installed.
- Next.js App Router project structure (`/app` directory).
- No custom server; fully static/edge-friendly. The latency data is simulated on the client.
- If environment variables are used, public ones are prefixed `NEXT_PUBLIC_...`.
- three.js packages require `transpilePackages` in `next.config.mjs` for reliable builds.
- Tailwind colors are defined as RGB triplets in CSS variables to support opacity modifiers.

## Getting Started

- Install: `npm ci` (or `npm install`)
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build`
- Start: `npm run start`

If you change Tailwind or globals.css deeply, remove `.next` and rebuild to clear caches.

## Theming

- next-themes uses `attribute="class"` and toggles the `dark` class on `<html>`.
- Colors are defined as CSS variables (RGB triplets) in `app/globals.css`.
- Tailwind reads colors via `rgb(var(--token) / <alpha-value>)`, so utilities like `bg-surface/60` work.
- If you see build errors about slash opacity, replace with bracketed values, e.g. `bg-[rgb(var(--surface)/0.6)]`.

## 3D Scene and Performance

- `GlobeScene.tsx` renders:
  - Base sphere with standard material.
  - Coastlines from `world-atlas` via `topojson-client` to avoid texture seams.
  - Region orbs and server markers.
  - Latency arcs using `QuadraticBezierLine`, with a small “pulse” dot showing direction.
- `PerformanceMonitor` from Drei reduces visual load on low-FPS devices (e.g., fewer stars, thinner arcs).

## Data Flow

- `store/useStore.ts` (zustand):
  - Servers, regions, current connections, rolling history, and filters.
  - History capped to ~600 points per pair to prevent memory bloat.
- `lib/socket.ts`:
  - Client-only simulator that computes rough latency from great-circle distance (haversine) + jitter.
  - Time series only persisted when `filters.viewMode` is `historical`.

## UI

- `SidebarControls.tsx`: Filters and CSV export (toast via sonner).
- `Dashboard.tsx`: Quick stats.
- `Legend.tsx`: Color hints for providers/latency bands.
- `ThemeToggle.tsx`: Light/Dark switch.

## Deployment (Vercel)

- Preset: Next.js
- Install: `npm ci`
- Build: `next build`
- Output: `.next`
- Node: 18 or 20 (default is fine)
- Add any `NEXT_PUBLIC_*` env vars in Vercel settings.

## Known Limitations

- Latency is simulated; no real-time backend yet.
- Globe base material is static (not theme-reactive by default).
- Charting is minimal; suitable for small datasets.

## Roadmap / Future Work

- Replace simulator with WebSocket data source (reconnect/backoff/jitter).
- Theme globe materials and more UI elements.
- Accessible drawer navigation for mobile using Radix UI.
- Camera presets and screenshot/export of the canvas.
- Bundle analysis and further code-splitting.
