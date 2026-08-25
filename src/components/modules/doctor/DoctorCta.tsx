import Link from "next/link";
import DoctorContainer from "./DoctorContainer";

/**
 * Section 15 — closing call to action.
 *
 * Note the headline is Inter ExtraBold, not Rajdhani like the other section headings —
 * hence no <DoctorSectionHeading> here, and no eyebrow.
 */

// Figma spec: Inter ExtraBold 48px / 52.8px, -0.8px letter-spacing, centred.
const headlineTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  letterSpacing: "-0.8px",
} as const;

// Figma spec: Inter Regular 16px / 27.2px, zero letter-spacing, centred, #B8B8B8.
const paragraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "27.2px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 18px / 18px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter SemiBold 16px / 27.2px, zero letter-spacing, centred, #B8B8B8.
const reassuranceTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "27.2px",
  letterSpacing: "0",
} as const;

const DoctorCta = () => {
  return (
    <section
      // Deep indigo sweeping to violet, with a bright lilac bloom right of centre.
      // Eyeballed from the Figma export — no values were given.
      style={{
        background:
          "radial-gradient(45% 75% at 86% 45%, rgba(178,150,252,0.95) 0%, rgba(178,150,252,0) 62%), radial-gradient(60% 90% at 62% 55%, rgba(104,52,214,0.75) 0%, rgba(104,52,214,0) 70%), linear-gradient(90deg, #1D0A4C 0%, #2A1270 38%, #4A22A8 70%, #6B3FD8 100%)",
      }}
    >
      <DoctorContainer className="py-15 lg:py-28">
        {/* h2: the page <h1> lives in the banner. */}
        <h2
          style={headlineTypography}
          className="mx-auto max-w-225 text-center font-extrabold text-white text-[30px] leading-10 lg:text-[48px] lg:leading-[64px]"
        >
          Let&rsquo;s Build Something That Moves Your Business Forward
        </h2>

        <p
          style={paragraphTypography}
          className="mx-auto mt-8 max-w-156 text-center text-[#B8B8B8]"
        >
          Join over 120 businesses that trust Way Wise Tech to design, build,
          and scale their digital products.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/contact-us"
            style={buttonTypography}
            className="inline-flex items-center gap-3 rounded-lg bg-[#007AFF] px-12 py-6 font-medium text-white transition-colors duration-200 hover:bg-[#0069DB]"
          >
            Start Growing Today
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>

        <p
          style={reassuranceTypography}
          className="mt-6 text-center font-semibold text-[#B8B8B8]"
        >
          No contracts, Fast delivery, Results-focused
        </p>
      </DoctorContainer>
    </section>
  );
};

export default DoctorCta;
