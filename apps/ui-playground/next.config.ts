import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['@medintt/ui', '@medintt/utils'],
};

export default nextConfig;
