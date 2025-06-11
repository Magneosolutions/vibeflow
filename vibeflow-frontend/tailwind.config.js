/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4F46E5', // Example primary color (indigo-600)
        'brand-secondary': '#EC4899', // Example secondary color (pink-500)
      }
    },
  },
  plugins: [],
}
