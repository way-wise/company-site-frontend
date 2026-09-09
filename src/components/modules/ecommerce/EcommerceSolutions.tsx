import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * "More Than a Website. A Better Way to Operate." — a mocked-up operations dashboard on
 * the left, copy and a solutions list on the right.
 *
 * The dashboard is entirely markup, not an image: the frame supplies type and colour
 * specs for each of its parts, which only makes sense for real elements. Every figure in
 * it is fabricated sample data, so the whole panel is `aria-hidden` behind one sr-only
 * sentence — otherwise a screen reader would announce "£128,490, +18%" as if it were this
 * business's actual revenue.
 *
 * The #2563EB blues are from the spec, not a mistake: the loyalty panel and the CTA
 * border both use that blue against the brown palette, the same way the banner's eyebrow
 * pill does.
 */

// Figma spec: Outfit SemiBold 48px / 60px, zero letter-spacing. No colour was given; the
// frame renders this white. Only the desktop size is specced.
const titleTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 600,
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 18px / 30px, zero letter-spacing, white at 70%.
const paragraphTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "30px",
  letterSpacing: "0",
} as const;

// Figma spec: Outfit Regular 16px / 20px, zero letter-spacing, white at 70%.
const pointTypography = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 14px / 20px, zero letter-spacing, centered, #A07B62.
const buttonTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 12px / 16px, 0.96px letter-spacing, #A07B62.
const panelLabelTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0.96px",
} as const;

// Figma spec: Inter Regular 10px / 15px, zero letter-spacing, white at 35%.
const statLabelTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "15px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Regular 14px / 20px, zero letter-spacing, white.
const statValueTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0",
} as const;

/**
 * Figma spec: Inter Regular 12px / 16px, zero letter-spacing. Shared by every 12px line
 * in the panel — the stat deltas, the loyalty label, "Team Activity", the names and the
 * actions. Only the colour changes, so that stays on the element.
 */
const panelSmallTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0",
} as const;

// Figma spec: Inter Regular 9px / 13.5px, zero letter-spacing, white at 20%.
const timestampTypography = {
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 400,
  fontSize: "9px",
  lineHeight: "13.5px",
  letterSpacing: "0",
} as const;

const stats = [
  { label: "Revenue (MTD)", value: "£128,490", note: "+18%", positive: true },
  { label: "Active Customers", value: "2,841", note: "+9%", positive: true },
  { label: "Open Orders", value: "94", note: "Live", positive: false },
  { label: "Stock SKUs", value: "1,249", note: "Synced", positive: false },
];

/**
 * The loyalty meter's seven bars, read off the frame — no spec was given for them.
 *
 * It is a bar chart, not a row of equal blocks: the bars sit on a common baseline and
 * each one is taller than the last, climbing on a 4px step from 14px to 38px. The fills
 * are the accent at rising opacity rather than neutral white — they read distinctly warm
 * against the panel's blue tint — with the last bar at full strength.
 */
const loyaltyBars = [
  { height: "h-[16px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[22px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[19px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[28px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[26px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[34px]", fill: "bg-[#A07B62]/28" },
  { height: "h-[38px]", fill: "bg-[#A07B62]" },
];

/**
 * `offset` reproduces the frame, where the first row sits 72px to the right of the second
 * rather than sharing its left edge.
 */
const activity = [
  {
    initial: "S",
    name: "Sophie K.",
    action: "Updated 12 inventory items",
    time: "2m ago",
    offset: true,
  },
  {
    initial: "M",
    name: "Marcus R.",
    action: "Processed 8 new orders",
    time: "11m ago",
    offset: false,
  },
];

const solutions = [
  "Custom retail and e-commerce systems",
  "Inventory and order workflow tools",
  "CRM, customer portals, and loyalty programs",
  "Sales dashboards and performance reporting",
  "Mobile shopping applications",
  "API, payment, and third-party integrations",
  "AI-powered automation and support tools",
  "Secure, scalable cloud infrastructure",
];

