import PageHeader from "@/components/shared/PageHeader";

const TermsAndConditionsPage = () => {
  return (
    <main>
      <PageHeader
        title="TERMS AND CONDITIONS"
        description=""
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
        ]}
      />

      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-2">
          {/* Introduction */}
          <div className="mb-12 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Welcome to Way-Wise Tech! These Terms and Conditions outline the
              rules and regulations for the use of our website and services. By
              accessing or using our services, you agree to comply with and be
              bound by these Terms. If you do not agree with any of these terms,
              you should not use our services.
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Definitions
            </h2>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                &quot;Company&quot;, &quot;We&quot;, &quot;Our&quot;, and
                &quot;Us&quot; refers to Way-Wise Tech.
              </li>
              <li className="text-gray-700">
                &quot;Client&quot;, &quot;You&quot;, and &quot;Your&quot; refers
                to any person or entity using our services.
              </li>
              <li className="text-gray-700">
                &quot;Services&quot; refers to the technology solutions,
                consulting, and other offerings provided by Way-Wise Tech.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Use of Services
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              By using our services, you agree to the following:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                You will provide accurate and current information during any
                registration process.
              </li>
              <li className="text-gray-700">
                You will not use our services for any unlawful purpose or any
                purpose prohibited by these Terms.
              </li>
              <li className="text-gray-700">
                You will not attempt to gain unauthorized access to any portion
                of our systems or networks.
              </li>
              <li className="text-gray-700">
                You are responsible for maintaining the confidentiality of any
                login credentials you use to access our services.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              Unless otherwise stated, we own the intellectual property rights
              for all materials, content, software, and technology offered as
              part of our services. All intellectual property rights are
              reserved. You may not:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                Republish material from Way-Wise Tech without proper attribution
                or permission.
              </li>
              <li className="text-gray-700">
                Sell, rent, or sublicense material from Way-Wise Tech.
              </li>
              <li className="text-gray-700">
                Reproduce, duplicate, or copy any part of our service without
                written consent.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Service Availability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We will make reasonable efforts to ensure that our services are
              available at all times. However, we do not guarantee that the
              services will be uninterrupted, secure, or free from errors. We
              may suspend or restrict access to the services to carry out
              maintenance or updates.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Payment and Fees
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              For clients engaging in paid services:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                You agree to pay the fees outlined in your contract or service
                agreement.
              </li>
              <li className="text-gray-700">
                Payment must be made in accordance with the terms specified in
                the invoice or contract.
              </li>
              <li className="text-gray-700">
                Late payments may result in suspension or termination of
                services, and additional late fees may apply.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              To the fullest extent permitted by applicable law, Way-Wise Tech
              will not be liable for any damages that arise from your use of or
              inability to use our services. This includes but is not limited
              to:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                Direct, indirect, incidental, or consequential damages.
              </li>
              <li className="text-gray-700">
                Loss of data, profits, or revenue.
              </li>
              <li className="text-gray-700">
                We provide our services on an &quot;as-is&quot; basis without
                warranties of any kind, either express or implied, including but
                not limited to warranties of merchantability, fitness for a
                particular purpose, or non-infringement.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to our
              services at any time, without notice, for conduct that we believe
              violates these Terms and Conditions or is harmful to our interests
              or the interests of other users.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Confidentiality
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Way-Wise Tech Dark Logo will maintain the confidentiality of any
              proprietary information we provide you during Service. This
              includes business data, client information, and any technical
              details.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by and construed in
              accordance with the laws of United States. Any disputes arising
              from these terms will be resolved in the appropriate legal
              jurisdiction.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Modifications to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or update these Terms and
              Conditions at any time. The updated terms will be posted on this
              page, and by continuing to use our services, you agree to the
              revised terms.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at <br />
              <a
                href="mailto:tech@waywise.pro"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                tech@waywise.pro
              </a>
              <br />
              <a
                href="mailto:info@waywisetech.com"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                info@waywisetech.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditionsPage;
