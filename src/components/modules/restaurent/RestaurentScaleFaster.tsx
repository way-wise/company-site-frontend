import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

/**
 * "Scale Faster with AI Powered Digital Solutions" — copy on the left, a photo with an
 * overlaid rating pill and two stat cards on the right.
 *
 * Assets live in `public/` rather than `src/assets/`, which is where they were supplied,
 * so they are referenced by path and need their intrinsic sizes declared.
 */
const PHOTO = "/images/restaurent/scale_faster.webp";
const PHOTO_WIDTH = 540;
const PHOTO_HEIGHT = 400;

const REVIEWERS = "/images/restaurent/reviewers.webp";
const REVIEWERS_WIDTH = 98;
const REVIEWERS_HEIGHT = 26;

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, zero letter-spacing.
// Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 30px, zero letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Matches the banner CTAs, as requested: Plus Jakarta Sans SemiBold 16px / 100%.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Poppins SemiBold 20px / 23px, zero letter-spacing.
const ratingTypography = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "23px",
  letterSpacing: "0",
} as const;

// Figma spec: Poppins SemiBold 30px / 30px, zero letter-spacing, #E94222.
const statNumberTypography = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 600,
  fontSize: "30px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Poppins Regular 16px / 20px, zero letter-spacing, #E94222.
const statLabelTypography = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const stats = [
  {
    image: "/images/restaurent/ten.webp",
    width: 144,
    height: 135,
    number: "10+",
    label: "Years Experience",
  },
  {
    image: "/images/restaurent/happyclients.webp",
    width: 144,
    height: 136,
    number: "300+",
    label: "Happy Clients",
  },
];

const RestaurentScaleFaster = () => {
  return (
    <section id="why-us" className="w-full bg-[#16110E] px-4">
      {/* 540px right column: the photo's intrinsic width, so it renders unscaled. */}
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 py-10 lg:grid-cols-[1fr_540px] lg:gap-[60px] lg:py-[100px]">
        {/* Copy column */}
        <div>
          <h2
            className="text-[32px] leading-[1.2] text-white sm:text-[40px] lg:text-[48px] lg:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard break reproduced from the Figma frame. */}
            <span className="block">Scale Faster with AI Powered</span>
            <span className="block">Digital Solutions</span>
          </h2>

          {/* No colour was specced for the copy on this dark ground; the heading reads
              pure white in the frame and the paragraph visibly dimmer. */}
          <p className="mt-[30px] text-white/80" style={paragraphTypography}>
            We partner with product owners and founders by developing products
            from scratch or growing the existing product
          </p>

          {/* Same pair as the banner, per the spec. The outline variant's padding is
              inset by 1.5px so its 1.5px border does not make it 3px taller. */}
          <div className="mt-[30px] flex flex-wrap items-center gap-5">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#E94222] px-[30px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#cf3517]"
            >
              Book a Free Consultation
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="#our-work"
              style={buttonTypography}
              className="inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#E94222] px-[28.5px] py-[14.5px] whitespace-nowrap text-[#E94222] transition-colors duration-200 hover:bg-[#E94222] hover:text-white"
            >
              View Our Work
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Visual column */}
        <div className="w-full max-w-[540px] justify-self-center lg:justify-self-end">
          <div className="relative">
            <Image
              src={PHOTO}
              alt="Restaurant owner smiling in his dining room"
              width={PHOTO_WIDTH}
              height={PHOTO_HEIGHT}
              className="aspect-[540/400] w-full rounded-[10px] object-cover"
              sizes="(min-width: 1024px) 540px, 100vw"
            />

            {/* Rating pill, overlapping the photo's bottom-right corner. Two rows: the
                stacked avatars above, stars and score below. */}
            <div className="absolute right-5 bottom-6 flex flex-col gap-2 rounded-[10px] bg-[#E94222] px-4 py-3">
              {/* The overlap, the white rings and the trailing "+" are all baked into
                  the asset, so it renders at its intrinsic 98x26 as one image. */}
              <Image
                src={REVIEWERS}
                alt=""
                // Required: a string src carries no intrinsic size, so next/image
                // throws without an explicit width and height.
                width={REVIEWERS_WIDTH}
                height={REVIEWERS_HEIGHT}
                aria-hidden="true"
                className="h-[26px]"
              />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-white" style={ratingTypography}>
                  5.0
                </span>
                <span className="sr-only">Rated 5.0 out of 5</span>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {stats.map(({ image, width, height, number, label }) => (
              <li
                key={label}
                className="flex justify-center sm:justify-normal items-center gap-3 rounded-[10px] bg-[#FFE0D1] px-4 py-3"
              >
                {/* Supplied at 2x (144px) and rendered at 64px. */}
                <Image
                  src={image}
                  alt=""
                  width={width}
                  height={height}
                  aria-hidden="true"
                  className="size-16 shrink-0 object-contain"
                />
                <div>
                  <p className="text-[#E94222]" style={statNumberTypography}>
                    {number}
                  </p>
                  <p
                    className="mt-1 text-[#E94222]"
                    style={statLabelTypography}
                  >
                    {label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RestaurentScaleFaster;
