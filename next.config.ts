import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  allowedDevOrigins: ['10.199.42.117', '100.93.57.107'],

  turbopack: {
    root: process.cwd(),
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;

