import { create } from 'zustand'
import type { ServerNode, CloudRegion, LatencySample, HistoricalSeriesPoint, Provider, Exchange } from '@/types'

interface Filters {
  providers: Record<Provider, boolean>
  exchanges: Exchange[] | null
  latencyRange: [number, number]
  viewMode: 'realtime' | 'historical'
  search: string
  timeRange: '1h' | '24h' | '7d' | '30d'
}

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
  pushHistory: (key, point) => set((s) => ({ history: { ...s.history, [key]: [...(s.history[key] ?? []), point] } })),
  setLastUpdate: (t) => set({ lastUpdate: t }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } }))
}))
