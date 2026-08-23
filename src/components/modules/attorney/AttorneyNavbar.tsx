"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AttorneyContainer, { ATTORNEY_NAV_WIDTH } from "./AttorneyContainer";
import AttorneyLogo from "./AttorneyLogo";

const profileGuide = "/images/shared/book-v2-front.png";

// In-page anchors: this is a single-scroll landing page, so each link targets a
// section further down. Section ids must match these.
//
// No active/current state by design — nothing is highlighted at rest, so blue is
// reserved entirely for hover.
const navLinks = [
  { label: "Legal Solutions", href: "#legal-solutions" },
  { label: "Our Work", href: "#our-work" },
  { label: "Process", href: "#process" },
  { label: "Packages", href: "#packages" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQs", href: "#faqs" },
];

// Figma spec: Inter Medium 16px / 21px, zero letter-spacing, centered.
const linkTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0px",
} as const;

// Figma spec: Inter Medium 14px / 130%, zero letter-spacing, centered.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "130%",
  letterSpacing: "0px",
} as const;

const AttorneyNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-black">
      {/* 1530px, not the 1420px used by every content section — per the Figma spec. */}
      <AttorneyContainer
        className="py-4"
        innerClassName="flex items-center justify-between"
        maxWidthClass={ATTORNEY_NAV_WIDTH}
      >
        <AttorneyLogo />

        {/* Desktop navigation — 40px gap per spec */}
        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              // Mirrored into the ::after pseudo-element below to reserve the bold width.
              data-label={link.label}
              style={linkTypography}
              className="text-center font-medium whitespace-nowrap text-white transition-all duration-200 hover:font-bold hover:text-[#00A3FF] after:invisible after:block after:h-0 after:overflow-hidden after:font-bold after:content-[attr(data-label)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            title="View Company Profile"
            className="hidden overflow-hidden rounded-sm shadow-[0_0_8px_rgba(0,163,255,0.3)] transition-all duration-300 hover:scale-[1.04] hover:ring-[#00A3FF]/80 hover:shadow-[0_0_14px_rgba(0,163,255,0.5)] lg:block"
          >
            <Image
              src={profileGuide}
              alt="Way Wise Tech company profile"
              width={1190}
              height={841}
              className="h-auto w-24 object-cover"
            />
          </Link>
        </nav>

        {/* Right cluster: profile book + CTA */}
        <div className="flex items-center gap-4">
          {/* Company profile thumbnail, glow ring matches the main site treatment */}

          <Link
            href="/contact-us"
            style={buttonTypography}
            className="hidden rounded-md bg-[#00A3FF] px-5 py-2.5 text-center font-medium whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#0091e6] lg:inline-block"
          >
            Start a Project
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </AttorneyContainer>

      {/* Mobile panel */}
      {mobileOpen && (
        <AttorneyContainer
          className="border-t border-white/10 py-5 lg:hidden"
          maxWidthClass={ATTORNEY_NAV_WIDTH}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={linkTypography}
                // Stacked vertically, so bold-on-hover shifts nothing — no width
                // reservation needed here, unlike the desktop row.
                className="w-fit font-medium text-white transition-all duration-200 hover:font-bold hover:text-[#00A3FF]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact-us"
              onClick={() => setMobileOpen(false)}
              style={buttonTypography}
              className="mt-1 rounded-md bg-[#00A3FF] px-5 py-2.5 text-center font-medium text-white transition-colors duration-200 hover:bg-[#0091e6]"
            >
              Start a Project
            </Link>
          </nav>
        </AttorneyContainer>
      )}
    </header>
  );
};

export default AttorneyNavbar;
