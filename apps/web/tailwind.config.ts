import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./storybook/**/*.{ts,tsx,mdx}",
    "./tests/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        violetfund: {
          50: "#f6f5ff",
          500: "#6d5df6",
          700: "#4334c8"
        }
      }
    }
  },
  plugins: []
};

export default config;
