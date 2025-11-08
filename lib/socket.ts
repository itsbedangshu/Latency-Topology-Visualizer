import { useStore } from '@/store/useStore'
import type { LatencySample, ServerNode } from '@/types'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function latencyFromDistance(km: number) {
  const base = km / 200
  const jitter = Math.random() * 20
  return Math.max(5, base + jitter)
}

let interval: number | null = null

export function startLatencySimulation() {
  if (interval) return
  const get = useStore.getState
  const setConnections = useStore.getState().setConnections
  const pushHistory = useStore.getState().pushHistory
  const setLastUpdate = useStore.getState().setLastUpdate

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
        const key = `${a.id}::${b.id}`
        const prev = get().history[key] ?? []
        const values = [...prev.slice(-59), { t: timestamp, min: latencyMs - 5, max: latencyMs + 5, avg: latencyMs }]
        pushHistory(key, values[values.length - 1])
      }
    }
    setConnections(samples)
    setLastUpdate(Date.now())
  }, 5000)) as unknown as number
}

export function stopLatencySimulation() {
  if (interval) clearInterval(interval)
  interval = null
}
