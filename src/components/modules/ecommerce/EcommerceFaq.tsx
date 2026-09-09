"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQ — copy and two CTAs on the left, an accordion on the right.
 *
 * The frame shows every row collapsed, so nothing is open on first paint. One panel at a
 * time: opening a row closes the previous one.
 *
 * The open/close transition animates a grid row from `0fr` to `1fr` rather than a
 * max-height. A max-height has to guess a value large enough for the longest answer,
 * which makes every shorter one snap early; `1fr` eases to the panel's real height.
 *
 * Answers are written here, not supplied — they are deliberately consistent with the rest
 * of this page, so the phase names match the packages section and no pricing or delivery
 * time is promised that the page does not already state.
 */

// Figma spec: Outfit SemiBold 40px / 50px, zero letter-spacing, #1E130A.
// Only the desktop size is specced; the step below it is mine.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 30px, zero letter-spacing, #5F6B7A.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 16px / 20px, zero letter-spacing, centered. Shared by both
// CTAs — they differ only in fill vs outline.
const buttonTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 18px / 26px, zero letter-spacing, #1E130A.
const questionTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

// No spec was given for the answers — the frame shows every row closed. This is the
// page's body ramp, one step down from the intro paragraph so the answer reads as
// subordinate to its question.
const answerTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

const faqs = [
  {
    question: "What services does Way-Wise provide for retail businesses?",
    answer:
      "Everything a retail business needs to sell and operate online: brand identity and a responsive website, an online store with secure checkout and customer accounts, inventory and order management, CRM and loyalty programmes, sales and performance dashboards, mobile shopping apps, and the API, payment and cloud integrations that connect them.",
  },
  {
    question: "How do I get started with my retail project?",
    answer:
      "Start with a conversation. We go through your products, customers, sales channels and operational goals, then recommend the phase that matches where your business is today — Retail Launch, Online Store Platform, or Smart Commerce Management. You are not committing to anything at that stage.",
  },
  {
    question: "Can you build a custom solution for my business?",
    answer:
      "Yes. The three phases are a starting point rather than a fixed menu. If you need a bespoke integration with an existing POS or ERP, a workflow specific to how your team works, or an internal tool that no off-the-shelf product covers, we scope and build it around your requirements.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "It depends on scope. A brand and website foundation moves fastest; a full online store with checkout, accounts and inventory takes longer; a connected commerce management system longer still. We give you a realistic timeline with milestones once we have scoped the work, rather than a figure before we understand it.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. Launch is the start of the relationship, not the end of the project. We test and launch alongside your team, support them while they settle into the new system, keep it maintained and monitored, and help you move into the next phase when you are ready to grow.",
  },
];

const EcommerceFaq = () => {
  // `null` = every row closed, which is how the frame renders.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full scroll-mt-[110px] bg-white px-4">
      {/* 1420px, matching the navbar. The two tracks are the frame's own widths — 490px
          of copy against an 866px accordion — with a 64px gutter between them. */}
      <div className="mx-auto grid w-full max-w-[1420px] items-start gap-12 py-10 lg:grid-cols-[490fr_866fr] lg:gap-16 lg:py-[100px]">
        {/* Copy column */}
        <div>
          <h2
            style={titleTypography}
            className="text-[30px] leading-[1.2] text-[#1E130A] sm:text-[36px] lg:text-[40px] lg:leading-12.5"
          >
            Everything You Need to Know About Life
          </h2>

          <p style={paragraphTypography} className="mt-5 text-[#5F6B7A]">
            If you have a question that isn&apos;t covered here, reach out and
            we&apos;ll be happy to help.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center rounded-[12px] bg-[#A07B62] px-[15px] py-[11px] whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#8a684f]"
            >
              Talk to Our Team
            </Link>
            {/* Outline variant. `border` adds 1px on each axis, so the padding is inset
                by 1px to keep both buttons exactly the same height. */}
            <Link
              href="/contact-us"
              style={buttonTypography}
              className="inline-flex items-center rounded-[12px] border border-[#DDE6F2] px-[14px] py-[10px] whitespace-nowrap text-[#A07B62] transition-colors duration-200 hover:bg-[#A07B62] hover:text-white"
            >
              Get a Free Assessment
            </Link>
          </div>
        </div>

        {/* Accordion */}
        <ul>
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const panelId = `ecommerce-faq-panel-${index}`;
            const buttonId = `ecommerce-faq-button-${index}`;

            return (
              <li key={question} className="border-b border-[#DDE6F2]">
                {/* A real <button> so the row is reachable by keyboard and announced as
                    expandable; `aria-expanded` carries the state. */}
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  {/* h3: nested under this section's h2. */}
                  <h3 style={questionTypography} className="text-[#1E130A]">
                    {question}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-[#A07B62] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* `0fr` -> `1fr` eases to the answer's real height. `overflow-hidden` on
                    the inner element is what clips it while the row is collapsed. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      style={answerTypography}
                      className="max-w-[820px] pb-5 text-[#5F6B7A]"
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

export default EcommerceFaq;
