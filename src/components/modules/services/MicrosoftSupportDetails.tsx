// Public folder image paths
const microsoftSupportImage = "/images/services/microsoft-support.webp";
const supportDeliveryFramework = "/images/services/ms-support-flow-chart.png";

import {
  Award,
  Check,
  Cloud,
  Database,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import Image from "next/image";

const MicrosoftSupportDetails = () => {
  return (
    <div className="bg-[#f2f6ff] overflow-hidden w-full min-h-screen relative">
      {/* Hero Image Section */}
      <section className="relative py-8 md:py-16">
        <div className="max-w-[1170px] mx-auto px-4 md:px-0">
          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center overflow-hidden">
            <Image
              className="w-full h-full object-cover rounded-[10px]"
              alt="Microsoft Support Services"
              src={microsoftSupportImage}
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
            Microsoft Support Services Portfolio
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#3d4e5c] leading-6 md:leading-8 mb-6">
            <strong>Way-Wise Technology</strong> delivered enterprise-level
            Microsoft support services through our team of certified experts who
            brought extensive hands-on experience from leading Microsoft support
            partners. Our technical professionals had previously delivered
            exceptional Microsoft customer support through various third-party
            companies, giving us proven capabilities that immediately handled
            Microsoft projects and ensured seamless service delivery with
            exceptional customer satisfaction.
          </p>

          {/* Key Differentiators */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6">
              Key Differentiators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Proven Microsoft Support Pedigree:</strong> Our team
                  came directly from Microsoft&apos;s premier support partners
                  with verified track records.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Immediate Project Readiness:</strong> We could onboard
                  and handle Microsoft support projects with minimal ramp-up
                  time.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>Dual Expertise:</strong> Extensive experience in both
                  partner-managed cases and direct customer engagements.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>90%+ Customer Satisfaction:</strong> Consistently was
                  maintained across previous roles.
                </p>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                <p className="text-sm md:text-base text-[#3d4e5c]">
                  <strong>24/7/365 Global Support:</strong> Multi-lingual
                  resources were available around the clock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Support Channel Expertise */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Dual Support Channel Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Partner-Managed Cases */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#00a3ff]" />
                Partner-Managed Cases
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Had deep experience with Microsoft Partner Center case
                    management
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Performed advanced troubleshooting within partner support
                    frameworks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Managed SLA and reporting for partner ecosystems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Coordinated multi-tenant support
                  </span>
                </li>
              </ul>
            </div>

            {/* Direct Customer Support */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#00a3ff]" />
                Direct Customer Support
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Owned end-to-end cases from initial contact to resolution
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Managed direct customer communication and expectations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Managed enterprise-level service delivery
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Customized support workflows for large organizations
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Technical Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Identity & Access Management */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#00a3ff]" />
                  Identity & Access Management
                </h3>
              </div>
              <div className="ml-[52px] space-y-4">
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Core Technologies:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>Azure Active Directory / Entra ID</li>
                    <li>Hybrid Identity with Azure AD Connect</li>
                    <li>Conditional Access Policies</li>
                    <li>Multi-Factor Authentication (MFA)</li>
                    <li>Single Sign-On (SAML, OIDC, WS-Fed)</li>
                    <li>Privileged Identity Management (PIM)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Advanced Skills:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>SCIM provisioning and synchronization</li>
                    <li>Identity Protection and risky events</li>
                    <li>Directory synchronization troubleshooting</li>
                    <li>Custom security attributes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Exchange & Messaging */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#00a3ff]" />
                  Exchange & Messaging
                </h3>
              </div>
              <div className="ml-[52px] space-y-4">
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Exchange Online:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>Mail flow and transport rules</li>
                    <li>Anti-spam/anti-malware policies</li>
                    <li>Mobile device management (MDM)</li>
                    <li>Public folders and shared mailboxes</li>
                    <li>Compliance and retention policies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Exchange Server/Hybrid:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>Database Availability Groups (DAG)</li>
                    <li>Migration batches and endpoint management</li>
                    <li>Hybrid configuration wizard (HCW)</li>
                    <li>Transport services and queue management</li>
                    <li>Certificate management and SSL configuration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. SharePoint Online & OneDrive */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Database className="w-6 h-6 text-[#00a3ff]" />
                  SharePoint Online & OneDrive
                </h3>
              </div>
              <div className="ml-[52px]">
                <h4 className="font-semibold text-[#1b3447] mb-2">
                  Migration & Integration:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>SharePoint Migration Tool (SPMT)</li>
                  <li>Third-party migration tools</li>
                  <li>API integration and Power Automate flows</li>
                  <li>Search schema and result sources</li>
                </ul>
              </div>
            </div>

            {/* 4. Microsoft Teams & Collaboration */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#00a3ff]" />
                  Microsoft Teams & Collaboration
                </h3>
              </div>
              <div className="ml-[52px]">
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Direct Routing configuration</li>
                  <li>Auto Attendants & Call Queues</li>
                  <li>Call Quality Dashboard (CQD) analysis</li>
                  <li>Teams Phone System deployment</li>
                  <li>Meeting policies and configurations</li>
                  <li>Live events and webinar management</li>
                  <li>Teams application setup and policies</li>
                  <li>Network assessment and optimization</li>
                </ul>
              </div>
            </div>

            {/* 5. Microsoft Azure */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Cloud className="w-6 h-6 text-[#00a3ff]" />
                  Microsoft Azure
                </h3>
              </div>
              <div className="ml-[52px]">
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Virtual Machines and scaling</li>
                  <li>Azure Networking (VNet, NSG, Load Balancers)</li>
                  <li>Storage accounts and backup solutions</li>
                  <li>Monitor and Alert rules</li>
                  <li>Azure App Services</li>
                  <li>Azure SQL Database</li>
                  <li>Azure Kubernetes Service (AKS)</li>
                  <li>Logic Apps and Function Apps</li>
                </ul>
              </div>
            </div>

            {/* 6. Security & Compliance */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  6
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#00a3ff]" />
                  Security & Compliance
                </h3>
              </div>
              <div className="ml-[52px] space-y-4">
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Microsoft 365 Security:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>Microsoft Defender for Office 365</li>
                    <li>Data Loss Prevention (DLP) policies</li>
                    <li>Information barriers</li>
                    <li>Communication compliance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1b3447] mb-2">
                    Azure Security:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                    <li>Microsoft Defender for Cloud</li>
                    <li>Key Vault and secret management</li>
                    <li>Security Center recommendations</li>
                    <li>Sentinel SIEM integration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Microsoft Copilot & AI Services */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                  7
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#00a3ff]" />
                  Microsoft Copilot & AI Services
                </h3>
              </div>
              <div className="ml-[52px]">
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-[#3d4e5c] ml-4">
                  <li>Copilot for Microsoft 365 deployment</li>
                  <li>License assignment and management</li>
                  <li>Prompt engineering support</li>
                  <li>Integration troubleshooting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 md:py-10 bg-white">
        <div className="container">
          <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8 shadow-sm max-w-5xl mx-auto mt-12 flex flex-col items-center justify-center">
            <h2 className="text-lg lg:text-2xl text-center font-semibold text-[#1b3447] mb-4 md:mb-8">
              SUPPORT DELIVERY FRAMEWORK
            </h2>
            <Image
              src={supportDeliveryFramework}
              alt="Support Delivery Framework"
              width={3200}
              height={1792}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Support Delivery Framework */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Support Delivery Framework
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* Tier 1 Support */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                Tier 1 Support
              </h3>
              <ul className="ml-11 space-y-2">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Handled initial contact and basic troubleshooting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Performed documentation and information gathering
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    <strong>Target: 50% case resolution</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Tier 2 Support */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                Tier 2 Support
              </h3>
              <ul className="ml-11 space-y-2">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Performed advanced troubleshooting and analysis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Resolved cross-service issues
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    <strong>Target: 20% additional case resolution</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Tier 3 Support */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                Tier 3 Support
              </h3>
              <ul className="ml-11 space-y-2">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Performed complex problem analysis and root cause
                    investigation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Collaborated and coordinated with Microsoft TA
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Designed and implemented solutions
                  </span>
                </li>
              </ul>
            </div>

            {/* Tier 4 Escalation */}
            <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                Tier 4 Escalation
              </h3>
              <ul className="ml-11 space-y-2">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Escalated issues to Microsoft engineering in a structured
                    manner
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Created comprehensive documentation and reproduction steps
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                  <span className="text-sm md:text-base text-[#3d4e5c]">
                    Served as customer liaison and managed expectations
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Severity Level Definitions */}
          <div className="mt-12">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6">
              Severity Level Definitions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-[#00a3ff] text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Severity
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Response Time
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Resolution Target
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                      Severity 1
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      &lt; 15 minutes
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      4 hours
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      Critical business impact, service was down
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                      Severity 2
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      &lt; 1 hour
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      8 hours
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      Significant business impact, major features were down
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                      Severity 3
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      &lt; 4 hours
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      3 business days
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      Moderate business impact, workarounds were available
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                      Severity 4
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      &lt; 8 hours
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      5 business days
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                      Minimal business impact, general guidance
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics & Commitments */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Performance Metrics & Commitments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-[#00a3ff] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Metric
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Our Commitment
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Industry Standard
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    First Response Time
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    &lt; 10 minutes (Sev 1)
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    30 minutes
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    First Contact Resolution
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    70%
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    45%
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    Customer Satisfaction (CSAT)
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    90%+
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    85%
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    Mean Time to Resolution
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    &lt; 4 hours (Sev 1)
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    8 hours
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    Escalation Accuracy
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    95%
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    70%
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">
                    Knowledge Base Articles
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    100% of resolved cases
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">
                    40%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Certifications & Qualifications */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Certifications & Qualifications
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-[#00a3ff]" />
                Current Team Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Microsoft Azure Fundamentals",
                  "SC-900: Microsoft Security, Compliance, and Identity",
                  "Certified Information Security Manager (CISM) - Part 1",
                  "Copilot for Microsoft 365 & CSS Training (L300)",
                  "M365: Outlook, Office Online, Exchange",
                  "Advanced Assessments - Hardware and Networking",
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="bg-[#f2f6ff] rounded-lg p-4 flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm md:text-base text-[#3d4e5c]">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* <div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#1b3447] mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#00a3ff]" />
                Training Roadmap
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-[#00a3ff] text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">Quarter</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Technical Focus</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Certification Goals</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Team Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">Q1 2024</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">Security & Compliance</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">SC-200, SC-300</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">75%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">Q2 2024</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">Azure Infrastructure</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">AZ-104, AZ-305</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">60%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">Q3 2024</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">Modern Work</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">MS-102, MS-203</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">70%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-[#1b3447]">Q4 2024</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">Specialized Solutions</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">AZ-500, MS-700</td>
                      <td className="border border-gray-300 px-4 py-3 text-[#3d4e5c]">50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Support Infrastructure */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Support Infrastructure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Monitoring & Management */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[#00a3ff]" />
                Monitoring & Management
              </h3>
              <ul className="space-y-2">
                {[
                  "Microsoft 365 Admin Center",
                  "Azure Portal and Resource Manager",
                  "PowerShell and Graph API",
                  "Third-party monitoring solutions",
                  "Microsoft internal diagnostic tools",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm text-[#3d4e5c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Communication */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#00a3ff]" />
                Communication
              </h3>
              <ul className="space-y-2">
                {[
                  "Microsoft Teams for internal collaboration",
                  "Direct customer communication channels",
                  "Status page and outage notifications",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00a3ff] flex-shrink-0 mt-1" />
                    <span className="text-sm text-[#3d4e5c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1b3447] mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-[#00a3ff]" />
                Documentation
              </h3>
              <ul className="space-y-2">
                {[
                  "Confluence knowledge base",
                  "Microsoft-compliant documentation practices",
                  "Continuous knowledge sharing",
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

      {/* Our Commitment Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-[35px] font-semibold text-[#1b3447] mb-8 md:mb-12">
            Our Commitment
          </h2>
          <div className="bg-[#f2f6ff] rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Maintained 24/7/365 support coverage",
                "Achieved and maintained all target KPIs",
                "Provided transparent reporting and regular reviews",
                "Maintained continuous training and certifications",
                "Enabled proactive knowledge sharing and process improvement",
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

export default MicrosoftSupportDetails;
