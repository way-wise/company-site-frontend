import { Faq } from "@/schema/faqSchema";

export type StaticFaq = Pick<
  Faq,
  "id" | "question" | "answer" | "category" | "order"
>;

/**
 * Baseline FAQs that always render on /faq, independent of the dashboard API.
 * Answers are kept as plain text (no markdown) so they are part of the
 * server-rendered HTML and stay crawlable for FAQ rich results.
 */
export const defaultFaqs: StaticFaq[] = [
  {
    id: "static-services",
    question: "What services does Way Wise Tech offer?",
    answer:
      "Way Wise Tech provides custom software development, website development, mobile app development, UI/UX design, SaaS development, AI solutions, automation, cloud services, SEO, and digital marketing.",
    category: "General",
    order: 1,
  },
  {
    id: "static-location",
    question: "Where is Way Wise Tech located?",
    answer:
      "Way Wise Tech is headquartered in California with a development center in Dubai. We serve businesses across the United States and internationally.",
    category: "General",
    order: 2,
  },
  {
    id: "static-industries",
    question: "What industries does WayWise Tech serve?",
    answer:
      "WayWise Tech develops digital solutions for startups, small and medium-sized businesses, and enterprises across multiple industries, including Legal, Healthcare, Finance, E-commerce, SaaS, and other technology-driven sectors.",
    category: "General",
    order: 3,
  },
  {
    id: "static-software-services",
    question: "What software development services does WayWise Tech offer?",
    answer:
      "We provide custom software development, web application development, mobile app development, AI software development, cloud application development, UI/UX design, website development, digital marketing, and digital transformation services.",
    category: "General",
    order: 4,
  },
  {
    id: "static-why-choose-us",
    question: "Why choose WayWise Tech as your software development partner?",
    answer:
      "WayWise Tech combines technical expertise with a business-first approach to deliver scalable, secure, and user-focused digital solutions. We work closely with clients throughout the entire development process to ensure every product supports long-term business growth.",
    category: "General",
    order: 5,
  },
];
