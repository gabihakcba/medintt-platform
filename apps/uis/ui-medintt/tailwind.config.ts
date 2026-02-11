import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/componentes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f2937",
          light: "#4b5563",
          accent: "#34d399",
        },
        main: {
          beige: "#faf9f2",
          azul: "#29296c",
        },
      },
      fontFamily: {
        primary: ["var(--font-geist-sans)", "sans-serif"],
        secondary: ['"Host Grotesk"', "sans-serif"],
      },
      fontSize: {
        small: ["0.875rem", { lineHeight: "1.4" }],
        medium: ["1rem", { lineHeight: "1.5" }],
        large: ["1.25rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const colors = theme("colors.main") as Record<string, string> | undefined;

      if (!colors) return;

      const textUtilities = Object.entries(colors).reduce<
        Record<string, { color: string }>
      >((acc, [key, value]) => {
        acc[`.color-main-${key}`] = { color: value };
        return acc;
      }, {});

      addUtilities(textUtilities);
    }),
  ],
};

export default config;
