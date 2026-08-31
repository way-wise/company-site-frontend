import Image from "next/image";
import { CodeXml, Layers, Search, Sparkle, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import doctor from "@/assets/images/doctor/doctor.webp";

/**
 * "Technology that feels simple" — an oval portrait beside two staggered card columns.
 *
 * The icons are lucide components rather than supplied assets: the spec gives the glyph
 * colour (#3191EA) and tile fill (#E9F4FD) as CSS values, which only makes sense for
 * vector icons. Picked to match the Figma artwork — swap them if the design uses a
 * specific icon set.
 */

// Figma spec: Urbanist Bold 48px / 60px, zero letter-spacing, #0C2F25.
// Note this is 48/60, not the 52/100% used by the other section headings.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 18px / 100%, zero letter-spacing, #4B5563. Wraps to two
// lines here, so it gets real leading rather than the specced 100%.
const introTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Manrope Medium 24px / 30px, -0.96px letter-spacing, #0C2F25.
const cardTitleTypography = {
  fontFamily: "var(--font-manrope), sans-serif",
  fontWeight: 500,
  fontSize: "24px",
  lineHeight: "30px",
  letterSpacing: "-0.96px",
} as const;

// Figma spec: Poppins Regular 16px / 24px, zero letter-spacing, #6E837D.
const cardBodyTypography = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

const cards: {
  Icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    Icon: Sparkle,
    title: "Modern UI/UX",
    body: "Clean, intuitive interfaces designed for patients and clinical teams alike.",
  },
  {
    Icon: Layers,
    title: "Secure Platform",
    body: "Enterprise-grade encryption and compliance built into every layer.",
  },
  {
    Icon: CodeXml,
    title: "AI Integration",
    body: "Smart automation for scheduling, reporting, and patient communications.",
  },
  {
    Icon: Users,
    title: "Mobile Friendly",
    body: "Pixel-perfect on every screen-phones, tablets, and desktops.",
  },
  {
    Icon: Search,
    title: "SEO Optimized",
    body: "Rank higher locally and appear where patients search for care.",
  },
  {
    Icon: Zap,
    title: "Fast Performance",
    body: "Sub-second load times that improve patient retention and search ranking.",
  },
];

const FeatureCard = ({ card }: { card: (typeof cards)[number] }) => {
  const { Icon, title, body } = card;

  return (
    <li
      // At rest every card is white; the #3191EA fill is a hover state. `group` lets the
      // tile and both text runs invert together off the card's own hover.
      // "card inner gap 40px" read as the card's padding.
      className="group rounded-[20px] border border-[#E6EAE9] bg-white p-10 transition-colors duration-200 hover:border-[#3191EA] hover:bg-[#3191EA]"
    >
      <span
        className="flex size-16 items-center justify-center rounded-[16px] bg-[#E9F4FD] transition-colors duration-200 group-hover:bg-white"
        aria-hidden="true"
      >
        {/* Glyph stays #3191EA in both states — the tile behind it is what changes. */}
        <Icon className="size-7 text-[#3191EA]" />
      </span>

      {/* h3: nested under this section's h2. */}
      <h3
        className="mt-10 text-[#0C2F25] transition-colors duration-200 group-hover:text-white"
        style={cardTitleTypography}
      >
        {title}
      </h3>
      <p
        className="mt-3 text-[#6E837D] transition-colors duration-200 group-hover:text-white/90"
        style={cardBodyTypography}
      >
        {body}
      </p>
    </li>
  );
};

const DoctorSimple = () => {
  return (
    <section id="why-us" className="w-full scroll-mt-[130px] bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        {/*
          Not a 50/50 split: the Figma frame gives the heading 635px against the
          paragraph's 542px. An even split leaves the heading ~628px, which is just
          under what "Technology that feels simple-" needs at 48px, so the first line
          wrapped.
        */}
        <div className="grid gap-8 lg:grid-cols-[640fr_542fr] lg:items-end lg:gap-[133px]">
          <h2
            // 48px only from xl up. Between lg and xl the container is still narrower
            // than 1320px, so the heading column cannot hold that size on one line.
            className="text-[32px] leading-[1.25] text-[#0C2F25] sm:text-[40px] lg:text-[40px] lg:leading-[52px] xl:text-[48px] xl:leading-[60px]"
            style={titleTypography}
          >
            {/* Hard breaks reproduced from the Figma frame. */}
            <span className="block">Technology that feels simple-</span>
            <span className="block">for your team and your</span>
            <span className="block">patients.</span>
          </h2>

          <p
            className="leading-[1.4] text-[#4B5563] lg:max-w-[540px] lg:justify-self-end"
            style={introTypography}
          >
            Working with us means a fundamentally different experience — one
            built on trust, expertise, and shared accountability for outcomes.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[546fr_720fr]  lg:gap-[55px]">
          {/* Portrait. The Figma frame crops it to an oval, which is a 50% radius on a
              non-square box — not a circle. */}
          <div className="mx-auto w-full max-w-[546px]">
            <Image
              src={doctor}
              alt="Doctor in a white coat and stethoscope smiling while working at a laptop"
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 546px, 100vw"
            />
          </div>

          {/*
            Two separate lists rather than one two-column grid: the columns are offset so
            the cards interleave, and a negative margin on alternating grid items would
            drag the following rows with it. Two lists also keeps the DOM valid — a <ul>
            may only contain <li>.

            The stagger pushes the LEFT column DOWN rather than lifting the right one up.
            A negative margin on the right column escaped this container and collided
            with the section paragraph above it.

            Offset is desktop-only; once stacked it would just read as misalignment.
          */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ul className="flex flex-col gap-6 md:mt-[88px]">
              <FeatureCard card={cards[0]} />
              <FeatureCard card={cards[2]} />
              <FeatureCard card={cards[4]} />
            </ul>
            <ul className="flex flex-col gap-6">
              <FeatureCard card={cards[1]} />
              <FeatureCard card={cards[3]} />
              <FeatureCard card={cards[5]} />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSimple;
