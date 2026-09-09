"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import work1 from "@/assets/images/ecommerce/work1.webp";
import work2 from "@/assets/images/ecommerce/work2.webp";
import work3 from "@/assets/images/ecommerce/work3.webp";
import work4 from "@/assets/images/ecommerce/work4.webp";
import work5 from "@/assets/images/ecommerce/work5.webp";
import work6 from "@/assets/images/ecommerce/work6.webp";

/**
 * Filterable project grid.
 *
 * Same mechanics as the /restaurant and /plumber project sections: client component,
 * filter and reveal are local state, every project renders from one array so switching
 * tabs costs no network and no image re-fetch. Only the palette and copy differ.
 *
 * Unlike the other sections on this page the heading has no eyebrow line — the frame
 * opens straight on the h2.
 */

/** How many projects are visible before "View More Projects" is pressed. */
const PROJECTS_PER_PAGE = 4;

// Section header — same ramp as the industries section, as requested, but inverted for
// the dark ground: white title, white at 70% for the intro.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

const introTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 100%, zero letter-spacing, white.
const badgeTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 30px / 100%, zero letter-spacing. No colour was
// given; the frame renders these white.
const projectTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 24px, zero letter-spacing, white at 70%.
const projectMetaTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// No type spec was given for the filter chips or the CTA; both take the page's 16/20
// Outfit body ramp, which is what the frame's lighter weight reads as.
const controlTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

/**
 * The first entry is the reset state and matches everything; the rest are matched
 * against each project's `categories`.
 */
const ALL = "All Projects";
const filters = [
  ALL,
  "Retail Websites",
  "eCommerce Stores",
  "Mobile Apps",
  "Dashboards",
  "POS Systems",
] as const;

const projects: {
  image: StaticImageData;
  badge: string;
  title: string;
  meta: string;
  /**
   * Which filter chips this project answers to. No mapping was supplied, so these are
   * derived from what each screenshot actually shows rather than from its badge — three
   * of the badges contradict their own image (see the note in the message to the user).
   */
  categories: string[];
}[] = [
  {
    image: work1,
    badge: "ONLINE ORDERING",
    title: "OrderNest",
    meta: "UI/UX Design, Web Development, Online Ordering",
    categories: ["eCommerce Stores", "Retail Websites"],
  },
  {
    image: work2,
    badge: "RESTAURANT WEBSITE",
    title: "TableNova",
    meta: "UI/UX Design, Web Development, Reservation Flow",
    categories: ["Retail Websites", "eCommerce Stores"],
  },
  {
    image: work3,
    badge: "BRAND WEBSITE",
    title: "MenuCraft",
    meta: "UI/UX Design, Web Development, Brand Experience",
    categories: ["Dashboards"],
  },
  {
    image: work4,
    badge: "OPERATIONS DASHBOARD",
    title: "KitchenPilot",
    meta: "UI/UX Design, Dashboard Design, Restaurant Analytics",
    categories: ["Mobile Apps"],
  },
  {
    image: work5,
    badge: "LOYALTY & CRM",
    title: "GuestLoop",
    meta: "UI/UX Design, Customer Retention, Automation",
    categories: ["Mobile Apps"],
  },
  {
    image: work6,
    badge: "MOBILE APP",
    title: "QuickServe",
    meta: "UI/UX Design, Mobile App, Ordering & Delivery",
    categories: ["Dashboards"],
  },
];

const EcommerceOurWork = () => {
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
    <section
      id="our-work"
      className="w-full scroll-mt-[110px] bg-[#1E130A] px-4"
    >
      {/* 1420px, matching the navbar. Two 685px columns plus the 50px gutter is exactly
          that width, so the images render at their intrinsic size. */}
      <div className="mx-auto w-full max-w-[1420px] py-16 lg:py-[100px]">
        <div className="mx-auto max-w-[768px] text-center">
          <h2
            style={titleTypography}
            className="pb-4 text-[34px] leading-10 text-white md:text-[48px] md:leading-12.5"
          >
            {/* Hard break reproduced from the Figma frame. */}
            <span className="lg:block">Built for Retail Businesses </span>
            <span className="lg:block">Ready to Sell Smarter.</span>
          </h2>
          <p style={introTypography} className="text-white/70">
            Explore commerce experiences designed around real products, better
            customer journeys, and stronger operations.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => selectFilter(filter)}
                aria-pressed={isActive}
                style={controlTypography}
                className={`rounded-[8px] border border-[#A07B62] px-[30px] py-2 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#A07B62] ${
                  isActive ? "bg-[#A07B62]" : "bg-transparent"
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
              {/* `overflow-hidden` on the wrapper is what clips the badge to the 16px
                  corner radius; the radius on the <img> alone would not contain it. */}
              <div className="relative overflow-hidden rounded-[16px]">
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.meta}`}
                  className="aspect-[685/408] w-full object-cover"
                  sizes="(min-width: 768px) 685px, 100vw"
                />
                <span
                  style={badgeTypography}
                  className="absolute top-6 left-6 rounded-[6px] bg-[#A07B62] px-3 py-1.5 text-white"
                >
                  {project.badge}
                </span>
              </div>

              {/* h3: nested under this section's h2. */}
              <h3
                style={projectTitleTypography}
                className="mt-7 text-[24px] text-white md:text-[30px]"
              >
                {project.title}
              </h3>
              <p style={projectMetaTypography} className="mt-5 text-white/70">
                {project.meta}
              </p>
            </li>
          ))}
        </ul>

        {/* A chip can match nothing — "POS Systems" currently has no projects — so the
            empty case says so rather than leaving a silent gap where the grid was. */}
        {matches.length === 0 && (
          <p
            style={introTypography}
            className="mt-12 text-center text-white/70"
            role="status"
          >
            No projects in this category yet.
          </p>
        )}

        {/* Rendered only while something is still hidden — a button that loads nothing is
            worse than no button. */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PROJECTS_PER_PAGE)}
              style={controlTypography}
              className="inline-flex items-center gap-3 rounded-[10px] bg-[#A07B62] px-[60px] py-[15px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#8a684f]"
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

export default EcommerceOurWork;
