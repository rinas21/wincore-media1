import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "thefirstthelast.agency",
      },
      {
        protocol: "https",
        hostname: "assets.thefirstthelast.agency",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
