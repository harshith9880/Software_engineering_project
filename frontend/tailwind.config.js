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
          DEFAULT: '#4f46e5', // Indigo
          dark: '#3730a3',
        },
        accent: {
          DEFAULT: '#f59e0b', // Orange
          dark: '#d97706',
        },
        background: '#f9fafb', // Off-white
      }
    },
  },
  plugins: [],
}
