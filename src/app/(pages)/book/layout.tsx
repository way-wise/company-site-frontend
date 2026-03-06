import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.waywisetech.com"
    : "http://localhost:3000");

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
