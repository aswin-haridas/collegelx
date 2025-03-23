/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warmBg: "#FEF6E4",
        warmText: "#5A4F47",
        warmPrimary: "#B86E54",
        warmPrimaryDark: "#A05A42",
        warmAccent: "#D88C65",
        warmAccentDark: "#C17A55",
        warmBorder: "#E3DCD0",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
