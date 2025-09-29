import aboutMain from "@/assets/images/about-us/about-main.svg";
import aboutUs from "@/assets/images/about-us/about-us.svg";
import Image from "next/image";

const whyChooseUsItems = [
  {
    number: "01",
    title: "Expert Team",
    description:
      "Our team consists of industry professionals with years of\nexperience in web development, design, and digital marketing.",
  },
  {
    number: "02",
    title: "Tailored Solutions",
    description:
      "We understand that every business is unique. That's why we\ncustomize our solutions to fit your specific needs and goals.",
  },
  {
    number: "03",
    title: "Quality Focused",
    description:
      "We are committed to delivering market-standard,\nhigh-quality solutions with precision and attention to detail.",
  },
  {
    number: "04",
    title: "Innovative Approach",
    description:
      "We stay ahead of the curve, using the latest technologies\nand trends to give your business a competitive edge.",
  },
];

const ChooseUs = () => {
  return (
    <div className="bg-[#f2f6ff] min-h-screen w-full">
      {/* Main Content Section */}
      <section className="relative py-20 px-4 lg:px-8 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Images Section */}
            <div className="relative order-2 lg:order-1">
              {/* Main Image with Border */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-[10px_10px_10px_100px] border-[3px] border-solid border-[#d964a1]" />
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[466px] bg-[#d9d9d9] rounded-[10px_10px_10px_100px] overflow-hidden">
                  <Image
                    className="w-full h-full object-cover rounded-[10px_10px_10px_100px]"
                    alt="Main content image"
                    src={aboutMain}
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              {/* Small Image */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 lg:-right-12 w-[200px] sm:w-[250px] lg:w-[292px] h-[180px] sm:h-[220px] lg:h-[277px] bg-white rounded-xl border-[10px] border-solid border-white overflow-hidden">
                <Image
                  className="w-full h-full object-cover rounded-xl"
                  alt="Secondary content image "
                  src={aboutUs}
                  width={100}
                  height={100}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2 space-y-8 ">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[55px] font-bold text-[#1b3447] leading-tight translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] text-center lg:text-left">
                We are Specialize
                <br />
                in Tech Solutions
              </h1>
              <p className="text-lg sm:text-xl text-[#3d4e5c] leading-7 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                At Way-Wise Tech, a California-based software and web
                development firm, we craft innovative digital solutions that
                drive business growth.
                <br />
                <br />
                Our expert team of developers, designers, marketers, and IT
                specialists deliver stunning websites, powerful applications,
                and results-driven marketing strategies. We partner closely with
                clients to transform visions into reality—blending creativity,
                technical excellence, and industry insight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 lg:px-8 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-[35px] font-semibold text-[#1b3447] text-center mb-16 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {whyChooseUsItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 translate-y-[-1rem] animate-fade-in opacity-0"
                style={
                  {
                    "--animation-delay": `${800 + index * 200}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="w-10 h-10 bg-[#00a3ff] rounded-[20px] flex items-center justify-center flex-shrink-0">
                  <div className="font-medium text-white text-lg leading-[normal] text-center">
                    {item.number}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#1b3447]">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#3d4e5c] leading-6 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseUs;
