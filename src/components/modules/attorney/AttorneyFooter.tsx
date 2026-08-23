import Link from "next/link";
import AttorneyContainer from "./AttorneyContainer";
import AttorneyLogo from "./AttorneyLogo";

/**
 * Section 7 — footer.
 *
 * Standalone: deliberately not the shared <Footer />, which has its own light
 * background and layout.
 *
 * NOTE ON HREFS: entries marked `href: "#"` have no destination yet — the site has no
 * matching route. They are listed in the message to the user for a decision; do not
 * treat them as finished links.
 */

// Figma spec: Inter Regular 15px / 21.45px, zero letter-spacing, #B8B8B8.
const bodyTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "15px",
  lineHeight: "21.45px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Bold 20px / 24px, zero letter-spacing.
const headingTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "20px",
  lineHeight: "24px",
  letterSpacing: "0",
} as const;

// Individual service pages are dynamic (/services/[serviceId], ids come from the API),
// so every service entry points at the /services index rather than guessing a slug.
const serviceLinks = [
  { label: "UI/UX & Product Design", href: "/services" },
  { label: "Custom Software Development", href: "/services" },
  { label: "Web Development", href: "/services" },
  { label: "Mobile App Development", href: "/services" },
  { label: "AI, Data & Automation", href: "/services" },
  { label: "Branding & Digital Growth", href: "/services" },
  { label: "Cloud, API & DevOps", href: "/services" },
  { label: "Support & Maintenance", href: "/services" },
];

const industryLinks = [
  { label: "Healthcare & Medical", href: "/medical-it-support" },
  { label: "Legal & Professional Services", href: "/attorney" },
  { label: "Real Estate & Construction", href: "#" },
  { label: "Finance, Insurance & Accounting", href: "#" },
  { label: "Retail, E-commerce & Logistics", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "How We Work", href: "#" },
  { label: "Our Team", href: "#" },
  { label: "Global Delivery", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Insights", href: "/blog" },
  { label: "Our Work", href: "#" },
];

const legalLinks = [
  { label: "Cookie Policy", href: "#" },
  { label: "Terms of Service", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

// Inline SVG paths rather than lucide's Facebook/Linkedin/Youtube components, which
// are deprecated in lucide-react (brand marks are being removed from the set). The
// shared site Footer hand-rolls its social SVGs for the same reason.
const socialPaths = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
} as const;

// URLs taken from the existing shared Footer so they are real, not invented.
const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/waywisetech",
    path: socialPaths.linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/WayWiseTech/",
    path: socialPaths.facebook,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@WayWiseTech",
    path: socialPaths.youtube,
  },
];

const LinkColumn = ({
  heading,
  links,
  cta,
}: {
  heading: string;
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
}) => (
  <div>
    {/* h2: siblings of the other footer column headings, under the page h1. */}
    <h2 className="mb-6 font-bold text-white" style={headingTypography}>
      {heading}
    </h2>
    <ul className="flex flex-col gap-3.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            style={bodyTypography}
            className="text-[#B8B8B8] transition-colors duration-200 hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
    <Link
      href={cta.href}
      style={bodyTypography}
      className="mt-6 inline-block font-bold text-white transition-colors duration-200 hover:text-[#00A3FF]"
    >
      {cta.label}
    </Link>
  </div>
);

const AttorneyFooter = () => {
  return (
    <footer className="bg-black">
      <AttorneyContainer className="pt-16 pb-8">
        {/* The three menu columns sit hard right: they are `auto`, so each is only as
            wide as its own longest link, while the brand column takes `1fr` and absorbs
            all the slack in between. Fixed fr ratios were wrong here — they stretched
            the menu tracks and pulled the group leftward, away from the right edge. */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-x-14">
          <div className="max-w-146.5">
            <AttorneyLogo />

            <p className="mt-7 text-[#B8B8B8]" style={bodyTypography}>
              A global technology company designing and building digital
              products for ambitious businesses in the USA, UAE, and worldwide.
            </p>

            <ul className="mt-7 flex items-center gap-3">
              {socials.map(({ label, href, path }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-md border border-[#3A3A3A] text-[#B8B8B8] transition-colors duration-200 hover:border-[#00A3FF] hover:text-[#00A3FF]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            {/* "Start a Conversation" card */}
            <div className="mt-10 rounded-lg border border-[#4A4A4A] bg-[#333333] p-4">
              <p className="mb-3.5 text-[#B8B8B8]" style={bodyTypography}>
                Start a Conversation
              </p>
              <Link
                href="/contact-us"
                style={bodyTypography}
                className="block rounded-md bg-[#00A3FF] py-3 text-center text-white transition-colors duration-200 hover:bg-[#0091e6] font-medium !text-[14px]"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <LinkColumn
            heading="Services"
            links={serviceLinks}
            cta={{ label: "View All Services", href: "/services" }}
          />
          <LinkColumn
            heading="Industries"
            // Label reproduced from the Figma frame, which repeats "View All Services"
            // here — flagged to the user as a probable copy slip.
            links={industryLinks}
            cta={{ label: "View All Services", href: "/services" }}
          />
          <LinkColumn
            heading="Company"
            links={companyLinks}
            cta={{ label: "Contact Us", href: "/contact-us" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-6 border-t border-[#2A2A2A] pt-6 lg:flex-row lg:justify-between lg:gap-0">
          <p style={bodyTypography} className="text-[#B8B8B8]">
            &copy; 2026 Way Wise Tech. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  style={bodyTypography}
                  className="text-[#B8B8B8] transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p style={bodyTypography} className="text-[#B8B8B8]">
            USA &bull; UAE &bull; Worldwide
          </p>
        </div>
      </AttorneyContainer>
    </footer>
  );
};

export default AttorneyFooter;
