/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beringin: {
          green: "#1a5d1a",
          gold: "#d4af37",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
