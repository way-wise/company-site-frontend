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
    title: "Web and Software Development Company USA | Way Wise Tech",
    description:
      "Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web, app, and digital solutions for global businesses",
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
