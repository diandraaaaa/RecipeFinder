/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#151312",      // App background
        secondary: "#FF8C42",    // Accent color (orange)
        card: "#23232a",         // Card background
        muted: "#A8B5DB",        // Muted text/icons
        white: "#ffffff",
        black: "#000000",
        "green-accent": "#7DD36E",
        "gray-accent": "#F5F5F5",
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: "70px",
        xl: 24,
        "2xl": 28,
        "3xl": 32,
      },
      borderRadius: {
        sm: 8,
        DEFAULT: 12,
        lg: 16,
        xl: 24,
        "2xl": 32,
      },
      spacing: {
        18: 72,  // example: className="h-18" is height: 72px
        22: 88,
      },
      // You can add fontFamily, boxShadow, etc. if needed!
    },
  },
  plugins: [],
}
