// components/WebDevelopment.tsx

import { Check } from "lucide-react";

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
      <section className="relative py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
        <div className="max-w-[1170px] mx-auto">
          <div className="w-full h-[500px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center">
            <img
              className="w-full h-full object-cover rounded-[10px]"
              alt="Service Video"
              src="https://c.animaapp.com/mg0sjtgwWIqUMb/img/rectangle.svg"
            />
          </div>
        </div>
      </section>
      <section className="py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
        <div className="max-w-[1170px] mx-auto px-8">
          <h2 className="text-[35px] font-semibold text-[#1b3447] [font-family:'Inter',Helvetica] mb-8">
            Web Development
          </h2>
          <p className="text-xl text-[#3d4e5c] [font-family:'Inter',Helvetica] leading-[30px] mb-16">
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

          <h3 className="text-[35px] font-semibold text-[#1b3447] [font-family:'Inter',Helvetica] mb-12">
            Our Web Development Expertise
          </h3>

          <div className="grid grid-cols-2 gap-x-16 gap-y-12">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="flex gap-6">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-[20px] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-lg [font-family:'Inter',Helvetica]">
                    {area.number}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#1b3447] [font-family:'Inter',Helvetica] mb-4">
                    {area.title}
                  </h4>
                  <p className="text-sm text-[#3d4e5c] [font-family:'Inter',Helvetica] leading-6 whitespace-pre-line">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Outcome Section */}
      <section className="py-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
        <div className="max-w-[1170px] mx-auto px-8">
          <h2 className="text-[35px] font-semibold text-[#1b3447] [font-family:'Inter',Helvetica] mb-8">
            Service Outcome
          </h2>
          <p className="text-base text-[#657585] [font-family:'Inter',Helvetica] leading-[30px] mb-12">
            Here are six key points that can be associated with a digital
            transformation gallery case global digital systems engineer
            <br />
            services leader helping fortune 500 companies on their innovation
            agenda:
          </p>

          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            {serviceOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className=" bg-white rounded-full flex items-center justify-center p-2">
                  <Check className="w-6 h-6  " />
                </div>
                <span className="text-base text-[#657585] ">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
