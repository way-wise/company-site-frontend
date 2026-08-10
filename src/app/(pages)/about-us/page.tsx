import ChooseUs from "@/components/modules/aboutUs/whychooseUs";
import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicMetadata("about-us", {
    // Kept under Google's ~561px SERP title limit (554px in Arial 20px).
    title: "About Way Wise Tech | Software Development Company USA",
    description:
      "Learn about Way Wise Tech, Web & Software Development Company in the USA delivering custom software, web, mobile apps, and digital solutions.",
    keywords: [
      "About Way Wise Tech | Web & Software Development Company USA",
      "custom software development company",
      "web development company in USA",
      "web application development services",
      "mobile app development company",
      "enterprise software solutions",
      "full-stack development company",
      "cloud engineering services",
      "AI software development services"
    ],
    path: "/about-us",
  });
}

const AboutUs = () => {
  return (
    <>
      <PageHeader
        title="ABOUT"
        description="WAY-WISE"
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <ChooseUs />
      <SuccessProjects />
      <CategorySection />
      <ContactUs />
    </>
  );
};

export default AboutUs;
