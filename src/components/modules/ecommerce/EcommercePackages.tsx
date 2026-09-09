import Link from "next/link";
import { Check } from "lucide-react";

/**
 * "Start With What You Need. Scale When You're Ready." — three phase packages.
 *
 * Every card inverts to the dark treatment on hover; the Figma frame shows the middle
 * one already inverted, which is that hover state being demonstrated rather than a
 * permanent style. The only thing genuinely unique to the middle card is its badge.
 *
 * The inversion is driven by `group-hover:` AND `group-focus-within:` so a keyboard user
 * tabbing to the "Get Started" link sees the same state a pointer user does.
 */

// Section header — same ramp as the industries section, as requested.
const eyebrowTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "16px",
  letterSpacing: "1.44px",
} as const;

const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Bold 14px / 16px, 1.2px letter-spacing, #A07B62.
const cardEyebrowTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "16px",
  letterSpacing: "1.2px",
} as const;

// Figma spec: Outfit Bold 24px / 28px, zero letter-spacing, #1E130A.
const cardTitleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 16px / 20px, zero letter-spacing, #5F6B7A.
// Shared by the sub-heading, the service items and the "Best for" paragraph — the spec
// gives all three identical values.
const bodyTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit SemiBold 14px / 16px, zero letter-spacing, #1E130A.
const bestForLabelTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "16px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 12px / 16px, zero letter-spacing. Inter comes from the ROOT
// layout, which puts --font-inter on <body>.
const badgeTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0",
} as const;

// No spec was given for the CTA label; it takes the same 16/20 Outfit as the body copy.
const buttonTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const packages: {
  phase: string;
  title: string;
  subtitle: string;
  badge?: string;
  services: string[];
  bestFor: string;
}[] = [
  {
    phase: "PHASE 1",
    title: "Retail Launch",
    subtitle: "Build a strong brand and digital foundation.",
    services: [
      "Custom Logo & Brand Identity",
      "Brand Guidelines & Marketing Materials",
      "Responsive Retail Website",
      "Store Locations, Products & Photo Galleries",
      "Product Category Showcase",
      "Google Maps, Local SEO & Social Profiles",
      "Contact Forms, Store Hours & Location Details",
      "Hosting, Domain, Business Email & SSL Security",
    ],
    bestFor:
      "Retail stores, specialty shops, local businesses, and new brands.",
  },
  {
    phase: "PHASE 2",
    title: "Online Store Platform",
    subtitle: "Create a seamless shopping experience that converts.",
    badge: "Most Popular",
    services: [
      "Custom Online Store & Shopping Cart",
      "Product Categories, Search & Filters",
      "Secure Checkout & Payment Gateway",
      "Customer Accounts & Wishlist",
      "Product, Inventory & Order Tracking",
      "Email & SMS Order Updates",
      "Discounts, Reviews & Product Recommendations",
      "Customer Retention & Follow-Up Automation",
    ],
    bestFor: "Growing retailers, online stores, and multi-category businesses.",
  },
  {
    phase: "PHASE 3",
    title: "Smart Commerce Management",
    subtitle: "Connect your sales, operations, team, and customer data.",
    services: [
      "Customer CRM & Sales Dashboard",
      "Inventory & Order Management",
      "Revenue, Sales, Customer & Inventory Reports",
      "Staff Management & Role Permissions",
      "Loyalty Programs & Communication Logs",
      "Shopping App & Secure Cloud Access",
      "Custom AI Tools & Business Automation",
      "Ongoing Growth & System Support",
    ],
    bestFor:
      "Retail chains, wholesale businesses, multi-location stores, and scaling e-commerce brands.",
  },
];

