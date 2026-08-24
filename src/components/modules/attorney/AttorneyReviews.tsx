"use client";

import { useEffect, useState } from "react";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";

/**
 * Section 13 — "What Our Legal Clients Say About Working With Us".
 *
 * Client component: the slider tracks its own position.
 *
 * Content is the placeholder copy from the Figma frame — see the note to the user.
 */

// Figma spec: Instrument Sans Regular 16px / 100%, zero letter-spacing, centred.
const quoteTypography = {
  fontFamily: "var(--font-instrument-sans), sans-serif",
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Instrument Sans Medium 16px / 100%, zero letter-spacing, #F5F5F5.
const nameTypography = {
  fontFamily: "var(--font-instrument-sans), sans-serif",
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Instrument Sans Regular 14px / 100%, zero letter-spacing.
const roleTypography = {
  fontFamily: "var(--font-instrument-sans), sans-serif",
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

/** Card gap, per spec. Also drives the slider's step arithmetic below. */
const GAP_PX = 30;

const reviews = [
  {
    id: 1,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
  {
    id: 2,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
  {
    id: 3,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
  {
    id: 4,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
  {
    id: 5,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
  {
    id: 6,
    quote:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus",
    name: "Jhon doe",
    role: "CEO @ meta",
  },
];

/** Widest breakpoint first — the first match wins. */
const VISIBLE_AT = [
  { query: "(min-width: 1024px)", count: 3 },
  { query: "(min-width: 640px)", count: 2 },
];

const Arrow = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#B8B8B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-4"
  >
    {direction === "left" ? (
      <path d="M19 12H5M5 12l6-6M5 12l6 6" />
    ) : (
      <path d="M5 12h14M19 12l-6-6M19 12l-6 6" />
    )}
  </svg>
);

const AttorneyReviews = () => {
  // Defaults to the desktop count so the server render matches the design's 3-up
  // layout; the effect corrects it on narrower viewports after mount.
  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sync = () => {
      const match = VISIBLE_AT.find((bp) => window.matchMedia(bp.query).matches);
      setVisible(match ? match.count : 1);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visible);

  // Rotating to a narrower viewport shrinks `visible`, which can leave `index` past
  // the new end and scroll the track into empty space.
  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  return (
    <section
      id="reviews"
      // scroll-mt clears the pinned navbar so this section's heading isn't hidden
      // beneath it when the nav link jumps here.
      className="scroll-mt-24"
      // Mesh backdrop: warm orange left, magenta across the top, blue right, over a
      // deep plum base. Eyeballed from the Figma export — no values were given.
      style={{
        background:
          "radial-gradient(42% 46% at 7% 46%, rgba(196,71,42,0.95) 0%, rgba(196,71,42,0) 70%), radial-gradient(36% 42% at 29% 0%, rgba(194,48,107,0.9) 0%, rgba(194,48,107,0) 70%), radial-gradient(40% 40% at 62% 0%, rgba(211,63,134,0.85) 0%, rgba(211,63,134,0) 70%), radial-gradient(46% 62% at 100% 34%, rgba(74,111,196,0.95) 0%, rgba(74,111,196,0) 70%), radial-gradient(55% 55% at 48% 105%, rgba(24,12,40,0.95) 0%, rgba(24,12,40,0) 72%), #2A1440",
      }}
    >
      <AttorneyContainer className="py-15 lg:py-28">
        <AttorneySectionHeading
          eyebrow="Client Reviews"
          heading="What Our Legal Clients Say About Working With Us"
          headingClassName="text-[34px] leading-10 lg:text-[60px] lg:leading-[64px]"
        />

        {/* Viewport clips the track; the track slides by whole cards. */}
        <div className="mt-14 overflow-hidden">
          <ul
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: `${GAP_PX}px`,
              // Each card is (100% - (visible-1)*gap)/visible wide, so one step is
              // card + gap, which reduces to (100% + gap)/visible.
              transform: `translateX(calc(${-index} * (100% + ${GAP_PX}px) / ${visible}))`,
            }}
          >
            {reviews.map((review) => (
              <li
                key={review.id}
                className="shrink-0 basis-full rounded-2xl border border-[#C41E3A]/50 bg-[#000000]/20 p-6 sm:basis-[calc((100%-30px)/2)] lg:basis-[calc((100%-60px)/3)]"
              >
                {/* Decorative glyph, not read aloud — it's punctuation, not content. */}
                <div className="flex justify-center pb-2">
                   <svg width="42" height="39" viewBox="0 0 42 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.9462 31.1395C40.9462 33.4574 40.1936 35.3721 38.6882 36.8837C37.2832 38.2946 35.4265 39 33.1183 39C30.81 39 28.9032 38.1938 27.3978 36.5814C25.8925 34.969 25.1398 32.6008 25.1398 29.4767C25.1398 25.5465 26.3441 20.9612 28.7527 15.7209C31.2617 10.4806 34.6237 5.24031 38.8387 0L42 2.8721C38.8889 7.00388 36.6308 10.7326 35.2258 14.0581C33.8208 17.283 33.0179 20.3566 32.8172 23.2791H33.1183C35.4265 23.2791 37.2832 24.0349 38.6882 25.5465C40.1936 26.9574 40.9462 28.8217 40.9462 31.1395ZM15.6559 31.1395C15.6559 33.4574 14.9534 35.3721 13.5484 36.8837C12.1434 38.2946 10.2867 39 7.9785 39C5.67025 39 3.76344 38.1938 2.25806 36.5814C0.752688 34.969 0 32.6008 0 29.4767C0 25.5465 1.2043 20.9612 3.6129 15.7209C6.02151 10.4806 9.33333 5.24031 13.5484 0L16.8602 2.8721C13.7491 7.00388 11.4409 10.7326 9.93548 14.0581C8.53047 17.283 7.7276 20.3566 7.52688 23.2791H7.9785C10.2867 23.2791 12.1434 24.0349 13.5484 25.5465C14.9534 26.9574 15.6559 28.8217 15.6559 31.1395Z" fill="#EC221F"/>
                  </svg>
                </div>

                <blockquote className="mt-2">
                  <p
                    style={{ ...quoteTypography, lineHeight: "1.4" }}
                    className="text-center text-white"
                  >
                    {review.quote}
                  </p>
                  <footer className="mt-7">
                    <p
                      style={nameTypography}
                      className="text-center font-medium text-[#F5F5F5]"
                    >
                      {review.name}
                    </p>
                    <p
                      style={roleTypography}
                      className="mt-2.5 text-center text-[#B8B8B8]"
                    >
                      {review.role}
                    </p>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls: arrows flanking the dot rail */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="Previous reviews"
            className="flex w-10 h-10 items-center justify-center border border-[#2A2A2A] text-white transition-colors duration-200 hover:border-[#00A3FF] hover:text-[#00A3FF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2A2A2A] disabled:hover:text-white"
          >
            <Arrow direction="left" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => setIndex(dot)}
                aria-label={`Go to slide ${dot + 1}`}
                aria-current={dot === index || undefined}
                className={
                  dot === index
                    ? "h-2 w-6 bg-[#00A3FF] transition-all duration-200"
                    : "size-2 bg-[#2A2A2A] transition-all duration-200 hover:bg-[#6A6A6A]"
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index >= maxIndex}
            aria-label="Next reviews"
            className="flex w-10 h-10 items-center justify-center border border-[#2A2A2A] text-white transition-colors duration-200 hover:border-[#00A3FF] hover:text-[#00A3FF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2A2A2A] disabled:hover:text-white"
          >
            <Arrow direction="right" />
          </button>
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyReviews;
