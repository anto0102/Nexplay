import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep optimization only for local images, disable for TMDB
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Remove TMDB from remotePatterns to prevent Next.js optimization
    remotePatterns: [],
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
