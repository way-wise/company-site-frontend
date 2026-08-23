import Image from "next/image";
import builtForImage from "@/assets/images/attorney/buildforattorneys.webp";
import AttorneyContainer from "./AttorneyContainer";

/**
 * Section 5 — "Built for Attorneys, Law Firms, and Legal Service Providers".
 *
 * Two equal columns on desktop: photo left, copy + three cards right.
 */

// Figma spec: Rajdhani Bold 48px / 64px, -0.6px letter-spacing.
const headlineTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "48px",
  lineHeight: "64px",
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
    <AttorneyContainer className="bg-black py-[112px]">
      <div className="grid grid-cols-1 items-center gap-13 lg:grid-cols-2">
        {/* Photo. The asset's corners are already rounded with alpha, so no CSS
            radius here — adding one would clip it twice. */}
        <Image
          src={builtForImage}
          alt="Attorneys reviewing case documents together at a conference table"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full"
        />

        <div>
          {/* h2: the page <h1> lives in the banner. */}
          <h2
            className="mb-7 font-bold text-white"
            style={headlineTypography}
          >
            Built for Attorneys, Law Firms, and Legal Service Providers
          </h2>

          <p
            className="mb-6 text-[#B8B8B8]"
            style={descriptionTypography}
          >
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
                <p
                  className="text-[#B8B8B8]"
                  style={cardParagraphTypography}
                >
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AttorneyContainer>
  );
};

export default AttorneyBuiltFor;
