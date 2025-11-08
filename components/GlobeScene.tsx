'use client'
import React, { memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, QuadraticBezierLine, Html, Stars, Line, PerformanceMonitor } from '@react-three/drei'
import { feature } from 'topojson-client'
import land110m from 'world-atlas/land-110m.json' assert { type: 'json' }
import { AdditiveBlending } from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import serversData from '@/data/exchanges.json'
import regionsData from '@/data/cloudRegions.json'
import type { Provider, ServerNode } from '@/types'
import { useStore } from '@/store/useStore'
import { startLatencySimulation, stopLatencySimulation } from '@/lib/socket'

// How it works: convert latitude/longitude into a 3D point on a sphere.
// This lets us place markers, lines, and regions directly on the globe.
function latLonToXYZ(lat: number, lon: number, radius = 1.05) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z] as const
}



const providerColor: Record<Provider, string> = {
  AWS: '#00ffa3',
  GCP: '#00e5ff',
  Azure: '#3b82f6',
}

const Marker = memo(function Marker({ node, onHover }: any) {
  const pos = useMemo(() => latLonToXYZ(node.lat, node.lon, 1.02), [node.lat, node.lon])
  return (
    <group position={pos as any}>
      <mesh
        onPointerOver={(e: any) => {
          e.stopPropagation()
          onHover(node)
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation()
          onHover(null)
        }}
      >
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={providerColor[node.provider as Provider]} />
      </mesh>
    </group>
  )
})

const LatencyArcs = memo(function LatencyArcs() {
  const connections = useStore((s) => s.connections)
  const servers = useStore((s) => s.servers)
  const filters = useStore((s) => s.filters)

  const serverById = useMemo(() => Object.fromEntries(servers.map((s) => [s.id, s])), [servers])

  // A tiny dot rides along each arc to imply direction and motion.
  function Pulse({ start, end, speed = 0.4, color }: { start: any; end: any; speed?: number; color: string }) {
    const ref = useRef<any>(null)
    const t0 = useRef<number>(Math.random())
    useFrame((state, delta) => {
      t0.current = (t0.current + delta * speed) % 1
      const t = t0.current
      const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 0.9, (start[2] + end[2]) / 2]
      const a = start, b = mid, c = end
      // We follow a quadratic Bezier curve (a → b → c).
      const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0]
      const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]
      const z = (1 - t) * (1 - t) * a[2] + 2 * (1 - t) * t * b[2] + t * t * c[2]
      if (ref.current) ref.current.position.set(x, y, z)
    })
    return (
      <mesh ref={ref} renderOrder={25}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color={color} depthTest={false} depthWrite={false} transparent opacity={1} />
      </mesh>
    )
  }

  // Centralized visibility check for nodes against current filters.
  function passesNode(node: ServerNode) {
    return (
      filters.providers[node.provider] &&
      (!filters.exchanges || filters.exchanges.includes(node.exchange as any)) &&
      (!filters.search || `${node.exchange} ${node.region}`.toLowerCase().includes(filters.search.toLowerCase()))
    )
  }

  return (
    <group>
      {connections.filter((c) => c.latencyMs <= filters.latencyRange[1]).map((c) => {
        const a = serverById[c.fromId]
        const b = serverById[c.toId]
        if (!a || !b) return null
        if (!passesNode(a) || !passesNode(b)) return null
        const start = latLonToXYZ(a.lat, a.lon, 1.02)
        const end = latLonToXYZ(b.lat, b.lon, 1.02)
        const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1.2, (start[2] + end[2]) / 2]
        const color = c.latencyMs < 50 ? '#22c55e' : c.latencyMs <= 100 ? '#eab308' : '#ef4444'
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
        const arcLineWidth = isMobile ? 1.2 : 2
        return (
          <group key={`${c.fromId}-${c.toId}`}>
            <QuadraticBezierLine
              start={start as any}
              end={end as any}
              mid={mid as any}
              color={color}
              lineWidth={arcLineWidth}
              transparent
              opacity={0.95}
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
              renderOrder={20}
            />
            <Pulse start={start} end={end} color={color} />
          </group>
        )
      })}
    </group>
  )
}
);

// Why coastlines? Using the world-atlas land dataset, we draw thin outlines
// right on the sphere. This avoids texture seams and stays crisp while zooming.

