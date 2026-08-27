import Image from "next/image";
import type { StaticImageData } from "next/image";
import card1 from "@/assets/images/doctor/techhelp_card1.webp";
import card2 from "@/assets/images/doctor/techhelp_card2.webp";
import card3 from "@/assets/images/doctor/techhelp_card3.webp";

/**
 * Three solution cards, each a screenshot above a title and a bullet list.
 *
 * NOTE: the Figma frame reuses the "Technology That Helps Healthcare Practices Grow"
 * heading already used by DoctorTechHelps. Reproduced verbatim, but it means the page
 * carries the same h2 twice — flagged to the user.
 *
 * NOTE ON LEADING: as elsewhere on this page, the specced `line-height: 100%` is applied
 * to the single-line items and replaced with real leading on anything that wraps.
 */

// Section title — same ramp as the other sections: Urbanist Bold 52px, zero
// letter-spacing. Only the desktop size is specced; the steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 700,
  letterSpacing: "0",
} as const;

// Section paragraph — same ramp as the other sections: Urbanist Medium 18px.
const introTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist SemiBold 24px / 100%, zero letter-spacing, #011139.
const cardTitleTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
} as const;

// Figma spec: Urbanist Medium 16px / 100%, zero letter-spacing, #4B5563. The longer
// entries wrap at narrow widths, so this gets real leading rather than the specced 100%.
const pointTypography = {
  fontFamily: "var(--font-urbanist), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  letterSpacing: "0",
} as const;

const solutions: {
  image: StaticImageData;
  alt: string;
  title: string;
  points: string[];
}[] = [
  {
    image: card1,
    alt: "Doctor at a desk reviewing a practice website on a laptop",
    title: "Practice Launch",
    points: [
      "Brand Identity",
      "Website Design & Development",
      "Mobile Responsive Website",
      "Business Profile",
      "SEO",
      "Hosting & Security",
    ],
  },
  {
    image: card2,
    alt: "Patient engagement platform shown on a phone, laptop and tablet",
    title: "Patient Engagement Platform",
    points: [
      "Patient Portal",
      "Online Booking & Appointment Reminders",
      "Live Chat & AI Assistant",
      "Email, SMS & Patient Retention Campaigns",
      "Online Payments & Prescription Requests",
      "Review Management",
    ],
  },
  {
    image: card3,
    alt: "Clinician reviewing a practice analytics dashboard on a monitor",
    title: "Smart Practice Management",
    points: [
      "Patient CRM & Medical History Database",
      "Treatment Tracking & Care Management",
      "Appointment Analytics & Revenue Reports",
      "Staff Management",
      "Mobile Application & Secure Cloud Storage",
      "AI Reporting & HIPAA-Ready Infrastructure",
    ],
  },
];

const DoctorSolutions = () => {
  return (
    <section className="w-full bg-white px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="text-center text-[30px] leading-[1.15] sm:text-[40px] lg:text-[52px]"
          style={titleTypography}
        >
          {/* Hard break reproduced from the Figma frame: the colour split falls mid-line
              on row two, so the rows cannot be left to wrap freely. */}
          <span className="block text-[#011139]">Technology That Helps</span>
          <span className="block">
            <span className="text-[#3191EA]">Healthcare Practices</span>
            <span className="text-[#011139]"> Grow</span>
          </span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-[800px] text-center leading-[1.4] text-[#4B5563]"
          style={introTypography}
        >
          Choose the right level of digital support today, with the flexibility
          to scale as your practice evolves.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <li
              key={solution.title}
              className="rounded-[24px] border border-[#E0EAF3] bg-[#E9F4FD] p-[30px]"
            >
              {/* Intrinsic size is 364x200; the card stretches to its grid track and the
                  screenshot covers it, so the three stay aligned. */}
              <Image
                src={solution.image}
                alt={solution.alt}
                className="aspect-[364/200] w-full rounded-[16px] border border-white object-cover"
                sizes="(min-width: 1024px) 364px, (min-width: 768px) 50vw, 100vw"
              />

              {/* h3: nested under this section's h2. */}
              <h3
                className="mt-8 text-[#011139] text-[20px] lg:text-[24px]"
                style={cardTitleTypography}
              >
                {solution.title}
              </h3>

              <ul className="mt-6 flex flex-col gap-4">
                {solution.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 leading-[1.35] text-[#4B5563]"
                    style={pointTypography}
                  >
                    {/* Literal bullet rather than list-disc: the marker needs to stay
                        top-aligned with the first line when an entry wraps. */}
                    <span aria-hidden="true" className="block w-1.5 h-1.5 rounded-full bg-[#4B5563]"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DoctorSolutions;
