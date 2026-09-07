"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/images/plumber/project1.webp";
import project2 from "@/assets/images/plumber/project2.webp";
import project3 from "@/assets/images/plumber/project3.webp";
import project4 from "@/assets/images/plumber/project4.webp";
import project5 from "@/assets/images/plumber/project5.webp";
import project6 from "@/assets/images/plumber/project6.webp";

/**
 * Filterable project grid.
 *
 * Same mechanics as the /restaurant projects section: client component, filter and reveal
 * are local state, every project renders from one array so switching tabs costs no
 * network and no image re-fetch. Only the palette differs.
 */

/** How many projects are visible before "View More Projects" is pressed. */
const PROJECTS_PER_PAGE = 4;

// Same ramp as the other sections on this page: Plus Jakarta Sans ExtraBold 48px / 60px,
// -1.2px letter-spacing, centered. Only the desktop size is specced.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the other sections: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Matching the /restaurant projects section: SemiBold 16px / 100%. Shared by the filter
// chips, the image badges and the View More button.
const chipTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Matching the /restaurant projects section: SemiBold 30px / 100%.
const projectTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Matching the /restaurant projects section: Regular 18px / 24px.
const projectMetaTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

/**
 * The first entry is the reset state and matches everything; the rest are matched
 * against each project's `categories`.
 */
const ALL = "All Projects";
const filters = [
  ALL,
  "Websites",
  "Mobile Apps",
  "Dashboards",
  "Client Portals",
] as const;

const projects: {
  image: StaticImageData;
  badge: string;
  title: string;
  meta: string;
  /** Which filter chips this project answers to. Derived from its badge and services. */
  categories: string[];
}[] = [
  {
    image: project1,
    badge: "ONLINE ORDERING",
    title: "Jobber",
    meta: "UI/UX Design, Web Development, Online Booking",
    categories: ["Websites", "Client Portals"],
  },
  {
    image: project2,
    badge: "RESTAURANT WEBSITE",
    title: "HousecallPro",
    meta: "UI/UX Design, Web Development, Reservation Flow",
    categories: ["Websites"],
  },
  {
    image: project3,
    badge: "BRAND WEBSITE",
    title: "Build OPS",
    meta: "UI/UX Design, Web Development, Brand Experience",
    categories: ["Websites"],
  },
  {
    image: project4,
    badge: "OPERATIONS DASHBOARD",
    title: "KitchenPilot",
    meta: "UI/UX Design, Dashboard Design, Restaurant Analytics",
    categories: ["Dashboards"],
  },
  {
    image: project5,
    badge: "LOYALTY & CRM",
    title: "GuestLoop",
    meta: "UI/UX Design, Customer Retention, Automation",
    categories: ["Dashboards", "Client Portals"],
  },
  {
    image: project6,
    badge: "MOBILE APP",
    title: "QuickServe",
    meta: "UI/UX Design, Mobile App, Ordering & Delivery",
    categories: ["Mobile Apps"],
  },
];

const PlumberProjects = () => {
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
    <section id="our-work" className="w-full scroll-mt-[110px] bg-[#101311] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on row one, so the rows cannot be left to wrap freely. */}
          <span className="block">
            <span className="text-white">Solutions We’ve Built </span>
            <span className="text-[#B6D500]">for</span>
          </span>
          <span className="block text-[#B6D500]">Businesses Like Yours.</span>
        </h2>

        <p
          className="mx-auto mt-5 max-w-[880px] text-center text-white"
          style={introTypography}
        >
          Explore digital solutions created for service professionals—from
          high-converting websites to smarter booking, customer communication,
          and business-management systems.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => selectFilter(filter)}
                aria-pressed={isActive}
                style={chipTypography}
                className={`rounded-[6px] border border-[#B6D500] px-[30px] py-3 whitespace-nowrap transition-colors duration-200 hover:bg-[#B6D500] hover:text-[#101311] ${
                  isActive
                    ? "bg-[#B6D500] text-[#101311]"
                    : "bg-transparent text-[#B6D500]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.title}>
              {/*
                Gradient border: the wrapper paints the #B6D500 -> #B6D50033 gradient and
                a 1px pad lets it show as a hairline around the inner clipped box. A real
                `border-image` cannot be combined with a border-radius.
              */}
              <div className="rounded-[10px] bg-gradient-to-b from-[#B6D50033] to-[#B6D500] p-px">
                <div className="relative overflow-hidden rounded-[10px]">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.meta}`}
                    className="aspect-[685/408] w-full object-cover"
                    sizes="(min-width: 768px) 685px, 100vw"
                  />

                  <span
                    style={chipTypography}
                    className="absolute top-5 left-5 rounded-[6px] bg-[#B6D500] px-4 py-2 text-[#101311]"
                  >
                    {project.badge}
                  </span>
                </div>
              </div>

              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-6 text-[20px] text-white md:text-[30px]"
                style={projectTitleTypography}
              >
                {project.title}
              </h3>
              <p
                className="mt-3 text-[16px] text-white md:text-[18px]"
                style={projectMetaTypography}
              >
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
              style={chipTypography}
              className="inline-flex items-center gap-3 rounded-[10px] bg-[#B6D500] px-[30px] py-4 whitespace-nowrap text-[#000000] transition-colors duration-200 hover:bg-[#a2bf00]"
            >
              View More Projects
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlumberProjects;
