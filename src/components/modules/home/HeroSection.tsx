import Link from "next/link";
import Image from "next/image";

// Public folder image paths
const mainBackground = "/images/home/full-bg.png";
const heroLeftBg = "/images/home/hero-ai.png";

const officeServices = [
  ["Business Management", "Client Management", "Offshore Team MGMT"],
  ["Sales & Marketing", "Legal & Compliance", "Finance & Operations"],
];

const HeroSection = () => {
  return (
    <section
      className="w-full py-16 lg:py-24 relative"
      style={{
        backgroundImage: `url(${mainBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Office cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dubai card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#BD1C82] px-4 py-2.5 text-center">
                <h3 className="text-white font-bold text-sm lg:text-[15px] leading-tight">
                  WayWise Tech (Dubai, UAE)
                </h3>
              </div>
              <div className="p-3 lg:p-4">
                <div className="grid grid-cols-2 gap-x-3 mb-3">
                  {officeServices.map((col, ci) => (
                    <ul key={ci} className="space-y-1.5">
                      {col.map((item) => (
                        <li
                          key={item}
                          className="text-[11px] lg:text-xs text-gray-900 font-medium flex items-start gap-1"
                        >
                          <span className="mt-0.5 text-gray-600 shrink-0">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <hr className="border-gray-200 mb-2" />
                <div className="text-center">
                  <p className="text-[#BD1C82] font-bold text-xs lg:text-sm">
                    Dubai Office:
                  </p>
                  <p className="text-xs lg:text-sm text-gray-800 mt-0.5 leading-snug">
                    Arzoo Building, 3rd Floor (306-14) 171 Al Nahda Street, Al
                    Qusasis 2, Devika Business Center, Dubai.
                  </p>
                </div>
              </div>
            </div>

            {/* USA card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#C14223] px-4 py-2.5 text-center">
                <h3 className="text-white font-bold text-sm lg:text-[15px] leading-tight">
                  Way Wise Tech (California, USA)
                </h3>
              </div>
              <div className="p-3 lg:p-4">
                <div className="grid grid-cols-2 gap-x-3 mb-3">
                  {officeServices.map((col, ci) => (
                    <ul key={ci} className="space-y-1.5">
                      {col.map((item) => (
                        <li
                          key={item}
                          className="text-[11px] lg:text-xs text-gray-900 font-medium flex items-start gap-1"
                        >
                          <span className="mt-0.5 text-gray-600 shrink-0">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <hr className="border-gray-200 mb-2" />
                <div className="text-center">
                  <p className="text-[#C14223] font-bold text-xs lg:text-sm">
                    USA Office:
                  </p>
                  <p className="text-xs lg:text-sm text-gray-800 mt-0.5 leading-snug">
                    Saddleback Ridge rd, Santa Clarita, California, USA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main heading – single line, Outfit ExtraBold, 69px breathing room from cards */}
          <h2
            className="font-extrabold leading-none tracking-wide mt-[53px]"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "clamp(38px, 4.5vw, 60px)",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span className="text-white">WAY-WISE </span>
            <span className="text-[#00A3FF]">TECHNOLOGY</span>
          </h2>

          {/* Description – no max-width cap, stretches with the layout */}
          <p className="text-white/80 text-sm lg:text-base xl:text-lg leading-relaxed">
            Way Wise Tech is a UAE &amp; USA-based software company helping
            businesses grow through custom web development, scalable software
            solutions, and performance-driven digital marketing trusted by 100+
            global partners for fast delivery and real business results.
          </p>

          {/* CTA Button */}
          <div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-3 bg-[#00A3FF] text-white px-8 py-4 rounded-lg text-base lg:text-lg font-semibold hover:bg-[#0091e6] transition-all duration-300 hover:scale-105"
            >
              Lets Get Started
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 7L17 17M17 17H7M17 17V7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right column – AI image */}
        <div className="flex justify-center lg:justify-end items-center">
          <Image
            src={heroLeftBg}
            alt="Way Wise Tech AI"
            width={500}
            height={500}
            className="w-[280px] sm:w-[340px] lg:w-[380px] xl:w-[460px] h-auto"
            priority
          />
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="text-center text-white pb-4 md:pb-0 text-[18px] lg:text-[24px] xl:text-[28px] font-semibold px-2 mt-6 md:mt-0 md:absolute bottom-3 right-8 md:right-6 xl:right-20 2xl:right-40">
        <h2>Inspiring Innovation with AI...</h2>
      </div>
    </section>
  );
};

export default HeroSection;
