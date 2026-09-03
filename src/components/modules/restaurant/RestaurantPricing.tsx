import Link from "next/link";
import { Check } from "lucide-react";

/**
 * Pricing — three phase cards.
 *
 * Each card inverts on hover: dark ground, light copy, a drop shadow, and a "Get
 * Started" button that expands out of zero height at the bottom. The reveal is animated
 * with a 0fr -> 1fr grid row rather than max-height, so it eases to the button's real
 * height instead of an arbitrary guess.
 *
 * The button is also revealed by `focus-within`, so it stays reachable by keyboard —
 * a hover-only control would be unusable without a pointer.
 */

// Same ramp as the previous two sections: Plus Jakarta Sans ExtraBold 48px / 60px,
// centered, #0F1A1A. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Same ramp as the previous two sections: Plus Jakarta Sans Regular 18px / 26.4px.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.4px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 19.5px, zero letter-spacing, #E94222.
const noteTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 16px / 16.5px, 1.1px letter-spacing, #6D625C.
const phaseTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "16.5px",
  letterSpacing: "1.1px",
} as const;

// Figma spec: Plus Jakarta Sans ExtraBold 24px / 36px, -0.48px letter-spacing, #17120F.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  lineHeight: "36px",
  letterSpacing: "-0.48px",
} as const;

// Figma spec: Plus Jakarta Sans ExtraBold 28px / 42px, -0.84px letter-spacing, #E94222.
const priceTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  fontSize: "28px",
  lineHeight: "42px",
  letterSpacing: "-0.84px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 22px, zero letter-spacing.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 16px / 16.5px, 0.88px letter-spacing, uppercase,
// #6D625C.
const groupTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  lineHeight: "16.5px",
  letterSpacing: "0.88px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 16px / 20.25px, zero letter-spacing, #26201D.
const featureTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  lineHeight: "20.25px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 16px / 18px, zero letter-spacing, #6D625C.
const bestForTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 18px / 21px, zero letter-spacing, centered, white.
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
    title: "Restaurant Launch",
    price: "$750 – $1,800",
    body: "Build a strong restaurant brand and a professional digital presence that makes it easy for customers to discover, trust, and contact you.",
    popular: false,
    groups: [
      {
        title: "Brand & Identity",
        items: [
          "Custom Logo Design",
          "Brand Guidelines",
          "Menu Design",
          "Branded Marketing Materials",
        ],
      },
      {
        title: "Website Development",
        items: [
          "5-10 Page Website",
          "Digital Menu Pages",
          "Location & Contact Pages",
          "Mobile-Responsive Design",
        ],
      },
      {
        title: "Online Presence",
        items: [
          "Google Maps Integration",
          "Reservation Forms",
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
      "New restaurants, cafés, bakeries, food trucks, and catering businesses.",
  },
  {
    phase: "PHASE 2",
    title: "Customer Ordering & Engagement",
    price: "$1,800 – $3,900",
    body: "Everything in Phase 1, plus the customer tools that help guests order easily, stay connected, and come back more often.",
    popular: true,
    groups: [
      {
        title: "Ordering & Guest Experience",
        items: [
          "Online Ordering",
          "Table Reservations",
          "AI Assistant",
          "Customer Accounts",
        ],
      },
      {
        title: "Communication System",
        items: [
          "Order Notifications",
          "Email & SMS Alerts",
          "Customer Messaging",
          "Review Requests",
        ],
      },
      {
        title: "Customer Services",
        items: [
          "Online Payments",
          "Digital Menus",
          "Coupon System",
          "Pickup Scheduling",
          "Loyalty Signup",
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
      "Busy restaurants, takeaway businesses, cafés, cloud kitchens, and growing food brands.",
  },
  {
    phase: "PHASE 3",
    title: "Smart Restaurant Management",
    price: "$4,000 – $12,900",
    body: "Everything in Phases 1 and 2, plus a connected restaurant management platform designed around your operations.",
    popular: false,
    groups: [
      {
        title: "Restaurant Management",
        items: [
          "Customer CRM",
          "Order Management",
          "Reservation Dashboard",
          "Delivery Management",
        ],
      },
      {
        title: "Analytics & Reporting",
        items: [
          "Sales Reports",
          "Revenue Dashboard",
          "Customer Analytics",
          "Performance Reports",
        ],
      },
      {
        title: "Team & Multi-Location",
        items: [
          "Staff Management",
          "Branch Management",
          "Role-Based Permissions",
          "Menu Management",
        ],
      },
      {
        title: "Mobile, Cloud & Integrations",
        items: [
          "Mobile Applications",
          "Tablet Ordering",
          "Push Notifications",
          "Secure Cloud Storage",
          "POS Integrations",
        ],
      },
    ],
    bestFor:
      "Multi-location restaurants, franchises, catering operations, and growing food brands.",
  },
];

const RestaurantPricing = () => {
  return (
    <section className="w-full bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0F1A1A] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Start with What You Need. Scale</span>
          <span className="block">When You&rsquo;re Ready.</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[860px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Choose a focused launch package, add customer-engagement tools, or
          build a complete management platform. Every solution is tailored to
          your business goals, workflow, and growth stage.
        </p>

        {/* `bg-[#F36F38]/8` is the 14 alpha suffix expressed as a Tailwind opacity
            modifier — same colour, fewer magic hex digits. */}
        <p
          className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-[100px] bg-[#F36F38]/8 px-5 py-2.5 text-center text-[#E94222]"
          style={noteTypography}
        >
          <span aria-hidden="true" className="hidden md:block">&bull;</span>
          Clear project scope. Transparent pricing. No hidden project fees.
        </p>

        {/* `items-start` so the hovered card grows downward without stretching its
            neighbours to match. */}
        <ul className="mt-[60px] grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.phase}
              // No `h-full`: with `align-items: start` the grid area is still the full
              // row height, so height:100% would stretch every card to match the tallest
              // one. That left a different amount of dead space under each card's "Best
              // For" line, and made the others grow whenever one card expanded on hover.
              // Content height keeps the bottom padding identical on all three.
              className="group relative flex flex-col rounded-[20px] border border-[#17120F]/9 bg-[#FFFAF6] p-5 md:p-10 transition-all duration-300 hover:bg-[#17120F] hover:shadow-[0_20px_60px_0_rgba(23,18,15,0.25)] focus-within:bg-[#17120F] focus-within:shadow-[0_20px_60px_0_rgba(23,18,15,0.25)]"
            >
              {plan.popular && (
                <span className="absolute top-4 md:top-10 right-5 md:right-10 rounded-full bg-[#E94222] px-3 py-1.5 text-[11px] font-bold tracking-[0.5px] text-white uppercase">
                  Most Popular
                </span>
              )}

              {/* Subtitle keeps #6D625C in both states, per the spec. */}
              <p className="text-[#6D625C]" style={phaseTypography}>
                {plan.phase}
              </p>

              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-4 xl:max-w-[calc(100%-120px)] text-[#17120F] transition-colors duration-300 group-hover:text-[#FFF8F2] group-focus-within:text-[#FFF8F2] text-[24px]"
                style={cardTitleTypography}
              >
                {plan.title}
              </h3>

              <p className="mt-1 text-[#E94222]" style={priceTypography}>
                {plan.price}
              </p>

              <p
                className="mt-3 text-[#6D625C] transition-colors duration-300 group-hover:text-[#FFE0D1] group-focus-within:text-[#FFE0D1]"
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
                      className="text-[#6D625C] uppercase transition-colors text-[14px] md:text-[16px] duration-300 group-hover:text-[#FFE0D1] group-focus-within:text-[#FFE0D1]"
                      style={groupTitleTypography}
                    >
                      {group.title}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-[#26201D] transition-colors duration-300 group-hover:text-[#FFF8F2] group-focus-within:text-[#FFF8F2] text-[14px] md:text-[16px]"
                          style={featureTypography}
                        >
                          {/* Check keeps the accent in both states. */}
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-[#E94222]"
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
                className="text-[#6D625C] transition-colors duration-300 group-hover:text-[#6D625C] group-focus-within:text-[#FFE0D1]"
                style={bestForTypography}
              >
                <b className="group-hover:text-[#A89890]">Best For:</b>{plan.bestFor}
              </p>

              {/*
                Hover-revealed CTA. The outer grid animates 0fr -> 1fr, which eases to
                the button's own height; the inner element must carry `overflow-hidden`
                for the collapsed row to actually clip it.

                No `mt-auto`: the card is content-height, so there is no free space to
                absorb and the button simply follows "Best For".
              */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <Link
                    href="/contact-us"
                    style={buttonTypography}
                    className="mt-7 block rounded-[10px] bg-[#E94222] py-[14px] text-center text-white transition-colors duration-200 hover:bg-[#cf3517]"
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

export default RestaurantPricing;
