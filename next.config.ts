import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚡ Webpack config original
  webpack: (config) => {
    // Ignora errores de watchOptions en rutas de red
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**'],
      poll: 1000,
    };
    return config;
  },

  // ⚡ Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'], // Formatos modernos
    minimumCacheTTL: 31536000, // Cache de 1 año
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Tamaños optimizados
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // ⚡ Compresión gzip/brotli
  compress: true,

  // ⚡ Ocultar header "X-Powered-By: Next.js"
  poweredByHeader: false,

  // ⚡ Headers de seguridad y performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Seguridad
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      // Cache agresivo para assets estáticos
      {
        source: '/brand/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      // Preconnect hints
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '<https://images.unsplash.com>; rel=preconnect; crossorigin'
          }
        ],
      }
    ];
  },

  // ⚡ Optimización de producción
  productionBrowserSourceMaps: false, // No generar source maps en prod
  reactStrictMode: true, // Modo estricto de React
  // swcMinify ya viene por defecto en Next.js 15+

  // ⚡ Experimental (opcional - descomentar si quieres probar)
  // experimental: {
  //   optimizeCss: true, // Optimizar CSS crítico
  //   optimizePackageImports: ['lucide-react'], // Tree-shaking agresivo
  // },
};

export default nextConfig;