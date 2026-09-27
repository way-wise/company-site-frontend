import Image from "next/image";
import builtForImage from "@/assets/images/attorney/buildforattorneys.webp";
import sectionBg from "@/assets/images/attorney/AttorneyBuiltFor-Background.png";
import videoCardBg from "@/assets/images/attorney/AttorneyBuiltFor-card-play-bg.png";
import AttorneyContainer from "./AttorneyContainer";
import AttorneyPlayButton from "./AttorneyPlayButton";

/**
 * Section 5 — "Why Way-Wise Tech Is the Right Technology Partner".
 *
 * Desktop: 682px media column (photo + video card) beside copy and three cards,
 * over a full-bleed background image.
 */

// Figma spec: Rajdhani Bold 48px / 64px, -0.6px letter-spacing.
const headlineTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "-0.6px",
} as const;

// Figma spec: Inter Regular 18px / 28px, zero letter-spacing.
const descriptionTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani SemiBold 26px / 32px, zero letter-spacing.
const cardHeadTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "26px",
  lineHeight: "32px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 18px / 30px, zero letter-spacing.
const cardParagraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Backgrounds alternate light/dark/light by design — the middle card is deliberately
// darker. Carried per-card as data rather than derived from the index so re-ordering or
// adding a card can't silently break the pattern.
const CARD_LIGHT = "#434343";
const CARD_DARK = "#1E1E1E";

const cards = [
  {
    head: "Attorney-Focused Strategy",
    body: "We begin by understanding your practice areas, ideal clients, competitive market, intake process, and growth goals.",
    background: CARD_LIGHT,
  },
  {
    head: "Professional Digital Experience",
    body: "We create clear, trustworthy, and accessible experiences that help visitors understand your services and confidently contact your firm.",
    background: CARD_DARK,
  },
  {
    head: "Scalable Legal Technology",
    body: "From a focused law firm website to a complete client portal or practice-management system, we build technology that can grow with your firm.",
    background: CARD_LIGHT,
  },
];

const AttorneyBuiltFor = () => {
  return (
    <section id="about" className="scroll-mt-24 relative w-full overflow-hidden bg-black">
      <Image
        src={sectionBg}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />
      {/* Deepens the background image's blue glow. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/55" />

      <AttorneyContainer className="relative z-10 py-15 lg:py-[112px]">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[682px_1fr] lg:gap-14">
          {/* Media column */}
          <div className="order-2 flex flex-col gap-4 lg:order-1 lg:mt-3 lg:gap-14">
            <div className="relative aspect-[682/484] w-full overflow-hidden rounded-[20px] border border-white/20">
              <Image
                src={builtForImage}
                alt="Attorneys reviewing case documents together at a conference table"
                fill
                sizes="(min-width: 1024px) 682px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="relative aspect-[682/384] w-full overflow-hidden rounded-2xl border border-white/70">
              <Image
                src={videoCardBg}
                alt="Smarter solutions for law firms with Way-Wise Tech"
                fill
                sizes="(min-width: 1024px) 682px, 100vw"
                className="object-cover"
              />
              {/* <AttorneyPlayButton /> */}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* h2: the page <h1> lives in the banner. */}
            <h2
              className="mb-7 font-bold text-white text-[36px] lg:text-[48px] leading-10 lg:leading-16"
              style={headlineTypography}
            >
              Why Way-Wise Tech Is the Right Technology Partner for Attorneys
              and Law Firms
            </h2>

            <p className="mb-6 text-white" style={descriptionTypography}>
              Legal clients expect professionalism, clarity, security, and
              immediate access to information. We combine legal-industry
              understanding with strategy, design, and development to create
              digital platforms that inspire trust and make it easier for
              potential clients to take action.
            </p>

            <ul className="flex flex-col gap-6">
              {cards.map((card) => (
                <li
                  key={card.head}
                  // Inline style, not a `bg-[...]` class: Tailwind scans source text at
                  // build time, so a class name built from a variable is never generated.
                  style={{ backgroundColor: card.background }}
                  className="rounded-xl px-8 py-9"
                >
                  {/* h3: nested under the section's h2, so the outline stays sequential. */}
                  <h3
                    className="mb-4 font-semibold text-white"
                    style={cardHeadTypography}
                  >
                    {card.head}
                  </h3>
                  <p className="text-[#B8B8B8]" style={cardParagraphTypography}>
                    {card.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyBuiltFor;
