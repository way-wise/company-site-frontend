// components/WebDevelopment.tsx
import devImg from "@/assets/images/services/service-details.png"; // replace with your image path
import Image from "next/image";

export default function WebDevelopment() {
  return (
    <section className="relative w-full bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        {/* Image */}
        <div className="w-full flex justify-center mb-12">
          <div className="rounded-xl overflow-hidden shadow-lg max-w-4xl w-full">
            <Image
              src={devImg}
              alt="Web development planning"
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Web Development Intro */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Web Development
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            At Way-Wise Tech, we transform your digital vision into reality
            through cutting-edge web development solutions. Our team of skilled
            developers crafts websites and web applications that not only look
            stunning but also deliver exceptional performance and user
            experience. We create tailor-made websites that perfectly align with
            your brand identity and business goals. From small online stores to
            large-scale marketplaces, we build robust e-commerce platforms that
            drive sales and enhance customer engagement. We develop easy-to-use
            CMS solutions that empower you to manage your website content
            effortlessly. Our PWAs combine the best of web and mobile apps,
            offering seamless experiences across all devices. We create and
            integrate APIs to enhance your website’s functionality and
            connectivity with third-party services.
          </p>
        </div>

        {/* Expertise Section */}
        <div className="mt-16">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-center mb-10">
            Our Web Development Expertise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Item 1 */}
            <div className="text-center">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4">
                01
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Custom Website Development
              </h4>
              <p className="text-sm text-gray-600">
                We create tailor-made websites that perfectly align with your
                brand identity and business goals.
              </p>
            </div>

            {/* Item 2 */}
            <div className="text-center">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4">
                02
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                E-commerce Solutions
              </h4>
              <p className="text-sm text-gray-600">
                From small shops to big marketplaces, we build e-commerce
                platforms that boost sales and engagement.
              </p>
            </div>

            {/* Item 3 */}
            <div className="text-center">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4">
                03
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Content Management Systems (CMS)
              </h4>
              <p className="text-sm text-gray-600">
                We develop easy-to-use CMS solutions that empower you to manage
                your website content effortlessly.
              </p>
            </div>

            {/* Item 4 */}
            <div className="text-center">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4">
                04
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                API Development and Integration
              </h4>
              <p className="text-sm text-gray-600">
                We create and integrate APIs to enhance your website’s
                functionality and connectivity with third-party services.
              </p>
            </div>
          </div>
        </div>

        {/* Service Outcome */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-center mb-8">
            Service Outcome
          </h3>
          <p className="text-center text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-10">
            Here are six key points that can be associated with a digital
            transformation gallery case global digital systems engineer services
            leader helping fortune 500 companies on their innovation agenda:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <p className="text-gray-700 font-medium">
              • Innovative Solutions Showcase
            </p>
            <p className="text-gray-700 font-medium">
              • Business Reinvention Illustration
            </p>
            <p className="text-gray-700 font-medium">
              • Success Stories Variety
            </p>
            <p className="text-gray-700 font-medium">
              • Impactful Change Demonstration
            </p>
            <p className="text-gray-700 font-medium">
              • Industry-specific Transformations
            </p>
            <p className="text-gray-700 font-medium">
              • Strategic Vision Reflection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
