import Image from "next/image";
import Link from "next/link";
import bannerImage from "@/assets/images/doctor/banner.webp";
import DoctorContainer from "./DoctorContainer";

/**
 * Section 3 — hero banner.
 *
 * The artwork is full-bleed and anchored right (that is where the subject sits); the
 * copy is held to the shared 1420px container over the dark left side.
 */

// Figma spec: Inter Regular 18px / 28px, zero letter-spacing.
const breadcrumbTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani Bold 48px / 56px, -0.96px letter-spacing.
const headlineTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "48px",
  lineHeight: "56px",
  letterSpacing: "-0.96px",
} as const;

// Figma spec: Inter Regular 20px / 32px, zero letter-spacing.
const descriptionTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "20px",
  lineHeight: "32px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 20px / 30px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  letterSpacing: "0",
} as const;

const DoctorBanner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      {/* Background artwork. `priority` because this is the LCP element. */}
      <Image
        src={bannerImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right hidden md:block"
        aria-hidden="true"
      />

      <DoctorContainer
        className="relative flex min-h-[560px] items-center py-16 lg:min-h-[640px] lg:py-20"
        innerClassName="w-full"
      >
        <div className="max-w-[680px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className="flex items-center gap-3 text-white"
              style={breadcrumbTypography}
            >
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-200 hover:text-[#00A3FF]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/60">
                &bull;
              </li>
              {/* aria-current marks the trail's end for screen readers. */}
              <li aria-current="page">Doctors</li>
            </ol>
          </nav>

          {/* The page's single <h1>. */}
          <h1
            className="mb-6 font-bold text-white"
            style={headlineTypography}
          >
            Innovative Technology That Empowers Care Solutions
          </h1>

          <p
            className="mb-6 font-normal text-gray-200"
            style={descriptionTypography}
          >
            We design and develop secure, intuitive digital solutions for doctors, clinics, and healthcare providers—helping teams improve patient experiences, streamline daily operations, and grow with confidence.
          </p>

          {/* Plain <a> rather than <Link>: same-document fragments, so native anchor
              navigation is what picks up `scroll-behavior: smooth` and scroll-mt. */}
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <a
              href="#our-work"
              style={buttonTypography}
              className="rounded-md bg-[#007AFF] px-7 py-[13px] text-center font-medium whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#0091e6] text-[16px] md:text-[20px] leading-7.5"
            >
              View Our Healthcare Work
            </a>
            <a
              href="#packages"
              style={buttonTypography}
              className="rounded-md bg-[#F1F5F9] px-7 py-[13px] text-center font-medium whitespace-nowrap text-[#0A0A0A] transition-colors duration-200 hover:bg-white text-[16px] md:text-[20px] leading-7.5"
            >
              Explore Healthcare Packages
            </a>
          </div>
        </div>
      </DoctorContainer>
    </section>
  );
};

export default DoctorBanner;
