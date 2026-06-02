/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@prism/db"],
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
