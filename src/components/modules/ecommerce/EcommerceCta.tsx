import Image from "next/image";
import Link from "next/link";
import ctaBanner from "@/assets/images/ecommerce/ctabanner.webp";

/**
 * Closing CTA — full-bleed bronze band with a centred headline, blurb and one button.
 *
 * The asset is the whole background, 1920x520: the bronze fill and both clusters of
 * tinted 3D props are baked in, and the middle is left flat for the copy. It is therefore
 * decorative (empty alt) and laid in with `fill` + `object-cover`, so narrow viewports
 * crop the props at the edges and leave the copy area clean rather than squashing them.
 *
 * `bg-[#A17D65]` is that asset's own flat fill, sampled from the file rather than reused
 * from the palette — the page accent is #A07B62, one step off, which would show as a seam
 * wherever the band is taller than the image can cover.
 */

// Figma spec: Outfit SemiBold 64px / 60px, zero letter-spacing, centered, white.
// Only the desktop size is specced; the steps below it are mine — 64px overflows a phone.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 20px / 32px, zero letter-spacing, centered, white at 75%.
// Inter comes from the ROOT layout, which puts --font-inter on <body>.
const paragraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "20px",
  lineHeight: "32px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 20px, zero letter-spacing, centered, white.
const buttonTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const EcommerceCta = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#A17D65]">
      {/* Decorative, so `alt` is empty: the props carry no information the copy does not
          already state. No `priority` — this sits at the bottom of the page. */}
      <Image
        src={ctaBanner}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* `relative` lifts the copy above the absolutely-positioned background. */}
      <div className="relative mx-auto w-full max-w-[1420px] px-4 py-10 text-center lg:py-[100px]">
        {/* 760px is what reproduces the frame's two-line break without hard-coding it:
            "…a Smarter" fits, adding "Retail" does not. */}
        <h2
          style={titleTypography}
          className="mx-auto max-w-[760px] text-[34px] leading-[1.1] text-white sm:text-[44px] lg:text-[54px] xl:text-[64px] xl:leading-15"
        >
          Ready to Build a Smarter Retail Business?
        </h2>

        <p
          style={paragraphTypography}
          className="mx-auto mt-5 max-w-[720px] text-white/75"
        >
          Let&apos;s create a connected digital commerce experience that helps
          your business attract more customers, manage operations confidently,
          and grow without limits.
        </p>

        <div className="mt-6">
          <Link
            href="/contact-us"
            style={buttonTypography}
            className="inline-flex items-center rounded-[10px] bg-[#1E130A] px-5 lg:px-[30px] py-3 lg:py-[18px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#2A1B10]"
          >
            Get a Free Commerce Assessment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EcommerceCta;
