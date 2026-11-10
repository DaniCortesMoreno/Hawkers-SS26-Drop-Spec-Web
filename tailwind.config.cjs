/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fcf6ec', // Porcelain Cream
        ink: '#2e2521', // Espresso Ink
        border: '#d3ccc3', // Parchment Border
        'surface-stone': '#cec1b2', // Stone Haze
        'surface-daylight': '#fdf0c7', // Daylight Wash
        'surface-peach': '#fdc6b3', // Peach Wash
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['Azeret Mono', 'monospace'],
      },
      borderRadius: {
        pill: '20px',
      },
    },
  },
  plugins: [],
};
