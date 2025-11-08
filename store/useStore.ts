import { create } from 'zustand'
import type { ServerNode, CloudRegion, LatencySample, HistoricalSeriesPoint, Provider, Exchange } from '@/types'

// Why a global store?
// Components (3D scene, charts, sidebar) all need access to the same data.
// Zustand gives us a tiny, fast store without the ceremony.

// Filters drive what we draw and summarize across the app.
interface Filters {
  providers: Record<Provider, boolean>
  exchanges: Exchange[] | null
  latencyRange: [number, number]
  viewMode: 'realtime' | 'historical'
  search: string
  timeRange: '1h' | '24h' | '7d' | '30d'
}

// Single source of truth for the app.
// Tip: keep actions small and synchronous—React will handle re-renders efficiently.
interface AppState {
  servers: ServerNode[]
  regions: CloudRegion[]
  connections: LatencySample[]
  history: Record<string, HistoricalSeriesPoint[]>
  lastUpdate: number | null
  filters: Filters
  setServers: (s: ServerNode[]) => void
  setRegions: (r: CloudRegion[]) => void
  setConnections: (c: LatencySample[]) => void
  pushHistory: (key: string, point: HistoricalSeriesPoint) => void
  setLastUpdate: (t: number) => void
  setFilters: (f: Partial<Filters>) => void
}

export const useStore = create<AppState>((set) => ({
  servers: [],
  regions: [],
  connections: [],
  history: {},
  lastUpdate: null,
  filters: {
    providers: { AWS: true, GCP: true, Azure: true },
    exchanges: null,
    latencyRange: [0, 250],
    viewMode: 'realtime',
    search: '',
    timeRange: '1h'
  },
  setServers: (servers) => set({ servers }),
  setRegions: (regions) => set({ regions }),
  setConnections: (connections) => set({ connections }),
  // Keep time-series small and fast to render: we cap each pair to ~600 points.
  pushHistory: (key, point) => set((s) => {
    const prev = s.history[key] ?? []
    const next = [...prev, point]
    // Cap to last 600 points (~50 minutes if every 5s)
    const capped = next.length > 600 ? next.slice(next.length - 600) : next
    return { history: { ...s.history, [key]: capped } }
  }),
  setLastUpdate: (t) => set({ lastUpdate: t }),
  // Partial updates let each control tweak a single field without resetting others.
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } }))
}))
