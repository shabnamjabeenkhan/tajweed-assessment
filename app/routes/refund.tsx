export function meta() {
  return [
    { title: "Refund Policy - Tajweed Quiz" },
    { name: "description", content: "Refund policy for Tajweed Quiz application. Learn about our refund terms and conditions." },
  ];
}

export default function Refund() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="prose prose-lg prose-slate mx-auto dark:prose-invert">
        <h1>Refund Policy</h1>

        <p className="text-sm text-muted-foreground">Last updated: October 15, 2025</p>

        <p>
          Tajweed Quiz currently operates as a free service. Because no payments are collected, refunds are generally not applicable.
          This policy explains our stance and how we will handle refunds should we introduce paid offerings in the future.
        </p>

        <h2>1. Free Access</h2>
        <ul>
          <li>All features of Tajweed Quiz are available at no cost.</li>
          <li>Since no subscription fees or one-time payments are charged, there is nothing to refund.</li>
        </ul>

        <h2>2. Future Paid Features</h2>
        <p>If we introduce paid plans in the future, we will update this policy to cover:</p>
        <ul>
          <li>Eligibility criteria for refunds.</li>
          <li>Timeframes for requesting refunds (e.g., within a specified number of days).</li>
          <li>Steps for submitting a refund request.</li>
          <li>Exceptions or non-refundable items.</li>
          <li>Processing timelines and communication flow.</li>
        </ul>
        <p>We will provide clear notice before implementing any paid offerings or modifying this policy.</p>

        <h2>3. Contact</h2>
        <p>
          If you have questions about this policy or potential future billing, email us at admin@tech-horizonai.io.
        </p>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using Tajweed Quiz, you acknowledge that this Refund Policy applies to the Service in its current free model.
        </p>
      </div>
    </div>
  );
}