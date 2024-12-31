import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dropdownBg: "#2d3748", // Custom background color for dropdown
        dropdownText: "#ffffff", // Custom text color for dropdown
      },
    },
  },
  plugins: [],
} satisfies Config;