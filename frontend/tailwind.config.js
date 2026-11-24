/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#08090D',
        surface: {
          50: '#1e2230',
          100: '#161923',
          200: '#12141c',
          300: '#0d0f15',
          DEFAULT: '#10121a',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        neon: {
          purple: '#9d4edd',
          magenta: '#ec4899',
          orange: '#ff6700',
          red: '#ff3366',
          cyan: '#00f0ff',
          blue: '#3a86ff',
          amber: '#ffbe0b'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(157, 78, 221, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(255, 103, 0, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        'glass-edge': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4.5s ease-in-out infinite 1s',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      }
    },
  },
  plugins: [],
}
