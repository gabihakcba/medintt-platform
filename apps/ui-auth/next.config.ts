import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@medintt/ui", "@medintt/utils", "@medintt/types-auth"],
  turbopack: {},

  webpack: (config, { isServer, webpack }) => {
    // <--- Agrega 'webpack' aquí en los argumentos
    if (!isServer) {
      // ESTRATEGIA 1: Fallbacks para módulos nativos de Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        perf_hooks: false,
        path: false,
        fs: false,
        os: false,
        child_process: false,
        net: false,
        tls: false,
        repl: false,
        "class-transformer/storage": false,
      };

      // ESTRATEGIA 2: IgnorePlugin para paquetes de NestJS
      // Esto es más agresivo y efectivo que el fallback para 'optionalRequire'
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /^@nestjs\/(swagger|microservices|websockets|platform-express|core)/,
        }),
      );

      // Opcional: Ignorar drivers de base de datos si se cuelan
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /^(pg-native|sqlite3|mysql2|oracledb|pg-query-stream)$/,
        }),
      );
    }
    return config;
  },
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
