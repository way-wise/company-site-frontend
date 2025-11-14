import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Web Development Company USA | Custom Software Solutions",
  description:
    "Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses seeking innovation and reliability.",
  keywords: [
    "web development company",
    "web development firm",
    "custom web development",
    "web development company USA",
    "web development firm USA",
    "ecommerce web development",
    "custom software development",
    "web app development",
    "react js development",
    "node js development",
    "python web development",
    "laravel web development",
    "wordpress development",
    "shopify development",
    "magento development",
    "enterprise web development",
    "offshore web development",
    "best web development company",
    "top web development firm",
  ],
  authors: [{ name: "Way Wise Tech" }],
  creator: "Way Wise Tech",
  publisher: "Way Wise Tech",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Way Wise Tech",
    title:
      "Web Development Company USA | Custom Software Solutions | Way Wise Tech",
    description:
      "Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses.",
    images: [
      {
        url: `${baseUrl}/_next/static/media/way-wise-logo`,
        width: 1200,
        height: 630,
        alt: "Way Wise Tech - Web Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Company USA | Custom Software Solutions",
    description:
      "Top-rated web development company in the USA providing custom software development and digital solutions.",
    images: [`${baseUrl}/_next/static/media/way-wise-logo`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Toaster position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
