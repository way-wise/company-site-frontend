import { DM_Sans, Rajdhani } from "next/font/google";

/**
 * Fonts are loaded here rather than in the root layout on purpose: they are used only
 * by this standalone landing page, so scoping them to the route keeps them off every
 * other page's critical path.
 *
 * Extra weights are declared up front so later sections don't need to touch this file.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Display face for headlines. Rajdhani has no italic and no variable axis on Google
// Fonts, so the weights needed must be listed explicitly.
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export default function AttorneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} ${rajdhani.variable}`}>{children}</div>
  );
}
