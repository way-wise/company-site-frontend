import heroCircle from "@/assets/images/home/hero-circle.gif";
import heroRightCircle from "@/assets/images/home/hero-right-circle.gif";
import mainBackground from "@/assets/images/home/main-background.png";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Main Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={mainBackground}
          alt="Main Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Left side GIF */}
      <div className="absolute bottom-0 left-0 z-10">
        <Image
          src={heroCircle}
          alt="Hero Circle Animation"
          width={350}
          height={350}
          className="opacity-90"
          priority
        />
      </div>

      {/* Right side GIF */}
      <div className="absolute bottom-0 right-0 z-10">
        <Image
          src={heroRightCircle}
          alt="Hero Right Circle Animation"
          width={300}
          height={300}
          className="opacity-90"
          priority
        />
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="mb-8">
            <div className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-wide">
              <div className="text-white mb-2">INSPIRING</div>
              <div className="text-transparent bg-gradient-to-r from-[#00D4FF] to-[#0099CC] bg-clip-text mb-2">
                INNOVATION
              </div>
              <div className="text-white">WITH AI</div>
            </div>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
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
