import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#818cf8',
        accent: '#818cf8',
      },
      boxShadow: {
        'clay': '0 12px 24px rgba(0,0,0,.15), inset 0 -4px 8px rgba(0,0,0,.1), inset 0 4px 8px rgba(255,255,255,.4)',
        'clay-hover': '0 20px 32px rgba(0,0,0,.2), inset 0 -4px 8px rgba(0,0,0,.1), inset 0 4px 8px rgba(255,255,255,.4)',
        'button': '0 8px 16px rgba(99,102,241,.4), inset 0 2px 4px rgba(255,255,255,.3)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(.22,1,.36,1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config