function CoastlineOutline({ color = '#bfe3ff', opacity = 0.6, radius = 1.012, lineWidth = 0.006 }: { color?: string; opacity?: number; radius?: number; lineWidth?: number }) {
  const segments = useMemo(() => {
    // We extract only the outer land boundaries (coastlines) from world-atlas.
    const gj: any = feature(land110m as any, (land110m as any).objects.land)
    const segs: Array<[number, number, number][]> = []
    for (const f of gj.features) {
      const g = f.geometry
      if (!g) continue
      if (g.type === 'Polygon') {
        for (const ring of g.coordinates) {
          const pts = ring.map((c: number[]) => {
            const [lon, lat] = c
            return latLonToXYZ(lat, lon, radius)
          }) as any
          segs.push(pts)
        }
      } else if (g.type === 'MultiPolygon') {
        for (const poly of g.coordinates) {
          for (const ring of poly) {
            const pts = ring.map((c: number[]) => {
              const [lon, lat] = c
              return latLonToXYZ(lat, lon, radius)
            }) as any
            segs.push(pts)
          }
        }
      }
    }
    return segs
  }, [radius])

  return (
    <group>
      {segments.map((pts, i) => (
        <Line key={i} points={pts as any} color={color} lineWidth={lineWidth} worldUnits transparent opacity={opacity} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      ))}
    </group>
  )
}

export default function GlobeScene() {
  const setServers = useStore((s) => s.setServers)
  const setRegions = useStore((s) => s.setRegions)
  const servers = useStore((s) => s.servers)
  const regions = useStore((s) => s.regions)
  const filters = useStore((s) => s.filters)
  const [hovered, setHovered] = useState<ServerNode | null>(null)

  useEffect(() => {
    setServers(serversData as any)
    setRegions(regionsData as any)
    startLatencySimulation()
    return () => {
      stopLatencySimulation()
    }
  }, [setServers, setRegions])

  useEffect(() => {
    // Quick sanity check: confirm env variables reach the browser.
    // eslint-disable-next-line no-console
    console.log('NEXT_PUBLIC_MAP_OUTLINE_URL =', process.env.NEXT_PUBLIC_MAP_OUTLINE_URL)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [quality, setQuality] = useState<'high' | 'low'>(isMobile ? 'low' : 'high')

  return (
    <div className="h-[70vh] w-full lg:h-screen">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: true,
        }}
      >
        <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => setQuality(isMobile ? 'low' : 'high')}>
          <Stars
            radius={50}
            depth={30}
            count={quality === 'low' ? (isMobile ? 600 : 1200) : (isMobile ? 900 : 2000)}
            factor={2}
            saturation={0}
            fade
            speed={0.6}
          />
        </PerformanceMonitor>
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />

        {/* Earth sphere */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#0b1f3f" wireframe={false} metalness={0} roughness={1} />
        </mesh>

        {/* Thin glowing coastlines (perfectly aligned, offline) */}
        <CoastlineOutline color="#bfe3ff" opacity={0.6} radius={1.012} lineWidth={0.006} />

        {/* Cloud regions (semi-transparent orbs) */}
        {regions.map((r) => (
          filters.providers[r.provider] ? (
            <mesh key={r.id} position={latLonToXYZ(r.lat, r.lon, 1.06) as any}>
              <sphereGeometry args={[0.04, 24, 24]} />
              <meshBasicMaterial color={providerColor[r.provider as Provider]} transparent opacity={0.15} />
            </mesh>
          ) : null
        ))}

        {/* Server markers */}
        {servers
          .filter((s) => filters.providers[s.provider])
          .filter((s) => !filters.exchanges || filters.exchanges.includes(s.exchange as any))
          .filter((s) => !filters.search || `${s.exchange} ${s.region}`.toLowerCase().includes(filters.search.toLowerCase()))
          .map((s) => (
            <Marker key={s.id} node={s} onHover={setHovered} />
          ))}

        {/* Latency arcs */}
        <LatencyArcs />

        <OrbitControls enablePan enableZoom enableRotate makeDefault enableDamping dampingFactor={0.08} />

        {/* Hover info card */}
        {hovered ? (
          <Html position={latLonToXYZ(hovered.lat, hovered.lon, 1.1) as any} center style={{ pointerEvents: 'none' }}>
            <div className="rounded-md border border-white/10 bg-black/70 px-3 py-2 text-xs">
              <div className="font-semibold" style={{ color: providerColor[hovered.provider] }}>{hovered.exchange}</div>
              <div className="text-neutral-300">{hovered.region} · {hovered.provider}</div>
            </div>
          </Html>
        ) : null}
      </Canvas>
    </div>
  )
}
