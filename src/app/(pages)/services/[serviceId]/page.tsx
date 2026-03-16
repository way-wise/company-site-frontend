import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import ServiceDetails from "@/components/modules/services/ServiceDetails";
import ServiceSlider from "@/components/modules/services/ServiceSlider";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { servicesData } from "@/datas/services";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.waywisetech.com"
    : "http://localhost:3000");

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

  // Generate SEO-friendly keywords based on service type
  const getServiceKeywords = (title: string): string[] => {
    const keywords: string[] = [];
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("web")) {
      keywords.push(
        "web development company",
        "web application development",
        "custom web development",
        "web development services"
      );
    }
    if (lowerTitle.includes("mobile")) {
      keywords.push(
        "mobile app development company",
        "mobile application development",
        "ios app development",
        "android app development"
      );
    }
    if (lowerTitle.includes("digital marketing")) {
      keywords.push(
        "digital marketing services",
        "seo services",
        "social media marketing",
        "ppc advertising"
      );
    }
    if (lowerTitle.includes("graphics")) {
      keywords.push(
        "graphics design services",
        "brand identity design",
        "ui ux design",
        "logo design"
      );
    }
    if (lowerTitle.includes("cloud")) {
      keywords.push(
        "cloud engineering services",
        "aws cloud services",
        "azure cloud services",
        "cloud migration"
      );
    }
    if (lowerTitle.includes("ai") || lowerTitle.includes("iot")) {
      keywords.push(
        "ai ml solutions",
        "iot development",
        "artificial intelligence services",
        "machine learning solutions"
      );
    }

    return keywords;
  };

  const serviceKeywords = getServiceKeywords(service.title);

  return {
    title: `${service.title} Services | Web Development Company`,
    description: `${service.description} ${service.detailedDescription?.substring(0, 120) || ""} Expert ${service.title.toLowerCase()} services by Way Wise Tech, a leading web development company in the USA.`,
    keywords: [
      ...serviceKeywords,
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} company`,
      `${service.title.toLowerCase()} services`,
      "web development company USA",
      "custom software development",
    ],
    alternates: {
      canonical: `${baseUrl}${service.url}`,
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}${service.url}`,
      title: `${service.title} Services | Web Development Company`,
      description: service.description,
    },
  };
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
