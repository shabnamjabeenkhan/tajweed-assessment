export function meta() {
  return [
    { title: "Privacy Policy - Tajweed Quiz" },
    { name: "description", content: "Privacy policy for Tajweed Quiz application. Learn how we protect your data and privacy." },
  ];
}

export default function Privacy() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="prose prose-lg prose-slate mx-auto dark:prose-invert">
        <h1>Privacy Policy</h1>

        <p className="text-sm text-muted-foreground">Last updated: October 15, 2025</p>

        <p>
          Tajweed Quiz ("we", "our", or "us") provides an online assessment tool that helps learners practice Tajweed rules.
          This Privacy Policy explains how we collect, use, disclose, and safeguard information when you access Tajweed Quiz
          through our web application (the "Service").
        </p>

        <p>
          Because we take your privacy seriously, we keep data collection to the minimum required to operate the Service.
          By using the Service, you consent to the practices described in this policy. If you do not agree with these practices,
          please discontinue use of the Service.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Personal Information You Provide</h3>
        <ul>
          <li><strong>Account information:</strong> name and email address collected during sign-up through Clerk authentication.</li>
          <li><strong>Support requests:</strong> any information you voluntarily submit when contacting us.</li>
        </ul>
        <p>We do not collect payment information because the Service is currently free.</p>

        <h3>1.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage data:</strong> anonymized analytics events (e.g., pages visited, quiz completions) captured for performance and product insights.</li>
          <li><strong>Device and log data:</strong> IP address, browser type, referring/exit pages, and timestamps captured through hosting logs.</li>
          <li><strong>Cookies and similar technologies:</strong> session cookies to keep you signed in and analytics cookies for aggregate usage reporting.</li>
        </ul>

        <h3>1.3 Non-Personal Information</h3>
        <ul>
          <li>Aggregated statistics about quiz performance and streaks.</li>
          <li>General diagnostic data used to improve stability.</li>
        </ul>

        <h2>2. Cookies and Tracking Technologies</h2>

        <p>We use cookies, web beacons, and similar tracking technologies to:</p>
        <ul>
          <li>Maintain authenticated sessions managed by Clerk.</li>
          <li>Remember preferences such as selected Tajweed rules.</li>
          <li>Collect analytics for service improvement.</li>
        </ul>

        <p>
          You can instruct your browser to refuse cookies or to alert you when cookies are being sent.
          However, rejecting essential cookies may impair certain functionality of the Service.
        </p>

        <h2>3. How We Use Your Information</h2>

        <p>We use collected data to:</p>
        <ul>
          <li>Provide, operate, and maintain the Service.</li>
          <li>Authenticate users and secure accounts.</li>
          <li>Monitor usage and improve quizzes.</li>
          <li>Detect, prevent, and address technical issues.</li>
          <li>Communicate important updates or policy changes.</li>
        </ul>

        <h2>4. How We Share Your Information</h2>

        <p>
          We do not sell or rent personal information. We only share data with third-party processors that enable core functionality:
        </p>
        <ul>
          <li><strong>Clerk</strong> for authentication and secure identity management.</li>
          <li><strong>Convex</strong> for data storage and real-time functionality.</li>
          <li><strong>Vercel</strong> for hosting and operational logging.</li>
        </ul>

        <p>
          Each provider is contractually obligated to safeguard your data and use it solely to provide their services.
          We may also disclose information if required by law, to protect our rights, or to investigate fraud or security issues.
        </p>

        <h2>5. Data Storage and Security</h2>

        <ul>
          <li>Data is stored in Convex infrastructure with industry-standard security controls.</li>
          <li>Clerk handles passwordless authentication tokens and enforces secure session handling.</li>
          <li>We apply encryption in transit (HTTPS) and rely on provider-level encryption at rest.</li>
          <li>Access to personal data is restricted to essential personnel and protected by multi-factor authentication.</li>
          <li>We regularly review security practices and update dependencies to mitigate vulnerabilities.</li>
        </ul>

        <p>
          Despite our efforts, no method of transmission over the Internet or method of electronic storage is 100% secure.
          We cannot guarantee absolute security but we commit to notifying users of any data breaches in accordance with applicable laws.
        </p>

        <h2>6. Data Retention</h2>

        <p>
          We keep personal information for as long as your account remains active. If you request deletion,
          we will remove your personal data (subject to legal obligations) within 30 days and anonymize related analytics.
        </p>

        <h2>7. Your Rights</h2>

        <p>Depending on your jurisdiction, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> request a copy of the personal data we hold about you.</li>
          <li><strong>Rectification:</strong> request corrections to inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> request deletion of your personal information.</li>
          <li><strong>Restriction:</strong> request that we limit processing in certain circumstances.</li>
          <li><strong>Portability:</strong> request transfer of your data to another service in a commonly used format.</li>
          <li><strong>Objection:</strong> object to processing, including for direct marketing.</li>
        </ul>

        <p>
          To exercise any of these rights, contact us at admin@tech-horizonai.io.
          We will respond within 30 days and may require verification of identity.
        </p>

        <h2>8. Children's Privacy</h2>

        <p>
          The Service is not intended for children under 13 years of age, or the minimum age required by local law.
          We do not knowingly collect personal information from children. If we learn that we have collected personal
          information from a child without verification of parental consent, we will take steps to delete that information promptly.
        </p>

        <h2>9. International Transfers</h2>

        <p>
          Your data may be processed in countries other than your own. We rely on contractual safeguards and provider
          compliance (including Standard Contractual Clauses where applicable) to protect data transferred internationally.
        </p>

        <h2>10. GDPR and CCPA Compliance</h2>

        <ul>
          <li><strong>GDPR:</strong> If you are located in the European Economic Area, Tajweed Quiz acts as a data controller.
              The legal bases for processing include contract performance (providing the Service) and legitimate interests (improving functionality).</li>
          <li><strong>CCPA:</strong> We do not sell personal information. California residents may request disclosure or deletion
              of their data by contacting us at admin@tech-horizonai.io.</li>
        </ul>

        <h2>11. Policy Updates</h2>

        <p>
          We may update this Privacy Policy from time to time. Changes will be posted within the Service with an updated
          "Last updated" date. If changes materially affect your rights, we will provide additional notice (e.g., in-app notification).
          Continued use after updates constitutes acceptance of the revised Policy.
        </p>

        <h2>12. Contact</h2>

        <p>For privacy questions or requests, email us at admin@tech-horizonai.io.</p>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using Tajweed Quiz you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  );
}