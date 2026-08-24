import AttorneyContainer from "./AttorneyContainer";

/**
 * Section 4 — stats bar.
 *
 * Full-bleed purple gradient band; the three stats are held to the shared 1420px
 * content width and spread across it.
 */

// Figma spec: Rajdhani Bold 64px / 54px, -1.2% letter-spacing (= -0.768px at 64px).
const numberTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "-0.768px",
} as const;

// Figma spec: Rajdhani Bold 24px / 24px, zero letter-spacing.
const headTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "24px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 20px / 24px, zero letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "20px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const stats = [
  {
    value: "10,000+",
    head: "Businesses Formed",
    caption: "Successfully Launched",
  },
  {
    value: "50",
    head: "Nationwide Coverage",
    caption: "Serving Nationwide",
  },
  {
    value: "4.9/5",
    head: "Customer Rating",
    caption: "Trusted Support",
  },
];

const AttorneyStats = () => {
  return (
    <AttorneyContainer
      // Gradient stops are eyeballed from the Figma export — see note to the user.
      className="px-4 bg-[linear-gradient(90deg,#1B0838_0%,#2E0F63_18%,#5B21B6_50%,#7C3AED_72%,#A970FF_88%,#8B5CF6_100%)] py-8 lg:py-10"
    >
      <ul className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-0">
        {stats.map((stat, index) => (
          <li key={stat.head} className="flex items-center">
            <span style={numberTypography} className="font-bold text-white text-[36px] leading-10 md:text-[64px] md:leading-13.5">
              {stat.value}
            </span>

            {/* Short rule between the figure and its label */}
            <div className="ml-6 border-l border-white pl-6">
              <p style={headTypography} className="font-bold text-white">
                {stat.head}
              </p>
              <p style={paragraphTypography} className="mt-2.5 text-white/85">
                {stat.caption}
              </p>
            </div>

            {/* Tall trailing rule separating this stat from the next. Sits inside the
                preceding item so it stays tight to it, as in the design, rather than
                being centred in the gap. */}
            {index < stats.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-10 hidden h-[90px] w-px bg-white xl:block"
              />
            )}
          </li>
        ))}
      </ul>
    </AttorneyContainer>
  );
};

export default AttorneyStats;
