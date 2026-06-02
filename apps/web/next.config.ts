import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@prism/db"],
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
