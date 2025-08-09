import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // This will skip ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: Skip TypeScript errors too
  }
};

export default nextConfig;
