"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";

import { FaqAnswer } from "@/app/(pages)/_components/faq-answer";

export interface FaqAccordionItem {
  id: string;
  question: string;
  answer: string;
  /** Answers coming from the dashboard are markdown; static ones are plain text. */
  isMarkdown?: boolean;
}

interface FaqAccordionProps {
  items: FaqAccordionItem[];
  /** Numbering continues across category blocks. */
  startIndex?: number;
  /** Open the first item on load — useful for the first block on the page. */
  openFirst?: boolean;
}

const FaqAccordion = ({
  items,
  startIndex = 0,
  openFirst = false,
}: FaqAccordionProps) => {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={openFirst && items.length > 0 ? items[0].id : undefined}
      className="flex flex-col gap-4"
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-md data-[state=open]:border-brand/50 data-[state=open]:shadow-lg data-[state=open]:shadow-brand/5"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="group/trigger flex flex-1 items-start gap-4 px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 md:px-6">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand transition-colors duration-300 group-data-[state=open]/trigger:bg-brand group-data-[state=open]/trigger:text-white">
                {String(startIndex + index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover/trigger:text-brand group-data-[state=open]/trigger:text-brand md:text-lg">
                {item.question}
              </span>

              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 group-hover/trigger:border-brand group-hover/trigger:text-brand group-data-[state=open]/trigger:border-brand group-data-[state=open]/trigger:bg-brand group-data-[state=open]/trigger:text-white">
                <Plus
                  className="h-4 w-4 group-data-[state=open]/trigger:hidden"
                  aria-hidden="true"
                />
                <Minus
                  className="hidden h-4 w-4 group-data-[state=open]/trigger:block"
                  aria-hidden="true"
                />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          {/* forceMount keeps every answer in the server HTML (crawlable).
              h-0 collapses closed panels before hydration — Radix only adds the
              hidden attribute on the client, so without it every answer would
              flash open on first paint. Animation keyframes override h-0. */}
          <AccordionPrimitive.Content
            forceMount
            className="overflow-hidden data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          >
            <div className="px-5 pb-6 md:px-6 md:pl-18">
              <div className="border-t border-gray-100 pt-4">
                {item.isMarkdown ? (
                  <FaqAnswer answer={item.answer} />
                ) : (
                  <p className="text-[15px] leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                )}
              </div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};

export default FaqAccordion;
