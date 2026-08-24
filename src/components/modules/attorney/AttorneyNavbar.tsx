"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import AttorneyContainer, { ATTORNEY_NAV_WIDTH } from "./AttorneyContainer";
import AttorneyLogo from "./AttorneyLogo";

const profileGuide = "/images/shared/book-v2-front.png";

/** Scroll depth at which the navbar detaches and pins to the viewport top. */
const STICK_AFTER_PX = 100;

/** Ties the hamburger's aria-controls to the drawer it opens. */
const DRAWER_ID = "attorney-mobile-drawer";

// In-page anchors: this is a single-scroll landing page, so each link targets a
// section further down. Section ids must match these.
//
// No active/current state by design — nothing is highlighted at rest, so blue is
// reserved entirely for hover.
const navLinks = [
  { label: "Legal Solutions", href: "#home" },
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

  const [isPinned, setIsPinned] = useState(false);

  // Height is measured rather than hardcoded: it changes with the logo's responsive
  // sizing, and a wrong value shows up as a jump in the content below.
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const isPinnedRef = useRef(false);

  useEffect(() => {
    // Only measure while unpinned: that is the height the document actually loses,
    // and the pinned header is deliberately shorter (tighter padding).
    const measure = () => {
      if (headerRef.current && !isPinnedRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    // Passive: this listener never calls preventDefault, so the browser is free to
    // keep scrolling without waiting on it. Re-setting the same boolean is a no-op
    // in React, so this only re-renders on the two threshold crossings.
    const onScroll = () => {
      const pinned = window.scrollY > STICK_AFTER_PX;
      isPinnedRef.current = pinned;
      setIsPinned(pinned);
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Close the drawer on pin/unpin — leaving it open while the header jumps between
  // flow and fixed looks broken.
  useEffect(() => {
    setMobileOpen(false);
  }, [isPinned]);

  // While the drawer is open: lock page scroll so the body behind it doesn't move,
  // and let Escape dismiss it.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    // Captured and restored rather than hardcoded back to "", so this can't clobber
    // an overflow value some other component set.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Reserves the space the header vacates when it goes fixed, so the banner
          below doesn't jump up by the header's height. */}
      {isPinned && <div style={{ height: headerHeight }} aria-hidden="true" />}

      <header id="home"
        ref={headerRef}
        // `transition-all` stays on in BOTH states so the padding tightening below
        // eases rather than snapping. The pinned entrance itself is the keyframe
        // animation (globals.css) — see the note there on why not a transition.
        className={`w-full transition-all duration-500 ease-out ${
          isPinned
            ? "animate-nav-slide-down fixed inset-x-0 top-0 z-50 bg-black shadow-lg shadow-black/40"
            : "relative bg-black"
        }`}
      >
      {/* 1530px, not the 1420px used by every content section — per the Figma spec. */}
      <AttorneyContainer
        className={`transition-all duration-500 ease-out ${
          isPinned ? "py-3" : "py-4"
        }`}
        innerClassName="flex items-center justify-between"
        maxWidthClass={ATTORNEY_NAV_WIDTH}
      >
        <AttorneyLogo />

        {/* Desktop navigation — 40px gap per spec */}
        <nav className="hidden items-center lg:gap-3.5 gap-10 xl:gap-10 lg:flex">
          {/* Plain <a>, not <Link>: these are same-document fragments. next/link
              routes them through the App Router, which does its own scrolling and
              bypasses the document's `scroll-behavior: smooth`. A bare anchor gets
              native fragment navigation, which honours both that and scroll-mt. */}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              // Mirrored into the ::after pseudo-element below to reserve the bold width.
              data-label={link.label}
              style={linkTypography}
              className="text-center font-medium whitespace-nowrap text-white transition-all duration-200 hover:font-bold hover:text-[#00A3FF] after:invisible after:block after:h-0 after:overflow-hidden after:font-bold after:content-[attr(data-label)]"
            >
              {link.label}
            </a>
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

          {/* Drawer toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls={DRAWER_ID}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </AttorneyContainer>
      </header>

      {/*
        Drawer and scrim live OUTSIDE <header> deliberately. While pinned the header
        carries a transform (the slide-down keyframe), and a transformed ancestor
        becomes the containing block for `position: fixed` descendants — so a drawer
        nested inside it would anchor to the header instead of the viewport, breaking
        both `h-dvh` and `left-0`.
      */}

      {/* Scrim. Kept mounted so opacity can transition; `invisible` stops it
          swallowing taps while closed. */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-out lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Panel. Also kept mounted — conditional rendering would give it no slide at
          all, since there'd be no start state to animate from. `inert` while closed
          keeps its links out of the tab order and the accessibility tree. */}
      <div
        id={DRAWER_ID}
        inert={!mobileOpen}
        className={`fixed top-0 left-0 z-50 flex h-dvh w-80 max-w-[85%] flex-col bg-black transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#363636] p-5">
          <AttorneyLogo />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-white transition-colors duration-200 hover:text-[#00A3FF]"
          >
            <X className="size-7" />
          </button>
        </div>

        {/* Scrolls if the link list outgrows a short viewport. */}
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                {/* Plain <a> for the same reason as the desktop row above. */}
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={linkTypography}
                  className="block border-b border-[#363636] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-white/5 hover:text-[#00A3FF]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="p-6">
            <Link
              href="/contact-us"
              onClick={() => setMobileOpen(false)}
              style={buttonTypography}
              className="block rounded-md bg-[#00A3FF] px-5 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-[#0091e6]"
            >
              Start a Project
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AttorneyNavbar;
