/**
 * Process — four numbered steps.
 *
 * Manrope and Poppins are loaded by the route layout for this section and
 * DoctorSimple; the section heading stays on the page's Urbanist ramp.
 */

// Section title — same ramp as the other sections: Urbanist Bold 52px, zero
// letter-spacing. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Manrope ExtraBold 24px / 30px, -0.96px letter-spacing, #3191EA.
const stepNumberTypography = {
  fontFamily: "var(--font-manrope), sans-serif",
  fontWeight: 800,
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "-0.96px",
} as const;

// Figma spec: Manrope Medium 24px / 30px, -0.96px letter-spacing, #0C2F25.
const cardTitleTypography = {
  fontFamily: "var(--font-manrope), sans-serif",
  fontWeight: 500,
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "-0.96px",
} as const;

// Figma spec: Poppins Regular 16px / 24px, zero letter-spacing, #6E837D.
const cardBodyTypography = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const steps = [
  {
    number: "01",
    title: "Discover Your Practice",
    body: "We learn your goals, patients, and existing workflow.",
  },
  {
    number: "02",
    title: "Plan the Right Solution",
    body: "A tailored roadmap scoped to your phase and budget.",
  },
  {
    number: "03",
    title: "Design & Develop",
    body: "Your brand and platform built with clinical precision.",
  },
  {
    number: "04",
    title: "Launch, Support & Grow",
    body: "Go live with ongoing care and continuous improvement.",
  },
];

const DoctorProcess = () => {
  return (
    <section className="w-full bg-[#F5F7FC] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.15] sm:text-[40px] lg:text-[52px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on both rows, so they cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-[#011139]">From first consultation to </span>
            <span className="text-[#3191EA]">launch-clear,</span>
          </span>
          <span className="block">
            <span className="text-[#3191EA]">
              collaborative, and built around{" "}
            </span>
            <span className="text-[#011139]">your practice.</span>
          </span>
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              // "card inner gap 40px" read as the card's padding, matching the cards in
              // DoctorSimple.
              className="rounded-[30px] border border-[#E6EAE9] bg-white p-10"
            >
              {/* Tile hugs the digits rather than being a fixed square — the Figma mark
                  is wider than it is tall. */}
              <span
                className="inline-block rounded-[8px] bg-[#E9F4FD] px-3 py-1.5 text-[#3191EA]"
                style={stepNumberTypography}
              >
                {step.number}
              </span>

              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-8 text-[#0C2F25]"
                style={cardTitleTypography}
              >
                {step.title}
              </h3>
              <p className="mt-4 text-[#6E837D]" style={cardBodyTypography}>
                {step.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DoctorProcess;
