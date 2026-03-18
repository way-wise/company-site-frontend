import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import ServiceDetails from "@/components/modules/services/ServiceDetails";
import ServiceSlider from "@/components/modules/services/ServiceSlider";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { servicesData } from "@/datas/services";
import { getDynamicMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ServiceDetailsPageProps {
  params: {
    serviceId: string;
  };
}

export async function generateMetadata({
  params,
}: ServiceDetailsPageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const service = servicesData.find((service) => service.slug === serviceId);

  if (!service) {
    return {};
  }

  // Use dynamic SEO from admin panel with fallback to service data
  return getDynamicMetadata(`services/${serviceId}`, {
    title: `${service.title} Services | Web Development Company`,
    description: `${service.description} ${service.detailedDescription?.substring(0, 120) || ""} Expert ${service.title.toLowerCase()} services by Way Wise Tech, a leading web development company in the USA.`,
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} company`,
      `${service.title.toLowerCase()} services`,
      "web development company USA",
      "custom software development",
    ],
    path: service.url,
  });
}

const ServiceDetailsPage = async ({ params }: ServiceDetailsPageProps) => {
  const { serviceId } = await params;
  const service = servicesData.find((service) => service.slug === serviceId);

  // If service not found, show 404
  if (!service) {
    notFound();
  }

  return (
    <main>
      <PageHeader
        title={service.title}
        description={""}
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <ServiceDetails service={service} cta={service.ctabutton}/>
      <SuccessProjects />
      {/* <CategorySection /> */}
      <ServiceSlider />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default ServiceDetailsPage;
