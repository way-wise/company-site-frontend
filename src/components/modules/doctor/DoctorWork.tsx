"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import DoctorContainer from "./DoctorContainer";
import DoctorSectionHeading from "./DoctorSectionHeading";
import sectionBg from "@/assets/images/doctor/product_section_bf.webp";
import product1 from "@/assets/images/doctor/product1.webp";
import product2 from "@/assets/images/doctor/product2.webp";
import product3 from "@/assets/images/doctor/product3.webp";
import product4 from "@/assets/images/doctor/product4.webp";
import product5 from "@/assets/images/doctor/product5.webp";
import product6 from "@/assets/images/doctor/product6.webp";
import product7 from "@/assets/images/doctor/product7.webp";
import product8 from "@/assets/images/doctor/product8.webp";
import product9 from "@/assets/images/doctor/product9.webp";
import product10 from "@/assets/images/doctor/product10.webp";

/**
 * Section 8 — "Legal Products We've Designed and Developed".
 *
 * Client component: the category filter and Load More both need local state.
 *
 * The artwork re-export dropped the baked-in category badges, so the badge is now
 * rendered here as an overlay driven by each project's `category` — meaning the badge
 * and the filter can no longer disagree. Rounded corners ARE still baked into the
 * images (transparent alpha corners), so there is deliberately no CSS radius.
 */

// The eyebrow/heading/description type specs now live in <DoctorSectionHeading>,
// which this section and "Why Way Wise Tech" both render.

// Figma spec: Inter SemiBold 16px / 19.5px, zero letter-spacing.
const filterTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani SemiBold 32px / 100%, zero letter-spacing.
const itemHeadTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 16px / 19.5px, zero letter-spacing, #B8B8B8.
const itemParagraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 14px / 130%, zero letter-spacing.
const loadMoreTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "130%",
  letterSpacing: "0",
} as const;

// No badge typography was specified — only `badge bg color #00A3FF`. These values are
// measured off the badges that used to be baked into the artwork.
const badgeTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "11px",
  lineHeight: "16.5px",
  letterSpacing: "0.5px",
} as const;

const ALL_FILTER = "All Healthcare Work";

const filters = [
  ALL_FILTER,
  "Healthcare Websites",
  "Practice Management",
  "Patient Portals",
  "UI/UX Design",
  "Mobile Apps",
] as const;

type Filter = (typeof filters)[number];

type Project = {
  image: StaticImageData;
  title: string;
  meta: string;
  /** Drives the filter only — the badge on the artwork is baked in. */
  category: Exclude<Filter, typeof ALL_FILTER>;
};

const projects: Project[] = [
  {
    image: product1,
    title: "CarePoint",
    meta: "UI/UX Design, Web Development, Patient Scheduling",
    category: "Patient Portals",
  },
  {
    image: product2,
    title: "Dentivo",
    meta: "UI/UX Design, Web Development, SEO",
    category: "Healthcare Websites",
  },
  {
    image: product3,
    title: "Niyom Care",
    meta: "UI/UX Design, Web Development, Patient Acquisition",
    category: "Healthcare Websites",
  },
  {
    image: product4,
    title: "Mycliniq",
    meta: "UI/UX Design, Care Coordination, Web Development",
    category: "Practice Management",
  },
  {
    image: product5,
    title: "Sarah Health",
    meta: "UI/UX Design, Web Development, AI Integration",
    category: "Healthcare Websites",
  },
  {
    image: product6,
    title: "Crextio",
    meta: "UI/UX Design, Mobile App Design, Patient Experience",
    category: "Mobile Apps",
  },
  {
    image: product7,
    title: "CareConnect",
    meta: "UI/UX Design, Design System, Interactive Prototype",
    category: "UI/UX Design",
  },
  {
    image: product8,
    title: "Lexora",
    meta: "UI/UX Design, Scheduling System, Web App Development",
    category: "Practice Management",
  },
  // TODO(confirm): titles/meta/categories for the two new exports are inferred from the
  // artwork itself — "Nexora" is the brand visible in the mockup, and product10 is an
  // appointment-booking phone app. Flagged to the user for correction.
  {
    image: product9,
    title: "Nexora",
    meta: "UI/UX Design, Design System, Prototype",
    category: "Healthcare Websites",
  },
  {
    image: product10,
    title: "Care Nova",
    meta: "UI/UX Design, Patient Dashboard, Web Development",
    category: "Patient Portals",
  },
];

/**
 * Cards revealed initially, and added per Load More click.
 *
 * 8 reproduces the Figma frame exactly now that there are 10 projects: eight visible
 * with Load More still offered, then the last two on click.
 */
const PAGE_SIZE = 8;

const DoctorWork = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>(ALL_FILTER);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered =
    activeFilter === ALL_FILTER
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Switching filters must reset paging, or a narrow category could inherit a large
  // count from a previous selection and skip its own Load More entirely.
  const selectFilter = (filter: Filter) => {
    setActiveFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section
      id="our-work"
      // scroll-mt clears the pinned navbar so this section's heading isn't hidden
      // beneath it when the nav link jumps here.
      className="scroll-mt-24 bg-black"
      // Stretched rather than `cover`: the artwork is 2880x2085 (landscape) but this
      // section is far taller than wide, so `cover` would crop ~1000px off each side
      // and discard both corner accents — the red glow and the pixel grid.
      style={{
        backgroundImage: `url(${sectionBg.src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <DoctorContainer className="py-15 lg:py-28">
        <DoctorSectionHeading
          eyebrow="OUR WORK"
          heading="Healthcare Products We’ve Designed & Developed"
          description="Explore websites, platforms, and digital experiences we have created for doctors, healthcare professionals, medical-service providers, and businesses operating in the healthcare industry."
          descriptionClassName="max-w-137"
          headingClassName="text-[36px] leading-10 lg:text-[60px] lg:leading-[64px]"
        />

        {/* Filters — 12px gap per spec */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => selectFilter(filter)}
                aria-pressed={isActive}
                style={filterTypography}
                className={`rounded-lg border px-5 py-2 font-semibold text-white transition-colors duration-200 hover:border-[#00A3FF] hover:bg-[#00A3FF] ${
                  isActive
                    ? "border-[#00A3FF] bg-[#00A3FF]"
                    : "border-[#2A2A2A] bg-transparent"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Grid — 50px item-to-item gap per spec */}
        <ul className="mt-14 grid grid-cols-1 gap-[50px] md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.title}>
              {/* `relative` anchors the badge; the image keeps its own baked-in
                  rounded corners, so no radius or overflow clipping is applied. */}
              <div className="relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full"
                />
                <span
                  style={badgeTypography}
                  className="absolute top-5 left-5 rounded-md bg-[#00A3FF] px-3 py-1.5 font-semibold text-white uppercase"
                >
                  {project.category}
                </span>
              </div>
              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-6 font-semibold text-white text-[24px] lg:text-[32px]"
                style={itemHeadTypography}
              >
                {project.title}
              </h3>
              <p
                className="mt-2.5 text-[#B8B8B8]"
                style={itemParagraphTypography}
              >
                {project.meta}
              </p>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              style={loadMoreTypography}
              className="rounded-lg bg-[#00A3FF] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#0091e6]"
            >
              Load More
            </button>
          </div>
        )}
      </DoctorContainer>
    </section>
  );
};

export default DoctorWork;
