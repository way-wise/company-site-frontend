import Image from "next/image";

/**
 * "More Than a Website Team. A Digital Growth Partner for Your Restaurant." — a photo
 * with an overlaid stat bar on the left, copy and four numbered cards on the right.
 *
 * The photo lives in `public/` rather than `src/assets/`, which is where it was
 * supplied, so it is referenced by path and needs its intrinsic size declared.
 */
const PHOTO = "/images/restaurant/growth_partner.webp";
const PHOTO_WIDTH = 630;
const PHOTO_HEIGHT = 896;

// Same ramp as the sibling sections: Plus Jakarta Sans ExtraBold 48px / 60px, #0F1A1A.
// Only the desktop size is specced; the steps below it are mine.
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

// Matching RestaurantGrowDigitally's cards: Plus Jakarta Sans Bold 20px / 28px.
// Shared by the card headings (#17120F) and the step numbers (#E94222) — only the
// colour differs.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Matching RestaurantGrowDigitally's cards: Plus Jakarta Sans Regular 18px / 30px.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 32px / 19.5px, centered, #E94222.
const statNumberTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 14px / 19.5px, centered.
const statLabelTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

const stats = [
  { number: "50+", label: "Restaurants Served" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "3x", label: "Avg. Order Growth" },
];

const cards = [
  {
    number: "01",
    title: "Built Around Your Workflow",
    body: "We learn how your restaurant serves, sells, communicates, and manages operations before recommending technology.",
  },
  {
    number: "02",
    title: "Premium Brand Experience",
    body: "Every website, ordering screen, dashboard, and customer touchpoint is designed to feel consistent with your brand.",
  },
  {
    number: "03",
    title: "Flexible and Scalable",
    body: "Start with what creates the most value now, then expand as your team, locations, and customer base grow.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    body: "We stay available after launch to support improvements, updates, integrations, and the next stage of growth.",
  },
];

const RestaurantGrowthPartner = () => {
  return (
    <section className="w-full bg-[#FFF8F2] px-4">
      {/* 630px per column: the photo's intrinsic width, and exactly half of 1320 once
          the 60px gap is taken out. */}
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 py-10 xl:grid-cols-2 lg:gap-[60px] lg:py-[100px]">
        {/* Photo column */}
        <div className="relative order-2 xl:order-1 overflow-hidden rounded-[20px]">
          <Image
            src={PHOTO}
            alt="Barista working at a laptop behind a café counter"
            width={PHOTO_WIDTH}
            height={PHOTO_HEIGHT}
            className="aspect-[630/896] w-full object-cover"
            sizes="(min-width: 1024px) 630px, 100vw"
          />

          {/* Stat bar, inset from the photo's bottom edge. */}
          <div className="absolute inset-x-7.5 bottom-8 grid grid-cols-3 gap-4 rounded-[20px] bg-[#181411] p-5 md:p-[30px]">
            {stats.map(({ number, label }) => (
              <div key={label} className="text-center">
                <p className="text-[#E94222] text-[24px] md:text-[32px]" style={statNumberTypography}>
                  {number}
                </p>
                {/* No colour specced for the label; it reads white on this dark bar. */}
                <p className="mt-3 text-white" style={statLabelTypography}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Copy column */}
        <div className="order-1 xl:order-2">
          <h2
            className="text-[26px] leading-[36px] text-[#0F1A1A] sm:text-[38px] lg:text-[44px] lg:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard break reproduced from the Figma frame. */}
            <span className="block">More Than a Website Team.</span>
            <span className="block sm:my-3! md:my-0! ">A Digital Growth Partner for</span>
            <span className="block">Your Restaurant.</span>
          </h2>

          <p className="mt-4 text-[#6D625C]" style={introTypography}>
            We combine strategy, design, development, automation, and ongoing
            support to help food businesses build systems that are practical
            today and scalable for tomorrow.
          </p>

          <ul className="mt-7 flex flex-col gap-2">
            {cards.map(({ number, title, body }) => (
              <li
                key={number}
                className="rounded-[20px] border border-[#17120F]/8 bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="shrink-0 text-[#E94222]"
                    style={cardTitleTypography}
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  {/* h3: nested under this section's h2. */}
                  <h3 className="text-[#17120F]" style={cardTitleTypography}>
                    {title}
                  </h3>
                </div>

                {/* Indented to line up with the heading rather than the number: the
                    number column plus its 16px gap. */}
                <p
                  className="mt-2 pl-[calc(2ch+1rem)] text-[#6D625C]"
                  style={cardBodyTypography}
                >
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RestaurantGrowthPartner;
