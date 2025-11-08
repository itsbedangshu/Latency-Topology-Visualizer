import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f17',
        panel: '#0f1623',
        neon: {
          green: '#00ffa3',
          cyan: '#00e5ff',
          blue: '#3b82f6'
        }
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        orbitron: ['Orbitron', 'ui-sans-serif']
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 255, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config
