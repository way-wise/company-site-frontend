"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Headset, PhoneCall } from "lucide-react";
import faqThumb from "@/assets/images/attorney/faq-thumb.webp";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";

/**
 * Section 14 — "Everything You Need to Know".
 *
 * Client component: the accordion tracks which item is open.
 *
 * Questions are the placeholder set from the Figma frame. The site has a FAQ API
 * (src/lib/api/faqs.ts) — see the note to the user about sourcing these for real.
 */

// Figma spec: Inter Medium 16px / 100%, zero letter-spacing. Underlined on the links
// only — the phone number and "24/7" are not underlined in the frame.
const supportTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 18px / 24px, zero letter-spacing, uppercase.
const metaTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "18px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani SemiBold 24px / 100%, zero letter-spacing.
//
// fontSize deliberately omitted here and set in classes instead (20px below md, 24px
// from md up): an inline style beats any class, so keeping it in this object would make
// the responsive size impossible to override. lineHeight stays as a percentage, so it
// tracks whichever size wins.
const questionTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  lineHeight: "26px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 14px / 20px, zero letter-spacing, #B6B9C2.
const answerTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

type Faq = {
  question: string;
  answer: string;
  /**
   * Thumbnail shown beside the answer while the item is open. Per-item on purpose:
   * every entry currently points at the same placeholder, so swapping any single one
   * for its own artwork is a one-line change with no structural work.
   *
   * Optional, so an item with no image renders answer-only without a gap.
   */
  image?: StaticImageData;
};

const ANSWER =
  "You can get started by contacting us through website or requesting a consultation. Our team will understand your requirements.";

const faqs: Faq[] = [
  {
    question: "What services does Way Wise Tech Offer?",
    answer: ANSWER,
    image: faqThumb,
  },
  {
    question: "How do I get started with your services?",
    answer: ANSWER,
    image: faqThumb,
  },
  {
    question: "What services does Way Wise Tech Offer?",
    answer: ANSWER,
    image: faqThumb,
  },
  {
    question: "What services does Way Wise Tech Offer?",
    answer: ANSWER,
    image: faqThumb,
  },
  {
    question: "What services does Way Wise Tech Offer?",
    answer: ANSWER,
    image: faqThumb,
  },
];

/** Item 02 is the one shown expanded in the frame. */
const DEFAULT_OPEN = 1;

const SupportBox = ({
  icon,
  value,
  linkLabel,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  linkLabel: string;
  href: string;
}) => (
  <div className="flex flex-1 flex-col justify-between gap-10 rounded-xl bg-[#007AFF] p-4 xl:p-6.25">
    <span className="text-white">{icon}</span>
    <div>
      <p style={supportTypography} className="font-medium text-white">
        {value}
      </p>
      <Link
        href={href}
        style={supportTypography}
        className="mt-3 inline-block font-medium text-white underline decoration-solid hover:no-underline"
      >
        {linkLabel}
      </Link>
    </div>
  </div>
);

const AttorneyFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(DEFAULT_OPEN);

  return (
    <section id="faqs" className="scroll-mt-24 bg-black">
      <AttorneyContainer className="py-15 lg:py-28">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* Left: heading + support boxes */}
          <div>
            <AttorneySectionHeading
              align="left"
              eyebrow="FAQ's"
              heading="Everything You Need to Know"
              headingClassName="text-[36px] leading-10 lg:text-[60px] lg:leading-[64px]"
            />

            {/* Stacked below sm: side by side, each box was ~137px wide on a 375px
                viewport, and after 25px of padding either side "+1 (310) 528 6170"
                had nowhere to go. */}
            <div className="mt-10 flex max-w-105 gap-3.5 flex-row lg:mt-32">
              <SupportBox
                icon={<PhoneCall className="size-9" aria-hidden="true" />}
                value="+1 (310) 528 6170"
                linkLabel="Contact Support"
                href="tel:+13105286170"
              />
              <SupportBox
                icon={<Headset className="size-9" aria-hidden="true" />}
                value="24/7"
                linkLabel="Support Center"
                href="/contact-us"
              />
            </div>
          </div>

          {/* Right: accordion */}
          <ul className="overflow-hidden rounded-2xl border border-[#363636]">
            {faqs.map((faq, index) => {
              const isOpen = index === openIndex;
              const number = String(index + 1).padStart(2, "0");
              const panelId = `attorney-faq-panel-${index}`;
              const buttonId = `attorney-faq-button-${index}`;

              return (
                <li
                  key={`${faq.question}-${index}`}
                  className={`px-5 py-6 not-last:border-b not-last:border-[#363636] md:px-8 md:py-8 ${
                    isOpen ? "bg-[#222222]" : "bg-[#151516]"
                  }`}
                >
                  {/*
                    md+ : two columns — a fixed 144px gutter and the content column.
                          The thumbnail lives in the gutter, not the content flow, so an
                          open item's question still lines up with the closed ones.
                    < md: stacked. A 144px gutter on a ~375px viewport left the question
                          about 143px wide and it wrapped one word per line, so below md
                          the gutter becomes a full-width row and the copy gets the lot.
                  */}
                  <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    {/* Gutter: number + rule, with the thumbnail beneath when open. */}
                    <div className="md:w-36 md:shrink-0">
                      <div className="flex items-center gap-3">
                        <span style={metaTypography} className="text-[#00A3FF]">
                          {number}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-px w-20 bg-[#00A3FF] md:w-auto md:flex-1"
                        />
                      </div>

                      {/* Hidden below md: stacked, it would sit between the rule and
                          the question, which reads oddly — and it is decorative. */}
                      {isOpen && faq.image && (
                        <Image
                          src={faq.image}
                          alt=""
                          className="mt-5 hidden h-auto w-full rounded-md md:block"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Label sits outside the button so each question's accessible
                          name stays the question alone, not "QUESTION -01 What…". */}
                      <span
                        style={metaTypography}
                        className="block text-[#00A3FF] uppercase"
                      >
                        Question -{number}
                      </span>

                      {/* <h3> wraps the <button>, not the other way round: a button may
                          only contain phrasing content, so a heading inside it is
                          invalid HTML. */}
                      <h3 className="mt-3 md:mt-5">
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() =>
                            setOpenIndex(isOpen ? null : index)
                          }
                          style={questionTypography}
                          // gap-3 not gap-6 on mobile: the wider gap was stealing
                          // width the wrapping question needed.
                          className="flex w-full items-start justify-between gap-3 text-left text-[20px] font-semibold text-white transition-colors duration-200 hover:text-[#00A3FF] md:items-center md:gap-6 md:text-[24px]"
                        >
                          {faq.question}
                          <ChevronDown
                            aria-hidden="true"
                            className={`mt-1 size-5 shrink-0 text-white transition-transform duration-300 md:mt-0 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </h3>

                      {isOpen && (
                        <p
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          style={answerTypography}
                          className="mt-4 text-[#B6B9C2]"
                        >
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyFaq;
