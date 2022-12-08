/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home': "url('/images/bg.jpg')",
      },
      color : {
        'gray' : 'rgb(128, 129, 145, 0.1)'
      }
    },
  },
  plugins: [],
}