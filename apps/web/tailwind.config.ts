import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        prism: {
          50: "#f0f4ff",
          100: "#e0eaff",
          500: "#4f6ef7",
          600: "#3b5af5",
          700: "#2d48e0",
          900: "#1a2a8a",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
