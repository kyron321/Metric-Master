import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "768px",
        md: "1024px",
        lg: "1280px",
        xl: "1440px",
      },
      colors: {
        "primary": "#374151",
        "secondary": "#0071b8",
        "primary-dark": "#374151",
        "secondary-dark": "#005b94",
        "mm-grey": "#1f2937",
        "mm-grey-dark": "#19212d",
        "mm-white": "#fbfbfb",
        "mm-white-dark": "#f0f0f0",
        "mm-red": "#FF0000",
        "mm-red-dark": "#CC0000",
        "mm-bad": "#FF0000",
        "mm-average": "#FFA500",
        "mm-good": "#32CD32",
      },
      fontFamily: {
        montserrat: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
