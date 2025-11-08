import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Legend } from '@/components/Legend'
import { SidebarControls } from '@/components/SidebarControls'
import { Dashboard } from '@/components/Dashboard'

const GlobeScene = dynamic(() => import('@/components/GlobeScene'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-full text-neutral-400">Loading 3D globe…</div>
) })

export default function Page() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-screen">
      <section className="relative">
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
      <aside className="border-l border-white/10 bg-panel/60 backdrop-blur-md p-4 lg:p-6">
        <SidebarControls />
      </aside>
    </main>
  )
}
