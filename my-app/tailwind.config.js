/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#ffffff", // Change primary color to white
        secondary: "#00f6ff", // Secondary color remains unchanged
        dimWhite: "rgba(0, 0, 0, 0.7)", // Adjust dimWhite to use black with transparency
        dimBlue: "rgba(9, 151, 124, 0.1)", // Adjust dimBlue to use lighter blue with transparency
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
