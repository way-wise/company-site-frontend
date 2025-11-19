import medicalBilling from "@/assets/images/services/billing-shape.png";
import microsoftSupport from "@/assets/images/services/ms-support.png";
import SectionTitle from "@/components/modules/home/SectionTitle";
import { ServiceDisplay } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "./ServiceCard";

const Services = ({
  servicesFirstData,
  servicesSecondData,
}: {
  servicesFirstData: ServiceDisplay[];
  servicesSecondData: ServiceDisplay[];
}) => {
  return (
    <section className="  bg-[url('@/assets/images/services/service-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto py-12 lg:py-20 ">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-20">
          {servicesFirstData?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between bg-white rounded-xl relative overflow-hidden">
            <div className="lg:w-1/2 p-5 lg:p-6">
              <h2 className="text-black text-2xl font-bold mb-4">
                Microsoft M365 Customer Support <br />
                <span className="text-lg tetx-brand">
                  (Services Previously Provided by our tech)
                </span>
              </h2>
              <p className="text-gray-900 text-sm mb-1">
                Way-Wise Tech covered end-to-end Microsoft 365 support:
              </p>
              <Link
                href="/microsoft-support"
                className="inline-block text-white bg-brand px-4 py-2 rounded-md text-base mt-3"
              >
                Learn More
              </Link>
            </div>
            <Image
              src={microsoftSupport}
              alt="Microsoft Support"
              className="lg:max-w-1/2 h-full w-full lg:w-auto lg:absolute right-0 bottom-0"
            />
          </div>
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between bg-white rounded-xl relative overflow-hidden">
            <div className="lg:w-1/2 p-5 lg:p-6">
              <h2 className="text-black text-2xl font-bold mb-4">
                Medical Billing & Coding Services <br />
                {/* <span className="text-lg tetx-brand">
                  (Services Previously Provided by our tech)
                </span> */}
              </h2>
              <p className="text-gray-900 text-sm mb-1">
                Let Us Take Care of Your Revenue While You Take Care of Your
                Patients. Expert medical billing, medical coding, revenue cycle
                management, credentialing, and compliance services.
              </p>
              <Link
                href="/medical-it-support"
                className="inline-block text-white bg-brand px-4 py-2 rounded-md text-base mt-3"
              >
                Learn More
              </Link>
            </div>
            <Image
              src={medicalBilling}
              alt="Microsoft Support"
              className="lg:max-w-1/2 h-full w-full lg:w-auto lg:absolute right-0 bottom-0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-20">
          {servicesSecondData?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
