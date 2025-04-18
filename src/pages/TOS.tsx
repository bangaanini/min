"use client";

import Header from './Header';
import Head from 'next/head';
import styles from '../styles/Home.module.css';



const TOS = () => {
  return (
    <>
      {/* Memanggil komponen header */}
      <Header />
    <section className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Terms of Service for Chisachon Cloud Mining Service
        </h1>
        <p className="mb-4">Last Updated: 18 March 2023</p>

        <p className="mb-4">
          Welcome to [Chisachon Cloud Mining] ("we", "us", or "our"). By accessing and
          using our cloud mining platform and related services (collectively,
          the "Service"), you agree to be bound by these Terms of Service ("Terms").
          If you do not agree with these Terms, please do not use our Service.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By creating an account or using our Service, you acknowledge that you
          have read, understood, and agree to be bound by these Terms. These
          Terms govern your access to and use of our cloud mining services,
          website, and any related applications.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-2">2. Description of the Service</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Cloud Mining:</strong> Our platform provides cloud mining
            services, which allow you to rent mining power for cryptocurrency mining
            operations. The Service includes the management of mining hardware,
            software, and the distribution of mined digital assets.
          </li>
          <li>
            <strong>No Investment Advice:</strong> The Service is provided for
            informational and operational purposes only. We do not provide financial
            or investment advice, and the performance of any mining operation is not
            guaranteed.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">3. User Eligibility</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Minimum Age:</strong> You must be at least 18 years old (or the
            legal age in your jurisdiction) to use our Service.
          </li>
          <li>
            <strong>Legal Capacity:</strong> By using the Service, you represent and
            warrant that you have the legal capacity and authority to enter into these
            Terms.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">4. Registration and Account Security</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Account Creation:</strong> To use certain features of the Service,
            you may need to create an account by providing accurate and up-to-date
            information.
          </li>
          <li>
            <strong>Account Security:</strong> You are responsible for maintaining the
            confidentiality of your account credentials. You agree to notify us
            immediately if you suspect any unauthorized use of your account.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">5. Payment, Fees, and Mining Operations</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Payment Terms:</strong> Use of our cloud mining services may require
            payment, which can include subscription fees, mining fees, or other charges.
            All payments must be made in the supported cryptocurrencies or other
            accepted payment methods.
          </li>
          <li>
            <strong>Mining Rewards:</strong> Any digital assets or mining rewards generated
            through the Service are subject to the terms of the mining plan you have
            purchased. Mining results can vary due to network difficulty, market
            conditions, and operational factors.
          </li>
          <li>
            <strong>No Guarantees:</strong> While we strive to maintain a high level of
            service, we do not guarantee any specific mining output or investment
            returns. Past performance is not indicative of future results.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">6. Risk Disclosure and Acknowledgement</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Inherent Risks:</strong> You acknowledge that cloud mining involves
            inherent risks, including but not limited to fluctuations in cryptocurrency
            prices, changes in mining difficulty, and regulatory developments.
          </li>
          <li>
            <strong>Risk Acceptance:</strong> By using our Service, you expressly assume all
            risks associated with cloud mining. We shall not be held liable for any financial
            losses or damages incurred.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">7. Intellectual Property Rights</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Ownership:</strong> All content, software, and intellectual property
            associated with the Service are the property of [Chisachon Cloud Mining] or our licensors.
          </li>
          <li>
            <strong>Usage Restrictions:</strong> You may not reproduce, modify, distribute,
            or otherwise exploit any portion of the Service without our express written
            consent.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">8. Disclaimers and Limitation of Liability</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Service Provided "As Is":</strong> Our Service is provided on an "as is"
            and "as available" basis without any warranties, express or implied.
          </li>
          <li>
            <strong>Limitation of Liability:</strong> In no event shall [Chisachon Cloud Mining] be
            liable for any indirect, incidental, special, consequential, or punitive damages
            arising out of your use of or inability to use the Service. Our total liability
            shall not exceed the amount paid by you (if any) for accessing the Service.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">9. Modifications to the Terms</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Revisions:</strong> We reserve the right to modify these Terms at any time.
            Any changes will be effective immediately upon posting the updated version on our
            website.
          </li>
          <li>
            <strong>Continued Use:</strong> Your continued use of the Service after any such
            changes constitutes your acceptance of the revised Terms.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">10. Governing Law and Dispute Resolution</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Governing Law:</strong> These Terms shall be governed by and construed in
            accordance with the laws of [Specify Jurisdiction, e.g., "United States of America"
            or "the State of New Jersey"].
          </li>
          <li>
            <strong>Dispute Resolution:</strong> Any disputes arising from these Terms shall be
            resolved in the courts of the specified jurisdiction, unless otherwise agreed in writing.
          </li>
        </ul>
      </div>
    </section>
    </>
  );
};

export default TOS;
