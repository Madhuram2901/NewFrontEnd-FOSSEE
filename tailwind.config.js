/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#FAF9F6',
        },
        app: {
          bg: '#CDB885',
          surface: '#EFE1B5',
        },
        content: {
          main: '#000000',
          muted: '#4A4A4A',
        },
        flowrate: '#10b981',
        pressure: '#f59e0b',
        temperature: '#ef4444',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 18px -7px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
