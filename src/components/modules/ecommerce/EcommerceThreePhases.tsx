/**
 * "One Partner. Three Phases. A Smarter Way to Grow." — a three-step process rail.
 *
 * The connecting line is built from two half-rails inside each column rather than one
 * absolutely-positioned line across the row: each column paints a hairline from its own
 * edge to its circle, so the halves of adjacent columns meet exactly on the column
 * boundary and read as one continuous line. That needs the row to be gapless at md and
 * up — the paragraph width is capped instead of using a grid gap, which is also what
 * keeps the copy measure narrow in the frame.
 *
 * The outermost halves (left of step 01, right of step 03) are `invisible` rather than
 * absent, so all three columns keep identical widths and the circles stay centred.
 */

// Figma spec: Outfit SemiBold 48px / 50px, zero letter-spacing, centered, #1E130A.
// Only the desktop size is specced; the step below it is mine.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Outfit SemiBold 20px / 24px, zero letter-spacing, centered, #1E130A.
const stepTitleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 22.75px, zero letter-spacing, centered, #5F6B7A.
const stepBodyTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "22.75px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit SemiBold 24px / 30px, zero letter-spacing, centered. No colour was
// given; the frame renders the numerals white on the accent disc.
const numberTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

const steps = [
  {
    number: "01",
    title: "Understand Your Business",
    body: "We learn about your products, customers, sales channels, and operational goals.",
  },
  {
    number: "02",
    title: "Build the Right Solution",
    body: "We design and develop the website, store, systems, or integrations your business needs.",
  },
  {
    number: "03",
    title: "Launch, Support & Scale",
    body: "We test, launch, support your team, and help you grow into the next phase.",
  },
];

const EcommerceThreePhases = () => {
  return (
    <section id="process" className="scroll-mt-[110px] bg-[#F7FAFC] px-4">
      {/* 1420px, matching the navbar. */}
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">
        {/* 700px is what reproduces the frame's two-line break without hard-coding it:
            "…Three Phases. A" fits, adding "Smarter" does not. Left to wrap so narrower
            viewports break sensibly instead of overflowing. */}
        <h2
          style={titleTypography}
          className="mx-auto max-w-[700px] text-center text-[30px] leading-10 text-[#1E130A] md:text-[48px] md:leading-12.5"
        >
          One Partner. Three Phases. A Smarter Way to Grow.
        </h2>

        {/* <ol> because the steps are sequential; the visible "01/02/03" is the frame's
            styling of that order, not a substitute for it. */}
        <ol className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          {steps.map(({ number, title, body }, index) => (
            <li key={number} className="text-center">
              <div className="flex items-center justify-center">
                <span
                  className={`hidden h-px flex-1 bg-[#DDE6F2] md:block ${
                    index === 0 ? "invisible" : ""
                  }`}
                  aria-hidden="true"
                />
                <span
                  style={numberTypography}
                  className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#A07B62] text-white"
                >
                  {number}
                </span>
                <span
                  className={`hidden h-px flex-1 bg-[#DDE6F2] md:block ${
                    index === steps.length - 1 ? "invisible" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* h3: nested under this section's h2. */}
              <h3 style={stepTitleTypography} className="mt-8 text-[#1E130A]">
                {title}
              </h3>
              <p
                style={stepBodyTypography}
                className="mx-auto mt-4 max-w-[320px] text-[#5F6B7A]"
              >
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default EcommerceThreePhases;
