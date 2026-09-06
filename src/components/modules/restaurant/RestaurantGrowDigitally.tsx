import {
  Calendar,
  ChartColumn,
  Globe,
  Heart,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Everything Your Restaurant Needs to Grow Digitally" — six capability cards.
 *
 * Icons are lucide components rather than supplied assets: the spec gives the glyph
 * colour (#E94222) and tile fill (#F36F38 at 10%) as CSS values, which only makes sense
 * for vectors. Picked to match the Figma artwork.
 */

// Same ramp as RestaurantFoodBusiness, as requested: Plus Jakarta Sans ExtraBold
// 48px / 60px, centered, #0F1A1A. Only the desktop size is specced; the steps below
// it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Same ramp as RestaurantFoodBusiness: Plus Jakarta Sans Regular 18px / 26.4px,
// centered, #6D625C.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.4px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 20px / 20.8px, zero letter-spacing, #17120F.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 30px, zero letter-spacing, #6D625C.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

const cards: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Globe,
    title: "Restaurant Website & Digital Menu",
    body: "Beautiful, fast, mobile-first websites that showcase your food, story, locations, menu, events, and brand experience.",
  },
  {
    Icon: ShoppingBag,
    title: "Online Ordering & Secure Payments",
    body: "A seamless direct-ordering experience for pickup, delivery, scheduled orders, promotions, and secure online payments.",
  },
  {
    Icon: Calendar,
    title: "Reservations & Guest Experience",
    body: "Make it easy for guests to reserve tables, submit catering requests, ask questions, and receive timely updates.",
  },
  {
    Icon: Heart,
    title: "Customer Loyalty & Retention",
    body: "Build stronger guest relationships through loyalty programs, offers, email campaigns, SMS notifications, and review requests.",
  },
  {
    Icon: Smartphone,
    title: "Restaurant Mobile Applications",
    body: "Give regular customers a convenient branded mobile experience for ordering, rewards, notifications, and repeat visits.",
  },
  {
    Icon: ChartColumn,
    title: "CRM, Analytics & Integrations",
    body: "Connect customer data, order activity, reporting, delivery tools, and POS systems to support better decisions.",
  },
];

const RestaurantGrowDigitally = () => {
  return (
    <section id="services" className="w-full scroll-mt-[110px] bg-[#FFF8F2] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0F1A1A] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Everything Your Restaurant</span>
          <span className="block">Needs to Grow Digitally</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[820px] text-center text-[#6D625C]"
          style={introTypography}
        >
          From your first website to a complete restaurant management ecosystem,
          every solution is designed to improve the customer journey and make
          daily operations easier.
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

export default RestaurantGrowDigitally;
