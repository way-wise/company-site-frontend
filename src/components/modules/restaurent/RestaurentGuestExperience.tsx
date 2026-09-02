import Image from "next/image";

/**
 * "Guest experience begins before arrival." — copy and a photo on the left, four
 * numbered problem/solution cards on the right.
 *
 * The badges are presentational: "Discovery" is marked active to match the Figma frame,
 * but they do not switch anything yet. Only `discovery.webp` and this one set of four
 * cards exist — turning them into real tabs needs three more images and twelve more
 * cards. Flagged to the user.
 *
 * The photo lives in `public/` rather than `src/assets/`, which is where it was
 * supplied, so it is referenced by path and needs its intrinsic size declared.
 */
const PHOTO = "/images/restaurent/discovery.webp";
const PHOTO_WIDTH = 630;
const PHOTO_HEIGHT = 315;

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, -1.2px letter-spacing, #0F1A1A.
// Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 30px, zero letter-spacing, #6D625C.
// Shared by the section intro and the card body copy.
const bodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 19.5px, zero letter-spacing.
const badgeTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 20px / 19.5px, zero letter-spacing. Shared by the
// card headings (#17120F) and the step numbers (#E94222) — only the colour differs.
const cardHeadingTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const badges = ["Discovery", "Ordering", "Loyalty", "Analytics"];

/** The Figma frame shows "Discovery" selected. */
const ACTIVE_BADGE = "Discovery";

const cards = [
  {
    number: "01",
    title: "Too Much Reliance on Third-Party Platforms",
    body: "Build direct ordering channels that keep your brand, customer data, and margins in your control.",
  },
  {
    number: "02",
    title: "Missed Orders and Manual Work",
    body: "Reduce phone calls, repetitive follow-ups, and disconnected reservation or delivery workflows.",
  },
  {
    number: "03",
    title: "Low Repeat Customer Rate",
    body: "Turn one-time guests into regulars with loyalty, reminders, personalized offers, and smart follow-ups.",
  },
  {
    number: "04",
    title: "Limited Visibility into Performance",
    body: "See the numbers that matter—from order trends and customer behavior to revenue and operational performance.",
  },
];

const RestaurentGuestExperience = () => {
  return (
    <section id="services" className="w-full bg-white px-4">
      {/* 630px per column: the photo's intrinsic width, and exactly half of 1320 once
          the 60px gap is taken out. */}
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 py-10 lg:grid-cols-2 lg:gap-[60px] lg:py-[100px]">
        {/* Copy column */}
        <div>
          <h2
            className="text-[32px] leading-[1.2] text-[#0F1A1A] sm:text-[40px] lg:text-[48px] lg:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard break reproduced from the Figma frame. */}
            <span className="block">Guest experience begins</span>
            <span className="block">before arrival.</span>
          </h2>

          <p className="mt-5 text-[#6D625C]" style={bodyTypography}>
            Customers today want to find your restaurant online, view a clear
            menu, book a table, place orders, get updates, and return easily.
          </p>

          {/* 12px gap per spec. `bg-[#F36F38]/12` is the 1F alpha suffix expressed as a
              Tailwind opacity modifier — same colour, fewer magic hex digits. */}
          <ul className="mt-8 flex flex-wrap items-center gap-3">
            {badges.map((badge) => {
              const isActive = badge === ACTIVE_BADGE;
              return (
                <li
                  key={badge}
                  style={badgeTypography}
                  className={`rounded-[100px] px-[18px] py-2 whitespace-nowrap ${
                    isActive
                      ? "bg-[#E94222] text-white"
                      : "bg-[#F36F38]/12 text-[#E94222]"
                  }`}
                >
                  {badge}
                </li>
              );
            })}
          </ul>

          <Image
            src={PHOTO}
            alt="Restaurant manager holding a tablet in a dining room"
            width={PHOTO_WIDTH}
            height={PHOTO_HEIGHT}
            className="mt-8 aspect-[630/315] w-full rounded-[18px] object-cover"
            sizes="(min-width: 1024px) 630px, 100vw"
          />
        </div>

        {/* Cards column */}
        <ul className="flex md:grid md:grid-cols-2 lg:flex flex-col gap-5">
          {cards.map(({ number, title, body }) => (
            <li
              key={number}
              className="flex gap-5 rounded-[18px] border border-[#17120F]/8 bg-[#FFFDFC] px-7 py-6"
            >
              <span
                className="shrink-0 text-[#E94222]"
                style={cardHeadingTypography}
                aria-hidden="true"
              >
                {number}
              </span>

              <div>
                {/* h3: nested under this section's h2. */}
                <h3 className="text-[#17120F]" style={cardHeadingTypography}>
                  {title}
                </h3>
                <p className="mt-4 text-[#6D625C]" style={bodyTypography}>
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RestaurentGuestExperience;
