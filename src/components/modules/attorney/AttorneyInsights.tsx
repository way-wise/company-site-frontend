import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import blog1 from "@/assets/images/attorney/blog1.webp";
import blog2 from "@/assets/images/attorney/blog2.webp";
import blog3 from "@/assets/images/attorney/blog3.webp";
import AttorneyContainer from "./AttorneyContainer";
import AttorneySectionHeading from "./AttorneySectionHeading";

/**
 * Section 12 — "Perspectives on Digital Product Building".
 *
 * Content is static, matching the Figma frame. The site does have a blog API
 * (src/lib/api/blogs.ts) — see the note to the user about wiring these three cards to
 * real posts instead.
 */

// Figma spec: Inter SemiBold 14px / 21px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  lineHeight: "21px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter SemiBold 10px / 100%, zero letter-spacing, uppercase, #00A3FF bg.
const badgeTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 15px / 21.45px, zero letter-spacing.
const metaTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "15px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

// Figma spec: Rajdhani Bold 24px / 100%, zero letter-spacing.
const cardHeadTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  fontSize: "24px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 16px / 21.45px, zero letter-spacing.
const cardParagraphTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

type Post = {
  image: StaticImageData;
  category: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

const posts: Post[] = [
  {
    image: blog1,
    category: "Engineering",
    readTime: "8 min read",
    date: "Aug 20, 2026",
    title: "How to Choose the Right Technology Stack",
    excerpt:
      "A practical framework for making the right stack decision the first time.",
    href: "/blog",
  },
  {
    image: blog2,
    category: "Engineering",
    readTime: "8 min read",
    date: "Aug 20, 2026",
    title: "How to Choose the Right Technology Stack",
    excerpt:
      "A practical framework for making the right stack decision the first time.",
    href: "/blog",
  },
  {
    image: blog3,
    category: "Engineering",
    readTime: "8 min read",
    date: "Aug 20, 2026",
    title: "How to Choose the Right Technology Stack",
    excerpt:
      "A practical framework for making the right stack decision the first time.",
    href: "/blog",
  },
];

const AttorneyInsights = () => {
  return (
    <section className="bg-black">
      <AttorneyContainer className="py-15 lg:py-28">
        {/* Header row: heading left, CTA pinned to the right and baseline-aligned
            with the bottom of the heading, as in the frame. */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <AttorneySectionHeading
              align="left"
              eyebrow="Insights"
              heading="Perspectives on Digital Product Building"
              headingClassName="max-w-[660px] text-[36px] leading-10 lg:text-[60px] lg:leading-[64px]"
            />
          </div>

          <Link
            href="/blog"
            style={buttonTypography}
            className="shrink-0 rounded-lg border border-[#2A2A2A] px-10 py-3.5 font-semibold text-white transition-colors duration-200 hover:border-[#00A3FF] hover:bg-[#00A3FF]"
          >
            Read All Blogs
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li
              key={`${post.title}-${index}`}
              className="rounded-2xl bg-[#151516] p-6"
            >
              <Link href={post.href} className="group block">
                <Image
                  src={post.image}
                  alt={post.title}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full rounded-lg"
                />

                {/* Meta row: badge + read time left, date pushed right. */}
                <div className="mt-6 flex items-center gap-4">
                  <span
                    style={badgeTypography}
                    className="rounded bg-[#00A3FF] px-2 py-1.5 font-semibold text-white uppercase"
                  >
                    {post.category}
                  </span>
                  <span style={metaTypography} className="text-white">
                    {post.readTime}
                  </span>
                  <span
                    style={metaTypography}
                    className="ml-auto text-[#B8B8B8]"
                  >
                    {post.date}
                  </span>
                </div>

                {/* h3: nested under this section's h2. */}
                <h3
                  style={cardHeadTypography}
                  className="mt-5 font-bold text-white transition-colors !leading-7 duration-200 group-hover:text-[#00A3FF]"
                >
                  {post.title}
                </h3>

                <p
                  style={cardParagraphTypography}
                  className="mt-3.5 text-[#B8B8B8]"
                >
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </AttorneyContainer>
    </section>
  );
};

export default AttorneyInsights;
