import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-progress",
      "@radix-ui/react-accordion",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-navigation-menu",
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
