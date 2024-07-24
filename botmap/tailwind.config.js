/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				navbarcolor: "#36454F",
				statisticboxcolor: "#f4f4f4",
			},
			fontFamily: {
				sans: ["Arial", "sans-serif"],
			},
		},
	},
	plugins: [],
};
