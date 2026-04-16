/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
       text: '#0a0108',
        background: '#f5f2f5',
        primary: '#470938',
        secondary: '#1a3e59',
        accent: '#5c94bd',
      },
    },
  },
  plugins: [],
}