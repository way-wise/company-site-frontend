import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
