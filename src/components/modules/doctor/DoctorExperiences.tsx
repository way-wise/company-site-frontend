import Image from "next/image";
import type { StaticImageData } from "next/image";
import centerCard from "@/assets/images/doctor/experience_center_card.webp";
import icon1 from "@/assets/images/doctor/experience_icon1.webp";
import icon2 from "@/assets/images/doctor/experience_icon2.webp";
import icon3 from "@/assets/images/doctor/experience_icon3.webp";
import icon4 from "@/assets/images/doctor/experience_icon4.webp";

/**
 * "Better Patient Experiences. Less Work Behind the Scenes." — four feature cards in
 * two columns around a full-height photo card in the middle.
 *
 * NOTE ON LEADING: as elsewhere on this page, the specced `line-height: 100%` is applied
 * to single-line items and replaced with real leading on the blocks that wrap.
 */

// Section title — same ramp as the other sections: Urbanist Bold 52px, zero
// letter-spacing. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Section paragraph — same ramp as the other sections: Urbanist Medium 18px.
const introTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 16px / 22px, zero letter-spacing, #011139.
// This one ships with real leading already, so it is used verbatim.
const tileTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 18px / 100%, zero letter-spacing.
const cardTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 16px / 24px, zero letter-spacing.
const cardBodyTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const cards: {
  icon: StaticImageData;
  tileTitle: string;
  title: string;
  body: string;
}[] = [
  {
    icon: icon1,
    tileTitle: "Better Communication",
    title: "Patient Messaging & Reminders",
    body: "Keep patients informed with automated reminders, messaging, and portals.",
  },
  {
    icon: icon2,
    tileTitle: "Patient Reviews & Ratings",
    title: "Stronger Online Reputation",
    body: "Collect and showcase patient reviews that build trust at first glance.",
  },
  {
    icon: icon3,
    tileTitle: "Practice Automation Workflow",
    title: "Less Administrative Work",
    body: "Automate intake, billing, and scheduling so your team can focus on care.",
  },
  {
    icon: icon4,
    tileTitle: "Smart Scheduling Calendar",
    title: "Easy Appointment Management",
    body: "Real-time scheduling, cancellations, and follow-ups managed from one place.",
  },
];

/**
 * One feature card: a white tile carrying the icon and its label, sitting on two
 * translucent layers that peek out below it as a card-stack, then the heading and body.
 */
const FeatureCard = ({ card }: { card: (typeof cards)[number] }) => (
  <li className="rounded-[20px] bg-[#4A9EED] p-10 lg:p-6 xl:p-10">
    {/* The two stack layers are painted before the tile and left in flow order, so the
        tile covers them and only their bottom edges show. */}
    <div className="relative xl:mx-[38px] w-full xl:w-auto">
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-3 h-3.5 rounded-b-[16px] bg-white/60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-6.5 h-3.5 rounded-b-[16px] bg-white/50"
      />
      <div className="relative flex items-center gap-[30px] rounded-[16px] bg-white px-[27px] py-[30px]">
        <Image
          src={card.icon}
          alt=""
          className="size-[60px] shrink-0"
          aria-hidden="true"
        />
        <span className="text-[#011139]" style={tileTitleTypography}>
          {card.tileTitle}
        </span>
      </div>
    </div>

    {/* h3: nested under this section's h2. mt clears the stack layers below the tile. */}
    <h3 className="mt-12 text-white" style={cardTitleTypography}>
      {card.title}
    </h3>
    <p className="mt-3 text-[#DDE9F4]" style={cardBodyTypography}>
      {card.body}
    </p>
  </li>
);

const DoctorExperiences = () => {
  return (
    <section className="w-full bg-[#3191EA] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.15] text-white sm:text-[40px] lg:text-[52px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Better Patient Experiences.</span>
          <span className="block">Less Work Behind the Scenes.</span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-[620px] text-center leading-[1.4] text-[#DDE9F4]"
          style={introTypography}
        >
          Give patients a modern, convenient experience while giving your team
          the tools to manage operations more efficiently.
        </p>

        {/*
          DOM order is visual reading order — top-left, centre, top-right, bottom-left,
          bottom-right — and auto-placement does the rest: the centre card spans both
          rows of column 2, so the two bottom cards fall either side of it.
        */}
        <ul className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard card={cards[0]} />

          <li className="relative min-h-[520px] overflow-hidden rounded-[20px] bg-white lg:row-span-2 lg:min-h-0 hidden lg:block">
            {/* `fill` rather than an in-flow image: the card's height comes from the two
                stacked cards beside it, and the photo has to cover whatever that is. */}
            <Image
              src={centerCard}
              alt="Doctor in a white coat holding a tablet, with a DNA helix behind her"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 426px, 100vw"
            />

            {/* The asset is deliberately near-white at the top, which is what makes this
                dark text legible without a scrim. */}
            <div className="absolute inset-x-10 top-10">
              <h3 className="text-[#011139]" style={cardTitleTypography}>
                More Patient Appointments
              </h3>
              <p className="mt-4 text-[#4B5563]" style={cardBodyTypography}>
                Make it effortless for patients to discover, book, and return to
                your practice.
              </p>
            </div>
          </li>

          <FeatureCard card={cards[1]} />
          <FeatureCard card={cards[2]} />
          <FeatureCard card={cards[3]} />
        </ul>
      </div>
    </section>
  );
};

export default DoctorExperiences;
