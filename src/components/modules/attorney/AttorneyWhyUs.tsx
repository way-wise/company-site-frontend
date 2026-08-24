import sectionBg from "@/assets/images/attorney/development_team_section_bg.webp";
import midCard from "@/assets/images/attorney/mid_card_img.webp";
import avatar from "@/assets/images/attorney/xs.png";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";
import Image from "next/image";

/**
 * Section 9 — "More Than a Development Team".
 *
 * Five cards in three columns: two stacked left, one full-height centre, two stacked
 * right. The centre card IS `mid_card_img` — its pink gradient, rounded corners and
 * laptop illustration are all baked into that one 454x545 asset, so it is painted as
 * the card's background and only the copy is layered on top.
 */

// Figma spec: Rajdhani SemiBold 24px / 52.8px, -0.8px letter-spacing.
// The line-height is intentionally far larger than the font size — that generous
// leading is what creates the space between each card's title and its figure.
const cardHeadTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "24px",
  lineHeight: "52.8px",
  letterSpacing: "-0.8px",
} as const;

// Figma spec: Rajdhani Bold 48px / 52.8px, -0.8px letter-spacing.
const cardNumberTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "48px",
  lineHeight: "52.8px",
  letterSpacing: "-0.8px",
} as const;

// Figma spec: Inter Regular 16px / 20px, zero letter-spacing.
const cardParagraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

const AVATAR_CAPTION = "Join 15,145+ others loving worldwide customers";

/**
 * Card shell. The pink hairline in the design is a gradient border, done with a 1px
 * gradient-filled wrapper around a solid inner panel — a plain `border` colour can't
 * fade along an edge.
 */
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="rounded-xl bg-[#150C2B]/20 p-px">
    <div className={`h-full rounded-xl border border-[#C41E3A]/50  p-7 ${className ?? ""}`}>
      {children}
    </div>
  </div>
);

const Star = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.0662 8.58246L15.1317 12.0162L16.3103 17.1284C16.3727 17.3957 16.3549 17.6754 16.2592 17.9326C16.1634 18.1898 15.994 18.4131 15.7721 18.5745C15.5501 18.7359 15.2855 18.8283 15.0114 18.8402C14.7372 18.8521 14.4656 18.7828 14.2305 18.6412L9.77173 15.9368L5.32251 18.6412C5.08746 18.7828 4.81587 18.8521 4.54169 18.8402C4.26751 18.8283 4.00291 18.7359 3.78098 18.5745C3.55904 18.4131 3.38961 18.1898 3.29388 17.9326C3.19814 17.6754 3.18035 17.3957 3.24271 17.1284L4.41958 12.0214L0.484199 8.58246C0.276053 8.40294 0.125542 8.16596 0.0515395 7.90124C-0.0224625 7.63653 -0.0166611 7.35585 0.0682163 7.09442C0.153094 6.83298 0.313269 6.60243 0.528655 6.43167C0.744041 6.2609 1.00505 6.15753 1.27895 6.13451L6.46622 5.68523L8.49105 0.855646C8.59679 0.602229 8.77514 0.385763 9.00366 0.233504C9.23217 0.0812446 9.50062 0 9.77522 0C10.0498 0 10.3183 0.0812446 10.5468 0.233504C10.7753 0.385763 10.9536 0.602229 11.0594 0.855646L13.0903 5.68523L18.2758 6.13451C18.5497 6.15753 18.8108 6.2609 19.0261 6.43167C19.2415 6.60243 19.4017 6.83298 19.4866 7.09442C19.5715 7.35585 19.5773 7.63653 19.5033 7.90124C19.4293 8.16596 19.2787 8.40294 19.0706 8.58246H19.0662Z"
      fill="#FDC700"
    />
  </svg>
);

/**
 * The four customer faces and the "+4" chip are a single 78x24 asset, so there is no
 * per-avatar markup here.
 */
const AvatarRow = () => (
  <div className="mt-6 flex max-w-[292px] items-center gap-4">
    {/* Decorative: the caption beside it already carries the meaning, so an alt here
        would just be read out twice. */}
    <Image src={avatar} alt="" className="h-6 w-auto shrink-0" />
    <p style={cardParagraphTypography} className="text-[#B8B8B8]">
      {AVATAR_CAPTION}
    </p>
  </div>
);

const AttorneyWhyUs = () => {
  return (
    <section
      className="bg-black"
      // Stretched, not `cover`: the artwork is 1920x745 but this section is taller, so
      // `cover` would crop ~245px off each side and lose the pink-left/blue-right
      // colour sweep that spans the full width of the frame.
      style={{
        backgroundImage: `url(${sectionBg.src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AttorneyContainer className="py-28">
        <AttorneySectionHeading
        headingClassName='!max-w-full'
          eyebrow="Why Way Wise Tech"
          heading="More Than a Development Team"
          description="We are a full-cycle digital product company that combines strategic thinking, design craft, and engineering excellence."
          descriptionClassName="max-w-225"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-10">
            <Card className="px-10 py-9">
              {/* Star rating pill */}
              <div className="inline-flex items-center gap-1 rounded-full bg-[#FB2A2A] px-5 my-2.5 py-2.5 text-[#FDC700]">
                {[0, 1, 2, 3, 4].map((index) => (
                  <Star key={index} />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4">
                <span
                  style={cardNumberTypography}
                  className="font-bold text-white"
                >
                  8.5k+
                </span>
                {/* h3: nested under this section's h2. */}
                <h3
                  style={cardHeadTypography}
                  className="font-semibold text-white"
                >
                  Satisfied Clients
                </h3>
              </div>

              <AvatarRow />
            </Card>

            <Card className="px-10 pb-10">
              <h3
                style={cardHeadTypography}
                className="font-semibold text-white"
              >
                Years Experience
              </h3>
              <p style={cardNumberTypography} className="font-bold text-white">
                8.5k+
              </p>
              <p
                style={cardParagraphTypography}
                className="mt-4 max-w-[292px] text-[#B8B8B8]"
              >
                Delivering trusted business expertise and innovative consulting
                solutions for lasting success
              </p>
            </Card>
          </div>

          {/* Centre card — the asset supplies the fill, corners and illustration. */}
          <div className="relative">
            <Image alt="" src={midCard} className="w-full" />
            <div className="flex flex-col rounded-xl px-8 pt-9 absolute top-0 left-0 w-full">
              <h3
                style={cardHeadTypography}
                className="font-semibold text-[#1A1A1A]"
              >
                Result- Oriented Delivery
              </h3>
              <p
                style={cardParagraphTypography}
                className="mt-1 max-w-[300px] text-[#3A3A3A]"
              >
                Our IT solutions focus on client needs, delivering results
                efficiently
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-10">
            <Card className="px-10 pb-10">
              <h3
                style={cardHeadTypography}
                className="font-semibold text-white"
              >
                Creativity Services
              </h3>
              <p style={cardNumberTypography} className="font-bold text-white">
                24/7
              </p>
              <p
                style={cardParagraphTypography}
                className="mt-4 text-[#B8B8B8] max-w-[280px]"
              >
                Our 24/7 Creativity Services are designed to keep your project
                at the forefront of innovation
              </p>
            </Card>

            <Card className="px-10 pb-10">
              <h3
                style={cardHeadTypography}
                className="font-semibold text-white"
              >
                Project deliver
              </h3>
              <p style={cardNumberTypography} className="font-bold text-white">
                250+
              </p>
              <AvatarRow />
            </Card>
          </div>
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyWhyUs;
