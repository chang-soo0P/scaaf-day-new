export default function TermsPage() {
  return (
    <div className="prose mx-auto px-6 py-10">
      <h1>Terms of Service</h1>
      <p>Last updated: [날짜]</p>

      <h2>1. Service Overview</h2>
      <p>
        Scaaf.day provides an AI-powered email summarization and organization tool
        that connects to your Gmail account via Google OAuth.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be legally able to create and use an email account to use this Service.
      </p>

      <h2>3. Account & Security</h2>
      <p>
        We do not store your Google password, Access Token, or Refresh Token.
      </p>

      <h2>4. Acceptable Use</h2>
      <ul>
        <li>No reverse engineering</li>
        <li>No unlawful use</li>
        <li>No service disruption</li>
      </ul>

      <h2>5. Gmail Integration & Permissions</h2>
      <p>
        We store only metadata: gmail_id, subject, from, snippet, summary, actions, user_id, date.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All software, trademarks, and service materials remain our property.
      </p>

      <h2>7. Service Modifications</h2>
      <p>We may modify or discontinue the Service at any time.</p>

      <h2>8. Disclaimer</h2>
      <p>The Service is provided “as is” without warranties.</p>

      <h2>9. Limitation of Liability</h2>
      <p>
        We are not responsible for indirect damages or third-party actions.
      </p>

      <h2>10. Governing Law</h2>
      <p>These Terms are governed by the laws of the Republic of Korea.</p>

    <h2>12. Contact</h2>
    <p>Email: <strong>support@scaaf.day</strong></p>
    </div>
  );
}
