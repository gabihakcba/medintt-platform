import type { Config } from "tailwindcss";
import sharedConfig from "@medintt/config-tailwind";
import path from "path";

const config: Config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(__dirname, "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"),
  ],
};

export default config;