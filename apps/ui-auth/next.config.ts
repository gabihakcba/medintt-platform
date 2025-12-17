import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@medintt/ui", "@medintt/utils", "@medintt/types-auth"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.medintt.com http://localhost:*;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
