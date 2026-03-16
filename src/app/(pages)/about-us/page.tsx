import ChooseUs from "@/components/modules/aboutUs/whychooseUs";
import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.waywisetech.com"
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "About Way Wise Tech | Web & Software Development Company USA",
  description:
    "Learn about Way Wise Tech, Web & Software Development Company in the USA delivering custom software, web, mobile apps, and digital solutions.",
  keywords: [
    "About Way Wise Tech | Web & Software Development Company USA",
    "custom software development company",
    "custom software development company",
    "web development company in USA",
    "web application development services",
    "mobile app development company",
    "enterprise software solutions",
    "full-stack development company",
    "cloud engineering services",
    "AI software development services"
  ],
  alternates: {
    canonical: `${baseUrl}/about-us`,
  },
  openGraph: {
    type: "website",
    url: `${baseUrl}/about-us`,
    title: "About Us | Web Development Company USA",
    description:
      "Learn about Way Wise Tech, a leading web development company with expert engineers delivering innovative custom software solutions.",
  },
};

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
