import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import Offers from "@/components/modules/home/Offers";
import Services from "@/components/modules/home/Services";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { servicesFirstData, servicesSecondData } from "@/datas/services";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Web Development Services | Software Development | Digital Solution Services",
  description:
    "Comprehensive web development services including custom software development, ecommerce solutions, web applications, mobile apps, and digital marketing. Expert team delivering innovative solutions.",
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
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    type: "website",
    url: `${baseUrl}/services`,
    title: "Web Development Services | Software Development | Digital Solution Services",
    description:
      "Comprehensive web development services including custom software development, ecommerce solutions, and digital marketing.",
  },
};

const ServicesPage = () => {
  return (
    <>
      <PageHeader
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
