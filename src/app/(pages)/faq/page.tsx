import FaqAccordion, {
  FaqAccordionItem,
} from "@/components/modules/faq/FaqAccordion";
import PageHeader from "@/components/shared/PageHeader";
import { defaultFaqs } from "@/datas/faqs";
import { getAllFaqs } from "@/lib/api/faqs";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicMetadata("faq", {
    title: "FAQ | Frequently Asked Questions | Way Wise Tech",
    description:
      "Find answers to commonly asked questions about our web development services, processes, pricing, and support.",
    keywords: [
      "FAQ",
      "frequently asked questions",
      "web development FAQ",
      "software development questions",
    ],
    path: "/faq",
  });
}

const normalizeQuestion = (question: string) =>
  question.toLowerCase().replace(/[^a-z0-9]/g, "");

// Markdown answers from the dashboard are flattened before going into JSON-LD.
const toPlainText = (value: string) =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#|~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const FaqPage = async () => {
  const apiFaqs = await getAllFaqs();

  // Static FAQs always render; dashboard FAQs are appended unless they repeat one.
  const staticQuestions = new Set(
    defaultFaqs.map((faq) => normalizeQuestion(faq.question)),
  );
  const items: (FaqAccordionItem & { category: string })[] = [
    ...defaultFaqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "General",
      isMarkdown: false,
    })),
    ...apiFaqs
      .filter((faq) => !staticQuestions.has(normalizeQuestion(faq.question)))
      .map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "General",
        isMarkdown: true,
      })),
  ];

  // Group by category
  const groupedFaqs = items.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

  // Default priority categories to show first if they exist
  const priorityCategories = ["General", "Technical", "Process"];
  const otherCategories = Object.keys(groupedFaqs).filter(
    (cat) => !priorityCategories.includes(cat),
  );
  const sortedCategories = [
    ...priorityCategories.filter((c) => groupedFaqs[c]),
    ...otherCategories,
  ];

  // Each question renders as an h3 (Radix accordion header), so every block
  // keeps an h2 above it — otherwise the page skips from the h1 straight to h3.
  const showCategoryHeadings = sortedCategories.length > 1;

  // Numbering runs continuously across category blocks.
  const categoryOffsets: Record<string, number> = {};
  sortedCategories.reduce((offset, category) => {
    categoryOffsets[category] = offset;
    return offset + groupedFaqs[category].length;
  }, 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(faq.answer),
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHeader
        titleAs="h1"
        title="FREQUENTLY"
        description="ASKED QUESTIONS"
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="container mx-auto max-w-4xl px-2">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-brand uppercase">
              Got Questions?
            </span>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
              Find answers to the most commonly asked questions about our
              services, processes, and how we can help transform your business
              with technology
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              No FAQs found. Check back later!
            </div>
          ) : (
            sortedCategories.map((category, categoryIndex) => (
              <div key={category} className="mb-10 last:mb-0">
                <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-gray-900">
                  <span className="h-6 w-1.5 rounded-full bg-brand" />
                  {showCategoryHeadings
                    ? `${category} Questions`
                    : "Common Questions"}
                </h2>
                <FaqAccordion
                  items={groupedFaqs[category]}
                  startIndex={categoryOffsets[category]}
                  openFirst={categoryIndex === 0}
                />
              </div>
            ))
          )}

          {/* Contact CTA */}
          <div className="mt-16 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 text-center">
            {/* h2: a top-level section, sibling of the FAQ category headings above.
                As an h3 it skipped a level whenever no FAQ categories were rendered. */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Still Have Questions?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-700">
              Can&apos;t find the answer you&apos;re looking for? Our team is
              here to help! Reach out to us and we&apos;ll get back to you as
              soon as possible.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand/90"
              >
                Contact Us
              </a>
              <a
                href="mailto:info@waywisetech.com"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-8 py-3 font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FaqPage;
