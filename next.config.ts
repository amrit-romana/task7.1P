import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "renaissancedecor.com.au",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Allow locally uploaded images from public/uploads without optimization
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/images/**" },
      { pathname: "/fonts/**" },
    ],
  },
};

export default nextConfig;
