"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { DoctorPlayButton } from "./DoctorBanner";
import videoThumb from "@/assets/images/doctor/after-price-r2-c1.png";
import teamPhoto from "@/assets/images/doctor/after-price-r2-c2.png";

/**
 * Pricing — three phase cards butted flush inside one rounded shell (the middle card is
 * dark), each with accordion feature groups, followed by two photos.
 */

const urbanist = { fontFamily: "var(--font-urbanist), sans-serif" } as const;
const inter = { fontFamily: "var(--font-inter), sans-serif" } as const;

type Phase = {
  name: string;
  subhead: string;
  price: string;
  summary: string;
  groups: { title: string; points: string[] }[];
};

const phases: Phase[] = [
  {
    name: "Phase 1",
    subhead: "Practice Launch",
    price: "$950-$2950",
    summary:
      "Build your Medical/Healthcare brand and establish a trusted online presence.",
    groups: [
      {
        title: "Brand Identity",
        points: ["Custom Logo Design", "Brand Guidelines", "Business Stationery"],
      },
      {
        title: "Website Development",
        points: [
          "5–10 Page Website",
          "Services & Specialties",
          "Doctor Profiles",
          "Mobile Responsive Design",
        ],
      },
      {
        title: "Online Presence",
        points: ["Contact Forms", "Google Maps", "Social Profiles", "Basic SEO"],
      },
      {
        title: "Hosting & Security",
        points: ["Domain & Hosting", "Business Email", "SSL Security"],
      },
    ],
  },
  {
    name: "Phase 2",
    subhead: "Patient Engagement Platform",
    price: "$2975 – $6700",
    summary:
      "Improve client communication and create a modern patient/healthcare experience",
    groups: [
      {
        title: "Patient Experience",
        points: [
          "Online Appointment Booking",
          "Patient Portal",
          "Medical Database",
          "Intake Forms",
        ],
      },
      {
        title: "Communication System",
        points: [
          "Email & SMS Alerts",
          "Appointment Reminders",
          "Patient Messaging",
        ],
      },
      {
        title: "Patient Services",
        points: [
          "Treatment Tracking",
          "Document Uploads",
          "Online Payments",
        ],
      },
      {
        title: "Growth & Features",
        points: ["Review Management", "Lead Capture", "Analytics Tracking"],
      },
    ],
  },
  {
    name: "Phase 3",
    subhead: "Smart Practice Management",
    price: "$6800-$19500",
    summary:
      "Everything in Phase 1 & 2 plus a complete digital ecosystem for modern healthcare organizations.",
    groups: [
      {
        title: "Practice Management",
        points: ["Patient CRM", "Scheduling Management", "Workflow Automation"],
      },
      {
        title: "Analytics & Reports",
        points: ["Revenue Reports", "Patient Analytics", "AI Reporting"],
      },
      {
        title: "Team Management",
        points: ["Staff Tools", "Role Permissions", "Communication Logs"],
      },
      {
        title: "Mobile & Cloud Solutions",
        points: ["Mobile App", "Secure Cloud Storage", "Tablet Access"],
      },
      {
        title: "Growth Features & Hosting & Security",
        points: [
          "SEO & Marketing Tools",
          "HIPAA Ready Infrastructure",
          "Managed Hosting",
        ],
      },
    ],
  },
];

const CheckIcon = ({ dark }: { dark: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`mt-1 size-3.5 shrink-0 ${dark ? "text-[#3EA6FF]" : "text-[#3191EA]"}`}
  >
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

const GroupRow = ({
  group,
  dark,
}: {
  group: Phase["groups"][number];
  dark: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${dark ? "border-white/25" : "border-[#0B2C50]/30"}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-[15px] text-left"
      >
        <span
          style={urbanist}
          className={`text-[17px] font-medium ${dark ? "text-white" : "text-[#011139]"}`}
        >
          {group.title}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 transition-transform duration-300 ${dark ? "text-white" : "text-[#011139]"} ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-2.5 pb-4">
          {group.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckIcon dark={dark} />
              <span
                style={inter}
                className={`text-sm leading-[21px] ${dark ? "text-white/80" : "text-[#4B5563]"}`}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PhaseCard = ({ phase, dark }: { phase: Phase; dark: boolean }) => (
  <li
    className={`flex flex-col px-6 pt-12 pb-10 sm:px-8 ${dark ? "bg-[#062648]" : "bg-white"}`}
  >
    <h3
      style={urbanist}
      className={`text-[32px] leading-none font-semibold ${dark ? "text-white" : "text-[#0B2C50]"}`}
    >
      {phase.name}
    </h3>
    <p
      style={inter}
      className={`mt-3 text-base leading-6 font-semibold ${dark ? "text-white" : "text-[#011139]"}`}
    >
      {phase.subhead}
    </p>
    <p
      style={urbanist}
      className="mt-4 inline-block self-start rounded-lg bg-[#3191EA] px-3 py-1 text-[32px] leading-10 font-bold text-white"
    >
      {phase.price}
    </p>
    <p
      style={inter}
      className={`mt-5 text-sm leading-[21px] ${dark ? "text-white/85" : "text-[#011139]"}`}
    >
      {phase.summary}
    </p>

    <div className="mt-7 flex flex-col">
      {phase.groups.map((group) => (
        <GroupRow key={group.title} group={group} dark={dark} />
      ))}
    </div>
  </li>
);

const DoctorPricing = () => {
  return (
    <section id="packages" className="w-full scroll-mt-[130px] bg-[#F5F7FC] px-4">
      <div className="mx-auto w-full max-w-[1320px] py-16 lg:py-[100px]">
        <h2
          className="mx-auto max-w-[900px] text-center text-[30px] leading-[1.15] font-semibold text-[#0A7CFF] sm:text-[40px] lg:text-[52px]"
          style={urbanist}
        >
          Grow Your Healthcare Practice with Our Most Popular Package
        </h2>

        <p
          className="mx-auto mt-4 max-w-[640px] text-center text-base leading-6 font-medium text-[#6B7280] lg:text-lg"
          style={urbanist}
        >
          Start with a strong digital foundation, then scale into patient
          engagement and smarter practice management as your needs grow.
        </p>

        <ul className="mt-12 grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E0ECF6] md:grid-cols-3 lg:mt-[52px]">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.name} phase={phase} dark={index === 1} />
          ))}
        </ul>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-[1.03fr_1fr] md:items-stretch">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#D9E2EC]">
            <Image
              src={videoThumb}
              alt="Smarter digital solutions for healthcare professionals"
              fill
              sizes="(min-width: 768px) 656px, 100vw"
              className="object-contain"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-gray-500/10 via-gray-800/30 to-black/50"
            />
            <DoctorPlayButton />
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#D9E2EC]">
            <Image
              src={teamPhoto}
              alt="Team of doctors and nurses standing together"
              fill
              sizes="(min-width: 768px) 638px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorPricing;
