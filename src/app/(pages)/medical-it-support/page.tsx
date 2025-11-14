import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MedicalITSupportDetails from "@/components/modules/services/MedicalITSupportDetails";
import PageHeader from "@/components/shared/PageHeader";

const MedicalITSupportPage = () => {
  return (
    <main>
      <PageHeader
        title="Medical IT Support"
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

