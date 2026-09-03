import {
  Calendar,
  Clock,
  Repeat,
  Settings,
  Smile,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Better Digital Experiences Create Better Restaurant Outcomes." — six outcome cards.
 *
 * Structurally identical to RestaurantGrowDigitally, as requested: same card fill,
 * border, radius, padding, icon tile and type ramps. Only the section ground (white
 * here, #FFF8F2 there) and the content differ.
 *
 * Icons are lucide components, matching that section's approach.
 */

// Same ramp as the sibling sections: Plus Jakarta Sans ExtraBold 48px / 60px, centered,
// #0F1A1A. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Same ramp as the sibling sections: Plus Jakarta Sans Regular 18px / 26.4px, #6D625C.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.4px",
  letterSpacing: "0",
} as const;

// Matching RestaurantGrowDigitally: Plus Jakarta Sans Bold 20px / 28px, #17120F.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Matching RestaurantGrowDigitally: Plus Jakarta Sans Regular 18px / 30px, #6D625C.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

/**
 * NOTE: every `body` string below is identical to the one on the matching card in
 * RestaurantGrowDigitally — the Figma frame reuses that section's copy verbatim under
 * different headings. Reproduced as-is and flagged to the user.
 */
const cards: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: TrendingUp,
    title: "Increase Direct Orders",
    body: "Beautiful, fast, mobile-first websites that showcase your food, story, locations, menu, events, and brand experience.",
  },
  {
    Icon: Smile,
    title: "Improve Guest Experience",
    body: "A seamless direct-ordering experience for pickup, delivery, scheduled orders, promotions, and secure online payments.",
  },
  {
    Icon: Repeat,
    title: "Grow Repeat Customers",
    body: "Make it easy for guests to reserve tables, submit catering requests, ask questions, and receive timely updates.",
  },
  {
    Icon: Calendar,
    title: "Simplify Reservations",
    body: "Build stronger guest relationships through loyalty programs, offers, email campaigns, SMS notifications, and review requests.",
  },
  {
    Icon: Clock,
    title: "Reduce Manual Work",
    body: "Give regular customers a convenient branded mobile experience for ordering, rewards, notifications, and repeat visits.",
  },
  {
    Icon: Settings,
    title: "Make Smarter Decisions",
    body: "Connect customer data, order activity, reporting, delivery tools, and POS systems to support better decisions.",
  },
];

const RestaurantOutcomes = () => {
  return (
    <section className="w-full bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0F1A1A] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Better Digital Experiences Create</span>
          <span className="block">Better Restaurant Outcomes.</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[860px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Choose a focused launch package, add customer-engagement tools, or
          build a complete management platform. Every solution is tailored to
          your business goals, workflow, and growth stage.
        </p>

        <ul className="mt-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ Icon, title, body }) => (
            <li
              key={title}
              className="rounded-[20px] border border-[#17120F]/8 bg-[#FFFDFC] p-8"
            >
              {/* `bg-[#F36F38]/10` is the 1A alpha suffix expressed as a Tailwind
                  opacity modifier — same colour, fewer magic hex digits. */}
              <span
                className="flex size-12 items-center justify-center rounded-[10px] bg-[#F36F38]/10"
                aria-hidden="true"
              >
                <Icon className="size-5 text-[#E94222]" />
              </span>

              {/* h3: nested under this section's h2. */}
              <h3 className="mt-8 text-[#17120F]" style={cardTitleTypography}>
                {title}
              </h3>
              <p className="mt-3 text-[#6D625C]" style={cardBodyTypography}>
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RestaurantOutcomes;
