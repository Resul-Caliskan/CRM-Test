/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          red: '#FF4D4F',
          blue: '#133163',
          green:'#4CCD99'
        }
      },
      fontFamily: {
        sans: ['SF Pro Text', 'sans-serif'], 
      },
    },
  },
  plugins: [
    
  ],
};