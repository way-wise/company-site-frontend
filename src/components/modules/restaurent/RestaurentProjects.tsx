"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * "Built for Restaurants. Designed for Growth." — filterable project grid.
 *
 * Same mechanics as the /doctor projects section: client component, filter and reveal
 * are local state, every project renders from one array so switching tabs costs no
 * network and no image re-fetch.
 *
 * Images live in `public/` rather than `src/assets/`, which is where they were supplied,
 * so they are referenced by path and need their intrinsic size declared.
 */
const IMAGE_WIDTH = 635;
const IMAGE_HEIGHT = 408;

/** How many projects are visible before "View More Projects" is pressed. */
const PROJECTS_PER_PAGE = 4;

// Same ramp as the previous sections: Plus Jakarta Sans ExtraBold 48px / 60px, centered,
// #0F1A1A. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Same ramp as the previous sections: Plus Jakarta Sans Regular 18px / 26.4px, #6D625C.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.4px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 16px / 100%, zero letter-spacing. Shared by the
// filter chips, the image badges and the View More button.
const chipTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 30px / 100%, zero letter-spacing, #17120F.
const projectTitleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  fontSize: "30px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 24px, zero letter-spacing, #6D625C.
const projectMetaTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
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
  "Online Ordering",
  "Restaurant Websites",
  "Mobile Apps",
  "Restaurant Systems",
] as const;

const projects: {
  image: string;
  badge: string;
  title: string;
  meta: string;
  /** Which filter chips this project answers to. Derived from its badge and services. */
  categories: string[];
}[] = [
  {
    image: "/images/restaurent/project1.webp",
    badge: "ONLINE ORDERING",
    title: "OrderNest",
    meta: "UI/UX Design, Web Development, Online Ordering",
    categories: ["Online Ordering", "Restaurant Websites"],
  },
  {
    image: "/images/restaurent/project2.webp",
    badge: "RESTAURANT WEBSITE",
    title: "TableNova",
    meta: "UI/UX Design, Web Development, Reservation Flow",
    categories: ["Restaurant Websites"],
  },
  {
    image: "/images/restaurent/project3.webp",
    badge: "BRAND WEBSITE",
    title: "MenuCraft",
    meta: "UI/UX Design, Web Development, Brand Experience",
    categories: ["Restaurant Websites"],
  },
  {
    image: "/images/restaurent/project4.webp",
    badge: "OPERATIONS DASHBOARD",
    title: "KitchenPilot",
    meta: "UI/UX Design, Dashboard Design, Restaurant Analytics",
    categories: ["Restaurant Systems"],
  },
  {
    image: "/images/restaurent/project5.webp",
    badge: "LOYALTY & CRM",
    title: "GuestLoop",
    meta: "UI/UX Design, Customer Retention, Automation",
    categories: ["Restaurant Systems"],
  },
  {
    image: "/images/restaurent/project6.webp",
    badge: "MOBILE APP",
    title: "QuickServe",
    meta: "UI/UX Design, Mobile App, Ordering & Delivery",
    categories: ["Mobile Apps", "Online Ordering"],
  },
];

const RestaurentProjects = () => {
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
    <section id="our-work" className="w-full bg-[#FFF8F2] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0F1A1A] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame. */}
          <span className="block">Built for Restaurants. Designed</span>
          <span className="block">for Growth.</span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-[860px] text-center text-[#6D625C]"
          style={introTypography}
        >
          From online ordering and restaurant websites to loyalty platforms and
          operations dashboards, we create digital experiences that help food
          businesses serve better and grow faster.
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
                className={`rounded-[6px] border border-[#E94222] px-[30px] py-3 whitespace-nowrap transition-colors duration-200 hover:bg-[#E94222] hover:text-white ${
                  isActive
                    ? "bg-[#E94222] text-white"
                    : "bg-transparent text-[#E94222]"
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
              <div className="relative overflow-hidden rounded-[10px]">
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.meta}`}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  className="aspect-[635/408] w-full object-cover"
                  sizes="(min-width: 768px) 635px, 100vw"
                />

                <span
                  style={chipTypography}
                  className="absolute top-5 left-5 rounded-[6px] bg-[#E94222] px-4 py-2 text-white"
                >
                  {project.badge}
                </span>
              </div>

              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-6 text-[#17120F]"
                style={projectTitleTypography}
              >
                {project.title}
              </h3>
              <p className="mt-3 text-[#6D625C]" style={projectMetaTypography}>
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
              className="inline-flex items-center gap-3 rounded-[10px] border border-[#E94222] bg-[#E94222] px-[30px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#cf3517]"
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

export default RestaurentProjects;
