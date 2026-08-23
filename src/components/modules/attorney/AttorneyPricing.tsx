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
  fontSize: "16px",
  lineHeight: "24px",
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
    price: "$750-$1800",
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
        title: "Law Firm Website",
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
    subhead: "Client Management Platform",
    price: "$1800 – $3900",
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
        title: "Comms System",
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
    price: "$750-$1800",
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

const PhaseCard = ({ phase, isMiddle }: { phase: Phase; isMiddle: boolean }) => (
  <div
    className="px-7 py-13"
    style={
      isMiddle
        ? { backgroundImage: MIDDLE_CARD_BG }
        : { backgroundColor: OUTER_CARD_BG }
    }
  >
    {/* h3: nested under this section's h2. */}
    <h3 style={phaseTypography} className="font-bold text-white">
      {phase.name}
    </h3>

    <p style={subheadTypography} className="mt-4 font-bold text-white">
      {phase.subhead}
    </p>

    {/* Price chip: 147x36 with 6px/12px padding and a 3px radius, per spec. */}
    <p
      style={{
        ...priceTypography,
        backgroundColor: phase.priceColor,
        borderRadius: "3px",
      }}
      className="mt-4 inline-block px-3 py-1.5 font-bold text-white"
    >
      {phase.price}
    </p>

    <p style={paragraphTypography} className="mt-4 text-[#B8B8B8]">
      {phase.summary}
    </p>

    <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9">
      {phase.groups.map((group) => (
        <div key={group.title}>
          {/* Plain <p>, not a heading: these sit under each card's h3 and would need
              to be h4s, but they are labels for the list directly beneath them and
              adding a fourth level here buys nothing for the outline. */}
          <p style={groupHeadTypography} className="font-semibold text-white">
            {group.title}
          </p>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {group.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckIcon />
                <span style={pointTypography} className="text-[#B8B8B8]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const AttorneyPricing = () => {
  return (
    <section
      id="packages"
      // Section backdrop: a violet glow bleeding in from the right over a deep
      // indigo base. Eyeballed from the Figma export — no values were given.
      style={{
        background:
          "radial-gradient(65% 55% at 96% 34%, rgba(146,102,248,0.85) 0%, rgba(146,102,248,0) 68%), radial-gradient(75% 60% at 18% 12%, rgba(63,33,132,0.65) 0%, rgba(0,0,0,0) 72%), #0E0626",
      }}
    >
      <AttorneyContainer className="py-28">
        <AttorneySectionHeading
          eyebrow="Built for Every Stage"
          heading="Grow Your Practice, Phase by Phase"
          headingClassName="!max-w-full"
        />

        {/* One clipped shell: the three cards touch, so the radius lives here. */}
        <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-3">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.name}
              phase={phase}
              isMiddle={index === 1}
            />
          ))}
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyPricing;
