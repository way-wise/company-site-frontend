import Link from "next/link";
import { Check } from "lucide-react";

/**
 * Packages — three phase cards.
 *
 * Same mechanics and type ramps as the /restaurant pricing section, as requested: each
 * card inverts on hover to a dark ground with light copy, a drop shadow, and a "Get
 * Started" button that expands out of zero height at the bottom. The reveal animates a
 * 0fr -> 1fr grid row rather than max-height, so it eases to the button's real height.
 *
 * The button is also revealed by `focus-within`, so it stays reachable by keyboard — a
 * hover-only control would be unusable without a pointer.
 *
 * Only the palette differs from that page: the lime accent replaces the orange, and this
 * frame has no "clear project scope" note pill under the intro.
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

// Matching the /restaurant pricing card: Bold 16px / 16.5px, 1.1px letter-spacing.
const phaseTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "16.5px",
  letterSpacing: "1.1px",
} as const;

// Matching the /restaurant pricing card: ExtraBold 24px / 36px, -0.48px letter-spacing.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  fontSize: "24px",
  lineHeight: "36px",
  letterSpacing: "-0.48px",
} as const;

// Matching the /restaurant pricing card: ExtraBold 28px / 42px, -0.84px letter-spacing.
const priceTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  fontSize: "28px",
  lineHeight: "42px",
  letterSpacing: "-0.84px",
} as const;

// Matching the /restaurant pricing card: Regular 18px / 22px.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Matching the /restaurant pricing card: Bold 16px / 16.5px, 0.88px letter-spacing,
// uppercase.
const groupTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  lineHeight: "16.5px",
  letterSpacing: "0.88px",
} as const;

// Matching the /restaurant pricing card: Regular 16px / 20.25px.
const featureTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  lineHeight: "20.25px",
  letterSpacing: "0",
} as const;

// Matching the /restaurant pricing card: 16px / 18px.
const bestForTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

// Matching the /restaurant pricing card: Bold 18px / 21px, centered.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "18px",
  lineHeight: "21px",
  letterSpacing: "0",
} as const;

const plans = [
  {
    phase: "PHASE 1",
    title: "Service Business Launch",
    price: "$750 – $1,800",
    body: "Build a professional brand and online presence that helps local customers discover, trust, and contact your business.",
    popular: false,
    groups: [
      {
        title: "Brand & Identity",
        items: [
          "Custom Logo Design",
          "Brand Guidelines",
          "Business Stationery",
          "Branded Marketing Materials",
        ],
      },
      {
        title: "Website Development",
        items: [
          "5-10 Page Website",
          "Individual Service Pages",
          "Service Area Pages",
          "Mobile-Responsive Design",
        ],
      },
      {
        title: "Online Presence",
        items: [
          "Google Maps Integration",
          "Estimate Request Form",
          "Basic SEO Setup",
          "Social Profiles",
        ],
      },
      {
        title: "Hosting & Security",
        items: [
          "Domain & Hosting Setup",
          "Business Email",
          "SSL Security",
          "Analytics Setup",
        ],
      },
    ],
    bestFor:
      " New plumbers, electricians, HVAC teams, mechanics, roofers, and handyman businesses.",
  },
  {
    phase: "PHASE 2",
    title: "Booking & Customer Engagement",
    price: "$1,800 – $3,900",
    body: "Everything in Phase 1, plus digital tools that help you capture leads, book more jobs, and communicate with customers.",
    popular: true,
    groups: [
      {
        title: "Lead & Booking System",
        items: [
          "Online Service Booking",
          "Estimate Request System",
          "Emergency Service Requests",
          "Customer Accounts",
        ],
      },
      {
        title: "Communication System",
        items: [
          "Appointment Confirmations",
          "Email & SMS Notifications",
          "Technician Arrival Alerts",
          "Customer Messaging",
        ],
      },
      {
        title: "Customer Services",
        items: [
          "Online Estimates",
          "Digital Approvals",
          "Invoice Portal",
          "Online Payments",
          "Document & Photo Uploads",
        ],
      },
      {
        title: "Growth Features",
        items: [
          "Customer Retention Campaigns",
          "Reputation Management",
          "Follow-Up Automation",
        ],
      },
    ],
    bestFor:
      " Growing service businesses that want more bookings, faster communication, and better customer experiences.",
  },
  {
    phase: "PHASE 3",
    title: "Smart Service Management",
    price: "$4,000 – $12,900",
    body: "Everything in Phases 1 and 2, plus a connected platform for managing customers, jobs, field teams, payments, and business performance.",
    popular: false,
    groups: [
      {
        title: "Service Management",
        items: [
          "Customer CRM",
          "Job Scheduling",
          "Dispatch Management",
          "Estimate & Invoice Management",
        ],
      },
      {
        title: "Field Team Management",
        items: [
          "Technician Dashboard",
          "Staff Scheduling",
          "GPS & Route Tracking",
          "Role-Based Permissions",
        ],
      },
      {
        title: "Analytics & Reporting",
        items: [
          "Revenue Dashboard",
          "Job Performance Reports",
          "Technician Productivity",
          "Lead Conversion Reports",
        ],
      },
      {
        title: "Mobile, Cloud & Integrations",
        items: [
          "Field Service Mobile App",
          "Customer Mobile App",
          "Secure Cloud Storage",
          "Accounting Integration",
          "Custom Software Integrations",
        ],
      },
    ],
    bestFor:
      " Multi-team and multi-location plumbing, electrical, HVAC, roofing, automotive, and repair businesses.",
  },
];

const PlumberPackages = () => {
  return (
    <section id="packages" className="w-full scroll-mt-[110px] bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on row one, so the rows cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-[#17120F]">Start with What You Need. </span>
            <span className="text-[#B6D500]">Scale</span>
          </span>
          <span className="block text-[#B6D500]">When You&rsquo;re Ready.</span>
        </h2>

        <p
          className="mx-auto mt-5 max-w-[880px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Start with a professional website, add customer-booking tools, or
          build a complete service-management platform tailored to your team,
          workflow, and growth goals.
        </p>

        {/* `items-start` so the hovered card grows downward without stretching its
            neighbours to match. */}
        <ul className="mt-[60px] grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.phase}
              // No `h-full`: with `align-items: start` the grid area is still the full
              // row height, so height:100% would stretch every card to match the tallest
              // one and leave uneven dead space under each "Best For".
              className="group relative flex flex-col rounded-[20px] border border-[#17120F]/9 bg-[#FFFDF8] p-5 transition-all duration-300 hover:bg-[#17120F] hover:shadow-[0_20px_60px_0_rgba(23,18,15,0.25)] focus-within:bg-[#17120F] focus-within:shadow-[0_20px_60px_0_rgba(23,18,15,0.25)] md:p-10"
            >
              {plan.popular && (
                // Dark at rest, lime on hover — the frame only shows the hovered state,
                // so the resting fill is inferred.
                <span className="absolute top-4 right-5 rounded-full bg-[#17120F] px-3 py-1.5 text-[11px] font-bold tracking-[0.5px] text-white uppercase transition-colors duration-300 group-hover:bg-[#B6D500] group-hover:text-[#101311] group-focus-within:bg-[#B6D500] group-focus-within:text-[#101311] md:top-10 md:right-10">
                  Most Popular
                </span>
              )}

              <p
                className="text-[#17120F] transition-colors duration-300 group-hover:text-[#6D625C] group-focus-within:text-[#6D625C]"
                style={phaseTypography}
              >
                {plan.phase}
              </p>

              {/* h3: nested under this section's h2. Uppercased in CSS rather than in
                  the data, so the accessible name keeps its normal casing. */}
              <h3
                className="mt-4 text-[24px] text-[#17120F] uppercase transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                style={cardTitleTypography}
              >
                {plan.title}
              </h3>

              {/* Price keeps the accent in both states. */}
              <p className="mt-1 text-[#B6D500]" style={priceTypography}>
                {plan.price}
              </p>

              <p
                className="mt-3 text-[#6D625C] transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                style={cardBodyTypography}
              >
                {plan.body}
              </p>

              {/* Divider after the paragraph. Inverts on hover, where the 8% dark rule
                  would be invisible against #17120F. */}
              <hr className="my-7 border-[#17120F]/8 transition-colors duration-300 group-hover:border-white/10 group-focus-within:border-white/10" />

              <div className="flex flex-col gap-6">
                {plan.groups.map((group) => (
                  <div key={group.title}>
                    <p
                      className="text-[14px] text-[#17120F] uppercase transition-colors duration-300 group-hover:text-white group-focus-within:text-white md:text-[16px]"
                      style={groupTitleTypography}
                    >
                      {group.title}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-[14px] text-[#26201D] transition-colors duration-300 group-hover:text-white group-focus-within:text-white md:text-[16px]"
                          style={featureTypography}
                        >
                          {/* Check keeps the accent in both states. */}
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-[#B6D500]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Divider before "Best For". */}
              <hr className="my-7 border-[#17120F]/8 transition-colors duration-300 group-hover:border-white/10 group-focus-within:border-white/10" />

              <p
                className="text-[#6D625C] transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                style={bestForTypography}
              >
                <b>Best For:</b>
                {plan.bestFor}
              </p>

              {/*
                Hover-revealed CTA. The outer grid animates 0fr -> 1fr, which eases to the
                button's own height; the inner element must carry `overflow-hidden` for
                the collapsed row to actually clip it.

                No `mt-auto`: the card is content-height, so there is no free space to
                absorb and the button simply follows "Best For".
              */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <Link
                    href="/contact-us"
                    style={buttonTypography}
                    className="mt-7 block rounded-[10px] bg-[#B6D500] py-[14px] text-center text-[#101311] transition-colors duration-200 hover:bg-[#a2bf00]"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PlumberPackages;
