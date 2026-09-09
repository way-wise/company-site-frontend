import Image from "next/image";
import type { StaticImageData } from "next/image";
import card1 from "@/assets/images/ecommerce/industries1.webp";
import card2 from "@/assets/images/ecommerce/industries2.webp";
import card3 from "@/assets/images/ecommerce/industries3.webp";
import card4 from "@/assets/images/ecommerce/industries4.webp";
import card5 from "@/assets/images/ecommerce/industries5.webp";
import card6 from "@/assets/images/ecommerce/industries6.webp";

// Figma spec: Outfit Medium 14px / 16px, 1.2px letter-spacing, #A07B62.
const eyebrowTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "1.44px",
} as const;

// Figma spec: Outfit Bold 64px, line-height 100%, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 64px
// overflows a phone viewport.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 20px / 30px, zero letter-spacing, white at 70%.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const CardtitleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
  fontSize: "20px",
  lineHeight: "24px",
} as const;

const CardParagrapTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;
const badgeTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const items: {
  title: string;
  desp: string;
  badge: string;
  image: StaticImageData;
  alt: string;
}[] = [
  {
    title: "Retail Stores & Local Shops",
    desp: "Build a stronger brand presence and deliver a better customer experience online and in-store.",
    badge: "In-Store & Digital",
    image: card1,
    alt: "Shopkeeper serving a customer at a card reader on the counter",
  },
  {
    title: "Fashion & Lifestyle Brands",
    desp: "Create premium shopping experiences that showcase products and turn visitors into customers.",
    badge: "Fashion & Style",
    image: card2,
    alt: "Stylist dressing a mannequin on a boutique shop floor",
  },
  {
    title: "Grocery & Specialty Stores",
    desp: "Make products easier to discover, order, and manage across every sales channel.",
    badge: "Food & Grocery",
    image: card3,
    alt: "Grocer arranging fresh produce while a shopper fills a basket",
  },
  {
    title: "Wholesale & B2B Suppliers",
    desp: "Simplify product access, customer accounts, order workflows, and repeat purchasing.",
    badge: "Wholesale & B2B",
    image: card4,
    alt: "Two warehouse staff in hi-vis reviewing a tablet between stocked pallet racks",
  },
  {
    title: "Home, Furniture & Décor",
    desp: "Present product collections beautifully while making ordering and customer communication simple.",
    badge: "Home & Décor",
    image: card5,
    alt: "Sales assistant showing a catalogue to a couple in a furniture showroom",
  },
  {
    title: "Multi-Location Retailers",
    desp: "Connect locations, inventory, orders, customer data, and reporting in one clear system.",
    badge: "Multi-Location",
    image: card6,
    alt: "Two managers reviewing a multi-store performance dashboard on a large display",
  },
];

const EcommerceIndustries = () => {
  return (
    <section id="industries" className="scroll-mt-[110px] bg-[#F7FAFC] px-4">
      {/* 1420px, matching the navbar. */}
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">
        <div className="max-w-[768px] mx-auto text-center">
          <h3 style={eyebrowTypography} className="text-[#A07B62] pb-4">
            BUILT FOR MODERN RETAIL BUSINESSES
          </h3>
          <h2
            style={titleTypography}
            className="text-[30px] md:text-[48px] text-[#1E130A] leading-10 md:leading-12.5 pb-4"
          >
            Built for the Businesses That Keep Customers Coming Back.
          </h2>
          <p style={paragraphTypography} className="text-[#5F6B7A]">
            Practical digital solutions for retailers ready to improve how they
            sell, serve, manage, and grow.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, desp, badge, image, alt }) => (
            <li key={title} className="relative flex flex-col rounded-2xl">
              {/* Intrinsic size is 460x260; the card stretches to its grid track and the
                  photo covers it, so all six stay the same height. */}
              <Image
                src={image}
                alt={alt}
                className="aspect-[460/260] w-full rounded-t-2xl object-cover"
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw"
              />
              <div
                className="absolute top-2 left-2 rounded-3xl bg-[rgba(160,123,98,0.85)] px-2.5 py-1 text-white"
                style={badgeTypography}
              >
                {badge}
              </div>
              {/* `flex-1` so the white panel absorbs the height difference when one
                  card's copy runs longer, keeping all six bottoms aligned. */}
              <div className="flex-1 rounded-b-2xl border border-t-0 border-[#DDE6F2] bg-white p-6">
                <h3 style={CardtitleTypography} className="pb-3 text-[#1E130A]">
                  {title}
                </h3>
                <p style={CardParagrapTypography} className="text-[#48566A]">
                  {desp}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EcommerceIndustries;
