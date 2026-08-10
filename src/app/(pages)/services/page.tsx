import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import Offers from "@/components/modules/home/Offers";
import Services from "@/components/modules/home/Services";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { servicesFirstData, servicesSecondData } from "@/datas/services";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicMetadata("services", {
    // Kept under Google's ~561px SERP title limit (527px in Arial 20px).
    title: "Web, Software & Digital Solution Services | Way Wise Tech",
    // 129 chars — under Google's ~155-char meta description limit.
    description:
      "Web development services from Way Wise Tech: custom software development, ecommerce, web apps, mobile apps and digital marketing.",
    keywords: [
      "web development services",
      "custom software development",
      "web application development",
      "ecommerce development",
      "mobile app development",
      "react development",
      "node js development",
      "python development",
      "laravel development",
      "wordpress development",
      "shopify development",
      "cloud engineering",
      "digital marketing",
      "graphics design",
      "AI/ML solutions",
    ],
    path: "/services",
  });
}

const ServicesPage = () => {
  return (
    <>
      <PageHeader
        titleAs="h1"
        title="OUR"
        description="SERVICES"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <Services
        servicesFirstData={servicesFirstData}
        servicesSecondData={servicesSecondData}
      />
      <SuccessProjects />
      <Offers />
      <Feadback />
      <ContactUs />
    </>
  );
};

export default ServicesPage;
