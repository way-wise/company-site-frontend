import PageHeader from "@/components/shared/PageHeader";

const PrivacyPolicyPage = () => {
  return (
    <main>
      <PageHeader
        title="PRIVACY"
        description="POLICY"
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-2">
          {/* Introduction */}
          <div className="mb-12 text-gray-700 leading-relaxed">
            <p className="text-lg">
              At Way-Wise Tech, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, and protect your personal
              information when you use our services, visit our website, or
              engage with us in any other way. By using our services, you agree
              to the collection and use of information in accordance with this
              policy.
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We may collect various types of personal and non-personal
              information, including but not limited to:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                <span className="font-semibold">Personal Information:</span>{" "}
                Your name, email address, phone number, and payment details when
                you use our services or contact us.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Usage Data:</span> Information
                on how you access and use our website, including your IP
                address, browser type, device information, and interaction with
                our content.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">
                  Cookies and Tracking Technologies:
                </span>{" "}
                We may use cookies and similar technologies to enhance your
                experience on our website and to collect information on your
                preferences.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We may use the information we collect for the following purposes:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                To provide and improve our services
              </li>
              <li className="text-gray-700">
                To communicate with you regarding updates, offers, or promotions
              </li>
              <li className="text-gray-700">
                To process payments and manage your account
              </li>
              <li className="text-gray-700">
                To analyze website usage and enhance user experience
              </li>
              <li className="text-gray-700">
                To comply with legal requirements
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Protect Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement a variety of security measures to protect your
              personal information from unauthorized access, disclosure, or
              destruction. This includes encryption, firewalls, and secure
              access protocols. However, no method of transmission over the
              Internet or method of electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Sharing Your Information
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties without your consent, except:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                To trusted third parties who assist us in operating our website
                or conducting our business, as long as these parties agree to
                keep this information confidential.
              </li>
              <li className="text-gray-700">
                When required by law, such as to comply with a subpoena or
                similar legal process.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Choices
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="text-gray-700">
                <span className="font-semibold">Access and Correction:</span>{" "}
                You may request access to your personal information and ask for
                any inaccuracies to be corrected.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Opt-out:</span> You can opt-out
                of receiving promotional emails by following the unsubscribe
                link in those emails. However, you may continue to receive
                non-promotional communication related to your account.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Deletion:</span> You may request
                the deletion of your personal data, subject to certain
                exceptions provided by law.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data only for as long as is necessary for
              the purposes set out in this Privacy Policy, unless a longer
              retention period is required by law.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those
              websites. We encourage you to review the privacy policies of any
              third-party sites you visit.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. Any changes
              will be posted on this page, and the revised policy will take
              effect as soon as it is posted.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or
              how we handle your personal information, please contact us at{" "}
              <br />
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

export default PrivacyPolicyPage;
