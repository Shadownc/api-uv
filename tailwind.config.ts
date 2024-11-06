import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1a56db",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          600: "#0284c7",
          700: "#0369a1",
        },
        success: {
          DEFAULT: "#16a34a",
          50: "#f0fdf4",
          100: "#dcfce7",
        },
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
};
export default config;