import CategorySection from "@/components/modules/home/OldCategorySection";
import ContactUs from "@/components/modules/home/OldContactUs";
import Feadback from "@/components/modules/home/OldFeadback";
import HeroSection from "@/components/modules/home/OldHeroSection";
import Offers from "@/components/modules/home/OldOffers";
import Projects from "@/components/modules/home/OldProjects";
import Services from "@/components/modules/home/OldServices";
import Skills from "@/components/modules/home/OldSkills";
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
