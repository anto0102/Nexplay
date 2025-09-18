import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable Vercel image optimization completely to avoid 402 errors
    unoptimized: true,
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
