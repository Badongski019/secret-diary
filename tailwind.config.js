/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petal: {
          50:  '#fff5f7',
          100: '#ffe4eb',
          200: '#ffb3c6',
          300: '#ff85a1',
          400: '#ff4d6d',
          500: '#e63462',
          600: '#c9184a',
          700: '#a4133c',
          800: '#800f2f',
          900: '#590d22',
        },
        cream: {
          50:  '#fffef9',
          100: '#fdf8ed',
          200: '#faf0d7',
          300: '#f5e1b3',
          400: '#eecf87',
          500: '#e5b959',
          600: '#d4a017',
          700: '#b08800',
          800: '#8a6a00',
          900: '#6b5300',
        },
        blush: '#f9e4ec',
        rose:  '#f2c4d0',
        dusty: '#c9a0b4',
        wine:  '#8b3a62',
        ivory: '#fdf9f0',
        linen: '#f5ede0',
        parchment: '#ede0c8',
      },
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Lato"', 'system-ui', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'petal': '0 4px 30px rgba(230, 52, 98, 0.15)',
        'letter': '0 8px 40px rgba(139, 58, 98, 0.12)',
        'envelope': '0 12px 50px rgba(139, 58, 98, 0.18)',
        'glass': '0 8px 32px rgba(201, 160, 180, 0.2)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
        'xl4': '2rem',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'heart-pop':  'heart-pop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0.7 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'heart-pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
