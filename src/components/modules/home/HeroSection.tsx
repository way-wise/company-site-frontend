import Image from "next/image";
import Link from "next/link";

// Public folder image paths
const mainBackground = "/images/home/full-bg.webp";
const heroLeftBg = "/images/home/hero-ai.png";

const usaServices = [
  { label: "Business Administration", bold: false },
  { label: "Client Management", bold: true },
  { label: "Offshore Team MGMT", bold: false },
  { label: "Sales & Marketing", bold: false },
  { label: "Legal & Compliance", bold: false },
  { label: "Finance & Operations", bold: false },
];

const dubaiServices = [
  { label: "Research & Development", bold: false },
  { label: "Software Production", bold: false },
  { label: "Project Delivery Management", bold: false },
  { label: "UI/UX & Product Engineering", bold: false },
  { label: "Quality Control (QC)", bold: false },
  { label: "System Maintenance", bold: true },
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
        <div className="flex flex-col gap-4 w-full lg:w-[115%]">
          {/* Office cards */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              {/* USA card – red */}
              <div className="bg-[#D0201A] rounded-2xl p-4 lg:p-5 shadow-xl">
                {/* Plain <div>, not a heading: these office cards sit above the page
                            <h1> in the DOM, so as headings they made the <h1> non-sequential. */}
                <div className="text-white font-black text-xl lg:text-2xl xl:text-3xl leading-tight mb-3">
                  WayWise
                  <br />
                  <span className="text-white">Tech USA</span>
                </div>
                <ul className="space-y-1.5">
                  {usaServices.map((item) => (
                    <li
                      key={item.label}
                      className={`text-white text-[11px] lg:text-xs xl:text-sm flex items-start gap-1.5 ${item.bold ? "font-bold" : "font-normal"}`}
                    >
                      <span className="shrink-0 mt-0.5">•</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dubai card – dark */}
              <div className="bg-[#1A1A1A] rounded-2xl p-4 lg:p-5 shadow-xl">
                {/* Plain <div>, not a heading — see the USA card above. */}
                <div className="text-white font-black text-xl lg:text-2xl xl:text-3xl leading-tight mb-3">
                  WayWise
                  <br />
                  <span className="text-white">Tech Dubai</span>
                </div>
                <ul className="space-y-1.5">
                  {dubaiServices.map((item) => (
                    <li
                      key={item.label}
                      className={`text-white text-[11px] lg:text-xs xl:text-sm flex items-start gap-1.5 ${item.bold ? "font-bold" : "font-normal"}`}
                    >
                      <span className="shrink-0 mt-0.5">•</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom label row */}
            {/* <div className="flex items-center gap-2 px-1">
                     <p className="text-white font-bold text-xs lg:text-sm whitespace-nowrap">
                        Admin &amp; Operation
                     </p>
                     <div className="flex items-center">
                        <div className="flex-1 h-[2px] bg-[#D0201A]" />
                        <svg
                           width="10"
                           height="10"
                           viewBox="0 0 10 10"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M0 5H8M8 5L4 1M8 5L4 9"
                              stroke="#D0201A"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />
                        </svg>
                     </div>
                     <p className="text-[#D0201A] font-bold text-xs lg:text-sm whitespace-nowrap">
                        Production House
                     </p>
                  </div> */}
          </div>

          {/* Main heading – single line, Outfit ExtraBold, 69px breathing room from cards */}
          {/* This is the homepage's <h1>: it's the main title of the page. Sizing comes
                   entirely from the classes and inline style below, so the heading level has
                   no visual effect (Tailwind's preflight resets heading font-size/weight). */}
          <h1
            className="font-extrabold leading-18 tracking-wide mt-10 text-center md:text-left"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "clamp(38px, 4.5vw, 60px)",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span className="text-white uppercase">
              Software Development &{" "}
            </span>
            <span className="text-[#00a2ff] uppercase">
              Digital Solutions Company
            </span>
          </h1>

          {/* Description – no max-width cap, stretches with the layout */}
          <p className="text-white/80 text-sm lg:text-base xl:text-lg leading-relaxed text-center md:text-left md:w-[80%] lg:w-full">
            Way Wise Tech is a UAE &amp; USA-based software company helping
            businesses grow through custom web development, scalable software
            solutions, and performance-driven digital marketing trusted by 100+
            global partners for fast delivery and real business results.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center md:justify-start">
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
          <div className="animate-bounce-slow">
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
      </div>

      {/* Bottom tagline */}
      <div className="text-center text-white pb-4 md:pb-0 text-[18px] lg:text-[24px] xl:text-[28px] font-semibold px-2 mt-6 md:mt-0 md:absolute bottom-3 right-8 md:right-6 xl:right-20 2xl:right-40">
        <h2>Inspiring Innovation with AI...</h2>
      </div>
    </section>
  );
};

export default HeroSection;
