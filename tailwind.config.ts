import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0a0908",
          panel: "#15130f",
          raised: "#1e1b16",
          line: "#332c22",
        },
        parchment: "#e9dfc7",
        gold: {
          DEFAULT: "#c9a34a",
          bright: "#f0cd7a",
          dim: "#7a6531",
        },
        blood: {
          DEFAULT: "#7d1d1d",
          bright: "#b3372f",
        },
        rune: {
          DEFAULT: "#4f7a3d",
          glow: "#8fce5c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "stone-gradient":
          "radial-gradient(ellipse at top, #1e1b16 0%, #0a0908 60%)",
        "socket-glow":
          "radial-gradient(circle, rgba(143,206,92,0.35) 0%, rgba(143,206,92,0) 70%)",
      },
      boxShadow: {
        rune: "0 0 12px rgba(143,206,92,0.55)",
        gold: "0 0 16px rgba(240,205,122,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
