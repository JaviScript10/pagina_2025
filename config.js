/** @type {import('next').NextConfig} */
const isSpeed = process.env.NEXT_PUBLIC_OPT_SPEED === '1';

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        optimizePackageImports: ['framer-motion'], // reduce bundle si lo usas mucho
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        // si usas imágenes remotas, agrega aquí dominios permitidos:
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
        ],
    },
    async headers() {
        if (!isSpeed) return [];

        return [
            // Cache robusta para estáticos de Next (hash en nombre de archivo)
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            // Public/brand y otras imágenes “propias”
            {
                source: '/brand/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400' },
                ],
            },
            // Recursos comunes en /public (og.jpg, favicons, etc.)
            {
                source: '/:file(.*\\.(?:ico|png|jpg|jpeg|svg|webp|avif|gif))',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400' },
                ],
            },
            // CSS global (si se sirve desde /_next/static ya tiene hash; esto es “por si acaso”)
            {
                source: '/:file(.*\\.(?:css|js))',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
