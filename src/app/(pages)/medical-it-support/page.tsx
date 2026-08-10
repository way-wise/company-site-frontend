import type { Metadata } from "next";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MedicalITSupportDetails from "@/components/modules/services/MedicalITSupportDetails";
import PageHeader from "@/components/shared/PageHeader";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	// Kept under Google's ~561px SERP title limit (514px in Arial 20px).
	title: "Medical Billing & Revenue Cycle Management | Way Wise",
	 description:
      "Streamline your medical billing and revenue cycle management with our expert services.",
    keywords: ["medical billing", "revenue cycle management", "healthcare IT"],
    // Self-referencing canonical. Without this the page inherits the root layout's
    // alternates.canonical, which points at the homepage and canonicalises this page away.
    alternates: {
      canonical: absoluteUrl("/medical-it-support"),
    },
};

const MedicalITSupportPage = () => {
  return (
    <main>
      <PageHeader
        title="Medical Billing and Revenue Cycle Management"
        description="Services"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <MedicalITSupportDetails />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default MedicalITSupportPage;

