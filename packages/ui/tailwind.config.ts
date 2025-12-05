import type { Config } from "tailwindcss";
import sharedConfig from "@medintt/config-tailwind";

const config: Config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/primereact/**/*.{js,ts,jsx,tsx}"
  ],
};

export default config;