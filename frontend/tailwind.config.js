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
          50: '#fff9fc',
          100: '#fdeef6',
          200: '#fbdfee',
          300: '#f8cbe1',
          400: '#f4b6d3',
          500: '#ef9ec4',
          600: '#e787b2',
          700: '#d9739c',
          800: '#bb5c80',
          900: '#8a4460',
          950: '#4a3038',
        },
        gold: {
          50: '#fff8fc',
          100: '#fdedf5',
          200: '#fbdcec',
          300: '#f6c7de',
          400: '#eeafd1',
          500: '#e597c0',
          600: '#d47ca9',
          700: '#b5608a',
          800: '#8f4a6c',
          900: '#6b3850',
        },
        cream: {
          50: '#fffbfd',
          100: '#fef4f9',
          200: '#fdeaf3',
          300: '#fbdeeb',
          400: '#f6cfe2',
        },
        ink: '#3f3138',
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
