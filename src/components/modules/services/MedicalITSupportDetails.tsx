// Public folder image paths
const _24_7_calling = "/images/MedicalBilling/247_calling.webp";
const MedicalBillingServices = "/images/MedicalBilling/MedicalBillingServices.webp";
const fedearalCompliance = "/images/MedicalBilling/federalCompliance.webp";
const medicalbillingandcodingservicesinfographic = "/images/MedicalBilling/medicalbillingandcodingservicesinfographic.webp";
const providerCredentialing = "/images/MedicalBilling/providerCredentialing.webp";
const revenue_cycle = "/images/MedicalBilling/revenue_cycle.webp";
const medicalBillingImage = "/images/services/billing-shape.png";
import {
  Award,
  BarChart3,
  Check,
  DollarSign,
  FileText,
  Headphones,
  MessageSquare,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";
import Image from "next/image";

const MedicalITSupportDetails = () => {
  const services = [
    {
      id: 1,
      title: "Medical Billing Services",
      icon: DollarSign,
      image: MedicalBillingServices,
      imageWidth: 2000,
      imageHeight: 608,
      description: "Expert billing for Medicare, Medicaid & commercial payers with NSA-compliant workflows to maximize reimbursements and minimize denials.",
      features: [
        "Medicare/Medicaid claim submission & follow-up",
        "NSA/IDR dispute resolution support",
        "Real-time claim status tracking",
        "Denial management with appeal expertise",
        "Patient balance billing compliance",
        "Revenue performance analytics",
      ],
    },
    {
      id: 2,
      title: "Medical Coding Services",
      icon: FileText,
      image: medicalbillingandcodingservicesinfographic,
      imageWidth: 2000,
      imageHeight: 1000,
      description: "Certified coders specializing in emergency medicine coding with Medicare/Medicaid and NSA compliance expertise.",
      features: [
        "Emergency department coding (99281-99285)",
        "Medicare Part B & Medicaid coding rules",
        "NSA-compliant modifier application",
        "Trauma and critical care coding",
        "Compliance audits & documentation support",
        "ICD-10, CPT & HCPCS expertise",
      ],
    },
    {
      id: 3,
      title: "Federal Compliance Services",
      icon: Shield,
      image: fedearalCompliance,
      imageWidth: 1408,
      imageHeight: 704,
      description: "Comprehensive compliance protection including HIPAA, No Surprises Act, and Medicare/Medicaid regulations to prevent penalties.",
      features: [
        "NSA/IDR compliance & dispute filings",
        "HIPAA privacy & security audits",
        "Medicare/Medicaid program integrity",
        "EMTALA billing compliance",
        "Good Faith Estimates (GFE) management",
        "Audit defense & documentation",
      ],
    },
    {
      id: 4,
      title: "Provider Credentialing",
      icon: Award,
      image: providerCredentialing,
      imageWidth: 1408,
      imageHeight: 704,
      description: "Expedited Medicare, Medicaid & commercial credentialing with emergency provider enrollment prioritization.",
      features: [
        "Medicare/Medicaid enrollment (PECOS, state systems)",
        "Emergency department provider credentialing",
        "CAQH ProView management",
        "Commercial payer panel enrollment",
        "License & certification verification",
        "Recredentialing management",
      ],
    },
    {
      id: 5,
      title: "24/7 Emergency Support Center",
      icon: Headphones,
      image: _24_7_calling,
      imageWidth: 1408,
      imageHeight: 704,
      description: "Dedicated emergency billing support available 24/7/365 for prior authorizations, eligibility checks, and NSA compliance during crises.",
      features: [
        "24/7/365 emergency billing support",
        "Real-time prior authorization assistance",
        "Unconscious patient eligibility verification",
        "NSA balance billing protection",
        "Mass casualty billing surge capacity",
        "Multilingual patient support",
      ],
    },
    {
      id: 6,
      title: "Revenue Cycle Management",
      icon: TrendingUp,
      image: revenue_cycle,
      imageWidth: 2816,
      imageHeight: 1408,
      description: "End-to-end RCM optimized for emergency providers with Medicare/Medicaid expertise and NSA-compliant workflows.",
      features: [
        "Emergency department workflow optimization",
        "Medicare/Medicaid reimbursement maximization",
        "NSA/IDR dispute preparation",
        "Denial prevention & recovery",
        "Cash flow forecasting & analytics",
        "Accounts receivable management",
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
              alt="Medical billing and revenue cycle management Services"
              src={medicalBillingImage}
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1b3447]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Comprehensive Medical Billing and Revenue Cycle Management Services
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
              Comprehensive Medical Billing and Revenue Cycle Management Services
            </h2>
            <p className="text-lg md:text-xl text-[#3d4e5c] leading-relaxed">
              <strong className="text-[#00a3ff]">Way-Wise Technology</strong>{" "}
              We provide end-to-end medical billing and revenue cycle management solutions designed to maximize collections and ensure full compliance. Our comprehensive services include expert coding for Medicare, Medicaid, and commercial payers, NSA/IDR dispute resolution, 24/7 emergency billing support, and rapid credentialing all backed by HIPAA-compliant operations. We handle the complex revenue challenges so healthcare providers can focus entirely on patient care without worrying about denials, compliance penalties, or cash flow disruptions.
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="bg-white rounded-2xl p-6 md:p-10 mb-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1b3447] mb-8 text-center">
              Why Choose Us for your Medical Billing and Revenue Cycle Management Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  "title": "24/7 Emergency Command Center",
                  "desc": "Real-time prior auths, eligibility checks & NSA compliance during traumas/mass casualties — staffed by CMS-certified ER billing specialists ready at 3 AM."
                },
                {
                  "title": "NSA-Proof Billing for Emergencies",
                  "desc": "Zero surprise billing violations: Instant Good Faith Estimates (GFEs) for unconscious patients + IDR-ready dispute packages to block CMS penalties."
                },
                {
                  "title": "ER-Specific Coding & Compliance",
                  "desc": "EMTALA-compliant billing for trauma/uninsured cases — with Medicare/Medicaid emergency fee schedules and crisis modifier expertise (99285, G0390)."
                },
                {
                  "title": "Instant ER Claim Adjudication",
                  "desc": "98% clean claims in <24hrs: AI scrubbing for emergency modifiers + out-of-network crisis scenarios — no more 90-day payment delays."
                },
                {
                  "title": "Medicare/Medicaid Emergency Revenue Recovery",
                  "desc": "Maximize payments for 911 transports, trauma activations & EMTALA screenings — with state Medicaid waiver expertise for uncompensated care."
                },
                {
                  "title": "Audit Armor for High-Risk ER Claims",
                  "desc": "Pre-built defense packages: Medical necessity trails, NSA consent forms, and CMS audit responses delivered in <72hrs — or we cover penalties."
                } 
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
              Our Core Medical Billing and revenue cycle management Services
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
                    {/* Explicit width/height rather than `fill`, which emits no dimension
                        attributes. Visually identical: h-48 on this container and w-full below
                        constrain both axes, so object-cover crops exactly as before. The values
                        are each file's native size. (These never actually shifted layout — the
                        fixed-height container already reserved the space — but the attributes
                        are what an audit can see.) */}
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={service.imageWidth}
                      height={service.imageHeight}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              Benefits of Our Medical Billing and Revenue Cycle Management Services
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
                title: "Maximized Revenue Recovery",
                description: "Expert Medicare/Medicaid billing and NSA-compliant workflows that reduce denials by 40%+ and accelerate reimbursements for emergency and specialty services.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: Users,
                title: "24/7 Emergency Revenue Support",
                description: "Dedicated billing specialists available around-the-clock for prior authorizations, eligibility checks, and NSA compliance during emergencies—freeing your clinical staff to focus on patient care.",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Federal Compliance Protection",
                description: "Proactive NSA/IDR dispute resolution, Medicare/Medicaid audit defense, and EMTALA-compliant billing to eliminate surprise billing penalties and protect your practice from $100k+ fines.",
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: TrendingUp,
                title: "Optimized Cash Flow",
                description: "End-to-end revenue cycle management with real-time analytics that cuts payment cycles by 30% and ensures maximum reimbursement from all payers—including complex emergency department cases.",
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
                title: "Advanced Billing & Coding Platforms",
                items: [
                  "Athenahealth RCM & EHR integration",
                  "Epic and Cerner system optimization",
                  "NextGen and AdvancedMD expertise",
                  "Real-time eligibility verification (Availity, Experian)",
                  "Medicare/Medicaid-specific billing modules",
                ],
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: BarChart3,
                title: "Intelligent Revenue Analytics",
                items: [
                  "AthenaCollector and Epic Revenue Cycle analytics",
                  "AI-driven denial prediction and prevention",
                  "Provider-specific performance dashboards",
                  "Medicare/Medicaid reimbursement trend analysis",
                  "NSA/IDR dispute outcome forecasting",
                  "Cash flow optimization with real-time alerts",
                ],
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: MessageSquare,
                title: "Modern Patient Engagement Suite",
                items: [
                  "24/7 call center with RingCentral and Five9 technology",
                  "HIPAA-compliant patient portals (Luma Health, Phreesia)",
                  "Automated GFE (Good Faith Estimate) generation",
                  "Multi-language support for diverse populations",
                  "Emergency billing notification systems",
                  "Telehealth billing integration (Doxy.me, Zoom for Healthcare)",
                ],
                gradient: "from-green-500 to-teal-500",
              }
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
              Our specialized medical billing and revenue cycle management solutions deliver measurable results: 40%+ reduction in denials, 30% faster reimbursements, and complete NSA/IDR compliance protection—so healthcare providers maximize revenue while focusing on patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              "40%+ reduction in claim denials with expert Medicare/Medicaid billing",
              "30% faster reimbursements through optimized revenue cycle management",
              "Complete NSA/IDR compliance protection to avoid $100k+ penalties",
              "24/7 emergency billing support for prior authorizations and eligibility checks",
              "Athenahealth, Epic & Cerner integration expertise for seamless workflows",
              "Enhanced cash flow with real-time revenue analytics and forecasting",
              "Reduced administrative burden with automated claim scrubbing and validation",
              "HIPAA-compliant operations with audit-ready documentation and reporting"
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
                "99%+ clean claim rate with Medicare/Medicaid-specific coding expertise",
                "24/7 emergency billing support: prior auths, eligibility checks, and NSA compliance during crises",
                "Complete federal compliance: HIPAA, No Surprises Act, and Medicare/Medicaid program integrity",
                "Real-time revenue dashboards with Athenahealth/Epic integration and denial trend analysis",
                "Monthly staff certification on Medicare fee schedules, Medicaid waivers, and NSA regulations",
                "Proactive revenue leakage detection with advanced claim scrubbing and emergency department workflow optimization"
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

