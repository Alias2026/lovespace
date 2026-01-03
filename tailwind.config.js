/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          50: '#fff0f3',
          100: '#ffc2d1',
          200: '#ff8fa3',
          300: '#ff5c77',
          400: '#ff264d',
          500: '#e00029',
          600: '#ad001f',
          700: '#7a0016',
          800: '#47000c',
          900: '#140003',
        },
        warm: {
          cream: '#FDFBF7',
          beige: '#F5E6D3',
          sand: '#E6CCB2',
          gold: '#D4AF37',
          blush: '#FFD1DC',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
        hand: ['Dancing Script', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
