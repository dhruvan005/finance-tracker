import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ], theme: {
    extend: {      colors: {
        vintageBlue: "#27548A",
        vintageNevyBlue: "#183B4E",
        vintageCream: "#DDA853",
        vintageOffWhite: "#F5EEDC",
        vintageOffWhitePrimary: "#F5EEDC",
        vintageOffWhiteSecondary: "#DDA853",
      },
      fontFamily: {
        lora: ["var(--font-lora)"],
        serif: ["var(--font-lora)"],
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        sora: ["var(--font-sora)"],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
  },
  plugins: [],
};

export default config; 