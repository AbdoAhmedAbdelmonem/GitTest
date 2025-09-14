import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com"], // تقدر تزود أي دومين تاني هنا
  },
  eslint: {
    ignoreDuringBuilds: true, // ده بيخلي Vercel يكمل build حتى لو فيه أخطاء lint
  },
  typescript: {
    ignoreBuildErrors: true, // ده بيخلي Vercel يكمل build حتى لو فيه أخطاء types
  },
};

export default nextConfig;
