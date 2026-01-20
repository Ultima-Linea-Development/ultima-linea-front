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
};

export default nextConfig;
