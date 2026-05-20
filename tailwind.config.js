/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAFAF7',
        forest: {
          50:  '#EEF4EF',
          100: '#D8E8DB',
          200: '#B5D1BB',
          500: '#4A7C59',
          600: '#3B6347',
          700: '#2E5339',
          800: '#1F3826',
          900: '#132219',
        },
        gold: {
          300: '#E0C080',
          400: '#D4A853',
          500: '#B8935A',
          600: '#9E7A45',
        },
        warm: {
          50:  '#FAFAF7',
          100: '#F5F4EF',
          200: '#EDEAE0',
          300: '#D9D5C8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
