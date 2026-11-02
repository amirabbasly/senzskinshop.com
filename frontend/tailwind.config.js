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
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#ffc9d9',
          300: '#ffa2bf',
          400: '#ff6d9d',
          500: '#f93d7f',
          600: '#e21d66',
          700: '#bd1253',
          800: '#9b1146',
          900: '#7d0f3a',
          950: '#46051f',
        },
        gold: {
          50: '#fff7f4',
          100: '#ffece3',
          200: '#ffd8c7',
          300: '#f7b79c',
          400: '#e99476',
          500: '#d97a5d',
          600: '#b95f47',
          700: '#964b39',
          800: '#7a3f32',
          900: '#65372d',
        },
        cream: {
          50: '#fffcfd',
          100: '#fdf6f8',
          200: '#fbeaef',
          300: '#f6dbe3',
          400: '#edc3cf',
        },
        ink: '#241820',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(70, 5, 31, 0.22)',
        card: '0 18px 40px -28px rgba(70, 5, 31, 0.35)',
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
