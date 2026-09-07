"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQ accordion.
 *
 * Client component: which panel is open is local state. One panel at a time — opening
 * another closes the current one.
 *
 * Each answer expands via a 0fr -> 1fr grid row rather than max-height, so it eases to
 * the answer's real height instead of an arbitrary guess that would clip or overshoot.
 * The panel stays in the DOM either way, so it is searchable and keeps its `aria`
 * relationship with the trigger.
 *
 * NOTE ON COPY: only question 02's answer appears in the Figma frame and is reproduced
 * verbatim. The other four were written to match its voice — flagged to the user, since
 * they are claims about the business rather than supplied copy.
 */

// Same ramp as the other sections on this page: Plus Jakarta Sans ExtraBold 48px / 60px,
// -1.2px letter-spacing, centered. Only the desktop size is specced.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "-1.2px",
} as const;

// Same ramp as the other sections: Plus Jakarta Sans Medium 18px / 28px, centered.
const introTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Bold 16px / 24px, uppercase, #B6D500.
const numberTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans SemiBold 30px / 100%, #FFFFFF.
const questionTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 600,
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 28px, #F7F8F3.
const answerTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  lineHeight: "28px",
  letterSpacing: "0",
} as const;

const faqs = [
  {
    question: "What services does Way Wise Tech offer?",
    answer:
      "We cover brand identity, websites, booking and customer-communication tools, mobile apps, and full service-management platforms. Most clients start with one of those and add the rest as they grow.",
  },
  {
    question: "How do I get started with your services?",
    // Reproduced verbatim from the Figma frame.
    answer:
      "Start by contacting us through our website and telling us about your project or business needs. Our team will review your requirements and schedule a consultation to recommend the right solution.",
  },
  {
    question: "Do you build custom solutions for different industries?",
    answer:
      "Yes. We work with plumbing, restaurent, attorney, medical, retail, and real estate businesses, and we shape each solution around how your trade actually operates rather than fitting you to a template.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "It depends on scope. A focused launch package moves faster than a connected management platform, so we give you a timeline alongside the proposal once we understand what you need.",
  },
  {
    question: "Do you provide support after the project is launched?",
    answer:
      "Yes. We stay available after launch for improvements, updates, integrations, and whatever the next stage of growth needs — launch is the start of the relationship, not the end of it.",
  },
];

const PlumberFaq = () => {
  // The first panel is open on load; clicking it closes it, and opening another closes
  // whichever was open.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-10 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.2] text-[#0C2F25] sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
          style={titleTypography}
        >
          Everything You Need to Know
        </h2>

        <p
          className="mx-auto mt-5 max-w-[720px] text-center text-[#4B5563]"
          style={introTypography}
        >
          Find quick answers about our services, process, pricing, support, and
          how Way Wise Tech can help bring your digital ideas to life.
        </p>

        <ul className="mt-[60px] flex flex-col gap-6">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = index === openIndex;
            const panelId = `plumber-faq-panel-${index}`;
            const triggerId = `plumber-faq-trigger-${index}`;
            // "QUESTION -01" — the label runs from 01, not 0.
            const label = `Question -${String(index + 1).padStart(2, "0")}`;

            return (
              <li
                key={question}
                // #1B211D at 70% (the B2 alpha suffix) expressed as a Tailwind opacity
                // modifier — same colour, fewer magic hex digits.
                className="rounded-[16px] bg-[#1B211D]/70 p-8"
              >
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-6 text-left"
                >
                  <span>
                    <span
                      className="block text-[14px] sm:text-[16px] text-[#B6D500] uppercase"
                      style={numberTypography}
                    >
                      {label}
                    </span>

                    {/* h3: nested under this section's h2. 26px below the label. */}
                    <h3
                      className="mt-[26px] text-[18px] text-white sm:text-[26px] lg:text-[30px]"
                      style={questionTypography}
                    >
                      {question}
                    </h3>
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`mt-12 size-6 shrink-0 text-white transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/*
                  The outer grid animates 0fr -> 1fr, which eases to the answer's own
                  height; the inner element must carry `overflow-hidden` for the
                  collapsed row to actually clip it.
                */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* 14px below the question. */}
                    <p
                      className="mt-[14px] text-[14px] sm:text-[18px] text-[#F7F8F3]"
                      style={answerTypography}
                    >
                      {answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default PlumberFaq;
