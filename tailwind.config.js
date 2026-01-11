/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Quintessential', 'cursive'],
        'serif': ['Crimson Pro', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Sophisticated color palette
        'elegant': {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#e8dfd0',
          300: '#d4c4a8',
          400: '#b8a179',
          500: '#9d8159',
          600: '#7d6847',
          700: '#64533b',
          800: '#4d4030',
          900: '#3a3126',
        },
        'royal': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      }
    },
  },
  plugins: [],
}