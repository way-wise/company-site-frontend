"use client";

import { useState } from "react";
import Image from "next/image";
import chevronDown from "@/assets/images/attorney/IconChevronDown.png";
import bgImage from "@/assets/images/attorney/AttorneyStats-frame-iamge.png";
import videoThumb from "@/assets/images/attorney/PhaseCard-after-card-image.png";
import AttorneyPlayButton from "./AttorneyPlayButton";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";

/**
 * Section 11 — "Grow Your Practice, Phase by Phase".
 *
 * Three phase cards butted flush against each other inside one rounded, clipped
 * shell — there is no gap between them in the design, so the outer radius is on the
 * wrapper and the cards themselves are square.
 */

// Figma spec: Inter Bold 32px / 24px, zero letter-spacing.
const phaseTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "32px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Bold 16px / 24px, zero letter-spacing.
const subheadTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// No type spec was given for the price text itself, only the 147x36 chip geometry.
// 16px bold fills that box at the 6px/12px padding specified.
const priceTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "32px",
  lineHeight: "40px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 14px / 21.45px, zero letter-spacing, #B8B8B8.
const paragraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter SemiBold 16px / 21.45px, zero letter-spacing.
const groupHeadTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 14px / 21.45px, zero letter-spacing, #B8B8B8.
const pointTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

const OUTER_CARD_BG = "#060138";
// The middle card reads as a translucent violet wash over the section gradient.
// Approximated — no value was specified beyond "gradient".
const MIDDLE_CARD_BG =
  "linear-gradient(180deg, rgba(124,92,215,0.34) 0%, rgba(78,55,150,0.26) 100%)";

type Phase = {
  name: string;
  subhead: string;
  price: string;
  /** One flat colour per phase, per spec: red, orange, amber. */
  priceColor: string;
  summary: string;
  groups: { title: string; points: string[] }[];
};

const phases: Phase[] = [
  {
    name: "Phase 1",
    subhead: "Practice Launch",
    price: "$950-$2950",
    priceColor: "#FB3748",
    summary:
      "Build your legal brand and establish a trusted and reliable online presence.",
    groups: [
      {
        title: "Brand Identity",
        points: [
          "Custom Logo Design",
          "Brand Guidelines",
          "Business Stationery",
          "Legal Templates",
        ],
      },
      {
        title: "Website Development",
        points: [
          "5–10 Page",
          "Practice Areas",
          "Attorney Profile",
          "Client Testimonials",
          "Mobile Responsive",
        ],
      },
      {
        title: "Online Presence",
        points: [
          "Contact Forms",
          "Google Maps",
          "Social Profiles",
          "Basic SEO",
          "Consultation Forms",
        ],
      },
      {
        title: "Hosting & Security",
        points: ["Domain & Hosting", "Business Email", "SSL Security"],
      },
    ],
  },
  {
    name: "Phase 2",
    subhead: "Client Engagement Platform",
    price: "$2950 – $6700",
    priceColor: "#F97316",
    summary:
      "Improve client communication and create a modern legal experience.",
    groups: [
      {
        title: "Client Experience",
        points: [
          "Online Scheduling",
          "Secure Client Portal",
          "AI Assistant",
          "Live Messaging",
          "Intake Forms",
        ],
      },
      {
        title: "Communication System",
        points: [
          "Email & SMS Alerts",
          "Appointment Reminders",
          "Client Messaging",
          "Attorney Messaging",
          "Review Management",
        ],
      },
      {
        title: "Client Services",
        points: [
          "Document Uploads",
          "E-Signatures",
          "Billing Portal",
          "Retainer Delivery",
          "Online Payments",
        ],
      },
      {
        title: "Growth & Visibility",
        points: ["Lead Qualification", "Business Email", "SSL Security"],
      },
    ],
  },
  {
    name: "Phase 3",
    subhead: "Smart Legal Practice Management",
    price: "$6700-$19500",
    priceColor: "#FCB017",
    summary:
      "Everything in Phase 1 & 2 plus transform your firm with a complete legal management system.",
    groups: [
      {
        title: "Practice Management",
        points: [
          "Case Management",
          "Client Database",
          "Matter Tracking",
          "Deadline Tracking",
          "Workflow Management",
        ],
      },
      {
        title: "Analytics & Reports",
        points: [
          "Revenue Reports",
          "Legal Analytics",
          "Case Reporting",
          "AI Insights",
          "Performance Dashboard",
        ],
      },
      {
        title: "Team Management",
        points: [
          "Staff Management Portal",
          "Multi-Attorney Access",
          "Role Permissions",
          "Communication Logs",
        ],
      },
      {
        title: "Mobile & Cloud Solutions",
        points: [
          "Attorney & Client Mobile App",
          "Tablet Access",
          "Secure Cloud Storage",
          "Custom Legal App",
        ],
      },
    ],
  },
];

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="mt-1 size-3.5 shrink-0 text-[#00A3FF]"
  >
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

