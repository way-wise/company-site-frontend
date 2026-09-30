"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import priceVideoBg from "@/assets/images/ecommerce/price_video_bg.png";
import EcommercePlayButton from "./EcommercePlayButton";

/**
 * "Grow Your Retail Business with Our Most Popular Package" — three phase cards joined
 * into one panel.
 *
 * Same layout and mechanics as the /restaurant and /plumber pricing sections: the
 * popular (middle) card sits on a permanent dark ground, the others stay white, and
 * feature groups are an accordion (one open per card) that opens with a 0fr -> 1fr grid
 * row rather than max-height, so it eases to the list's real height.
 *
 * Outfit comes from the ROOT layout, which puts --font-outfit on <body>.
 */

const font = "var(--font-outfit), sans-serif";

// Section header — same ramp as the industries section.
const eyebrowTypography = {
  fontFamily: font,
  fontWeight: 500,
  lineHeight: "16px",
  letterSpacing: "1.44px",
} as const;

const titleTypography = {
  fontFamily: font,
  fontWeight: 600,
  letterSpacing: "0",
} as const;

const paragraphTypography = {
  fontFamily: font,
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// "Phase 1" — Outfit SemiBold.
const phaseTypography = {
  fontFamily: font,
  fontWeight: 600,
  letterSpacing: "-0.32px",
} as const;

// Card subtitle — Outfit SemiBold 16px.
const cardTitleTypography = {
  fontFamily: font,
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Price badge — Inter Bold. Inter comes from the ROOT layout, which puts --font-inter
// on <body>.
const priceTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.32px",
} as const;

// Card body — Outfit Regular 14px / 21px.
const cardBodyTypography = {
  fontFamily: font,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0",
} as const;

// Accordion header — Outfit Regular 16px.
const groupTitleTypography = {
  fontFamily: font,
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Accordion item — Outfit Regular 15px.
const featureTypography = {
  fontFamily: font,
  fontWeight: 400,
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Prices, bodies and group titles follow the Figma frame; the services inside each
// group are the page's existing Phase 1–3 lists, sorted into those groups.
const plans = [
  {
    phase: "Phase 1",
    title: "Retail Launch",
    price: "$950 – $2,950",
    body: "Build your retail brand and establish a strong online presence.",
    popular: false,
    groups: [
      {
        title: "Brand Identity",
        items: [
          "Custom Logo & Brand Identity",
          "Brand Guidelines & Marketing Materials",
        ],
      },
      {
        title: "Website Development",
        items: [
          "Responsive Retail Website",
          "Store Locations, Products & Photo Galleries",
          "Product Category Showcase",
        ],
      },
      {
        title: "Online Presence",
        items: [
          "Google Maps, Local SEO & Social Profiles",
          "Contact Forms, Store Hours & Location Details",
        ],
      },
      {
        title: "Hosting & Security",
        items: ["Hosting, Domain, Business Email & SSL Security"],
      },
    ],
  },
  {
    phase: "Phase 2",
    title: "Online Store Platform",
    price: "$2,975 – $6,700",
    body: "Everything in Phase 1 plus expand your business online with a complete e-commerce experience.",
    popular: true,
    groups: [
      {
        title: "Customer Experience",
        items: [
          "Customer Accounts & Wishlist",
          "Product Categories, Search & Filters",
        ],
      },
      {
        title: "Sales and Communication",
        items: [
          "Secure Checkout & Payment Gateway",
          "Email & SMS Order Updates",
        ],
      },
      {
        title: "E-Commerce Features",
        items: [
          "Custom Online Store & Shopping Cart",
          "Product, Inventory & Order Tracking",
        ],
      },
      {
        title: "Growth & Features",
        items: [
          "Discounts, Reviews & Product Recommendations",
          "Customer Retention & Follow-Up Automation",
        ],
      },
    ],
  },
  {
    phase: "Phase 3",
    title: "Smart Commerce Management",
    price: "$6,800 – $19,500",
    body: "Everything in Phase 1 & 2 plus transform your business with a complete commerce management system.",
    popular: false,
    groups: [
      {
        title: "Commerce Management",
        items: [
          "Customer CRM & Sales Dashboard",
          "Inventory & Order Management",
        ],
      },
      {
        title: "Analytics & Reports",
        items: ["Revenue, Sales, Customer & Inventory Reports"],
      },
      {
        title: "Team Management",
        items: [
          "Staff Management & Role Permissions",
          "Loyalty Programs & Communication Logs",
        ],
      },
      {
        title: "Mobile & Cloud Solutions",
        items: [
          "Shopping App & Secure Cloud Access",
          "Custom AI Tools & Business Automation",
          "Ongoing Growth & System Support",
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
        dark ? "bg-[#1E130A]" : "bg-white",
      )}
    >
      {/* h3: nested under this section's h2. */}
      <h3
        className={cn(
          "text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px]",
          dark ? "text-white" : "text-[#0B0B0B]",
        )}
        style={phaseTypography}
      >
        {plan.phase}
      </h3>

      <p
        className={cn("mt-1", dark ? "text-[#F3EDE8]" : "text-[#5F6B7A]")}
        style={cardTitleTypography}
      >
        {plan.title}
      </p>

      <p
        className="mt-4 w-fit rounded-[10px] bg-[#A07B62] px-3 py-1 text-[24px] leading-[40px] text-white xl:text-[30px] lg:text-[26px] sm:leading-[44px]"
        style={priceTypography}
      >
        {plan.price}
      </p>

      <p
        className={cn("mt-4", dark ? "text-[#D8CEC6]" : "text-[#5F6B7A]")}
        style={cardBodyTypography}
      >
        {plan.body}
      </p>

      {/* Accordion. Rows are separated by a thin rule; the last one has none. */}
      <div
        className={cn(
          "mt-4 flex flex-col divide-y",
          dark ? "divide-white/25" : "divide-[#1E130A]/15",
        )}
      >
        {plan.groups.map((group, index) => {
          const isOpen = openGroup === index;
          const panelId = `ecommerce-${plan.phase.replace(/\s+/g, "-").toLowerCase()}-group-${index}`;

          return (
            <div key={group.title}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenGroup(isOpen ? null : index)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] sm:text-[16px] focus-visible:underline focus-visible:outline-none",
                  dark ? "text-[#F3EDE8]" : "text-[#5F6B7A]",
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
                          dark ? "text-[#D8CEC6]" : "text-[#5F6B7A]",
                        )}
                        style={featureTypography}
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-[#A07B62]"
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

const EcommercePackages = () => {
  return (
    <section id="packages" className="scroll-mt-[110px] bg-[#F3EFEC] px-4">
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">
        <div className="mx-auto max-w-[768px] text-center">
          <p style={eyebrowTypography} className="pb-4 text-[15px] sm:text-[16px] text-[#A07B62]">
            BUILT AROUND YOUR BUSINESS STAGE
          </p>
          <h2
            style={titleTypography}
            className="pb-4 text-[30px] leading-10 text-[#E14B31] md:text-[48px] md:leading-12.5"
          >
            Grow Your Retail Business with Our Most Popular Package
          </h2>
          <p style={paragraphTypography} className="mx-auto max-w-[520px] text-[#5F6B7A]">
            Choose the right stage for your business today, then add smarter
            commerce tools as your needs grow.
          </p>
        </div>

        {/* One panel: the cards share the outer border and radius, and
            `overflow-hidden` squares off the dark card's corners against it. Cards
            stretch (the grid default) so the dark card always spans the full height. */}
        <ul className="mx-auto mt-10 grid max-w-[1320px] grid-cols-1 overflow-hidden rounded-2xl border border-[#DDE6F2] bg-white lg:mt-12 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.phase} plan={plan} />
          ))}
        </ul>

        {/* Video teaser. The headline is baked into the image; the play button sits
            dead centre with a red triangle, per the frame. */}
        <div className="relative mx-auto mt-10 w-full max-w-[800px] overflow-hidden rounded-2xl lg:mt-15">
          <Image
            src={priceVideoBg}
            alt="Power your retail business with smarter technology — Way-Wise Tech"
            className="h-auto w-full"
            sizes="(min-width: 832px) 800px, 100vw"
          />
          {/* <EcommercePlayButton size="md" iconClassName="text-[#E5412F]" /> */}
        </div>
      </div>
    </section>
  );
};

export default EcommercePackages;
