import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import ServiceDetails from "@/components/modules/services/ServiceDetails";
import ServiceSlider from "@/components/modules/services/ServiceSlider";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";

const ServiceDetailsPage = () => {
  return (
    <main>
      <PageHeader
        title="Web "
        description="Application"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <ServiceDetails />
      <SuccessProjects />
      <CategorySection />
      <ServiceSlider />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default ServiceDetailsPage;
