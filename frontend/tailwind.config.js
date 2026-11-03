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
          50: '#fdf8f7',
          100: '#faeeec',
          200: '#f4dcd8',
          300: '#eec8c3',
          400: '#e2aba4',
          500: '#d5948d',
          600: '#c47a73',
          700: '#a85f59',
          800: '#8b4b46',
          900: '#6d3b37',
          950: '#33211f',
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
          50: '#fdf9f8',
          100: '#faf3f1',
          200: '#f6e8e5',
          300: '#f0dcd7',
          400: '#e5c9c3',
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
