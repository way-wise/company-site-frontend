import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import HeroSection from "@/components/modules/home/HeroSection";
import Offers from "@/components/modules/home/Offers";
import Projects from "@/components/modules/home/Projects";
import Services from "@/components/modules/home/Services";
import Skills from "@/components/modules/home/Skills";
import { servicesFirstData, servicesSecondData } from "@/datas/services";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicMetadata("home", {
    // Kept under Google's ~561px SERP title limit (553px in Arial 20px).
    title: "Custom Software & Web Development | Way Wise Tech",
    // 148 chars — under Google's ~155-char meta description limit.
    description:
      "WayWise Tech is a custom software development company delivering web applications, mobile apps, AI solutions, cloud engineering, UX design, and digital transformation services for startups and businesses in the USA and beyond.",
    keywords: [
      "Web and Software Development Company USA",
      "custom software development services USA",
      "website development company USA",
      "mobile app development company USA",
      "full-stack development company USA",
      "custom web development firm",
      "Best software firm",
      "best website design firm"
    ],
    path: "/",
  });
}

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <Services
        servicesFirstData={servicesFirstData}
        servicesSecondData={servicesSecondData}
      />
      <Skills />
      <Projects />
      <Offers />
      <Feadback />
      <ContactUs />
    </div>
  );
};

export default HomePage;
