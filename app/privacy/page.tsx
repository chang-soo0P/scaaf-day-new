export default function PrivacyPage() {
  const html = `
    <h1>Privacy Policy</h1>
    <p><em>Last updated: January 2025</em></p>

    <h2>1. Information We Collect</h2>
    <p>We collect Google Account information, Gmail message content (with explicit consent), usage analytics, and device metadata.</p>

    <h3>1.1 Google Account Information</h3>
    <ul>
      <li>Name</li>
      <li>Email address</li>
      <li>Profile image</li>
      <li>OAuth access & refresh tokens (encrypted)</li>
    </ul>

    <h3>1.2 Gmail Data</h3>
    <p>With your permission, we access your Gmail for AI summarization and productivity features. We do not permanently store raw email content unless explicitly required.</p>

    <h3>1.3 Usage Data</h3>
    <p>We collect clickstream events, device information, and feature usage logs to improve service quality.</p>

    <h2>2. How We Use Information</h2>
    <ul>
      <li>AI-based summarization</li>
      <li>Newsletter extraction</li>
      <li>Sender-based grouping</li>
      <li>Personalized insights</li>
    </ul>

    <h2>3. Legal Basis (GDPR)</h2>
    <p>Consent, contract performance, and legitimate interests.</p>

    <h2>4. Data Sharing</h2>
    <p>We do not sell user data. We may share data with OpenAI, Supabase, Google OAuth/Gmail, and analytics providers.</p>

    <h2>5. International Data Transfers</h2>
    <p>Your data may be stored or processed in the US, EU, South Korea, or other regions under appropriate safeguards.</p>

    <h2>6. Data Retention</h2>
    <table>
      <tr><td>AI summaries</td><td>Until deleted</td></tr>
      <tr><td>OAuth tokens</td><td>Until revoked</td></tr>
      <tr><td>Logs</td><td>30–90 days</td></tr>
    </table>

    <h2>7. Your Rights</h2>
    <p>You may request access, deletion, data export, or withdrawal of Gmail access.</p>

    <h2>8. Cookies</h2>
    <p>We use essential, preference, and analytics cookies.</p>

    <h2>9. Children’s Privacy</h2>
    <p>Scaaf is not intended for individuals under 18 years old.</p>

    <h2>10. Contact</h2>
    <p>Email: <strong>privacy@scaaf.day</strong></p>
  `;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div
        className="prose prose-neutral dark:prose-invert prose-headings:font-semibold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
