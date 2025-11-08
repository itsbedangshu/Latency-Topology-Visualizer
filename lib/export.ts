export function exportConnectionsCSV(rows: { fromId: string; toId: string; latencyMs: number; timestamp: number }[]) {
  const header = ['fromId', 'toId', 'latencyMs', 'timestamp']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push([r.fromId, r.toId, String(r.latencyMs), new Date(r.timestamp).toISOString()].join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `latency-connections-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
