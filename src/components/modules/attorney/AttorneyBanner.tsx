import Image from "next/image";
import Link from "next/link";
import bannerImage from "@/assets/images/attorney/banner.png";
import videoThumbnail from "@/assets/images/attorney/video-icon-iamge.png";
import AttorneyPlayButton from "./AttorneyPlayButton";

/**
 * Section 3 — hero banner.
 *
 * The artwork and video thumbnail are md/lg-only (there's no room for them once the
 * copy stacks full-width on mobile). On mobile the card is a plain solid-black block
 * with smaller type and tighter padding; from lg up it takes on the Figma proportions,
 * with a left-to-right gradient darkening the artwork so the white copy stays readable.
 */

// Figma spec (lg+): Inter Regular 18px / 28px, zero letter-spacing. Font-size/line-height
// scale down below lg via className instead, since an inline style can't respond to
// breakpoints and would otherwise override Tailwind's text-* utilities outright.
const breadcrumbTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  letterSpacing: "0",
} as const;

// Figma spec (lg+): Rajdhani Bold 48px / 56px, -0.96px letter-spacing.
const headlineTypography = {
  fontFamily: "var(--font-rajdhani), sans-serif",
  letterSpacing: "-0.96px",
} as const;

// Figma spec (lg+): Inter Regular 20px / 32px, zero letter-spacing.
const descriptionTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Medium 20px / 30px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  letterSpacing: "0",
} as const;

