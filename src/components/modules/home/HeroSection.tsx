import mainBackground from "@/assets/images/home/hero-bg.png";

const HeroSection = () => {
  return (
    <section
      className="w-full h-full py-10 lg:h-[80vh]"
      style={{
        backgroundImage: `url(${mainBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main content */}
      <div className="  flex flex-col items- justify-center h-full   px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="mb-8">
            <div className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-wide">
              <p className="text-white ">INSPIRING</p>
              <p className="text-transparent bg-gradient-to-r from-[#00D4FF] to-[#0099CC] bg-clip-text ">
                INNOVATION
              </p>
              <p className="text-white">WITH AI</p>
            </div>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-md md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            We are a global software development firm delivering
            <br />
            innovative, customized solutions that empower businesses
            <br />
            and set new standards in quality and technology.
          </p>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
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
    </section>
  );
};

export default HeroSection;
