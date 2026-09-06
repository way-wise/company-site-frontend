import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import bannerImage from "@/assets/images/plumber/banner_right.webp";

/**
 * Banner / hero.
 *
 * The right-hand visual is one flattened 625x640 asset: all four photos, their rounded
 * corners and their lime outlines are baked in, so none of them are markup.
 *
 * NOTE: the Figma frame's ground is a dark blueprint texture (pipes, circuitry). No such
 * asset was supplied, so the section falls back to a flat #101311 — flagged to the user.
 */

// Figma spec: Plus Jakarta Sans ExtraBold 64px / 74px, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 64px
// overflows a phone viewport.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 20px / 34px, -0.2px letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "20px",
  lineHeight: "34px",
  letterSpacing: "-0.2px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 16px / 26px, -0.2px letter-spacing.
// Shared by both CTAs — they differ only in fill and ink.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "-0.2px",
} as const;

const PlumberBanner = () => {
  return (
    <section id="home" className="w-full scroll-mt-[110px] bg-[#101311] px-4">
      {/* 1420px, matching the navbar. 625px right column is the asset's intrinsic width,
          so the collage renders unscaled. */}
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-12 py-15 lg:grid-cols-[1fr_625px] lg:gap-[75px] lg:py-[100px]">
        {/* Copy column */}
        <div>
          {/* The page h1. Line breaks are hard-coded rather than left to wrapping
              because the colour split falls mid-line on row two. */}
          <h1
            className="text-[32px] leading-[1.15] sm:text-[46px] lg:text-[56px] xl:text-[62px] xl:leading-[74px]"
            style={titleTypography}
          >
            <span className="block text-white">Power Your Business</span>
            <span className="block">
              <span className="text-white">with </span>
              <span className="text-[#B6D500]">Smart Technology</span>
            </span>
            <span className="block text-white">&amp; Grow Faster</span>
          </h1>

          {/* No colour specced for the body copy; it reads white on this dark ground. */}
          <p
            className="mt-8 max-w-[700px] text-white"
            style={paragraphTypography}
          >
            We build websites, booking systems, automation, and custom software
            that help service businesses attract customers and simplify
            operations.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/*
              Filled variant: white pill with the arrow in a 32px lime disc on the
              LEFT of the label. The 9px padding plus that 32px disc is what gives the
              button its height, so the two buttons match without a fixed height.
            */}
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="group inline-flex items-center gap-3 rounded-[50px] bg-white py-[9px] pr-6 pl-[9px] whitespace-nowrap text-[#101311] transition-colors duration-200 hover:bg-[#F7F8F3]"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#B6D500]"
                aria-hidden="true"
              >
                <ArrowUpRight className="size-4 text-[#101311]" />
              </span>
              Free Consultation
            </Link>

            {/* Outline variant: the accent at 15% (the 26 alpha suffix) with white ink.
                `py-3` + 26px line-height matches the filled button's 50px height. */}
            <Link
              href="#our-work"
              style={buttonTypography}
              className="inline-flex items-center rounded-[50px] bg-[#B6D500]/15 px-[27px] py-3 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#B6D500]/25"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Visual column. Intrinsic size is 625x640; width and height come from the
            static import, so only the rendered width is capped here. */}
        <div className="justify-self-center lg:justify-self-end">
          <Image
            src={bannerImage}
            alt="Tradespeople at work: servicing an air conditioner, repairing a car engine, wiring a socket, and fixing a kitchen sink"
            className="h-auto w-full max-w-[625px]"
            sizes="(min-width: 1024px) 625px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default PlumberBanner;
