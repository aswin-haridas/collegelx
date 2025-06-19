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
				beige: {
					50: "#fdfbf7",
					100: "#faf7f0",
					200: "#f5f0e6",
					300: "#eee6d6",
					400: "#e6d9c2",
					500: "#d4c4a8",
					600: "#c2b08e",
					700: "#a89a7a",
					800: "#8a7d65",
					900: "#6b6150",
				},
				brown: {
					50: "#fdf8f6",
					100: "#f9f0ed",
					200: "#f2e4df",
					300: "#e8d3cc",
					400: "#d9b8ae",
					500: "#c49a8c",
					600: "#b07d6a",
					700: "#8f6353",
					800: "#735045",
					900: "#5a3e37",
				},
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
