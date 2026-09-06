import Image from "next/image";

/**
 * "Built for Every Stage or Food Business" — six audience cards.
 *
 * Card images live in `public/` rather than `src/assets/`, which is where they were
 * supplied, so they are referenced by path and need their intrinsic size declared.
 */
const IMAGE_WIDTH = 201;
const IMAGE_HEIGHT = 161;

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, zero letter-spacing, centered,
// #0F1A1A. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 26.4px, zero letter-spacing, centered,
// #6D625C.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.4px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 18px / 24px, zero letter-spacing, #17120F.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

/**
 * Titles carry the hard line break from the Figma frame: each card's label sits on two
 * lines, and letting them wrap freely would break them at different points as the grid
 * track width changes.
 */
const cards = [
  { image: "food_business1", lines: ["Independent", "Restaurants"] },
  { image: "food_business2", lines: ["Cafés &", "Coffee Shops"] },
  { image: "food_business3", lines: ["Bakeries &", "Dessert Brands"] },
  { image: "food_business4", lines: ["Food Trucks &", "Takeaway"] },
  { image: "food_business5", lines: ["Cloud", "Kitchens"] },
  { image: "food_business6", lines: ["Franchises &", "Multi-Location"] },
];

const RestaurantFoodBusiness = () => {
  return (
    <section id="solutions" className="w-full scroll-mt-[110px] bg-[#FFF8F2] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0F1A1A] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Built for Every Stage or</span>
          <span className="block">Food Business</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[1000px] text-center text-[#6D625C]"
          style={introTypography}
        >
          Whether you are launching a new location, improving online ordering,
          building customer loyalty, or managing multiple branches, we create
          solutions around the way your business actually operates.
        </p>

        <ul className="mt-[60px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map(({ image, lines }) => (
            <li
              key={image}
              // `overflow-hidden` so the photo's top corners follow the card's radius —
              // the asset itself is square-cornered.
              className="overflow-hidden rounded-[10px] border border-[#DBD0CB] bg-white"
            >
              <Image
                src={`/images/restaurant/${image}.webp`}
                alt=""
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                aria-hidden="true"
                className="aspect-[201/161] w-full object-cover"
                sizes="(min-width: 1280px) 201px, (min-width: 640px) 50vw, 100vw"
              />

              {/* h3: nested under this section's h2. */}
              <h3
                className="px-[30px] py-4 text-[#17120F]"
                style={cardTitleTypography}
              >
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RestaurantFoodBusiness;
