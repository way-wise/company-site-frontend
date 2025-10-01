import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import ServiceDetails from "@/components/modules/services/ServiceDetails";
import ServiceSlider from "@/components/modules/services/ServiceSlider";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { servicesData } from "@/datas/services";
import { notFound } from "next/navigation";

interface ServiceDetailsPageProps {
  params: {
    serviceId: string;
  };
}

const ServiceDetailsPage = ({ params }: ServiceDetailsPageProps) => {
  const service = servicesData.find(
    (service) => service.slug === params.serviceId
  );

  // If service not found, show 404
  if (!service) {
    notFound();
  }

  // Split title for display
  const titleWords = service.title.split(" ");
  const firstPart = titleWords.slice(0, -1).join(" ");
  const lastWord = titleWords[titleWords.length - 1];

  return (
    <main>
      <PageHeader
        title={firstPart || service.title}
        description={lastWord || ""}
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <ServiceDetails service={service} />
      <SuccessProjects />
      <CategorySection />
      <ServiceSlider />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default ServiceDetailsPage;
