"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/images/doctor/project1.webp";
import project2 from "@/assets/images/doctor/project2.webp";
import project3 from "@/assets/images/doctor/project3.webp";
import project4 from "@/assets/images/doctor/project4.webp";
import project5 from "@/assets/images/doctor/project5.webp";
import project6 from "@/assets/images/doctor/project6.webp";

/**
 * "Healthcare Experiences We've Designed & Built" — filterable project grid.
 *
 * Client component: the filter and the Load More reveal are both local state. Every
 * project is rendered into the DOM up front and the filter narrows the array, so
 * switching tabs costs no network and no image re-fetch.
 */

/** How many projects are visible before "Load More" is pressed. */
const PROJECTS_PER_PAGE = 4;

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

// Figma spec: Urbanist SemiBold 16px / 100%, zero letter-spacing. Shared by the filter
// chips and the Load More button.
const buttonTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 10px / 100%, zero letter-spacing.
const badgeTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 32px / 100%, zero letter-spacing, #011139.
const projectTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "32px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Regular 16px / 19.5px, zero letter-spacing, #4B5563.
const projectMetaTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "19.5px",
  letterSpacing: "0",
} as const;

/**
 * The first entry is the reset state and matches everything; the rest are matched
 * against each project's `categories`.
 */
const ALL = "All Projects";
const filters = [
  ALL,
  "Web Development",
  "UI/UX Design",
  "Mobile Apps Development",
] as const;

const projects: {
  image: StaticImageData;
  badge: string;
  title: string;
  meta: string;
  /** Which filter chips this project answers to. Derived from its listed services. */
  categories: string[];
}[] = [
  {
    image: project1,
    badge: "PATIENT PORTAL",
    title: "CarePoint",
    meta: "UI/UX Design, Web Development, Patient Scheduling",
    categories: ["Web Development", "UI/UX Design"],
  },
  {
    image: project2,
    badge: "HEALTHCARE WEBSITE",
    title: "Dentivo",
    meta: "UI/UX Design, Web Development, SEO",
    categories: ["Web Development", "UI/UX Design"],
  },
  {
    image: project3,
    badge: "HEALTHCARE WEBSITE",
    title: "Niyom Care",
    meta: "UI/UX Design, Web Development, Patient Acquisition",
    categories: ["Web Development", "UI/UX Design"],
  },
  {
    image: project4,
    badge: "PRACTICE MANAGEMENT",
    title: "Mycliniq",
    meta: "UI/UX Design, Care Coordination, Web Development",
    categories: ["Web Development", "UI/UX Design"],
  },
  {
    image: project5,
    badge: "HEALTHCARE WEBSITE",
    title: "Sarah Health",
    meta: "UI/UX Design, Web Development, AI Integration",
    categories: ["Web Development", "UI/UX Design"],
  },
  {
    image: project6,
    badge: "MOBILE APP",
    title: "Crextio",
    meta: "UI/UX Design, Mobile App Design, Patient Experience",
    categories: ["Mobile Apps Development", "UI/UX Design"],
  },
];

const DoctorProjects = () => {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  const matches = useMemo(
    () =>
      activeFilter === ALL
        ? projects
        : projects.filter((p) => p.categories.includes(activeFilter)),
    [activeFilter],
  );

  const visible = matches.slice(0, visibleCount);
  const hasMore = visibleCount < matches.length;

  // Changing filter re-collapses the list: leaving a raised count would make a narrow
  // filter open fully expanded while a broad one appears truncated.
  const selectFilter = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(PROJECTS_PER_PAGE);
  };

  return (
    <section id="our-work" className="w-full scroll-mt-[130px] bg-[#F5F7FC] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.15] sm:text-[40px] lg:text-[52px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on both rows, so they cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-[#011139]">Healthcare </span>
            <span className="text-[#3191EA]">Experiences We&rsquo;ve</span>
          </span>
          <span className="block">
            <span className="text-[#3191EA]">Designed</span>
            <span className="text-[#011139]"> &amp; Built</span>
          </span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-[700px] text-center leading-[1.4] text-[#4B5563]"
          style={introTypography}
        >
          Explore a selection of websites, patient platforms, dashboards, and
          digital tools we&rsquo;ve created to help healthcare organizations
          deliver better care and grow with confidence.
        </p>

        {/* Filter chips — 12px gap per spec */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => selectFilter(filter)}
                aria-pressed={isActive}
                style={buttonTypography}
                className={`rounded-[60px] border border-[#3191EA] px-[30px] py-2 whitespace-nowrap transition-colors duration-200 hover:bg-[#3191EA] hover:text-white ${
                  isActive ? "bg-[#3191EA] text-white" : "bg-transparent text-[#3191EA]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-[50px] md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.title}>
              {/*
                Gradient border: the wrapper paints the #007AFF -> #007AFF33 gradient and
                a 1px pad lets it show as a hairline around the inner clipped box. A real
                `border-image` cannot be combined with a border-radius.
              */}
              <div className="rounded-[16px] bg-gradient-to-b from-[#007AFF]/20 to-[#007AFF] p-px">
                <div className="relative overflow-hidden rounded-[16px]">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.meta}`}
                    className="aspect-[660/408] w-full object-cover"
                    sizes="(min-width: 768px) 635px, 100vw"
                  />

                  <span
                    style={badgeTypography}
                    className="absolute top-4 left-4 rounded-full bg-[#3191EA] px-3 py-1.5 text-white"
                  >
                    {project.badge}
                  </span>
                </div>
              </div>

              {/* h3: nested under this section's h2. */}
              <h3 className="mt-7 text-[#011139]" style={projectTitleTypography}>
                {project.title}
              </h3>
              <p className="mt-3 text-[#4B5563]" style={projectMetaTypography}>
                {project.meta}
              </p>
            </li>
          ))}
        </ul>

        {/* Rendered only while something is still hidden — a button that loads nothing
            is worse than no button. */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PROJECTS_PER_PAGE)}
              style={buttonTypography}
              className="inline-flex items-center gap-5 rounded-[60px] border border-[#3191EA] bg-[#3191EA] px-[60px] py-[15px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#1f7fd4]"
            >
              Load More
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorProjects;
