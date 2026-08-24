"use client";

import { useEffect } from "react";

/**
 * Enables smooth scrolling for this route only.
 *
 * `scroll-behavior` has to sit on the scrolling element — the document root — so it
 * cannot be scoped with a CSS class. Setting it from an effect and restoring the
 * previous value on unmount keeps it confined to /attorney instead of applying to the
 * whole site via globals.css.
 *
 * Pairs with the `scroll-mt-24` on each anchor target, which offsets the landing point
 * so headings don't end up under the pinned navbar.
 */
const AttorneySmoothScroll = () => {
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

export default AttorneySmoothScroll;
