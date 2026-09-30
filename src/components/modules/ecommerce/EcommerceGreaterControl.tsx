import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import controlImage from "@/assets/images/ecommerce/greatercontrol.webp";
import EcommercePlayButton from "./EcommercePlayButton";

/**
 * "Run Your Retail Business With Greater Control." — copy and benefit list on the left,
 * photo on the right.
 *
 * Unlike the banner's collage, this asset is the bare photograph: the "OPERATIONS STATUS"
 * card is NOT baked in, so it is built as markup below and its text stays selectable and
 * translatable. Its three lines each use a different face — Outfit, Plus Jakarta Sans and
 * Inter — which is what the spec gives, not an oversight.
 *
 * The photo is a static import from `src/assets/`, so next/image reads its intrinsic
 * 680x525 size and no width/height is declared by hand.
 */

// Figma spec: Outfit SemiBold 48px / 48px, zero letter-spacing, #1E130A.
// Only the desktop size is specced; the steps below it are mine — 48px overflows a phone
// viewport.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 30px, zero letter-spacing, #5F6B7A.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 16px / 20px, zero letter-spacing, #1E130A.
const pointTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Medium 16px / 20px, zero letter-spacing, centered.
const buttonTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Medium 16px / 16px, zero letter-spacing, #A07B62.
const cardLabelTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "16px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 16px / 20px, zero letter-spacing, #1E130A.
const cardHeadlineTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 14px / 16px, zero letter-spacing, #5F6B7A. Inter comes from
// the ROOT layout, which puts --font-inter on <body>.
const cardMetaTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "16px",
  letterSpacing: "0",
} as const;

const points = [
  "Know what’s selling and where your business needs attention.",
  "Keep orders and inventory easier to manage.",
  "Improve communication with customers",
  "Connect your retail operations through a unified digital system.",
];

const EcommerceGreaterControl = () => {
  return (
    <section id="about" className="w-full bg-[#F7FAFC] px-4">
      {/* 1420px, matching the navbar. Two 680px columns plus the 60px gutter is exactly
          that width, so the photo renders at its intrinsic size. */}
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-12 py-10 xl:grid-cols-2 lg:gap-[60px] lg:py-[100px]">
        {/* Copy column */}
        <div>
          {/* Left to wrap inside the 680px column, which is what puts the break after
              "With" as the frame does — no hard line break needed. */}
          <h2
            style={titleTypography}
            className="text-[30px] leading-[1.1] text-[#1E130A] sm:text-[40px] lg:text-[48px] lg:leading-14"
          >
            Why Retail and eCommerce Businesses Choose Way-Wise Tech to Sell and Scale Smarter
          </h2>

          <p style={paragraphTypography} className="mt-6 text-[#5F6B7A]">
            Stop managing important tasks across disconnected tools,
            spreadsheets, and manual follow-ups. Way-wise tech brings your
            online store, customer communication, inventory, orders, and
            business insights into a clearer, more manageable workflow.
          </p>

          <ul className="mt-6 flex flex-col gap-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-[#A07B62]"
                  aria-hidden="true"
                >
                  <Check className="size-3 text-white" />
                </span>
                <span style={pointTypography} className="text-[#1E130A]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center rounded-[10px] bg-[#A07B62] px-5 py-3 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#8a684f]"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>

        {/* Visual column. `relative` anchors the status card; the wrapper is width-capped
            rather than the image so the card tracks the photo's real edges. */}
        <div className="relative mx-auto w-full max-w-[680px] lg:justify-self-end">
          <Image
            src={controlImage}
            alt="Shop assistant handing a card reader to a customer paying by phone at the counter"
            className="h-auto w-full rounded-[16px]"
            sizes="(min-width: 1024px) 680px, 100vw"
          />

          {/* Play button centred on the photo, with the accent-brown triangle. */}
          {/* <EcommercePlayButton size="md" iconClassName="text-[#A07B62]" /> */}

          {/* Overlay card. Not baked into the asset, so it is real text. `max-w` keeps it
              inside the photo on narrow viewports. */}
          <div className="absolute bottom-5 hidden sm:block left-6 max-w-[calc(100%-3rem)] rounded-[12px] bg-white/95 px-4 py-3 shadow-[0_8px_24px_rgba(30,19,10,0.12)]">
            <p style={cardLabelTypography} className="text-[#A07B62]">
              OPERATIONS STATUS
            </p>
            <p style={cardHeadlineTypography} className="mt-2 text-[#1E130A]">
              All systems synced
            </p>
            <p style={cardMetaTypography} className="mt-2 text-[#5F6B7A]">
              Inventory &middot; Orders &middot; CRM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcommerceGreaterControl;
