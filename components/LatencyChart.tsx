import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend as RLegend } from 'recharts'
import { useStore } from '@/store/useStore'

export function LatencyChart({ pairKey }: { pairKey: string }) {
  const series = useStore((s) => s.history[pairKey] ?? [])
  const range = useStore((s) => s.filters.timeRange)
  const now = Date.now()
  const ms = range === '1h' ? 3600_000 : range === '24h' ? 86_400_000 : range === '7d' ? 7 * 86_400_000 : 30 * 86_400_000
  const cutoff = now - ms
  const data = series.filter((p) => p.t >= cutoff)
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <XAxis dataKey="t" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#666" />
          <YAxis stroke="#666" unit="ms" domain={[0, 'auto']} />
          <Tooltip labelFormatter={(t) => new Date(Number(t)).toLocaleTimeString()} />
          <RLegend />
          <Line type="monotone" dataKey="min" stroke="#22c55e" dot={false} strokeWidth={1} />
          <Line type="monotone" dataKey="avg" stroke="#60a5fa" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="max" stroke="#ef4444" dot={false} strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