const EcommerceSolutions = () => {
  return (
    <section
      id="solutions"
      className="w-full scroll-mt-[110px] bg-[#1E130A] px-4"
    >
      {/* 1420px, matching the navbar: two 680px columns plus the 60px gutter. */}
      <div className="mx-auto grid w-full max-w-[1420px] items-center gap-12 py-10 lg:grid-cols-2 lg:gap-[60px] lg:py-[100px]">
        {/* Visual column — a dashboard mock built from real elements. */}
        <div className="mx-auto w-full max-w-[680px] lg:justify-self-start">
          <span className="sr-only">
            Illustration of a commerce operations dashboard showing revenue,
            active customers, open orders, stock levels, a customer loyalty
            score and recent team activity.
          </span>

          <div
            className="rounded-[16px] border border-[#A07B62] p-6"
            aria-hidden="true"
          >
            <p style={panelLabelTypography} className="text-[#A07B62]">
              COMMERCE OPERATIONS HQ
            </p>

            {/* The frame draws this row narrower than the two panels below it, leaving a
                ragged right edge. Read as a Figma layout artifact and squared up here —
                see the note in the message to the user. */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {stats.map(({ label, value, note, positive }) => (
                <div
                  key={label}
                  className="rounded-[12px] border border-white/7 bg-white/4 p-3"
                >
                  <p style={statLabelTypography} className="text-white/35">
                    {label}
                  </p>
                  <p style={statValueTypography} className="mt-1 text-white">
                    {value}
                  </p>
                  <p
                    style={panelSmallTypography}
                    className={`mt-1 ${positive ? "text-[#16B8A6]" : "text-[#A07B62]"}`}
                  >
                    {note}
                  </p>
                </div>
              ))}
            </div>

            {/* Loyalty meter. Blue against the brown palette, per the spec. */}
            <div className="mt-2.5 rounded-[12px] border border-[#2563EB]/20 bg-[#2563EB]/8 p-3">
              <p style={panelSmallTypography} className="text-white/45">
                Customer Loyalty Score
              </p>
              {/* `items-end` is what puts the bars on a shared baseline so the varying
                  heights read as a chart rather than as misaligned blocks. */}
              <div className="mt-4 flex items-end gap-1">
                {loyaltyBars.map(({ height, fill }, index) => (
                  <span
                    key={index}
                    className={`flex-1 rounded-[4px] ${height} ${fill}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-2.5 rounded-[12px] border border-white/7 bg-white/4 p-3">
              <p style={panelSmallTypography} className="text-white/40">
                Team Activity
              </p>
              {/*
                Frame-exact row geometry. The rows are not a fluid list: each cell starts
                at a fixed offset from its own row's left edge — avatar 0, name 31px,
                action 91px, timestamp 407px — so the timestamps line up with each other
                instead of sitting flush right, and a longer action string does not push
                one along. Reproduced with a fixed grid template rather than flex.

                That geometry needs 513px of room (407px + the timestamp, + 72px for the
                nudged row), and this panel is only half of a two-column grid: it does not
                reach that until roughly 1320px of viewport. Hence the `min-[1320px]:`
                gate rather than `sm:` — below it the fixed tracks overflowed the panel
                and pushed the timestamps outside the border. Under the gate the row is a
                fluid flex line with the timestamp at `ml-auto`, and the nudge is dropped.
              */}
              <div className="mt-2">
                {activity.map(({ initial, name, action, time, offset }) => (
                  <div
                    key={name}
                    /*
                      One element per row, so the hairline is carried by the row content
                      itself: `w-fit` shrinks the grid to the sum of its tracks, which
                      makes the border run from the avatar's left edge to the end of the
                      timestamp rather than across the whole panel. Every row gets one,
                      including the last.

                      Narrower than the gate this stays a full-width flex row — `w-fit`
                      there would collapse the row and strand the `ml-auto` timestamp.
                    */
                    className={`flex items-center gap-2 border-b border-white/5 py-2 min-[1320px]:grid min-[1320px]:w-fit min-[1320px]:grid-cols-[31px_60px_316px_auto] min-[1320px]:gap-0 ${
                      offset ? "min-[1320px]:ml-[72px]" : ""
                    }`}
                  >
                    <span
                      style={statLabelTypography}
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#A07B62]/25 text-white/60"
                    >
                      {initial}
                    </span>
                    <span
                      style={panelSmallTypography}
                      className="text-white/60"
                    >
                      {name}
                    </span>
                    <span
                      style={panelSmallTypography}
                      className="text-white/30"
                    >
                      {action}
                    </span>
                    <span
                      style={timestampTypography}
                      className="ml-auto shrink-0 text-white/20 min-[1320px]:ml-0"
                    >
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copy column */}
        <div className="lg:justify-self-end">
          {/* Left to wrap inside the 680px column, which is what puts the break after
              "A Better" as the frame does — no hard line break needed. */}
          <h2
            style={titleTypography}
            className="text-[32px] leading-[1.15] text-white sm:text-[40px] lg:text-[48px] lg:leading-15"
          >
            More Than a Website. A Better Way to Operate.
          </h2>

          <p style={paragraphTypography} className="mt-6 text-white/70">
            Your digital presence should do more than look professional. It
            should help your team save time, serve customers better, and move
            your business forward.
          </p>

          <ul className="mt-6 flex flex-col gap-4">
            {solutions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                {/* No colour was specced for the bullets; the accent keeps them in
                    palette. 20px line box centres the 4px disc on the first line. */}
                <span
                  className="mt-2 size-1 shrink-0 rounded-full bg-[#A07B62]"
                  aria-hidden="true"
                />
                <span style={pointTypography} className="text-white/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/services"
              style={buttonTypography}
              className="inline-flex items-center gap-2 rounded-[12px] border border-[#2563EB]/80 px-6 py-3 whitespace-nowrap text-[#A07B62] transition-colors duration-200 hover:bg-[#A07B62] hover:text-white"
            >
              Explore Our Solutions
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcommerceSolutions;
