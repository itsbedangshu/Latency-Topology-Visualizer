'use client'
import type { Provider } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/store/useStore'
import { LatencyChart } from './LatencyChart'
import { exportConnectionsCSV } from '@/lib/export'

const providerColors: Record<Provider, string> = {
  AWS: '#00ffa3',
  GCP: '#00e5ff',
  Azure: '#3b82f6'
}

export function SidebarControls() {
  const [selectedPair, setSelectedPair] = useState<string>('')
  const filters = useStore((s) => s.filters)
  const setFilters = useStore((s) => s.setFilters)
  const servers = useStore((s) => s.servers)
  const connections = useStore((s) => s.connections)

  const pairs = useMemo(() => {
    const keys = new Set<string>()
    for (const c of connections) {
      const k = `${c.fromId}::${c.toId}`
      keys.add(k)
    }
    return Array.from(keys)
  }, [connections])

  const exchangeOptions = useMemo(() => {
    const set = new Set<string>()
    servers.forEach((s) => set.add(s.exchange))
    return Array.from(set)
  }, [servers])

  useEffect(() => {
    if (!selectedPair && pairs.length) setSelectedPair(pairs[0])
  }, [pairs, selectedPair])

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <div className="text-lg font-orbitron">Controls</div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase text-neutral-400">Time Range</div>
            <div className="flex gap-2 text-sm">
              {(['1h','24h','7d','30d'] as const).map((v) => (
                <button key={v} onClick={() => setFilters({ timeRange: v })} className={`rounded px-2 py-1 ${filters.timeRange === v ? 'bg-neon-blue/20 text-neon-cyan' : 'bg-black/30'}`}>{v}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-400">Exchange</div>
            <select
              className="mt-1 w-full rounded bg-black/30 p-2"
              value={(filters.exchanges?.[0] as any) ?? ''}
              onChange={(e) => setFilters({ exchanges: e.target.value ? [e.target.value as any] : null })}
            >
              <option value="">All Exchanges</option>
              {exchangeOptions.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-400">Providers</div>
            <div className="mt-2 flex gap-3">
              {Object.entries(filters.providers).map(([p, on]) => (
                <label key={p} className="flex items-center gap-2">
                  <input type="checkbox" checked={on} onChange={(e) => setFilters({ providers: { ...filters.providers, [p]: e.target.checked } as any })} />
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: providerColors[p as Provider] }} />
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-400">Latency range (ms)</div>
            <input type="range" min={0} max={300} value={filters.latencyRange[1]} onChange={(e) => setFilters({ latencyRange: [0, Number(e.target.value)] })} className="w-full" />
            <div className="text-sm text-neutral-300">0 – {filters.latencyRange[1]} ms</div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-400">Search</div>
            <input className="mt-1 w-full rounded bg-black/30 px-2 py-1 focus-neon" placeholder="Exchange or region" value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs uppercase text-neutral-400">View</div>
            <div className="flex gap-2 text-sm">
              {(['realtime', 'historical'] as const).map((v) => (
                <button key={v} onClick={() => setFilters({ viewMode: v })} className={`rounded px-2 py-1 ${filters.viewMode === v ? 'bg-neon-blue/20 text-neon-cyan' : 'bg-black/30'}`}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg font-orbitron">Historical Trends</div>
        {selectedPair ? <LatencyChart pairKey={selectedPair} /> : <div className="text-sm text-neutral-400">No pair selected</div>}
        <select className="mt-2 w-full rounded bg-black/30 p-2" value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
          {pairs.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div className="mt-auto text-xs text-neutral-500">
        <div className="flex items-center justify-between">
          <span>Showing {servers.length} servers · {connections.length} connections</span>
          <button
            onClick={() => exportConnectionsCSV(connections)}
            className="rounded bg-neon-blue/20 px-2 py-1 text-xs text-neon-cyan hover:shadow-glow"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
