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
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#E8EDF5",
          100: "#C5D2E8",
          200: "#8FA8D0",
          300: "#5A7EB8",
          400: "#2D5799",
          500: "#0F2952",
          600: "#0B2044",
          700: "#081836",
          800: "#051028",
          900: "#02081A",
        },
        brand: {
          DEFAULT: "#1A6EC8",
          50: "#EBF3FC",
          100: "#C8DEF7",
          200: "#91BCF0",
          300: "#5A9AE8",
          400: "#2778E0",
          500: "#1A6EC8",
          600: "#1559A3",
          700: "#10447E",
          800: "#0B2F59",
          900: "#061A34",
        },
        energy: {
          DEFAULT: "#00C896",
          50: "#E0FDF4",
          100: "#CCFBEE",
          200: "#99F6DD",
          300: "#5EEDCA",
          400: "#2DE3B7",
          500: "#00C896",
          600: "#00A07A",
          700: "#00785C",
          800: "#00503D",
          900: "#00281F",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["Syne", "IBM Plex Sans", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grid-move": "gridMove 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gridMove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(60px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "linear-gradient(135deg, #0B1F3A 0%, #0F2952 50%, #1A3A6B 100%)",
        "gradient-energy":
          "linear-gradient(135deg, #00C896 0%, #1A6EC8 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(26,110,200,0.1) 0%, rgba(0,200,150,0.05) 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(11,31,58,0.08)",
        "card-hover": "0 8px 40px rgba(11,31,58,0.16)",
        glow: "0 0 40px rgba(0,200,150,0.2)",
        "glow-blue": "0 0 40px rgba(26,110,200,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
