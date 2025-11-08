import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer',
  description: 'Interactive 3D globe to visualize crypto exchange latency across cloud regions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} bg-bg text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
