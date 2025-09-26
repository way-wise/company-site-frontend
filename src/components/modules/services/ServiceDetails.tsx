// components/WebDevelopment.tsx

import { Check } from "lucide-react";
import Image from "next/image";

const expertiseAreas = [
  {
    number: "01",
    title: "Custom Website Development",
    description:
      "We create tailor-made websites that perfectly align\nwith your brand identity and business goals.",
  },
  {
    number: "02",
    title: "E-commerce Solutions",
    description:
      "From small shops to big marketplaces, we build e-commerce\nplatforms that boost sales and engagement.",
  },
  {
    number: "03",
    title: "Content Management Systems (CMS)",
    description:
      "We develop easy-to-use CMS solutions that empower\nyou to manage your website content effortlessly.",
  },
  {
    number: "02",
    title: "API Development and Integration",
    description:
      "We create and integrate APIs to enhance your website's\nfunctionality and connectivity with third-party services.",
  },
];
const serviceOutcomes = [
  "Innovative Solutions Showcase",
  "Success Stories Variety",
  "Industry-specific Transformations",
  "Business Reinvention Illustration",
  "Impactful Change Demonstrations",
  "Strategic Vision Reflection",
];
export default function WebDevelopment() {
  return (
    <div
      className="bg-[#f2f6ff] overflow-hidden w-full min-h-screen relative translate-y-[-1rem] animate-fade-in opacity-0"
      data-model-id="216:552"
    >
      {/* Video/Image Placeholder */}
      <section className="relative py-8 md:py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
        <div className="max-w-[1170px] mx-auto px-4 md:px-0">
          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center">
            <Image
              className="w-full h-full object-cover rounded-[10px]"
              alt="Service Video"
              src={require("@/assets/images/services/service-details.png")}
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </section>
      <section className="py-8 md:py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
        <div className="max-w-[1170px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-4 md:mb-8">
            Web Development
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#3d4e5c] leading-6 md:leading-8 mb-8 md:mb-16">
            At Way-Wise Tech, we transform your digital vision into reality
            through cutting-edge web development solutions. Our team of skilled
            developers crafts websites and web applications that not only look
            stunning but also deliver exceptional performance and user
            experience. We create tailor-made websites that perfectly align with
            your brand identity and business goals. From small online stores to
            large-scale marketplaces, we build robust e-commerce platforms that
            drive sales and enhance customer engagement. We develop easy-to-use
            CMS solutions that empower you to manage your website content
            effortlessly. Our PWAS combine the best of web and mobile apps,
            offering seamless experiences across all devices. We create and
            integrate APIs to enhance your website's functionality and
            connectivity with third-party services.
          </p>

          <h3 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Our Web Development Expertise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-x-16 lg:gap-y-12">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="flex gap-4 md:gap-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00a3ff] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm md:text-lg">
                    {area.number}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-[#1b3447] mb-2 md:mb-4">
                    {area.title}
                  </h4>
                  <p className="text-sm text-[#3d4e5c] leading-5 md:leading-6 whitespace-pre-line">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Outcome Section */}
      <section className="py-8 md:py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
        <div className="max-w-[1170px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-4 md:mb-8">
            Service Outcome
          </h2>
          <p className="text-sm md:text-base text-[#657585] leading-6 md:leading-8 mb-8 md:mb-12">
            Here are six key points that can be associated with a digital
            transformation gallery case global digital systems engineer services
            leader helping fortune 500 companies on their innovation agenda:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-x-16 lg:gap-y-8">
            {serviceOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-3 md:gap-4">
                <div className="bg-white rounded-full flex items-center justify-center p-2 flex-shrink-0">
                  <Check className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <span className="text-sm md:text-base text-[#657585]">
                  {outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
