import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Banner / hero.
 *
 * Two supplied assets: `banner.webp` is the dark restaurant backdrop that covers the
 * whole section, and `banner_right.webp` is one flattened composite — the phone, the
 * dashboard, the chef photo and all four floating badges ("Table Reserved", "New Order ·
 * Table 7", "Repeat Customer") are baked in, so none of them are markup. That means
 * their text is not selectable or translatable.
 *
 * Both live in `public/` rather than `src/assets/`, which is where they were supplied,
 * so they are referenced by path and need their intrinsic sizes declared by hand.
 */
const BACKDROP = "/images/restaurant/banner.webp";
const VISUAL = "/images/restaurant/banner_right.webp";
const VISUAL_WIDTH = 845;
const VISUAL_HEIGHT = 715;

// Figma spec: Plus Jakarta Sans Bold 70px, line-height 100%, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 70px/100%
// overflows a phone viewport.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 28.05px, zero letter-spacing, white.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "28.05px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px, line-height 100%, zero letter-spacing.
// Shared by both CTAs — they differ only in fill vs outline.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

const RestaurantBanner = () => {
  return (
    // The dark fill on the section itself is a fallback, so the white copy never lands
    // on bare white in the moment before the photo paints.
    // No scroll-mt: this page's navbar is not sticky, so nothing overlays the anchor.
    <section id="home" className="relative scroll-mt-[110px] overflow-hidden bg-[#1A1310]">
      {/* Backdrop. `fill` rather than an in-flow image: the section's height comes from
          the copy and the visual, and the photo has to cover whatever that turns out to
          be. The asset is already darkened, so no scrim is layered on top. */}
      <Image
        src={BACKDROP}
        alt=""
        fill
        aria-hidden="true"
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* `relative` lifts the content above the absolutely-positioned backdrop. */}
      <div className="relative w-full px-4">
        <div className="mx-auto grid w-full max-w-[1560px] items-center gap-12 py-15 lg:py-30 lg:grid-cols-[820fr_740fr] lg:gap-8">
          {/* Copy column */}
          <div>
            {/* The page h1. Line breaks are hard-coded rather than left to wrapping
                because the colour split falls on line boundaries: line 2 is the accent. */}
            <h1
              className="text-[32px] sm:text-[52px] xl:text-[58px] xl:text-[70px]"
              style={titleTypography}
            >
              <span className="block text-white">Digital Solutions For</span>
              <span className="block text-[#E94222] leading-12 lg:leading-17.5">Food &amp; Restaurant</span>
              <span className="block text-white ">Industry</span>
            </h1>

            <p
              className="mt-[30px] max-w-[640px] text-white"
              style={paragraphTypography}
            >
              We help restaurants, caf&eacute;s, food brands, and multi-location
              operators build the digital systems they need to attract more
              customers, increase repeat business, and run with greater
              efficiency.
            </p>

            <div className="mt-[60px] flex flex-wrap items-center gap-5">
              <Link
                href="/contact-us"
                style={buttonTypography}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#E94222] px-[30px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#cf3517]"
              >
                Book a Free Consultation
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>

              {/* Outline variant: same box, same type, no fill. The 1.5px border adds
                  3px to each axis, so the padding is inset by 1.5px to keep both
                  buttons exactly the same height. */}
              <Link
                href="#our-work"
                style={buttonTypography}
                className="inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#E94222] px-[28.5px] py-[14.5px] whitespace-nowrap text-[#E94222] transition-colors duration-200 hover:bg-[#E94222] hover:text-white"
              >
                View Our Work
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Visual column */}
          <div className="justify-self-center lg:justify-self-end">
            <Image
              src={VISUAL}
              alt="Restaurant ordering app on a phone beside a revenue dashboard and a chef reviewing orders on a tablet"
              width={VISUAL_WIDTH}
              height={VISUAL_HEIGHT}
              className="h-auto w-full max-w-[845px]"
              sizes="(min-width: 1024px) 845px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantBanner;
