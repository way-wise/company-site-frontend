import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

export const metadata: Metadata = {
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
