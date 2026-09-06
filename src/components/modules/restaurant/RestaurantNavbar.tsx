"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

/**
 * Navbar.
 *
 * Standalone to this vertical: no imports cross from the /attorney or /doctor modules,
 * so each landing page stays independently editable.
 *
 * The logo lives in `public/` rather than `src/assets/`, which is where it was supplied,
 * so it is referenced by path and needs its intrinsic size declared by hand.
 */
const LOGO = "/images/restaurant/logo.webp";
const LOGO_WIDTH = 190;
const LOGO_HEIGHT = 40;

/** Scroll depth at which the navbar detaches and pins to the viewport top. */
const STICK_AFTER_PX = 100;

/** Ties the hamburger's aria-controls to the drawer it opens. */
const DRAWER_ID = "restaurant-mobile-drawer";

// In-page anchors: this is a single-scroll landing page, so each link targets a section
// further down. Section ids must match these as the sections get built.
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Packages", href: "#packages" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact Us", href: "/contact-us" },
];

// Figma spec: Plus Jakarta Sans SemiBold 16px, line-height 100%, zero letter-spacing.
// Shared by the nav links and the CTA — only the colour differs.
const navTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

const RestaurantNavbar = () => {
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

    // Passive: this listener never calls preventDefault, so the browser is free to keep
    // scrolling without waiting on it. Re-setting the same boolean is a no-op in React,
    // so this only re-renders on the two threshold crossings.
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

  // Close the drawer on pin/unpin — leaving it open while the header jumps between flow
  // and fixed looks broken.
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
      {/* Reserves the space the header vacates when it goes fixed, so the banner below
          doesn't jump up by the header's height. */}
      {isPinned && <div style={{ height: headerHeight }} aria-hidden="true" />}

      <header
        ref={headerRef}
        // The bar is already an opaque #F3EDEA, so nothing needs to change for
        // legibility once content scrolls under it — only the shadow is added to lift
        // it off the page.
        className={
          isPinned
            ? "animate-nav-slide-down fixed inset-x-0 top-0 z-50 w-full bg-[#F3EDEA] shadow-[0_4px_20px_rgba(23,18,15,0.08)]"
            : "relative w-full bg-[#F3EDEA]"
        }
      >
        {/* 1420px per the Figma spec. The padding sits on the outer element and the cap
            on the inner one, so the bar measures exactly 1420px at wide viewports
            rather than that width minus the gutters. */}
        <div className="w-full px-4">
          <div className="mx-auto flex w-full max-w-[1420px] items-center justify-between py-[22px]">
            <Link
              href="/restaurant"
              className="inline-flex shrink-0 items-center"
              aria-label="Way Wise Tech"
            >
              <Image
                src={LOGO}
                alt="Way Wise Tech"
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                className="h-auto w-[150px] xl:w-[190px]"
                priority
              />
            </Link>

            {/*
              Menu and CTA are one right-hand cluster, so `justify-between` pushes the
              pair against the right edge with all the slack falling after the logo.
              Treating the menu as a third sibling would centre it instead.
            */}
            <div className="flex items-center gap-4 lg:gap-10 xl:gap-[75px]">
              {/* Desktop navigation — 31px gap per spec */}
              <nav className="hidden items-center gap-5 xl:gap-[31px] lg:flex">
                {/* Plain <a>, not <Link>: these are same-document fragments. next/link
                    routes them through the App Router, which does its own scrolling and
                    bypasses the document's `scroll-behavior: smooth`. A bare anchor gets
                    native fragment navigation, which honours both that and scroll-mt. */}
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={navTypography}
                    className="whitespace-nowrap text-[16px] text-[#0F1A1A] transition-colors duration-200 hover:text-[#E94222]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <Link
                href="/contact-us"
                style={navTypography}
                className="hidden items-center gap-2 rounded-[10px] bg-[#E94222] px-4 xl:px-[30px] py-3 xl:py-4 whitespace-nowrap text-white text-[14px] xl:text-[16px] transition-colors duration-200 hover:bg-[#cf3517] lg:inline-flex"
              >
                Book a Free Consultation
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>

              {/* Drawer toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="text-[#0F1A1A] transition-colors duration-200 hover:text-[#E94222] lg:hidden"
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

      {/* Scrim. Kept mounted so opacity can transition; `invisible` stops it swallowing
          taps while closed. */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#0F1A1A]/40 transition-opacity duration-300 ease-out lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Panel. Also kept mounted — conditional rendering would give it no slide at all,
          since there'd be no start state to animate from. `inert` while closed keeps its
          links out of the tab order and the accessibility tree. */}
      <div
        id={DRAWER_ID}
        inert={!mobileOpen}
        className={`fixed top-0 left-0 z-50 flex h-dvh w-80 max-w-[85%] flex-col bg-[#F3EDEA] transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#0F1A1A]/10 p-5">
          <Link
            href="/restaurant"
            onClick={() => setMobileOpen(false)}
            className="inline-flex shrink-0 items-center"
            aria-label="Way Wise Tech"
          >
            <Image
              src={LOGO}
              alt="Way Wise Tech"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              className="h-auto w-[150px]"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-[#0F1A1A] transition-colors duration-200 hover:text-[#E94222]"
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
                  className="block border-b border-[#0F1A1A]/10 px-6 py-4 text-[#0F1A1A] transition-colors duration-200 hover:bg-white/40 hover:text-[#E94222]"
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
              className="flex items-center justify-center gap-2 rounded-[10px] bg-[#E94222] px-3.5 sm:px-6 py-4 text-center text-white transition-colors duration-200 hover:bg-[#cf3517]"
            >
              Book a Free Consultation
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default RestaurantNavbar;
