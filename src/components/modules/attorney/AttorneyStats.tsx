import Image from "next/image";
import frameImage from "@/assets/images/attorney/AttorneyStats-frame-iamge.png";
import AttorneyContainer from "./AttorneyContainer";

/**
 * Section 4 — stats bar.
 *
 * Full-bleed frame-image band (159px tall on desktop, 1px top/bottom borders); the three stats are held to the shared 1420px
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
    value: "125+",
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
    <section className="relative w-full overflow-hidden py-8 lg:h-[159px] lg:py-0">
      <Image
        src={frameImage}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />
    <AttorneyContainer className="relative z-10 lg:h-full" innerClassName="lg:h-full">
      <ul className="mx-auto flex w-fit flex-col items-start gap-8 pl-6 md:w-full md:pl-0 md:items-center md:gap-10 lg:h-full lg:flex-row lg:justify-between lg:gap-0">
        {stats.map((stat, index) => (
          <li key={stat.head} className="flex items-center">
            <span style={numberTypography} className="w-[110px] shrink-0 font-bold text-white text-[36px] leading-10 md:w-auto md:text-[64px] md:leading-13.5">
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
    </section>
  );
};

export default AttorneyStats;
