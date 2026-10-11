/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0b0f17',
        surface: '#131926',
        'surface-elevated': '#1a2335',
        primary: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fde68a',
        },
        accent: {
          DEFAULT: '#3b82f6',
          purple: '#8b5cf6',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
