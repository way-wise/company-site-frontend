import { Montserrat, Urbanist } from "next/font/google";

/**
 * Fonts are loaded here rather than in the root layout on purpose: they are used only
 * by this standalone landing page, so scoping them to the route keeps them off every
 * other page's critical path.
 *
 * Both are variable fonts on Google Fonts, so no weight arrays — every weight the page
 * uses resolves from the single axis.
 */
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

// Used only by the stat cards in the "Technology That Helps" section, whose numbers and
// labels are specced in Montserrat rather than the page's Urbanist.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${urbanist.variable} ${montserrat.variable}`}>
      {children}
    </div>
  );
}
