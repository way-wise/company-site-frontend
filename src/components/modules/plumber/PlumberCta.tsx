import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Closing call to action — full-bleed accent panel.
 */

// Figma spec: Plus Jakarta Sans ExtraBold 60px / 72px, -1.5px letter-spacing, centered,
// #101311. Larger than the other section headings on this page, which run 48px.
// Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.5px",
} as const;

// Figma spec: Plus Jakarta Sans Medium 18px / 28px, centered, #2D3D2F.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: white label on #101311, 20px gap to the arrow, radius 10px, 15px/60px
// padding. No type ramp was given for the label, so it follows the page's button
// convention: SemiBold 16px / 18px.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 19.5px, centered, #101311.
const noteTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

const PlumberCta = () => {
  return (
    <section className="w-full bg-[#B6D500] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[32px] leading-[1.2] text-[#101311] sm:text-[42px] lg:text-[52px] xl:text-[60px] xl:leading-[72px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Ready to Build a Smarter</span>
          <span className="block">Service Business?</span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-[760px] text-center text-[#2D3D2F]"
          style={paragraphTypography}
        >
          Let&apos;s create the digital foundation, customer experience, and
          operational systems your team needs to grow with confidence.
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/contact-us"
            style={buttonTypography}
            className="inline-flex items-center gap-5 rounded-[10px] bg-[#101311] px-[60px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#252E28]"
          >
            Start Growing Today
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* `bg-[#101311]/8` is the 14 alpha suffix expressed as a Tailwind opacity
            modifier — same colour, fewer magic hex digits. */}
        <p
          className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-[100px] bg-[#101311]/8 px-5 py-2.5 text-center text-[#101311]"
          style={noteTypography}
        >
          <span aria-hidden="true" className="hidden lg:block">&bull;</span>
          No pressure. Just a clear conversation about where your business is
          today and what it needs next.
        </p>
      </div>
    </section>
  );
};

export default PlumberCta;
