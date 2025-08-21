/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add this section
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}