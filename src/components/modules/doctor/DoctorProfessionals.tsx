import {
  BriefcaseMedical,
  HeartPulse,
  Hospital,
  Stethoscope,
  TestTube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Serving Healthcare Professionals Across" — six audience cards.
 */

// Figma spec: Urbanist Bold 52px, line-height 100%, zero letter-spacing, centered.
// Only the desktop size is specced; the responsive steps below it are mine — 52px
// overflows a phone viewport.
const headingTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 24px, line-height 100%, zero letter-spacing.
const cardTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  fontSize: "24px",
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 16px, line-height 100%, zero letter-spacing.
// NOTE: 100% leading is what the spec says, but this copy wraps to two lines and the
// design's own artwork shows roughly 20px between them. Flagged to the user — if the
// lines read too tight, this is the value to change.
const cardBodyTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  letterSpacing: "0",
} as const;

/**
 * lucide-react has no tooth glyph, so this one is hand-drawn to match the set's
 * conventions: 24x24 box, 2px round-capped stroke, currentColor, no fill. Every other
 * icon on this section is a stock lucide component.
 */
const ToothIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5.5c-1.5-1.2-3.2-1.8-4.8-1.4C5.3 4.6 4 6.3 4 8.4c0 1.6.4 3 .9 4.6.4 1.3.7 2.7.9 4.2.2 1.4.4 2.8 1.6 2.8 1.1 0 1.4-1.2 1.7-2.6.3-1.4.6-2.9 1.9-2.9s1.6 1.5 1.9 2.9c.3 1.4.6 2.6 1.7 2.6 1.2 0 1.4-1.4 1.6-2.8.2-1.5.5-2.9.9-4.2.5-1.6.9-3 .9-4.6 0-2.1-1.3-3.8-3.2-4.3-1.6-.4-3.3.2-4.8 1.4z" />
  </svg>
);

// Every card carries the same body copy in the Figma frame — reproduced as-is rather
// than invented per-card. Flagged to the user as probable placeholder.
const BODY = "Get instant insights into patient trends and treatment outcomes.";

const cards: {
  title: string;
  body: string;
  Icon: LucideIcon | typeof ToothIcon;
}[] = [
  { title: "Doctors", body: BODY, Icon: Stethoscope },
  { title: "Dentists", body: BODY, Icon: ToothIcon },
  { title: "Clinics", body: BODY, Icon: Hospital },
  { title: "Diagnostic Centers", body: BODY, Icon: TestTube },
  { title: "Hospitals", body: BODY, Icon: BriefcaseMedical },
  { title: "Care Centers", body: BODY, Icon: HeartPulse },
];

const DoctorProfessionals = () => {
  return (
    <section id="solutions" className="w-full px-4 bg-white">
      <div className="mx-auto w-full max-w-[1260px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] sm:text-[40px] lg:text-[52px] leading-10 lg:leading-14"
          style={headingTypography}
        >
          <span className="text-[#011139]">Serving </span>
          <span className="text-[#3191EA]">Healthcare Professionals</span>
          <span className="text-[#011139]"> Across</span>
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {cards.map(({ title, body, Icon }) => (
            <li
              key={title}
              // Gradient runs left-to-right: the Figma frame shows the pale tint on the
              // leading edge and the blue on the trailing one. Angle was not specced.
              className="flex items-center gap-5 rounded-[10px] border-2 border-[#F6F7F9] bg-gradient-to-r from-[#EFF8FB] to-[#BEDFFF] p-6"
            >
              <span
                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#3191EA]"
                aria-hidden="true"
              >
                <Icon className="size-6 text-white" />
              </span>

              <div>
                {/* h3: nested under this section's h2. */}
                <h3 className="text-[#011139]" style={cardTitleTypography}>
                  {title}
                </h3>
                <p className="mt-3 text-[#4B5563] leading-6" style={cardBodyTypography}>
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DoctorProfessionals;
