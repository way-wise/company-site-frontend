import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import Offers from "@/components/modules/home/Offers";
import Services from "@/components/modules/home/Services";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";

const ServicesPage = () => {
  return (
    <>
      <PageHeader
        title="OUR"
        description="SERVICES"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
        bgImage="@/assets/images/services/service-header.png"
      />
      <Services />
      <SuccessProjects />
      <Offers />
      <Feadback />
      <ContactUs />
    </>
  );
};

export default ServicesPage;
