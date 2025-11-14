import medicalBillingImage from "@/assets/images/services/billing-shape.png";
import {
  Check,
  Clock,
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
  return (
    <div className="bg-[#f2f6ff] overflow-hidden w-full min-h-screen relative">
      {/* Hero Image Section */}
      <section className="relative py-8 md:py-16">
        <div className="max-w-[1170px] mx-auto px-4 md:px-0">
          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center overflow-hidden">
            <Image
              className="w-full h-full object-cover rounded-[10px]"
              alt="Medical IT Support Services"
              src={medicalBillingImage}
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-4 md:mb-8">
            Comprehensive Medical IT Support Services
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#3d4e5c] leading-6 md:leading-8 mb-6">
            <strong>Way-Wise Technology</strong> provides end-to-end medical IT
            support services designed to streamline healthcare operations and
            maximize revenue. Our comprehensive suite of services covers medical
            billing, coding, compliance, credentialing, and revenue cycle
            management, allowing healthcare providers to focus on what matters
            most—patient care. With our 24/7 call center support and advanced
            digital marketing solutions, we ensure your practice operates
            efficiently while maintaining the highest standards of quality and
            compliance.
          </p>

          {/* Key Differentiators */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6">
              Why Choose Our Medical IT Support Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Expert Medical Billing & Coding:</strong> Certified
                  professionals with deep knowledge of ICD-10, CPT, and HCPCS
                  coding systems.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>HIPAA Compliant Operations:</strong> All services
                  adhere to strict HIPAA regulations and industry compliance
                  standards.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>24/7/365 Support:</strong> Round-the-clock call center
                  services ensuring your practice never misses a patient
                  interaction.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Revenue Optimization:</strong> Advanced revenue cycle
                  management that increases collections and reduces denials.
                </p>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Comprehensive Credentialing:</strong> Streamlined
                  provider credentialing and enrollment processes to get you
                  credentialed faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Our Core Medical IT Support Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Medical Billing Services */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-[#00a3ff]" />
                  Medical Billing Services
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Our comprehensive medical billing services ensure accurate and
                  timely claim submission, faster reimbursements, and improved
                  cash flow for your practice.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Electronic claim submission and processing</li>
                  <li>Real-time claim status tracking</li>
                  <li>Denial management and appeals</li>
                  <li>Patient billing and statement generation</li>
                  <li>Payment posting and reconciliation</li>
                  <li>Customized reporting and analytics</li>
                </ul>
              </div>
            </div>

            {/* Medical Coding Services */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#00a3ff]" />
                  Medical Coding Services
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Certified medical coders ensure accurate diagnosis and
                  procedure coding, reducing claim denials and maximizing
                  reimbursement.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>ICD-10-CM diagnosis coding</li>
                  <li>CPT procedure coding</li>
                  <li>HCPCS Level II coding</li>
                  <li>Modifier application and validation</li>
                  <li>Chart review and coding audits</li>
                  <li>Compliance with coding guidelines</li>
                </ul>
              </div>
            </div>

            {/* Compliance Services */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#00a3ff]" />
                  Compliance Services
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Stay compliant with ever-changing healthcare regulations
                  through our comprehensive compliance management services.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>HIPAA compliance audits and training</li>
                  <li>OSHA compliance management</li>
                  <li>Medicare and Medicaid compliance</li>
                  <li>Fraud and abuse prevention</li>
                  <li>Documentation improvement programs</li>
                  <li>Risk assessment and mitigation</li>
                </ul>
              </div>
            </div>

            {/* Credentialing Services */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#00a3ff]" />
                  Credentialing Services
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Streamlined provider credentialing and enrollment services to
                  get your providers credentialed quickly and efficiently.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Provider enrollment and credentialing</li>
                  <li>CAQH ProView management</li>
                  <li>Insurance panel enrollment</li>
                  <li>License verification and renewal</li>
                  <li>Recredentialing management</li>
                  <li>Credentialing database maintenance</li>
                </ul>
              </div>
            </div>

            {/* 24-Hour Call Center */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Headphones className="w-6 h-6 text-[#00a3ff]" />
                  24-Hour Call Center
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Professional, multilingual call center services available
                  24/7/365 to handle patient inquiries, appointment scheduling,
                  and support.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>24/7/365 patient support</li>
                  <li>Appointment scheduling and reminders</li>
                  <li>Insurance verification</li>
                  <li>Patient billing inquiries</li>
                  <li>Multilingual support services</li>
                  <li>After-hours coverage</li>
                </ul>
              </div>
            </div>

            {/* Revenue Cycle Management */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  6
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#00a3ff]" />
                  Revenue Cycle Management
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  End-to-end revenue cycle management to optimize collections,
                  reduce denials, and improve your practice&apos;s financial
                  performance.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Pre-authorization and eligibility verification</li>
                  <li>Charge capture and entry</li>
                  <li>Claims processing and submission</li>
                  <li>Payment posting and reconciliation</li>
                  <li>Accounts receivable management</li>
                  <li>Performance analytics and reporting</li>
                </ul>
              </div>
            </div>

            {/* Online Reputation Management */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  7
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#00a3ff]" />
                  Online Reputation Management
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Build and maintain a positive online presence that attracts
                  new patients and strengthens your practice&apos;s reputation.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Review monitoring and management</li>
                  <li>Patient feedback collection</li>
                  <li>Reputation repair strategies</li>
                  <li>Social media reputation management</li>
                  <li>Review response and engagement</li>
                  <li>Reputation analytics and reporting</li>
                </ul>
              </div>
            </div>

            {/* Digital Marketing Services */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  8
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#00a3ff]" />
                  Digital Marketing Services
                </h3>
              </div>
              <div className="ml-[52px] space-y-3">
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  Healthcare-focused digital marketing strategies to grow your
                  patient base and enhance your practice&apos;s online
                  visibility.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Healthcare SEO and local search optimization</li>
                  <li>Social media marketing for healthcare</li>
                  <li>Content marketing and patient education</li>
                  <li>Pay-per-click advertising (PPC)</li>
                  <li>Email marketing campaigns</li>
                  <li>Website optimization and conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Benefits Section */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Benefits of Our Medical IT Support Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Increased Revenue */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-[#00a3ff]" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447]">
                  Increased Revenue
                </h3>
              </div>
              <p className="text-sm md:text-base text-[#3d4e5c]">
                Our optimized billing and coding processes result in faster
                claim processing, reduced denials, and improved collection
                rates, directly impacting your bottom line.
              </p>
            </div>

            {/* Reduced Administrative Burden */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-[#00a3ff]" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447]">
                  Reduced Administrative Burden
                </h3>
              </div>
              <p className="text-sm md:text-base text-[#3d4e5c]">
                Free up your staff to focus on patient care by outsourcing
                time-consuming administrative tasks to our expert team.
              </p>
            </div>

            {/* Enhanced Compliance */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#00a3ff]" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447]">
                  Enhanced Compliance
                </h3>
              </div>
              <p className="text-sm md:text-base text-[#3d4e5c]">
                Stay ahead of regulatory changes with our comprehensive
                compliance services, reducing the risk of audits and penalties.
              </p>
            </div>

            {/* Improved Patient Satisfaction */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-[#00a3ff]" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447]">
                  Improved Patient Satisfaction
                </h3>
              </div>
              <p className="text-sm md:text-base text-[#3d4e5c]">
                Our 24/7 call center and streamlined processes ensure patients
                receive prompt, professional service, enhancing their experience
                with your practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Tools Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Advanced Technology & Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Billing & Coding Software */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#00a3ff]" />
                Billing & Coding Software
              </h3>
              <ul className="space-y-2">
                {[
                  "Electronic Health Records (EHR) integration",
                  "Practice Management Systems (PMS)",
                  "ICD-10 and CPT coding software",
                  "Claim scrubbing and validation tools",
                  "Real-time eligibility verification",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm text-[#3d4e5c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Analytics & Reporting */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#00a3ff]" />
                Analytics & Reporting
              </h3>
              <ul className="space-y-2">
                {[
                  "Custom dashboard and KPI tracking",
                  "Revenue cycle analytics",
                  "Denial trend analysis",
                  "Provider productivity reports",
                  "Financial performance metrics",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm text-[#3d4e5c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Communication Tools */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#00a3ff]" />
                Communication Tools
              </h3>
              <ul className="space-y-2">
                {[
                  "Secure patient communication portals",
                  "Automated appointment reminders",
                  "Multi-channel call center technology",
                  "HIPAA-compliant messaging systems",
                  "Patient engagement platforms",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm text-[#3d4e5c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Outcomes Section */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-4 md:mb-8">
            Service Outcomes
          </h2>
          <p className="text-sm md:text-base text-[#657585] leading-6 md:leading-8 mb-8 md:mb-12">
            Our comprehensive medical IT support services deliver measurable
            results that transform your practice operations and financial
            performance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-x-16 lg:gap-y-8">
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
              <div key={index} className="flex items-center gap-3 md:gap-4">
                <div className="bg-white rounded-full flex items-center justify-center p-2 flex-shrink-0">
                  <Check className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <span className="text-sm md:text-base text-[#657585]">
                  {outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Our Commitment
          </h2>
          <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Maintain 99%+ claim accuracy and submission rates",
                "Provide 24/7/365 support for uninterrupted operations",
                "Ensure HIPAA compliance in all operations",
                "Deliver transparent reporting and regular performance reviews",
                "Continuously train staff on latest coding and billing updates",
                "Proactively identify and resolve revenue cycle issues",
              ].map((commitment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base text-[#3d4e5c]">
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

