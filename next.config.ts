import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
    // Minimize transformations: only essential sizes and formats
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1200],
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 3600, // Cache for 1 hour
    dangerouslyAllowSVG: false,
  },
  // Optimizations for SSR and performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization
  trailingSlash: false,
};

export default nextConfig;
