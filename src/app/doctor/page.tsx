import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import DoctorNavbar from "@/components/modules/doctor/DoctorNavbar";
import DoctorBanner from "@/components/modules/doctor/DoctorBanner";
import DoctorProfessionals from "@/components/modules/doctor/DoctorProfessionals";
import DoctorPricing from "@/components/modules/doctor/DoctorPricing";
import DoctorTechHelps from "@/components/modules/doctor/DoctorTechHelps";
import DoctorExperiences from "@/components/modules/doctor/DoctorExperiences";
import DoctorSolutions from "@/components/modules/doctor/DoctorSolutions";
import DoctorFooter from "@/components/modules/doctor/DoctorFooter";

export const metadata: Metadata = {
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/doctor"),
  },
};

const DoctorPage = () => {
  return (
    // TEMPORARY: the page background is a placeholder. The navbar's #F2F5FF99 fill is
    // 60% alpha, so it needs something behind it, and the banner's Figma frame gave no
    // background colour. Replace once the real page/banner background is known.
    <main className="bg-[#EAEEFB]">
      <DoctorNavbar />
      <DoctorBanner />
      <DoctorProfessionals />
      <DoctorPricing />
      <DoctorTechHelps />
      <DoctorExperiences />
      <DoctorSolutions />
      <DoctorFooter />
    </main>
  );
};

export default DoctorPage;
