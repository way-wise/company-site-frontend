import Image from "next/image";
import builtForImage from "@/assets/images/doctor/built-for.webp";
import DoctorContainer from "./DoctorContainer";

/**
 * Section 5 — "Built for Attorneys, Law Firms, and Legal Service Providers".
 *
 * Two equal columns on desktop: photo left, copy + three cards right.
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
    head: "Patient Portal",
    body: "Empower patients with secure access to records, appointments, and messaging.",
    background: CARD_LIGHT,
  },
  {
    head: "Smart Scheduling",
    body: "Reduce no-shows and save time with intelligent appointment scheduling.",
    background: CARD_DARK,
  },
  {
    head: "Telehealth Platform",
    body: "Deliver seamless virtual care with HD video, e-prescriptions, and integrated workflows.",
    background: CARD_LIGHT,
  },
];

const DoctorBuiltFor = () => {
  return (
    <DoctorContainer className="bg-black py-15 lg:py-[112px]">
      <div className="grid grid-cols-1 items-center gap-13 lg:grid-cols-2">
        {/* Photo. The asset's corners are already rounded with alpha, so no CSS
            radius here — adding one would clip it twice. */}
        <Image
          src={builtForImage}
          alt="Attorneys reviewing case documents together at a conference table"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full order-2 lg:order-1"
        />

        <div className="order-1 lg:order-2">
          {/* h2: the page <h1> lives in the banner. */}
          <h2
            className="mb-7 font-bold text-white text-[36px] lg:text-[48px] leading-10 lg:leading-16"
            style={headlineTypography}
          >
            Solutions Built for Doctors, Clinics, and Healthcare Providers
          </h2>

          <p
            className="mb-6 text-[#B8B8B8]"
            style={descriptionTypography}
          >
            From patient engagement to practice management, our solutions streamline operations and elevate care.
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
    </DoctorContainer>
  );
};

export default DoctorBuiltFor;
