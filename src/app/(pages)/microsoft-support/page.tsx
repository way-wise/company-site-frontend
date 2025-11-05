import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MicrosoftSupportDetails from "@/components/modules/services/MicrosoftSupportDetails";
import PageHeader from "@/components/shared/PageHeader";

const MicrosoftSupportPage = () => {
  return (
    <main>
      <PageHeader
        title="Microsoft Support"
        description="Services"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <MicrosoftSupportDetails />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default MicrosoftSupportPage;

