import Image from "next/image";
import type { StaticImageData } from "next/image";
import service1 from "@/assets/images/plumber/service1.webp";
import service2 from "@/assets/images/plumber/service2.webp";
import service3 from "@/assets/images/plumber/service3.webp";
import service4 from "@/assets/images/plumber/service4.webp";
import service5 from "@/assets/images/plumber/service5.webp";
import service6 from "@/assets/images/plumber/service6.webp";

/**
 * "Built for the Businesses That Keep Communities Running." — six trade cards.
 *
 * Each card is a photo under a gradient that is opaque at the bottom, where the labels
 * sit, and fully transparent at the top. On hover that gradient swaps from black to the
 * lime accent and the labels invert to dark ink.
 *
 * The spec gives both gradient stops as the same hex with "0%" and "100%" — read as
 * opacity rather than position, since identical stops at either end would render flat.
 * The transparent end uses a zero-alpha version of the same hue rather than
 * `transparent`, which would drift through grey in some engines.
 */

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, -1.2px letter-spacing, centered.
// Only the desktop size is specced; the responsive steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Figma spec: Plus Jakarta Sans Medium 18px / 28px, zero letter-spacing, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Medium 18px / 16px, zero letter-spacing, #B6D500.
const cardSubtitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 24px / 22.5px, zero letter-spacing, #F7F8F3.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

const cards: {
  image: StaticImageData;
  subtitle: string;
  title: string;
  alt: string;
}[] = [
  {
    image: service1,
    subtitle: "Service management & booking",
    title: "Plumbing Companies",
    alt: "Plumber fitting a pipe under a kitchen sink",
  },
  {
    image: service2,
    subtitle: "Project tracking & estimates",
    title: "Electrical Contractors",
    alt: "Electrician testing a consumer unit with a multimeter",
  },
  {
    image: service3,
    subtitle: "Dispatch, scheduling & portals",
    title: "AC & Heating / HVAC Teams",
    alt: "Engineer servicing an outdoor air-conditioning condenser",
  },
  {
    image: service4,
    subtitle: "End-to-end project management",
    title: "Construction & Development",
    alt: "Mechanic working on a car brake assembly",
  },
  {
    image: service5,
    subtitle: "Lead capture & communication",
    title: "General Repair & Handyman",
    alt: "Handyman levelling a floating shelf on a wall",
  },
  {
    image: service6,
    subtitle: "Digital presence & CRM",
    title: "Roofing & Specialty Trades",
    alt: "Roofer in a harness working on shingles",
  },
];

const PlumberServices = () => {
  return (
    <section id="services" className="w-full scroll-mt-[110px] bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on row one, so the rows cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-[#17120F]">Built for the Businesses That </span>
            <span className="text-[#B6D500]">Keep</span>
          </span>
          <span className="block text-[#B6D500]">Communities Running.</span>
        </h2>

        {/* 20px title -> paragraph, 60px paragraph -> cards, per spec. */}
        <p
          className="mx-auto mt-5 max-w-[880px] text-center text-[#17120F]"
          style={introTypography}
        >
          Every trade operates differently. That is why we shape each solution
          around your services, customer journey, team size, and growth goals.
        </p>

        <ul className="mt-[60px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ image, subtitle, title, alt }) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-[16px]"
            >
              {/* Intrinsic size is 424x400; the card stretches to its grid track and the
                  photo covers it, so all six stay the same height. */}
              <Image
                src={image}
                alt={alt}
                className="aspect-[424/400] w-full object-cover"
                sizes="(min-width: 1024px) 424px, (min-width: 640px) 50vw, 100vw"
              />

              {/* Wash: black at rest, accent on hover. Both run bottom-up. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#000000] to-[#00000000] transition-opacity duration-300 group-hover:opacity-0"
              />
              <div
                aria-hidden="true"
                className="absolute top-45 inset-0 bg-gradient-to-t from-[#B6D500] to-[#B6D50000] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="absolute inset-x-0 bottom-0 p-[30px]">
                {/* Labels invert to dark ink on the lime wash, which the resting
                    colours would be unreadable against. */}
                <p
                  className="text-[#B6D500] transition-colors duration-300 group-hover:text-[#101311]"
                  style={cardSubtitleTypography}
                >
                  {subtitle}
                </p>
                {/* h3: nested under this section's h2. */}
                <h3
                  className="mt-4 text-[#F7F8F3] transition-colors duration-300 group-hover:text-[#101311]"
                  style={cardTitleTypography}
                >
                  {title}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PlumberServices;
