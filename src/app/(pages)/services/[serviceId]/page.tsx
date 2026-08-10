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
  params: Promise<{
    serviceId: string;
  }>;
}

// Prerender all service pages at build time. A statically rendered page emits its
// metadata inside <head>; a dynamically rendered one streams it to the end of <body>
// (Next.js streaming metadata), which SEO crawlers flag as "meta robots outside <head>".
export function generateStaticParams() {
  return servicesData.map((service) => ({ serviceId: service.slug }));
}

// Unknown slugs 404 without an on-demand render, so no page can fall back to streamed metadata.
export const dynamicParams = false;

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
    // service.description is a complete, self-contained sentence written for this purpose and
    // is never rendered on the page. The previous value concatenated it with a hard 120-char
    // substring of detailedDescription plus a boilerplate suffix, which ran 312-375 chars and
    // emitted a mid-word cut ("...create powerful, us Expert mobile application...").
    description: service.description,
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
        // The <h1> is in <ServiceDetails />; this banner must not precede it.
        titleAs="plain"
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