const GroupRow = ({ group }: { group: Phase["groups"][number] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/30">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left"
      >
        <span style={groupHeadTypography} className="font-medium text-white">
          {group.title}
        </span>
        <Image
          src={chevronDown}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-2.5 pb-4">
          {group.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckIcon />
              <span style={pointTypography} className="text-[#B8B8B8]">
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PhaseCard = ({ phase, isMiddle }: { phase: Phase; isMiddle: boolean }) => (
  <div
    className="flex flex-col gap-[30px] px-[30px] pt-[54px] pb-[45px]"
    style={
      isMiddle
        ? { backgroundImage: MIDDLE_CARD_BG }
        : { backgroundColor: OUTER_CARD_BG }
    }
  >
    <div className="flex flex-col items-start gap-3">
      {/* h3: nested under this section's h2. */}
      <div>
        <h3 style={phaseTypography} className="font-bold text-white">
          {phase.name}
        </h3>
        <p style={subheadTypography} className="mt-3 font-bold text-white">
          {phase.subhead}
        </p>
      </div>
      <p
        style={{
          ...priceTypography,
          backgroundColor: phase.priceColor,
          borderRadius: "6px",
        }}
        className="inline-block px-3 py-1 font-semibold text-white"
      >
        {phase.price}
      </p>
      <p style={paragraphTypography} className="text-[#B8B8B8]">
        {phase.summary}
      </p>
    </div>

    <div className="flex flex-col">
      {phase.groups.map((group) => (
        <GroupRow key={group.title} group={group} />
      ))}
    </div>
  </div>
);

const AttorneyPricing = () => {
  return (
    <section
      id="packages"
      // scroll-mt clears the pinned navbar so this section's heading isn't hidden
      // beneath it when the nav link jumps here.
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#0E0626]"
    >
      <Image
        src={bgImage}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none -z-10 object-cover"
      />
      <AttorneyContainer className="py-15 lg:py-30" innerClassName="flex flex-col gap-15">
        {/* Wrapped so the eyebrow and heading aren't separated by the parent's 60px flex gap. */}
        <div>
          <AttorneySectionHeading
            eyebrow="Built for Every Stage"
            heading="Grow Your Practice with Our Most Popular Package"
            headingClassName="!mt-3 !max-w-[740px] text-[36px] !leading-10 text-[#FCB017] lg:text-[60px] lg:!leading-[66px]"
            headingStyle={{ letterSpacing: "0" }}
          />
        </div>

        {/* One clipped shell: the three cards touch, so the radius lives here. */}
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl md:grid-cols-3">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.name}
              phase={phase}
              isMiddle={index === 1}
            />
          ))}
        </div>

        <div className="relative mx-auto aspect-video w-full max-w-[800px] overflow-hidden rounded-xl border border-white/35">
          <Image
            src={videoThumb}
            alt="Why our packages are the best for law firms"
            fill
            sizes="800px"
            className="object-cover"
          />
          <AttorneyPlayButton />
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyPricing;
