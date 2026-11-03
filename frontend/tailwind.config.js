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
          50: '#fdf9f8',
          100: '#f9efed',
          200: '#f0d9d5',
          300: '#e5c8c3',
          400: '#d4ada7',
          500: '#c1928d',
          600: '#a87570',
          700: '#8c5b56',
          800: '#704745',
          900: '#553634',
          950: '#2f2625',
        },
        gold: {
          50: '#fdf7f4',
          100: '#f9eae2',
          200: '#f2d6c8',
          300: '#e6bba7',
          400: '#d5a088',
          500: '#c08871',
          600: '#a66f59',
          700: '#875947',
          800: '#6c483a',
          900: '#593c31',
        },
        cream: {
          50: '#fdfbfa',
          100: '#faf4f1',
          200: '#f5e9e4',
          300: '#efdcd5',
          400: '#e4c9c0',
        },
        ink: '#2b2422',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(90, 55, 50, 0.20)',
        card: '0 18px 40px -28px rgba(90, 55, 50, 0.28)',
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
        marquee: 'marquee 42s linear infinite',
      },
    },
  },
  plugins: [],
};