const AttorneyBanner = () => {
  return (
    // Figma's outer frame: a #F5F5F5 backdrop showing through a 40px gutter
    // (0 on top) around the black, rounded banner card. Edge-to-edge on mobile
    // (no gutter, square corners) so the artwork fills the full screen width there;
    // the gutter/rounding only appear from sm up.
    <div className="bg-[#000000] px-0 pt-0 pb-0 sm:px-6 sm:pb-6 lg:px-10 lg:pb-10">
      {/* `aspect-[1840/600]` + `min-h-[380px]` set the card's STARTING size from lg up
          (whichever is taller), matching the Figma proportions. Deliberately no
          `overflow-hidden` here: if the copy ever needs more height than that starting
          size — which varies with exact viewport width and how the heading wraps — the
          section must grow to fit it rather than clip it. (That clipping is exactly
          what caused the breadcrumb to silently vanish above the box on some laptop
          widths.) Rounding + clipping is scoped to the image layer below instead, which
          always matches whatever height the section actually ends up at. */}
      <section className="relative isolate rounded-none bg-[#000000] sm:rounded-3xl lg:aspect-[1840/600] lg:min-h-[380px]">
        {/* Background artwork + darkening gradient, clipped to the card's rounded
            corners. This wrapper (not the section) owns `overflow-hidden`, so it always
            matches the section's actual current height — see note above. */}
        <div className="absolute inset-0 overflow-hidden rounded-none sm:rounded-3xl">
          {/* Background artwork. `priority` because this is the LCP element. Centered
              on mobile (the card is too narrow there for the right-anchored desktop
              crop to still show the subject), shifting to the right-anchored crop
              from md up. */}
          <Image
            src={bannerImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-right"
            aria-hidden="true"
          />

          {/* Darkens the artwork so the white copy stays readable over it: a near-solid
              wash on mobile (the copy sits over the full width there), narrowing to
              just the left side, fading rightward toward the subject, from md up.
              (Plain Tailwind classes here, not an inline `style`, since inline styles
              override className regardless of breakpoint and would defeat the md:
              switch.) `md:bg-transparent` clears the mobile `bg-black/70`
              background-COLOR at md+ — without it, that color stays active underneath
              the gradient (a different property, background-IMAGE) and shows through
              where the gradient fades to transparent, making the darkening look like it
              spans the full banner. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/70 md:bg-transparent md:bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_35.83%,rgba(0,0,0,0)_65.99%)]"
          />
        </div>

        {/* Content area. `lg:h-full` is the key piece: this is the only in-flow child
            of the section, so without it, it only takes its own min-content height and
            sits flush at the section's TOP (normal block flow), leaving empty space
            below it whenever the section is taller than that — which is most of the
            time at lg+, since the section's height tracks the 1840:600 aspect ratio.
            With h-full it correctly spans the section's actual height, so `justify-end`
            + the `lg:pb` below (sized so the CTA row's own vertical CENTER — the button
            row is the last child, so its bottom edge is this pb value — lands on the
            video thumbnail's vertical center) resolve against the right box. Thumbnail
            center-from-bottom ≈ 7.73% of the card's WIDTH (converting its
            bottom-[5%]-of-height + half its 12.2%-of-width height into a %width figure
            via the fixed 1840:600 ratio, since padding-bottom resolves against width).
            The button row is a fixed ~62px tall regardless of viewport, so its
            half-height is a flat px offset, not a percentage — hence the calc(). */}
        <div className="relative flex min-h-[460px] flex-col justify-end px-4 pt-8 pb-10 sm:min-h-[480px] sm:px-6 sm:pb-12 lg:h-full lg:min-h-0 lg:justify-end lg:pt-0 lg:pr-[4.35%] lg:pb-[calc(7.73%_-_31px)] lg:pl-[11.4%]">
          <div className="flex max-w-[600px] flex-col gap-4 sm:gap-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol
                className="flex items-center gap-3 text-[12px] leading-[18px] text-white sm:text-[18px] sm:leading-[28px]"
                style={breadcrumbTypography}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-200 hover:text-[#00A3FF]"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/60">
                  &bull;
                </li>
                {/* aria-current marks the trail's end for screen readers. */}
                <li aria-current="page">Attorney</li>
              </ol>
            </nav>

            {/* The page's single <h1>. */}
            <h1
              className="text-[24px] leading-[30px] font-bold text-white sm:text-[36px] sm:leading-[42px] lg:text-[48px] lg:leading-[56px]"
              style={headlineTypography}
            >
              Are You an Attorney or Affiliated with a Law Firm?{" "}
              <br />
              <span className="text-[#007AFF]">
                Explore Our Exclusive Legal Service Packages.
              </span>
            </h1>

            <p
              className="text-[13px] leading-[19px] font-normal text-gray-200 sm:text-[18px] sm:leading-[28px] lg:-mt-3 lg:text-[20px] lg:leading-[32px]"
              style={descriptionTypography}
            >
              Digital Solutions Built to Grow and Modernize Your Law Firm
            </p>

            {/* Video thumbnail, mobile-only: centered ahead of the CTA row. From lg up
                this is replaced by the corner-pinned version below. */}
            <div className="flex justify-center lg:hidden">
              <div className="relative w-full max-w-[260px] overflow-hidden rounded-2xl border border-white shadow-lg">
                <Image
                  src={videoThumbnail}
                  alt="Watch our work"
                  width={400}
                  height={225}
                  className="h-auto w-full object-cover"
                />
                <AttorneyPlayButton className="size-[56px] border-[8px]" iconClassName="size-5" />
              </div>
            </div>

            {/* Plain <a> rather than <Link>: same-document fragments, so native anchor
                navigation is what picks up `scroll-behavior: smooth` and scroll-mt. */}
            <div className="flex flex-row items-stretch gap-3 sm:items-center sm:gap-4 lg:-mt-3">
              <a
                href="#our-work"
                style={buttonTypography}
                className="flex-1 rounded-md bg-[#007AFF] px-4 py-3 text-center text-[13px] leading-tight font-medium whitespace-normal text-white transition-colors duration-200 hover:bg-[#0091e6] flex items-center justify-center sm:flex-none sm:px-9 sm:py-4 sm:text-[16px] sm:leading-7.5 sm:whitespace-nowrap md:text-[20px]"
              >
                View Our Legal Work
              </a>
              <a
                href="#packages"
                style={buttonTypography}
                className="flex-1 rounded-md bg-[#F1F5F9] px-4 py-3 text-center text-[13px] leading-tight font-medium whitespace-normal text-[#0A0A0A] transition-colors duration-200 hover:bg-white flex items-center justify-center sm:flex-none sm:px-9 sm:py-4 sm:text-[16px] sm:leading-7.5 sm:whitespace-nowrap md:text-[20px]"
              >
                Explore Legal Packages
              </a>
            </div>
          </div>
        </div>

        {/* Video thumbnail, pinned to the banner's bottom-right corner. Sized and
            positioned as percentages of the card (same basis as the padding above)
            so it scales with the same ratio as the card grows. */}
        <div className="absolute right-6 bottom-6 hidden w-[280px] max-w-[400px] overflow-hidden rounded-2xl border border-white shadow-lg lg:right-[4.35%] lg:bottom-[5%] lg:block lg:w-[21.7%]">
          <Image
            src={videoThumbnail}
            alt="Watch our work"
            width={400}
            height={225}
            className="h-auto w-full object-cover"
          />
          {/* <AttorneyPlayButton className="sm:size-[80px] sm:border-[14px]" iconClassName="sm:size-6" /> */}
        </div>
      </section>
    </div>
  );
};

export default AttorneyBanner;
