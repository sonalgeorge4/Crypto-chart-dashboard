/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tv-bg': '#131722',
        'tv-pane': '#1e222d',
        'tv-pane-secondary': '#2a2e39',
        'tv-border': '#363c4e',
        'tv-text': '#d1d4dc',
        'tv-text-secondary': '#b2b5be',
        'tv-blue': '#2962ff',
        'tv-green': '#26a69a',
        'tv-red': '#ef5350',
        'tv-orange': '#ff9800',
        'tv-purple': '#9c27b0',
      }
    },
  },
  plugins: [],
}