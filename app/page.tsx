import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Legend } from '@/components/Legend'
import ThemeToggle from '@/components/ThemeToggle'
const SidebarControls = dynamic(() => import('@/components/SidebarControls'), {
  ssr: false,
  loading: () => <div className="p-6 text-text-secondary">Loading controls…</div>,
})
import { Dashboard } from '@/components/Dashboard'

const GlobeScene = dynamic(() => import('@/components/GlobeScene'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-full text-neutral-400">Loading 3D globe…</div>
) })

export default function Page() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-surface/60 backdrop-blur supports-[backdrop-filter]:bg-surface/40">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/20" />
            <h1 className="font-heading text-lg text-text">Latency Topology Visualizer</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-text-secondary md:block">Realtime · 3D Globe</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 lg:gap-4 container py-4">
        <section className="relative rounded-xl border border-border/50 bg-surface/40 shadow-lg overflow-hidden">
          <Suspense fallback={<div className="w-full h-[70vh]" />}> 
            <GlobeScene />
          </Suspense>
          <div className="absolute left-4 top-4 z-10">
            <Dashboard />
          </div>
          <div className="absolute left-4 bottom-4 z-10">
            <Legend />
          </div>
        </section>
        <aside className="rounded-xl border border-border/50 bg-surface/60 backdrop-blur p-4 lg:p-6 shadow-lg">
          <SidebarControls />
        </aside>
      </div>
    </main>
  )
}
