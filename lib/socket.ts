import { useStore } from '@/store/useStore'
import type { LatencySample, ServerNode } from '@/types'

// Quick distance helper: how far apart are two points on Earth?
// We use the haversine formula to get great-circle distance in kilometers.
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Turn distance into a rough latency estimate + a bit of jitter so
// the scene feels alive. Swap this with real measurements when you
// hook up a backend or WebSocket feed.
function latencyFromDistance(km: number) {
  const base = km / 200
  const jitter = Math.random() * 20
  return Math.max(5, base + jitter)
}

let interval: number | null = null

// Start a lightweight simulator that emits pairwise latencies.
// Tip: replace this with a WebSocket client; the store API stays the same.
export function startLatencySimulation() {
  if (interval) return
  const get = useStore.getState
  const setConnections = get().setConnections
  const pushHistory = get().pushHistory
  const setLastUpdate = get().setLastUpdate

  interval = (setInterval(() => {
    const servers = get().servers
    if (!servers.length) return
    const samples: LatencySample[] = []
    for (let i = 0; i < servers.length; i++) {
      for (let j = i + 1; j < servers.length; j++) {
        const a: ServerNode = servers[i]
        const b: ServerNode = servers[j]
        const km = haversine(a.lat, a.lon, b.lat, b.lon)
        const latencyMs = Math.round(latencyFromDistance(km))
        const timestamp = Date.now()
        samples.push({ fromId: a.id, toId: b.id, latencyMs, timestamp })
        // Performance note: only persist time-series when the user cares.
        // This keeps the app lean in realtime mode.
        if (get().filters.viewMode === 'historical') {
          const key = `${a.id}::${b.id}`
          pushHistory(key, { t: timestamp, min: latencyMs - 5, max: latencyMs + 5, avg: latencyMs })
        }
      }
    }
    setConnections(samples)
    setLastUpdate(Date.now())
  }, 5000)) as unknown as number
}

// Cleanly stop the simulator. Call this on unmount to avoid leaks.
export function stopLatencySimulation() {
  if (interval) clearInterval(interval)
  interval = null
}
