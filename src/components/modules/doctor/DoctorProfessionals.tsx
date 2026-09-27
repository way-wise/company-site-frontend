import Image from "next/image";
import { DoctorPlayButton } from "./DoctorBanner";
import row1 from"@/assets/images/doctor/DoctorProfessionals-row-1.png";
import row2 from "@/assets/images/doctor/DoctorProfessionals-row-2.png";

/**
 * "Why Healthcare Professionals Trust Way-Wise Tech" — text and cards on the left,
 * two stacked photos on the right.
 */

const urbanist = { fontFamily: "var(--font-urbanist), sans-serif" } as const;

const cards = [
  {
    title: "Healthcare-Focused Strategy",
    body: "We begin by understanding your specialties, patient needs, daily workflows, and growth goals to build solutions around your practice.",
    gradient: "bg-gradient-to-r from-[#F3F8FD] to-[#BEDFFF]",
  },
  {
    title: "Seamless Patient Experience",
    body: "We create clear, welcoming websites that help patients explore your services, find essential information, and easily request appointments.",
    gradient: "bg-gradient-to-r from-[#BEDFFF] to-[#F3F8FD]",
  },
  {
    title: "Scalable Healthcare Technology",
    body: "From a professional practice website to patient portals and management systems, we build technology that grows with your healthcare organization.",
    gradient: "bg-gradient-to-r from-[#F3F8FD] to-[#BEDFFF]",
  },
];

const frameClass =
  "relative h-[260px] w-full overflow-hidden rounded-[20px] border border-[#D9E2EC] sm:h-[360px] lg:h-auto lg:flex-1";

const DoctorProfessionals = () => {
  return (
    <section id="about" className="w-full scroll-mt-[130px] bg-white px-4">
      <div className="mx-auto grid w-full max-w-[1420px] items-stretch gap-10 py-16 lg:grid-cols-[682px_1fr] lg:py-[100px]">
        <div>
          <h2
            className="text-[30px] font-bold leading-[1.25] text-[#011139] sm:text-[40px] lg:-mt-4 lg:text-[48px]"
            style={urbanist}
          >
            Why Healthcare Professionals Trust Way-Wise Tech for Smarter Digital
            Solutions
          </h2>

          <p className="mt-8 text-base leading-7 text-[#4B5563]">
            Patients expect trust, clarity, and convenient access to care. We
            combine healthcare-focused strategy, design, and development to
            create digital platforms that strengthen patient connections and
            simplify everyday operations.
          </p>

          <ul className="mt-6 flex flex-col gap-6">
            {cards.map(({ title, body, gradient }) => (
              <li
                key={title}
                className={`rounded-lg border border-[#C5D9EE] p-6 sm:p-8 ${gradient}`}
              >
                <h3
                  className="text-[22px] font-medium text-[#011139] sm:text-2xl"
                  style={urbanist}
                >
                  {title}
                </h3>
                <p className="mt-4 text-base leading-[30px] text-[#4B5563]">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-10">
          <div className={frameClass}>
            <Image
              src={row1}
              alt="Smiling nurse caring for a patient in a hospital room"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 700px, 100vw"
            />
          </div>

          <div className={frameClass}>
            <Image
              src={row2}
              alt="Dentist treating a smiling patient"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 700px, 100vw"
            />
            <DoctorPlayButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfessionals;
