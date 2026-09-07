import Image from "next/image";
import businessControl from "@/assets/images/plumber/business_control.webp";

/**
 * "Run Your Service Business With Greater Control." — copy on the left, photo on the
 * right.
 *
 * The photo is a static import from `src/assets/`, so next/image reads its intrinsic
 * 729x548 size and no width/height is declared by hand.
 */

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, -0.9px letter-spacing, #101311.
// Note the tracking differs from the centred section headings on this page, which use
// -1.2px. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.9px",
} as const;

// Figma spec: Plus Jakarta Sans Medium 18px / 26px, zero letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const paragraphs = [
  "Connect your customers, bookings, estimates, technicians, payments, and daily operations through one centralized management system built around your workflow.",
  "Spend less time managing disconnected tools and more time delivering quality service, improving customer experiences, and growing your business.",
  "Ideal for: Plumbing, electrical, HVAC, roofing, automotive repair, and handyman businesses.",
];

const PlumberBusinessControl = () => {
  return (
    <section className="w-full bg-[#ECEEE2] px-4">
      {/* 729px right column is the asset's intrinsic width, so the photo renders
          unscaled at wide viewports. */}
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 py-10 lg:grid-cols-2 xl:grid-cols-[1fr_729px] lg:gap-[60px] lg:py-[100px]">
        {/* Copy column */}
        <div>
          <h2
            className="text-[30px] leading-[1.2] text-[#101311] sm:text-[38px] xl:text-[48px] xl:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard breaks reproduced from the Figma frame. */}
            <span className="block">Run Your Service</span>
            <span className="block">Business With Greater</span>
            <span className="block">Control.</span>
          </h2>

          {/* No colour specced for the body copy; it reads a muted grey against the
              near-black heading in the frame. */}
          <div className="mt-6 flex max-w-[560px] flex-col gap-6">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[#6D625C]"
                style={paragraphTypography}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Visual column */}
        <div className="justify-self-center lg:justify-self-end">
          <Image
            src={businessControl}
            alt="Technician reviewing job details on a tablet while two colleagues load equipment from a service van"
            className="h-auto w-full max-w-[729px] rounded-[16px]"
            sizes="(min-width: 1024px) 729px, 100vw"
          />
        </div>
      </div>
    </section>
  );
};

export default PlumberBusinessControl;
