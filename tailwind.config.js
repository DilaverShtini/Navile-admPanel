/** @type {import('tailwindcss').Config} */
export default {
  content: ["./nuxt.config.ts", "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: `"cabin", sans-serif`,
      serif: `"trajan", serif`,
      mono: `"fira code", monospace`
    },
    extend: { colors: {
        primary: {
          DEFAULT: "#ECEFF1",
          light: "#FBFBFC"
        },
        accent: {
          DEFAULT: "#D32F2F",
          50: "rgb(#D32F2F / 0.5)",
          30: "rgb(#D32F2F / 0.3)"
        },
        success: "#69F0AE",
        warning: "#FFE57F",
        error: "#EF5350",
        light: {
          DEFAULT: "rgb(255 255 255)",
          70: "rgb(255 255 255 / 0.7)",
          50: "rgb(255 255 255 / 0.5)",
          12: "rgb(255 255 255 / 0.12)",
          //08: "rgb(255 255 255 / 0.08)"
        },
        dark: {
          DEFAULT: "rgb(0 0 0 / 0.8)",
          54: "rgb(0 0 0 / 0.54)",
          38: "rgb(0 0 0 / 0.38)",
          12: "rgb(0 0 0 / 0.12)",
          //08: "rgb(0 0 0 / 0.08)"
        }
      },
      transitionDuration: {
        DEFAULT: "200ms"
      }
    }
  },
  plugins: [],
}

