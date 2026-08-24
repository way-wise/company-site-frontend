import Link from "next/link";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";

/**
 * Section 10 — "A Clear Path from Legal Strategy to Launch".
 *
 * Two columns: the left holds the section header and CTA, the right a stack of six
 * step cards. Each card is split — a black rail carrying the step number, and a
 * #363636 panel carrying the copy.
 */

// The eyebrow and heading type now live in <AttorneySectionHeading align="left">.

// Figma spec: Inter Medium 18px / 18px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani Bold 32px / 100%, zero letter-spacing.
const cardHeadTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "32px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 16px / 28px, zero letter-spacing, #B8B8B8.
const cardParagraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "We learn about your firm, practice areas, ideal clients, competitors, current workflow, and project goals.",
  },
  {
    number: "02",
    title: "Define",
    body: "We scope the product, create a roadmap, and align on success metrics.",
  },
  {
    number: "03",
    title: "Design",
    body: "We build wireframes and high-fidelity prototypes for review.",
  },
  {
    number: "04",
    title: "Develop",
    body: "Our engineers build the product using modern, scalable technology.",
  },
  {
    number: "05",
    title: "Test",
    body: "We run QA, performance testing, and user acceptance testing.",
  },
  {
    number: "06",
    title: "Launch & Support",
    body: "We deploy, monitor, and support your product long-term.",
  },
];

/** Double chevron at the top of each card's number rail. */
const DoubleChevron = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-5 text-[#00A3FF]"
  >
    <path d="M5 7l7 6 7-6" />
    <path d="M5 13l7 6 7-6" />
  </svg>
);

/**
 * Blue shield tab hanging at the card's top-right. Drawn as SVG rather than CSS
 * because the silhouette is a rounded top with a curved shield foot — not something
 * border-radius alone produces cleanly.
 */

const AttorneyProcess = () => {
  return (
    <section id="process" className="bg-black">
      <AttorneyContainer className="py-28">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: header + CTA. Sticks while the tall step list scrolls past. */}
          <div className="lg:sticky lg:top-16">
            <AttorneySectionHeading
              align="left"
              eyebrow="Our Process"
              heading="A Clear Path from Legal Strategy to Launch"
            />

            <Link
              href="/contact-us"
              style={buttonTypography}
              className="mt-12 inline-flex items-center gap-3 rounded-lg bg-[#00A3FF] px-7 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#0091e6]"
            >
              Get In Touch
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>

          {/* Right: the six steps */}
          <ol className="flex flex-col gap-7">
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative flex overflow-hidden rounded-2xl bg-[#151516] border border-[#363636]"
              >
                {/* Number rail — black per spec, against the #363636 panel */}
                <div className="flex w-20 shrink-0 flex-col items-center bg-black border-r border-[#363636] px-4 py-7">
                  <DoubleChevron />
                  <span
                    style={cardHeadTypography}
                    className="mt-12 font-bold text-white"
                  >
                    {step.number}
                  </span>
                  <span
                    style={cardParagraphTypography}
                    className="text-[#B8B8B8]"
                  >
                    Step
                  </span>
                </div>

                {/* Copy panel. `pr` clears the shield tab so long titles can't run
                    underneath it. */}
                <div className="relative flex-1 px-8 py-7 md:pr-28">
                  <div className="w-16 h-16 bg-[#00A3FF] rounded-b-4xl top-0 right-4 md:right-16 absolute">
                    <svg width="32" height="32" className="relative top-1/2 left-1/2 -translate-1/2" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 12L15.076 12.9853C14.5601 13.0887 14.0864 13.3424 13.7144 13.7144C13.3424 14.0864 13.0887 14.5601 12.9853 15.076L12 20L16.924 19.016C17.44 18.9125 17.9139 18.6587 18.2859 18.2864C18.658 17.9141 18.9115 17.4401 19.0147 16.924L20 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {/* h3: nested under this section's h2. */}
                  <h3
                    style={cardHeadTypography}
                    className="font-bold text-white"
                  >
                    {step.title}
                  </h3>
                  <p
                    style={cardParagraphTypography}
                    className="mt-6 text-[#B8B8B8]"
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyProcess;
