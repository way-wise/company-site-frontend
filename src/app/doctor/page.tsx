import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import DoctorTopBar from "@/components/modules/doctor/DoctorTopBar";
import DoctorNavbar from "@/components/modules/doctor/DoctorNavbar";
import DoctorBanner from "@/components/modules/doctor/DoctorBanner";
import DoctorStats from "@/components/modules/doctor/DoctorStats";
import DoctorBuiltFor from "@/components/modules/doctor/DoctorBuiltFor";
import DoctorMarquee from "@/components/modules/doctor/DoctorMarquee";
import DoctorWork from "@/components/modules/doctor/DoctorWork";
import DoctorWhyUs from "@/components/modules/doctor/DoctorWhyUs";
import DoctorProcess from "@/components/modules/doctor/DoctorProcess";
import DoctorPricing from "@/components/modules/doctor/DoctorPricing";
import DoctorInsights from "@/components/modules/doctor/DoctorInsights";
import DoctorReviews from "@/components/modules/doctor/DoctorReviews";
import DoctorFaq from "@/components/modules/doctor/DoctorFaq";
import DoctorCta from "@/components/modules/doctor/DoctorCta";
import DoctorFooter from "@/components/modules/doctor/DoctorFooter";

export const metadata: Metadata = {
  title: "Medical Practice Websites & Patient Portals | Way Wise Tech",
  description:
    "Way Wise Tech builds professional websites and secure patient portals for medical practices, helping doctors attract patients and improve efficiency.",
  keywords: [
    "medical practice website design",
    "doctor website development",
    "patient portal for clinics",
    "healthcare software development",
  ],
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/doctor"),
  },
};

const DoctorPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <DoctorTopBar />
      <DoctorNavbar />
      <DoctorBanner />
      <DoctorStats />
      <DoctorBuiltFor />
      <DoctorMarquee />
      <DoctorWork />
      <DoctorWhyUs />
      <DoctorProcess />
      <DoctorPricing />
      <DoctorInsights />
      <DoctorReviews />
      <DoctorFaq />
      <DoctorCta />
      {/* New sections go above the footer. */}
      <DoctorFooter />
    </main>
  );
};

export default DoctorPage;
