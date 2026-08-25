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
    "M9.33332 4.66699C10.2616 4.66699 11.1518 5.03574 11.8082 5.69212C12.4646 6.3485 12.8333 7.23873 12.8333 8.16699V12.2503H10.5V8.16699C10.5 7.85757 10.3771 7.56083 10.1583 7.34203C9.93949 7.12324 9.64274 7.00033 9.33332 7.00033C9.0239 7.00033 8.72716 7.12324 8.50837 7.34203C8.28957 7.56083 8.16666 7.85757 8.16666 8.16699V12.2503H5.83332V8.16699C5.83332 7.23873 6.20207 6.3485 6.85845 5.69212C7.51483 5.03574 8.40507 4.66699 9.33332 4.66699ZM1.16666 5.25033H3.49999V12.2503H1.16666V5.25033ZM2.33332 3.50033C2.64274 3.50033 2.93949 3.37741 3.15828 3.15862C3.37707 2.93982 3.49999 2.64308 3.49999 2.33366C3.49999 2.02424 3.37707 1.72749 3.15828 1.5087C2.93949 1.28991 2.64274 1.16699 2.33332 1.16699C2.0239 1.16699 1.72716 1.28991 1.50837 1.5087C1.28957 1.72749 1.16666 2.02424 1.16666 2.33366C1.16666 2.64308 1.28957 2.93982 1.50837 3.15862C1.72716 3.37741 2.0239 3.50033 2.33332 3.50033Z",
  twitter:
    "M13.4167 1.75001C12.8581 2.14403 12.2396 2.4454 11.585 2.64251C11.2337 2.23855 10.7668 1.95224 10.2474 1.8223C9.7281 1.69235 9.18138 1.72504 8.68122 1.91594C8.18106 2.10684 7.7516 2.44674 7.45092 2.88967C7.15023 3.33261 6.99283 3.8572 7.00001 4.39251V4.97584C5.97488 5.00242 4.95909 4.77506 4.0431 4.31402C3.12711 3.85297 2.33936 3.17254 1.75001 2.33334C1.75001 2.33334 -0.583323 7.58334 4.66668 9.91667C3.46532 10.7322 2.03418 11.141 0.583344 11.0833C5.83334 14 12.25 11.0833 12.25 4.37501C12.2495 4.21252 12.2339 4.05044 12.2033 3.89084C12.7987 3.30371 13.2188 2.56242 13.4167 1.75001Z",
  instagram:
    "M9.33332 6.63283C9.40531 7.1183 9.32239 7.61412 9.09635 8.04975C8.87031 8.48538 8.51266 8.83865 8.07427 9.0593C7.63588 9.27995 7.13908 9.35676 6.65453 9.27879C6.16998 9.20081 5.72235 8.97204 5.37531 8.625C5.02827 8.27796 4.7995 7.83034 4.72153 7.34578C4.64356 6.86123 4.72036 6.36443 4.94101 5.92604C5.16167 5.48766 5.51493 5.13001 5.95056 4.90397C6.3862 4.67793 6.88201 4.595 7.36749 4.66699C7.86269 4.74042 8.32115 4.97118 8.67514 5.32517C9.02914 5.67916 9.25989 6.13762 9.33332 6.63283ZM10.2083 3.79199C10.3237 3.79199 10.4365 3.75778 10.5324 3.69368C10.6283 3.62959 10.7031 3.53848 10.7473 3.43189C10.7914 3.3253 10.803 3.20801 10.7804 3.09486C10.7579 2.9817 10.7024 2.87776 10.6208 2.79618C10.5392 2.7146 10.4353 2.65904 10.3221 2.63653C10.209 2.61403 10.0917 2.62558 9.98509 2.66973C9.8785 2.71388 9.7874 2.78865 9.7233 2.88458C9.6592 2.9805 9.62499 3.09329 9.62499 3.20866C9.62499 3.36337 9.68645 3.51174 9.79584 3.62114C9.90524 3.73053 10.0536 3.79199 10.2083 3.79199ZM12.8333 7.00033C12.8333 10.2221 10.2217 12.8337 6.99999 12.8337C3.77824 12.8337 1.16666 10.2221 1.16666 7.00033C1.16666 3.77858 3.77824 1.16699 6.99999 1.16699C10.2217 1.16699 12.8333 3.77858 12.8333 7.00033Z",
} as const;

// URLs taken from the existing shared Footer so they are real, not invented.
const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/waywisetech",
    path: socialPaths.linkedin,
  },
  {
    label: "Twitter",
    href: "https://www.facebook.com/WayWiseTech/",
    path: socialPaths.twitter,
  },
  {
    label: "Instagram",
    href: "https://www.youtube.com/@WayWiseTech",
    path: socialPaths.instagram,
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
      <AttorneyContainer className="pt-10 lg:pt-16 pb-8">
        {/* The three menu columns sit hard right: they are `auto`, so each is only as
            wide as its own longest link, while the brand column takes `1fr` and absorbs
            all the slack in between. Fixed fr ratios were wrong here — they stretched
            the menu tracks and pulled the group leftward, away from the right edge. */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_auto_auto] lg:gap-x-14">
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
                     width="14" height="14" viewBox="0 0 14 14" fill="none"
                    >
                      <path d={path} stroke="#B8B8B8" stroke-width="1.16667" />
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
