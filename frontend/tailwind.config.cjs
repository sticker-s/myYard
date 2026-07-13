/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Retro light theme (beige based)
        retroBg: '#f5f0e1',
        retroPrimary: '#d98c5d',
        retroAccent: '#758c5a',
        // Dark theme palette
        darkBg: '#0d1117',
        darkPrimary: '#2dd4bf',
        darkAccent: '#58a6ff',
      },
      borderRadius: { lg: '0.75rem' },
    },
  },
  plugins: [],
};
