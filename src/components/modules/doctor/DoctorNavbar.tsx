"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import logo from "@/assets/images/doctor/logo.webp";

/** Scroll depth at which the navbar detaches and pins to the viewport top. */
const STICK_AFTER_PX = 100;

/** Ties the hamburger's aria-controls to the drawer it opens. */
const DRAWER_ID = "doctor-mobile-drawer";

// In-page anchors: this is a single-scroll landing page, so each link targets a
// section further down. Section ids must match these as the sections get built.
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Packages", href: "#packages" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact Us", href: "#contact-us" },
];

// Figma spec: Urbanist SemiBold 16px, line-height 100%, zero letter-spacing.
// Shared by the nav links and the CTA — only the colour differs.
const navTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

const DoctorNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Height is measured rather than hardcoded: it changes with the logo's responsive
  // sizing, and a wrong value shows up as a jump in the content below.
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const isPinnedRef = useRef(false);

  useEffect(() => {
    // Only measure while unpinned: that is the height the document actually loses.
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
      {/* Reserves the space the header vacates when it goes fixed, so the section
          below doesn't jump up by the header's height. */}
      {isPinned && <div style={{ height: headerHeight }} aria-hidden="true" />}

      {/* No id="home" here: once pinned this element is `position: fixed` at the
          viewport top, so a fragment jump to it resolves to a zero-distance scroll and
          the Home link would do nothing. The banner section carries that id instead. */}
      <header
        ref={headerRef}
        className={
          isPinned
            ? "animate-nav-slide-down fixed inset-x-0 top-0 z-50 w-full py-3"
            : "relative w-full py-3"
        }
      >
        {/* 1420px per the Figma spec. The padding sits on the outer element and the
            cap on the inner one, so the bar measures exactly 1420px at wide viewports
            rather than that width minus the gutters. */}
        <div className="w-full px-4">
          <div
            /*
             * The bar is its own pill rather than a full-bleed strip: the Figma fill is
             * #F2F5FF at 60% (99) over a 70% white (B2) hairline border.
             *
             * That translucency only holds while the bar sits at rest over the hero.
             * Once pinned it goes OPAQUE, because the blur that would otherwise keep it
             * legible cannot work there: the pinned <header> carries the slide-down
             * keyframe, whose `forwards` fill leaves a `transform` on it permanently. A
             * transformed ancestor starts a new backdrop root, so `backdrop-filter` on
             * this child samples only what is painted inside the header — nothing — and
             * silently blurs nothing at all. Page content then reads straight through
             * the 60% fill, which is what made the menu unreadable over the sections.
             */
            className={`mx-auto flex w-full max-w-[1420px] items-center justify-between rounded-full border border-[#FFFFFFB2] py-[22px] pr-8 pl-[30px] transition-shadow duration-300 ${
              isPinned
                ? "bg-[#F2F5FF] shadow-[0_4px_20px_rgba(1,17,57,0.08)]"
                : "bg-[#F2F5FF99] backdrop-blur-xl"
            }`}
          >
            <Link
              href="/doctor"
              className="inline-flex shrink-0 items-center"
              aria-label="Way Wise Tech"
            >
              <Image
                src={logo}
                alt="Way Wise Tech"
                // Intrinsic size is 190x40; width/height come from the static import,
                // so only the rendered width is set here and the height follows.
                className="h-auto w-[150px] xl:w-[190px]"
                priority
              />
            </Link>

            {/* Desktop navigation — 31px gap per spec */}
            <nav className="hidden items-center gap-[31px] lg:flex">
              {/* Plain <a>, not <Link>: these are same-document fragments. next/link
                  routes them through the App Router, which does its own scrolling and
                  bypasses the document's `scroll-behavior: smooth`. A bare anchor gets
                  native fragment navigation, which honours both that and scroll-mt. */}
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={navTypography}
                  className="whitespace-nowrap text-[#011139] transition-colors duration-200 hover:text-[#3191EA]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/contact-us"
                style={navTypography}
                className="hidden items-center gap-5 rounded-full bg-[#3191EA] px-[30px] py-[15px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#1f7fd4] lg:inline-flex"
              >
                Get Started
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>

              {/* Drawer toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="text-[#011139] transition-colors duration-200 hover:text-[#3191EA] lg:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls={DRAWER_ID}
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
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
        className={`fixed inset-0 z-40 bg-[#011139]/40 transition-opacity duration-300 ease-out lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Panel. Also kept mounted — conditional rendering would give it no slide at
          all, since there'd be no start state to animate from. `inert` while closed
          keeps its links out of the tab order and the accessibility tree.

          Same #F2F5FF99 as the bar; the blur is what makes a 60%-alpha panel opaque
          enough to read against whatever it covers. */}
      <div
        id={DRAWER_ID}
        inert={!mobileOpen}
        className={`fixed top-0 left-0 z-50 flex h-dvh w-80 max-w-[85%] flex-col border-r border-[#FFFFFFB2] bg-[#F2F5FF99] backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#FFFFFFB2] p-5">
          <Link
            href="/doctor"
            onClick={() => setMobileOpen(false)}
            className="inline-flex shrink-0 items-center"
            aria-label="Way Wise Tech"
          >
            <Image src={logo} alt="Way Wise Tech" className="h-auto w-[150px]" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-[#011139] transition-colors duration-200 hover:text-[#3191EA]"
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
                  style={navTypography}
                  className="block border-b border-[#FFFFFFB2] px-6 py-4 text-[#011139] transition-colors duration-200 hover:bg-white/40 hover:text-[#3191EA]"
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
              style={navTypography}
              className="flex items-center justify-center gap-2 rounded-full bg-[#3191EA] px-[30px] py-[15px] text-center text-white transition-colors duration-200 hover:bg-[#1f7fd4]"
            >
              Get Started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DoctorNavbar;
