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
  // Crawlers that parse the raw HTML and expect metadata inside <head>. For these UAs Next.js
  // does a blocking render instead of streaming metadata after </head>. This is Next's default
  // list (see next/dist/shared/lib/router/utils/html-bots) plus the SEO audit crawlers, which
  // otherwise report "meta robots outside of the <head> element" on dynamically rendered pages.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Screaming ?Frog|Sitebulb|AhrefsBot|AhrefsSiteAudit|SemrushBot|SiteAuditBot|MJ12bot|DotBot|rogerbot|PetalBot|SeznamBot|Pinterestbot|CCBot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|PerplexityBot|Amazonbot/i,
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
  async headers() {
    return [
      {
        // Every path, including static assets under /public — the header has to be on the
        // response that would be framed. Set here rather than in middleware.ts, whose
        // matcher is a fixed route list that misses /blog, /sitemap-page and others.
        source: "/:path*",
        headers: [
          {
            // SAMEORIGIN, not DENY: /tech-profile embeds a same-origin PDF
            // (/pdfs/Tech_Profile_for_AK_Print.pdf) in an iframe, which DENY would block.
            // Third-party embeds (Calendly, Heyzine, GTM) are unaffected either way —
            // this header only governs who may frame *our* pages.
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Deliberately omits script-src/style-src/img-src. Those need a full inventory of
            // every origin GTM injects at runtime, and Next.js's inline hydration scripts would
            // need a per-request nonce — which forces dynamic rendering and would undo the
            // static prerendering that keeps metadata inside <head> (see generateStaticParams
            // in services/[serviceId]). Locking down scripts is a separate, browser-tested job;
            // start it with Content-Security-Policy-Report-Only, never straight to enforcing.
            //
            // What is here is the safe baseline that needs no script inventory:
            //   frame-ancestors - who may frame us (modern X-Frame-Options)
            //   base-uri        - blocks injected <base> tags redirecting relative URLs
            //   object-src      - no <object>/<embed> anywhere in the app
            //   form-action     - every form is JS-handled; none posts to an external origin
            key: "Content-Security-Policy",
            value: [
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            // Send the full URL only to same-origin destinations; cross-origin requests get
            // just the origin, and HTTPS->HTTP downgrades get nothing. This is already the
            // default in current Chrome/Firefox/Safari — setting it explicitly covers older
            // browsers and makes the policy auditable. Inbound referrer data for our own
            // analytics is set by the *referring* site, so it is unaffected.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Stop browsers MIME-sniffing a response away from its declared Content-Type,
            // which is how a non-script upload can end up executed as script.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Only features nothing in this app uses. Deliberately NOT restricted:
            //   payment         - Stripe PaymentElement renders Apple/Google Pay wallets
            //   clipboard-write - share-buttons.tsx, and the /book iframe requests it
            //   fullscreen      - the Heyzine flipbook iframe on /book uses allowFullScreen
            // Check those call sites before adding anything to this list.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
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
