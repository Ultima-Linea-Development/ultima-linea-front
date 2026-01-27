import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photo.yupoo.com",
      },
    ],
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  transpilePackages: ["react-icons"],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.ultimalinea.com.ar";
    
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api-proxy/:path*",
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    
    return [];
  },
};

export default nextConfig;
