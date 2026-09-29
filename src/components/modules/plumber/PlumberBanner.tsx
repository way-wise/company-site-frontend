import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import bannerImage from "@/assets/images/plumber/banner_right.webp";
import bannerBg from "@/assets/images/plumber/banner.png";
import bannerVideo from "@/assets/images/plumber/bannervideo.png";
import RestaurentPlayButton from "@/components/modules/restaurant/RestaurentPlayButton";

/**
 * Banner / hero.
 *
 * The right-hand visual is one flattened 625x640 asset: all four photos, their rounded
 * corners and their lime outlines are baked in, so none of them are markup.
 *
 * The ground is a pre-darkened workshop photo (tool wall and bench), so the white copy
 * reads without an extra overlay. #101311 stays underneath as the colour shown before
 * the image paints.
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
    <section id="home" className="relative isolate w-full scroll-mt-[110px] overflow-hidden bg-[#101311] px-4">
      {/* Background photo. `-z-10` inside the `isolate` section keeps it behind the
          content without escaping the section's stacking context. */}
      <Image
        src={bannerBg}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover object-center"
      />

      {/* 1420px, matching the navbar. 625px right column is the asset's intrinsic width,
          so the collage renders unscaled. */}
      <div className="mx-auto lg:flex w-full max-w-[1520px] items-center gap-12 py-15 lg:grid-cols-[1fr_625px] lg:gap-[75px] lg:py-[100px]">
        {/* Copy column */}
        <div className="max-w-[835px]">
          {/* The page h1. Line breaks are hard-coded rather than left to wrapping
              because the colour split falls mid-line on row two. */}
          <h1
            className="text-[32px] leading-[1.15] sm:text-[46px] lg:text-[54px] lg:leading-[74px]"
            style={titleTypography}
          >
            <span className="block text-white">Are You a Repair Vendor or Managing a Service Business? </span>
              <span className="text-[#B6D500]">Explore Our Exclusive Business Service Packages.</span>
  
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

            {/*
              Glass variant — CSS approximation of the Figma Glass effect (Light -45° /
              80%, Refraction 80, Depth 20, Dispersion 50, Frost 4). Refraction and
              dispersion have no reliable CSS equivalent, so they're suggested with a
              saturated backdrop and a diagonal sheen:
                - Frost 4       -> 4px backdrop blur
                - Light -45°    -> bright rim + sheen from the top-left, a fainter echo
                                   at the bottom-right
                - Depth 20      -> soft inner shadow
                - Tint          -> lime wash, as in the frame
              `py-3` + 26px line-height matches the filled button's 50px height.
            */}
            <Link
              href="#our-work"
              style={{
                ...buttonTypography,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.12) 100%), rgba(182,213,0,0.18)",
                boxShadow: [
                  "inset 1.5px 1.5px 0 rgba(255,255,255,0.55)",
                  "inset -1px -1px 0 rgba(255,255,255,0.3)",
                  "inset 0 0 0 1px rgba(255,255,255,0.12)",
                  "inset 0 -8px 20px rgba(0,0,0,0.18)",
                  "0 8px 24px rgba(0,0,0,0.25)",
                ].join(", "),
              }}
              className="inline-flex items-center rounded-[50px] px-[27px] py-3 whitespace-nowrap text-white backdrop-blur-[4px] backdrop-saturate-150 transition-[filter] duration-200 hover:brightness-125"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Visual column. Intrinsic size is 625x640; width and height come from the
            static import, so only the rendered width is capped here. */}
        <div className="relative max-w-[625px] justify-self-center lg:justify-self-end mt-8 lg:mt-0">
          <Image
            src={bannerImage}
            alt="Tradespeople at work: servicing an air conditioner, repairing a car engine, wiring a socket, and fixing a kitchen sink"
            className="h-auto w-full max-w-[625px]"
            sizes="(min-width: 1024px) 625px, 100vw"
            priority
          />

          {/* Video teaser, centred over the collage. The thumbnail's rounded corners
              are baked into the asset; it scales down with the collage on small
              screens (41% ≈ 254 / 625). */}
          <div className="absolute top-1/2 left-1/2 w-[41%] max-w-[254px] -translate-x-1/2 -translate-y-1/2">
            <Image
              src={bannerVideo}
              alt="Video: our team of tradespeople at work"
              className="h-auto w-full"
              sizes="254px"
            />
            <RestaurentPlayButton size="sm" iconClassName="text-[#101311]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlumberBanner;
