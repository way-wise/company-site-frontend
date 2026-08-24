/**
 * Section 6 — auto-scrolling keyword marquee.
 *
 * Deliberately NOT wrapped in <AttorneyContainer>: the band and its scrolling content
 * bleed edge to edge, so the 1420px content cap does not apply here.
 *
 * Animation reuses the existing global `.auto-scroll` class (globals.css) — the same
 * translateX(0 → -100%) keyframe CategorySection uses — rather than adding a second
 * near-identical keyframe. It pauses on hover, and `motion-reduce:animate-none` stops
 * it outright for visitors who ask for reduced motion.
 */

// Figma spec: Rajdhani SemiBold 54.82px / 45.22px, zero letter-spacing.
const itemTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "0",
} as const;

// Add or reorder freely — the track is duplicated automatically, so the loop stays
// seamless at any length. Note: longer lists scroll faster, since `.auto-scroll` has a
// fixed 35s duration; bump animationDuration below if the list grows a lot.
const items = [
  "Productivity",
  "Integration",
  "Productivity",
  "Automation",
  "Security",
];

const Sparkle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="size-8 shrink-0 text-white"
  >
    {/* Four-pointed sparkle: quadratic curves give the concave sides. */}
    <path d="M12 1 Q13.2 10.8 23 12 Q13.2 13.2 12 23 Q10.8 13.2 1 12 Q10.8 10.8 12 1 Z" />
  </svg>
);

/**
 * One full pass of the keyword list. Rendered twice side by side; both copies slide
 * left by exactly their own width, so copy #2 lands where copy #1 started.
 */
const MarqueeTrack = ({ duplicate = false }: { duplicate?: boolean }) => (
  <ul
    // pr keeps the star-to-word rhythm intact across the seam between the two copies,
    // where the ul's own `gap` cannot reach.
    className="auto-scroll flex shrink-0 items-center gap-7 pr-7 motion-reduce:animate-none"
    // The second copy is purely visual — hidden so screen readers read the list once.
    aria-hidden={duplicate || undefined}
  >
    {items.map((item, index) => (
      <li key={`${item}-${index}`} className="flex items-center gap-7">
        <Sparkle />
        <span
          style={itemTypography}
          className="font-semibold whitespace-nowrap text-white uppercase text-[30px] md:text-[54px] md:leading-8.5"
        >
          {item}
        </span>
      </li>
    ))}
  </ul>
);

const AttorneyMarquee = () => {
  return (
    <section
      // Gradient stops are eyeballed from the Figma export — see note to the user.
      className="w-full overflow-hidden bg-[linear-gradient(90deg,#8B2BBF_0%,#B534E0_22%,#DD5CF2_45%,#D14BEC_58%,#A93BE0_78%,#9A4BE8_90%,#7B2CBF_100%)] pt-6 pb-6  md:pt-12.5 md:pb-10.5"
    >
      <div className="flex">
        <MarqueeTrack />
        <MarqueeTrack duplicate />
      </div>
    </section>
  );
};

export default AttorneyMarquee;
