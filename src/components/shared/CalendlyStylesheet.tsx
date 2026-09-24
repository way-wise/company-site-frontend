"use client";

import { useEffect } from "react";

const CALENDLY_CSS_HREF =
  "https://assets.calendly.com/assets/external/widget.css";

/**
 * Loads the Calendly widget stylesheet via a plain DOM append after mount, instead of
 * an SSR-ed <link> in <head>. Some browser extensions (dark-mode ones in particular)
 * mutate <link> tags in <head> between SSR and hydration, which React's hydration
 * mismatch check can't ignore for inserted child nodes. Appending outside React's
 * render tree sidesteps that entirely.
 */
export default function CalendlyStylesheet() {
  useEffect(() => {
    if (document.querySelector(`link[href="${CALENDLY_CSS_HREF}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS_HREF;
    document.head.appendChild(link);
  }, []);

  return null;
}
