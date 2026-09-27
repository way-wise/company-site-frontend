"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Fixed "back to top" button that is only visible while the footer it is rendered
 * inside is on screen. It observes its parent element (the <footer>).
 */
const AttorneyScrollToTop = () => {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = anchorRef.current?.parentElement;
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={anchorRef} className="hidden" aria-hidden="true" />
      <button
        type="button"
        aria-label="Scroll to top"
        tabIndex={visible ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`group fixed right-5 bottom-5 z-40 flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#00A3FF] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-[#00A3FF]/60 hover:shadow-[0_0_20px_rgba(0,163,255,0.45)] lg:right-8 lg:bottom-8 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* Glass clouds: soft blurred blobs that drift only while hovered. */}
        <span
          aria-hidden="true"
          className="scroll-top-cloud-a pointer-events-none absolute -top-2 -left-2 size-7 rounded-full bg-white/50 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="scroll-top-cloud-b pointer-events-none absolute -right-2 -bottom-2 size-6 rounded-full bg-cyan-200/50 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        />
        <ArrowUp size={20} className="relative" />
      </button>
    </>
  );
};

export default AttorneyScrollToTop;
