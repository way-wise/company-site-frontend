/**
 * "One Partner. Three Phases. A Smarter Way to Grow." — a three-step process row.
 *
 * The connectors are drawn per step rather than as separate grid cells: each cell is
 * `relative`, and the dashed rule spans from its own tile's right edge
 * (`calc(50% + 34px)`, half the 68px tile) across to the next tile's left edge
 * (`calc(-50% + 34px)`). That keeps every label centred under its own tile, which a
 * tile/connector/tile flex row would not.
 *
 * Connectors are desktop-only: stacked on mobile there is no horizontal run to join.
 */

// Same ramp as the other sections on this page: Plus Jakarta Sans ExtraBold 48px / 60px,
// -1.2px letter-spacing, centered. Only the desktop size is specced.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the other sections: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans ExtraBold 18px / 28px, centered, #252E28.
const numberTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 20px / 16px, 0.3px letter-spacing, uppercase,
// centered, #101311.
const stepTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "26px",
  letterSpacing: "0.3px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 16px, centered, #101311.
const stepSubtitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const steps = [
  {
    number: "01",
    title: "Company Launch",
    subtitle: "Foundation & Presence",
    /** Only the first tile carries the accent fill. */
    accent: true,
  },
  {
    number: "02",
    title: "Client & Team Collaboration",
    subtitle: "Foundation & Presence",
    accent: false,
  },
  {
    number: "03",
    title: "Smart Operations",
    subtitle: "Scale & Control",
    accent: false,
  },
];

const PlumberWayToGrow = () => {
  return (
    <section
      id="solutions"
      className="w-full scroll-mt-[110px] bg-[#F7F8F3] px-4"
    >
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on row one, so the rows cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-[#101311]">One Partner. Three Phases. </span>
            <span className="text-[#B6D500]">A Smarter</span>
          </span>
          <span className="block text-[#B6D500]">Way to Grow.</span>
        </h2>

        <p
          className="mx-auto mt-5 max-w-[900px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Start with the essentials, improve daily operations, and add advanced
          management tools when your business is ready. Choose the services that
          fit your current stage and future goals.
        </p>

        <ol className="mx-auto mt-[60px] grid max-w-[1100px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6">
          {steps.map(({ number, title, subtitle, accent }, index) => (
            <li key={number} className="relative flex flex-col items-center">
              {/* Connector to the next step. Not rendered after the last one. */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[34px] right-[calc(-55%+34px)] left-[calc(50%+34px)] hidden sm:block"
                >
                  <span className="block border-t border-dashed border-[#252E28]" />
                  {/* Arrowhead, centred on the rule's own baseline. */}
                  <svg
                    viewBox="0 0 8 8"
                    className="absolute -top-[3.5px] right-0 size-2 text-[#252E28]"
                    fill="currentColor"
                  >
                    <path d="M0 0l8 4-8 4z" />
                  </svg>
                </span>
              )}

              {/* 68px tile with a 48px white disc inside, per spec. */}
              <span
                className={`flex size-[68px] shrink-0 items-center justify-center rounded-[16px] ${
                  accent ? "bg-[#B6D500]" : "bg-[#252E28]"
                }`}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white">
                  <span className="text-[#252E28]" style={numberTypography}>
                    {number}
                  </span>
                </span>
              </span>

              {/* h3: nested under this section's h2. Uppercased in CSS rather than in
                  the data, so the accessible name keeps its normal casing. */}
              <h3
                className="mt-[30px] text-center text-[#101311] uppercase"
                style={stepTitleTypography}
              >
                {title}
              </h3>
              <p
                className="mt-4 text-center text-[#101311]"
                style={stepSubtitleTypography}
              >
                {subtitle}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default PlumberWayToGrow;
