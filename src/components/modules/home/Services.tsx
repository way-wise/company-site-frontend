import SectionTitle from "@/components/modules/home/SectionTitle";
import { ServiceDetail } from "@/types";
import ServiceCard from "./ServiceCard";

const Services = ({ services }: { services: ServiceDetail[] }) => {
  return (
    <section className="  bg-[url('@/assets/images/services/service-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto py-12 lg:py-20 px-2">
        <div className="mb-16">
          <SectionTitle
            title="Our Services"
            description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
            titleClass="text-white text-4xl pb-4  xl:text-[55px] font-bold"
            descriptionClass="text-white text-base xl:text-[20px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-20  ">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
