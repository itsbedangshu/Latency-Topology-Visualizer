export function Legend() {
  const items = [
    { name: 'AWS', color: '#00ffa3' },
    { name: 'GCP', color: '#00e5ff' },
    { name: 'Azure', color: '#3b82f6' },
    { name: '<50ms', color: '#22c55e' },
    { name: '50–100ms', color: '#eab308' },
    { name: '>100ms', color: '#ef4444' },
  ]
  return (
    <div className="rounded-lg border border-white/10 bg-panel/80 px-3 py-2 text-sm backdrop-blur">
      <div className="grid grid-cols-2 gap-2">
        {items.map((i) => (
          <div key={i.name} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: i.color }} />
            <span className="text-neutral-300">{i.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
