import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/images/doctor/banner_right_image.webp";

/**
 * Banner / hero.
 *
 * The right-hand visual is a single flattened image: the doctor, the dashboard mockup
 * and all six floating labels ("Patient Management", "Billing & Invoicing", …) are baked
 * into the asset, so none of them are markup. That means the label text is not
 * selectable or translatable — noted to the user in case those should become real DOM.
 */

// Figma spec: Urbanist Bold 52px, line-height 100%, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 52px/100%
// overflows a phone viewport.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 18px / 28px, zero letter-spacing.
const paragraphTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 16px, line-height 100%, zero letter-spacing.
// Shared by both CTAs — they differ only in fill vs outline.
const buttonTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

const DoctorBanner = () => {
  return (
    <section id="home" className="w-full scroll-mt-[130px] px-4">
      <div className="mx-auto lg:flex xl:grid w-full max-w-[1420px] items-center gap-12 pt-10 pb-16 lg:grid-cols-[1fr_auto] lg:gap-8 lg:pt-16 lg:pb-24">
        {/* Copy column */}
        <div>
          {/* The page h1. Line breaks are hard-coded rather than left to wrapping
              because the colour split falls on line boundaries: line 2 is the accent. */}
          <h1
            className="text-[34px] sm:text-[42px] xl:text-[52px] leading-10 sm:leading-11 md:leading-14"
            style={titleTypography}
          >
            <span className="block text-[#011139]">Build a Smarter</span>
            <span className="block text-[#3191EA]">Digital Experience</span>
            <span className="block text-[#011139]">for Your Practice.</span>
          </h1>

          <p
            className="mt-6 max-w-[500px] text-[#4B5563]"
            style={paragraphTypography}
          >
            From your first professional website to a complete patient
            engagement and practice management platform, we help healthcare
            organizations grow with confidence.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center gap-5 rounded-[60px] bg-[#3191EA] px-5 sm:px-[30px] lg:px-6 xl:px-7.5 py-[15px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#1f7fd4]"
            >
              Get Started
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>

            {/* Outline variant: same box, same type, no fill. `border` adds 1px to each
                axis, so this sits 2px taller than the filled button unless the border
                is accounted for — hence the matching 1px inset on the padding. */}
            <Link
              href="#our-work"
              style={buttonTypography}
              className="inline-flex items-center gap-5 rounded-[60px] border border-[#3191EA] px-5 sm:px-[29px] lg:px-6 xl:px-7.5 py-[14px] whitespace-nowrap text-[#3191EA] transition-colors duration-200 hover:bg-[#3191EA] hover:text-white"
            >
              View Our Work
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Visual column. Intrinsic size is 736x663; width/height come from the static
            import, so only the rendered width is capped here and the height follows.
            `priority` because this is the largest above-the-fold paint. */}
        <div className="justify-self-center lg:justify-self-end pt-5 lg:pt-0">
          <Image
            src={bannerImage}
            alt="WiseDocx practice management dashboard shown alongside a doctor holding a tablet, with labels for patient management, billing and invoicing, appointment scheduling, analytics and data security"
            className="h-auto w-full max-w-[736px]"
            sizes="(min-width: 1024px) 736px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default DoctorBanner;
