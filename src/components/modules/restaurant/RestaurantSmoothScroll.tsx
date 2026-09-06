"use client";

import { useEffect } from "react";

/**
 * Enables smooth scrolling for this route only.
 *
 * `scroll-behavior` has to sit on the scrolling element — the document root — so it
 * cannot be scoped with a CSS class. Setting it from an effect and restoring the
 * previous value on unmount keeps it confined to /restaurant instead of applying to the
 * whole site via globals.css.
 *
 * Pairs with the `scroll-mt-[110px]` on each anchor target. That figure is the pinned
 * navbar's height — 22px padding, a 48px control, 22px padding, ≈92px — plus a little
 * breathing room, so a section heading lands below the bar instead of underneath it.
 */
const RestaurantSmoothScroll = () => {
  useEffect(() => {
    // Honour the OS-level motion preference: a long animated scroll is exactly the
    // kind of movement that triggers discomfort.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";

    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return null;
};

export default RestaurantSmoothScroll;
