import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  // This page is a single third-party Heyzine flip-book <iframe> with no crawlable
  // content of its own, so it should never be indexed. `noindex` (not a robots.txt
  // Disallow) is what does that: the Navbar links to /book from every page, so Google
  // will always find it, and a Disallow would block the crawl without preventing the
  // URL from being indexed bare. `follow` is left on so the shared nav/footer links
  // are still crawled normally.
  robots: {
    index: false,
    follow: true,
  },
  // The self-referencing canonical must stay. Removing it would make this page inherit
  // the root layout's alternates.canonical, which points at the homepage — and a
  // noindex page canonicalised to another URL risks Google applying the noindex to
  // that target instead.
  alternates: {
    canonical: `${baseUrl}/book`,
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
