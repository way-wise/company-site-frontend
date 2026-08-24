import { cn } from "@/lib/utils";

/**
 * Shared section header: blue eyebrow, display heading, optional paragraph.
 *
 * Two alignments, because the page uses both:
 *   "center" — rules on BOTH sides of the eyebrow  (Selected Legal Work, Why Way Wise
 *              Tech, Built for Every Stage)
 *   "left"   — a single LEADING rule               (Our Process, Insights)
 *
 * The heading metrics genuinely differ between the two, per the supplied specs — the
 * centred sections are 52.8px leading with -0.8px tracking, the left-aligned ones are
 * 70px leading with none. That is why the type lives here keyed by alignment rather
 * than as one shared constant.
 */

// Figma spec: Inter Bold 11px / 16.5px, 1.2px letter-spacing, uppercase, #00A3FF.
const eyebrowTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "11px",
  lineHeight: "16.5px",
  letterSpacing: "1.2px",
} as const;

// Figma spec (centred sections): Rajdhani Bold 60px / 52.8px, -0.8px letter-spacing.
const centeredHeadingTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "-0.8px",
} as const;

// Figma spec (left-aligned sections): Rajdhani Bold 60px / 70px, zero letter-spacing.
const leftHeadingTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 16px / 27.2px, zero letter-spacing, #B8B8B8.
const descriptionTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "27.2px",
  letterSpacing: "0",
} as const;

const AttorneySectionHeading = ({
  eyebrow,
  heading,
  description,
  align = "center",
  headingClassName,
  descriptionClassName,
}: {
  eyebrow: string;
  heading: string;
  /** Omit entirely for sections that run heading-only, e.g. the pricing phases. */
  description?: string;
  align?: "center" | "left";
  /** Constrain the heading's wrap width. */
  headingClassName?: string;
  /** Constrain the paragraph's wrap width — it differs per section. */
  descriptionClassName?: string;
}) => {
  const isCentered = align === "center";

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3",
          isCentered ? "justify-center" : "justify-start",
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-[#00A3FF]" />
        <span
          style={eyebrowTypography}
          className="font-bold text-[#00A3FF] uppercase"
        >
          {eyebrow}
        </span>
        {/* Trailing rule only in the centred variant. */}
        {isCentered && (
          <span aria-hidden="true" className="h-px w-6 bg-[#00A3FF]" />
        )}
      </div>

      {/* h2: the page <h1> lives in the banner. */}
      <h2
        className={cn(
          "font-bold text-white",
          isCentered ? "mx-auto mt-5 max-w-3xl text-center" : "mt-6 text-left",
          headingClassName,
        )}
        style={isCentered ? centeredHeadingTypography : leftHeadingTypography}
      >
        {heading}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 text-[#B8B8B8]",
            isCentered ? "mx-auto text-center" : "text-left",
            descriptionClassName,
          )}
          style={descriptionTypography}
        >
          {description}
        </p>
      )}
    </>
  );
};

export default AttorneySectionHeading;
