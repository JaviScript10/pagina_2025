import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignora errores de watchOptions en rutas de red
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**'],
      poll: 1000, // Usa polling en lugar de filesystem events
    };
    return config;
  },
};

export default nextConfig;