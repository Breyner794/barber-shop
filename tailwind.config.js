// Puedes agregar esto en tu tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          primary: '#0B2447',    // Azul oscuro predominante
          secondary: '#19376D',  // Azul medio para acentos
          accent: '#E31837',     // Rojo para detalles
          light: '#F5F5F5',      // Blanco para contraste
          hover: '#144FB3',       // Azul para efectos hover
          links:  '#646cff',       // Morado claro tirando a azul.
          redS: '#bf4040'
        }
      }
    },
  },
  plugins: [],
}