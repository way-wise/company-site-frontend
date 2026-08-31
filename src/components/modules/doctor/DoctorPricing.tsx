import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Pricing — three phase cards.
 *
 * NOTE ON LEADING: the spec gives `line-height: 100%` for every type ramp here. That is
 * applied as-is to the single-line items (card headings, price, feature rows, button).
 * The multi-line blocks — section title, section paragraph, card description — get real
 * leading instead, because at 100% their wrapped lines collide. The design's own artwork
 * shows roughly 117-122% on exactly those blocks.
 */

// Figma spec: Urbanist Bold 52px, zero letter-spacing, centered, #011139.
// Only the desktop size is specced; the responsive steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 18px, zero letter-spacing, centered, #4B5563.
const introTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 34.43px / 100%, centered, #011139.
const phaseTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "34.43px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 23.67px / 100%, centered, #011139.
const subTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 17px, centered, #011139.
const descriptionTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "17px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist ExtraBold 48px / 100%, centered, #3191EA.
const priceTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 800,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 25.82px / 100%, #011139.
const featuresTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "25.82px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 19.36px / 100%, #011139.
const featureTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 17.21px / 100%, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "17.21px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

/**
 * Hand-rolled rather than lucide's CircleCheck: the design's mark is a SOLID blue disc
 * with a white tick, and lucide's is an outline whose circle and tick share one path
 * set — there is no way to fill the disc without also filling the tick.
 */
const CheckMark = () => (
  <svg
    viewBox="0 0 20 20"
    className="mt-0.5 size-5 shrink-0"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="10" fill="#3191EA" />
    <path
      d="m5.8 10.3 2.6 2.6 5.8-5.8"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const plans = [
  {
    phase: "Phase 1",
    name: "Practice Launch",
    description:
      "Establish a credible, professional online presence that attracts potential clients.",
    price: "$750 - $1800",
    features: [
      "Brand Identity",
      "Website Design & Development",
      "Mobile Responsive Design",
      "Business Profile",
      "SEO",
      "Hosting & Security",
    ],
  },
  {
    phase: "Phase 2",
    name: "Patient Engagement",
    description: "Establish a credible, professional online presence.",
    price: "$1800 - $3900",
    features: [
      "Everything in Phase 1",
      "Patient Portal",
      "Medical Database",
      "Treatment Tracking",
      "Reminders & Alerts",
      "Email/SMS Notification",
      "Online Payments",
      "Review Management",
    ],
  },
  {
    phase: "Phase 3",
    name: "Smart Practice Management",
    description:
      "Build a connected digital platform for modern practice operations.",
    price: "$4000 - $12900",
    features: [
      "Everything in Phase 1 &2",
      "Patient CRM",
      "Medical Database",
      "Treatment Tracking",
      "Revenue Reports",
      "Staff Tools",
      "Mobile App",
      "AI Reporting",
      "HIPAA Ready Infrastructure",
    ],
  },
];

const DoctorPricing = () => {
  return (
    <section id="packages" className="w-full scroll-mt-[130px] bg-[#F5F7FC] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.15] text-[#011139] sm:text-[40px] lg:text-[52px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Choose the Right Solution</span>
          <span className="block">for Your Practice</span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-[620px] text-center leading-[1.4] text-[#4B5563]"
          style={introTypography}
        >
          Start with a strong digital foundation, then scale into patient
          engagement and smarter practice management as your needs grow.
        </p>

        {/* Flush on desktop, per the Figma frame: the cards butt against each other and
            the seam is the two 50px corner radii meeting, with the section background
            showing through the notches. The gap only exists while they are stacked. */}
        <ul className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 md:grid-cols-3 md:gap-0">
          {plans.map((plan) => (
            <li
              key={plan.phase}
              // `h-full` + column flex so every card matches the tallest in the row and
              // the CTA can be pushed to the bottom edge regardless of feature count —
              // Phase 1 has six rows, Phase 3 has nine.
              className="flex h-full flex-col rounded-[50px] border border-[#E0ECF6] bg-white px-8 pt-12 pb-10 md:px-4 lg:px-10"
            >
              {/* h3: nested under this section's h2. */}
              <h3 className="text-center text-[#011139]" style={phaseTypography}>
                {plan.phase}
              </h3>

              <p
                className="mt-5 text-center text-[22px] lg:text-[24px] text-[#011139]"
                style={subTitleTypography}
              >
                {plan.name}
              </p>

              <p
                className="mt-4 xl:px-9 text-center leading-[1.4] text-[#011139]"
                style={descriptionTypography}
              >
                {plan.description}
              </p>

              <p
                className="mt-8 text-center text-[30px] md:text-[24px] lg:text-[32px] xl:text-[48px] text-[#3191EA]"
                style={priceTypography}
              >
                {plan.price}
              </p>

              <p className="mt-10 text-[#011139]" style={featuresTitleTypography}>
                Features:
              </p>

              <ul className="mt-5 flex flex-col gap-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start md:items-center gap-2.5">
                    <CheckMark />
                    <span className="text-[#011139] text-[16px] md:text-[14px] lg:text-[18px] xl:text-[19.36px]" style={featureTypography}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* `mt-auto` eats the leftover space, pinning the CTA to the card's
                  bottom so all three line up across the row. */}
              <div className="mt-auto pt-12 text-center">
                <Link
                  href="/contact-us"
                  style={buttonTypography}
                  className="inline-flex items-center gap-5 rounded-[64px] border border-[#011139] px-8 md:px-4 lg:px-8  py-4 md:py-3 lg:py-4 whitespace-nowrap text-[#011139] transition-colors duration-200 hover:bg-[#011139] hover:text-white"
                >
                  Build My Platform
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DoctorPricing;
