export default function TermsPage() {
  const html = `
    <h1>Terms of Service</h1>
    <p><em>Last updated: January 2025</em></p>

    <h2>1. Overview</h2>
    <p>Welcome to Scaaf (scaaf.day). By using the Service, you agree to these Terms.</p>

    <h2>2. Eligibility</h2>
    <p>You must be 18 years or older and legally capable of granting Gmail access.</p>

    <h2>3. Use of the Service</h2>
    <ul>
      <li>No unlawful or harmful activities</li>
      <li>No unauthorized system access</li>
      <li>No misuse of Gmail data</li>
    </ul>

    <h2>4. Gmail Access</h2>
    <p>
      By signing in via Google, you authorize Scaaf to read and analyze your Gmail messages.
      We do not send emails on your behalf or access data outside Gmail.
      You may revoke access anytime via:
      <a href="https://myaccount.google.com/permissions" target="_blank">Google Permissions</a>.
    </p>

    <h2>5. AI-Generated Content</h2>
    <p>Summaries may be incomplete or contain errors. They are not professional advice.</p>

    <h2>6. Data Storage</h2>
    <p>We store metadata, summaries, and encrypted OAuth tokens. Raw emails are not permanently stored unless required.</p>

    <h2>7. Payments</h2>
    <p>Some features may require subscription plans.</p>

    <h2>8. Termination</h2>
    <p>We may suspend accounts for violations or suspicious activity.</p>

    <h2>9. Disclaimers</h2>
    <p>Scaaf is provided "as is" without warranties.</p>

    <h2>10. Liability</h2>
    <p>
      We are not responsible for losses resulting from AI results, Gmail API failures, or service downtime.
    </p>

    <h2>11. Governing Law</h2>
    <p>Korean law governs these Terms.</p>

    <h2>12. Contact</h2>
    <p>Email: <strong>support@scaaf.day</strong></p>
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
