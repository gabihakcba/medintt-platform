import type { Config } from "tailwindcss";
import sharedConfig from "@medintt/config-tailwind";

const config: Config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;