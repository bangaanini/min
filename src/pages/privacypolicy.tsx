"use client";

import Header from "./Header"; // Pastikan path sudah sesuai dengan struktur direktori Anda

const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <section className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

          <p className="mb-4">
            This Privacy Policy explains how [CloudMine Pro] ("we", "us", or "our")
            collects, uses, and protects your personal information when you use our
            cloud mining services. By accessing or using our Service, you agree to the
            practices described in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-2">1. Information We Collect</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Personal Information:</strong> When you register for an account,
              we may collect information such as your name, email address, physical
              address, payment details, and other data necessary for providing our services.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect technical information
              (e.g., IP address, browser type, device information) and usage data (e.g.,
              pages visited, time spent on the site, transaction history) to help us improve the Service.
            </li>
            <li>
              <strong>Cookies and Tracking:</strong> We use cookies and similar tracking
              technologies to enhance your experience on our platform. You can adjust your
              browser settings to manage cookies; however, some features of the Service may not
              function properly if cookies are disabled.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">2. Use of Information</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Service Provision:</strong> Your information is used to create and
              manage your account, process payments, deliver mining rewards, and support our
              customer service.
            </li>
            <li>
              <strong>Communication:</strong> We may use your personal information to send you
              important updates, promotional materials, and other communications related to the Service.
            </li>
            <li>
              <strong>Analytics and Improvement:</strong> Usage data helps us analyze trends,
              monitor usage patterns, and improve the overall quality and performance of our Service.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">3. Sharing and Disclosure of Information</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Third-Party Service Providers:</strong> We may share your information
              with trusted third-party vendors who assist us in providing the Service (e.g.,
              payment processors, data analytics providers). These third parties are bound by
              confidentiality obligations.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to
              do so by law, regulation, or a valid legal process, or to protect our rights and the
              safety of our users.
            </li>
            <li>
              <strong>No Sale of Personal Data:</strong> We do not sell your personal information
              to third parties for marketing or commercial purposes.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">4. Data Security and Retention</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Security Measures:</strong> We implement industry-standard security
              measures to protect your personal information from unauthorized access,
              disclosure, alteration, or destruction.
            </li>
            <li>
              <strong>Data Retention:</strong> We retain your personal information for as long as
              necessary to provide the Service and comply with our legal obligations, unless a
              longer retention period is required or permitted by law.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">5. Your Rights and Choices</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Access and Correction:</strong> You have the right to access and correct your
              personal information by logging into your account or contacting our support team.
            </li>
            <li>
              <strong>Opt-Out:</strong> You may opt out of receiving promotional communications from
              us by following the unsubscribe instructions provided in our emails or by contacting us directly.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">6. Third-Party Links</h2>
          <p className="mb-4">
            Our Service may contain links to third-party websites or services that are not operated by
            us. We are not responsible for the privacy practices or the content of such third-party sites.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-2">7. Changes to this Privacy Policy</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Updates:</strong> We may update this Privacy Policy from time to time.
              Any changes will be effective immediately upon posting on our website.
            </li>
            <li>
              <strong>Notification:</strong> We encourage you to review this Privacy Policy periodically
              to stay informed about how we are protecting your information.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-2">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Email:</strong> support@chisachon.com
            </li>
            <li>
              <strong>Address:</strong> 942 Pennsylvania Avenue, New Jersey
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
