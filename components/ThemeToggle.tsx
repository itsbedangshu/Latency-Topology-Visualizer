'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const isDark = (theme ?? 'dark') === 'dark'
  return (
    <button
      className="btn btn-secondary h-9 px-3 text-sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      type="button"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
