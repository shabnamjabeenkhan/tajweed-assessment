export function meta() {
  return [
    { title: "Terms of Service - Tajweed Quiz" },
    { name: "description", content: "Terms of service for Tajweed Quiz application. Learn about the rules and guidelines for using our service." },
  ];
}

export default function Terms() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="prose prose-lg prose-slate mx-auto dark:prose-invert">
        <h1>Terms of Service</h1>

        <p className="text-sm text-muted-foreground">Last updated: October 15, 2025</p>

        <p>
          These Terms of Service ("Terms") govern your access to and use of Tajweed Quiz (the "Service").
          By using the Service, you agree to be bound by these Terms. If you do not agree, discontinue use immediately.
        </p>

        <h2>1. The Service</h2>
        <p>
          Tajweed Quiz provides interactive assessments to test knowledge of Tajweed rules.
          We may update, enhance, or remove features at any time without prior notice.
        </p>

        <h2>2. Eligibility & Accounts</h2>
        <ul>
          <li>You must be at least 13 years old (or the age of majority in your jurisdiction) to use the Service.</li>
          <li>Account registration requires a valid email address via Clerk authentication. You agree to provide accurate information and to keep it up to date.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials and all activity under your account. Notify us immediately of unauthorized use.</li>
        </ul>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of applicable laws.</li>
          <li>Attempt to gain unauthorized access to the Service or related systems.</li>
          <li>Interfere with or disrupt the integrity or performance of the Service.</li>
          <li>Upload malicious code, automate scraping, or reverse engineer the Service.</li>
          <li>Misrepresent your identity or affiliation with any person or entity.</li>
        </ul>
        <p>We may monitor usage to ensure compliance. Violations may result in suspension or termination.</p>

        <h2>4. Content & Intellectual Property</h2>
        <ul>
          <li>The Service, including all quizzes, questions, UI elements, and branding, is owned by Tajweed Quiz and protected by copyright and other laws.</li>
          <li>We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal learning purposes. You may not resell, redistribute, or exploit the content without our express written consent.</li>
          <li>User-generated content (e.g., feedback you provide) remains yours, but you grant us a worldwide, royalty-free license to use, reproduce, and display such content for operating and improving the Service.</li>
        </ul>

        <h2>5. Privacy</h2>
        <p>
          Our Privacy Policy explains how we collect and use your data. By using the Service, you consent to those practices.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          The Service relies on third-party providers (e.g., Clerk, Convex, Vercel). Your use of those services may be
          subject to their terms and policies. We are not responsible for third-party services beyond our control.
        </p>

        <h2>7. Service Availability & Modifications</h2>
        <p>
          We strive for high availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue
          the Service (or any part) at any time. Where feasible, we will provide notice of significant changes.
        </p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
          WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAJWEED QUIZ AND ITS PROVIDERS SHALL NOT BE LIABLE FOR INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS OR DATA, EVEN IF ADVISED
          OF THE POSSIBILITY. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICE IS LIMITED
          TO THE AMOUNT YOU PAID US (CURRENTLY ZERO FOR THE FREE SERVICE).
        </p>
        <p>
          Some jurisdictions do not allow certain limitations, so the above may not apply to you. In that case,
          our liability will be limited to the minimum extent permitted by law.
        </p>

        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time for any reason, including violation of these Terms.
          Upon termination, your right to use the Service ends immediately. You may request deletion of your account and data
          via the contact method below.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Tajweed Quiz, its affiliates, and service providers from any claims,
          damages, liabilities, costs, or expenses arising from your use of the Service or violation of these Terms.
        </p>

        <h2>12. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of the country where you reside, without regard to conflict-of-law principles.
          Any dispute will be handled in the courts of that jurisdiction unless both parties agree to alternative dispute resolution.
        </p>

        <h2>13. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Changes take effect immediately upon posting within the Service
          unless otherwise specified. If changes materially affect your rights, we will provide notice.
          Continued use after changes constitutes acceptance.
        </p>

        <h2>14. Contact</h2>
        <p>Questions about these Terms? Email us at admin@tech-horizonai.io.</p>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using Tajweed Quiz, you acknowledge that you have read and agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}