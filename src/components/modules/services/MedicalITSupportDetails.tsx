import medicalBillingImage from "@/assets/images/services/billing-shape.png";
import digitalMarketingImage from "@/assets/images/services/digital-marketing.png";
import cloudImage from "@/assets/images/services/cloud.jpg";
import {
  Check,
  DollarSign,
  FileText,
  Headphones,
  Shield,
  Star,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const MedicalITSupportDetails = () => {
  const services = [
    {
      id: 1,
      title: "Medical Billing Services",
      icon: DollarSign,
      image: medicalBillingImage,
      description:
        "Our comprehensive medical billing services ensure accurate and timely claim submission, faster reimbursements, and improved cash flow for your practice.",
      features: [
        "Electronic claim submission and processing",
        "Real-time claim status tracking",
        "Denial management and appeals",
        "Patient billing and statement generation",
        "Payment posting and reconciliation",
        "Customized reporting and analytics",
      ],
    },
    {
      id: 2,
      title: "Medical Coding Services",
      icon: FileText,
      image: medicalBillingImage,
      description:
        "Certified medical coders ensure accurate diagnosis and procedure coding, reducing claim denials and maximizing reimbursement.",
      features: [
        "ICD-10-CM diagnosis coding",
        "CPT procedure coding",
        "HCPCS Level II coding",
        "Modifier application and validation",
        "Chart review and coding audits",
        "Compliance with coding guidelines",
      ],
    },
    {
      id: 3,
      title: "Compliance Services",
      icon: Shield,
      image: cloudImage,
      description:
        "Stay compliant with ever-changing healthcare regulations through our comprehensive compliance management services.",
      features: [
        "HIPAA compliance audits and training",
        "OSHA compliance management",
        "Medicare and Medicaid compliance",
        "Fraud and abuse prevention",
        "Documentation improvement programs",
        "Risk assessment and mitigation",
      ],
    },
    {
      id: 4,
      title: "Credentialing Services",
      icon: Award,
      image: medicalBillingImage,
      description:
        "Streamlined provider credentialing and enrollment services to get your providers credentialed quickly and efficiently.",
      features: [
        "Provider enrollment and credentialing",
        "CAQH ProView management",
        "Insurance panel enrollment",
        "License verification and renewal",
        "Recredentialing management",
        "Credentialing database maintenance",
      ],
    },
    {
      id: 5,
      title: "24-Hour Call Center",
      icon: Headphones,
      image: cloudImage,
      description:
        "Professional, multilingual call center services available 24/7/365 to handle patient inquiries, appointment scheduling, and support.",
      features: [
        "24/7/365 patient support",
        "Appointment scheduling and reminders",
        "Insurance verification",
        "Patient billing inquiries",
        "Multilingual support services",
        "After-hours coverage",
      ],
    },
    {
      id: 6,
      title: "Revenue Cycle Management",
      icon: TrendingUp,
      image: medicalBillingImage,
      description:
        "End-to-end revenue cycle management to optimize collections, reduce denials, and improve your practice's financial performance.",
      features: [
        "Pre-authorization and eligibility verification",
        "Charge capture and entry",
        "Claims processing and submission",
        "Payment posting and reconciliation",
        "Accounts receivable management",
        "Performance analytics and reporting",
      ],
    },
    {
      id: 7,
      title: "Online Reputation Management",
      icon: Star,
      image: digitalMarketingImage,
      description:
        "Build and maintain a positive online presence that attracts new patients and strengthens your practice's reputation.",
      features: [
        "Review monitoring and management",
        "Patient feedback collection",
        "Reputation repair strategies",
        "Social media reputation management",
        "Review response and engagement",
        "Reputation analytics and reporting",
      ],
    },
    {
      id: 8,
      title: "Digital Marketing Services",
      icon: BarChart3,
      image: digitalMarketingImage,
      description:
        "Healthcare-focused digital marketing strategies to grow your patient base and enhance your practice's online visibility.",
      features: [
        "Healthcare SEO and local search optimization",
        "Social media marketing for healthcare",
        "Content marketing and patient education",
        "Pay-per-click advertising (PPC)",
        "Email marketing campaigns",
        "Website optimization and conversion",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#f2f6ff] to-white overflow-hidden w-full min-h-screen relative">
      {/* Hero Image Section */}
      <section className="relative py-8 md:py-16">
        <div className="max-w-[1170px] mx-auto px-4 md:px-0">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Medical IT Support Services"
              src={medicalBillingImage}
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1b3447]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Comprehensive Medical IT Support Services
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                Streamline healthcare operations and maximize revenue with our
                end-to-end solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section className="py-8 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-6">
              Comprehensive Medical IT Support Services
            </h2>
            <p className="text-lg md:text-xl text-[#3d4e5c] leading-relaxed">
              <strong className="text-[#00a3ff]">Way-Wise Technology</strong>{" "}
              provides end-to-end medical IT support services designed to
              streamline healthcare operations and maximize revenue. Our
              comprehensive suite of services covers medical billing, coding,
              compliance, credentialing, and revenue cycle management, allowing
              healthcare providers to focus on what matters most—patient care.
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="bg-white rounded-2xl p-6 md:p-10 mb-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1b3447] mb-8 text-center">
              Why Choose Our Medical IT Support Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Expert Medical Billing & Coding",
                  desc: "Certified professionals with deep knowledge of ICD-10, CPT, and HCPCS coding systems.",
                },
                {
                  title: "HIPAA Compliant Operations",
                  desc: "All services adhere to strict HIPAA regulations and industry compliance standards.",
                },
                {
                  title: "24/7/365 Support",
                  desc: "Round-the-clock call center services ensuring your practice never misses a patient interaction.",
                },
                {
                  title: "Revenue Optimization",
                  desc: "Advanced revenue cycle management that increases collections and reduces denials.",
                },
                {
                  title: "Comprehensive Credentialing",
                  desc: "Streamlined provider credentialing and enrollment processes to get you credentialed faster.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f2f6ff] transition-colors duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00a3ff] to-[#0088cc] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1b3447] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm md:text-base text-[#3d4e5c]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-4">
              Our Core Medical IT Support Services
            </h2>
            <p className="text-lg text-[#3d4e5c] max-w-2xl mx-auto">
              Comprehensive solutions designed to optimize your healthcare
              practice operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#00a3ff]/30"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b3447]/90 via-[#1b3447]/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00a3ff] to-[#0088cc] rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="text-sm font-medium">Service #{service.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:p-8">
                    <p className="text-[#3d4e5c] mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm md:text-base text-[#3d4e5c]"
                        >
                          <div className="w-5 h-5 bg-[#00a3ff]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#00a3ff]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Benefits Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-4">
              Benefits of Our Medical IT Support Services
            </h2>
            <p className="text-lg text-[#3d4e5c] max-w-2xl mx-auto">
              Transform your practice with measurable results and improved
              efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: DollarSign,
                title: "Increased Revenue",
                description:
                  "Our optimized billing and coding processes result in faster claim processing, reduced denials, and improved collection rates, directly impacting your bottom line.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: Users,
                title: "Reduced Administrative Burden",
                description:
                  "Free up your staff to focus on patient care by outsourcing time-consuming administrative tasks to our expert team.",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Enhanced Compliance",
                description:
                  "Stay ahead of regulatory changes with our comprehensive compliance services, reducing the risk of audits and penalties.",
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: Star,
                title: "Improved Patient Satisfaction",
                description:
                  "Our 24/7 call center and streamlined processes ensure patients receive prompt, professional service, enhancing their experience with your practice.",
                gradient: "from-orange-500 to-amber-600",
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#00a3ff]/30"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-[#1b3447] mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-base text-[#3d4e5c] leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Tools Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#f2f6ff] to-white">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-4">
              Advanced Technology & Tools
            </h2>
            <p className="text-lg text-[#3d4e5c] max-w-2xl mx-auto">
              Cutting-edge solutions powering our comprehensive services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: FileText,
                title: "Billing & Coding Software",
                items: [
                  "Electronic Health Records (EHR) integration",
                  "Practice Management Systems (PMS)",
                  "ICD-10 and CPT coding software",
                  "Claim scrubbing and validation tools",
                  "Real-time eligibility verification",
                ],
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: BarChart3,
                title: "Analytics & Reporting",
                items: [
                  "Custom dashboard and KPI tracking",
                  "Revenue cycle analytics",
                  "Denial trend analysis",
                  "Provider productivity reports",
                  "Financial performance metrics",
                ],
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: MessageSquare,
                title: "Communication Tools",
                items: [
                  "Secure patient communication portals",
                  "Automated appointment reminders",
                  "Multi-channel call center technology",
                  "HIPAA-compliant messaging systems",
                  "Patient engagement platforms",
                ],
                gradient: "from-green-500 to-teal-500",
              },
            ].map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#00a3ff]/30 group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3447] mb-6">
                    {tool.title}
                  </h3>
                  <ul className="space-y-3">
                    {tool.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 bg-[#00a3ff]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#00a3ff]" />
                        </div>
                        <span className="text-sm md:text-base text-[#3d4e5c]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Outcomes Section */}
      <section className="pb-12 md:pb-20 bg-white">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-4">
              Service Outcomes
            </h2>
            <p className="text-lg text-[#3d4e5c] max-w-2xl mx-auto">
              Our comprehensive medical IT support services deliver measurable
              results that transform your practice operations and financial
              performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              "Increased revenue through optimized billing and coding",
              "Reduced claim denials and faster reimbursement cycles",
              "Enhanced compliance with HIPAA and industry regulations",
              "Improved patient satisfaction and retention rates",
              "Streamlined administrative processes and reduced overhead",
              "Better cash flow management and financial visibility",
              "Expanded patient base through digital marketing",
              "Professional 24/7 patient support and engagement",
            ].map((outcome, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#f2f6ff] transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#00a3ff] to-[#0088cc] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base md:text-lg text-[#3d4e5c] font-medium">
                  {outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#f2f6ff] to-white">
        <div className="container">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b3447] mb-4">
              Our Commitment
            </h2>
            <p className="text-lg text-[#3d4e5c] max-w-2xl mx-auto">
              Dedicated to excellence in every aspect of our service delivery
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 md:p-10 shadow-xl border border-gray-100 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Maintain 99%+ claim accuracy and submission rates",
                "Provide 24/7/365 support for uninterrupted operations",
                "Ensure HIPAA compliance in all operations",
                "Deliver transparent reporting and regular performance reviews",
                "Continuously train staff on latest coding and billing updates",
                "Proactively identify and resolve revenue cycle issues",
              ].map((commitment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-sm bg-[#f2f6ff] transition-colors duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00a3ff] to-[#0088cc] rounded-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-base md:text-lg text-[#3d4e5c] font-medium">
                    {commitment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalITSupportDetails;

