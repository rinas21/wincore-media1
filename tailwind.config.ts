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
        background: "#ffffff",
        foreground: "#0a0a0a",
        accent: "#0088cc",
        secondary: "#6e563a",
        muted: "var(--surface-muted)",
      },
      fontFamily: {
        sans: ["var(--font-satoshi)", "Inter", "sans-serif"],
        heading: ["var(--font-neue-haas)", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
