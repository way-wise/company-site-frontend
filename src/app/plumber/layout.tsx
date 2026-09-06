import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * Fonts are loaded here rather than in the root layout on purpose: they are used only
 * by this standalone landing page, so scoping them to the route keeps them off every
 * other page's critical path.
 *
 * Plus Jakarta Sans is a variable font on Google Fonts, so no weight array — every
 * weight the page uses resolves from the single axis.
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function PlumberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={plusJakartaSans.variable}>{children}</div>;
}
