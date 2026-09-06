import Image from "next/image";
import type { StaticImageData } from "next/image";
import icon1 from "@/assets/images/plumber/1.webp";
import icon2 from "@/assets/images/plumber/2.webp";
import icon3 from "@/assets/images/plumber/3.webp";
import icon4 from "@/assets/images/plumber/4.webp";

/**
 * "Your Crew Works in the Field. Your Business Should Work Everywhere." — four benefit
 * cards.
 *
 * Icons are the supplied 48x48 assets, static imports from `src/assets/`, so next/image
 * reads their intrinsic size and no width/height is declared by hand. They are dark
 * marks on transparent ground, which is what lets them sit on the lime tile.
 */

// Same ramp as the services section, as requested: Plus Jakarta Sans ExtraBold
// 48px / 60px, -1.2px letter-spacing, centered. Only the desktop size is specced; the
// steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the services section: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 24px / 32px, 0.3px letter-spacing, uppercase,
// #101311.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "32px",
  letterSpacing: "0.3px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 26px, zero letter-spacing, #101311.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const cards: { icon: StaticImageData; title: string; body: string }[] = [
  {
    icon: icon1,
    title: "Capture More Leads",
    body: "Turn website visits, calls, and inquiries into booked jobs.",
  },
  {
    icon: icon2,
    title: "Manage Jobs More Clearly",
    body: "Organize customers, estimates, tasks, files, and project updates.",
  },
  {
    icon: icon3,
    title: "Improve Client Experience",
    body: "Simplify client service requests, updates, and approvals.",
  },
  {
    icon: icon4,
    title: "Give Your Team Better Visibility",
    body: "Keep office staff and field teams connected on any device.",
  },
];

const PlumberWhyChoose = () => {
  return (
    <section id="why-us" className="w-full scroll-mt-[110px] bg-[#ECEEE2] px-4">
      {/* 1420px, matching the navbar and banner — wider than the 1320 the services
          section uses, per this frame. */}
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#17120F] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Your Crew Works in the Field. Your</span>
          <span className="block">Business Should Work Everywhere.</span>
        </h2>

        {/* 20px title -> paragraph, 60px paragraph -> cards, matching the services
            section's rhythm. */}
        <p
          className="mx-auto mt-5 max-w-[900px] text-center text-[#17120F]"
          style={introTypography}
        >
          Growing service businesses often lose time to missed calls, manual
          follow-ups, scattered job information, and outdated systems. Way Wise
          brings your customer journey, team communication, projects, and growth
          tools into one connected digital ecosystem.
        </p>

        <ul className="mt-[60px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon, title, body }) => (
            <li key={title} className="rounded-[16px] bg-white p-8">
              <span
                className="flex size-[88px] items-center justify-center rounded-[16px] bg-[#B6D500]"
                aria-hidden="true"
              >
                {/* Supplied at 48x48 and rendered at that size. Decorative: the card
                    heading already names the benefit. */}
                <Image src={icon} alt="" className="size-12" />
              </span>

              {/* h3: nested under this section's h2. Uppercased in CSS rather than in
                  the data, so the accessible name keeps its normal casing. */}
              <h3
                className="mt-9 text-[#101311] uppercase"
                style={cardTitleTypography}
              >
                {title}
              </h3>
              <p className="mt-5 text-[#101311]" style={cardBodyTypography}>
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PlumberWhyChoose;
