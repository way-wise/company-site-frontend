"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import RestaurentPlayButton from "./RestaurentPlayButton";

/**
 * Pricing — three phase cards joined into one panel. The popular (middle) card sits on
 * a permanent dark ground; the others stay light.
 *
 * Feature groups are an accordion (one open per card). The panel opens with a
 * 0fr -> 1fr grid row rather than max-height, so it eases to the list's real height
 * instead of an arbitrary guess.
 */

const font = "var(--font-plus-jakarta-sans), sans-serif";

// Plus Jakarta Sans ExtraBold 48px / 60px, orange. Steps below desktop are mine.
const titleTypography = {
  fontFamily: font,
  fontWeight: 800,
  letterSpacing: "-0.48px",
} as const;

// Plus Jakarta Sans Regular 18px / 28px.
const introTypography = {
  fontFamily: font,
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// "Phase 1" — Plus Jakarta Sans ExtraBold.
const phaseTypography = {
  fontFamily: font,
  fontWeight: 800,
  letterSpacing: "-0.32px",
} as const;

// Card subtitle — Plus Jakarta Sans Bold 16px.
const cardTitleTypography = {
  fontFamily: font,
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Card body — Plus Jakarta Sans Regular 14px / 21px.
const cardBodyTypography = {
  fontFamily: font,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0",
} as const;

// Price badge — Plus Jakarta Sans ExtraBold.
const priceTypography = {
  fontFamily: font,
  fontWeight: 800,
  letterSpacing: "-0.32px",
} as const;

// Accordion header — Plus Jakarta Sans Medium 16px.
const groupTitleTypography = {
  fontFamily: font,
  fontWeight: 500,
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Accordion item — Plus Jakarta Sans Regular 15px.
const featureTypography = {
  fontFamily: font,
  fontWeight: 400,
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const plans = [
  {
    phase: "Phase 1",
    title: "Restaurant Launch",
    price: "$950 – $2950",
    body: "Build your restaurant brand and establish a strong online presence.",
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
        title: "Restaurant Website",
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
  },
  {
    phase: "Phase 2",
    title: "Client Ordering Platform",
    price: "$2975 – $6700",
    body: "Everything in phase 1 plus improve customer experience and simplify ordering and reservations.",
    popular: true,
    groups: [
      {
        title: "Customer Experience",
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
  },
  {
    phase: "Phase 3",
    title: "Smart Legal Practice Management",
    price: "$6700 – $19,500",
    body: "Everything in Phase 1 & 2 plus transform your firm with a complete legal management system.",
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
        title: "Team Management",
        items: [
          "Staff Management",
          "Branch Management",
          "Role-Based Permissions",
          "Menu Management",
        ],
      },
      {
        title: "Mobile, Cloud & Solutions",
        items: [
          "Mobile Applications",
          "Tablet Ordering",
          "Push Notifications",
          "Secure Cloud Storage",
          "POS Integrations",
        ],
      },
    ],
  },
];

type Plan = (typeof plans)[number];

const PlanCard = ({ plan }: { plan: Plan }) => {
  // Index of the open feature group; null = all collapsed.
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const dark = plan.popular;

  return (
    <li
      className={cn(
        "flex flex-col p-6 sm:p-8 lg:p-10",
        dark ? "bg-[#17120F]" : "bg-[#FFFAF6]",
      )}
    >
      {/* h3: nested under this section's h2. */}
      <h3
        className={cn(
          "text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px]",
          dark ? "text-white" : "text-[#6D625C]",
        )}
        style={phaseTypography}
      >
        {plan.phase}
      </h3>

      <p
        className={cn("mt-1", dark ? "text-[#FFF1E5]" : "text-[#6D625C]")}
        style={cardTitleTypography}
      >
        {plan.title}
      </p>

      <p
        className={cn("mt-4", dark ? "text-[#D9CCC3]" : "text-[#6D625C]")}
        style={cardBodyTypography}
      >
        {plan.body}
      </p>

      <p
        className={cn(
          "mt-4 w-fit rounded-[10px] px-3 py-1 text-[26px] leading-[40px] text-white sm:text-[32px] sm:leading-[44px]",
          dark ? "bg-[#F37A3A]" : "bg-[#E94222]",
        )}
        style={priceTypography}
      >
        {plan.price}
      </p>

      {/* Accordion. Rows are separated by a thin rule; the last one has none. */}
      <div
        className={cn(
          "mt-4 flex flex-col divide-y",
          dark ? "divide-white/25" : "divide-[#17120F]/15",
        )}
      >
        {plan.groups.map((group, index) => {
          const isOpen = openGroup === index;
          const panelId = `${plan.phase.replace(/\s+/g, "-").toLowerCase()}-group-${index}`;

          return (
            <div key={group.title}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenGroup(isOpen ? null : index)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] sm:text-[16px] focus-visible:underline focus-visible:outline-none",
                  dark ? "text-[#FFF1E5]" : "text-[#4A403A]",
                )}
                style={groupTitleTypography}
              >
                {group.title}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="flex flex-col gap-2.5 pb-4" inert={!isOpen}>
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-start gap-2.5 text-[14px] sm:text-[15px]",
                          dark ? "text-[#D9CCC3]" : "text-[#6D625C]",
                        )}
                        style={featureTypography}
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-[#E94222]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
};

const RestaurantPricing = () => {
  return (
    <section id="packages" className="w-full scroll-mt-[110px] bg-[#FFF1E5] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center max-w-[766px] mx-auto text-[30px] leading-[1.2] text-[#F97316] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Grow Your Food Business with Our Most Popular Package</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[860px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Choose a focused launch package, add customer-engagement tools, or
          build a complete management platform. Every solution is tailored to
          your business goals, workflow, and growth stage.
        </p>

        {/* One panel: the cards share the outer border and radius, and
            `overflow-hidden` squares off the dark card's corners against it. Cards
            stretch (the grid default) so the dark card always spans the full height. */}
        <ul className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-[#17120F]/9 bg-[#FFFAF6] lg:mt-15 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.phase} plan={plan} />
          ))}
        </ul>

        {/* Video teaser. The headline is baked into the image; the play button sits
            dead centre, over the faint one drawn into the artwork. */}
        <div className="relative mx-auto mt-10 w-full max-w-[800px] overflow-hidden rounded-2xl lg:mt-15">
          <Image
            src="/images/restaurant/price-page-video-bg.png"
            alt="Why our packages are the best for the food and restaurant industry — Way-Wise Tech"
            width={800}
            height={451}
            sizes="(min-width: 832px) 800px, 100vw"
            className="h-auto w-full"
          />
          <RestaurentPlayButton size="md" />
        </div>
      </div>
    </section>
  );
};

export default RestaurantPricing;
