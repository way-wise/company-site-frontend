import SectionTitle from "../home/SectionTitle";

// Process steps data
const processSteps = [
  {
    id: 1,
    number: "01",
    title: "Discovery & Consultation",
    description:
      "Exploring a problem involves delving into its various aspects to understand the root cause and potential solutions.",
  },
  {
    id: 2,
    number: "02",
    title: "Design & Development",
    description:
      "Exploring a problem involves delving into its various aspects to understand the root cause and potential solutions.",
  },
  {
    id: 3,
    number: "03",
    title: "Testing & Launch",
    description:
      "Exploring a problem involves delving into its various aspects to understand the root cause and potential solutions.",
  },
];

// Statistics data
const statistics = [
  {
    id: 1,
    number: "23",
    label: "Years Experience",
  },
  {
    id: 2,
    number: "50",
    label: "Skilled IT-Experts",
  },
  {
    id: 3,
    number: "14K",
    label: "Project Completed",
  },
  {
    id: 4,
    number: "5K",
    label: "Happy Customers",
  },
];

const SuccessProjects = () => {
  return (
    <section className="py-20 px-4 bg-[url('@/assets/images/feadback/feadback-bg.png')] bg-cover bg-center bg-no-repeat ">
      <div className="container mx-auto px-2">
        <div className="mb-20">
          <SectionTitle
            title="Let's Navigate the Project"
            description="Success Together"
            titleClass="text-white text-3xl lg:text-[55px] font-bold"
            descriptionClass="text-white text-3xl lg:text-[55px] font-bold"
          />
        </div>

        {/* Process Steps Section */}
        <div className="mb-20 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative">
            {/* Connecting dotted line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400/50 via-gray-300/50 to-gray-400/50 transform -translate-y-1/2 z-0">
              <div
                className="w-full h-full bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 8px, #d1d5db 8px, #d1d5db 12px)",
                }}
              ></div>
            </div>

            {processSteps?.map((step) => (
              <div key={step.id} className="relative z-10">
                <div className="bg-[#E1E8F9]  backdrop-blur-sm   rounded-2xl p-4 lg:p-6 max-w-sm mx-auto shadow-2xl  transition-all duration-300 hover:scale-105">
                  {/* Number circle */}
                  <div className="w-20 h-20 bg-[#00A3FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-8 border-[#9ED3FB]">
                    <span className="text-white text-xl font-bold">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-normal  text-2xl font-bold text-center mb-4 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-normal/80 text-md text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 py-2 lg:py-20">
          {statistics.map((stat) => (
            <div key={stat.id} className="text-center relative">
              {/* Large bordered number (text border only, no fill) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-transparent text-[120px] lg:text-[150px] font-black select-none"
                  style={{
                    WebkitTextStroke: "1px #616781",
                    stroke: "1px #616781",
                  }}
                >
                  {stat.number}
                </span>
              </div>

              {/* Main content */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <div className="text-white text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white text-sm lg:text-base font-medium leading-tight">
                  {stat.label.split(" ").map((word, index) => (
                    <div key={index}>{word}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessProjects;
