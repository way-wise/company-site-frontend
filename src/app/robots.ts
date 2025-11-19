import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/profile",
          "/book",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

