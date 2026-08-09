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
    useCache: true,
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
   const rawBaseApi = process.env.NEXT_PUBLIC_BASE_API;
   const apiOrigin = rawBaseApi?.replace(/\/api\/v1\/?$/, "");

   if (!apiOrigin && process.env.NODE_ENV === "production") {
     throw new Error(
       "NEXT_PUBLIC_BASE_API is not set. Refusing to build production with a localhost API fallback."
     );
   }

   return [
     {
       source: "/api/:path*",
       destination: `${apiOrigin || "http://localhost:5000"}/api/v1/:path*`,
     },
   ];
  },
};

export default nextConfig;
