import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import HeroSection from "@/components/modules/home/HeroSection";
import Offers from "@/components/modules/home/Offers";
import Projects from "@/components/modules/home/Projects";
import Services from "@/components/modules/home/Services";
import Skills from "@/components/modules/home/Skills";
import { servicesFirstData, servicesSecondData } from "@/datas/services";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.waywisetech.com"
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Web and Software Development Company USA | Way Wise Tech",
  description:
    "Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses seeking innovation and reliability.",
  keywords: [
    "web development company",
    "web development firm",
    "web development company USA",
    "web development firm USA",
    "custom web development company",
    "custom web development firm",
    "ecommerce web development company",
    "ecommerce web development firm",
    "best web development company",
    "best web development firm",
    "top web development firm",
    "web development company near me",
    "web development firm near me",
    "web development company in USA",
    "web development company in India",
    "offshore web development firm",
    "enterprise web development firm",
    "react js web development company",
    "node js web development company",
    "python web development company",
    "laravel web development company",
    "wordpress web development company",
    "shopify web development company",
    "magento web development company",
    "drupal web development company",
    "angularjs web development company",
    "php web development company",
    "ruby on rails web development company",
    "web development firm New York",
    "web development firm NYC",
    "web development firm Chicago",
    "web development firm Boston",
    "web development firm Atlanta",
    "web development firm Miami",
    "web development firm DC",
    "web development firm Sarasota",
    "web development firm India",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Web Development Company USA | Custom Software Solutions",
    description:
      "Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses.",
  },
};

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
