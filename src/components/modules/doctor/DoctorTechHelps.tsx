import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import doc from "@/assets/images/doctor/doc.webp";
import techHelps1 from "@/assets/images/doctor/techhelps1.webp";
import techHelps2 from "@/assets/images/doctor/techhelps2.webp";
import techHelps3 from "@/assets/images/doctor/techhelps3.webp";
import techHelpsIcon1 from "@/assets/images/doctor/techhelpsicon1.webp";
import techHelpsIcon2 from "@/assets/images/doctor/techhelpsicon2.webp";
import techHelpsIcon3 from "@/assets/images/doctor/techhelpsicon3.webp";

/**
 * "Technology That Helps Healthcare Practices Grow" — photo on the left, copy plus three
 * stat cards on the right.
 *
 * NOTE ON LEADING: as elsewhere on this page, the specced `line-height: 100%` is applied
 * to single-line items and replaced with real leading on the blocks that wrap, where
 * 100% would collide the lines.
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

// Figma spec: Urbanist Medium 18px, zero letter-spacing. Wraps to two lines, so it gets
// real leading rather than the specced 100%.
const overlayTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Montserrat Bold 32px / 100%, zero letter-spacing.
const statNumberTypography = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontWeight: 700,
  fontSize: "32px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Montserrat Medium 18px / 100%, zero letter-spacing.
const statLabelTypography = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontWeight: 500,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 16px / 100%, zero letter-spacing, white.
const buttonTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

/**
 * Each card is a photo under a one-colour gradient that goes solid at the bottom (where
 * the number sits) and fully transparent at the top (where the photo shows through).
 * The `00` suffix on the second stop is a zero-alpha version of the same hue — fading to
 * `transparent` instead would drift through grey in some engines.
 */
const stats = [
  {
    image: techHelps1,
    icon: techHelpsIcon1,
    number: "99.9%",
    label: "Secure",
    alt: "Row of servers in a data centre",
    // Card 1 keeps the dark ink; only cards 2 and 3 invert to white.
    gradient: "bg-gradient-to-t from-[#E5ECFD] to-[#E5ECFD00]",
    numberClass: "text-[#3191EA]",
    labelClass: "text-[#011139]",
  },
  {
    image: techHelps2,
    icon: techHelpsIcon2,
    number: "500+",
    label: "Doctors & Clinics",
    alt: "Modern medical office building",
    gradient: "bg-gradient-to-t from-[#3191EA] to-[#3191EA00]",
    numberClass: "text-white",
    labelClass: "text-white",
  },
  {
    image: techHelps3,
    icon: techHelpsIcon3,
    number: "24/7",
    label: "Support",
    alt: "Support agent wearing a headset",
    gradient: "bg-gradient-to-t from-[#011139] to-[#01113900]",
    numberClass: "text-white",
    labelClass: "text-white",
  },
];

const DoctorTechHelps = () => {
  return (
    <section id="services" className="w-full scroll-mt-[130px] bg-white px-4">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 py-16 lg:grid-cols-[513fr_774fr] lg:gap-8 lg:py-[100px]">
        {/* Photo column */}
        <div className="relative overflow-hidden rounded-[20px]">
          {/* Intrinsic size is 516x640; width/height come from the static import, so
              only the rendered width is set here and the height follows. */}
          <Image
            src={doc}
            alt="Doctor in a white coat and stethoscope smiling while working at a laptop"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 513px, 100vw"
          />

          {/* White overlay card. Figma spec: radius 20px, padding 20/50/25/25. */}
          <div className="absolute inset-x-5 bottom-5 flex items-center gap-5 rounded-[20px] bg-white pt-[25px] pr-[50px] pb-[25px] pl-5">
            {/* Figma spec: 60x60. No asset was supplied for this one, unlike the three
                card icons, so it is composed from a lucide glyph on a tinted tile. */}
            <span
              className="flex size-[60px] shrink-0 items-center justify-center rounded-[12px] bg-[#E8F1FE]"
              aria-hidden="true"
            >
              <ShieldCheck className="size-7 text-[#3191EA]" />
            </span>

            <p
              className="leading-[1.4] text-[#011139]"
              style={overlayTypography}
            >
              Compassionate Care you can trust, every step of the way.
            </p>
          </div>
        </div>

        {/* Copy column */}
        <div>
          <h2
            className="text-[30px] leading-[1.15] sm:text-[40px] lg:text-[52px]"
            style={titleTypography}
          >
            {/* Hard break reproduced from the Figma frame: the colour split falls
                mid-line on row two, so the rows cannot be left to wrap freely. */}
            <span className="block text-[#011139]">Technology That Helps</span>
            <span className="block">
              <span className="text-[#3191EA]">Healthcare Practices</span>
              <span className="text-[#011139]"> Grow</span>
            </span>
          </h2>

          <p
            className="mt-6 max-w-[630px] leading-[1.4] text-[#4B5563]"
            style={introTypography}
          >
            We help doctors, dentists, clinics, and healthcare organizations
            create smarter digital experiences—from professional websites and
            patient engagement tools to secure, scalable practice management
            platforms.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="relative overflow-hidden rounded-[20px]"
              >
                {/* Intrinsic size is 245x315; the card stretches to the column track and
                    the photo covers it, so the three stay the same height. */}
                <Image
                  src={stat.image}
                  alt={stat.alt}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 640px) 242px, 100vw"
                />

                <div
                  className={`absolute inset-0 ${stat.gradient}`}
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <Image
                    src={stat.icon}
                    alt=""
                    className="size-[60px]"
                    aria-hidden="true"
                  />

                  <div>
                    <p
                      className={stat.numberClass}
                      style={statNumberTypography}
                    >
                      {stat.number}
                    </p>
                    <p
                      className={`mt-2 text-[18px] lg:text-[14px] xl:text-[18px] ${stat.labelClass}`}
                      style={statLabelTypography}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/contact-us"
            style={buttonTypography}
            className="mt-8 inline-flex items-center gap-5 rounded-[60px] bg-[#3191EA] px-[31px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#1f7fd4]"
          >
            Get Started
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorTechHelps;
