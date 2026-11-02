/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8f4',
          100: '#dcefe4',
          200: '#b9dfcb',
          300: '#8ac7ab',
          400: '#57a888',
          500: '#388a6d',
          600: '#296e57',
          700: '#225947',
          800: '#1d483a',
          900: '#183c31',
          950: '#0d211b',
        },
        gold: {
          50: '#fdf9ed',
          100: '#f8edcb',
          200: '#f0d993',
          300: '#e6bf5a',
          400: '#d9a733',
          500: '#c9a227',
          600: '#a87d1e',
          700: '#855b1c',
          800: '#6f4a1d',
          900: '#5e3f1c',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f3ebdd',
          300: '#e9ddc9',
          400: '#d8c6a9',
        },
        ink: '#17251f',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(23, 37, 31, 0.35)',
        card: '0 18px 40px -28px rgba(23, 37, 31, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
      },
      animation: {
        floatUp: 'floatUp .5s ease-out both',
      },
    },
  },
  plugins: [],
};
