import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import betterWay from "@/assets/images/plumber/betterway.webp";

/**
 * "More Than a Website. A Better Way to Operate." — photo on the left, a benefit list
 * and CTA on the right.
 *
 * The photo is a static import from `src/assets/`, so next/image reads its intrinsic
 * 540x514 size and no width/height is declared by hand.
 */

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, -1.2px letter-spacing.
// Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 20px, zero letter-spacing, #C8D0C8.
const pointTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 18px, zero letter-spacing, #101311.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

const points = [
  "Improve project and team communication",
  "Reduce delays and manual follow-ups",
  "Keep client and job information organized",
  "Manage contractors and vendors efficiently",
  "Give field teams access from anywhere",
  "Create a more professional client experience",
  "Build systems that grow with your business",
];

const PlumberBetterWay = () => {
  return (
    <section className="w-full bg-[#1B231D] px-4">
      {/* 540px left column is the asset's intrinsic width, so the photo renders
          unscaled at wide viewports. */}
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 py-10 lg:grid-cols-[540px_1fr] lg:gap-[90px] lg:py-[100px]">
        {/* Visual column */}
        <div className="order-2 lg:order-1 lg:justify-self-start">
          <Image
            src={betterWay}
            alt="Office coordinator pointing at a job-dispatch dashboard on a monitor, with a service van and technician behind her"
            className="h-auto w-full max-w-[540px] rounded-[16px]"
            sizes="(min-width: 1024px) 540px, 100vw"
          />
        </div>

        {/* Copy column */}
        <div className="order-1 lg:order-2">
          <h2
            className="text-[30px] leading-[1.2] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard break reproduced from the Figma frame: the colour split falls
                mid-line on row one, so the rows cannot be left to wrap freely. */}
            <span className="xl:block">
              <span className="text-[#F7F8F3]">More Than a Website. </span>
              <span className="text-[#B6D500]">A Better </span>
            </span>
            <span className="xl:block text-[#B6D500]">Way to Operate.</span>
          </h2>

          <ul className="mt-8 flex flex-col gap-5">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                {/* 24px disc at the accent's 15% (the 26 alpha suffix), with the tick
                    itself at full strength. */}
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#B6D500]/15"
                  aria-hidden="true"
                >
                  <Check className="size-3.5 text-[#B6D500]" />
                </span>
                <span className="text-[#C8D0C8]" style={pointTypography}>
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center gap-3 rounded-[10px] bg-[#B6D500] px-[60px] py-4 whitespace-nowrap text-[#101311] transition-colors duration-200 hover:bg-[#a2bf00]"
            >
              Start Growing Today
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlumberBetterWay;
