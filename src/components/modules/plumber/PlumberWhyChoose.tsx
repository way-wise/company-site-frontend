import Image from "next/image";
import type { StaticImageData } from "next/image";
import icon1 from "@/assets/images/plumber/1.webp";
import icon2 from "@/assets/images/plumber/2.webp";
import icon3 from "@/assets/images/plumber/3.webp";
import icon4 from "@/assets/images/plumber/4.webp";
import aboutImage from "@/assets/images/plumber/about_img.png";
import PlumberPlayButton from "./PlumberPlayButton";

/**
 * "Your Crew Works in the Field. Your Business Should Work Everywhere." — four benefit
 * cards.
 *
 * Icons are the supplied 48x48 assets, static imports from `src/assets/`, so next/image
 * reads their intrinsic size and no width/height is declared by hand. They are dark
 * marks on transparent ground, which is what lets them sit on the lime tile.
 */

// Same ramp as the services section, as requested: Plus Jakarta Sans ExtraBold
// 48px / 60px, -1.2px letter-spacing, centered. Only the desktop size is specced; the
// steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the services section: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 24px / 32px, 0.3px letter-spacing, uppercase,
// #101311.
const cardTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "32px",
  letterSpacing: "0.3px",
} as const;
const cardNumTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "32px",
  letterSpacing: "0.3px",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 26px, zero letter-spacing, #101311.
const cardBodyTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;


// Figma spec: Plus Jakarta Sans Medium 18px / 26px, zero letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const cards: { num: number; title: string; body: string }[] = [
  {
    num: 1,
    title: "Capture More Leads",
    body: "Turn website visits, calls, and inquiries into booked jobs with a smoother customer journey.",
  },
  {
    num: 2,
    title: "Manage Jobs More Clearly",
    body: "Organize customers, estimates, tasks, and job details in one place for a more manageable workflow.",
  },
  {
    num: 3,
    title: "Improve Client Experience",
    body: "Simplify service requests, appointment updates, and approvals to keep customers informed and satisfied.",
  },
  {
    num: 4,
    title: "Give Your Team Better Visibility",
    body: "Keep office staff and field teams connected with clearer communication and real-time job visibility.",
  },
];

const paragraphs = [
  "Managing a service business takes more than completing jobs. From scheduling and customer communication to team coordination and follow-ups, Way-Wise Tech brings your entire operation into one connected digital ecosystem.",
];

const PlumberWhyChoose = () => {
  return (
    <section id="about" className="w-full scroll-mt-[110px] bg-[#ECEEE2] px-4">
      {/* 1420px, matching the navbar and banner — wider than the 1320 the services
          section uses, per this frame. */}
      <div className="mx-auto w-full max-w-[1420px] py-10 lg:py-[100px]">

        <div className="grid lg:grid-cols-2 gap-15">
            <div>
              <div>
                <h2
                  className="text-[30px] pr-10 leading-[1.2] text-[#101311] sm:text-[38px] xl:text-[48px] xl:leading-[60px]"
                  style={titleTypography}
                >
                  {/* Hard breaks reproduced from the Figma frame. */}
                  <span className="block">Why Service Businesses Rely on Way-Wise Tech to Work Smarter and Grow Faster</span>
                </h2>

                {/* No colour specced for the body copy; it reads a muted grey against the
                    near-black heading in the frame. */}
                <div className="mt-5 flex max-w-[670px] flex-col gap-6">
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

            {/* Video teaser under the paragraph: photo with the shared play button
                centred on it. */}
            <div className="relative mt-10 w-full max-w-[670px] overflow-hidden rounded-[16px]">
              <Image
                src={aboutImage}
                alt="Technician reviewing job details on a tablet while two colleagues load equipment from a service van"
                className="h-auto w-full"
                sizes="(min-width: 1024px) 670px, 100vw"
              />
              {/* <PlumberPlayButton size="md" /> */}
            </div>
            </div>

            <div>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {cards.map(({ num, title, body }) => (
                  <li key={title} className="rounded-[16px] bg-white p-4 xl:p-8">
                    <span
                      className="flex size-[70px] items-center justify-center font- rounded-[16px] bg-[#B6D500]"
                      aria-hidden="true" style={cardNumTypography}
                    >
                      {/* Supplied at 48x48 and rendered at that size. Decorative: the card
                          heading already names the benefit. */}
                      {num}
                    </span>

                    {/* h3: nested under this section's h2. Uppercased in CSS rather than in
                        the data, so the accessible name keeps its normal casing. */}
                    <h3
                      className="mt-7.5 pr-0.5 text-[#101311] uppercase"
                      style={cardTitleTypography}
                    >
                      {title}
                    </h3>
                    <p className="mt-5 text-[#101311]" style={cardBodyTypography}>
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            
            </div>
        </div>
      </div>
    </section>
  );
};

export default PlumberWhyChoose;