const EcommercePackages = () => {
  return (
    <section id="packages" className="scroll-mt-[110px] bg-[#F7FAFC] px-4">
      {/* 1420px, matching the navbar. */}
      <div className="mx-auto w-full max-w-[1420px] py-16 lg:py-[100px]">
        <div className="mx-auto max-w-[768px] text-center">
          <h3 style={eyebrowTypography} className="pb-4 text-[#A07B62]">
            BUILT AROUND YOUR BUSINESS STAGE
          </h3>
          <h2
            style={titleTypography}
            className="pb-4 text-[34px] leading-10 text-[#1E130A] md:text-[48px] md:leading-12.5"
          >
            Start With What You Need. Scale When You&apos;re Ready.
          </h2>
          <p style={paragraphTypography} className="text-[#5F6B7A]">
            Choose the right stage for your business today, then add smarter
            commerce tools as your needs grow.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {packages.map(
            ({ phase, title, subtitle, badge, services, bestFor }) => (
              /* The grid stretches every card to the tallest row height by default, so no
               `h-full` is needed here — adding one would fight the stretch and stagger
               the bottoms. `flex-col` plus `mt-auto` on the footer is what pins the CTAs
               to a common baseline while the "Best for" blocks stay where their copy
               ends, matching the frame. */
              <li
                key={phase}
                className="group flex flex-col rounded-2xl border-[0.8px] border-[#DDE6F2] bg-white p-10 transition-colors duration-300 hover:border-[#A07B62]/35 hover:bg-[#1E130A] hover:shadow-[0_20px_50px_rgba(30,19,10,0.18)] focus-within:border-[#A07B62]/35 focus-within:bg-[#1E130A] focus-within:shadow-[0_20px_50px_rgba(30,19,10,0.18)]"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    style={cardEyebrowTypography}
                    className="text-[#A07B62]"
                  >
                    {phase}
                  </span>
                  {badge ? (
                    /* No rest-state fill was specced, only the hover one. The accent at
                     12% is the nearest quiet equivalent, so the badge shifts weight
                     rather than changing character when the card inverts. */
                    <span
                      style={badgeTypography}
                      className="rounded-full bg-[#A07B62]/12 px-2 py-1 text-[#A07B62] transition-colors duration-300 group-hover:bg-[#A07B62]/15 group-focus-within:bg-[#A07B62]/15"
                    >
                      {badge}
                    </span>
                  ) : null}
                </div>

                {/* h3: nested under this section's h2. */}
                <h3
                  style={cardTitleTypography}
                  className="mt-3 text-[#1E130A] transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                >
                  {title}
                </h3>
                <p
                  style={bodyTypography}
                  className="mt-4 text-[#5F6B7A] transition-colors duration-300 group-hover:text-white/70 group-focus-within:text-white/70"
                >
                  {subtitle}
                </p>

                <ul className="mt-7 flex flex-col gap-4">
                  {services.map((service) => (
                    <li key={service} className="flex items-start gap-3">
                      {/* Only the hover fill was specced as an alpha (#A07B62 at 15%);
                        the rest fill is read the same way, since a solid #5F6B7A tile
                        would be a dark slate square against the white card. */}
                      <span
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#5F6B7A]/15 transition-colors duration-300 group-hover:bg-[#A07B62]/15 group-focus-within:bg-[#A07B62]/15"
                        aria-hidden="true"
                      >
                        <Check className="size-2.5 text-[#A07B62]" />
                      </span>
                      <span
                        style={bodyTypography}
                        className="text-[#5F6B7A] transition-colors duration-300 group-hover:text-white/70 group-focus-within:text-white/70"
                      >
                        {service}
                      </span>
                    </li>
                  ))}
                </ul>

                <p
                  style={bestForLabelTypography}
                  className="mt-8 text-[#1E130A] transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                >
                  Best for
                </p>
                <p
                  style={bodyTypography}
                  className="mt-3 text-[#5F6B7A] transition-colors duration-300 group-hover:text-white/70 group-focus-within:text-white/70"
                >
                  {bestFor}
                </p>

                {/* `mt-auto` absorbs the height each card is short of the tallest, which is
                  what lines the three CTAs up; `pt-8` keeps a floor under the gap. */}
                <div className="mt-auto pt-8">
                  <Link
                    href="/contact-us"
                    style={buttonTypography}
                    className="block rounded-[12px] border-[0.8px] border-[#A07B62] py-2.5 text-center text-[#A07B62] transition-colors duration-300 group-hover:bg-[#A07B62] group-hover:text-white group-focus-within:bg-[#A07B62] group-focus-within:text-white"
                  >
                    Get Started
                    <span className="sr-only"> with {title}</span>
                  </Link>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
};

export default EcommercePackages;
