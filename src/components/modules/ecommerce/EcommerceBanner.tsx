import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/images/ecommerce/banner_right.webp";

/**
 * Banner / hero.
 *
 * The right-hand visual is one flattened 623x500 asset: the four photos, the two stat
 * cards ("CUSTOMER LOYALTY 94% Retention", "MOBILE STORE £4.2k") and their rounded
 * corners are baked in, so none of them are markup. That means those figures are not
 * selectable or translatable.
 *
 * Outfit comes from the ROOT layout, which puts --font-outfit on <body>, rather than
 * this route's own Plus Jakarta Sans.
 */

// Figma spec: Outfit Medium 14px / 16px, 1.2px letter-spacing, #A07B62.
const eyebrowTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: "1.2px",
} as const;

// Figma spec: Outfit Bold 64px, line-height 100%, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 64px
// overflows a phone viewport.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 20px / 30px, zero letter-spacing, white at 70%.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "20px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 20px, zero letter-spacing, centered, white.
// Shared by both CTAs — they differ only in fill vs outline.
const buttonTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const EcommerceBanner = () => {
  return (
    <section className="w-full bg-[#1E130A] px-4">
      {/* 1420px, matching the navbar. 623px right column is the asset's intrinsic width,
          so the collage renders unscaled. */}
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-12 py-16 lg:grid-cols-2 xl:grid-cols-[1fr_623px] xl:gap-16 lg:py-[100px]">
        {/* Copy column */}
        <div>
          {/* No fill was specced for the eyebrow pill; the accent at 15% keeps it in
              palette against the #1E130A ground. */}
          <p
            className="inline-flex md:items-center gap-2 rounded-full bg-[#2563EB]/12 border-[0.8px] border-[rgba(37,100,235,0.22)] px-4 py-2 text-[#A07B62] uppercase text-[12px] md:text-[14px]"
            style={eyebrowTypography}
          >
            <span aria-hidden="true">&bull;</span>
            Retail, Shop &amp; E-Commerce Technology
          </p>

          {/* The page h1. Line breaks are hard-coded rather than left to wrapping
              because the colour split falls on a line boundary: row one is white and
              the rest is the accent. */}
          <h1
            className="mt-8 text-[34px] leading-[1.15] sm:text-[46px] lg:text-[54px] xl:text-[64px]"
            style={titleTypography}
          >
            <span className="block text-white">Power Your Retail</span>
            <span className="mt-2 md:mt-4 block text-[#A07B62]">
              Business with Smarter
            </span>
            <span className="mt-2 md:mt-4 block text-[#A07B62]">Technology.</span>
          </h1>

          <p
            className="mt-8 max-w-[660px] text-white/70"
            style={paragraphTypography}
          >
            Build your online presence, increase sales, and manage customers,
            orders, and inventory through connected retail solutions.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center rounded-[12px] bg-[#A07B62] px-[30px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#8a684f]"
            >
              Build My Commerce Experience
            </Link>

            {/* Outline variant: white at 60% (the 99 alpha suffix), no fill. `border`
                adds 1px to each axis, so the padding is inset by 1px to keep both
                buttons exactly the same height. */}
            <Link
              href="#solutions"
              style={buttonTypography}
              className="inline-flex items-center gap-2 rounded-[12px] border border-white/60 px-[29px] py-[15px] whitespace-nowrap text-white transition-colors duration-200 hover:border-[#A07B62] hover:bg-[#A07B62]"
            >
              Explore Our Solutions
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Visual column. Intrinsic size is 623x500; width and height come from the
            static import, so only the rendered width is capped here. */}
        <div className="justify-self-center lg:justify-self-end">
          <Image
            src={bannerImage}
            alt="Retail staff using a tablet and phone in store, a customer browsing shelves, and a sales dashboard on a desktop monitor"
            className="h-auto w-full max-w-[623px]"
            sizes="(min-width: 1024px) 623px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default EcommerceBanner;
