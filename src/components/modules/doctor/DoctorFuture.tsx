import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import background from "@/assets/images/doctor/futureofhealth_bg.webp";

/**
 * "Experience the future of healthcare" — CTA banner.
 *
 * The phone mockup, the blue gradient and the banner's rounded corners are all baked
 * into one 1520x436 asset, so only the copy on the right is markup.
 *
 * Inter comes from the ROOT layout, which puts --font-inter on <body>; it is the one
 * face on this page not scoped to the /doctor route.
 */

// Figma spec: Urbanist Bold 52px / 60px, zero letter-spacing, #0C2F25.
// Only the desktop size is specced; the responsive steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 18px / 100%, zero letter-spacing, #4B5563. Wraps to two
// lines, so it gets real leading rather than the specced 100%.
const paragraphTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 18px / 18px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

const DoctorFuture = () => {
  return (
    <section id="contact-us" className="w-full scroll-mt-[130px] bg-white px-4">
      <div className="mx-auto w-full max-w-[1520px] pt-16 lg:pt-[100px]">
        {/* Top corners only — the bottom edge is deliberately square.
            The fallback tint only shows on mobile, where the artwork sits above the copy
            rather than behind it. */}
        <div className="relative overflow-hidden rounded-t-[30px] bg-[#DFEDFC]">
          {/*
            Two layouts from one element: in flow at the top on mobile, and absolutely
            covering the banner from lg up. `object-left` keeps the phone anchored to the
            left edge as the banner grows wider than the asset's 3.49:1 aspect.
          */}
          <Image
            src={background}
            alt="CureAi appointment booking app shown on a phone"
            className="w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover lg:object-left"
            sizes="(min-width: 1024px) 1520px, 100vw"
          />

          {/* `relative` lifts the copy above the absolutely-positioned artwork. */}
          <div className="relative grid lg:min-h-[436px] lg:grid-cols-[60fr_40fr]">
            {/* Reserves the left 60% for the phone, which is part of the image. */}
            <div className="hidden lg:block" aria-hidden="true" />

            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:pr-12 lg:pl-0">
              {/* h2: sibling of the other section headings. */}
              <h2
                className="text-[30px] leading-[1.15] text-[#0C2F25] sm:text-[40px] lg:text-[52px] lg:leading-[60px]"
                style={titleTypography}
              >
                {/* Hard break reproduced from the Figma frame. */}
                <span className="block">Experience the</span>
                <span className="block">future of healthcare</span>
              </h2>

              <p
                className="mt-6 max-w-[420px] leading-[1.4] text-[#4B5563]"
                style={paragraphTypography}
              >
                CureAi is revolutionizing the healthcare industry hy harnessing
                the power of AI to deliver smarter
              </p>

              <div className="mt-8">
                <Link
                  href="/contact-us"
                  style={buttonTypography}
                  className="inline-flex items-center gap-5 rounded-[60px] bg-[#3191EA] px-[60px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#1f7fd4]"
                >
                  Start Growing Today
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorFuture;
