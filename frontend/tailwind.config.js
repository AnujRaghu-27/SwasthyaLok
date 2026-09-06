/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D7A5F",
          dark: "#005F49",
          light: "#E6F5F0",
          fixed: "#98F4D3",
          "fixed-dim": "#7CD8B8",
          container: "#0D7A5F",
          "on-container": "#A8FFDF",
        },
        secondary: {
          DEFAULT: "#D97706",
          dark: "#904D00",
          light: "#FEF3C7",
          container: "#FE932C",
          fixed: "#FFDCC3",
          "fixed-dim": "#FFB77D",
        },
        tertiary: {
          DEFAULT: "#059669",
          dark: "#006041",
          container: "#007B55",
          fixed: "#85F8C4",
        },
        error: {
          DEFAULT: "#DC2626",
          dark: "#BA1A1A",
          container: "#FFDAD6",
          "on-container": "#93000A",
        },
        surface: {
          DEFAULT: "#FAF8FF",
          dim: "#D2D9F4",
          bright: "#FAF8FF",
          container: "#EAEDFF",
          "container-low": "#F2F3FF",
          "container-high": "#E2E7FF",
          "container-highest": "#DAE2FD",
          "container-lowest": "#FFFFFF",
        },
        "on-surface": "#131B2E",
        "on-surface-variant": "#3E4944",
        "outline-custom": "#6E7A74",
        "outline-variant": "#BDC9C2",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        noto: ["Noto Sans", "sans-serif"],
      },
      spacing: {
        "touch-min": "3.5rem",
        "touch-kiosk": "4.5rem",
        "gutter-kiosk": "2rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
