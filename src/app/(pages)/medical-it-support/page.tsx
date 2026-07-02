import type { Metadata } from "next";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MedicalITSupportDetails from "@/components/modules/services/MedicalITSupportDetails";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
	title: "Medical Billing and Revenue Cycle Management | Way Wise Tech",
	 description:
      "Streamline your medical billing and revenue cycle management with our expert services.",
    keywords: ["medical billing", "revenue cycle management", "healthcare IT"],
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

