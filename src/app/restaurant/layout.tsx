import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import RestaurantSmoothScroll from "@/components/modules/restaurant/RestaurantSmoothScroll";

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

// Used by the stat cards and the rating pill in the "Scale Faster" section. Poppins has
// no variable axis on Google Fonts, so the weights used have to be listed explicitly.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${plusJakartaSans.variable} ${poppins.variable}`}>
      <RestaurantSmoothScroll />
      {children}
    </div>
  );
}
