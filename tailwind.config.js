/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-bg': '#1a1a1a',
        'claude-sidebar': '#171717',
        'claude-border': '#2d2d2d',
        'claude-text': '#e5e5e5',
        'claude-text-secondary': '#a3a3a3',
        'claude-accent': '#d97757',
        'claude-input-bg': '#262626',
        'claude-hover': '#404040'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}