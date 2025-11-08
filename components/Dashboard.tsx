'use client'
import { useStore } from '@/store/useStore'

export function Dashboard() {
  const total = useStore((s) => s.connections.length)
  const avg = useStore((s) => {
    if (!s.connections.length) return 0
    return Math.round(s.connections.reduce((a, c) => a + c.latencyMs, 0) / s.connections.length)
  })
  const last = useStore((s) => s.lastUpdate)
  return (
    <div className="rounded-xl border border-white/10 bg-panel/80 p-4 shadow-glow">
      <div className="font-orbitron text-neon-cyan text-sm">Latency Overview</div>
      <div className="mt-2 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-neutral-400">Connections</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{avg}ms</div>
          <div className="text-xs text-neutral-400">Avg latency</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{last ? new Date(last).toLocaleTimeString() : '—'}</div>
          <div className="text-xs text-neutral-400">Last update</div>
        </div>
      </div>
    </div>
  )
}
