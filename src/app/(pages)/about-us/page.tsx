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
  title: "About Us | Web Development Company USA | Way Wise Tech",
  description:
    "Learn about Way Wise Tech, a leading web development company in the USA. Our expert team of 21+ engineers delivers innovative custom software solutions, web applications, and digital services for businesses worldwide.",
  keywords: [
    "web development company about",
    "web development firm team",
    "custom software development company",
    "experienced web developers",
    "web development company USA",
    "software development team",
    "web development experts",
    "digital solutions company",
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
