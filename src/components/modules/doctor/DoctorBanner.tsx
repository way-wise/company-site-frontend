import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import photoOne from "@/assets/images/doctor/DoctorBanner-media-1-column-1.png";
import photoTwo from "@/assets/images/doctor/DoctorBanner-media-2-column-1.png";
import photoThree from "@/assets/images/doctor/DoctorBanner-media-2-column-2.png";
import playIconBg from "@/assets/images/attorney/paly-icon-bg.png";
import playIcon from "@/assets/images/doctor/doctor-play-icon.png";

/**
 * Banner / hero.
 *
 * The media column is a 744x684 stage (Figma frame). Every child is positioned as a
 * percentage of that stage so the composition scales fluidly below the desktop width.
 */

// Figma spec: Urbanist Bold 54px, line-height 100%, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine — 54px/100%
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

// Figma spec: Urbanist Medium 18px / 28px, zero letter-spacing.
// Shared by both CTAs — they differ only in fill vs outline.
const buttonTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

const StatCard = ({ label, className }: { label: string; className: string }) => (
  <span
    className={`absolute z-10 rounded-full bg-[#3191EA] px-3 py-2 text-xs leading-5 font-medium whitespace-nowrap text-white sm:px-[21px] sm:py-[10.57px] sm:text-sm ${className}`}
    style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
  >
    {label}
  </span>
);

// Same ring construction as AttorneyPlayButton, but with the doctor page's blue icon.
const DoctorPlayButton = () => (
  <button
    type="button"
    aria-label="Play video"
    className="group absolute top-1/2 left-1/2 flex size-[52px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-8 border-white/20 transition-colors duration-300 hover:border-white/40 sm:size-[84px] sm:border-[14px]"
  >
    {/* Inset wrapper leaves a small gap between the translucent ring and the disc. */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-[3px] sm:inset-1">
      <Image
        src={playIconBg}
        alt=""
        aria-hidden="true"
        fill
        sizes="124px"
        className="object-contain opacity-90 transition-transform duration-300 group-hover:scale-110"
      />
    </span>
    <Image
      src={playIcon}
      alt=""
      aria-hidden="true"
      width={48}
      height={48}
      className="relative size-5 transition-transform duration-300 group-hover:scale-125 sm:size-7"
    />
  </button>
);

const DoctorBanner = () => {
  return (
    <section id="home" className="w-full scroll-mt-[130px] px-4">
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-12 pt-10 pb-16 lg:grid-cols-[minmax(0,723px)_minmax(0,744px)] lg:justify-between lg:gap-8 lg:pt-16 lg:pb-24">
        {/* content column */}
        <div className="flex flex-col gap-[50px]">
          {/* The page h1. Line breaks are hard-coded rather than left to wrapping
              because the colour split falls on line boundaries: line 2 is the accent. */}
          <h1
            className="text-[34px] leading-none sm:text-[42px] xl:text-[54px]"
            style={titleTypography}
          >
            <span className="block text-[#011139]">Are You a Healthcare Professional or Managing a Medical Practice?</span>
            <span className="block text-[#3191EA]">Explore Our Exclusive Healthcare Service Packages.</span>
          </h1>
          <p className="max-w-[723px] text-[#4B5563]" style={paragraphTypography}>
            Build a professional digital presence, streamline patient management, and create better experiences for your patients.
          </p>

          <div className="flex flex-wrap items-center gap-4">
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

        {/* media column: 744x684 stage, children positioned in % of it */}
        <div className="relative mx-auto aspect-[744/684] w-full max-w-[744px] lg:mx-0">
          <div className="absolute top-[20.47%] left-[7.26%] h-[53.65%] w-[39.25%] overflow-hidden rounded-2xl bg-white">
            <Image
              src={photoOne}
              alt="Doctor examining a patient's knee"
              fill
              sizes="(min-width: 1024px) 292px, 40vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute top-0 left-[49.33%] h-[53.65%] w-[42.34%] overflow-hidden rounded-2xl">
            <Image
              src={photoTwo}
              alt="Nurse smiling with a patient on crutches"
              fill
              sizes="(min-width: 1024px) 315px, 42vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute top-[57.31%] left-[49.33%] h-[42.69%] w-[49.33%] overflow-hidden rounded-2xl">
            <Image
              src={photoThree}
              alt="Practice management dashboard on a laptop and tablet"
              fill
              sizes="(min-width: 1024px) 367px, 49vw"
              className="object-cover"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-gray-500/10 via-gray-800/30 to-black/50"
            />
            <DoctorPlayButton />
          </div>

          <StatCard label="Billing & Invoicing" className="top-[10.09%] left-[28.9%]" />
          <StatCard label="Patient Management" className="top-[24.85%] left-[0.4%]" />
          <StatCard label="Appointment Scheduling" className="top-[44.15%] left-[75.8%]" />
          <StatCard label="Analytics Dasboard" className="top-[78.65%] left-[23.66%]" />
        </div>
      </div>
    </section>
  );
};

export default DoctorBanner;
