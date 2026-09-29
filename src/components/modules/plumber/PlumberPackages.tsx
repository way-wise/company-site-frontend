"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import priceVideoBg from "@/assets/images/plumber/price_video_bg.png";
import PlumberPlayButton from "./PlumberPlayButton";

/**
 * Packages — three phase cards joined into one panel.
 *
 * Same layout and mechanics as the /restaurant pricing section: the popular (middle)
 * card sits on a permanent dark ground, the others stay light, and feature groups are an
 * accordion (one open per card) that opens with a 0fr -> 1fr grid row rather than
 * max-height, so it eases to the list's real height.
 *
 * Only the palette differs: lime replaces the orange. On the light cards the price is
 * plain lime text; on the dark card it sits in a lime badge with dark ink.
 */

const font = "var(--font-plus-jakarta-sans), sans-serif";

// Same ramp as the other sections on this page: Plus Jakarta Sans ExtraBold 48px / 60px,
// -1.2px letter-spacing, centered. Only the desktop size is specced.
const titleTypography = {
  fontFamily: font,
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the other sections: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: font,
  fontWeight: 500,
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

// Price — Plus Jakarta Sans ExtraBold.
const priceTypography = {
  fontFamily: font,
  fontWeight: 800,
  letterSpacing: "-0.32px",
} as const;

// Card body — Plus Jakarta Sans Regular 14px / 21px.
const cardBodyTypography = {
  fontFamily: font,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0",
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
    title: "Company Launch",
    price: "$950-$2950",
    body: "Build your construction brand and establish a strong digital presence.",
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
  },
  {
    phase: "Phase 2",
    title: "Collaboration Platform",
    price: "$2975 – $6700",
    body: "Improve project communication and simplify client collaboration.",
    popular: true,
    groups: [
      {
        title: "Client Experience",
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
        title: "Project Services",
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
  },
  {
    phase: "Phase 3",
    title: "Smart Communication Management",
    price: "$6800-$19500",
    body: "Everything in Phase 1 & 2 plus transform your business with a complete construction management system.",
    popular: false,
    groups: [
      {
        title: "Practice Management",
        items: [
          "Customer CRM",
          "Job Scheduling",
          "Dispatch Management",
          "Estimate & Invoice Management",
        ],
      },
      {
        title: "Analytics & Reports",
        items: [
          "Technician Dashboard",
          "Staff Scheduling",
          "GPS & Route Tracking",
          "Role-Based Permissions",
        ],
      },
      {
        title: "Team Management",
        items: [
          "Revenue Dashboard",
          "Job Performance Reports",
          "Technician Productivity",
          "Lead Conversion Reports",
        ],
      },
      {
        title: "Mobile & Cloud Solutions",
        items: [
          "Field Service Mobile App",
          "Customer Mobile App",
          "Secure Cloud Storage",
          "Accounting Integration",
          "Custom Software Integrations",
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
          dark ? "text-white" : "text-[#17120F]",
        )}
        style={phaseTypography}
      >
        {plan.phase}
      </h3>

      <p
        className={cn("mt-1", dark ? "text-[#FFE0D1]" : "text-[#17120F]")}
        style={cardTitleTypography}
      >
        {plan.title}
      </p>

      {/* Plain lime text on the light cards; a lime badge with dark ink on the dark
          one. */}
      <p
        className={cn(
          "mt-4 w-fit text-[26px] leading-[40px] sm:text-[30px] sm:leading-[44px]",
          dark
            ? "rounded-[10px] bg-[#B6D500] px-3 py-1 text-[#1C1817]"
            : "text-[#AECC00]",
        )}
        style={priceTypography}
      >
        {plan.price}
      </p>

      <p
        className={cn("mt-4", dark ? "text-[#D9CCC3]" : "text-[#26201D]")}
        style={cardBodyTypography}
      >
        {plan.body}
      </p>

      {/* Accordion. Rows are separated by a thin rule; the last one has none. */}
      <div
        className={cn(
          "mt-4 flex flex-col divide-y",
          dark ? "divide-white/25" : "divide-[#17120F]/25",
        )}
      >
        {plan.groups.map((group, index) => {
          const isOpen = openGroup === index;
          const panelId = `plumber-${plan.phase.replace(/\s+/g, "-").toLowerCase()}-group-${index}`;

          return (
            <div key={group.title}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenGroup(isOpen ? null : index)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] sm:text-[16px] focus-visible:underline focus-visible:outline-none",
                  dark ? "text-[#FFE0D1]" : "text-[#17120F]",
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
                          className="mt-0.5 size-4 shrink-0 text-[#B6D500]"
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

const PlumberPackages = () => {
  return (
    <section id="packages" className="w-full scroll-mt-[110px] bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        {/* Olive rather than the #B6D500 accent: the bright lime is too light to
            carry a heading on white. */}
        <h2
          className="text-center max-w-[928px] mx-auto text-[30px] leading-[1.2] text-[#7E9400] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Grow Your Service Business with Our Most Popular Package</span>
        </h2>

        <p
          className="mx-auto mt-5 max-w-[880px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Start with a professional website, add customer-booking tools, or
          build a complete service-management platform tailored to your team,
          workflow, and growth goals.
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
            dead centre, over the laptop. */}
        <div className="relative mx-auto mt-10 w-full max-w-[800px] overflow-hidden rounded-2xl lg:mt-15">
          <Image
            src={priceVideoBg}
            alt="Why our packages are the best for smart technology and faster growth — Way-Wise Tech"
            className="h-auto w-full"
            sizes="(min-width: 832px) 800px, 100vw"
          />
          {/* <PlumberPlayButton size="md" /> */}
        </div>
      </div>
    </section>
  );
};

export default PlumberPackages;
