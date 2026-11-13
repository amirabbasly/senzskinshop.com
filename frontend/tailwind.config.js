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
          50: '#fffaf8',
          100: '#fdf3ee',
          200: '#fae8e1',
          300: '#f5d9cf',
          400: '#eec7ba',
          500: '#e4b2a3',
          600: '#d59c8c',
          700: '#bd8272',
          800: '#9a6759',
          900: '#754d44',
          950: '#4a3733',
        },
        gold: {
          50: '#fffaf7',
          100: '#fdf2ec',
          200: '#fbe6dc',
          300: '#f5d5c6',
          400: '#eec4b1',
          500: '#e3af99',
          600: '#d29a83',
          700: '#b67e69',
          800: '#90604f',
          900: '#6b463a',
        },
        cream: {
          50: '#fffbf9',
          100: '#fdf5f1',
          200: '#fcece6',
          300: '#fae2da',
          400: '#f6d6cb',
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
