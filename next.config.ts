import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Webpack optimizado
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**'],
      poll: 1000,
    };

    // ✅ Optimización adicional: tree shaking agresivo
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // ✅ Optimización de imágenes NIVEL NASA
  images: {
    formats: ['image/avif', 'image/webp'], // Formatos modernos prioritarios
    minimumCacheTTL: 31536000, // Cache de 1 año
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false, // Seguridad
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // ✅ Calidad optimizada para balance perfecto
    unoptimized: false,
  },

  // ✅ Compresión máxima
  compress: true,

  // ✅ Sin header innecesario
  poweredByHeader: false,

  // ✅ Modo estricto
  reactStrictMode: true,

  // ✅ Sin source maps en producción (más rápido)
  productionBrowserSourceMaps: false,

  // ✅ Experimental features para máximo performance
  experimental: {
    optimizeCss: true, // CSS crítico inline
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'], // Tree-shaking
    
    // Turbopack en desarrollo (más rápido)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // ✅ Headers de seguridad y performance NIVEL NASA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Performance hints
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Seguridad
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
        ],
      },
      // ✅ Cache inmutable para assets estáticos
      {
        source: '/brand/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      // ✅ Preconnect a dominios externos críticos
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '<https://images.unsplash.com>; rel=preconnect; crossorigin, <https://fonts.googleapis.com>; rel=preconnect; crossorigin'
          }
        ],
      }
    ];
  },

  // ✅ Redirects optimizados (si los necesitas)
  async redirects() {
    return [];
  },

  // ✅ Rewrites optimizados (si los necesitas)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
