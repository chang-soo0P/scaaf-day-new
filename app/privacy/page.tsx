// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto px-6 py-10">
      <h1>Privacy Policy</h1>
      <p>Last updated: [November 20, 2025]</p>

      <h2>1. Data We Collect</h2>

      <h3>1.1 Gmail Data</h3>
      <p>
        We temporarily access email content to generate summaries, but we store only the following metadata in our database:
        id, gmail_id, subject, from, snippet, summary, actions, user_id, date.
      </p>

      <h3>Access Token Policy</h3>
      <ul>
        <li>We do NOT store Access Tokens.</li>
        <li>We do NOT store Refresh Tokens.</li>
        <li>Tokens are used once during a request and immediately discarded.</li>
      </ul>

      <h3>1.2 Technical Data</h3>
      <p>We use server-side logging only. No cookies are used for tracking.</p>

      <h3>1.3 AI Processing</h3>
      <p>
        Email content is transmitted securely to the OpenAI API for summary generation using encrypted TLS communication.
      </p>

      <h2>2. How We Use Data</h2>
      <p>
        We use data to provide email summaries, improve performance, enhance user experience, and maintain the Service.
      </p>

      <h2>3. Legal Basis (GDPR)</h2>
      <p>
        For users in the EU/EEA, processing is based on consent, legitimate interest, and contract performance.
      </p>

      <h2>4. Data Storage & Transfers</h2>
      <p>
        Data is stored in Supabase (Sydney region).  
        Additional processing occurs through Vercel (US) and OpenAI (US), with appropriate safeguarding measures.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        Stored metadata is retained until you request deletion or your account is removed.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We use TLS encryption, do not store tokens, and apply secure database access controls.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You may request access, deletion, correction, export, or restriction of your data at any time by contacting us.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        This Service is only for users who are legally eligible to create and use an email account.
      </p>

      <h2>9. Third-Party Services</h2>
      <p>
        We rely on the following services for operations: Google Gmail API, OpenAI API, Supabase, Vercel.
      </p>

      <h2>10. Contact</h2>
      <p>Email: <strong>support@scaaf.day</strong></p>
    </div>
  );
}
