import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import './globals.css';

// Fonts with optimized loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer',
  description: 'Interactive 3D visualization of network latency across global cloud regions with real-time analytics.',
  keywords: [
    'latency',
    'topology',
    'visualization',
    'cloud',
    'network',
    'performance',
    'monitoring',
    'crypto',
    'exchange',
  ],
  authors: [{ name: 'GoQuant' }],
  creator: 'GoQuant',
  publisher: 'GoQuant',
  metadataBase: new URL('https://latency.goquant.com'),
  openGraph: {
    title: 'Latency Topology Visualizer',
    description: 'Interactive 3D visualization of network latency across global cloud regions.',
    url: 'https://latency.goquant.com',
    siteName: 'GoQuant Latency Visualizer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Latency Topology Visualizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latency Topology Visualizer',
    description: 'Interactive 3D visualization of network latency across global cloud regions.',
    images: ['/og-image.png'],
    creator: '@goquant',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/png"
          sizes="180x180"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-background to-slate-900 font-sans antialiased text-text">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
