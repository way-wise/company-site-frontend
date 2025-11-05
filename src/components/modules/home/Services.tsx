import SectionTitle from "@/components/modules/home/SectionTitle";
import { ServiceDisplay } from "@/types";
import ServiceCard from "./ServiceCard";
import Image from "next/image";
import microsoftSupport from "@/assets/images/services/microsoft-support.png";
import Link from "next/link";

const Services = ({ services }: { services: ServiceDisplay[] }) => {

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
        <div className="flex justify-center items-center">
          <div className="max-w-4xl p-8 flex gap-8 justify-between items-center bg-linear-to-tr from-[#638f06] to-[#e23808] rounded-xl mb-8">
            <div>
              <h2 className="text-white text-2xl font-bold mb-4">Microsoft M365 Customer Support Services</h2>
                <p className="text-white text-base mb-1">Way-Wise Tech provides end-to-end Microsoft 365 support covering:
                  </p>
                <ul className="list-disc text-sm list-inside text-white">
                  <li>SCIM / Identity & Access Management</li>
                  <li>SharePoint Online (SPO)</li>
                  <li>Exchange (Online and On-Prem migrations)</li>
                  <li>Microsoft Teams</li>
                  <li>Azure Services</li>
                  <li>Billing & Subscription Management</li>
                  <li>Forum / Community / Support Desk Operations</li>
                </ul>
                <Link href="/microsoft-support" className="inline-block text-white bg-brand px-4 py-2 rounded-md text-base mt-3">Learn More</Link>
            </div>
            <Image src={microsoftSupport} alt="Microsoft Support" className="w-1/2 rounded-md" />
          </div>
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
