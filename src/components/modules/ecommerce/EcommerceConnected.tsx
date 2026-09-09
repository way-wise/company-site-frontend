import { Layers, Monitor, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Your Customers Shop Everywhere. Your Business Should Work Together." — four benefit
 * cards.
 *
 * Icons are lucide components rather than supplied assets: the spec gives the tile fill,
 * size and glyph colour as CSS values, which only makes sense for vectors. Picked to
 * match the Figma artwork.
 *
 * Unlike the industries section this frame has no eyebrow line above the heading.
 */

// Same ramp as the industries section: Outfit SemiBold 48px / 50px, centered, #1E130A.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Same ramp as the industries section: Outfit Regular 18px / 24px, centered, #5F6B7A.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit SemiBold 18px / 19.25px, zero letter-spacing, #1E130A.
const cardTitleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  fontSize: "18px",
  lineHeight: "19.25px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 26px, zero letter-spacing, #5F6B7A.
const cardParagraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const items: { Icon: LucideIcon; title: string; desp: string }[] = [
  {
    Icon: Layers,
    title: "Capture More Sales",
    desp: "Turn website visits, mobile browsing, and local searches into real customers.",
  },
  {
    Icon: Monitor,
    title: "Manage Operations Clearly",
    desp: "Keep products, stock, orders, customer activity, and team tasks organized.",
  },
  {
    Icon: Users,
    title: "Improve Customer Experience",
    desp: "Provide customers with quicker info, easier checkout, and improved communication.",
  },
  {
    Icon: TrendingUp,
    title: "Grow With Confidence",
    desp: "Create a strong digital foundation that grows effortlessly with your business.",
  },
];

const EcommerceConnected = () => {
  return (
    <section id="why-us" className="scroll-mt-[110px] bg-[#F5EDE6] px-4">
      {/* 1420px, matching the navbar. */}
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">
        <div className="text-center">
          {/* Same size ramp as the industries heading. */}
          <h2
            style={titleTypography}
            className="pb-4 text-[30px] leading-10 text-[#1E130A] md:text-[48px] md:leading-12.5"
          >
            {/* Hard break reproduced from the Figma frame, but only from xl up: at
                48px the second sentence measures ~875px, so below that width the two
                sentences wrap naturally instead of overflowing. */}
            <span className="xl:block">Your Customers Shop Everywhere. </span>
            <span className="xl:block">
              Your Business Should Work Together.
            </span>
          </h2>
          {/* Narrower than the heading so it breaks where the Figma frame does. */}
          <p
            style={paragraphTypography}
            className="mx-auto max-w-[768px] text-[#5F6B7A]"
          >
            Connect the digital tools behind your business, so every store
            visit, online order, and customer relationship is easier to manage.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ Icon, title, desp }) => (
            <li key={title} className="rounded-2xl bg-white p-6 md:p-10">
              <span
                className="flex size-10 items-center justify-center rounded-[12px] bg-[#F5EDE6]"
                aria-hidden="true"
              >
                <Icon className="size-5 text-[#A07B62]" />
              </span>

              {/* h3: nested under this section's h2. 20px below the icon tile. */}
              <h3 style={cardTitleTypography} className="mt-5 text-[#1E130A]">
                {title}
              </h3>
              <p
                style={cardParagraphTypography}
                className="mt-3 text-[#5F6B7A]"
              >
                {desp}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EcommerceConnected;
