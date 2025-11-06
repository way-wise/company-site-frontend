import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import HeroSection from "@/components/modules/home/HeroSection";
import Offers from "@/components/modules/home/Offers";
import Projects from "@/components/modules/home/Projects";
import Services from "@/components/modules/home/Services";
import Skills from "@/components/modules/home/Skills";
import { servicesFirstData, servicesSecondData } from "@/datas/services";

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
