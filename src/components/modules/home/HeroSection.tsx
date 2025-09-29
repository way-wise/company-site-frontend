import mainBackground from "@/assets/images/home/full-bg.png";
import heroLeftBg from "@/assets/images/home/hero-ai.png";
import Image from "next/image";

const HeroSection = () => {
  console.log(heroLeftBg.src);
  return (
    <section
      className="w-full h-full py-10 lg:h-[80vh] bg-left  md:bg-right lg:bg-center"
      style={{
        backgroundImage: `url(${mainBackground.src})`,
        backgroundSize: "cover",
        // backgroundPosition: "right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main content */}

      <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="flex flex-col justify-center items-center md:items-start">
          {/* Main heading */}
          <h1 className="mb-8">
            <div className="text-4xl lg:text-6xl  font-bold tracking-wide text-center md:text-left">
              <h1 className="text-white ">WAY-WISE</h1>
              <h2 className="text-transparent bg-gradient-to-r from-[#00D4FF] to-[#0099CC] bg-clip-text ">
                TECHNOLOGY
              </h2>
            </div>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-md  lg:text-2xl max-w-3xl mb-12 leading-relaxed text-center  md:text-left ">
            We are a global software development firm delivering innovative,
            customized solutions that empower businesses and set new standards
            in quality and technology.
          </p>

          {/* CTA Button */}
          <div>
            <button className="bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white lg:px-8 lg:py-4 px-4 py-3 rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-left">
              Let&apos;s Get Started
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div className="animate-bounce-slow">
            <Image
              src={heroLeftBg.src}
              alt="hero left bg"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
