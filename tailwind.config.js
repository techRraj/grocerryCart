/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#168653",
        "primary-dark": "#105C3B",
        "primary-light": "#EAF7EF",
        mint: "#F3FAF5",
        bg: "#F8FAF8",
        ink: "#17251D",
        muted: "#758078",
        accent: "#FFAA45",
        success: "#22A06B",
        warning: "#F2A541",
        error: "#E05252",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: {
        soft: "0 2px 12px rgba(23,37,29,0.06)",
        card: "0 4px 20px rgba(23,37,29,0.08)",
      },
    },
  },
  plugins: [],
};