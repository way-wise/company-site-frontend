import PageHeader from "@/components/shared/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FaqPage = () => {
  const generalFaqs = [
    {
      question: "What services does Way-Wise Tech offer?",
      answer:
        "Way-Wise Tech offers a comprehensive range of technology solutions including Web Application Development, Mobile Application Development, Cloud Engineering, Internet of Things (IoT), Graphics Design, and Digital Marketing services. We provide end-to-end solutions tailored to meet your business needs.",
    },
    {
      question: "How long does it typically take to complete a project?",
      answer:
        "Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while a complex web or mobile application could take 2-6 months. We provide detailed project timelines during the initial consultation and keep you updated throughout the development process.",
    },
    {
      question: "Do you offer support after project completion?",
      answer:
        "Yes! We provide ongoing maintenance and support services for all our projects. This includes bug fixes, updates, security patches, and feature enhancements. We offer various support packages to suit different needs and budgets.",
    },
    {
      question: "What is your pricing model?",
      answer:
        "Our pricing is project-based and depends on factors such as complexity, timeline, and required resources. We offer flexible payment plans and provide detailed quotes after understanding your requirements. Contact us for a free consultation and custom quote.",
    },
    {
      question: "Can you work with existing systems and technologies?",
      answer:
        "Absolutely! We have experience integrating with various existing systems, APIs, and technologies. Whether you need to modernize legacy systems or integrate new features into existing platforms, our team can help.",
    },
  ];

  const technicalFaqs = [
    {
      question: "What technologies do you use for web development?",
      answer:
        "We work with modern technologies including React, Next.js, Node.js, TypeScript, and various databases. We choose the best technology stack based on your project requirements to ensure optimal performance and scalability.",
    },
    {
      question: "Do you develop both iOS and Android applications?",
      answer:
        "Yes, we develop native applications for both iOS and Android platforms, as well as cross-platform solutions using React Native and Flutter. We help you choose the best approach based on your target audience and budget.",
    },
    {
      question: "What cloud platforms do you support?",
      answer:
        "We have expertise in major cloud platforms including AWS, Google Cloud Platform, and Microsoft Azure. We can help with cloud migration, infrastructure setup, optimization, and ongoing cloud management.",
    },
    {
      question: "How do you ensure the security of my application?",
      answer:
        "Security is our top priority. We implement industry best practices including secure coding standards, encryption, regular security audits, penetration testing, and compliance with standards like GDPR and OWASP guidelines. We also provide ongoing security monitoring and updates.",
    },
    {
      question: "Can you help with UI/UX design?",
      answer:
        "Yes! Our design team creates beautiful, user-friendly interfaces with a focus on user experience. We conduct user research, create wireframes and prototypes, and design responsive interfaces that work seamlessly across all devices.",
    },
  ];

  const processFaqs = [
    {
      question: "What is your development process?",
      answer:
        "We follow an agile development methodology that includes: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development & Testing, 4) Deployment, and 5) Support & Maintenance. We keep you involved throughout the process with regular updates and feedback sessions.",
    },
    {
      question: "How do you handle project communication?",
      answer:
        "We maintain transparent communication through regular meetings, progress reports, and project management tools. You'll have a dedicated project manager as your main point of contact who will keep you updated on all developments.",
    },
    {
      question: "What information do you need to get started?",
      answer:
        "To begin, we need to understand your business goals, target audience, project requirements, budget, and timeline. During our initial consultation, we'll discuss these details and provide recommendations for the best approach.",
    },
    {
      question: "Do you sign Non-Disclosure Agreements (NDAs)?",
      answer:
        "Yes, we understand the importance of confidentiality. We're happy to sign NDAs before discussing your project details. All client information and proprietary data are kept strictly confidential.",
    },
    {
      question:
        "What happens if I need changes after the project is completed?",
      answer:
        "We offer flexible post-launch support and maintenance packages. Whether you need minor tweaks or major feature additions, we can accommodate your needs. We'll provide a quote based on the scope of changes required.",
    },
  ];

  return (
    <main>
      <PageHeader
        title="FREQUENTLY"
        description="ASKED QUESTIONS"
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-2 max-w-5xl">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Find answers to the most commonly asked questions about our
              services, processes, and how we can help transform your business
              with technology.
            </p>
          </div>

          {/* General Questions */}
          <div className="mb-12">
            <Card className="p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-brand text-4xl">•</span>
                General Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {generalFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`general-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-brand">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Technical Questions */}
          <div className="mb-12">
            <Card className="p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-brand text-4xl">•</span>
                Technical Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {technicalFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`technical-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-brand">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Process & Workflow Questions */}
          <div className="mb-12">
            <Card className="p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-brand text-4xl">•</span>
                Process & Workflow
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {processFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`process-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-brand">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our team is
              here to help! Reach out to us and we&apos;ll get back to you as
              soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:info@waywisetech.com"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FaqPage;
