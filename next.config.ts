import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ده بيخلي Vercel يكمل build حتى لو فيه أخطاء lint
  },
  typescript: {
    ignoreBuildErrors: true, // ده بيخلي Vercel يكمل build حتى لو فيه أخطاء types
  },
};

export default nextConfig;
